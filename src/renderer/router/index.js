import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'AppHome',
      component: require('@/components/AppHome/AppHome').default
    },
    {
      path: '/buyTicket/tixCraft/:currentBrowserType',
      name: 'AppTixCraft',
      component: require('@/components/AppTixCraft/AppTixCraft').default
    },
    {
      path: '/buyTicket/kktix/:currentBrowserType',
      name: 'AppKKtix',
      component: require('@/components/AppKKtix/AppKKtix').default
    }
  ]
})
