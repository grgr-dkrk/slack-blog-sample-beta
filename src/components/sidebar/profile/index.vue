<template>
  <div class="c-profile">
    <h2 class="c-profile__title">
      {{ userData.name }}
    </h2>
    <figure class="c-profile__pict">
      <img :src="srcPath" alt="" />
    </figure>
    <p v-if="userData.desc" class="c-profile__desc">
      {{ userData.desc }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.c-profile {
  display: flex;
  flex-direction: column;
  &__pict {
    order: 0;
    margin-bottom: 10px;
    img {
      width: 100%;
    }
  }
  &__title {
    order: 1;
    font-size: 18px;
    padding-bottom: 0.4em;
  }
  &__desc {
    order: 2;
    font-size: 14px;
  }
}
</style>

<script>
export default {
  props: {
    userData: {
      type: Object,
      required: true,
    },
  },
  computed: {
    srcPath() {
      try {
        return require(`@/static/uploads/${userData.icon}`)
      } catch {
        return require('@/static/no_icon.jpg')
      }
    },
  },
}
</script>
