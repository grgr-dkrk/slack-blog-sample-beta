<template>
  <div class="list">
    <h2>{{ title }}</h2>
    <ul>
      <li
        v-if="firstLink.length"
      >
        <nuxt-link :to="firstLink[0]">{{ firstLink[1] }}</nuxt-link>
      </li>
      <li
        v-for="item in items"
        :key="item.id"
      >
        <nuxt-link :to="`${item.baseURL}${item.id}`">{{ item.name }}</nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
h2 {
  font-size: 18px;
  margin-bottom: 10px;
}
a{
  color: #fff;
  font-size: 16px;
  text-decoration: none;
}
li {
  margin-bottom: 10px;
}
</style>


<script>
export default {
  props: {
    title: {
      type: String,
      default: 'リンク一覧'
    },
    items: {
      type: Array,
      required: true
    },
    firstLink: {
      type: Array,
      default: () => []
    }
  }
}
</script>
