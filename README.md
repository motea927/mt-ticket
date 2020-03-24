
# :ticket: mtTicket 自動購票機器人



結合自動辨識驗證碼之購票機器人
(僅供學術研究用途，請勿違法使用。)
(為避免爭議，某些檔案將不會上傳 ex: Model, Train Code ...)

[Demo Video](https://www.youtube.com/watch?v=AwA8RboFUFE)

![image](https://raw.githubusercontent.com/motea927/mtTicket/master/demo/img/demo.jpg)


## :page_facing_up: 技術&框架
- **Python**：用於撰寫機器學習相關程式碼
- **Keras**：用Python編寫且基於TensorFlow開源神經網路庫
- **Electron-vue**：將vue結合於electron之框架，簡化vue使用者開發electron流程
- **Vue-router**：vue之路由系統
- **Sass(Scss)**：CSS預處理器
- **tensorflow/tfjs**：JS版本之TensorFlow
- **selenium-webdriver**：用於控制及自動化操作瀏覽器
- **chromedriver**：讓webdriver控制chrome之必須框架
- **geckodriver**：讓webdriver控制firefox之必須框架
- 
## :pencil2: 功能

1. 自動重新整理網頁
2. 自動化搶票流程
3. 驗證碼辨識


## :coffee: Github不包含檔案

``` bash
# 自行撰寫阻擋非必要元素之擴充插件
static/mtblock.crx
# Brave瀏覽器
static/Brave-Browser/*
# JS Model
static/jsModel/*
```

## 參考
[Keras-Python3.6-captcha](https://github.com/gary9987/Keras-TaiwanHighSpeedRail-captcha)
[selenium-webdriver](https://selenium.dev/selenium/docs/api/javascript/module/selenium-webdriver/)