/**
 * GLOBAL VARIABLES
 */
var zoom = 100;
var svg;
var timeout;
var speed = 100;
var svgCode;
var newViewBox;
//VARIABLES FOR X AND Y OF TERMINAL
var xInicTerminal, yInicTerminal;
var isCheckedTerm = false;
//VARIABLES FOR X AND Y OF ROTATION
var xInicRotation, yInicRotation;
var isCheckedRotation = false;

var velocityOfRotation = 6

const ZoomOptionsView = {
    initialViewBox: { // the initial viewBox, if null or undefined will try to use the viewBox set in the svg tag. Also accepts string in the format "X Y Width Height"
        x: 0, // the top-left corner X coordinate
        y: 0, // the top-left corner Y coordinate
        width: 1000 , // the width of the viewBox
        height: 1000 // the height of the viewBox
    },
}

//FIRST USE OF X AND Y 
localStorage.setItem('x', 0)
localStorage.setItem('y', 0)



/**
 * LOAD PAGE
 */
$(function () {
    loadInputs();
    loadMenu();
    loadDarkTheme();
    loadMovility()
    hideOptionsBeginning()
    $("html,body").animate({ scrollTop: 0 }, "slow");
    $("#big-menu-button").click()
    $("#big-menu-button").click()


});

/**
 * Loads the input of the menu
 */
function loadInputs() {

    let inputsColor = ['--cubeColor', '--kernelColor', '--denseColor', '--pyramidColor',
        '--arrowColor', '--strokeColor', '--fontColor', '--inputColor',
    ]
    let j = 0;
    for (let i = 1; i < 16; i += 2) {
        loadInputColor(i, inputsColor[j]);
        j++;
    }
    for (let i = 2; i < 17; i += 2) {
        if (i == 14) {
            loadInput(i, 15, 0)
        } else {
            loadInput(i, 1, 0)
        }
    }

    for (let i = 17; i < 23; i++) {
        if (i < 20) {
            //Rotation Settings
            loadInput(i, 360, -360);
        } else {
            //Distance Settings
            loadInput(i, 250, 0);
        }
    }
    $('input:radio[name=test]').click(function () {
        let example = ($('input:radio[name=test]:checked').val());
        init(example);
    });


    $('input:radio[name=cubedimensions]').change(function () {
        updatePreview(cm.getValue(), svg.getViewBox());
    });
    $('input:radio[name=kerneldimensions]').change(function () {
        updatePreview(cm.getValue(), svg.getViewBox());
    });
    $('input:radio[name=widthlogs]').change(function () {
        updatePreview(cm.getValue(), svg.getViewBox());
    });
    $('input:radio[name=depthlogs]').change(function () {
        updatePreview(cm.getValue(), svg.getViewBox());
    });
    $('#increment17').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 17);
    });
    $('#decrement17').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 17);
    });
    $('#increment18').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 18);
    });
    $('#decrement18').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 18);
    });
    $('#increment19').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 19);
    });
    $('#decrement19').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 19);
    });
    $('#increment20').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 20);
    });
    $('#decrement20').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 20);
    });
    $('#increment21').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 21);
    });
    $('#decrement21').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 21);
    });
    $('#increment22').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 22);
    });
    $('#decrement22').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 22);
    });
    $('#increment14').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 14);
    });
    $('#decrement14').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 14);
    });
    $('#incrementRotationX').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 17);
    });
    $('#decrementRotationX').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 17);
    });
    $('#incrementRotationY').on('mousedown mouseup mouseleave', e => {
        holdClickDec(e, 18);
    });
    $('#decrementRotationY').on('mousedown mouseup mouseleave', e => {
        holdClickInc(e, 18);
    });

    /*Open file*/
    openFile();
}

/**
 * Decreases the counter while the button is pressed
 * @param {e} e 
 * @param {number} number 
 */
function holdClickDec(e, number) {
    if (e.type == "mousedown" || isCheckedRotation) {
        decrement(number);
    } else {
        stop()
    }
}

/**
 * Increases the counter while the button is pressed
 * @param {e} e 
 * @param {number} number 
 */
function holdClickInc(e, number) {
    if (e.type == "mousedown" || isCheckedRotation) {
        increment(number);
    } else {
        stop()
    }
}

/**
 * Load a determinate input of the menu
 * @param {number} number 
 * @param {max} max 
 * @param {min} min 
 */
function loadInput(number, max, min) {
    var input = document.getElementById('input' + number);
    input.addEventListener('change', function () {


        if (input.value < min) {
            input.value = min;
        }
        if (input.value > max) {
            input.value = max;
        }
        $('#input' + number).val(input.value);
        updatePreview(cm.getValue(), svg.getViewBox());
    });
}

/**
 * Load an input color of the menu
 * @param {number} number 
 * @param {css} css 
 */
function loadInputColor(number, css) {
    var body = document.querySelector('body');
    var input = document.getElementById('input' + number);
    input.addEventListener('change', function () {
        body.style.setProperty(css, input.value);
        $('#input' + number).val(input.value);
        updatePreview(cm.getValue(), svg.getViewBox());
    });
}

/**
 * Load all elements of the menu
 */
function loadMenu() {
    /*SLIDER MENU*/


    function slideMenu() {
        var activeState = $("#menu-container .menu-list").hasClass("active");
        $("#menu-container .menu-list").animate({ left: activeState ? "-1%" : "-105%" }, 400);
    }

    $("#big-menu-button").click(function (event) {
        event.stopPropagation();
        $("#hamburger-menu").toggleClass("open");
        $("#menu-container .menu-list").toggleClass("active");
        slideMenu();

        $("body").toggleClass("overflow-hidden");
    });


    $(".menu-list").find(".accordion-toggle").click(function () {
        $(this).next().toggleClass("open").slideToggle("fast");
        $(this).toggleClass("active-tab").find(".menu-link").toggleClass("active");

        $(".menu-list .accordion-content").not($(this).next()).slideUp("fast").removeClass("open");
        $(".menu-list .accordion-toggle").not(jQuery(this)).removeClass("active-tab").find(".menu-link").removeClass("active");
    });

    $(".menu-list").find(".accordion-toggle2").click(function () {
        $(this).next().toggleClass("open").slideToggle("fast");
        $(this).toggleClass("active-tab").find(".menu-link").toggleClass("active");

        $(".menu-list .accordion-content2").not($(this).next()).slideUp("fast").removeClass("open");
        $(".menu-list .accordion-toggle2").not(jQuery(this)).removeClass("active-tab").find(".menu-link").removeClass("active");
    });

    $('#fontButton').css('font-family', 'Calibri');
}

function loadDarkTheme() {
    var checkbox = document.getElementById("checkbox-theme");
    checkbox.addEventListener("change", changeTheme, false)
}


function loadMovility() {
    var terminal = document.getElementById("paper-content");
    terminal.addEventListener("mousedown", ratonPulsadoTerminal, false);
    terminal.addEventListener("mouseup", ratonSoltadoTerminal, false);
    document.addEventListener("mousemove", ratonMovidoTerminal, false);

    document.addEventListener("mousedown", ratonPulsadoRotation, false);
    document.addEventListener("mouseup", ratonSoltadoRotation, false);
    document.addEventListener("mousemove", ratonMovidoRotation, false);
}

function hideOptionsBeginning(){
    setTimeout(function(){
        hideOptions()
    },3000)
}
function changeModel(number) {
    switch (number) {
        case 1:
            init(0)
            break
        case 2:
            init(1)
            break;
        case 3:
            init(2)
            break;
        case 4:
            init(3)
            break;
        case 5:
            init(4)
            break;
        case 6:
            init(5)
            break;
        case 7:
            init(6)
            break;
    }

}

/**
 * Save the code of the neural network
 */
function saveCode(num) {
    var fname = prompt('Code File', 'neuroCode');
    if (fname && num == 1) {
        saveAsFile(fname, cm.getValue(), 'text/plain');
    }
    if (fname && num == 2) {
        saveAsFile(fname, cm2.getValue(), 'text/plain');
    }
}

/**
 * Save the SVG file generated
 */
function saveSVG() {
    var fname = prompt('Svg File', 'neuroImage');
    let save = svgCode.slice(54, svgCode.length);
    svgCode = '<svg id="svgImage" viewBox=\'' + (x_min) + ' ' + (y_min - 10) + ' ' + (x_max - x_min + 15) + ' ' + (y_max - y_min + 10) + '\' xmlns=\'http://www.w3.org/2000/svg\'>\n' + save;
    saveAsFile(fname, svgCode, 'image/svg+xml');
    
}

/**
 * Open the code and update the editor with the content of this file
 */
function clickOpen() {
    $('#openFile').val(''); // Reset de the content of input type file
    $('#openFile').click(); // Click de hidden input type file    
}

function openFile() {
    $("#openFile").on('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            if (fileValidation()) {
                cm.setValue(this.result);
                updatePreview(cm.getValue(), svg.getViewBox());
            }
        }
        fr.readAsText(this.files[0]);
    })
}


/**
 * Returns true if the file to open is a txt format
 * 
 * @returns the validation
 * 
 */
function fileValidation() {
    var fileInput = document.getElementById('openFile');
    var filePath = fileInput.value;
    if (!filePath.includes(".txt")) {
        alert('Please upload file having extensions .txt only.');
        fileInput.value = '';
        return false;
    }
    return true;
}

/**
 * Decrement an input number
 * 
 * @param {number} number 
 */
function decrement(number) {
    let input = $('#input' + number);
    let n1 = parseFloat(input.val());
    //Size
    if (number == 14 || number == 20 || number == 21 || number == 22) {
        timeout = setTimeout(() => {
            decrement(number);
        }, speed);
        let result = parseFloat(n1 - 1);
        if (result > 0) {
            $('#input' + number).val(result.toFixed(0));
        } else {
            $('#input' + number).val(0);
        }
    } else if (number == 17 || number == 18 || number == 19) {

        let result = parseFloat(n1 - velocityOfRotation);
        $('#input' + number).val(result % 360);

    } else {
        let result = parseFloat(n1 - 0.1);
        if (result > 0) {
            $('#input' + number).val(result.toFixed(1));
        } else {
            $('#input' + number).val(0);
        }
    }
    updatePreview(cm.getValue(), svg.getViewBox());
}

/**
 * Increment an input namber
 * 
 * @param {number} number 
 */
function increment(number) {
    let input = $('#input' + number);
    let n1 = parseFloat(input.val());

    //Size
    if (number == 14) {
        timeout = setTimeout(() => {
            increment(number);
        }, speed);
        let result = parseFloat(n1 + 1);
        if (result < 15) {
            $('#input' + number).val(result.toFixed(0));
        } else {
            $('#input' + number).val(15);
        }
    } else if (number == 17 || number == 18 || number == 19) {
        let result = parseFloat(n1 + velocityOfRotation);
        $('#input' + number).val(result % 360);
    } else if (number == 20 || number == 21 || number == 22) {
        timeout = setTimeout(() => {
            increment(number);
        }, speed);
        let result = parseFloat(n1 + 1);
        if (result < 250) {
            $('#input' + number).val(result.toFixed(0));
        } else {
            $('#input' + number).val(250);
        }
    } else {
        let result = parseFloat(n1 + 0.1);
        if (result < 1) {
            $('#input' + number).val(result.toFixed(1));
        } else {
            $('#input' + number).val(1);
        }
    }

    updatePreview(cm.getValue(), svg.getViewBox());
}

/**
 * Checks if an input number is valid
 * @param {number} number 
 */
function checkInputNumber(number) {
    let input = $('#input' + number);
    if (number == 14) {
        let n1 = parseFloat(input.val());
        if (n1 > 15) {
            $('#input' + number).val(15);
        }
        if (n1 < 0) {
            $('#input' + number).val(0);
        }
    } else if (number == 17 || number == 18 || number == 19) {
        let n1 = parseFloat(input.val());
        if (n1 > 360) {

            $('#input' + number).val(n1 % 360);
        }
        if (n1 < -360) {
            $('#input' + number).val(n1 % 360);
        }
    } else if (number == 20 || number == 21 || number == 22) {
        let n1 = parseFloat(input.val());
        if (n1 > 250) {
            $('#input' + number).val(250);
        }
        if (n1 < 0) {
            $('#input' + number).val(0);
        }
    } else {
        let n1 = parseFloat(input.val());
        if (n1 > 1) {
            $('#input' + number).val(1);
        }
        if (n1 < 0) {
            $('#input' + number).val(0);
        }
    }

}

/**
 * Strores de avaliable fonts
 */
var fonts = {
    list: [
        'Calibri',
        'Arial',
        'Consolas',
        'Georgia',
        'Courier',
    ],
    index: 0
}

/**
 * Update the input font with a click
 */
function toggleButton() {
    fonts.index = fonts.index + 1;
    let i = (fonts.index) % fonts.list.length;
    $('#fontButton').text(fonts.list[i]);
    $('#fontButton').css('font-family', fonts.list[i] + ', sans-serif');
    updatePreview(cm.getValue(), svg.getViewBox());
}


function reset(...args) {
    //Color or Font Settings
    if (args.length > 1) {
        $('body').css(args[1], args[2]);
        $('#input' + args[0]).val(args[2]);
        if (args[0] == 13) {
            //Font Settings
            $('#input' + (args[0] + 1)).val(6);
            $('#fontButton').text(fonts.list[0]);
            $('#fontButton').css('font-family', fonts.list[0]);
            fonts.index = 0;
        } else {
            //Color Settings
            if (args[0] == 11) {
                $('#input' + (args[0] + 1)).val(0.3);
            }
            else {
                $('#input' + (args[0] + 1)).val(0.5);
            }

        }

    }
    //Range Settings
    else {
        let a;
        let b;
        let c;

        if (args[0] == 17) {
            //Rotation Settings
            a = 30;
            b = 60;
            c = 0;

        } else {
            //Distance Settings
            a = 50;
            b = 50;
            c = 50;
        }
        $('#input' + (args[0])).val(a);
        $('#input' + (args[0] + 1)).val(b);
        $('#input' + (args[0] + 2)).val(c);
    }
    updatePreview(cm.getValue(), svg.getViewBox());
}

/**
 * Save a file
 * 
 * @param {filename} filename 
 * @param {data} data 
 * @param {type} type 
 * @returns 
 */
function saveAsFile(filename, data, type) {
    var blob = new Blob([data], { type });

    if (window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);

        return;
    }

    var elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);

    elem.click();
    document.body.removeChild(elem);

    window.URL.revokeObjectURL(blob);
}

/**
 * Keyboard shortcuts
 * 
 * CTRL+Shift+S = Save Svg File
 * CTRL+Shift+F = Open File
 * CTRL+Shift+H = Change example
 * CTRL+Shift+E = Hide/Show Editor
 * CTRL+Shift+'+' = Zoom In
 * CTRL+Shift+'-' = Zoom Out
 * CTRL+Shift+'BACKSPACE' = Undo Image
 * CTRL+Shift+Q = Open Menu
 * CTRL+Shift+ ArrowRigt = Terminal to Right
 * CTRL+Shift+ ArrowDown = Terminal to Bottom
 */
var indexExample = 1;
document.onkeyup = function (e) {
    e.preventDefault();

    var theChar = null;
    if (e.key !== undefined) {
        theChar = e.key.toUpperCase();
    }
    if (!theChar) {
        // Fallback to old standard
        theChar = String.fromCharCode(e.key).toUpperCase();
    }

    // Export image in Svg file
    if (e.ctrlKey && e.shiftKey && theChar == 'S') {
        saveSVG();
    }

    // Open File
    if (e.ctrlKey && e.shiftKey && theChar == 'F') {
        clickOpen();
    }

    // Change example
    if (e.ctrlKey && e.shiftKey && theChar == 'H') {
        let index = indexExample % example.data.length + 1;
        $('#opt' + index).click();
        indexExample++;
    }

    // Expand Preview
    if (e.ctrlKey && e.shiftKey && theChar == 'E') {
        expandPreview();
    }

    // Zoom In
    if (e.ctrlKey && e.shiftKey && theChar == '+') {
        zoomIn();
    }

    // Zoom Out
    if (e.ctrlKey && e.shiftKey && theChar == '-') {
        zoomOut();
    }

    // Undo
    if (e.ctrlKey && e.shiftKey && theChar == 'BACKSPACE') {
        undo();
    }

    // Open Menu
    if (e.ctrlKey && e.shiftKey && theChar == 'Q') {
        $("#big-menu-button").click();

    }

    if(e.ctrlKey && e.key == 'ArrowRight')
        resizeRight(window.innerWidth,window.innerHeight)

    if(e.ctrlKey && e.key == 'ArrowDown')
        resizeBottom(window.innerHeight)
}

/**
 * Dialog box to avoid exiting the web without saving
 * 
 * @param {e} e 
 * @returns 
 */
window.onbeforeunload = function (e) {
    if (e) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
    }

    return 'Are you sure want to exit?';
};

/**
 * Stope Timeout
 */
function stop() {
    clearTimeout(timeout);

}

function movilityTerminal() {
    var el = document.getElementById("paper");
    el.addEventListener("mousedown", ratonPulsadoTerminal, false);
    el.addEventListener("mouseup", ratonSoltadoTerminal, false);
    document.addEventListener("mousemove", ratonMovidoTerminal, false);

}

function ratonPulsadoTerminal(evt) {
    //Obtener la posición de inicio
    xInicTerminal = evt.clientX;
    yInicTerminal = evt.clientY;
    isCheckedTerm = true;
    //Para Internet Explorer: Contenido no seleccionable
    document.getElementById("paper").unselectable = true;
}

function ratonMovidoTerminal(evt) {
    if (isCheckedTerm) {
        //Calcular la diferencia de posición
        var xActualTerminal = evt.clientX;
        var yActualTerminal = evt.clientY;
        var xIncTerminal = xActualTerminal - xInicTerminal;
        var yIncTerminal = yActualTerminal - yInicTerminal;
        xInicTerminal = xActualTerminal;
        yInicTerminal = yActualTerminal;

        //Establecer la nueva posición
        var elementoTerminal = document.getElementById("paper");

        var positionTerminal = getPosicion(elementoTerminal);
        var resize = evaluateAutoResizing(positionTerminal[0], positionTerminal[1])


        //Es necesario limitar la posicion de X e Y del ratón para ajustar a la ventana
        let posicionfinalX = positionTerminal[0] + yIncTerminal
        let posicionfinalY = positionTerminal[1] + xIncTerminal

        //La posición entonces ya ha sido ajustada
        if (!resize) {
            document.getElementById("paper").style.top = (posicionfinalX) + "px";
            document.getElementById("paper").style.left = (posicionfinalY) + "px";

        }
    }
}

function evaluateAutoResizing(top, left) {

    var widthWindow = window.innerWidth;
    var heightWindow = window.innerHeight;


    var limitBottom = heightWindow - 150
    var limitRight = widthWindow - 400
    if (top > limitBottom) { resizeBottom(heightWindow); return true }
    if (left > limitRight) { resizeRight(widthWindow, heightWindow); return true }
    return false

}

function resizeBottom(height) {
    let finalHeight = height - 300
    let finalWidth = window.innerWidth;
    document.getElementById("paper").style.top = (finalHeight - 13) + "px";
    document.getElementById("paper").style.left = "0px";
    document.getElementById("paper").style.width = (finalWidth - 13) + "px";
    document.getElementById("paper").style.height = "300px";
    ratonSoltadoTerminal()
    reallocateViewButtons()

}


function resizeRight(width, height) {
    let finalWidth = width - 400
    document.getElementById("paper").style.top = "0px";
    //Tenemos que restar el padding que hay actualmente a los lados para que se ajuste completamente a la derecha
    let finalpadding = 13

    document.getElementById("paper").style.left = (finalWidth - finalpadding) + "px";
    document.getElementById("paper").style.width = "400px";
    document.getElementById("paper").style.height = height - 13 + "px";
    ratonSoltadoTerminal()

}

function ratonSoltadoTerminal() {
    isCheckedTerm = false;
}


function ratonPulsadoRotation(evt) {
    if (evt.button == 2) {
        document.getElementById("svgImage").style.zIndex = "-100000";

        xInicRotation = evt.clientX
        yInicRotation = evt.clientY
        isCheckedRotation = true
        //Para Internet Explorer: Contenido no seleccionable
        //document.getElementById("rotation").unselectable = true;          
    }
    else {
        document.getElementById("rotation").style.zIndex = "-100000";
        document.getElementById("svgImage").style.zIndex = "0";


    }
}

function ratonMovidoRotation(evt) {
    if (isCheckedRotation) {
        //Calcular la diferencia de posición
        let yOld = localStorage.getItem('y')

        let xOld = localStorage.getItem('x')
        var xActual = evt.clientX;
        var yActual = evt.clientY;

        if (xOld == 0 && yOld == 0) {
            localStorage.setItem('x', xActual)
            localStorage.setItem('y', yActual)
            return
        }
        if (xActual < xOld) {
            holdClickInc("", 18)
        }
        if (xActual > xOld) {
            holdClickDec("", 18)
        }
        if (yActual < yOld) {
            holdClickInc("", 17)
        }
        if (yActual > yOld) {
            holdClickDec("", 17)
        }
        localStorage.setItem('x', xActual)
        localStorage.setItem('y', yActual)
    }
}


function ratonSoltadoRotation(evt) {
    isCheckedRotation = false;
    holdClickDec("", 18)
    holdClickInc("", 18)
    //document.getElementById("rotation").style.display = "none"  
}

function getPosicion(elemento) {
    var posicion = new Array(2);
    if (document.defaultView && document.defaultView.getComputedStyle) {
        posicion[0] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("top"))
        posicion[1] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("left"));
    } else {
        //Para Internet Explorer
        posicion[0] = parseInt(elemento.currentStyle.top);
        posicion[1] = parseInt(elemento.currentStyle.left);
    }
    return posicion;
}

function reallocateViewButtons() {
    document.getElementById('viewbuttons').style.top = '20px'
    document.getElementById('viewbuttons').style.left = '40%'
}

function changeTheme() {

    document.body.classList.toggle('dark-mode');
    document.getElementById('hide__button').classList.toggle('darkMode')
    document.getElementById('velocity__rotation').classList.toggle('darkMode')
    document.getElementById('dock2').classList.toggle('darkMode')
    document.getElementById('dock').classList.toggle('darkMode')
    document.getElementById('hide2').classList.toggle('darkMode')
    let menu_mode = document.getElementById("menu-examples").classList.value
    if (menu_mode == "menu-examples") {
        document.getElementById("menu-examples").classList.remove('menu-examples')
        document.getElementById("menu-examples").classList.add('menu-examples-dark-mode')
        document.getElementById("logo").style.display = "none"
        document.getElementById("imglogo").style.visibility = "hidden"
        document.getElementById("logo-dark").style.display = "block"
        document.getElementById("imglogo-dark").style.visibility = "visible"
        document.getElementById("big-menu-button").style.color = "#FFF"
        document.getElementById('menu-container').style.color  = "#000"
    } else {
        document.getElementById("menu-examples").classList.remove('menu-examples-dark-mode')
        document.getElementById("menu-examples").classList.add('menu-examples')
        document.getElementById("logo").style.display = "block"
        document.getElementById("imglogo").style.visibility = "visible"
        document.getElementById("logo-dark").style.display = "none"
        document.getElementById("imglogo-dark").style.visibility = "hidden"
        document.getElementById("big-menu-button").style.color = "#000"

    }
}

function incrementVelocityRotation() {
    if (velocityOfRotation == 16){
        return
    }
    velocityOfRotation ++;
}
function decrementVelocityRotation() {
    if (velocityOfRotation == 1){
        return
    }
    velocityOfRotation --;
}

function resetView() {
    $('#input17').val(30);
    $('#input18').val(60);
    $('#input19').val(0);
    updatePreview(cm.getValue(),this.ZoomOptionsView)
    velocityOfRotation = 6
    
}

function hideOptions() {
    let display = document.getElementById('hiddeButton').style.display 
    if (display=='none'){
        document.getElementById('velocity__rotation').classList.toggle('move')
  
            document.getElementById('hiddeButton').style.display ="block"
            document.getElementById('showbutton').style.display ="none"
            

    }
    else{
        document.getElementById('velocity__rotation').classList.toggle('move')
        setTimeout(function(){
            document.getElementById('hiddeButton').style.display ="none"
            document.getElementById('showbutton').style.display ="block"
        },1000)
    }
}










