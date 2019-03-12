import getAPI from '@/server/lib/getAPI.js'
import mockData from './mock.json'
const { WebClient } = require('@slack/client')
require('dotenv').config()
const slackMock = require('slack-mock')

const SLACK_ACCESS_TOKEN = process.env[process.env.API_TOKEN_VARIABLE]
const web = new WebClient(SLACK_ACCESS_TOKEN)

describe('TOKEN', () => {
  it('token is available', async () => {
    expect.assertions(1)
    const res = await web.auth.test()
    expect(res.ok).toBe(true)
  })
})

describe('getAPI', () => {
  beforeEach(() => {
    slackMock().web.addResponse({
      url: 'https://slack.com/api/conversations.list',
      status: 200,
      body: mockData.conversationsList,
    })
    slackMock().web.addResponse({
      url: 'https://slack.com/api/conversations.history',
      status: 200,
      body: mockData.conversationsHistory,
    })
    slackMock().web.addResponse({
      url: 'https://slack.com/api/users.list',
      status: 200,
      body: mockData.usersList,
    })
    slackMock().web.addResponse({
      url: 'https://slack.com/api/files.list',
      status: 200,
      body: mockData.filesList,
    })
  })

  afterEach(() => {
    slackMock().rtm.stopServer(SLACK_ACCESS_TOKEN)
  })

  it('test getChannelsMethod', async () => {
    const res = await getAPI.getChannelsData()
    expect.assertions(1)
    expect(res.length).toBeGreaterThanOrEqual(1)
  })

  it('test getUsersMethod', async () => {
    const res = await getAPI.getUsers()
    expect.assertions(1)
    expect(res.length).toBeGreaterThanOrEqual(1)
  })

  it('test Files', async () => {
    const res = await getAPI.fetchAllImages()
    expect.assertions(1)
    expect(res.length).toBeGreaterThanOrEqual(1)
  })

  it('SaveImage', async () => {
    const res = await getAPI.saveImageData(
      'https://via.placeholder.com/10/fff.png',
      'fff.png'
    )
    expect.assertions(1)
    expect(res).toBeTruthy()
  })

  it('image is Exist', async () => {
    const res = await getAPI.getFileExists('@/static/uploads/fff.png')
    expect.assertions(1)
    expect(res).toBe(true)
  })

  it('image is not Exist', async () => {
    const res = await getAPI.getFileExists(
      '@/static/uploads/fffButDummyFIle.png'
    )
    expect.assertions(1)
    expect(res).toBe(false)
  })

  describe('Entry: has_catchImage', () => {
    const res = getAPI.setEntryData(mockData.entry_hasImageData)
    it('has image url', () => {
      expect(res.file.hasOwnProperty('url')).toBe(true)
    })
    it('upload is true', () => {
      expect(res.upload).toBe(true)
    })
  })

  describe('Entry: normal_text', () => {
    const res = getAPI.setEntryData(mockData.entry_noImageData)
    it('upload is false', () => {
      expect(res.upload).toBeFalsy()
    })
  })

  it('test: fetchAllData', async () => {
    const res = await getAPI.fetchAllData()
    expect.assertions(2)
    expect(res.channels.length).toBeGreaterThanOrEqual(1)
    expect(res.users.length).toBeGreaterThanOrEqual(1)
  })
})
