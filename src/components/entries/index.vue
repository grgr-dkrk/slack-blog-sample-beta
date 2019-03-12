<template>
  <main class="c-entries">
    <CategoryInfo class="c-entries-categoryInfo" />
    <EntryItem
      v-for="entry in filteredEntries"
      :key="entry.id"
      :data="entry"
      :class="{
        'is-pinned': entry.pinned,
        'is-starred': entry.starred,
      }"
      class="c-entries-item"
    />
  </main>
</template>

<style lang="scss" scoped>
.c-entries {
  display: block;
  height: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  &-categoryInfo {
    margin-bottom: 40px;
    order: 0;
  }
  &-item {
    padding-bottom: 60px;
    margin-bottom: 60px;
    order: 2;
    &.is-pinned {
      order: 1;
    }
  }
}
</style>

<script>
import CategoryInfo from '@/components/articles/categoryInfo'
import EntryItem from '@/components/articles/entry/'
export default {
  props: {
    channels: {
      type: Array,
      required: true,
    },
    entries: {
      type: Array,
      required: true,
    },
    page: {
      type: String,
      required: true,
    }
  },
  components: {
    CategoryInfo,
    EntryItem,
  },
  computed: {
    filteredEntries() {
      // page all
      if (this.page === 'all') {
        return this.entries
      }
      // page entry
      if (/^entry-/.test(this.page)) {
        return this.entries.filter(
          entry =>
            entry.ts === this.page.replace('entry-', '')
        )
      }
      // page category
      return this.channels.filter(
        channel => channel.id === this.page
      )[0].entries
    },
  },
}
</script>
