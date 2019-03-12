<template>
  <aside class="c-sidebar">
    <h1 class="c-sidebar__title">
      <nuxt-link to="/">
        Slack-Blog
      </nuxt-link>
    </h1>
    <Profile class="c-sidebar-profile" />
    <LinkList
      :items="filteredChannels"
      :first-link="['/', '# All']"
      title="カテゴリー"
      class="c-sidebar-linkList"
    />
    <LinkList
      :items="filteredEntries"
      :first-link="[]"
      title="最新記事"
      class="c-sidebar-linkList"
    />
  </aside>
</template>

<style lang="scss" scoped>
.c-sidebar {
  background-color: $mainColor;
  color: #fff;
  padding: 20px;
  &__title {
    margin-bottom: 20px;
    a {
      color: #fff;
      text-decoration: none;
    }
  }
  &-profile {
    margin-bottom: 20px;
  }
  &-linkList {
    padding-bottom: 20px;
    &:last-of-type {
      padding-bottom: 0;
    }
  }
}
</style>

<script>
import Profile from '@/components/sidebar/profile/'
import LinkList from '@/components/sidebar/linkList/'

export default {
  components: {
    Profile,
    LinkList,
  },
  props: {
    channels: {
      type: Array,
      required: true,
    },
    entries: {
      type: Array,
      required: true,
    },
  },
  computed: {
    filteredChannels() {
      return channels.map(channel => ({
        baseURL: '/categories/',
        id: channel.id,
        name: `# ${channel.name}`,
      }))
    },
    entries() {
      return entries.slice(0, 3).map(entry => {
        return {
          baseURL: `/categories/${entry.channel}/`,
          id: `entry-${entry.ts}`,
          name: entry.title,
        }
      })
    },
  },
}
</script>
