const { Builder, By, Actions, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');



(async function openChromeTest() {
  try {
    const service = new chrome.ServiceBuilder('/Users/eduardoivorrasalinas/Desktop/chromedriver');
    const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

    await driver.get('http://127.0.0.1:5501/index.html');
    driver.manage().setTimeouts({ implicit: 3000 })
    driver.manage().window().maximize();

    let preview = await driver.findElement(By.id('rotation'));
    await preview.click()



    //CHANGE MODEL
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();
    await driver.actions().keyDown(Key.CONTROL).keyDown(Key.SHIFT).sendKeys('H').perform();


    //MOVIMIENTO EN 100PX PARA X Y 100PX PARA Y 
    let preview2 = await driver.findElement(By.tagName('body'));
    await preview2.click()

    let tryRotation = await driver.findElement(By.id('svgImage'));
    await tryRotation.click()
    await driver.actions().dragAndDrop(tryRotation, { x: 100, y: 100 }).perform()

    setTimeout(() =>  driver.quit(),2000)   
    
  } catch (error) {
    console.log(error)
  }
})();





