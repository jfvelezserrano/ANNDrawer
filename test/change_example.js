const { Builder, By, Actions, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');



(async function openChromeTest() {
  try {
    const service = new chrome.ServiceBuilder('/Users/eduardoivorrasalinas/Desktop/chromedriver');
    const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

    await driver.get('http://127.0.0.1:5501/index.html');
    driver.manage().setTimeouts({ implicit: 3000 })
    driver.manage().window().maximize();


    //CHANGE MODEL
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    setTimeout(() =>   driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform(),2000) 
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();

    setTimeout(() =>  driver.quit(),2000)    
  } catch (error) {
    console.log(error)
  }
})();





