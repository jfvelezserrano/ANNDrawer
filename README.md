# ANN Drawer - Eduardo Ivorra Salinas

## Collaborators - Marcos Ruiz Muñoz and José F. Vélez Serrano

## Index ✒️
1. [Description 🚀](#description)
2. [User Interface 🎨](#ui)
3. [Keyboard shortcuts ⌨️](#shortcuts)
4. [Tests 💻](#tests)

<a name="description"></a>
 # Description
<p align="justify">
    ANN Drawer is a new and improved version of the application <a href="https://neuropaint.github.io/">Neuropaint</a> created by Marcos Ruiz Muñoz. Test this new version with a new interface, prove the new features and enjoy with all the possibilities that are in the app! 
</p>

This new app has been updated with two different versions. 
To get the version 2.0 type on your terminal: 

 ```
git clone https://github.com/jfvelezserrano/ANNDrawer.git
cd ANNDrawer
git checkout eb03ce7647a2d5567dfbbccabab0029c71aac06f
 ```
 
However, if you want to get the last updated version here is the new link <a href="https://jfvelezserrano.github.io/ANNDrawer">ANN Drawer</a>!!

<a name="ui"></a>
# User Interface
<p align="justify">
 
 The interface has changed a lot from the last version. With this new app, everything takes a minimalist touch, letting the user focus on the SVG. Furthermore, the app gets a look more profesional and the new features like the rotation with the mouse or the movement for the terminal gives to the user a better experience. 
 The app has some new buttons for the new features. These are them and their description.
</p>

 ## Night Mode

 <p>
    A new mode has been added to the app, now you can get a dark mode like GitHub or Chrome. Press the button to set your favourite mode.
 </p>

 ## SVG Buttons

 <p>
    New buttons that allow you to save the code from the terminal, save the SVG or import your code to the web
 </p>

 ## Dock buttons

 <p>
    Two new buttons to reallocate the terminal through the window. You can get this new positions putting closer the terminal to the bottom or right of the window. Try it yourself!
 </p>

 ## Rotation Settings

 <p>
    Now that the rotation is possible with the right click, you can personalize the velocity. It depends on your browser which is the perfect velocity. The default velocity is prepared for Safari, try to reduce it a little bit if you use Chrome or Mozilla.
 </p>

<a name="Shortcuts"></a>
# Shortcuts
<p>
    Marcos did a great job with the shorcuts, and now there are more because of the new features. Try them and be a real developer.
</p>

|   FUNCTION      | KEYBOARD SHORTCUT  |
| ------------- |:-----------------:|
| Export SVG      | CTRL+SHIFT+S |
| Open project      |    CTRL+SHIFT+F |
| Change example |   CTRL+SHIFT+H  |
| Set the preview window to full screen |    CTRL+SHIFT+E |
| Zoom In |  CTRL+SHIFT+ '+' |
| Zoom Out |  CTRL+SHIFT+ '-' |
| Reset Image |  CTRL+SHIFT+BACKSPACE |
| Open menu |  CTRL+SHIFT+Q |
| Terminal to the Right |  CTRL+SHIFT+ Arrow Right |
| Terminal to the Bottom |  CTRL+SHIFT+ Arrow Down |


<a name="Tests"></a>
# Tests
<p>
    As a new feature now you can test some of the functionality with the tool Selenium. To run the tests, install Node.js on your machine, clone the repository and execute on the terminal:
 
 ```
 npm init
 npm install selenium-webdriver -y
 ```
 
The tests are executed with the Google Driver, so go to this <a href="https://chromedriver.chromium.org/home">link</a>, and download the correct version for your machine. 
 Now, you can run each test with the command node + the test you want to run. Be free to create new tests and prove your own implementations!!
 
</p>
