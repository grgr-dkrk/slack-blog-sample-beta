export const state = () => ({
  page: '',
  channels: [],
  users: [],
})

export const mutations = {
  setPage(state, page) {
    state.page = page
  },
  setChannels(state, channels) {
    state.channels = channels
  },
  setUsers(state, users) {
    state.users = users
  },
}

export const getters = {
  page: state => state.page,
  channelInfo: (state, getters) => {
    return getters.channels.filter(channel => {
      return channel.id === getters.page
    })[0]
  },
  channels: state => state.channels,
  entries: (state, getters) => {
    const arr = []
    getters.channels
      .map(channel => channel.entries)
      .forEach(channel => {
        channel.forEach(items => arr.push(items))
      })
    return arr.sort((a, b) => (a.ts < b.ts ? 1 : -1))
  },
  users: state => state.users,
}

export const actions = {
  async fetchData({ commit }, id) {
    const res = await this.$axios.get(`fetchAllData/`)
    commit('setChannels', res.data.channels)
    commit('setUsers', res.data.users)
    commit('setPage', id || 'all')
  },
}
