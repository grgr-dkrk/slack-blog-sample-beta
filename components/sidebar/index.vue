<template>
  <aside>
    <h1>
      <nuxt-link to="/">Slack-Blog</nuxt-link>
    </h1>
    <profile class="profile" />
    <link-list
      :items="channels"
      :first-link="['/', '# All']"
      title="カテゴリー"
      class="linkList"
    />
    <link-list
      :items="entries"
      :first-link="[]"
      title="最新記事"
      class="linkList"
    />
  </aside>
</template>

<style lang="scss" scoped>
aside {
  background-color: $mainColor;
  color: #fff;
  padding: 20px;
  h1 {
    margin-bottom: 20px;
  }
  h1 a{
    color: #fff;
    text-decoration: none;
  }
  .profile {
    margin-bottom: 20px;
  }
  .linkList {
    padding-bottom: 20px;
    &:last-child {
      padding-bottom: 0;
    }
  }
}
</style>

<script>
import profile from '~/components/sidebar/profile/'
import linkList from '~/components/sidebar/linkList/'

export default {
  components: {
    profile,
    'link-list': linkList
  },
  computed: {
    channels() {
      return this.$store.getters['slack/channels'].map(channel => ({
        baseURL: '/categories/',
        id: channel.id,
        name: `# ${channel.name}`
      }))
    },
    entries() {
      return this.$store.getters['slack/entries'].slice(0, 3).map(entry => {
        return {
          baseURL: `/categories/${entry.channel}/`,
          id: `entry-${entry.ts}`,
          name: entry.title
        }
      })
    }
  }
}
</script>
