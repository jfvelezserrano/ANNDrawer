const { Builder } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');



(async function openChromeTest() {
  try {
    const service = new chrome.ServiceBuilder('/Users/eduardoivorrasalinas/Desktop/chromedriver');
    const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

    await driver.get('http://127.0.0.1:5501/index.html');
    driver.manage().setTimeouts({ implicit: 3000 })
    driver.manage().window().maximize();
    setTimeout(() =>  driver.quit(),2000)
} catch (error) {
    console.log(error)
}
})();