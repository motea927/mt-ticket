<template>
  <div class="status">
      <h1 class="status__title">mtTicket</h1>
      <img src="../../assets/cover--img.jpg" alt="" class="status__img">
      <p class="status__text">{{ status }}</p>
      <img src="../../assets/log.png" @click="openDev" alt="setting" class="status__devimg">
  </div>
</template>

<script>
import eventBus from '../../eventBus'
export default {
  name: 'AppStatus',
  mounted () {
    eventBus.$on('onStatusChange', this.onStatusChange)
  },
  data () {
    return {
      status: '初始化中'
    }
  },
  methods: {
    openDev () {
      const remote = require('electron').remote
      remote.getCurrentWebContents().openDevTools({mode: 'detach'})
    },
    onStatusChange (newStatus) {
      this.status = newStatus
    }
  }
}
</script>

<style lang="scss">
  .status {
    padding: .1rem;
    align-items: center;
    display: flex;
    flex-direction: column;
    width: 50%;
    height: 100%;
    background-color: #f6f6f6;
    color: #8E9AAF;
    &__title {
      font-size: .4rem;
      margin: .6rem;
    }
    &__img {
      height: 1.2rem;
      width: 1.2rem;
      margin: .2rem;
      opacity: .7;
    }
    &__text {
      font-size: .16rem;
      margin: .6rem;
    }
    &__devimg {
      height: .25rem;
      width: auto;
    }
  }
</style>