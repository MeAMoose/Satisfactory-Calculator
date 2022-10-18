/* -; Made by MeAMoose | Twitch.tv/meamoose
-; This class allows for easy UI construction, featuring a modular approach to
-; UI elements while also allowing for heavy customisability.
-; Be advised, Class is designed to be used on screens with a 16:9 aspect ratio. */


/* -; The Button class serves to make easy implementable UI buttons
-; that are both modular and highly customisable, being able to take
-; on required arguments to make changes on button initialisation.

** Parameters
  x: integer - Button X position. (required)
  y: integer - Button Y position. (required)
  width: integer - Button Width (required)
  height: integer - Button height (required)
{
  text: string - Displays text on button.
  hover: boolean - Toggles on hover.
  show: boolean - Toggles on if the button is displayed or not.
  shape: string - Changes the shape of the Button. /// UNIMPLEMENTED!!!
  color: string - Changes the buttons color (Requires show: True).
  hoverColor: string - Changes the buttons Hover color (Requires hover: True)
  textColor: string - Changes the text's color.
  outlineColor: string - Changes the color of the outline of the textbox and text.
  textPos: ALIGN - Changes the P5 text alignment, can ONLY BE CENTER, LEFT or RIGHT. (Requires text: "TEXT HERE")
  font: string - Changes the texts font (Requires text: "TEXT HERE")
  textWrap: string - Changes how the text is wrapped in the button (either by character or by word) (Requires text: "TEXT HERE")
  textSize: integer - Changes the size of the text. (Requires text: "TEXT HERE")
  outline: boolean - Toggles whether the outline of the button is shown.
  hollow: boolean - Toggles whether the inside of the button is shown.
  callbackMain: function - The function that you want the button to execute upon interaction.
  callbackHover: function - The function that you want the button to execute upon mouse hover.
} */

/* TODO: Make setupWidth/setupHeight self contained in the class.
Build framework to work on resolutions different than 16:9 and 4:3.

!!FIX CIRCLE TEXT NOT APPEARING!!

!!!REMOVE REPEATED FUNCTIONS ACROSS CLASSES!!!
  | List : doHover()*/

elementList = [];     //Holds all elements on screen.
class Button {
  constructor(x,y,width,height,{
  text='',
  color='white',
  hoverColor='blue',
  textColor='black',
  outlineColor='black',
  hover=false,
  show=true,
  shape="rectangle",
  textPos=CENTER,
  font='arial',
  textWrap='CHAR',
  textSize=10,
  outline=true,
  hollow=false,
  callbackMain=null,
  callbackHover=null
  }) {
    //Required parameters
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    //Optional parameters
    this.text = text;
    this.hover = hover;
    this.show = show;
    this.shape = shape;
    this.color = color;
    this.hoverColor = hoverColor;
    this.textColor = textColor;
    this.outlineColor = outlineColor;
    this.textPos = textPos;
    this.font = font;
    this.textWrap = textWrap;
    this.textSize = textSize;
    this.textLeading = textSize;
    this.outline = outline;
    this.hollow = hollow;
    this.callbackMain = callbackMain;
    this.callbackHover = callbackHover;

    this.lastMousePressed = false;
    elementIncrement(this); //Used to keep track of screen elements.
  }
  render() {    //Controls the display of the button, what features are shown etc.
    linearRender(this);
    if(this.mouseClicked() && mouseColliding(this)) {
      this.execute();
    }
  }
  //doHover() is called when callbackHover is defined as a function, will execute said function upon hovering with mouse.
  doHover() {
    try {
      this.callbackHover();
      console.log("doHover() SUCCESS | executed",this.callbackHover);
    }
    catch (err) {
      console.log("doHover() FAILED | No callback function")
    }
  }
  //execute() activates the butons function defined in callbackMain. NOTE: Activation is done externally through "objectName.executeFunc();"
  execute() {
    try {
      this.callbackMain();
      console.log("execute() SUCCESS | executed",this.callbackMain);
    }
    catch(err) {
      console.log("execute() FAILED | No callback function")
    }
  }
  mouseClicked() {
    if(mouseIsPressed && this.lastMousePressed == false) {
      this.lastMousePressed = true;
      return true;
    }
    this.lastMousePressed = mouseIsPressed
    return false;
  }
}
/* -; The TextBox class serves to make easy implementable Textboxes
-; that are both modular and highly customisable. This class is very
-; similar to the Button class except it has been stripped down to remove
-; the ability to use functions (I.E no callbacks).

** Parameters
  x: integer - Textbox X position. (required)
  y: integer - Textbox Y position. (required)
  width: integer - Textbox Width (required)
  height: integer - Textbox height (required)
{
  text: string - Displays text on textbox (not strictly required, but otherwise box will be blank).
  hover: boolean - Toggles on hover.
  show: boolean - Toggles on if the textbox is displayed or not.
  shape: string - Changes the shape of the Button. /// UNIMPLEMENTED!!!
  color: string - Changes the textbox's color (Requires show: True).
  hoverColor: string - Changes the textbox's Hover color (Requires hover: True)
  textColor: string - Changes the text's color.
  outlineColor: string - Changes the color of the outline of the textbox and text.
  textPos: ALIGN - Changes the P5 text alignment, can ONLY BE CENTER, LEFT or RIGHT. (Requires text: "TEXT HERE")
  font: string - Changes the texts font (Requires text: "TEXT HERE")
  textWrap: string - Changes how the text is wrapped in the textbox (either by character or by word) (Requires text: "TEXT HERE")
  textSize: integer - Changes the size of the text. (Requires text: "TEXT HERE")
  outline: boolean - Toggles whether the outline of the textbox or the text is shown.
  hollow: boolean - Toggles whether the inside of the textbox is shown.
} */
class TextBox {
  constructor(x,y,width,height,{
    text='',
    color='white',
    hoverColor='blue',
    textColor='black',
    outlineColor='black',
    hover=false,
    show=true,
    shape="rectangle",
    textPos=CENTER,
    font='arial',
    textWrap='CHAR',
    textSize=10,
    outline=true,
    hollow=false
    }) {
      //Required parameters
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      //Optional parameters
      this.text = text;
      this.hover = hover;
      this.show = show;
      this.shape = shape;
      this.color = color;
      this.hoverColor = hoverColor;
      this.textColor = textColor;
      this.outlineColor = outlineColor;
      this.textPos = textPos;
      this.font = font;
      this.textWrap = textWrap;
      this.textSize = textSize;
      this.textLeading = textSize
      this.outline = outline;
      this.hollow = hollow;
      elementIncrement(this); //Used to keep track of screen elements.
    }
    render() {    //Controls the display of the button, what features are shown etc.
      linearRender(this);
    }
}
/*
-; The Slider class makes displaying values in a bar/graphical format
-; much easier. The Slider itself takes on a value from 0 to 100 and
-; draws a rectangle in a self-contained box to match the percentage
-; I.E value: 60 means 60% of the bar is full.

** Parameters
  x: integer - Button X position. (required)
  y: integer - Button Y position. (required)
  width: integer - Button Width (required)
  height: integer - Button height (required)
{
  color: string - Changes the buttons color (Requires show: True).
  hoverColor: string - Changes the buttons Hover color (Requires hover: True)
  backgroundColor: string - Changes the color of the bounding box the slider bar moves on (the background).
  outlineColor: string - Changes the color of the outline of both the slider and the bounding box.
  hover: boolean - Toggles on hover.
  safety: boolean - Toggles whether the slider can extend outside of it's box (>100% or <0%).
  show: boolean - Toggles on if the button is displayed or not.
  outline: boolean - Toggles whether the outline of the button is shown.
  hollow: boolean - Toggles whether the inside of the button is shown.
  value: integer - A percentage out of 100 (0%:100%) that defines how much of the slider is filled at a given time.
}
*/
class Slider {
  constructor(x,y,width,height,{
    color='white',
    hoverColor='blue',
    backgroundColor='black',
    outlineColor='black',
    hover=false,
    safety=true,
    show=true,
    outline=true,
    hollow=false,
    value=100
  }){
      //Required parameters
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      //Optional parameters
      this.color = color;
      this.hoverColor = hoverColor;
      this.backgroundColor = backgroundColor;
      this.outlineColor = outlineColor;
      this.hover = hover;
      this.safety = safety;
      this.show = show;
      this.shape = "rectangle";
      this.outline = outline;
      this.hollow = hollow;
      this.value = value;
      elementIncrement(this); //Used to keep track of screen elements.
  }
  render() {
    if(this.outline == false) {         //outline: false
      noStroke();
    }
    else {
      stroke(this.outlineColor);
    }
    if(this.hollow == true) {
      noFill();
    }
    else {
      fill(this.backgroundColor);
    }

    //If safety is on, prevents value from exceeding acceptable boundry.
    if(this.safety == true) {
      if(this.value > 100) {
        this.value = 100;
      }
      else if(this.value < 0) {
        this.value = 0;
      }
    }

    //Background/Outline Rectangle
    if(this.show == true) {
      rect(this.x, this.y, this.width, this.height);
    }
    if(this.hover == true && mouseColliding(this) == true && this.hollow == false) {     //hover: true
      fill(this.hoverColor);
    }
    else if(this.show == true && this.hollow == false) {          //show: true
      fill(this.color);
    }
    /* Generates the Slider | First checks which direction is the longest and defaults this to the sliders
    given direction. After deciding which orientation to function, runs the rectangle slider as a percentage
    of the sliders full percentage (100%). */
    if(this.width >= this.height && this.show == true) {
      rect(this.x+5,this.y+5,(this.width-10)/100*this.value,this.height-10);
    }
    else if (this.show == true) {
      rect(this.x+5,this.y-5+(this.height - ((this.height-10)/100*this.value)),this.width-10,((this.height-10)/100*this.value));
    }
  }
}
class InputBox extends TextBox {
  constructor(x,y,width,height,{
    color='white',
    hoverColor='blue',
    textColor='black',
    outlineColor='black',
    hover=false,
    show=true,
    shape="rectangle",
    textPos=CENTER,
    font='arial',
    textWrap='CHAR',
    textSize=10,
    outline=true,
    hollow=false
    }) {
      super(x,y,width,height,color,hoverColor,textColor,outlineColor,hover,show,shape,textPos,font,textWrap,textSize,outline,hollow);
      this.selected == false;
      this.lastMousePressed = false;
    }
    render() {
      linearRender(this);
      //If clicked, changed selected to true;
      if(mouseColliding(this) && mouseIsPressed == true) {
        if(!this.lastMousePressed) {
          this.selected = true;
        }
        this.lastMousePressed = true;
      }
      else if(mouseIsPressed == true) {
        this.selected = false;
      }
      else {
        this.lastMousePressed = false;
      }
    }
}
//Library Global Functions
/* mouseColliding(element)
Description: Collision logic to check if the mouse's coordinates intersect with the elements coordinates.
element: Any UI object. */

function mouseColliding(element) {
  switch(element.shape) {
    //Box Logic
    case "rectangle":
      if(mouseX >= element.x &&
      mouseX <= element.x+element.width &&
      mouseY >= element.y &&
      mouseY <= element.y+element.height) {
        return true;
      }
      else {
        return false;
      }
    //Circle Logic
    case "circle":
      //Uses Pythagora's Theorem to calculate distance between mouse pointer and center of circle.
      var distance = Math.sqrt(Math.pow((element.x+(element.width/2))-mouseX,2)+Math.pow((element.y+(element.width/2))-mouseY,2));
      if(distance <= element.width/2) {
        return true;
      }
      else {
        return false;
      }
    default:
      console.log("Error 201 | UI element shape invalid/undefined.");
      break;
  }
}
/* linearRender(element)
Description: Holds the logic for rendering basic UI elements and how they are rendered
CONTROLS: TextBoxes, Buttons
element: Any UI object. */
function linearRender(element) {
  if(element.outline == false) {         //outline: false
    noStroke();
  }
  else {
    stroke(element.outlineColor);
  }
  textFont(element.font);
  textSize(element.textSize);
  textAlign(element.textPos);
  textWrap(element.textWrap);
  textLeading(element.textLeading);
  switch(element.shape) {
    case "rectangle":
      if(element.hover == true && mouseColliding(element) == true) {     //hover: true
        fill(element.hoverColor);
        rect(element.x, element.y, element.width, element.height);
      }
      else if(element.show == true) {          //show: true
        if(element.hollow == true) {           //hollow: true
          noFill();
        }
        else {
          fill(element.color);
        }
        rect(element.x, element.y, element.width, element.height);
      }
      fill(element.textColor);
      //Checks to see if entered text would exceed button boundries, if so will overwrite box's text with warning.
      if((textAscent()*(Math.ceil(textWidth(element.text)/element.width))) > element.height) {
        element.text = "Text Too Large";
      }
      /*Displays the text | The Y coordinate logic makes sure that the text remains in the center of the button by
      calculating character height of the font given its size, multiplying it by the amount of times the text width
      exceeds the buttons width and then halves it to fully center the text. -NOTE: element solution is partially janky
      and can have some text dissapear with longer sentences, particaularly ones with larger font sizes.*/
      text(element.text,element.x,element.y+(element.height/2)+((-textAscent()*(Math.ceil(textWidth(element.text)/element.width)))/2),element.width,element.height);
      break
    //Circles will generate from the top left most position (hence element.coordinate + radius)
    case "circle":
      if(element.hover == true && mouseColliding(element) == true) {     //hover: true
        fill(element.hoverColor);
        circle(element.x+(element.width/2), element.y+(element.width/2), element.width);
      }
      else if(element.show == true) {          //show: true
        if(element.hollow == true) {           //hollow: true
          noFill();
        }
        else {
          fill(element.color);
        }
        circle(element.x+(element.width/2), element.y+(element.width/2), element.width);
      }
      fill(element.textColor);
      break
  }
}

//Adds element to element list
function elementIncrement(element) {
  elementList[elementList.length] = element;
}
//Used for text input via the TextBox
function keyPressed() {
  for(let i=0;i<elementList.length;i++) {
    if(elementList[i].constructor.name == "InputBox") {
      //If clicked
      if(elementList[i].selected == true) {
        if((keyCode >=48 && keyCode <= 90) || (keyCode >=69 && keyCode <= 111) || keyCode == 8 || keyCode == 32 || keyCode == 13) {
            if(key == "Backspace") {
                elementList[i].text=elementList[i].text.substring(0,elementList[i].text.length-1);
            }
            else if(key == "Enter") {
                doStuff(elementList[i].text);
                break
            }
            else {
                elementList[i].text+= key;
            }
        }
      }
    }
  }
}