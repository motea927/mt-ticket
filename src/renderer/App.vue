<template>
  <div id="app">
    <app-loading v-show="isLoading"></app-loading>
    <app-title-bar></app-title-bar>
    <div class="container">
      <app-status></app-status>
      <router-view></router-view>
    </div>
    
  </div>
</template>

<script>
  import AppTitleBar from './components/AppTitleBar.vue/AppTitleBar'
  import AppStatus from './components/AppStatus/AppStatus'
  import AppLoading from './components/AppLoading/AppLoading'
  import eventBus from './eventBus'
  export default {
    name: 'mt-ticket',
    components: {
      AppTitleBar,
      AppStatus,
      AppLoading
    },
    mounted () {
      eventBus.$on('onLoading', this.onLoading)
    },
    data () {
      return {
        isLoading: false
      }
    },
    methods: {
      onLoading (newIsLoading) {
        this.isLoading = newIsLoading
      }
    }
  }
</script>

<style>
  /* CSS */
  /* 
   * 1rem = 100px
   * .1rem = 10px
  */
  html {
    font-size: 625%;
  }
  html, body, #app{
    width: 100%;
    height: 100%;
    font-family: "Helvetica", "Arial","LiHei Pro","黑體-繁","微軟正黑體", sans-serif;
    border-radius: .05rem;
  }
  .container {
    background-color: white;
    height: calc(100% - .3rem);
    width: 100%;
    display: flex;
  }
</style>
