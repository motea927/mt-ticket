<template>
  <div class="kkTix">
    <form class="kkTix__setting" @submit.prevent="">
      <label for="ticketNum"><h2 class="kkTix__setting__title">購票數量</h2></label>
      <ul class="ul--full">
        <li v-for="i in 4" :key="i">
          <input type="radio" :id="'ticket-num-' + i" name="ticketNum" :value="i" v-model="ticketNum" class="ratio--hidden">
            <label :for="'ticket-num-' + i" :class="[i === ticketNum ? 'label--active' : '', i !== 1 ? 'label--space' : '']">
              <div class="check-radio"></div>
              <p class="kkTix__setting__text"> {{i}} </p>
            </label>
        </li>
      </ul>
      <label for="keywords"><h2 class="kkTix__setting__title">關鍵字</h2></label>
      <input type="text" name="keywords" v-model="keywords" placeholder="範例: TWD$2,300" class="input--text">
      <button class="btn--default" @click="startBuyTicket">開始搶票</button>
    </form>
  </div>
</template>

<script>
import eventBus from '../../eventBus'
export default {
  async created () {
    window.onbeforeunload = (e) => {
      if (this.driver) {
        this.driver.close()
      }
    }
    eventBus.$emit('onStatusChange', '開啟瀏覽器中')
    eventBus.$emit('onLoading', true)
    await this.openBrowser()
    eventBus.$emit('onStatusChange', '瀏覽器開啟完成')
    eventBus.$emit('onLoading', false)
  },
  methods: {
    openBrowser () {
      return new Promise(async (resolve) => {
        const currentBrowserType = this.$route.params.currentBrowserType
        const indexURL = 'https://kktix.com/'
        // firefox
        if (currentBrowserType === 'firefox') {
          require('geckodriver')
          this.driver = new this.webdriver.Builder()
            .forBrowser('firefox')
            .build()
        // others: chorme or brave
        } else {
          require('chromedriver')
          const chrome = require('selenium-webdriver/chrome')
          // brave
          if (currentBrowserType === 'brave') {
            this.driver = new this.webdriver.Builder()
              .forBrowser('chrome')
              .setChromeOptions(
                new chrome.Options()
                  .setChromeBinaryPath('static/Brave-Browser/brave-portable.exe')
              )
              .build()
          // chrome
          } else if (currentBrowserType === 'chrome') {
            this.driver = new this.webdriver.Builder()
              .forBrowser('chrome')
              .build()
          }
        }
        await this.driver.get(indexURL)
        resolve()
      })
    },
    async checkElementsIsExist (checkObject) {
      const buttonCount = await this.driver.findElements(checkObject)
      if (buttonCount.length === 0) {
        return false
      }
      return true
    },
    async clickBuyButton () {
      const url = await this.driver.getCurrentUrl()
      eventBus.$emit('onStatusChange', '重新整理以待搶票...')
      let isBuyButtonExist = await this.checkElementsIsExist({xpath: `//span[contains(text(),'${this.keywords}')]//parent::span//parent::span/following-sibling::span/child::button/following::input`})
      while (!isBuyButtonExist) {
        this.driver.get(url)
        let isPageLoaded = await this.checkElementsIsExist({className: 'ticket-price'})
        while (!isPageLoaded) {
          isPageLoaded = await this.checkElementsIsExist({className: 'ticket-price'})
        }
        isBuyButtonExist = await this.checkElementsIsExist({xpath: `//span[contains(text(),'${this.keywords}')]//parent::span//parent::span/following-sibling::span/child::button/following::input`})
      }
    },
    async submit () {
      eventBus.$emit('onStatusChange', '輸入票數')
      const enterTicketNum = this.driver.findElement({xpath: `//span[contains(text(),'${this.keywords}')]//parent::span//parent::span/following-sibling::span/child::button/following::input`}).sendKeys(this.ticketNum)
      // 勾選同意
      eventBus.$emit('onStatusChange', '勾選同意')
      const clickAgree = this.driver.findElement({id: 'person_agree_terms'}).click()
      await Promise.all([enterTicketNum, clickAgree])
      const btnArr = await this.driver.findElements({className: 'btn-primary'})
      const btnLength = btnArr.length - 1
      btnArr[btnLength].click()
      eventBus.$emit('onStatusChange', '搶票完成')
    },
    async startBuyTicket () {
      await this.clickBuyButton()
      await this.submit()
    }
  },
  data () {
    return {
      webdriver: require('selenium-webdriver'),
      driver: undefined,
      ticketNum: 4,
      keywords: ''
    }
  }
}
</script>

<style lang="scss">
  .kkTix {
    padding: .1rem;
    background-color: #EAC7CC;
    color: #f6f6f6;
    height: 100%;
    width: 50%;
    &__setting {
      display: flex;
      align-items: left;
      flex-direction: column;
      font-size: .16rem;
      width: 40%;
      margin: .4rem auto;
      &__title {
        align-self: left;
        margin: .2rem 0 .1rem;
      }
      &__text {
        margin-left: .05rem;
      }
      & li {
        margin: .1rem auto;
        display: inline-block;
      }
      & label {
        display: flex;
        cursor: pointer;
      }
    }
  }
</style>