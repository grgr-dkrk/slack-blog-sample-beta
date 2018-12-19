<template>
  <main>
    <category-info class="categoryInfo" />
    <entry
      v-for="entry in entries"
      :key="entry.id"
      :data="entry"
      :class="{
        'is-pinned': entry.pinned,
        'is-starred': entry.starred
      }"
      class="entry"
    />
  </main>
</template>

<style lang="scss" scoped>
main {
  display: block;
  height: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
}
.entry {
  padding-bottom: 60px;
  margin-bottom: 60px;
  order: 2;
  &.is-pinned {
    order: 1
  }
}
.categoryInfo {
  margin-bottom: 40px;
  order: 0;
}
</style>


<script>
import categoryInfo from '~/components/articles/categoryInfo'
import entry from '~/components/articles/entry/'
export default {
  components: {
    'category-info': categoryInfo,
    entry
  },
  computed: {
    entries() {
      // page all
      if (this.$store.getters['slack/page'] === 'all') {
        return this.$store.getters['slack/entries']
      }
      // page entry
      if (/^entry-/.test(this.$store.getters['slack/page'])) {
        return this.$store.getters['slack/entries'].filter(entry => (
          entry.ts === this.$store.getters['slack/page'].replace('entry-', '')
        ))
      }
      // page category
      return this.$store.getters['slack/channels'].filter(channel => (
        channel.id === this.$store.getters['slack/page']
      ))[0].entries
    }
  }
}
</script>
