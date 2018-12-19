const { WebClient } = require('@slack/client')
const Jimp = require('jimp')
const fs = require('fs')
const { promisify } = require('util');
const imagemin = require('imagemin');
const imageminJpegtran = require('imagemin-jpegtran');
const imageminPngquant = require('imagemin-pngquant');

const SLACK_ACCESS_TOKEN = process.env.SLACK_ACCESS_TOKEN
const web = new WebClient(SLACK_ACCESS_TOKEN);

const PATH_IMAGE = `static/uploads/`
const IS_IMAGE_FILE = fileType => ~['jpg', 'png', 'bmp', 'tiff'].indexOf(fileType)

/**
 * get list of all channels data
 */
async function getChannelsData() {
  const res = await web.conversations.list()
  const data = res.channels
    .filter(channel => /blog-/.test(channel.name))
    .map(channel => setChannelData(channel))
  return await Promise.all(data)
}

/**
 * get list of all channels data
 * @return { Object } channelData include entriesData
 */
async function setChannelData(channel) {
  const entries = await web.conversations.history({
    channel: channel.id
  })
  const channelData = setChannelInfo(channel)
  channelData.entries = setChannelEntries(entries.messages, channel.id, channel.name)
  return channelData
}

/**
 * set channel info
 * @return { Object } ChannelInfo
 */
function setChannelInfo(channel) {
  return {
    id: channel.id,
    name: channel.name,
    purpose: channel.purpose.value,
    topic: channel.topic.value
  }
}

/**
 * set list of entries data from a channel
 * @param { Array } messages entries of a channel
 * @param { String } channelId channelID
 * @param { String } channelName channelName
 * @return { Object } EntryData
 */
function setChannelEntries(messages, channelId, channelName) {
  const re_title = /^# (.+)\n/
  const list = messages.filter(message => {
    return message.type === 'message' && !message.subtype
  })
  return list.map(item => {
    let file = ''
    if (item.hasOwnProperty('files') && IS_IMAGE_FILE(item.files[0].filetype)) {
      file = {
        id: item.files[0].id,
        type: item.files[0].filetype,
        title: item.files[0].title,
        url: item.files[0].url_private_download
      }
    }
    return {
      author: item.user,
      channel: channelId,
      channelName: channelName,
      content: item.text.replace(re_title, '').replace(/<http.*slack.com\/files\/.+\/.+\/(.*jpg|.*png|.*bmp|.*tiff|.*gif)>/g, '![](/uploads/$1)'),
      edited: item.hasOwnProperty('edited') ? item.edited.ts : '',
      file: file,
      pinned: item.hasOwnProperty('pinned_to') ? true : false,
      reactions: item.hasOwnProperty('reactions') ? item.reactions.map(reaction => reaction.name) : '',
      starred: item.hasOwnProperty('is_starred') && item.is_starred ? true : false,
      title: (item.text.match(re_title) && item.text.match(re_title)[1]) ||
        (file && file.title) ||
        '無題',
      ts: item.ts,
      upload: item.hasOwnProperty('upload') && item.upload ? true : false
    }
  })
}

/**
 * get list of all users data
 * @return { Object } userData
 */
async function getUsers() {
  const res = await web.users.list()
  const list = res.members.filter(user => {
    return user.name !== 'slackbot' && !user.is_bot && !user.is_app_user
  })
  return list.map(user => {
    return {
      id: user.id,
      name: user.profile.display_name,
      icon: user.profile.image_192.match(/[^/]+$/i),
      color: user.color,
      desc: user.profile.title
    }
  })
}

/**
 * fetch all images from Slack
 */
async function fetchAllImages() {
  const channels = await web.conversations.list()
  const files = await web.files.list()
  const users = await web.users.list()


  const channelList = channels.channels
    .filter(channel => /blog-/.test(channel.name) || /source-/.test(channel.name))
    .map(channel => channel.id)


  // fetch all avatar images
  const data_users = users.members
    .filter(user => user.name !== 'slackbot' && !user.is_bot && !user.is_app_user)
    .map(user => {
      const url = user.profile.image_192
      saveImageData(url, url.match(/[^/]+$/i)[0])
    })

  // fetch all images from entries
  const data_entryFiles = files.files
    .filter(image => IS_IMAGE_FILE(image.filetype))
    .filter(image => new Set([...image.channels, ...channelList]
      .filter(item => image.channels.includes(item) && channelList.includes(item))).size > 0)
    .map(image => saveImageData(image.url_private, image.name))
    return await Promise.all([...data_users, ...data_entryFiles])
}

/**
 * save images
 * @param { String } url - url of the image
 * @param { String } name - filename
 * @return { String } result
 */
async function saveImageData(url, name) {

  // check a file exists
  const path = `${PATH_IMAGE}${name}`
  const res = await promisify(fs.readFile)(path, '').catch(() => false)
  if (res) {
    return `File is exist: ${path}`
  }

  console.log(`File does not exist. Downloading: ${url}`)

  // fetch
  const imageData = await Jimp.read({
    url: url,
    headers: {
      Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`
    }
  }).catch(err => {
    console.log(`error: ${url}`)
    console.log(err)
    return false
  })

  if (!imageData) {
    return `Download Failed: ${path}`
  }

  // resize and write
  if (imageData.bitmap.width >= 961) imageData.resize(960, Jimp.AUTO)
  const buff = await imageData.getBufferAsync(Jimp.AUTO)
  const compressedImage = await imagemin.buffer(buff, {
    plugins: [
      imageminJpegtran(),
      imageminPngquant({ quality: '65-80' })
    ]
  });
  await fs.writeFileSync(path, compressedImage)
  return `Download: ${path}`
}

/**
 * fetch all data(channels, users, and all entries)
 * @return { Object }
 */
async function fetchAllData() {
  const channels = await getChannelsData()
  const users = await getUsers()
  return {
    channels: channels,
    users: users
  }
}

module.exports = {
  getChannelsData,
  getUsers,
  fetchAllImages,
  fetchAllData
}
