<template>
  <main-template v-if="$store.getters['slack/channels'] && $store.getters['slack/users']" />
</template>

<script>
import MainTemplate from '~/components/template/mainTemplate'
export default {
  head() {
    return {
      title: 'top'
    }
  },
  components: {
    'main-template': MainTemplate
  },
  async asyncData({ app, store, payload }) {
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
  }
}
</script>
