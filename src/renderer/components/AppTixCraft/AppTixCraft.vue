<template>
  <div class="tixCraft">
    <form class="tixCraft__setting" @submit.prevent="">
      <label for="ticketNum"><h2 class="tixCraft__setting__title">購票數量</h2></label>
      <ul class="ul--full">
        <li v-for="i in 4" :key="i">
          <input type="radio" :id="'ticket-num-' + i" name="ticketNum" :value="i" v-model="ticketNum" class="ratio--hidden">
            <label :for="'ticket-num-' + i" :class="[i === ticketNum ? 'label--active' : '', i !== 1 ? 'label--space' : '']">
              <div class="check-radio"></div>
              <p class="tixCraft__setting__text"> {{i}} </p>
            </label>
        </li>
      </ul>
      <label for="keywords"><h2 class="tixCraft__setting__title">關鍵字</h2></label>
      <input type="text" name="keywords" v-model="keywords" placeholder="範例: 黃3F區777" class="input--text">
      <label for="session"><h2 class="tixCraft__setting__title">場次</h2></label>
      <input type="text" name="session" v-model="session" class="input--text" placeholder="範例: 1">
      <button class="btn--default" @click="startBuyTicket">開始搶票</button>
    </form>
  </div>
</template>

<script>
import eventBus from '../../eventBus'
import * as tf from '@tensorflow/tfjs'
export default {
  async created () {
    window.onbeforeunload = (e) => {
      if (this.driver) {
        this.driver.close()
      }
    }
    eventBus.$emit('onStatusChange', '開啟瀏覽器及載入模型中')
    eventBus.$emit('onLoading', true)
    const openBrowser = this.openBrowser()
    const loadModel = this.loadModel()
    await Promise.all([openBrowser, loadModel])
    eventBus.$emit('onLoading', false)
  },
  methods: {
    openBrowser () {
      return new Promise(async (resolve) => {
        const currentBrowserType = this.$route.params.currentBrowserType
        const indexURL = 'https://tixcraft.com'
        // firefox
        if (currentBrowserType === 'firefox') {
          require('geckodriver')
          this.driver = new this.webdriver.Builder()
            .forBrowser('firefox')
            .build()
        // others: chorme or brave
        } else {
          require('chromedriver')
          const stream = require('fs').readFileSync('static/mtblock.crx')
          const base64CRX = Buffer.from(stream).toString('base64')
          const chrome = require('selenium-webdriver/chrome')
          // brave
          if (currentBrowserType === 'brave') {
            this.driver = new this.webdriver.Builder()
              .forBrowser('chrome')
              .setChromeOptions(
                new chrome.Options()
                  .setChromeBinaryPath('static/Brave-Browser/brave-portable.exe')
                  .addExtensions(base64CRX)
              )
              .build()
          // chrome
          } else if (currentBrowserType === 'chrome') {
            this.driver = new this.webdriver.Builder()
              .forBrowser('chrome')
              .setChromeOptions(
                new chrome.Options()
                  .addExtensions(base64CRX)
              )
              .build()
          }
        }
        await this.driver.get(indexURL)
        resolve()
      })
    },
    async loadModel () {
      return new Promise(async (resolve) => {
        this.model = await tf.loadLayersModel('static/jsModel/model.json')
        tf.tidy(() => {
          this.model.predict(tf.zeros([100, 120, 3]).expandDims(0))
          console.log('numTensors (in tidy): ' + tf.memory().numTensors)
        })
        console.log('numTensors (outside tidy): ' + tf.memory().numTensors)
        resolve()
      })
    },
    async predictCaptcha () {
      return new Promise(async (resolve, reject) => {
        const image = new Image()
        image.onload = async () => {
          const canvas = document.createElement('canvas')
          canvas.width = 120
          canvas.height = 100
          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0, 120, 100)
          const imageData = context.getImageData(0, 0, 120, 100)
          const tensor = tf.browser.fromPixels(imageData).div(255.0).toFloat().expandDims(0)
          const prediction = await this.model.predict(tensor)
          let ans = ''
          const ansPR = []
          for (let i = 0; i < 4; i++) {
            ansPR[i] = prediction[i].dataSync()
            ans += this.dic26[ansPR[i].indexOf(Math.max(...ansPR[i]))]
          }
          await this.driver.findElement({id: 'TicketForm_verifyCode'}).sendKeys(ans)
          resolve(ans)
        }
        image.src = this.base64CaptchaImg
      })
    },
    async getCaptcha () {
      const base64Captcha = await this.driver.findElement({id: 'yw0'}).takeScreenshot()
      this.base64CaptchaImg = 'data:image/png;base64,' + base64Captcha
    },
    async submit () {
      let isAgreeExist = await this.checkElementsIsExist({id: 'TicketForm_agree'})
      while (!isAgreeExist) {
        isAgreeExist = await this.checkElementsIsExist({id: 'TicketForm_agree'})
      }
      await this.getCaptcha()
      const enterCatpcha = this.predictCaptcha()
      const selectTicketNum = this.driver.findElement({className: 'mobile-select'}).sendKeys(this.ticketNum)
      const selectAgree = this.driver.findElement({id: 'TicketForm_agree'}).click()
      await Promise.all([enterCatpcha, selectTicketNum, selectAgree])
      this.driver.findElement({id: 'ticketPriceSubmit'}).click()
      this.endTime = new Date().getTime()
      eventBus.$emit('onStatusChange', `搶票完成！ 共花${this.endTime - this.startTime} ms, 搶票網址: ${this.seatURL}`)
    },
    async checkElementsIsExist (checkObject) {
      const buttonCount = await this.driver.findElements(checkObject)
      if (buttonCount.length === 0) {
        return false
      }
      return true
    },
    async selectSeat () {
      eventBus.$emit('onStatusChange', '選取座位區。')
      let isPageLoaded = await this.checkElementsIsExist({className: 'venue-top'})
      while (!isPageLoaded) {
        isPageLoaded = await this.checkElementsIsExist({className: 'venue-top'})
      }
      const isSeatKeyWordsExist = await this.checkElementsIsExist({partialLinkText: this.keywords})
      this.seatURL = await this.driver.getCurrentUrl()
      console.log(this.seatURL)
      if (isSeatKeyWordsExist) {
        eventBus.$emit('onStatusChange', '找到關鍵字，點選關鍵字位置。')
        this.driver.findElement({partialLinkText: this.keywords}).click()
      } else {
        const isHotSaleExist = await this.checkElementsIsExist({partialLinkText: '熱賣中'})
        if (isHotSaleExist) {
          eventBus.$emit('onStatusChange', '找不到關鍵字，點選熱賣中。')
          this.driver.findElement({partialLinkText: '熱賣中'}).click()
        } else {
          eventBus.$emit('onStatusChange', '找不到關鍵字，點選剩餘。')
          this.driver.findElement({partialLinkText: '剩餘'}).click()
        }
      }
    },
    async clickBuyButton () {
      eventBus.$emit('onStatusChange', '重新整理以待搶票...')
      let isBuyButtonExist = await this.checkElementsIsExist({name: this.tagName})
      while (!isBuyButtonExist) {
        this.driver.get(this.gameURL)
        isBuyButtonExist = await this.checkElementsIsExist({name: this.tagName})
      }
      let seatID = await this.driver.findElement({name: this.tagName}).getAttribute('data-href')
      this.seatURL = 'https://tixcraft.com' + seatID
      console.log(this.seatURL)
      this.driver.get(this.seatURL)
    },
    async changeURL () {
      const url = await this.driver.getCurrentUrl()
      this.gameURL = url.replace('detail', 'game')
      await this.driver.get(this.gameURL)
    },
    async startBuyTicket () {
      eventBus.$emit('onStatusChange', '開始搶票，更換網址中。')
      this.tagName = 'yt' + (this.session - 1)
      this.startTime = new Date().getTime()
      await this.changeURL()
      await this.clickBuyButton()
      await this.selectSeat()
      await this.submit()
    }
  },
  data () {
    return {
      webdriver: require('selenium-webdriver'),
      driver: undefined,
      ticketNum: 4,
      keywords: '',
      session: 1,
      model: '',
      gameURL: '',
      tagName: '',
      seatURL: '',
      startTime: '',
      endTime: '',
      base64CaptchaImg: '',
      dic26: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
    }
  }
}
</script>

<style lang="scss">
  .tixCraft {
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
  .ul--full {
    width: 100%;
  }
  .input--text {
    background-color: transparent;
    border: none;
    outline: none;
    padding: .05rem;
    color: #ce7d88;
    border-bottom: .02rem solid rgba(246, 246, 246, 0.5);
    height: .3rem;
    margin-bottom: .1rem;
  }
  .label--space {
    margin-left: .1rem;
  }
</style>
