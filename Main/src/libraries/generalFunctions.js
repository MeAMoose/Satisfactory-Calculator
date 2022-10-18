//Performs an insertionSort on an array.
function insertionSort(inArray) {
    for(let i=1;i<inArray.length;i++) {
        key = inArray[i];
        j = i - 1;
        while(j >= 0 && inArray[j][0] > key[0]) {
            inArray[j+1] = inArray[j];
            j-=1;
        }
        inArray[j+1] = key;
    }
    return inArray;
}

//Returns true if found in array.
function found(item, array) {
    for(let i=0;i<array.length;i++) {
        if(item==array[i]) {
            return true;
        }
    }
    return false;
}

//Framework for a Stack Datatype.
class stack{
    constructor() {
        this.stackArray = [];
        this.head = 0;
    }
    push(item) {
            this.stackArray[this.head] = item;
            this.head+=1;
    }
    peak() {
        if(this.head == 0) {
            console.log("Error: Stack empty");
        }
        else {
            return this.stackArray[this.head-1];
        }
    }
    pop() {
        if(this.head == 0) {
            console.log("Error: Stack empty");
        }
        else {
            this.head -= 1;
            return this.stackArray[this.head];
        }
    }
}

//Generates an 8 character ID string.
function idGen() {
    let idArray = [];
    let id;
    for(let i=0;i<8;i++) {
        idArray.push(random(48,122));
    }
    id = String.fromCharCode(idArray[0],idArray[1],idArray[2],idArray[3],idArray[4],idArray[5],idArray[6],idArray[7]);
    for(let j=0;j<idList.length;j++) {
        if(idList[j]==id) {
            retry=true;
        }
    }
    return id;
}

function debug(inText) {
    if(debugToggle==true) {
        console.log(inText);
    }
}