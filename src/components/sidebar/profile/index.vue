<template>
  <div class="wrap">
    <h2>{{ user.name }}</h2>
    <figure>
      <img :src="srcPath" alt="" />
    </figure>
    <p v-if="user.desc">
      {{ user.desc }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.wrap {
  display: flex;
  flex-direction: column;
}
figure {
  order: 0;
  margin-bottom: 10px;
  img {
    width: 100%;
  }
}
h2 {
  order: 1;
  font-size: 18px;
  padding-bottom: 0.4em;
}
p {
  order: 2;
  font-size: 14px;
}
</style>

<script>
export default {
  computed: {
    user() {
      return this.$store.getters['slack/users'][0]
    },
    srcPath() {
      try {
        return require(`@/static/uploads/${
          this.$store.getters['slack/users'][0].icon
        }`)
      } catch {
        return require('@/static/no_icon.jpg')
      }
    },
  },
}
</script>
