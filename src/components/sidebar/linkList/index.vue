<template>
  <div class="c-linkList">
    <h2 class="c-linkList__title">
      {{ title }}
    </h2>
    <ul class="c-linkList-list">
      <li v-if="firstLink.length" class="c-linkList-item">
        <nuxt-link :to="firstLink[0]">
          {{ firstLink[1] }}
        </nuxt-link>
      </li>
      <li v-for="item in items" :key="item.id" class="c-linkList-item">
        <nuxt-link :to="`${item.baseURL}${item.id}`">
          {{ item.name }}
        </nuxt-link>
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.c-linkList {
  &__title {
    font-size: 18px;
    margin-bottom: 10px;
  }
  &-item {
    margin-bottom: 10px;
  }
  a {
    color: #fff;
    font-size: 16px;
    text-decoration: none;
  }
}
</style>

<script>
export default {
  props: {
    title: {
      type: String,
      default: 'リンク一覧',
    },
    items: {
      type: Array,
      required: true,
    },
    firstLink: {
      type: Array,
      default: () => [],
    },
  },
}
</script>
