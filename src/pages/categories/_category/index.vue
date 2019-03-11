<template>
  <main-template
    v-if="$store.getters['slack/channels'] && $store.getters['slack/users']"
  />
</template>

<script>
import MainTemplate from '@/components/template/mainTemplate'
export default {
  head() {
    return {
      title: this.$store.getters['slack/channelInfo']
        ? this.$store.getters['slack/channelInfo'].name
        : '無題',
    }
  },
  components: {
    'main-template': MainTemplate,
  },
  async asyncData({ route, store, payload }) {
    if (payload) {
      store.commit('slack/setPage', route.params.category)
      store.commit('slack/setChannels', payload.channel)
      store.commit('slack/setUsers', payload.users)
      return
    }
    if (store.getters['slack/channels'].length) {
      store.commit('slack/setPage', route.params.category)
      return
    }
    await store.dispatch('slack/fetchData', route.params.category)
  },
}
</script>
