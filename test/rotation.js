const { Builder, By, Actions, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');



(async function openChromeTest() {
  try {
    const service = new chrome.ServiceBuilder('/Users/eduardoivorrasalinas/Desktop/chromedriver');
    const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

    await driver.get('http://127.0.0.1:5501/index.html');
    driver.manage().setTimeouts({ implicit: 3000 })
    driver.manage().window().maximize();


    //EN CASO DE QUE APAREZCAN COOKIES DE GOOGLE -->
    //let cookie = await driver.findElement(By.id('L2AGLb'));
    //cookie.click()


    let preview = await driver.findElement(By.id('rotation'));
    await preview.click()



    //CHANGE MODEL
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    driver.sleep(2000)
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    driver.sleep(2000)
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    driver.sleep(2000)
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    driver.sleep(2000)
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    driver.sleep(2000)
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();


    
    
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('Q').perform();
    
   

    let rotationSettings = await driver.findElement(By.id('rotation__Settings'));
    await rotationSettings.click()
    await rotationSettings.click()
    
    
    //let rotationX = await driver.findElement(By.id('input17'));
    //await rotationX.sendKeys('100')

    setTimeout(() =>  driver.quit(),2000)

  } catch (error) {
    console.log(error)
  }
})();