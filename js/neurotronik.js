

/*Global variables*/
var cm;
var svgCode = "";
var layerController;
var x_max;
var x_min;
var y_max;
var y_min;
var indexShortcuts=0;
var ZoomOptions = {
    initialViewBox: { // the initial viewBox, if null or undefined will try to use the viewBox set in the svg tag. Also accepts string in the format "X Y Width Height"
        x: 0, // the top-left corner X coordinate
        y: 0, // the top-left corner Y coordinate
        width: 1000 , // the width of the viewBox
        height: 1000 // the height of the viewBox
    },
}
var newViewBox = {}

let showReduce = false
let totalNodes = 1;
var reducedNodes = [] //Stores the nodes reduced

var shortcutsNumber = []


let counterNodes = 1; //Allows to give to each node a unique numeration
let nodesMap = new Map() //Allows to get the nodes in a implementation with the best performance 

function ZoomOptionstoString(lastViewBox){
    if (lastViewBox!==undefined){
    return('viewBox="'+lastViewBox.x + ' '+lastViewBox.y + ' '+ lastViewBox.width + ' '+ lastViewBox.height + '"')
    }
}


/*Update preview in init*/
$(function() {
    //Load Code Mirror Object (Plugin)
    cm = CodeMirror.fromTextArea(editor, {
        lineNumbers: true,
        styleActiveLine: true,
        mode: 'javascript',
        closeBrackets: true,
        gutters: ["error"],
        lint: true,
        extraKeys: {"Tab": "autocomplete"}
    })
    //Load de example number 1
    init(0);
    //Detect a change in the editor
    cm.on('change', function() {
        updatePreview(cm.getValue(),this.ZoomOptions);
    });
    resizeRight()

});


/*initializes the style  settings for the neural network.
The layercontroller class, drawsettings, svg controller and model are started*/
function initializeDrawSettings() {
    let settings = "";

    let inputColor = $('#input15').val();
    let inputOpacity = $('#input16').val();

    let cubeColor = $('#input1').val();
    let cubeOpacity = $('#input2').val();

    let kernelColor = $('#input3').val();
    let kernelOpacity = $('#input4').val();

    let denseColor = $('#input5').val();
    let denseOpacity = $('#input6').val();

    let pyramidColor = $('#input7').val();
    let pyramidOpacity = $('#input8').val();

    let arrowColor = $('#input9').val();
    let arrowOpacity = $('#input10').val();

    settings += 'var color = new Color("' + inputColor + '","' + cubeColor + '","' + kernelColor + '","' + denseColor + '","' + pyramidColor + '","' + arrowColor + '","' + inputOpacity + '","' + cubeOpacity + '","' + kernelOpacity + '","' + pyramidOpacity + '","' + arrowOpacity + '","' + denseOpacity + '");\n';
    let strokeColor = $('#input11').val();
    let strokeWidth = $('#input12').val();

    settings += 'var stroke = new Stroke("' + strokeColor + '","' + strokeWidth + '");\n';

    let xAxis = $('#input17').val();
    let yAxis = $('#input18').val();
    let zAxis = $('#input19').val();

    settings += 'var alfa = new Alfa(' + xAxis + ',' + yAxis + ',' + zAxis + ');\n';

    let fontColor = $('#input13').val();
    let fontSize = $('#input14').val();
    let fontFamily = $('#fontButton').text();
    settings += 'var font = new Font(' + fontSize + ',"' + fontFamily + '","' + fontColor + '");\n';

    let nodesDistance = $('#input20').val();
    let layersDistance = $('#input21').val();
    let parentsDistance = $('#input22').val();
    settings += 'var shift = new Shift(' + nodesDistance + ',' + layersDistance + ',' + parentsDistance + ');\n';
    settings += 'var viewBox = new ViewBox(3000,2000,-100);\n';

    let cubeDimensions = ($('input:radio[name=cubedimensions]:checked').val() == 'true');
    let kernelDimensions = ($('input:radio[name=kerneldimensions]:checked').val() == 'true');

    let widthLogs = ($('input:radio[name=widthlogs]:checked').val() == 'true');
    let depthtLogs = ($('input:radio[name=depthlogs]:checked').val() == 'true');

    settings += 'var drawSettings = new DrawSettings(color,alfa,shift,font,stroke,viewBox,' + depthtLogs + ',' + widthLogs + ',' + cubeDimensions + ',' + kernelDimensions + ');\n';
    settings += 'var model = new Model();\n';
    settings += 'var svgController = new SvgController(drawSettings)\n\n';
    let color = new Color(inputColor, cubeColor, kernelColor, denseColor, pyramidColor, arrowColor, inputOpacity, cubeOpacity, kernelOpacity, pyramidOpacity, arrowOpacity, denseOpacity);
    let alfa = new Alfa(xAxis, yAxis, zAxis);
    let shift = new Shift(nodesDistance, layersDistance, parentsDistance);
    let font = new Font(fontSize, fontFamily, fontColor);
    let stroke = new Stroke(strokeColor, strokeWidth);
    let viewBox = new ViewBox(0, 0, 0)
    layerController = new LayerController(new DrawSettings(color, alfa, shift, font, stroke, viewBox, depthtLogs, widthLogs, cubeDimensions, kernelDimensions));
    return settings;
}

//module.exports = initializeDrawSettings;

/*
Function that represents the neural network in the preview with the 
configurable data collected from the menu
*/
function updatePreview(content,lastViewBox) {
    nodesMap.clear()
    counterNodes = 1
    totalNodes = 1
    this.newViewBox = lastViewBox
    try {

        let settings = initializeDrawSettings();
        if (content.includes('model')) {
            let code = settings + content;
            eval(code);
            svgCode = svgController.draw(model.getModelTree(),true);
            $('#svg').html(svgCode);
            counterTotalNodes(model.getModelTree())    
        } else {
            $('#svg').html(content);
        }
        //Without errors, the preview frame is blue
        $('#svg').css('background-color', "");
        $('#svg').css('color', "");
        $('#svg').css('font-size', "");
        $('#preview').css('border-right', '2px solid #1b6181');
        svg = $("svg").svgPanZoom(lastViewBox);
        createReducers()
        document.getElementById("show-error-message").style.display = "none"
       // document.getElementById('editor').style.backgroundColor = "rgb(0, 0, 0)"

    } catch (error) {
        handleErrors(error);
        //With errors, the preview frame is colored red
       // $('#svg').css('background-color', "rgba(228, 122, 36, 0.2)");
        //$('#svg').css('color', "#ce0f0f");
       // $('#svg').css('font-size', "30px");
     //   $('#preview').css('border-right', '2px solid #ce0f0f');
    }
    
    
}



function createReducers(){
    let svgButtons = ""
    if(totalNodes>1){
        svgButtons += "<button onclick='setReducers()' id='reduceNodes' style='display: grid;'>SHOW REDUCERS</button>"
    }
    if(showReduce){
        nodesMap.forEach( (_,index) =>{
                if (index!==1){
                    let number = index - 1
                    svgButtons += "<button style='display: grid;' onclick='setReducedNode(" + index + ")' id='reduceNode" + index  + "'>N" + number + "</button></div>"
                }    
            }
        )      
    }
    $('#nodesToBeReduced').html(svgButtons)
}

function handleErrors(error) {
    try {
        let stack = error.stack.split("<anonymous>:");
        let a = stack[1];
        let b = a.split(":");
        if (b[0] > 10) {
            let line = b[0] - 10;
            document.getElementById("show-error-message").style.display = "block"
            $('#show-error-message').html('Line: ' + line + '<p>' + error + '</p>');
        } else {
            document.getElementById("show-error-message").style.display = "block"
            $('#show-error-message').html('Bad Configuration-Check the Settings: ' + '<p>' + error + '</p>');
        }

    } catch (e) {
        document.getElementById("show-error-message").style.display = "block"
        $('#show-error-message').html('Badly defined variable or function.  --> ' + error + '</p>' + '<p> The svg keeps the shape before the errors. </p>');    }
}



/**
 * Stores the sample codes
 * 
 * 1. Basic CNN
 * 2. Basic Siamese
 * 3. Complex Siamese
 * 4. Encoder-Decoder
 * 5. ResNet
 * 
 * Add more!
 */
var example = {
    data: [
        '/* Example 1: Basic CNN */\n\n' + '/* Part 1: Nodes Definition */\n\nvar n1 = new Node();\n\n/* Part 2: Neural Network */\n\n' + 'n1.add(Input(48,32,10));\n' + 'n1.add(Conv2D(32,[10,10], [1,1], "same"));\n' +
        'n1.add(MaxPooling2D([2,2]));\n' + 'n1.add(Conv2D(64,[5,5],[1,1],"same"));\n' + 'n1.add(MaxPooling2D([2,2]));\n' + 'n1.add(Conv2D(72,[10,10],[1,1],"same"));\n' +
        'n1.add(Dense(200));\n' + 'n1.add(Dense(300));\n\n' + '/* Part 3: Model Definition */\n\n' + 'model.add(n1);',

        '/* Example 2: Basic Siamese */\n\n' + '/* Part 1: Nodes Definition */\n' + '\n' + 'var n1 = new Node();\n' + 'var n2 = new Node();\n' + 'var n3 = new Node();\n' + '\n' + '\n' + '/* Part 2: Neural Network */\n' + '\n' +
        'n1.add(Conv2D(32,[10,10],[1,1],"same",Input(48,32,10)));\n' + 'n1.add(MaxPooling2D([2,2]));\n' + 'n1.add(Conv2D(64,[5,5],[1,1],"same"));\n' + 'n1.add(MaxPooling2D([2,2]));\n' + 'n1.add(Conv2D(72,[10,10],[1,1],"same"));\n' + '\n' +
        'n2.add(Input(48,32,10));\n' + 'n2.add(Conv2D(32,[10,10],[1,1],"same"));\n' + 'n2.add(MaxPooling2D([2,2]));\n' + 'n2.add(Conv2D(64,[5,5],[1,1],"same"));\n' + 'n2.add(MaxPooling2D([2,2]));\n' + 'n2.add(Conv2D(72,[10,10],[1,1],"same"));\n\n' +
        'n3.add(Dense(150));\n' + 'n3.add(Dense(150));\n\n' +
        '/* Part 3: Model Definition */\n' + '\n' + 'model.add(n3);\n' +
        'model.add(n1,n3);\n' +
        'model.add(n2,n3);',

        '/* Example 3: Complex Siamese */\n\n' + '/* Part 1: Nodes Definition */\n\n' +
        'var x1a = new Node();\n' +
        'var x1b = new Node();\n' +
        'var x1 = new Node();\n' +
        'var x2 = new Node();\n' +
        'var x3 = new Node();\n' +
        'var xp1 = new Node();\n' +
        'var xp3 = new Node();\n' +
        '\n' +
        '/* Part 2: Neural Network */\n\n' +
        'x1a.add(Input(32,32,20));\n' +
        'x1a.add(Conv2D(32,[10,10],[1,1],"same"));\n' +
        'x1a.add(MaxPooling2D([2,2]));\n' +
        'x1a.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +
        'x1b.add(Input(32,32,20));\n' +
        'x1b.add(Conv2D(32,[10,10],[1,1],"same"));\n' +
        'x1b.add(MaxPooling2D([2,2]));\n' +
        'x1b.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +
        'x2.add(Input(32,32,20));\n' +
        'x2.add(Conv2D(32,[10,10],[1,1],"same"));\n' +
        'x2.add(MaxPooling2D([2,2]));\n' +
        'x2.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        'x2.add(MaxPooling2D(([2,2])));\n' +
        'x2.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +
        'x3.add(Input(32,32,20));\n' +
        'x3.add(Conv2D(32,[10,10],[1,1],"same"));\n' +
        'x3.add(MaxPooling2D([2,2]));\n' +
        'x3.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        'x3.add(MaxPooling2D([2,2]));\n' +
        'x3.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +
        'x1.add(Concatenate([x1a, x1b]));\n' +
        'x1.add(MaxPooling2D([2,2]));\n' +
        'x1.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +
        'xp1.add(Concatenate([x1, x2]));\n' +
        'xp1.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        '\n' +

        'xp3.add(Dense(100));\n' +
        'xp3.add(Dense(200));\n' +
        'xp3.add(Dense(300));\n' +
        '\n' +
        '/* Part 3: Model Definition */\n\n' +
        'model.add(xp3);\n' +
        'model.add(x1a,x1);\n' +
        'model.add(x1b,x1);\n' +
        'model.add(x1,xp1);\n' +
        'model.add(x2,xp1);\n' +
        'model.add(xp1,xp3);\n' +
        'model.add(x2,xp3);\n' +
        'model.add(x3,xp3);',

        '/*Example 4: Encoder-Decoder*/\n\n' +
        '/* Part 1: Nodes Definition */\n\n' +
        'var n1 = new Node();\n\n' +
        '' +
        '/* Part 2: Neural Network */\n\n' +
        '' +
        'n1.add(Input(72,72,72));\n' +
        'n1.add(Conv2D(32,[5,5], [1,1], "same"));\n' +
        'n1.add(Conv2D(64,[5,5],[2,2],"same"));\n' +
        'n1.add(MaxPooling2D([2,2]));\n' +
        'n1.add(Conv2D(72,[5,5],[2,2],"same"));\n' +
        'n1.add(Deconv2D(72,[5,5],[2,2],"same"));\n' +
        'n1.add(Deconv2D(72,[5,5],[2,2],"same"));\n' +
        'n1.add(Deconv2D(72,[5,5],[2,2],"same"));\n' +
        'n1.add(Deconv2D(72,[5,5],[2,2],"same"));\n\n' +
        '' +
        '/* Part 3: Model Definition */\n\n' +
        '' +
        'model.add(n1);',

        '/* Example 5: ResNet */\n' +
        '\n' +
        '/* Part 1: Nodes Definition */\n' +
        '\n' +
        'var n1 = new Node();' +
        '\n' +
        '\n' +
        '/* Part 2: Neural Network */\n' +
        '\n' +
        'n1.add(Input(48,32,10));\n' +
        'n2 = n1.add(Conv2D(32,[10,10],[1,1],"same"));\n' +
        'n3 = n1.add(Conv2D(64,[5,5],[1,1],"same"));\n' +
        'n4 = n1.add(Conv2D(72,[10,10],[1,1],"same"));\n' +
        'n5 = n1.add(Conv2D(86,[10,10],[1,1],"same"));\n' +
        'n1.add(Dense(150));\n' +
        '\n' +
        '/* Part 3: Model Definition */\n' +
        '\n' +
        'model.add(n1);\n' +
        '\n' +
        'model.addShortcut(n2,n4);\n' +
        'model.addShortcut(n3,n5);',
        '/* Example 6: Recurrent NN */\n\n' + '/* Part 1: Nodes Definition */\n\nvar n1 = new Node();\n\n/* Part 2: Neural Network */\n\n' + 'var n2 = n1.add(Input(48,32,10));\n' + 'n1.add(Conv2D(32,[10,10], [1,1], "same"));\n' +
        'n1.add(MaxPooling2D([2,2]));\n' + 'n1.add(Conv2D(64,[5,5],[1,1],"same"));\n' + 'n1.add(Conv2D(86,[5,5],[1,1],"same"));\n' + 'var n3 = n1.add(Dense(200));\n\n' + '/* Part 3: Model Definition */\n\n' + 'model.add(n1);\n' + 'model.addShortcut(n2,n3)',
        '/* Example 7: Siamese with Shortcuts */\n'+
        '/* Part 1: Nodes Definition */\n'+'var n1 = new Node();\n'+
        'var n2 = new Node();\n'+
        'var n3 = new Node();\n'+
        'var n1a = new Node();\n'+
        'var n1a1 = new Node()\n'+
        'var n1a2 = new Node()\n'+
        'var n1b = new Node();\n'+


        '/* Part 2: Neural Network */\n'+

        'n1.add(Conv2D(32,[10,10],[1,1],"same",Input(48,32,10)));\n'+
        'n1.add(MaxPooling2D([2,2]));\n'+
        'n1.add(Conv2D(64,[5,5],[1,1],"same"));\n'+
        'n1.add(MaxPooling2D([2,2]));\n'+
        'n1.add(Conv2D(72,[10,10],[1,1],"same"));\n'+

        'n2.add(Input(48,32,10));\n'+
        'n2.add(Conv2D(32,[10,10],[1,1],"same"));\n'+
        'n2.add(MaxPooling2D([2,2]));\n'+
        'n2.add(Conv2D(64,[5,5],[1,1],"same"));\n'+
        'n2.add(MaxPooling2D([2,2]));\n'+
        'n2.add(Conv2D(72,[10,10],[1,1],"same"));\n'+

        'n1a.add(Input(32,32,20));\n'+
        'n1a.add(Conv2D(32,[10,10],[1,1],"same"));\n'+
        'n1a.add(MaxPooling2D([2,2]));\n'+
        'n1a.add(Conv2D(64,[5,5],[1,1],"same"));\n'+
        'n1a.add(MaxPooling2D(([2,2])));\n'+
        'n1a.add(Conv2D(64,[5,5],[1,1],"same"));\n'+

        'n1a1.add(Input(48,32,10));\n'+
        'n1a1.add(Conv2D(32,[10,10],[1,1],"same"));\n'+
        'n1a1.add(MaxPooling2D([2,2]));\n'+
        'n1a1.add(Conv2D(64,[5,5],[1,1],"same"));\n'+
        'n1a1.add(MaxPooling2D([2,2]));\n'+
        'n1a1.add(Conv2D(72,[10,10],[1,1],"same"));\n'+

        'n1b.add(Input(32,32,20));\n'+
        'n1b.add(Conv2D(32,[10,10],[1,1],"same"));\n'+
        'n1b.add(MaxPooling2D([2,2]));\n'+
        'n1b.add(Conv2D(64,[5,5],[1,1],"same"));\n'+
        'n1b.add(MaxPooling2D([2,2]));\n'+
        'n1b.add(Conv2D(64,[5,5],[1,1],"same"));\n'+



        'n3.add(Dense(150));\n'+
        'n3.add(Dense(350));\n'+

        '/* Part 3: Model Definition */\n'+

        'model.add(n3);\n'+
        'model.add(n1,n3);\n'+
        'model.add(n2,n3);\n'+
        'model.add(n1a,n1)\n'+
        'model.add(n1b,n1)\n'+
        'model.add(n1a1,n1)\n'+
        'model.addShortcut(n1,n1a)\n'+
        'model.addShortcut(n1,n1b)\n'+
        'model.addShortcut(n1a,n1b)\n'+
        'model.addShortcut(n2,n3)'
    ],

}

/**
 * Init de example of the code
 * @param {number} number 
 */
function init(number) {
    cm.setValue(example.data[number]);
    reducedNodes = []
    updatePreview(cm.getValue(),this.zoomCounter);
}

/**
 * 
 * Define the coordinate array
 * 
 * @param {dims} dims 
 * @returns 
 */

function allocate(dims) {
    if (dims.length === 0) {
        return 0;
    } else {
        var array = [];
        for (let i = 0; i < dims[0]; i++) {
            array.push(allocate(dims.slice(1)));
        }
        return array;
    }
}

/*COORDINATE CLASS*/
/**
 * Save the coordinates of three-dimensional figures
 */
class Coordinate {
    constructor(x, y, z) {
        this.coordinateMatrix = (function(dims) {
            return allocate(dims);
        })([3, 1]);
        this.coordinateMatrix[0][0] = x;
        this.coordinateMatrix[1][0] = y;
        this.coordinateMatrix[2][0] = z;
    }
    getX() {
        return this.coordinateMatrix[0][0];
    }
    getY() {
        return this.coordinateMatrix[1][0];
    }
    getZ() {
        return this.coordinateMatrix[2][0];
    }
    setX(x) {
        this.coordinateMatrix[0][0] = x;
    }
    setY(y) {
        this.coordinateMatrix[1][0] = y;
    }
    setZ(z) {
        this.coordinateMatrix[2][0] = z;
    }
    getCoordinateMatrix() {
        return this.coordinateMatrix;
    }
}

/*TUPLE CLASS*/
/**
 * It is made up of two numbers. Useful for defining neural functions
 */
class Tuple {
    constructor(n1, n2) {
        this.n1 = n1;
        this.n2 = n2;
    }

    getN1() {
        return this.n1;
    }
    getN2() {
        return this.n2;
    }
}

/*ALFA CLASS*/
/**
 * Stores the three angles of rotation on the three axes
 */
class Alfa {
    constructor(alfaX, alfaY, alfaZ) {
        this.alfaX = alfaX;
        this.alfaY = alfaY;
        this.alfaZ = alfaZ;
    }

    getAlfaX() {
        return this.alfaX;
    }
    getAlfaY() {
        return this.alfaY;
    }
    getAlfaZ() {
        return this.alfaZ;
    }
}

/*COLOR CLASS*/
/**
 * Stores the color of the figures
 */
class Color {
    constructor(input, cube, kernel, dense, pyramid, arrow, inputOpacity, layerOpacity, kernelOpacity, convOpacity, arrowOpacity, denseOpacity) {
        this.inputColor = input;
        this.cubeColor = cube;
        this.kernelColor = kernel;
        this.denseColor = dense;
        this.pyramidColor = pyramid;
        this.arrowColor = arrow;
        this.inputOpacity = inputOpacity;
        this.layerOpacity = layerOpacity;
        this.kernelOpacity = kernelOpacity;
        this.convOpacity = convOpacity;
        this.arrowOpacity = arrowOpacity;
        this.denseOpacity = denseOpacity;
    }
    getInputColor() {
        return this.inputColor;
    }
    getCubeColor() {
        return this.cubeColor;
    }
    getKernelColor() {
        return this.kernelColor;
    }
    getDenseColor() {
        return this.denseColor;
    }
    getPyramidColor() {
        return this.pyramidColor;
    }
    getArrowColor() {
        return this.arrowColor;
    }
    getInputOpacity() {
        return this.inputOpacity;
    }
    getLayerOpacity() {
        return this.layerOpacity;
    }
    getKernelOpacity() {
        return this.kernelOpacity;
    }
    getConvOpacity() {
        return this.convOpacity;
    }
    getArrowOpacity() {
        return this.arrowOpacity;
    }
    getDenseOpacity() {
        return this.denseOpacity;
    }
}

/*FONT CLASS*/
/**
 * Stores the font color, size, and font family.
 */
class Font {
    constructor(font_size, font_family, font_color) {
        this.font_size = font_size;
        this.font_family = font_family;
        this.font_color = font_color;
    }
    getFont_size() {
        return this.font_size;
    }
    getFont_family() {
        return this.font_family;
    }
    getFont_color() {
        return this.font_color;
    }
}

/*SHIFT CLASS*/
/**
 * Store the displacement of nodes, layers and child-parents nodes
 * 
 */
class Shift {
    constructor(shiftNodes, shiftLayers, shiftParent) {

        this.shiftNodes = shiftNodes;
        this.shiftLayers = shiftLayers;
        this.shiftParent = shiftParent;
    }
    getShiftLayers() {
        return this.shiftLayers;
    }
    getShiftNodes() {
        return this.shiftNodes;
    }
    getShiftParent() {
        return this.shiftParent;
    }
}

/*STROKE CLASS*/
/**
 * Store the color and width properties of the stroke
 */
class Stroke {
    constructor(stroke_color, stroke_width) {
        this.stroke_color = stroke_color;
        this.stroke_width = stroke_width;
    }
    getStroke_color() {
        return this.stroke_color;
    }
    getStroke_width() {
        return this.stroke_width;
    }
}

/*VIEWBOX CLASS */
/**
 * The panoramic
 *  Width
 *  Height
 *  Zoom
 */
class ViewBox {
    constructor(width, height, zoom) {
        this.width = width;
        this.height = height;
        this.zoom = zoom;
    }
    getWidth() {
        return this.width;
    }
    getHeight() {
        return this.height;
    }
    getZoom() {
        return this.zoom;
    }
}

/*DRAW SETTINGS */
/**
 * Class that stores all the neural network style configuration data.
 * These data come from the menu that the user modifies
 */
class DrawSettings {
    constructor(color, alfa, shift, font, stroke, viewBox, activateDepthLogs, activateWidhtLogs, activateLayerDimensions, activateKernelDimensions) {
        this.color = color;
        this.alfa = alfa;
        this.shift = shift;
        this.font = font;
        this.stroke = stroke;
        this.viewBox = viewBox;
        this.activateDepthLogs = activateDepthLogs;
        this.activateWidhtLogs = activateWidhtLogs;
        this.activateLayerDimensions = activateLayerDimensions;
        this.activateKernelDimensions = activateKernelDimensions;
    }
    getColor() {
        return this.color;
    }
    getAlfa() {
        return this.alfa;
    }
    getShift() {
        return this.shift;
    }
    getFont() {
        return this.font;
    }
    getStroke() {
        return this.stroke;
    }
    getViewBox() {
        return this.viewBox;
    }
    isActivateLayerDimensions() {
        return this.activateLayerDimensions;
    }
    isActivateKernelDimensions() {
        return this.activateKernelDimensions;
    }
    logWidth(num) {
        if (this.activateWidhtLogs) {
            let a = Math.log10(num)*100 +10;
            return a;
        } else if (num < 10) {
            return 10;
        }
        return num;
    }
    logDepth(num) {
        if (this.activateDepthLogs) {
            return Math.log(num) / Math.log(2);
        } else if (num < 10) {
            return 10;
        }
        return num;
    }
}

/*LAYERS CLASS */
/**
 * Execute neural functions
 * Input
 * Conv2D
 * Deconv2D
 * MaxPooling2D
 * Concatenate
 * Dense
 * 
 * Add more!
 */
class LayerController {
    constructor(drawSettings) {
        this.drawSettings = drawSettings;
    }
    Input(input) {
        input.isInputLayer = true;
        return input;
    }
    Conv2D$5(filters, kernel_size, strides, padding, actualCube) {
        let cubeList = new Array();
        let CNNCube = this.createKernel(actualCube.getZ(), kernel_size);
        cubeList.push(CNNCube);
        let convolution = this.setConvolution(filters, kernel_size, strides, padding, actualCube);
        cubeList.push(convolution);
        return cubeList;
    }
    Conv2D$6(filters, kernel_size, strides, input, padding) {
        let cubeList = new Array();
        let actualCube = new Cube(new Coordinate(input.x, input.y, input.z), this.drawSettings);
        actualCube.isInputLayer = true;
        cubeList.push(actualCube);
        let CNNCube = this.createKernel(actualCube.getZ(), kernel_size);
        cubeList.push(CNNCube);
        let convolution = this.setConvolution(filters, kernel_size, strides, padding, actualCube);
        cubeList.push(convolution);
        return cubeList;
    }
    Conv2D(...args$) {
        if (args$[4] instanceof Cube) {
            return this.Conv2D$5(...args$);
        } else {
            return this.Conv2D$6(...args$);
        }
    }
    Deconv2D$5(filters, kernel_size, strides, padding, actualCube) {
        let cubeList = new Array();
        let CNNCube = this.createKernel(actualCube.getZ(), kernel_size);
        cubeList.push(CNNCube);
        let deconvolution = this.setDeconvolution(filters, kernel_size, strides, padding, actualCube);
        cubeList.push(deconvolution);
        return cubeList;
    }
    Deconv2D$6(filters, kernel_size, strides, input, padding) {
        let cubeList = new Array();
        let actualCube = new Cube(new Coordinate(input.x, input.y, input.z), this.drawSettings);
        actualCube.isInputLayer = true;
        cubeList.push(actualCube);
        let CNNCube = this.createKernel(actualCube.getZ(), kernel_size);
        cubeList.push(CNNCube);
        let deconvolution = this.setDeconvolution(filters, kernel_size, strides, padding, actualCube);
        cubeList.push(deconvolution);
        return cubeList;
    }
    Deconv2D(...args$) {
        switch (args$.length) {
            case 5:
                return this.Deconv2D$5(...args$);
            case 6:
                return this.Deconv2D$6(...args$);
        }
    }
    MaxPooling2D(tuple, actualCube) {
        return this.setPooling(tuple, actualCube);
    }
    Dense(vector) {
        let cube = new Cube(new Coordinate(1, vector, 1), this.drawSettings);
        cube.setDenseLayer(true);
        return cube;
    }
    Concatenate(nodes) {
        let x = 0;
        let y = 0
        let z = 0;

        for (let n of nodes) {
            x += n.getLastCube().getX();
            y += n.getLastCube().getY();
            z += n.getLastCube().getZ();
        }
        return new Cube(new Coordinate(x, y, z), this.drawSettings);
    }
    setPooling(tuple, actualCube) {
        let x = (actualCube.getX()) / tuple.getN1();
        let y = (actualCube.getY()) / tuple.getN2();
        return this.setNewDimensions(x, y, actualCube.getZ());
    }
    setConvolution(filters, kernel_size, strides, padding, actualCube) {
        let output_w = actualCube.getX();
        let output_h = actualCube.getY();
        if (strides !== null && padding !== null) {
            if (padding == 'valid') {
                output_w = (actualCube.getX() - kernel_size.getN1() + 1) / strides.getN1();
                output_h = (actualCube.getY() - kernel_size.getN2() + 1) / strides.getN2();
            } else if (padding == 'same') {
                output_w = (actualCube.getX()) / strides.getN1();
                output_h = (actualCube.getY()) / strides.getN2();
            } else {
                throw new Error("The padding \'" + padding + "\' is not supported.");
            }
        }
        return this.setNewDimensions(output_w, output_h, filters);
    }
    setDeconvolution(filters, kernel_size, strides, padding, actualCube) {
        let output_w = actualCube.getX();
        let output_h = actualCube.getY();
        if (strides !== null && padding !== null) {
            if (padding == 'valid') {
                output_w = (actualCube.getX() - kernel_size.getN1() + 1) * strides.getN1();
                output_h = (actualCube.getY() - kernel_size.getN2() + 1) * strides.getN2();
            } else if (padding == 'same') {
                output_w = (actualCube.getX()) * strides.getN1();
                output_h = (actualCube.getY()) * strides.getN2();
            } else {
                throw new Error("The padding \'" + padding + "\' is not supported.");
            }
        }
        return this.setNewDimensions(output_w, output_h, filters);
    }
    createKernel(z, tuple) {
        let coordinates = new Coordinate(tuple.getN1(), tuple.getN2(), z);
        let kernel = new Cube(coordinates, this.drawSettings);
        kernel.setKernel(true);
        return kernel;
    }
    setNewDimensions(x, y, z) {
        let coordinate = new Coordinate(x, y, z);
        return new Cube(coordinate, this.drawSettings);
    }
    getDrawSettings() {
        return this.drawSettings;
    }
}

/**
 * User can create layer: Input Layer
 */
class InputLayer {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

/**
 * User can create layer: Conv2D Layer without input
 */

class Conv2DLayer {
    constructor(filters, kernel_size, strides, padding) {
        this.filters = filters;
        this.kernel_size = kernel_size;
        this.strides = strides;
        this.padding = padding;
    }
}

/**
 * User can create layer: Conv2D Layer with input
 */

class Conv2DInputLayer {
    constructor(filters, kernel_size, strides, padding, input) {
        this.filters = filters;
        this.kernel_size = kernel_size;
        this.strides = strides;
        this.padding = padding;
        this.input = input;
    }
}

/**
 * User can create layer: Deconv2D Layer without input
 */

class Deconv2DLayer {
    constructor(filters, kernel_size, strides, padding) {
        this.filters = filters;
        this.kernel_size = kernel_size;
        this.strides = strides;
        this.padding = padding;
    }
}

/**
 * User can create layer: Deconv2D Layer with input
 */

class Deconv2DInputLayer {
    constructor(filters, kernel_size, strides, padding, input) {
        this.filters = filters;
        this.kernel_size = kernel_size;
        this.strides = strides;
        this.padding = padding;
        this.input = input;
    }
}

/**
 * User can use the function: MaxPooling2D to reduce the dimensions
 */

class MaxPooling2DLayer {
    constructor(tuple) {
        this.tuple = tuple;
    }
}

/**
 * User can use the function: Concatenate to join two layers
 */

class ConcatenateLayer {
    constructor(nodes) {
        this.nodes = nodes
    }
}

/**
 * User can use the layer: Dense
 */

class DenseLayer {
    constructor(vector) {
        this.vector = vector;
    }
}

/**
 * INPUT Layer
 * The input image
 * 
 * @param {x} x 
 * @param {y} y 
 * @param {z} z 
 * @returns 
 */

function Input(x, y, z) {
    if (arguments.length == 3) {
        //Only input with positive valid numbers
        if (x > 0 && y > 0 && z > 0) {
            return new InputLayer(x, y, z);
        } else {
            throw new Error("The Input layer is poorly defined: (Only positive input numbers.) <p> Example: Input(32,32,20) with 3 arguments.</p>");
        }

    }
    throw new Error("The Input layer is poorly defined: (Invalid number of arguments.) <p> Example: Input(32,32,20) with 3 arguments.</p>");
}

/**
 * CONV2D Layer
 * Is a 2D Convolution Layer, this layer creates a convolution kernel 
 * that is wind with layers input which helps produce a tensor of outputs.
 * 
 * @param {filters} filters 
 * @param {kernel} kernel 
 * @param {strides} strides 
 * @param {padding} padding 
 * @param {input} input 
 * @returns 
 */

function Conv2D(filters, kernel, strides, padding, input) {
    //Check the arguments
    if ((arguments.length == 4 || arguments.length == 5) && kernel.length == 2 && strides.length == 2) {
        if (arguments.length == 5 && input == undefined) {
            throw new Error("The Conv2D layer is poorly defined: (Input Missing.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
        }
        for (let kern of kernel) {
            if (kern == undefined) {
                throw new Error("The Conv2D layer is poorly defined: (Kernel missing.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
            if (kern <= 0) {
                throw new Error("The Conv2D layer is poorly defined: (Kernel must have positive numbers.). <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
        }
        for (let str of strides) {
            if (str == undefined) {
                throw new Error("The Conv2D layer is poorly defined: (Strides missing.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
            if (str <= 0) {
                throw new Error("The Conv2D layer is poorly defined: (Strides must have positive numbers.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
        }
        if (filters <= 0) {
            throw new Error("The Conv2D layer is poorly defined: (Filters must be a positive number.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
        }
        if (input == undefined) {
            return new Conv2DLayer(filters, new Tuple(kernel[0], kernel[1]), new Tuple(strides[0], strides[1]), padding);
        } else {
            return new Conv2DInputLayer(filters, new Tuple(kernel[0], kernel[1]), new Tuple(strides[0], strides[1]), padding, input);
        }

    }
    throw new Error("The Conv2D layer is poorly defined: (Invalid number of arguments.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [1,1], 'same',Input(32,32,20)) with 5 arguments.</p>");
}

/**
 * DECONV2D Layer
 * Add a deconvolution layer to the node with the Deconv2D function 
 * that has these arguments.
 * 
 * @param {filters} filters 
 * @param {kernel} kernel 
 * @param {strides} strides 
 * @param {padding} padding 
 * @param {input} input 
 * @returns 
 */

function Deconv2D(filters, kernel, strides, padding, input) {
    if ((arguments.length == 4 || arguments.length == 5) && kernel.length == 2 && strides.length == 2) {
        if (arguments.length == 5 && input == undefined) {
            throw new Error("The Deconv2D layer is poorly defined: (Input Missing.) <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
        }
        for (let kern of kernel) {
            if (kern == undefined) {
                throw new Error("The Deconv2D layer is poorly defined: (Kernel missing.) <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
            if (kern <= 0) {
                throw new Error("The Deconv2D layer is poorly defined: (Kernel must have positive numbers.). <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
        }
        for (let str of strides) {
            if (str == undefined) {
                throw new Error("The Deconv2D layer is poorly defined: (Strides missing.) <p> Example: Conv2D(32, [10,10], [1,1], 'same') with 4 arguments.</p> or <p> Example: Conv2D(32, [10,10], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
            if (str <= 0) {
                throw new Error("The Deconv2D layer is poorly defined: (Strides must have positive numbers.) <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
            }
        }
        if (filters <= 0) {
            throw new Error("The Conv2D layer is poorly defined: (Filters must be a positive number.) <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
        }
        if (input == undefined) {
            return new Deconv2DLayer(filters, new Tuple(kernel[0], kernel[1]), new Tuple(strides[0], strides[1]), padding);
        } else {
            return new Deconv2DInputLayer(filters, new Tuple(kernel[0], kernel[1]), new Tuple(strides[0], strides[1]), padding, input);
        }

    }
    throw new Error("The Deconv2D layer is poorly defined: (Invalid number of arguments.) <p> Example: Deconv2D(32, [5,5], [2,2], 'same') with 4 arguments.</p> or <p> Example: Deconv2D(32, [5,5], [2,2], 'same',Input(32,32,20)) with 5 arguments.</p>");
}

/**
 * MAX POOLING 2D
 * Max pooling operation for 2D spatial data.
 * Downsamples the input representation by taking the maximum value over the window defined by pool_size for
 * each dimension along the features axis. The window is shifted by strides in each dimension.
 * 
 * @param {tuple} tuple 
 * @returns 
 */

function MaxPooling2D(tuple) {
    if (tuple.length == 2) {
        for (let tup of tuple) {
            if (tup == undefined) {
                throw new Error("The MaxPooling2D layer is poorly defined: (Value missing.) <p> Example: MaxPooling([2,2]) with 1 argument.</p>");
            }
            if (tup <= 0) {
                throw new Error("The MaxPooling2D layer is poorly defined: (Only positive numbers.) <p> Example: MaxPooling([2,2]) with 1 argument.</p>");
            }
        }
        return new MaxPooling2DLayer(new Tuple(tuple[0], tuple[1]));
    }
    throw new Error("The MaxPooling2D layer is poorly defined: (Invalid number of arguments.) <p> Example: MaxPooling([2,2]) with 1 argument.</p>");
}

/**
 * DENSE LAYER
 * A dense layer is just a regular layer of neurons in a neural network.
 * Each neuron recieves input from all the neurons in the previous layer, thus densely connected
 *
 * @param {vector} vector 
 * @returns 
 */

function Dense(vector) {
    if (arguments.length == 1) {
        if (vector <= 0) {
            throw new Error("The Dense layer is poorly defined: (Vector must be a positive number.) <p> Example: Dense(200) with 1 argument.</p>");
        }
        return new DenseLayer(vector);
    }
    throw new Error("The Dense layer is poorly defined: (Invalid number of arguments.) <p> Example: Dense(200) with 1 argument.</p>");
}

/**
 * Concatenate nodes
 * 
 * @param {Concatenate} nodes 
 * @returns 
 */

function Concatenate(nodes) {
    if (arguments.length == 1) {
        for (let node of nodes) {
            if (!(node instanceof Node)) {
                throw new Error("The Concatenate layer is poorly defined: (Arguments must be nodes.).<p> Example: Concatenate([x1,x2]) with 1 argument.</p>");
            }
        }
        return new ConcatenateLayer(nodes);
    }
    throw new Error("The Concatenate layer is poorly defined: (Invalid number of arguments.)<p> Example: Concatenate([x1,x2]) with 1 argument.</p>");
}


/*MATRICES*/
/**
 * Rotation Matrix in axis X
 */
class RotationMatrixX {
    constructor(alfa) {
        this.initializeMatrix(alfa);
    }
    initializeMatrix(alfa) {

        this.matrix = (function(dims) {
            return allocate(dims);
        })([3, 3]);
        this.matrix[0][0] = 1;
        this.matrix[1][0] = 0;
        this.matrix[2][0] = 0;

        this.matrix[0][1] = 0;
        this.matrix[1][1] = Math.cos(alfa * (Math.PI / 180));
        this.matrix[2][1] = Math.sin(alfa * (Math.PI / 180));

        this.matrix[0][2] = 0;
        this.matrix[1][2] = -(Math.sin(alfa * (Math.PI / 180)));
        this.matrix[2][2] = Math.cos(alfa * (Math.PI / 180));
    }
    getMatrix() {
        return this.matrix;
    }
}

/**
 * Rotation Matrix in axis Y
 */
class RotationMatrixY {
    constructor(alfa) {
        this.initializeMatrix(alfa);
    }
    initializeMatrix(alfa) {

        this.matrix = (function(dims) {
            return allocate(dims);
        })([3, 3]);
        this.matrix[0][0] = Math.cos(alfa * (Math.PI / 180));
        this.matrix[1][0] = 0;
        this.matrix[2][0] = -(Math.sin(alfa * (Math.PI / 180)));

        this.matrix[0][1] = 0;
        this.matrix[1][1] = 1;
        this.matrix[2][1] = 0;

        this.matrix[0][2] = Math.sin(alfa * (Math.PI / 180));
        this.matrix[1][2] = 0;
        this.matrix[2][2] = Math.cos(alfa * (Math.PI / 180));
    }
    getMatrix() {
        return this.matrix;
    }
}

/**
 * Rotation Matrix in axis Z
 */
class RotationMatrixZ {
    constructor(alfa) {
        this.initializeMatrix(alfa);
    }
    initializeMatrix(alfa) {

        this.matrix = (function(dims) {
            return allocate(dims);
        })([3, 3]);
        this.matrix[0][0] = Math.cos(alfa * (Math.PI / 180));
        this.matrix[1][0] = Math.sin(alfa * (Math.PI / 180));
        this.matrix[2][0] = 0;

        this.matrix[0][1] = -(Math.sin(alfa * (Math.PI / 180)));
        this.matrix[1][1] = Math.cos(alfa * (Math.PI / 180));
        this.matrix[2][1] = 0;

        this.matrix[0][2] = 0;
        this.matrix[1][2] = 0;
        this.matrix[2][2] = 1;
    }
    getMatrix() {
        return this.matrix;
    }
}

/*MATRIX CONTROLLER*/

/**
 * Rotation Matrix in axis Y
 * 
 * Perform translation and rotation with matrix operations
 * Multiply
 */
class MatrixController {
    constructor(alfaX, alfaY, alfaZ) {
        let rotationMatrixX = new RotationMatrixX(alfaX);
        let rotationMatrixY = new RotationMatrixY(alfaY);
        let rotationMatrixZ = new RotationMatrixZ(alfaZ);
        this.matrix = this.multiply(rotationMatrixZ.getMatrix(), rotationMatrixX.getMatrix());
        this.matrix = this.multiply(this.matrix, rotationMatrixY.getMatrix());
    }
    rotate(coordinates) {
        this.setNewCoordinates(coordinates);
    }
    move(axis, coordinates, length) {
        switch (axis) {
            case "x":
                {
                    for (let i = 0; i < 11; i++) {
                        coordinates[i].setX(coordinates[i].getX() + length);
                    }
                    break;
                }
            case "y":
                {
                    for (let i = 0; i < 11; i++) {
                        coordinates[i].setY(coordinates[i].getY() + length);
                    }
                    break;
                }
            case "z":
                {
                    for (let i = 0; i < 11; i++) {
                        coordinates[i].setZ(coordinates[i].getZ() + length);
                    }
                    break;
                }
        }
    }
    setNewCoordinates(coordinates) {
        let c0 = this.multiply(this.matrix, coordinates[0].getCoordinateMatrix());
        let c1 = this.multiply(this.matrix, coordinates[1].getCoordinateMatrix());
        let c2 = this.multiply(this.matrix, coordinates[2].getCoordinateMatrix());
        let c3 = this.multiply(this.matrix, coordinates[3].getCoordinateMatrix());
        let c4 = this.multiply(this.matrix, coordinates[4].getCoordinateMatrix());
        let c5 = this.multiply(this.matrix, coordinates[5].getCoordinateMatrix());
        let c6 = this.multiply(this.matrix, coordinates[6].getCoordinateMatrix());
        let c7 = this.multiply(this.matrix, coordinates[7].getCoordinateMatrix());
        let c8 = this.multiply(this.matrix, coordinates[8].getCoordinateMatrix());
        let c9 = this.multiply(this.matrix, coordinates[9].getCoordinateMatrix());
        let c10 = this.multiply(this.matrix, coordinates[10].getCoordinateMatrix());
        coordinates[0] = new Coordinate(c0[0][0], c0[1][0], c0[2][0]);
        coordinates[1] = new Coordinate(c1[0][0], c1[1][0], c1[2][0]);
        coordinates[2] = new Coordinate(c2[0][0], c2[1][0], c2[2][0]);
        coordinates[3] = new Coordinate(c3[0][0], c3[1][0], c3[2][0]);
        coordinates[4] = new Coordinate(c4[0][0], c4[1][0], c4[2][0]);
        coordinates[5] = new Coordinate(c5[0][0], c5[1][0], c5[2][0]);
        coordinates[6] = new Coordinate(c6[0][0], c6[1][0], c6[2][0]);
        coordinates[7] = new Coordinate(c7[0][0], c7[1][0], c7[2][0]);
        coordinates[8] = new Coordinate(c8[0][0], c8[1][0], c8[2][0]);
        coordinates[9] = new Coordinate(c9[0][0], c9[1][0], c9[2][0]);
        coordinates[10] = new Coordinate(c10[0][0], c10[1][0], c10[2][0]);
    }
    multiply(a, b) {
        var c = (function(dims) {
            return allocate(dims);
        })([a.length, b[0].length]);
        for (let i = 0; i < c.length; i++) {
            for (var j = 0; j < c[0].length; j++) {
                for (var k = 0; k < b.length; k++) {
                    c[i][j] += a[i][k] * b[k][j];
                }
            }
        }
        
        return c;
    }
}

/*MODEL CLASS*/
/**
 * Stores all nodes in a data structure 
 * (NeuralNetworkTree)
 */
class Model {
    constructor() {
        this.modelTree = new NeuralNetworkTree();
    }
    getModelTree() {
        return this.modelTree;
    }
    add$1(x1) {
        if (x1.getReduced())
            throw new Error("The root node can't be reduced");

        this.modelTree.addRoot(x1);
    }
    add$2(child, parent) {
        this.modelTree.add(child, parent);
    }
    add(...args$) {
        for (let arg of args$) {
            if (!(arg instanceof Node)) {
                throw new Error("The function model.add() is poorly defined. <p> Example: model.add(x1) if is the parent or model.add(x1,x2) if x1 is child of x2.</p>");
            }
        }
        switch (args$.length) {
            case 1:
                return this.add$1(...args$);
            case 2:
                return this.add$2(...args$);
            default:
                throw new Error("The function model.add() is poorly defined. <p> Example: model.add(x1) if is the parent or model.add(x1,x2) if x1 is child of x2.</p>");
        }
    }
    addJump(n1, n2) {
        let jump = new Array();
        jump.push(n1);
        jump.push(n2);
        this.getModelTree().getJumps().push(jump);
    }
    addShortcut(n1, n2, curve) {
        let shortcut = new Array();
        shortcut.push(n1);
        shortcut.push(n2);
        if (curve=="curve")
            shortcut.push(true)
        this.getModelTree().getShortcuts().push(shortcut);
    }

}

//SHAPES

/*ARROW CLASS*/
/**
 * Figure to draw the junctions between nodes
 */
class Arrow {
    constructor(vertex1, vertex2) {
        this.vertex1 = vertex1;
        this.vertex2 = vertex2;
        this.coordinates = new Array();
        this.coordinates.push(new Coordinate(vertex1.getX(), vertex1.getY(), vertex1.getZ()));
        this.coordinates.push(new Coordinate(vertex2.getX(), vertex2.getY(), vertex2.getZ()));
    }
    getCoordinates() {
        return this.coordinates;
    }
    getVertex1() {
        return this.vertex1;
    }
    getVertex2() {
        return this.vertex2;
    }
}

class PointerArrow {
    constructor(vertex1,vertex2){
        this.vertex1 = vertex1
        this.vertex2 = vertex2
        this.coordinates = new Array();
        this.coordinates.push(new Coordinate(vertex1.getX(), vertex1.getY(), vertex1.getZ()));
        this.coordinates.push(new Coordinate(vertex2.getX(), vertex2.getY(), vertex2.getZ()));
    }
    getCoordinates() {
        return this.coordinates;
    }
    getVertex1(){
        return this.vertex1
    }
    getVertex2(){
        return this.vertex2
    }
    
}


/*CUBE CLASS*/

/**
 * Figure to draw the layers of the nodes
 */
class Cube {
    constructor$2(coordinates, drawSettings) {
        this.initializeCube(coordinates, drawSettings);
    }
    constructor(...args$) {
        switch (args$.length) {
            case 0:
                return this.constructor$0(...args$);
            case 2:
                return this.constructor$2(...args$);
        }
    }
    initializeCube(coordinate, drawSettings) {
        this.x = coordinate.getX();
        this.y = coordinate.getY();
        this.z = coordinate.getZ();
        this.isDenseLayer = false;
        this.isKernel = false;
        this.isInputLayer = false;
        let x_aux = drawSettings.logWidth(this.x);
        let y_aux = drawSettings.logWidth(this.y);
        let z_aux = drawSettings.logDepth(this.z);
        this.coordinates = new Array();
        this.coordinates.push(new Coordinate(-(x_aux / 2), -(y_aux / 2), z_aux / 2));
        this.coordinates.push(new Coordinate(x_aux / 2, -(y_aux / 2), z_aux / 2));
        this.coordinates.push(new Coordinate(-(x_aux / 2), (y_aux / 2), z_aux / 2));
        this.coordinates.push(new Coordinate(x_aux / 2, y_aux / 2, z_aux / 2));
        this.coordinates.push(new Coordinate(-(x_aux / 2), -(y_aux / 2), -(z_aux / 2)));
        this.coordinates.push(new Coordinate(x_aux / 2, -(y_aux / 2), -(z_aux / 2)));
        this.coordinates.push(new Coordinate(-(x_aux / 2), y_aux / 2, -(z_aux / 2)));
        this.coordinates.push(new Coordinate(x_aux / 2, y_aux / 2, -(z_aux / 2)));

        let x_random = 0.5*(this.coordinates[5].getX() - this.coordinates[4].getX()) + this.coordinates[4].getX();
        let y_random = 0.5*(this.coordinates[6].getY() - this.coordinates[4].getY()) + this.coordinates[4].getY();
        this.coordinates.push(new Coordinate(x_random, y_random, this.coordinates[4].getZ()));

        //Shortcut CNN
        this.coordinates.push(new Coordinate(0, this.coordinates[0].getY() - 30, 0));
        this.coordinates.push(new Coordinate(0, this.coordinates[0].getY(), 0));
    }
    getX() {
        return this.x;
    }
    getY() {
        return this.y;
    }
    getZ() {
        return this.z;
    }
    isKernel() {
        return this.isKernel;
    }
    setKernel(kernel) {
        this.isKernel = kernel;
    }
    getCoordinates() {
        return this.coordinates
    }
    isDenseLayer() {
        return this.isDenseLayer;
    }
    setDenseLayer(denseLayer) {
        this.isDenseLayer = denseLayer;
    }
}

/*PYRAMID CLASS*/

/**
 * Figure to draw the convolutions of the layers
 */
class Pyramid {
    constructor(coordinates, point) {
        this.initializePyramid(coordinates, point);
    }
    initializePyramid(coordinates, point) {
        this.vertex = new Coordinate(point.getX(), point.getY(), point.getZ());
        this.coordinates = new Array();
        this.coordinates.push(new Coordinate(coordinates[0].getX(), coordinates[0].getY(), coordinates[0].getZ()));
        this.coordinates.push(new Coordinate(coordinates[1].getX(), coordinates[1].getY(), coordinates[1].getZ()));
        this.coordinates.push(new Coordinate(coordinates[2].getX(), coordinates[2].getY(), coordinates[2].getZ()));
        this.coordinates.push(new Coordinate(coordinates[3].getX(), coordinates[3].getY(), coordinates[3].getZ()));
        this.coordinates.push(new Coordinate(point.getX(), point.getY(), point.getZ()));
    }
    getCoordinates() {
        return this.coordinates;
    }
    getVertex() {
        return this.vertex;
    }
}



/*NODE CLASS*/
/**
 * Tree element that contains the set of layers represented as cubic figures
 */
class Node {
    constructor() {
        this.cubeList = new Array();
        this.lastCube = null;
        this.parent = new Array();
        this.children = new Array();
        this.actualCube = null;
        this.reduced = false
        this.numeration = null;
    }
    getReduced(){
        return this.reduced
    }
    setReduced(bool){  
        this.reduced = bool
    }
    getCubeList() {
        return this.cubeList;
    }
    setCubeList(cubelist) {
        this.cubeList = cubelist;
    }
    getLastCube() {
        return this.lastCube;
    }
    setLastCube(cube) {
        this.lastCube = cube;
    }
    setNumeration(number){
        this.numeration = number
    }
    getNumeration(){
        return this.numeration
    }
    setLast() {
        if (!this.getCubeList().length == 0) {
            this.setLastCube(this.cubeList[this.getCubeList().length - 1]);
        }
    }
    setParents(parents) {
        this.parents = parents;
    }
    getChildren() {
        return this.children;
    }
    getParents() {
        return this.parents;
    }
    getActualCube() {
        return this.actualCube;
    }
    setActualCube(cube) {
        this.actualCube = cube;
    }
    reduce(){
        this.setReduced(true)
    }

    add(input) {
        if (input instanceof InputLayer) {
            for (let cube of this.cubeList) {
                if (cube.isInputLayer) {
                    throw new Error('There is already an input layer.');
                }
            }
            let inputCube = layerController.Input(new Cube(new Coordinate(input.x, input.y, input.z), layerController.getDrawSettings()));
            this.cubeList.push(inputCube);
            this.setLast();
            this.setActualCube(this.getLastCube());

            return createAuxNode(inputCube);

        } else if (input instanceof Conv2DLayer || input instanceof Conv2DInputLayer) {
            let convolutionList;
            if (input.input == undefined) {
                if ((this.getActualCube() == null || this.cubeList.length == 0)) {
                    throw new Error('The node does not have an input layer.');
                }
                if (this.actualCube.isDenseLayer) {
                    throw new Error('Can not Conv2D a dense layer.');
                }
                convolutionList = layerController.Conv2D(input.filters, input.kernel_size, input.strides, input.padding, this.getActualCube());
            } else {
                for (let cube of this.cubeList) {
                    if (cube.isInputLayer) {
                        throw new Error('There is already an input layer.');
                    }
                }
                convolutionList = layerController.Conv2D(input.filters, input.kernel_size, input.strides, input.input, input.padding);
            }
            Array.prototype.push.apply(this.cubeList, convolutionList);
            this.setLast();
            this.setActualCube(this.getLastCube());

            return createAuxNodeList(convolutionList);
        } else if (input instanceof Deconv2DLayer || input instanceof Deconv2DInputLayer) {
            let deconvolutionList;
            if (input.input == undefined) {
                if ((this.getActualCube() == null || this.cubeList.length == 0)) {
                    throw new Error('The node does not have an input layer.');
                }
                if (this.actualCube.isDenseLayer) {
                    throw new Error('Can not Deconv2D a dense layer.');
                }
                deconvolutionList = layerController.Deconv2D(input.filters, input.kernel_size, input.strides, input.padding, this.getActualCube())
            } else {
                for (let cube of this.cubeList) {
                    if (cube.isInputLayer) {
                        throw new Error('There is already an input layer.');
                    }
                }
                deconvolutionList = layerController.Deconv2D(input.filters, input.kernel_size, input.strides, input.input, input.padding);
            }

            Array.prototype.push.apply(this.cubeList, deconvolutionList);
            this.setLast();
            this.setActualCube(this.getLastCube());

            return createAuxNodeList(deconvolutionList);
        } else if (input instanceof MaxPooling2DLayer) {
            if (this.getActualCube() == null || this.cubeList.length == 0) {
                throw new Error('The node does not have an input layer.');
            }
            this.setActualCube(layerController.MaxPooling2D(input.tuple, this.getActualCube()));
        } else if (input instanceof DenseLayer) {
            let denseCube = layerController.Dense(input.vector);
            this.cubeList.push(denseCube);
            this.setLast();
            this.setActualCube(this.getLastCube());
            return createAuxNode(denseCube);
        } else if (input instanceof ConcatenateLayer) {
            for (let n of input.nodes) {
                if (n.cubeList.length == 0) {
                    throw new Error('Could not concatenate because some node has no convolutions or input.');
                }
            }
            let concatenatedCube = layerController.Concatenate(input.nodes)
            this.cubeList.push(concatenatedCube);
            this.setLast();
            this.setActualCube(this.getLastCube());

            return createAuxNode(concatenatedCube)
        }
    }

}

function createAuxNode(cube){
    let node = new Node();
    let cubes = new Array();
    cubes.push(cube);
    node.setCubeList(cubes);
    node.setLastCube(cube);
    node.setActualCube(node.getLastCube());
    return node;
}
function setReducedNode(number){
    reducedNodes[number] = !reducedNodes[number]
    updatePreview(cm.getValue(), getViewBox())
}
function changeShortcut(number){
    shortcutsNumber[number] = !shortcutsNumber[number]
    updatePreview(cm.getValue(), getViewBox())
}

function assignNumeration(node){
    for (let child of node.getChildren()){
        if (child.getNumeration() == null){ //Necesario asegurarse de que el nodo no ha sido marcado por un camino recurrente
            counterNodes++
            child.setNumeration(counterNodes)
            nodesMap.set(counterNodes,child)
        }
        assignNumeration(child)
    }

}

function counterTotalNodes(modelTree){
    for (let nodeList of modelTree.getNodes()) 
        for (let parent of nodeList) 
            for (let child of parent.getChildren()){
                totalNodes++;
            }
}


function setNodesReducedOnTree(modelTree){
    let node = modelTree.getRoot()
    nodesMap.set(counterNodes,node)
    assignNumeration(node)   
    for (let i=1; i<reducedNodes.length; i++){
        if (reducedNodes[i]){
            
            nodesMap.get(i).setReduced(true)
        }
    }
}

function setReducers(){
    showReduce = !showReduce
    updatePreview(cm.getValue(),getViewBox())
}

function getViewBox(){
    return svg.getViewBox()
}


function createAuxNodeList(cubes){
    let node = new Node();
    node.setCubeList(cubes);
    node.setLastCube(cubes[cubes.length-1]);
    node.setActualCube(node.getLastCube());
    return node;
}

/*NEURALNETOWRK TREE*/
/**
 * Model data structure
 * It is a n-ary tree with several parents
 */
class NeuralNetworkTree {
    constructor() {
        this.root = null;
        this.nodes = null;
        this.jumps = new Array();
        this.shortcuts = new Array();
    }
    isEmpty() {
        return (this.root == null);
    }
    getRoot(){
        return this.root
    }
    isLeaf(node) {
        return (node.getChildren() === null) || (node.getChildren().length == 0);
    }
    isRoot(node) {
        return (node === this.root);
    }
    getNodes() {
        return this.nodes;
    }
    getJumps() {
        return this.jumps;
    }
    getShortcuts() {
        return this.shortcuts;
    }
    root() {
        if (this.root === null) {
            throw new Error('There is no parent node in the model.');
        }
        return this.root;
    }
    addRoot(node) {

        if (this.isEmpty()) {
            this.root = node;
        } else {
            throw new Error('The model already has a parent node.');
        }
    }
    add(child, parent) {
        parent.getChildren().push(child);
        if (child.getParents() == null) {
            child.setParents(new Array());
        }
        child.getParents().push(parent);
    }
    levels(node, maxDepth) {
        if (node !== null) {
            if (this.isLeaf(node)) {
                if (!this.nodes[maxDepth - 1].includes(node)) {
                    this.nodes[maxDepth - 1].push(node);
                }
            } else {
                let level = this.level(node, 0);
                if (!this.nodes[level].includes(node)) {
                    this.nodes[level].push(node);
                }
                for (let child of node.getChildren()) {
                    this.levels(child, maxDepth);
                }
            }
        }
    }
    maxDepth(root) {
        if (this.root === null) {
            return 0;
        }
        let max = Number.MIN_VALUE;
        for (let child of root.getChildren()) {
            max = Math.max(max, this.maxDepth(child));
        }
        return 1 + Math.max(max, 0);
    }
    level(node, level) {
        if (node.getParents() != null) {
            level++;
            for (let parent of node.getParents()) {
                level = Math.max(level, this.level(parent, level));
            }
        }
        return level;
    }
    greaterDepthChild(children) {
        let max = Number.MIN_VALUE;
        for (let child of children) {
            if (child.getLastCube().getCoordinates()[0].getZ() > max) {
                max = child.getLastCube().getCoordinates()[0].getZ();
            }
        }
        return max;
    }
    findLastChild(nodes) {
        let max = Number.MIN_VALUE;
        let lastChild = null;
        for (let node of nodes) {
            let cube = node.getCubeList()[0];
            if (cube.getCoordinates()[1].getX() > max) {
                max = cube.getCoordinates()[1].getX();
                lastChild = node;
            }
        }
        return lastChild;
    }
    findFirstChild(nodes) {
        let min = Number.MAX_VALUE;
        let firstChild = null;
        for (let node of nodes) {
            let cube = node.getCubeList()[0];
            if (cube.getCoordinates()[1].getX() < min) {
                min = cube.getCoordinates()[1].getX();
                firstChild = node;
            }
        }
        return firstChild;
    }
    check() {
        for (let nodes of this.getNodes()) {
            for (let node of nodes) {
                if (node.getCubeList().length == 0 || node.getCubeList() === null) {
                    throw new Error('The neural network is poorly defined. There may be a node that has not added convolutions.');
                }
            }
        }
    }
    initializeNodes() {
        let maxDepth = this.maxDepth(this.root);
        this.nodes = new Array();
        for (let i = 0; i < maxDepth; i++) {
            this.nodes.push(new Array());
        }
        this.levels(this.root, maxDepth);
        this.check();
        this.nodes.reverse();
    }
}

/*SVGCONTROLLER CLASS */

/**
 * Class that shifts the neural structure and paints the layers. 
 * Generate the final SVG file
 */
class SvgController {
    constructor(settings) {
        this.depth = 0;
        this.depthAux = 0;
        this.length = 0;
        this.lengthAux = 0;
        this.activate = false;
        this.aux = '';
        this.z = 0;
        this.imageCenter = null;
        this.x_max = -Number.MAX_VALUE;
        this.y_max = -Number.MAX_VALUE;
        this.z_max = -Number.MAX_VALUE;
        this.x_min = Number.MAX_VALUE;
        this.y_min = Number.MAX_VALUE;
        this.z_min = Number.MAX_VALUE;
        this.drawOrderList = new Array();
        this.svgString = '';

        this.drawSettings = settings;
        this.matrixController = new MatrixController(this.drawSettings.getAlfa().getAlfaX(), this.drawSettings.getAlfa().getAlfaY(), this.drawSettings.getAlfa().getAlfaZ());
    }
    draw(modelTree) {
        setNodesReducedOnTree(modelTree)
        this.shiftTree(modelTree);
        this.calculateImageCenter();     
        for (let nodes of modelTree.getNodes()) {
                for (let node of nodes){
                    if (node.getReduced()) {
                        this.drawNode(node,true)
                    }
                    else this.drawNode(node,false);
            }
        }
        this.drawUnions(modelTree);
        this.drawJumps(modelTree.getJumps());
        this.drawShortcuts(modelTree.getShortcuts())
        if (showReduce) this.drawReducer(modelTree)
        console.log(this.drawOrderList)
        this.drawOrderList.sort((a, b) => (a.getZ() > b.getZ()) ? -1 : 1)
        this.addHeader();
        for (let n of this.drawOrderList) {
            this.svgString += n.getSvgString();
        }
       // this.svgString += this.aux
        this.addFooter();
        return this.svgString;
    }
    shiftTree(modelTree) {
        modelTree.initializeNodes();
        for (let i = 0; i < modelTree.getNodes().length; i++) {
            if (i === 0) {
                for (let j = 0; j < modelTree.getNodes()[i].length; j++) {
                    let node = modelTree.getNodes()[i][j];
                    if (j !== 0) {
                        let l = 0;
                        if (node.getCubeList()[0].getX() > modelTree.getNodes()[i][j - 1].getCubeList()[0].getX()) {
                            l = Math.abs(node.getCubeList()[0].getCoordinates()[0].getX() - this.lengthAux);
                        } else {
                            l = Math.abs(this.lengthAux - node.getCubeList()[0].getCoordinates()[0].getX());
                        }
                        this.length += l + this.drawSettings.getShift().getShiftNodes();
                    }
                    this.lengthAux = node.getCubeList()[0].getCoordinates()[1].getX();
                    this.shiftNode(node);
                    this.depth = 0;
                    this.depthAux = 0;
                }
            } else {
                for (let node of modelTree.getNodes()[i]) {
                    let firstChild = modelTree.findFirstChild(node.getChildren());
                    let lastChild = modelTree.findLastChild(node.getChildren());
                    let centerChild1 = this.calculateCenter(firstChild.getCubeList()[0].getCoordinates());
                    let centerChild2 = this.calculateCenter(lastChild.getCubeList()[0].getCoordinates());
                    this.length = (Math.abs(centerChild1.getX() + centerChild2.getX()) / 2);
                    let depth = modelTree.greaterDepthChild(node.getChildren());
                    let depthCube = node.getCubeList()[0].getCoordinates()[1].getZ();
                    let l = Math.abs(depth + depthCube);
                    this.depth = l + this.drawSettings.getShift().getShiftParent();
                    this.shiftNode(node);
                }
                this.depth = 0;
                this.depthAux = 0;
            }
            this.length = 0;
        }
    }
    drawNode(node,reduced) {
        if(!reduced){
            let modelQueue = node.getCubeList();
            for (let i = 0; i < modelQueue.length; i++) {
                let cube = modelQueue[i];
                this.doTransformations(cube.getCoordinates());
                if (this.activate) {
                    let kernelCube = modelQueue[i - 1];
                    let vertex = cube.getCoordinates()[8];
                    let pyramid = new Pyramid(kernelCube.getCoordinates().slice(0, 4), new Coordinate(vertex.getX(), vertex.getY(), vertex.getZ()));
                    this.drawPyramid(pyramid, kernelCube);
                    this.activate = false;
                }
                if (i !== modelQueue.length - 1) {
                    if (modelQueue[i + 1].isDenseLayer) {
                        this.drawSingleCube(cube);
                    }
                }
                if (i === modelQueue.length - 1 || cube.isDenseLayer) {
                    this.drawSingleCube(cube);
                } else {
                    this.drawCube(cube);
                }
                if (cube.isDenseLayer && i != 0) {
                    let lastCube = modelQueue[i - 1];
                    this.lineTo(lastCube, cube);
                }
                if (cube.isKernel) {
                    this.activate = true;
                }
                this.updateMaxMin(cube.getCoordinates());
            }
        }else{
            let cube = node.getCubeList()
            let actualcube = cube[2]
            this.doTransformations(actualcube.getCoordinates())
            this.drawCube(actualcube,reduced)
            return actualcube
        }
    }
    drawSingleCube(cube) {
        let round = "round"
        let color = this.selectColor(cube);
        let opacity = this.selectOpacity(cube);
        let svg = '';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + '\'/>' + '\n';
        if (this.drawSettings.isActivateLayerDimensions()) {
            svg += this.drawText(cube);
        }
        let z = this.calculateAverageZ(cube.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }
    drawUnions(modelTree) {
        for (let nodeList of modelTree.getNodes()) {
            for (let parent of nodeList) {
                for (let child of parent.getChildren()) {
                    let lastCube = child.getLastCube();
                    if (child.getReduced() && parent.getReduced()) 
                        this.lineTo(child.getCubeList()[2], parent.getCubeList()[2])
                    else if(child.getReduced())
                            this.lineTo(child.getCubeList()[2], parent.getCubeList()[0])
                    else if (parent.getReduced())
                            this.lineTo(lastCube, parent.getCubeList()[2]);                                    
                    else    
                            this.lineTo(lastCube, parent.getCubeList()[0]);
                    
                }
            }
        }
    }

    drawCube(cube,reduced) {
        let round= "round"
        let color = this.selectColor(cube);
        let opacity = this.selectOpacity(cube);
        let svg = '';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + ' L' + cube.getCoordinates()[1].getX() + ' ' + cube.getCoordinates()[1].getY() + ' L' + cube.getCoordinates()[5].getX() + ' ' + cube.getCoordinates()[5].getY() + ' L' + cube.getCoordinates()[4].getX() + ' ' + cube.getCoordinates()[4].getY() + ' L' + cube.getCoordinates()[0].getX() + ' ' + cube.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + opacity + '\' fill=\'' + color + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + ' L' + cube.getCoordinates()[3].getX() + ' ' + cube.getCoordinates()[3].getY() + ' L' + cube.getCoordinates()[7].getX() + ' ' + cube.getCoordinates()[7].getY() + ' L' + cube.getCoordinates()[6].getX() + ' ' + cube.getCoordinates()[6].getY() + ' L' + cube.getCoordinates()[2].getX() + ' ' + cube.getCoordinates()[2].getY() + '\'/>' + '\n';
        if(reduced){
            if (this.drawSettings.isActivateLayerDimensions()) {
                svg += this.drawText(cube);
            }
            this.aux = svg + this.aux;
            let sn = new SortNode(this.aux, this.calculateAverageZ(cube.getCoordinates()));
            this.drawOrderList.push(sn);
        }else{
            if (cube.isKernel) {
                this.aux = svg + this.aux;
                let sn = new SortNode(this.aux, this.z);
                this.drawOrderList.push(sn);
            } else {
                if (this.drawSettings.isActivateLayerDimensions()) {
                    svg += this.drawText(cube);
                }
                this.aux = svg;
                this.z = this.calculateAverageZ(cube.getCoordinates());
            }
        }
    }

    drawText(cube) {
        let svg = '';
        svg += '\t\t<text font-size="' + this.drawSettings.getFont().getFont_size() + '" font-family="' + this.drawSettings.getFont().getFont_family() + '" fill="' + this.drawSettings.getFont().getFont_color() + '"  x=\'' + ((cube.getCoordinates()[4].getX() + cube.getCoordinates()[6].getX()) / 2) + '\' y=\'' + (cube.getCoordinates()[4].getY() + cube.getCoordinates()[6].getY()) / 2 + '\'>' + (cube.getY()) + '</text>\n';
        svg += '\t\t<text font-size="' + this.drawSettings.getFont().getFont_size() + '" font-family="' + this.drawSettings.getFont().getFont_family() + '" fill="' + this.drawSettings.getFont().getFont_color() + '" x=\'' + ((cube.getCoordinates()[6].getX() + cube.getCoordinates()[7].getX()) / 2) + '\' y=\'' + (cube.getCoordinates()[6].getY() + cube.getCoordinates()[7].getY()) / 2 + '\'>' + (cube.getX()) + '</text>\n';
        svg += '\t\t<text font-size="' + this.drawSettings.getFont().getFont_size() + '" font-family="' + this.drawSettings.getFont().getFont_family() + '" fill="' + this.drawSettings.getFont().getFont_color() + '" x=\'' + ((cube.getCoordinates()[4].getX() + cube.getCoordinates()[0].getX()) / 2) + '\' y=\'' + (cube.getCoordinates()[0].getY() + cube.getCoordinates()[4].getY()) / 2 + '\'>' + (cube.getZ()) + '</text>\n';
        return svg;

    }

    drawNodeReducersText(arr,vertex1,vertex2,node){

        let x = (vertex1.getX() + vertex2.getX()) 
        if ((vertex1.getX()>0 && vertex2.getX()>0) || (vertex1.getX()<0 && vertex2.getX()<0) ) 
            x = x/2
        let y = (vertex1.getY() + vertex2.getY()) - 8
        if ((vertex1.getY()>0 && vertex2.getY()>0) || (vertex1.getY()<0 && vertex2.getY()<0)) 
            y = y/2
        let svg = '';
        svg += 'buscame'
        let showedNumber = node.getNumeration()-1 
        svg += '\t\t<text font-size="' + this.drawSettings.getFont().getFont_size() + '" font-family="' + this.drawSettings.getFont().getFont_family() + '" fill="' + this.drawSettings.getFont().getFont_color() + '"  x=\'' + x + '\' y=\'' + y + '\'> Node ' + showedNumber+ '</text>\n';
        let z = this.calculateAverageZ(arr.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }

    drawTextPyramid(pyramid, kernel) {
        return '\t\t<text font-size="' + this.drawSettings.getFont().getFont_size() + '" font-family="' + this.drawSettings.getFont().getFont_family() + '" fill="' + this.drawSettings.getFont().getFont_color() + '"' + " x=\"" + ((pyramid.getCoordinates()[0].getX() + pyramid.getCoordinates()[1].getX() + pyramid.getVertex().getX()) / 3) + "\" y=\"" + (pyramid.getCoordinates()[0].getY() + (pyramid.getVertex().getY() - 7)) / 2 + "\" " + ">" + "[" + (kernel.getX()) + "," + (kernel.getY()) + "]" + "</text>\n";
    }
    drawPyramid(pyramid, kernel) {
        let round = "round"
        let svg = '';
        svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getConvOpacity() + '\' fill=\'' + this.drawSettings.getColor().getPyramidColor() + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + pyramid.getCoordinates()[0].getX() + ' ' + pyramid.getCoordinates()[0].getY() + ' L' + pyramid.getCoordinates()[1].getX() + ' ' + pyramid.getCoordinates()[1].getY() + ' L' + pyramid.getVertex().getX() + ' ' + pyramid.getVertex().getY() + ' L' + pyramid.getCoordinates()[0].getX() + ' ' + pyramid.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getConvOpacity() + '\' fill=\'' + this.drawSettings.getColor().getPyramidColor() + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + pyramid.getCoordinates()[0].getX() + ' ' + pyramid.getCoordinates()[0].getY() + ' L' + pyramid.getCoordinates()[2].getX() + ' ' + pyramid.getCoordinates()[2].getY() + ' L' + pyramid.getVertex().getX() + ' ' + pyramid.getVertex().getY() + ' L' + pyramid.getCoordinates()[0].getX() + ' ' + pyramid.getCoordinates()[0].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getConvOpacity() + '\' fill=\'' + this.drawSettings.getColor().getPyramidColor() + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + pyramid.getCoordinates()[1].getX() + ' ' + pyramid.getCoordinates()[1].getY() + ' L' + pyramid.getCoordinates()[3].getX() + ' ' + pyramid.getCoordinates()[3].getY() + ' L' + pyramid.getVertex().getX() + ' ' + pyramid.getVertex().getY() + ' L' + pyramid.getCoordinates()[1].getX() + ' ' + pyramid.getCoordinates()[1].getY() + '\'/>' + '\n';
        svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getConvOpacity() + '\' fill=\'' + this.drawSettings.getColor().getPyramidColor() + '\' stroke-linecap=\'' + round + '\' stroke-linejoin=\'' + round + '\' d=\'' + 'M' + pyramid.getCoordinates()[2].getX() + ' ' + pyramid.getCoordinates()[2].getY() + ' L' + pyramid.getCoordinates()[3].getX() + ' ' + pyramid.getCoordinates()[3].getY() + ' L' + pyramid.getVertex().getX() + ' ' + pyramid.getVertex().getY() + ' L' + pyramid.getCoordinates()[2].getX() + ' ' + pyramid.getCoordinates()[2].getY() + '\'/>' + '\n\n';
        if (this.drawSettings.isActivateKernelDimensions()) {
            svg += this.drawTextPyramid(pyramid, kernel);
        }
        let z = this.calculateAverageZ(pyramid.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }
    drawArrow(arrow) {
        let svg = '';
        svg += '<!-- Arrow -->\n';
        svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' d=\'' + 'M' + arrow.getVertex1().getX() + ' ' + arrow.getVertex1().getY() + ' L' + arrow.getVertex2().getX() + ' ' + arrow.getVertex2().getY() + '\'    />' + '\n';
        svg += '\t\t<circle opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' cx=\'' + arrow.getVertex2().getX() + '\' cy=\'' + arrow.getVertex2().getY() + '\' r=\'1\' fill=\'' + this.drawSettings.getColor().getArrowColor() + '\' />\n';
        let z = this.calculateAverageZ(arrow.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }
    drawJumps(jumps) {
        for (let jump of jumps) {
            let lastCube = jump[0].getLastCube();
            let firstCube = jump[1].getCubeList()[0];
            this.lineTo(lastCube, firstCube);
        }
    }
    drawReducer(){
        nodesMap.forEach( (node, key)  => {
            if(key!==1){
                let cube1 = node.getCubeList()[0]
                let cube2 = node.getLastCube()
                let vertex1 = cube1.getCoordinates()[10];
                let vertex2 = cube1.getCoordinates()[9];
                let vertex3 = cube2.getCoordinates()[9];
                let vertex4 = cube2.getCoordinates()[10];
                if (!node.getReduced()){
                    this.drawArrow(new Arrow(vertex1, vertex2));
                    this.drawArrow(new Arrow(vertex2, vertex3));
                    this.drawArrow(new Arrow(vertex4, vertex3));
                    this.drawNodeReducersText(new Arrow(vertex2,vertex3),vertex2,vertex3,node);
                }
                }
            }
        )
    }

    drawPointer(pointerArrow,mode) {
        let svg = '';
        let size;
        let xorig = pointerArrow.getVertex1().getX()
        let yorig = pointerArrow.getVertex1().getY()
        let xdest = pointerArrow.getVertex2().getX()
        let ydest = pointerArrow.getVertex2().getY()

        size = Math.abs(yorig - ydest) / 6
        let yorig2;

        if (ydest<yorig) {
            yorig = ydest + size
            yorig2 = ydest + size
        }else {
            yorig = ydest - size
            yorig2 = ydest - size    
        }
        
        //Orig is different for inverted and normal
        if (mode =="inverted"){

            svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' d=\'' + 'M' + (xdest-size) + ' ' + (yorig) + ' L' + xdest + ' ' + ydest + '\'/>' + '\n';
            svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' d=\'' + 'M' + (xdest+size) + ' ' + (yorig) + ' L' + xdest + ' ' + ydest + '\'/>' + '\n';
        
        }
        else{
            svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' d=\'' + 'M' + (xorig-size) + ' ' + (yorig2) + ' L' + xdest + ' ' + ydest + '\'/>' + '\n';
            svg += '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' d=\'' + 'M' + (xorig+size) + ' ' + (yorig2) + ' L' + xdest + ' ' + ydest + '\'/>' + '\n';
        }
        let z = this.calculateAverageZ(pointerArrow.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }
    
    drawPath(line){
        let svg = 'aqui'
        let xorig = line.getVertex1().getX()
        let yorig = line.getVertex1().getY()
        let xdest = line.getVertex2().getX()
        let ydest = line.getVertex2().getY()
        svg +=  '\t\t<path opacity=\'' + this.drawSettings.getColor().getArrowOpacity() + '\' stroke=\'' + this.drawSettings.getColor().getArrowColor() + '\' fill=\'rgb(255, 255, 255, 0)\' d=\'' + 'M' + xorig + ' ' + yorig + ' C' + xorig + ' ' + xorig + ' ' + ydest + ' ' + xorig + ' ' + xdest + ' ' + ydest + '\'   marker-end="url(#triangle)" />' + '\n';
        let z = this.calculateAverageZ(line.getCoordinates());
        let sn = new SortNode(svg, z);
        this.drawOrderList.push(sn);
    }

    drawShortcuts(shortcuts) {
        for (let i=0; i<shortcuts.length; i++) {
            if(!shortcuts[i][0].getReduced() && !shortcuts[i][1].getReduced()){
            let cube1 = shortcuts[i][0].getLastCube();
            let cube2 = shortcuts[i][1].getLastCube();
            let vertex1 = cube1.getCoordinates()[10];
            let vertex2 = cube1.getCoordinates()[9];
            let vertex3 = cube2.getCoordinates()[9];
            let vertex4 = cube2.getCoordinates()[10];

            vertex2.setY(vertex2.getY()+indexShortcuts);
            vertex3.setY(vertex3.getY()+indexShortcuts);

            indexShortcuts-=5;
            if(shortcutsNumber[i] || shortcuts[i][2]){
                this.drawPath(new Arrow(vertex1, vertex4))
                //this.drawPointer(new PointerArrow(vertex1,vertex2),"inverted")
                //this.drawPointer(new PointerArrow(vertex3,vertex4),"normal") 
            }
            else{
                this.drawArrow(new Arrow(vertex1, vertex2));
                this.drawArrow(new Arrow(vertex2, vertex3));
                this.drawArrow(new Arrow(vertex3, vertex4));
                this.drawPointer(new PointerArrow(vertex1,vertex2),"inverted")
                this.drawPointer(new PointerArrow(vertex3,vertex4),"normal")        
            }
        }
            
        indexShortcuts=0;
            }
    }
    selectColor(cube) {
        if (cube.isKernel) {
            return this.drawSettings.getColor().getKernelColor();
        } else if (cube.isDenseLayer) {
            return this.drawSettings.getColor().getDenseColor();
        } else if (cube.isInputLayer) {
            return this.drawSettings.getColor().getInputColor();
        } else {
            return this.drawSettings.getColor().getCubeColor();
        }
    }
    selectOpacity(cube) {
        if (cube.isKernel) {
            return this.drawSettings.getColor().getKernelOpacity();
        } else if (cube.isDenseLayer) {
            return this.drawSettings.getColor().getDenseOpacity();
        } else if (cube.isInputLayer) {
            return this.drawSettings.getColor().getInputOpacity();
        } else {
            return this.drawSettings.getColor().getLayerOpacity();
        }
    }
    doTransformations(coordinates) {
        this.matrixController.move('x', coordinates, -this.imageCenter.getX());
        this.matrixController.move('y', coordinates, -this.imageCenter.getY());
        this.matrixController.move('z', coordinates, -this.imageCenter.getZ());
        this.matrixController.rotate(coordinates);
        this.matrixController.move('x', coordinates, this.imageCenter.getX());
        this.matrixController.move('y', coordinates, this.imageCenter.getY());
        this.matrixController.move('z', coordinates, this.imageCenter.getZ());

        this.matrixController.move('x', coordinates, (1000 - this.imageCenter.getX()) / 2);
        this.matrixController.move('y', coordinates, (1000 - this.imageCenter.getY()) / 2);
        this.matrixController.move('z', coordinates, (1000 - this.imageCenter.getZ()) / 2);
    }
    calculateCenter(coordinates) {
        let x = (coordinates[0].getX() + coordinates[1].getX() + coordinates[2].getX() + coordinates[3].getX()) / 4;
        let y = (coordinates[0].getY() + coordinates[1].getY() + coordinates[2].getY() + coordinates[3].getY()) / 4;
        let z = (coordinates[0].getZ() + coordinates[1].getZ() + coordinates[2].getZ() + coordinates[3].getZ()) / 4;
        return new Coordinate(x, y, z);
    }
    addHeader() {
        let round= "round"
        x_max = this.x_max;
        x_min = this.x_min;
        y_max = this.y_max;
        y_min = this.y_min;
        this.svgString = '<svg id="svgImage" xmlns=\'http://www.w3.org/2000/svg\' '+ ZoomOptionstoString(newViewBox)+'>\n'+ ' <defs><marker id="triangle" viewBox="0 0 10 10" refX="1" refY="5" markerUnits="strokeWidth" markerWidth="10" markerHeight="10" orient="auto"><path d="M 0 0 L 10 5 L 0 10 z" fill="#000"/></marker><marker id="arrowhead2" viewBox="0 0 60 60" refX="60" refY="30" markerUnits="strokeWidth" markerWidth="16" markerHeight="10" orient="auto"><path d="M 0 0 L 60 30 L 0 60 z" fill="#800000" /> </marker></defs> preserveAspectRatio="xMidYMid meet" ' + '\t<g stroke=\'' + this.drawSettings.getStroke().getStroke_color() + '\' stroke-linecap=\'' + round + '\' stroke-width=\'' + this.drawSettings.getStroke().getStroke_width() + '\'>\n';
    }
    addFooter() {
        this.svgString += '\t </g>\n' + '</svg>';
    }
    shiftNode(node) {
        let modelQueue = node.getCubeList();
        for (let i = 0; i < modelQueue.length; i++) {
            let cube = modelQueue[i];
            this.matrixController.move('x', cube.getCoordinates(), this.length);
            if (!cube.isKernel && i !== 0) {
                let l = Math.abs(this.depthAux - cube.getCoordinates()[4].getZ());
                this.depth = l + this.drawSettings.getShift().getShiftLayers();
            }
            this.matrixController.move('z', cube.getCoordinates(), this.depth);
            if (!cube.isKernel) {
                this.depthAux = cube.getCoordinates()[0].getZ();
            }
            this.updateMaxMin(cube.getCoordinates());
        }
    }
    updateMaxMin(coordinates) {
        for (let coordinate of coordinates) {
            if (coordinate.getX() > this.x_max) {
                this.x_max = coordinate.getX();
            }
            if (coordinate.getX() < this.x_min) {
                this.x_min = coordinate.getX();
            }
            if (coordinate.getY() > this.y_max) {
                this.y_max = coordinate.getY();
            }
            if (coordinate.getY() < this.y_min) {
                this.y_min = coordinate.getY();
            }
            if (coordinate.getZ() > this.z_max) {
                this.z_max = coordinate.getZ();
            }
            if (coordinate.getZ() < this.z_min) {
                this.z_min = coordinate.getZ();
            }
        }
    }
  
    calculateAverageZ(coordinates) {
        let total = coordinates.length;
        let sum = 0;
        for (let coordinate of coordinates) {
            let coord = coordinate.getZ();
            sum += coord;
        }
        return sum / total;
    }
    calculateImageCenter() {
        let center_x = ((this.x_max - this.x_min) / 2) + this.x_min;
        let center_y = ((this.y_max - this.y_min) / 2) + this.y_min;
        let center_z = ((this.z_max - this.z_min) / 2) + this.z_min;
        this.imageCenter = new Coordinate(center_x, center_y, center_z);
        this.x_max = -Number.MAX_VALUE;
        this.y_max = -Number.MAX_VALUE;
        this.x_min = Number.MAX_VALUE;
        this.y_min = Number.MAX_VALUE;
    }
    lineTo(cube1, cube2) {
        cube1.getCoordinates().slice(0, 4)
        let vertex1 = this.calculateCenter(cube1.getCoordinates().slice(0, 4));
        let vertex2 = this.calculateCenter(cube2.getCoordinates().slice(4, 8));
        this.drawArrow(new Arrow(vertex1, vertex2));
    }
}

/*SORTNODE CLASS */
/**
 * Class that uses Svg Controller that orders
 * the figures to be represented depending on the depth
 */
class SortNode {
    constructor(svgString, z) {
        this.svgString = svgString;
        this.z = z;
    }
    getSvgString() {
        return this.svgString;
    }
    getZ() {
        return this.z;
    }
}
