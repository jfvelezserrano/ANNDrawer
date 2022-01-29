/**
 * GLOBAL VARIABLES
 */
var zoom = 100;
var svg;
var timeout;
var speed = 100;
var svgCode;
var svgCode2;
var zoomCounter = 0



/**
 * LOAD PAGE
 */
$(function () {
    loadInputs();
    loadMenu();
    loadDarkTheme();
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
        updatePreview(cm.getValue(),this.zoomCounter);
    });
    $('input:radio[name=kerneldimensions]').change(function () {
        updatePreview(cm.getValue(),this.zoomCounter);
    });
    $('input:radio[name=widthlogs]').change(function () {
        updatePreview(cm.getValue(),this.zoomCounter);
    });
    $('input:radio[name=depthlogs]').change(function () {
        updatePreview(cm.getValue(),this.zoomCounter);
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
    openFile2();
}

/**
 * Decreases the counter while the button is pressed
 * @param {e} e 
 * @param {number} number 
 */
function holdClickDec(e, number) {
    if (e.type == "mousedown") {
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
    if (e.type == "mousedown") {
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
        updatePreview(cm.getValue(),this.zoomCounter);
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
        updatePreview(cm.getValue(),this.zoomCounter);
    });
}

/**
 * Load all elements of the menu
 */
function loadMenu() {
    /*SLIDER MENU*/


    function slideMenu() {
        var activeState = $("#menu-container .menu-list").hasClass("active");
        $("#menu-container .menu-list").animate({ left: activeState ? "-25px" : "-1500px" }, 400);
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
        }
  
}

/**
 * Save the code of the neural network
 */
function saveCode(num) {
    var fname = prompt('Code File', 'neuroCode');
    if (fname && num==1) {
        saveAsFile(fname, cm.getValue(), 'text/plain');
    }
    if (fname && num==2) {
        saveAsFile(fname, cm2.getValue(), 'text/plain');
    }
}

/**
 * Save the SVG file generated
 */
function saveSVG(num) {
    var fname = prompt('Svg File', 'neuroImage');
    if (fname && num==1) {
        let save = svgCode.slice(54, svgCode.length);
        svgCode = '<svg id="svgImage" viewBox=\'' + (x_min) + ' ' + (y_min - 10) + ' ' + (x_max - x_min + 15) + ' ' + (y_max - y_min + 10) + '\' xmlns=\'http://www.w3.org/2000/svg\'>\n' + save;
        saveAsFile(fname, svgCode, 'image/svg+xml');
    }
    if (fname && num==2) {
        let save = svgCode2.slice(54, svgCode2.length);
        svgCode2 = '<svg id="svgImage" viewBox=\'' + (x_min) + ' ' + (y_min - 10) + ' ' + (x_max - x_min + 15) + ' ' + (y_max - y_min + 10) + '\' xmlns=\'http://www.w3.org/2000/svg\'>\n' + save;
        saveAsFile(fname, svgCode2, 'image/svg+xml');
    }
}

/**
 * Open the code and update the editor with the content of this file
 */
function clickOpen(num) {
    if (num == 1){
        $('#openFile').val(''); // Reset de the content of input type file
        $('#openFile').click(); // Click de hidden input type file
    }
    if (num == 2){
        $('#openFile2').val(''); // Reset de the content of input type file
        $('#openFile2').click(); // Click de hidden input type file
    }
}

function openFile(){
    $("#openFile").on('change', function () {
            var fr = new FileReader();
            fr.onload = function () {
                if (fileValidation()) {
                    cm.setValue(this.result);
                    updatePreview(cm.getValue(),this.zoomCounter);
                }
            }
            fr.readAsText(this.files[0]);
    })
}

function openFile2(){
    $("#openFile2").on('change', function () {
        var fr = new FileReader();
        fr.onload = function () {
            if (fileValidation()) {
                cm2.setValue(this.result);
                updatePreviewOfSplitted(cm2.getValue(),this.zoomCounter);
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
        timeout = setTimeout(() => {
            decrement(number);
        }, speed);
        let result = parseFloat(n1 - 3);
        if (result > -360) {
            $('#input' + number).val(result.toFixed(0));
        } else {
            $('#input' + number).val(-360);
        }
    } else {
        let result = parseFloat(n1 - 0.1);
        if (result > 0) {
            $('#input' + number).val(result.toFixed(1));
        } else {
            $('#input' + number).val(0);
        }
    }
    updatePreview(cm.getValue(),this.zoomCounter);
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
        timeout = setTimeout(() => {
            increment(number);
        }, speed);
        let result = parseFloat(n1 + 3);
        if (result < 360) {
            $('#input' + number).val(result.toFixed(0));
        } else {
            $('#input' + number).val(360);
        }
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
    
    updatePreview(cm.getValue(),this.zoomCounter);
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
            $('#input' + number).val(360);
        }
        if (n1 < -360) {
            $('#input' + number).val(-360);
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
    updatePreview(cm.getValue(),this.zoomCounter);
}

function zoomIn() {
    zoomCounter++;
    svg.zoomIn();
    this.viewBox = svg.getViewBox()
}

function zoomOut() {
    zoomCounter--;
    svg.zoomOut();
    this.viewBox = svg.getViewBox()
}

function undo() {
    svg.reset()
    this.zoomCounter = 0
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
    updatePreview(cm.getValue(),this.zoomCounter);
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
        let index = indexExample % example.data.length+1;
        $('#opt'+index).click();
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



    if (e.shiftKey){
    switch (e.key){
        case 'ArrowRight':
            if (e.ctrlKey){
                    holdClickInc(e, 17);
                    window.alert('asdf')
            }
    }
}


    if (e.shiftKey  && e.key == 'ArrowLeft') {
        window.alert('left key')
    }
    
    if (e.shiftKey  && e.key == 'ArrowUp') {
       // left arrow
    }
    if (e.shiftKey  && e.key == 'ArrowDown') {
       // right arrow
    }

    
}




/**
 * Puts the preview in full screen. 
 * In the case that it is in full screen, it returns to its original size
 */
function expandPreview() {
    var isVisible = $(".paper").is(":visible");
    if (isVisible) {
        $(".paper").hide("slow");
        $(".editorbuttons").hide("slow");
        $(".dropdown").hide("slow");
        $(".preview").css("width", "100%");
        $("#btnexp").removeClass("fa fa-expand");
        $("#btnexp").addClass("fa fa-window-maximize");
        $(".zoombuttons").css("-webkit-transition", "all 0.75s ease-in-out");
        $(".zoombuttons").css("-moz-transition", "all 0.75s ease-in-out");
        $(".zoombuttons").css("-moz-transition", "all 0.75s ease-in-out");
        $(".zoombuttons").css("-o-transition", "all 0.75s ease-in-out");
        $(".zoombuttons").css("transition", "all 0.75s ease-in-out");
        $(".zoombuttons").css("margin-left", "4%");

        $(".title").css("-webkit-transition", "all 0.75s ease-in-out");
        $(".title").css("-moz-transition", "all 0.75s ease-in-out");
        $(".title").css("-moz-transition", "all 0.75s ease-in-out");
        $(".title").css("-o-transition", "all 0.75s ease-in-out");
        $(".title").css("transition", "all 0.75s ease-in-out");
        $(".title").css("margin-left", "44.7%");
        svg.setViewBox(0, 0, 2000, 2000, 0);
    } else {
        $(".paper").show("slow");
        $(".editorbuttons").show("slow");
        $(".dropdown").show("slow");
        $(".preview").css("width", "70%");
        $("#btnexp").removeClass("fa fa-window-maximize");
        $("#btnexp").addClass("fa fa-expand");
        $(".zoombuttons").css("margin-left", "30.5%");
        $(".title").css("margin-left", "57.7%");
        svg.setViewBox(0, 0, 1000, 1000, 0);
    }
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




    function movilityDot()

    {
        var el = document.getElementById("cuadro");    
        el.addEventListener("mousedown", ratonPulsado, false);
        el.addEventListener("mouseup", ratonSoltado, false);
        document.addEventListener("mousemove", ratonMovido, false);

    }


    function movilityTerminal()

    {
        var el = document.getElementById("paper");
    
        el.addEventListener("mousedown", ratonPulsadoTerminal, false);
        el.addEventListener("mouseup", ratonSoltadoTerminal, false);
        document.addEventListener("mousemove", ratonMovidoTerminal, false);

    }

    var xInic, yInic;
    var estaPulsado = false;

    var xInicTerminal, yInicTerminal;
    var estaPulsadoTerminal = false;
            


    function ratonPulsado(evt) { 
        //Obtener la posición de inicio
        xInic = evt.clientX;
        yInic = evt.clientY;    
        estaPulsado = true;

        //Para Internet Explorer: Contenido no seleccionable
        document.getElementById("cuadro").unselectable = true;
    }

    function ratonPulsadoTerminal(evt) { 
        //Obtener la posición de inicio
        xInicTerminal = evt.clientX;
        yInicTerminal = evt.clientY;    
        estaPulsadoTerminal = true;
        //Para Internet Explorer: Contenido no seleccionable
        document.getElementById("paper").unselectable = true;
    }

   
    
    function ratonMovido(evt) {
        if(estaPulsado) {
            //Calcular la diferencia de posición
            var xActual = evt.clientX;
            var yActual = evt.clientY;    
            var xInc = xActual-xInic;
            var yInc = yActual-yInic;
            xInic = xActual;
            yInic = yActual;


            //if (xActual)
            
            //Establecer la nueva posición
            var elemento = document.getElementById("cuadro");
        
            var position = getPosicion(elemento);
            document.getElementById("cuadro").style.top = (position[0] + yInc) + "px";
            document.getElementById("cuadro").style.left = (position[1] + xInc) + "px";
            
        }
    }

    function ratonMovidoTerminal(evt) {
        if(estaPulsadoTerminal) {
            //Calcular la diferencia de posición
            var xActualTerminal = evt.clientX;
            var yActualTerminal = evt.clientY;    
            var xIncTerminal = xActualTerminal-xInicTerminal;
            var yIncTerminal = yActualTerminal-yInicTerminal;
            xInicTerminal = xActualTerminal;
            yInicTerminal = yActualTerminal;
            
            //Establecer la nueva posición
            var elementoTerminal = document.getElementById("paper");

            var positionTerminal = getPosicion(elementoTerminal);
            var resize = evaluateAutoResizing(positionTerminal[0],positionTerminal[1])
            

            //Es necesario limitar la posicion de X e Y del ratón para ajustar a la ventana
            let posicionfinalX = positionTerminal[0] + yIncTerminal
            let posicionfinalY = positionTerminal[1] + xIncTerminal
            
            //La posición entonces ya ha sido ajustada
            if (!resize){
                document.getElementById("paper").style.top = (posicionfinalX) + "px";
                document.getElementById("paper").style.left = (posicionfinalY) + "px";
                
            }
        }
    }


    function loadInputColor(number, css) {
        var body = document.querySelector('body');
        var input = document.getElementById('input' + number);
        input.addEventListener('change', function () {
            body.style.setProperty(css, input.value);
            $('#input' + number).val(input.value);
            updatePreview(cm.getValue(),this.zoomCounter);
        });
    }

    function evaluateAutoResizing(top,left) {

        var widthWindow = window.innerWidth;
        var heightWindow = window.innerHeight;
        

        var limitBottom = heightWindow - 150
        var limitRight = widthWindow - 400
        if (top>limitBottom){resizeBottom(heightWindow); return true}
        if (left>limitRight){resizeRight(widthWindow,heightWindow); return true}
        return false

    }
    
    function resizeBottom(height) {
        let finalHeight = height - 300
        let finalWidth = window.innerWidth;
        document.getElementById("paper").style.top = (finalHeight -25) + "px";
        document.getElementById("paper").style.left = "0px";
        document.getElementById("paper").style.width = (finalWidth -25) + "px";
        document.getElementById("paper").style.height = "300px";
        ratonSoltadoTerminal()
        reallocateViewButtons()

    }

    
    function resizeRight(width,height) {
        let finalWidth = width - 400
        document.getElementById("paper").style.top = "0px";
        //Tenemos que restar el padding que hay actualmente a los lados para que se ajuste completamente a la derecha
        let finalpadding = 28
        
        document.getElementById("paper").style.left = (finalWidth-finalpadding) + "px";
        document.getElementById("paper").style.width = "400px";
        document.getElementById("paper").style.height = height - 25 + "px";
        ratonSoltadoTerminal()
        
    }
    
    function ratonSoltado(evt) {
        estaPulsado = false;
        
    }
    
    function ratonSoltadoTerminal(evt) {
        estaPulsadoTerminal = false;
        
    }
    
    
    function getPosicion(elemento) {
        var posicion = new Array(2);
        if(document.defaultView && document.defaultView.getComputedStyle) {
            posicion[0] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("top"))
            posicion[1] = parseInt(document.defaultView.getComputedStyle(elemento, null).getPropertyValue("left"));
        } else {
            //Para Internet Explorer
            posicion[0] = parseInt(elemento.currentStyle.top);             
            posicion[1] = parseInt(elemento.currentStyle.left);               
        }      
        return posicion;
    }
    
    
    
    
    
    
    function split(){

        let splitted = document.getElementById("preview-firstSplit").classList.value
        if (splitted == "checked"){
            
            document.getElementById('preview').style.width = "100%"
            document.getElementById('preview-firstSplit').classList.remove('checked')
            document.getElementById('preview-firstSplit').classList.add('preview-firstSplit')
            updatePreviewOfSplitted(cm.getValue(),this.zoomCounter)
            resizeBottom()
            //deleteExamples()
            deleteCm()
            deleteSplitted()
        }else {
            document.getElementById('preview').style.width = "50%"
            document.getElementById('preview-firstSplit').classList.remove('preview-firstSplit')
            document.getElementById('preview-firstSplit').classList.add('checked')
            


            updatePreviewOfSplitted(cm.getValue(),this.zoomCounter)
            createNewCm()
            resizeBottomSplitted()
            createNewExamples()
            reallocateOptions()

        }
        
    }

    function reallocateOptions() {

        //REALLOCATE THE VIEW BUTTONS AND ALLOWING THE HIDDEN BE VISIBLE
        reallocateViewButtons()
        document.getElementById('viewbuttons2').classList.remove('viewbuttons2')
        document.getElementById('viewbuttons2').classList.add('viewbuttons2-splitted')

        //ALLOWING THE HIDDEN BUTTONS BE VISIBLE
        document.getElementById('zoombuttons2').classList.remove('zoombuttons2')
        document.getElementById('zoombuttons2').classList.add('zoombuttons2-splitted')

    }

    function reallocateViewButtons() {
        document.getElementById('viewbuttons').style.top = '50px'
        document.getElementById('viewbuttons').style.left = '10px'
        document.getElementById('viewbuttons').style.left = '10px'
    }
    
    function resizeBottomSplitted(){
        //Resizing first terminal
        document.getElementById("paper").style.top = (window.innerHeight - 222) + "px";
        document.getElementById("paper").style.left = "0px";
        document.getElementById("paper").style.width = "48%";
        document.getElementById("paper").style.height = "200px";
        //Resizing second terminal
        document.getElementById("second-terminal").style.top = (window.innerHeight - 222) + "px";
        document.getElementById("second-terminal").style.left = "0px";
        document.getElementById("second-terminal").style.width = "96%";
        document.getElementById("second-terminal").style.height = "200px";
    }

    function createNewExamples(){
        return ;
    }

    function loadDarkTheme() {
        var checkbox = document.getElementById("checkbox-theme");
        checkbox.addEventListener("change", changeTheme, false)
        
    } 

    function changeTheme(){
        document.body.classList.toggle('dark-mode');
        let menu_mode = document.getElementById("menu-examples").classList.value
        if (menu_mode == "menu-examples") {
            document.getElementById("menu-examples").classList.remove('menu-examples') 
            document.getElementById("menu-examples").classList.add('menu-examples-dark-mode')

        }else{
            document.getElementById("menu-examples").classList.remove('menu-examples-dark-mode') 
            document.getElementById("menu-examples").classList.add('menu-examples')
        }
    }




  

