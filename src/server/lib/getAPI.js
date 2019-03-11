const { WebClient } = require('@slack/client')
const Jimp = require('jimp')
const fs = require('fs')
const { promisify } = require('util')
const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminPngquant = require('imagemin-pngquant')
require('dotenv').config()

const SLACK_ACCESS_TOKEN = process.env[process.env.API_TOKEN_VARIABLE]
const web = new WebClient(SLACK_ACCESS_TOKEN)

const PATH_IMAGE = `@/static/uploads/`
const IS_IMAGE_FILE = fileType =>
  ~['jpg', 'png', 'bmp', 'tiff'].indexOf(fileType)

/**
 * get list of all channels data
 */
async function getChannelsData() {
  const res = await web.conversations.list()
  const data = res.channels.reduce((list, channel) => {
    if (/blog-/.test(channel.name)) {
      list.push(setChannelData(channel))
    }
    return list
  }, [])
  return await Promise.all(data)
}

/**
 * get list of all channels data
 * @return { Object } channelData include entriesData
 */
async function setChannelData(channel) {
  const entries = await web.conversations.history({
    channel: channel.id,
  })
  const channelData = setChannelInfo(channel)
  channelData.entries = setChannelEntries(
    entries.messages,
    channel.id,
    channel.name
  )
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
    topic: channel.topic.value,
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
  return messages.reduce((list, message) => {
    if (message.type === 'message' && !message.subtype) {
      list.push(setEntryData(message, channelId, channelName))
    }
    return list
  }, [])
}

/**
 * set an entry data
 * @param { Object } entry
 * @return { Object } EntryData
 */
function setEntryData(entry, channelId, channelName) {
  const re_title = /^# (.+)\n/
  let file = ''
  if (entry.hasOwnProperty('files') && IS_IMAGE_FILE(entry.files[0].filetype)) {
    file = {
      id: entry.files[0].id,
      type: entry.files[0].filetype,
      title: entry.files[0].title,
      url: entry.files[0].url_private_download,
    }
  }
  return {
    author: entry.user,
    channel: channelId,
    channelName: channelName,
    content: entry.text
      .replace(re_title, '')
      .replace(
        /<http.*slack.com\/files\/.+\/.+\/(.*jpg|.*png|.*bmp|.*tiff|.*gif)>/g,
        '![](/uploads/$1)'
      ),
    edited: entry.hasOwnProperty('edited') ? entry.edited.ts : '',
    file: file,
    pinned: entry.hasOwnProperty('pinned_to') ? true : false,
    reactions: entry.hasOwnProperty('reactions')
      ? entry.reactions.map(reaction => reaction.name)
      : '',
    starred:
      entry.hasOwnProperty('is_starred') && entry.is_starred ? true : false,
    title:
      (entry.text.match(re_title) && entry.text.match(re_title)[1]) ||
      (file && file.title) ||
      '無題',
    ts: entry.ts,
    upload: entry.hasOwnProperty('upload') && entry.upload ? true : false,
  }
}

/**
 * get list of all users data
 * @return { Object } userData
 */
async function getUsers() {
  const res = await web.users.list()
  return res.members.reduce((list, user) => {
    if (user.name !== 'slackbot' && !user.is_bot && !user.is_app_user) {
      list.push(setUserData(user))
    }
    return list
  }, [])
}

/**
 * set user data
 * @return { Object } userData
 */
function setUserData(user) {
  return {
    id: user.id,
    name: user.profile.display_name,
    icon: user.profile.image_192.match(/[^/]+$/i),
    color: user.color,
    desc: user.profile.title,
  }
}

/**
 * fetch all images from Slack
 */
async function fetchAllImages() {
  const channels = await web.conversations.list()
  const files = await web.files.list()
  const users = await web.users.list()

  const channelList = channels.channels.reduce((list, channel) => {
    if (/blog-/.test(channel.name) || /source-/.test(channel.name)) {
      list.push(channel.id)
    }
    return list
  }, [])

  const data_users = users.members.reduce((list, user) => {
    if (user.name !== 'slackbot' && !user.is_bot && !user.is_app_user) {
      list.push(user)
      const url = user.profile.image_192
      saveImageData(url, url.match(/[^/]+$/i)[0])
    }
    return list
  }, [])

  // fetch all images from entries
  const data_entryFiles = files.files
    .filter(image => IS_IMAGE_FILE(image.filetype))
    .filter(
      image =>
        new Set(
          [...image.channels, ...channelList].filter(
            item => image.channels.includes(item) && channelList.includes(item)
          )
        ).size > 0
    )
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
  const path = `${PATH_IMAGE}${name}`
  const res = await getFileExists(path)
  if (res) {
    return `File is exist: ${path}`
  }

  console.log(`File does not exist. Downloading: ${url}`)

  // fetch
  const imageData = await Jimp.read({
    url: url,
    headers: {
      Authorization: `Bearer ${SLACK_ACCESS_TOKEN}`,
    },
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
    plugins: [imageminJpegtran(), imageminPngquant({ quality: '65-80' })],
  })
  await fs.writeFileSync(path, compressedImage)
  return `Download: ${path}`
}

/**
 * check a file exists
 * @return { Boolean }
 */
async function getFileExists(path) {
  const res = await promisify(fs.readFile)(path, '').catch(() => false)
  return res ? true : false
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
    users: users,
  }
}

module.exports = {
  getChannelsData,
  setChannelData,
  setChannelInfo,
  setChannelEntries,
  setEntryData,
  getUsers,
  setUserData,
  fetchAllImages,
  saveImageData,
  getFileExists,
  fetchAllData,
}
