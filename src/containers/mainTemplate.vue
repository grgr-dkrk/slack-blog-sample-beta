<template>
  <div class="container">
    <Sidebar :class="{ 'is-active': isDrawerOpen }" class="sidebar" />
    <div class="articleList">
      <Entries />
    </div>
    <button
      :class="{ 'is-active': isDrawerOpen }"
      aria-label="drawer"
      class="openDrawer"
      @click="toggleIsDrawerOpen()"
    >
      <span role="presentation" />
      <span role="presentation" />
      <span role="presentation" />
    </button>
  </div>
</template>

<style lang="scss" scoped>
.container {
  height: 100vh;
  display: flex;
  justify-content: space-between;
}
.openDrawer {
  display: none;
  @include media_query($md) {
    display: block;
    position: fixed;
    top: 24px;
    right: 24px;
    width: 38px;
    height: 24px;
    span {
      display: block;
      width: 100%;
      height: 100%;
      background-color: #999;
      content: '';
      display: block;
      height: 4px;
      width: 100%;
      transition: all 0.3s ease-in;
      position: absolute;
      &:first-child {
        top: 0;
      }
      &:nth-child(2) {
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
      }
      &:last-child {
        bottom: 0;
      }
    }
    &.is-active span {
      &:first-child {
        transform: rotate(-45deg);
        top: 10px;
      }
      &:nth-child(2) {
        width: 0;
        opacity: 0;
      }
      &:last-child {
        transform: rotate(45deg);
        bottom: 10px;
      }
    }
  }
}
.sidebar {
  overflow: auto;
  width: 280px;
  -webkit-overflow-scrolling: touch;
  @include media_query($md) {
    position: fixed;
    top: 0;
    height: 100%;
    width: 280px;
    left: -100%;
    transition: left 0.3s ease-in;
    z-index: 100;
    &.is-active {
      left: 0;
    }
  }
}
.articleList {
  padding: 40px 20px 0;
  overflow: auto;
  width: calc(100% - 280px);
  -webkit-overflow-scrolling: touch;
  @include media_query($md) {
    padding: 20px 10px;
    width: 100%;
  }
}
</style>

<script>
import Sidebar from '@/components/sidebar'
import Entries from '@/components/entries/'
import { mapState } from 'vuex'

export default {
  components: {
    Sidebar,
    Entries,
  },
  data() {
    return {
      isDrawerOpen: false,
    }
  },
  methods: {
    toggleIsDrawerOpen() {
      this.isDrawerOpen = this.isDrawerOpen ? false : true
    },
  },
}
</script>
