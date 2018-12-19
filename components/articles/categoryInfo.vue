<template>
  <section>
    <h2>{{ $store.getters['slack/channelInfo'] ? `# ${$store.getters['slack/channelInfo'].name}` : '# Slack-Blog-Sample' }}</h2>
    <p>{{ $store.getters['slack/channelInfo'] ? $store.getters['slack/channelInfo'].purpose : 'Slackでブログ' }}</p>
  </section>
</template>

