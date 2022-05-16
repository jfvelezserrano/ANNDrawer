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




        let codeMirror = await driver.findElement(By.className("CodeMirror"));


        /* getting the first line of code inside codemirror and clicking it to bring it in focus */
        let codeLine =  (await driver.findElements(By.className("CodeMirror-line"))).at(0);
        codeLine.click();

        setTimeout(() => (""), 2000)

        /* sending keystokes to textarea once codemirror is in focus */
        let txtbx = await codeLine.findElement(By.cssSelector("textarea"));
        txtbx.sendKeys("Hello World");



        //let rotationX = await driver.findElement(By.id('input17'));
        //await rotationX.sendKeys('100')

        setTimeout(() => driver.quit(), 2000)

    } catch (error) {
        console.log(error)
    }
})();