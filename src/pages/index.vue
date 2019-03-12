<template>
  <MainTemplate
    v-if="$store.getters['slack/channels'] && $store.getters['slack/users']"
  />
</template>

<script>
import MainTemplate from '@/containers/mainTemplate'
export default {
  head() {
    return {
      title: 'top',
    }
  },
  components: {
    MainTemplate,
  },
  async asyncData({ store, payload }) {
    if (payload) {
      store.commit('slack/setChannels', payload.channel)
      store.commit('slack/setUsers', payload.users)
      return
    }
    if (store.getters['slack/channels'].length) {
      store.commit('slack/setPage', 'all')
      return
    }
    await store.dispatch('slack/fetchData')
  },
}
</script>
