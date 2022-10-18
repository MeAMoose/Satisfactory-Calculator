/* CanvasEngine 
The Canvas Engine is a class that allows for the panning and zooming of elements stored on a canvas.
Currently, there can only be a single CanvasEngine on a given window at any single time. This is due
to a limitation with how text is rendered in P5. My current solution is to draw giant box borders 
around the canvas.
*/
class CanvasEngine {
    constructor(x, y, width, height) {
        //User defined attributes;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.elementList = { nodeList: [], subList: [], lineList: [], dataList: [], extraList: [] };              //Holds each element stored on the canvas.
        this.camera = { x: 0, y: 0 };        //Current "pseudo" camera position (zoom+pan visual).
        this.cursor = { x: 0, y: 0 };        //Current cursor position.
        this.dragStart = { x: x, y: y };        //Marks the start of a mouse drag.
        this.dragEnd = { x: x, y: y };          //Marks the end of a mouse drag.
        this.cameraStart = { x: 0, y: 0 };      //Marks of the start of the camera position during a mouse drag.
        this.nodeStart = { x: 0, y: 0 };      //Used for node dragging
        this.scale = 1.0;                    //Scale Factor.
        this.lastMousePressed = false;       //Used for calculating drag length.
        this.currentElement = null;          //Used for switching between dragging nodes and panning the canvas.
        this.renderOrder = ["lineList", "dataList", "subList", "nodeList", "extraList"]    //Defines which group is rendered first.
        this.sensitivity = 200;             // Controls zoom and pan sensitivity.

        //Scrollwheel "zoom" listener
        window.addEventListener("wheel", event => {
            if (this.pointColliding(mouseX, mouseY)) {
                let cursorStart = { x: this.cursor.x, y: this.cursor.y };
                let delta = Math.sign(event.deltaY);

                if (delta > 0) this.scale /= 1.1;
                if (delta < 0) this.scale *= 1.1;

                let cursorEnd = {
                    x: ((mouseX - this.width / 2) / this.scale + (this.camera.x + this.width / 2)) / this.sensitivity,
                    y: ((mouseY - this.height / 2) / this.scale + (this.camera.y + this.height / 2)) / this.sensitivity
                };

                this.camera.x += (cursorStart.x - cursorEnd.x) * 200;
                this.camera.y += (cursorStart.y - cursorEnd.y) * 200;
            }
        });
        //Default camera position
        this.camera.x = -this.x;
        this.camera.y = -this.y;
    }
    render() {      //Renders the canvas and calls render on all elements held by the canvas.
        //Works out the relative scaled cursor position (when scale factor > 1 or < 1)
        this.cursor.x = ((mouseX - this.width / 2) / this.scale + (this.camera.x + this.width / 2)) / this.sensitivity;
        this.cursor.y = ((mouseY - this.height / 2) / this.scale + (this.camera.y + this.height / 2)) / this.sensitivity;
        //If left mouse button and mouse in bounds of canvas AND not on any node, enable canvas panning.
        if (mouseIsPressed == true && this.elementMouseColliding() == false && this.currentElement == null) {
            if (mouseButton == LEFT && this.pointColliding(this.dragStart.x, this.dragStart.y)) {
                if (this.lastMousePressed != true) {
                    this.dragStart.x = mouseX;
                    this.dragStart.y = mouseY;
                    this.cameraStart.x = this.camera.x;
                    this.cameraStart.y = this.camera.y;
                }
                else {
                    this.dragEnd.x = mouseX;
                    this.dragEnd.y = mouseY;
                    this.camera.x = this.cameraStart.x - (this.dragEnd.x - this.dragStart.x) / this.scale;
                    this.camera.y = this.cameraStart.y - (this.dragEnd.y - this.dragStart.y) / this.scale;
                }
            }
            //Stops dragging from starting off canvas.
            else if (this.pointColliding(this.dragStart.x, this.dragStart.y) != true && this.lastMousePressed != true) {
                this.dragStart.x = mouseX;
                this.dragStart.y = mouseY;
            }
        }
        //This facilitates node dragging (clone of above code but repurposed for node dragging)
        else if (this.elementMouseColliding() != false || this.lastMousePressed == true) {
            if (mouseButton == LEFT && this.pointColliding(this.dragStart.x, this.dragStart.y)) {
                if (this.lastMousePressed != true) {
                    this.currentElement = this.elementMouseColliding();     //Cached element to prevent canvas panning from triggering.
                    this.dragStart.x = mouseX;
                    this.dragStart.y = mouseY;
                    this.nodeStart.x = this.currentElement.relativeX;
                    this.nodeStart.y = this.currentElement.relativeY;
                }
                else {
                    this.dragEnd.x = mouseX;
                    this.dragEnd.y = mouseY;
                    try {                               //Try used to prevent errors pertaining to currentElement being null.
                        this.currentElement.relativeX = this.nodeStart.x + (this.dragEnd.x - this.dragStart.x) / this.scale;
                        this.currentElement.relativeY = this.nodeStart.y + (this.dragEnd.y - this.dragStart.y) / this.scale;
                    }
                    catch { }
                }
            }
            //Stops dragging from starting off canvas.
            else if (this.pointColliding(this.dragStart.x, this.dragStart.y) != true && this.lastMousePressed != true) {
                this.dragStart.x = mouseX;
                this.dragStart.y = mouseY;
            }
        }
        else {      //If not dragging anything, currentElement set to null.
            this.currentElement = null;
        }
        this.lastMousePressed = mouseIsPressed; //Used as a check value to stop repeated executions of dragStart and cameraStart
        this.renderEngine();
        //Draws a bounding box around the Canvas
        fill(50, 50, 50);
        noStroke();
        rect(0, 0, window.innerWidth, this.y);
        rect(0, this.y, this.x, this.height);
        rect(this.x + this.width, this.y, window.innerWidth, this.height);
        rect(0, this.y + this.height, window.innerWidth, window.innerHeight);
        stroke(0, 0, 0);
        noFill();
        rect(this.x, this.y, this.width, this.height);
    }
    pointColliding(x, y) {       //Returns true if a point is colliding with the canvas.
        if (x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height) {
            noFill();
            return true;
        }
        return false;
    }
    elementMouseColliding() {
        for (let i = 0; i < this.elementList["nodeList"].length; i++) {
            if (this.elementList["nodeList"][i].colliding(mouseX, mouseY)) {
                return this.elementList["nodeList"][i];
            }
        }
        return false;
    }
    addNode(x, y, width, height, optionalParameters) {         //Adds an element to the "nodeList" for rendering. Used for production nodes.
        this.elementList.nodeList[this.elementList["nodeList"].length] = new Element(x, y, width, height, optionalParameters);
    }
    addSub(x, y, width, height, optionalParameters) {          //Adds an element to the "subList" for rendering. Used for sub-nodes that represent inputs and outputs.
        this.elementList.subList[this.elementList["subList"].length] = new Element(x, y, width, height, optionalParameters);
    }
    addLine(x1, y1, x2, y2, optionalParameters) {              //Adds an element to the "lineList" for rendering. Used for drawing connections between nodes.
        this.elementList.lineList[this.elementList["lineList"].length] = new Element(x1, y1, x2, y2, optionalParameters);
    }
    addExtra(x, y, width, height, optionalParameters) {        //Adds an element to the "extraList" for rendering. Used for additionals that are not covered/rendered by other groups.
        this.elementList.extraList[this.elementList["extraList"].length] = new Element(x, y, width, height, optionalParameters);
    }
    addData(x, y, width, height, optionalParameters) {        //Adds an element to the "dataList" for rendering. Used for additionals that are not covered/rendered by other groups.
        this.elementList.dataList[this.elementList["dataList"].length] = new Element(x, y, width, height, optionalParameters);
    }
    removeNode(index) {         //Removes an element from the "nodeList" at a given index.
        this.elementList.nodeList.splice(index, 1);
    }
    removeSub(index) {         //Removes an element from the "subList" at a given index.
        this.elementList.subList.splice(index, 1);
    }
    removeLine(index) {         //Removes an element from the "lineList" at a given index.
        this.elementList.lineList.splice(index, 1);
    }
    removeExtra(index) {        //Removes an element from the "extraList" at a given index.
        this.elementList.extraList.splice(index, 1);
    }
    removeData(index) {        //Removes an element from the "dataList" at a given index.
        this.elementList.dataList.splice(index, 1);
    }
    clearElements() {           //Clears all elements from all render lists inside elementList
        for (const key in this.elementList) {
            this.elementList[key] = [];
        }
    }
    //Dictates the order of what elements are rendered first.
    renderEngine() {
        if (this.renderOrder == []) {    //If there is no renderOrder present, automatically generates one.
            this.renderOrder == (Object.keys(elementList));
        }
        for (const key in this.elementList) {
            for (let j = 0; j < this.elementList[key].length; j++) {
                //Assigns element positional data (x,y,width,height etc).
                this.elementList[key][j].x = (this.elementList[key][j].relativeX - this.camera.x - this.width / 2) * this.scale + this.width / 2;
                this.elementList[key][j].y = (this.elementList[key][j].relativeY - this.camera.y - this.height / 2) * this.scale + this.height / 2;
                if (this.elementList[key][j].type == "line" || this.elementList[key][j].type == "text") {   //The "line" and "text" elements reuses width and height variables as a second (x,y) value.
                    this.elementList[key][j].width = (this.elementList[key][j].relativeWidth - this.camera.x - this.width / 2) * this.scale + this.width / 2;
                    this.elementList[key][j].height = (this.elementList[key][j].relativeHeight - this.camera.y - this.height / 2) * this.scale + this.height / 2;
                }
                else {       //Non "line" elements treat width and height as a width and height... crazy I know.
                    this.elementList[key][j].width = this.elementList[key][j].relativeWidth * this.scale;
                    this.elementList[key][j].height = this.elementList[key][j].relativeHeight * this.scale;
                }
                this.elementList[key][j].scale = this.scale;
            }
            //Seperate for loops are used to make sure that borders are generated before images are rendered.
        }
        for (let j = 0; j < this.renderOrder.length; j++) {
            for (let k = 0; k < this.elementList[this.renderOrder[j]].length; k++) {
                this.elementList[this.renderOrder[j]][k].render();
            }
        }
    }
}

class RecipeVisualisation extends CanvasEngine {
    constructor(x, y, width, height) {
        super(x, y, width, height)
        this.itemsToProduce = [];
        this.lastUserMult = 0;
        this.userMultiplier = 1;
        this.productionMultiplier = 0;
    }
    checkText() {
        if (this.lastUserMult != this.userMultiplier) {
            this.dataGen()
        }
    }
    processRecipe(selectedRecipe) {
        let currentNode = selectedRecipe;
        let result = [];                    //Array to be returned.
        let visited = [currentNode];        //Stores which nodes the algorithm has already been to.
        let empStack = new stack();
        let visitCount = 1;                 //Visited Counter
        let resultCount = 0;                //Results Counter
        let outCount = 0;                   //Used for output loop.
        let inCount = 0;                    //Used for input loop.
        let stage = 0;                      //The current stage of production.
        let offset = 0;                     //Used for "fringe cases" where a node is in multiple production stages.
        let inputsReturn = [];              //Inputs for each stage of production (for each node).
        let outputsReturn = [];             //Outputs for each stage of production (for each node).
        let factoryReturn = recipes[selectedRecipe].factory;        //Stores the factory name.
        for (const key in recipes[currentNode].inputs) {     //Loops through each input key and stores it in a list.
            inputsReturn[inCount] = recipes[currentNode].inputs[key];
            inCount += 1;
        }
        for (const key in recipes[currentNode].outputs) {    //Loops through each output key and stores it in a list.
            outputsReturn[outCount] = recipes[currentNode].outputs[key];
            outCount += 1;
        }
        empStack.push([0, currentNode, factoryReturn, inputsReturn, outputsReturn, offset]);
        inputsReturn = [];
        outputsReturn = [];
        while (empStack.head != 0) { //While stack is not empty
            currentNode = empStack.pop()
            stage = currentNode[0]
            result[resultCount] = currentNode;
            resultCount += 1;
            for (const key in recipes[currentNode[1]].inputs) { //Scans through all of the current nodes inputs and check if they've been visited.
                if (found(this.getPriorityRecipe(recipes[currentNode[1]].inputs[key][0]), visited) == false) { //If input NOT visited.
                    outCount = 0;
                    inCount = 0;
                    let newNode = this.getPriorityRecipe(recipes[currentNode[1]].inputs[key][0]);
                    visited[visitCount] = newNode;
                    visitCount += 1;
                    for (const key in recipes[newNode].inputs) {
                        inputsReturn[inCount] = recipes[newNode].inputs[key]
                        inCount += 1;
                    }
                    for (const key in recipes[newNode].outputs) {
                        outputsReturn[outCount] = recipes[newNode].outputs[key];
                        outCount += 1;
                    }
                    factoryReturn = recipes[newNode].factory
                    empStack.push([stage + 1, newNode, factoryReturn, inputsReturn, outputsReturn, offset]);
                    inputsReturn = [];
                    outputsReturn = [];
                }
            }
        }
        result = insertionSort(result);
        //Checks each entry against every other entry to determine if any outputs match inputs on the same stage of production.
        for (let i = 0; i < result.length - 1; i++) {
            let subject = result[i];        //Shortcut for result[i] - easier for maintanence.
            for (let key = 0; key < subject[3].length; key++) {           //Loops through subject's inputs
                for (let j = 1; j < result.length - i; j++) {               //Loops through the uncompared results (uses bubblesort optimisation).
                    for (let k = 0; k < result[j][4].length; k++) {    //Loops through the uncompared results outputs.
                        //If scanned output is equal to subject input
                        if (result[j][4][k][0] == subject[3][key][0] && result[j][0] == subject[0]) {
                            result[j][5] += 1;
                        }
                    }
                }
            }
        }
        return result
    }
    //Returns the range of stages being used by nodes.
    getStageRange() {
        let lowStage = 9999;
        let highStage = 0;
        for (let i = 0; i < this.elementList["nodeList"].length; i++) {
            if (this.elementList["nodeList"][i].data[0] < lowStage) {
                lowStage = this.elementList["nodeList"][i].data[0];
            }
            if (this.elementList["nodeList"][i].data[0] > highStage) {
                highStage = this.elementList["nodeList"][i].data[0];
            }
        }
        return (highStage - lowStage)
    }
    //Returns the recipe of highest priority to use. [Returns in following order: Priority, Alternate, Normal | If multiple of a catagory exists, it will return the first found sequentially]
    getPriorityRecipe(itemName) {
        let localRecipes = [];          //Temporary cache of relevant recipes.
        let alternatives = [];          //Storage of enabled alternate recipes producing desired item.
        let normals = [];               //Storage of normal recipes producing desired item.
        let counter = 0;
        //Searches through all recipes and saves relevant and enabled recipes to localRecipes (recipes that produce itemName).
        //Works by searching through each recipe object.
        for (const superKey in recipes) {
            for (const subKey in recipes[superKey].outputs) {
                if (recipes[superKey].outputs[subKey][0] == itemName && recipes[superKey].enabled == true) {
                    localRecipes[counter] = [superKey, recipes[superKey]];
                    counter += 1;
                }
            }
        }
        counter = 0;
        let normCounter = 0;
        for (const key in localRecipes) {
            //Returns first priority recipe it finds (prioritised over anything else).
            if (localRecipes[key][1].priority == true) {
                return localRecipes[key][0];
            }
            //Saves recipe to alternate list if recipe is alternate.
            else if (localRecipes[key][1].alternate == true) {
                alternatives[counter] = localRecipes[key][0];
                counter += 1;
            }
            //Saves recipe to normal list.
            else {
                normals[normCounter] = localRecipes[key][0];
                normCounter += 1;
            }
        }
        //Returns the first alternate recipe if ANY alternate is present (if multiple are enabled, will return first in sequence).
        if (alternatives.length != 0) {
            return alternatives[0];
        }
        //If multiple normal recipes without priority are producing the same item, will return first in sequence.
        else {
            return normals[0];
        }
    }
    //Runs the generation logic used to build the visualisation. Generates Nodes, Subnodes, Lines and Text.
    generate(selectedRecipe) {
        debug("Generating recipe for " + selectedRecipe);
        this.clearElements();
        let workingList = this.processRecipe(selectedRecipe);        //The processed node data for all production nodes.
        let stages = [];
        let positionX;
        let positionY;

        //Loops through each node.
        //NOTE: I am not happy with this solution, it does not account for all fringe cases and is a lazy solution.
        for (let x = 0; x < 5; x++) {                                              //Loops 5 times to account for errors not corrected by initial pass (safety)
            for (let i = 0; i < workingList.length; i++) {                         //Loops product nodes.
                for (let j = 0; j < workingList.length; j++) {                     //Loops ingredient nodes.
                    for (let k = 0; k < workingList[j][3].length; k++) {           //Loops through each ingredient of the ingredient node.
                        for (let l = 0; l < workingList[i][4].length; l++) {       //Loops through each product of the product node.
                            //If product matches ingredient and on same stage, moves the product down by 1 stage.
                            if ((workingList[j][3][k][0] == workingList[i][4][l][0]) && workingList[i][0] <= workingList[j][0]) {
                                //console.log("Moving "+workingList[i][1]+" from "+workingList[i][0]+" to "+(workingList[i][0]+1));     //Used for debugging
                                workingList[i][0] += 1;
                            }
                        }
                    }
                }
            }
        }
        for (let i = 0; i < workingList.length; i++) {
            let count = 0;
            //Counts the number of nodes in each stage (used for positioning).
            for (let j = 0; j < stages.length; j++) {
                if (stages[j] == workingList[i][0]) {
                    count += 1;
                }
            }
            //Position X and Y of the node to be generated (scaled X and Y)
            positionY = (workingList[i][0] * 300) + 100     //Stage offset + original offset + "fringe" offset
            positionX = (count * 300) + 100                 //Counter offset + original offset + "fringe" offset
            this.addNode(positionX, positionY, 100, 100, {
                img: factories[workingList[i][2]].model,
                canvasTiedTo: this,
                type: "img",
                color: [255, 0, 0],
                outline: true,
                data: workingList[i],
            });

            //the node to teather to.
            let tetherPos = this.elementList["nodeList"][this.elementList["nodeList"].length - 1]
            //Builds "input" sub-nodes for the production node.
            for (let j = 0; j < workingList[i][3].length; j++) {
                this.addSub(-80, (60 * j), 50, 50, {
                    img: items[workingList[i][3][j][0]].model,
                    canvasTiedTo: this,
                    type: "img",
                    color: [255, 0, 0],
                    outline: false,
                    fill: true,
                    tetherTo: tetherPos
                });
            }
            //Builds "output" sub-nodes for the production node.
            for (let j = 0; j < workingList[i][4].length; j++) {
                this.addSub(130, (60 * j), 50, 50, {
                    img: items[workingList[i][4][j][0]].model,
                    canvasTiedTo: this,
                    type: "img",
                    color: [0, 255, 0],
                    outline: false,
                    fill: true,
                    tetherTo: tetherPos
                });
            }
            stages[stages.length] = workingList[i][0];
        }
        //Handles secondary data generation (lines and data).
        for (let i = 0; i < this.elementList["nodeList"].length; i++) {                         //Loops product nodes.
            let productNode = this.elementList["nodeList"][i];                           //Product Node
            productNode.calcData = [];
            for (let j = 0; j < this.elementList["nodeList"].length; j++) {                     //Loops ingredient nodes.
                let ingredientNode = this.elementList["nodeList"][j];                    //Ingredient Node
                for (let k = 0; k < productNode.data[3].length; k++) {                              //Loops through ingredients of product node.
                    for (let l = 0; l < ingredientNode.data[4].length; l++) {                       //Loops through products of ingredient node.
                        if (productNode.data[3][k][0] == ingredientNode.data[4][l][0]) {        //If a product is connected to an ingredient.
                            this.addLine(48, 130, 48, -28, {    //Places line offset to be tops and bottoms of nodes.
                                type: "line",
                                canvasTiedTo: this,
                                fill: true,
                                color: [0, 220, 255],
                                tetherTo: productNode,
                                tetherFrom: ingredientNode,
                            });
                            this.addData(0, 125, 0, 0, {      //Generates data.
                                type: "text",
                                canvasTiedTo: this,
                                fill: true,
                                data: [i, k],
                                color: [255, 255, 255],
                                elementText: this.dataTextGen,
                                tetherTo: productNode,
                                tetherFrom: ingredientNode,
                            });
                            this.addExtra(80, 225, 0, 0, {      //Generates Factory Multiplier Data (must be "extra" to keep top layer)
                                type: "text",
                                canvasTiedTo: this,
                                fill: true,
                                data: [i],
                                color: [255, 255, 255],
                                elementText: this.dataFactoryTextGen,
                                tetherTo: productNode,
                                tetherFrom: productNode,
                            });
                        }
                    }
                }
            }
        }
        this.dataGen();
    }
    dataGen() {
        let multiplier = Number(this.userMultiplier / this.elementList["nodeList"][0].data[4][0][1]);      //Needs adapting for desired input
        let nodeList = this.elementList["nodeList"];    // Cached nodeList position.
        let lineList = this.elementList["lineList"];    // Cached lineList position.

        //If data exists from a previous dataGen, the data is removed.
        for (let i = 0; i < nodeList.length; i++) {
            for (let j = 0; j < nodeList[i].data[3].length; j++) {
                if (nodeList[i].data[3][j].length == 3) {
                    nodeList[i].data[3][j].pop();
                }
            }
            nodeList[i].highMult = 0;
        }
        //Needs adapting for desired input | Takes the desired input and adds data onto the lower stages as a multiple of the desired input and recipe amount.
        for (let i = 0; i < nodeList[0].data[3].length; i++) {
            //Creates a cache of the input requirement for later calculations if cache does not already exist (if it does, it overwrites it).
            if (nodeList[0].data[3][i].length != 3) {
                nodeList[0].data[3][i].push(multiplier * nodeList[0].data[3][i][1]);
            }
            else {
                nodeList[0].data[3][i][2] = multiplier * this.elementList["nodeList"][0].data[3][i][1];
            }
        }
        nodeList[0].highMult = multiplier;
        for (let g = 0; g < this.getStageRange(); g++) {                                   //Loops for each stage
            for (let i = 0; i < lineList.length; i++) {                                    //Loops through all lines.
                for (let j = 0; j < lineList[i].tetherFrom.data[4].length; j++) {          //Loops line tetherFrom outputs
                    for (let k = 0; k < lineList[i].tetherTo.data[3].length; k++) {        //Loops line tetherTo inputs
                        if (lineList[i].tetherFrom.data[4][j][0] == lineList[i].tetherTo.data[3][k][0]) {
                            multiplier = Number(lineList[i].tetherTo.data[3][k][2] / lineList[i].tetherFrom.data[4][j][1]);
                            if (lineList[i].tetherTo.data[0] == g) {
                                for (let l = 0; l < lineList[i].tetherFrom.data[3].length; l++) {
                                    if (lineList[i].tetherFrom.data[3][l].length == 2) { //If data does not exist, push data to list (otherwise add to existing data).
                                        lineList[i].tetherFrom.data[3][l].push(Number((multiplier * lineList[i].tetherFrom.data[3][l][1])));
                                    }
                                    else {
                                        lineList[i].tetherFrom.data[3][l][2] += Number((multiplier * lineList[i].tetherFrom.data[3][l][1]));
                                    }
                                }
                                lineList[i].tetherFrom.highMult += multiplier;
                            }
                        }
                    }
                }
            }
        }
        this.lastUserMult = this.userMultiplier;
    }
    dataTextGen(dataArray) {
        this.checkText();
        if (dataArray.length == 1) {
            return this.dataFactoryTextGen(dataArray[0]);
        }
        else {
            return this.dataLineTextGen(dataArray[0], dataArray[1]);
        }
    }
    dataFactoryTextGen(i) {
        let productData = this.elementList["nodeList"][i].highMult;
        return (parseFloat(productData.toFixed(3)) + "x")
    }
    dataLineTextGen(i, k) {
        let productData = this.elementList["nodeList"][i].data;
        return (productData[3][k][0] + "\n" + parseFloat(productData[3][k][2].toFixed(3)) + "/min")
    }
    addProduct(productName) {
        this.itemsToProduce.push(productName);
        this.generate(this.getPriorityRecipe(productName));
    }
}

class Element {
    constructor(x, y, width, height, {
        canvasTiedTo = null,
        img = defaultImage,
        text = null,
        outline = false,
        fill = false,
        color = [255, 0, 0],
        type = 'img',
        tetherTo = null,
        tetherFrom = null,
        highMult = 0,
        data = null,
        calcData = null,
        name = null,
    } = {}) {             // ={} makes empty dictionary if no optional parameters are given.
        this.relativeX = x;
        this.relativeY = y;
        this.relativeWidth = width;
        this.relativeHeight = height;
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.scale = scale;
        this.img = img;
        this.elementText = text;
        this.outline = outline;
        this.fill = fill
        this.color = color;
        this.tetherTo = tetherTo;        //Makes sure a node will always position itself relative to the "super" node (the node tethered to)
        this.tetherFrom = tetherFrom;
        this.data = data;               //Used to carry any recipe data with the object.
        this.calcData = calcData;         //Used to carry any calculation data with the object.
        this.name = name;
        this.highMult = highMult;
        this.canvasTiedTo = canvasTiedTo;
    }
    render() {
        //Only used when element is tethered to another object.
        if (this.tetherTo != null) {
            this.x = (this.tetherTo.relativeX) * this.scale + this.x;
            this.y = (this.tetherTo.relativeY) * this.scale + this.y;
        }
        switch (this.type) {
            case "img":
                //Image, destination dimensions(x4), image dimensions(x4).
                this.drawBorder();
                image(this.img, this.x, this.y, this.width, this.height);
                break;
            case "line":
                // (x1,y1,x2,y2)
                if (this.tetherFrom != null) {         //SHOULD ONLY BE USED WITH NON-IMAGE ELEMENTS
                    this.width = (this.tetherFrom.relativeX) * this.scale + this.width;
                    this.height = (this.tetherFrom.relativeY) * this.scale + this.height;
                }
                stroke(this.color);
                strokeWeight(4 * this.scale);
                line(this.x, this.y, this.width, this.height);           //Draws a line (x1,y1,width,height)
                noStroke();
                strokeWeight(1);
                noFill();
                break;
            case "text":
                // (!"text",x,y)
                if (this.tetherFrom != null) {         //SHOULD ONLY BE USED WITH NON-IMAGE ELEMENTS
                    this.width = (this.tetherFrom.relativeX) * this.scale + this.width;
                    this.height = (this.tetherFrom.relativeY) * this.scale + this.height;
                }
                strokeWeight(2 * this.scale);
                fill(this.color)
                textLeading(18 * this.scale);
                textSize(20 * this.scale);
                if (this.data == null) {
                    text(this.elementText, (this.x + this.width) / 2, (this.y + this.height) / 2);
                }
                else {
                    text(this.canvasTiedTo.dataTextGen(this.data), (this.x + this.width) / 2, (this.y + this.height) / 2);
                }
                noFill()
                strokeWeight(1);
                break;
        }
    }
    //Called during render, only triggers if outline or fill is set to true.
    drawBorder() {
        if (this.outline == true) {
            //Creates a circular border around the element of a thickness of 10 (scaled).
            strokeWeight(10 * this.scale);
            stroke(this.color[0], this.color[1], this.color[2], 255)
            noFill();
            circle(this.x + (this.width / 2), this.y + (this.height / 2), this.width + (50 * this.scale));
            noStroke();
            strokeWeight(1);
        }
        if (this.fill == true) {
            //Creates a circular background to the element with the same outline as the border (scales with element).
            strokeWeight(10 * this.scale);
            stroke(this.color[0], this.color[1], this.color[2], 255)
            fill(this.color[0], this.color[1], this.color[2], 255);
            circle(this.x + (this.width / 2), this.y + (this.height / 2), this.width + (12 * this.scale));
            strokeWeight(1);
            noStroke();
            noFill();
        }
    }
    colliding(x, y) {        //Returns true if point is colliding with element.
        switch (this.type) {
            case "img":
                if (this.x + (this.width / 2) - x <= this.width &&
                    this.x + (this.width / 2) - x >= 0 - this.width &&
                    this.y + (this.height / 2) - y <= this.height &&
                    this.y + (this.height / 2) - y >= 0 - this.height
                ) {
                    return true;
                }
                else {
                    return false;
                }
                break;
        }
    }
}