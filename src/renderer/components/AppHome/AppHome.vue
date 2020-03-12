<template>
  <div class="home">
      <form class="home__setting" @submit.prevent="">
          <h2 class="home__setting__title">售票系統</h2>
          <ul class="ul--column">
            <li v-for="(ticket, index) in ticketArr" :key="index">
              <input type="radio" :id="`systemMode-${ticket}`" name="ticketSystem" :value="ticket" v-model="currentTicketSystem" class="ratio--hidden">
                <label :for="`systemMode-${ticket}`" :class="[ticket === currentTicketSystem ? 'label--full label--active' : 'label--full']">
                  <div class="check-radio"></div>
                  <p class="home__setting__text">{{ ticket }}</p>
                </label>
            </li>
          </ul>

          <h2>瀏覽器</h2>
          <ul class="ul--column">
            <li v-for="(browser, index) in browserTypeArr" :key="index">
              <input type="radio" :id="`browser-${browser}`" name="browserType" :value="browser" v-model="currentBrowserType" class="ratio--hidden">
              <label :for="`browser-${browser}`" :class="[browser === currentBrowserType ? 'label--full label--active' : 'label--full']">
                <div class="check-radio"></div>
                <p class="home__setting__text">{{ browser }}</p>
              </label>
            </li>
          </ul>
          <router-link :to="`/buyTicket/tixCraft/${currentBrowserType}`"><button class="btn--default">開啟瀏覽器</button></router-link>
      </form>
  </div>
</template>

<script>
import eventBus from '../../eventBus'
export default {
  name: 'AppHome',
  mounted () {
    eventBus.$emit('onStatusChange', '初始化完成')
  },
  data () {
    return {
      ticketArr: ['kktix', 'tixcraft'],
      currentTicketSystem: 'kktix',
      browserTypeArr: ['brave', 'chrome', 'firefox'],
      currentBrowserType: 'brave'
    }
  }
}
</script>

<style lang="scss">
  .home {
    background-color: #EAC7CC;
    color: #f6f6f6;
    height: 100%;
    width: 50%;
    &__setting {
      display: flex;
      align-items: center;
      flex-direction: column;
      font-size: .16rem;
      &__title {
        margin: .2rem auto .1rem auto;
      }
      &__text {
        margin-left: .05rem;
      }
      & li {
        margin: .2rem auto;
      }
    }
  }
  .check-radio {
    border: .01rem solid #f1f1f1;
    border-radius: 100%;
    height: .15rem;
    width: .15rem;
    &::before {
      margin-top: .04rem;
      margin-left: .04rem;
      content: '';
      display: block;
      border-radius: 100%;
      height: .05rem;
      width: .05rem;
    }
  }
  .ul--column {
    flex-direction: column;
    height: 1.5rem;
  }
  .ratio--hidden {
    display: none;
  }
  .label--full {
    width: 100%;
    display: flex;
    cursor: pointer;
  }
  .label--active {
    color: #ce7d88;
    & .check-radio {
      border-color: #ce7d88;
      &::before {
        background-color: #ce7d88;
      }
    }
  }
  .btn--default {
    outline: none;
    border-radius: .15rem;
    width: .9rem;
    height: .3rem;
    background-color: #f6f6f6;
    border: .02rem solid #ce7d88;
    color: #ce7d88;
    margin: 0 auto;
    &:hover {
      opacity: .8;
    }
    &:active {
      opacity: .6;
    }
  }
  a {
    text-decoration: none;
    color: #ce7d88;
  }
</style>