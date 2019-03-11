<template>
  <article v-if="!(page === 'all' && data.pinned)">
    <header>
      <h1 v-if="title">
        <nuxt-link :to="`/categories/${data.channel}/entry-${data.ts}`">
          {{ title }}
          <span v-if="data.pinned">{{ emoji('pushpin') }}</span>
        </nuxt-link>
      </h1>
      <time>投稿: {{ time }}</time>
      <time v-if="edited">更新: {{ edited }}</time>
    </header>
    <figure v-if="src">
      <img :src="src" alt="" />
    </figure>
    <div class="md-content" v-html="$md.render(content)" />
    <footer>
      <p>author: {{ $store.getters['slack/users'][0].name }}</p>
      <p>
        category:
        <nuxt-link :to="`/categories/${data.channel}`">
          #{{ data.channelName }}
        </nuxt-link>
      </p>
      <ul v-if="data.reactions" class="reactions">
        <li
          v-for="(reaction, index) in data.reactions"
          :key="index"
          class="reactionsItem"
        >
          {{ emoji(reaction) }}
        </li>
      </ul>
    </footer>
  </article>
</template>

<style lang="scss" scoped>
header {
  padding-bottom: 25px;
  h1 {
    border-bottom: 1px solid #ccc;
    padding-bottom: 10px;
    margin-bottom: 10px;
    font-size: 30px;
    letter-spacing: #{(30 / 1000)}em;
    a {
      color: #000;
    }
    @include media_query($md) {
      font-size: 24px;
    }
  }
  time {
    color: #777;
    display: block;
    font-size: 14px;
  }
}
.reactions {
  display: flex;
  padding-top: 10px;
  li {
    background-color: #f4f8fb;
    border: 1px solid #b8d1e5;
    border-radius: 4px;
    padding: 4px;
    font-size: 21px;
    letter-spacing: -0.1em;
    line-height: 1;
    &:nth-child(n + 2) {
      margin-left: 5px;
    }
  }
}
figure {
  margin-bottom: 20px;
}
img {
  max-width: 100%;
}
footer {
  color: #777;
  font-size: 14px;
}
</style>

<style lang="scss">
.md-content {
  padding-bottom: 20px;
  line-height: 1.6;
  > * {
    margin-bottom: 10px;
  }
  h1,
  h2 {
    margin-top: 40px;
    padding-left: 0.6em;
    position: relative;
    font-size: 23px;
    margin-bottom: 14px;
    @include media_query($md) {
      font-size: 18px;
    }
    &:first-child {
      margin-top: 0;
    }
    &:after {
      background-color: #d90f5d;
      content: '';
      display: block;
      left: 0;
      height: 100%;
      position: absolute;
      width: 6px;
      top: 0;
    }
  }
  h3 {
    margin-top: 30px;
    @include media_query($md) {
      font-size: 16px;
    }
  }
  a {
    color: #08c;
    text-decoration: none;
    &:visited {
      color: #0576b9;
    }
  }
  p,
  li,
  a {
    font-size: 18px;
    @include media_query($md) {
      font-size: 16px;
    }
  }
  p + p {
    padding-top: 10px;
  }
  p + pre {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  p > img {
    margin-top: 20px;
    margin-bottom: 10px;
  }
  table {
    border-collapse: collapse;
    * {
      border: 1px solid #ccc;
    }
    th,
    td {
      padding: 20px;
    }
    th {
      background-color: #eee;
    }
  }
  ul {
    li {
      padding-left: 1em;
      &:before {
        margin-left: -1em;
        content: '-';
        counter-increment: section;
        font-weight: bold;
      }
    }
  }
  ol {
    list-style-type: none;
    counter-reset: section;
    li {
      padding-left: 1em;
      &:before {
        margin-left: -1em;
        content: counter(section) '. ';
        counter-increment: section;
        font-weight: bold;
      }
    }
  }
}
</style>

<script>
import dayjs from 'dayjs'
import emojis from 'emojis'

export default {
  transitions: 'appear',
  props: {
    data: {
      type: Object,
      required: true,
    },
  },
  computed: {
    page() {
      return this.$store.getters['slack/page']
    },
    title() {
      return this.data.title
    },
    content() {
      return this.data.content
    },
    time() {
      return dayjs.unix(this.data.ts).format('YYYY/MM/DD (ddd) HH:mm')
    },
    edited() {
      if (!this.data.edited) return false
      return dayjs.unix(this.data.edited).format('YYYY/MM/DD (ddd) HH:mm')
    },
    src() {
      if (this.data.file && this.data.upload)
        return `/uploads/${this.data.file.url.match(/[^/]+$/i)}`
      return false
    },
  },
  methods: {
    emoji(emoji) {
      return emojis.unicode(emoji)
    },
  },
}
</script>
