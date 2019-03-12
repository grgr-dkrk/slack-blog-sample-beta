<template>
  <MainTemplate
    v-if="$store.getters['slack/channels'] && $store.getters['slack/users']"
  />
</template>

<script>
import MainTemplate from '@/containers/mainTemplate'
export default {
  head() {
    const entry = this.$store.getters['slack/entries'].filter(
      entry => entry.ts === this.$route.params.entry.replace('entry-', '')
    )[0]
    return {
      title: entry.title,
    }
  },
  components: {
    MainTemplate,
  },
  async asyncData({ route, store, payload }) {
    if (payload) {
      store.commit('slack/setPage', route.params.entry)
      store.commit('slack/setChannels', payload.channel)
      store.commit('slack/setUsers', payload.users)
      return
    }
    if (store.getters['slack/channels'].length) {
      store.commit('slack/setPage', `${route.params.entry}`)
      return
    }
    await store.dispatch('slack/fetchData', `${route.params.entry}`)
  },
}
</script>
