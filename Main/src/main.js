//Rewrite UI functions to utilise built-in Javascript UI functions (as well as HTML).

let scene = "main";
let tab = "visualisation";     
let options;            //Stores global options
let debugToggle = false;      //Boolean that decided whether debug statements are triggered or not.
let runTime = 0;
let changeVal = 3;
let idList;

function preload() {
    loadData()  //Imports Json data
}
function setup() {
    parseData() // Parse's loaded data
    frameRate(144);
    primImage = factories.GeothermalGenerator.model;
    myCanvas = new RecipeVisualisation(10,10,window.innerWidth-420,window.innerHeight-20);
    test = new InputBox(window.innerWidth-400,0,400,100,{
        textFont: "arial",
        textSize: 25,
        color: "yellow",
        textWrap: "WORD",
        textColor: "orange",
        hover: true,
        hollow: false,
        hoverColor: "cyan",
        outline: true,
        show: true,
        shape: "rectangle"
    });
    test2 = new TextBox(window.innerWidth-400,400,400,100,{
        textFont: "arial",
        textSize: 25,
        color: "yellow",
        textWrap: "WORD",
        textPos: LEFT,
        textColor: "orange",
        hover: true,
        hollow: false,
        hoverColor: "cyan",
        outline: true,
        show: true,
        shape: "rectangle"
    });
    createCanvas(window.innerWidth, window.innerHeight);
}
function draw() {
    nodeCount = 0;
    runTime += deltaTime/1000;
    background(50,50,50);
    switch(scene) {
        case "main":
            main();
    }
}
//Scene Functions
function main() {
    myCanvas.userMultiplier = changeVal;
    myCanvas.render();
    test.render();
    test2.text = Math.round(frameRate());
    test2.render();
}

//Proof of concept "enter"
function doStuff(i) {
    myCanvas.addProduct(i);
}