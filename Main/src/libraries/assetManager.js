let items;
let factories;
let recipes;
let defaultImage

//Only to be called in "setup"
function loadData() {
    items = loadJSON("Data/items.json")
    factories = loadJSON("Data/factories.json")
    recipes = loadJSON("Data/recipes.json")
}
//Parses JSON data into useful data.
function parseData() {
    //Converts data object models directories into p5 images
    for(const key in items) {
        items[key].model = loadImage(items[key].model);
    }
    for(const key in factories) {
        factories[key].model = loadImage(factories[key].model);
    }
    defaultImage = loadImage("Assets/placeholderImage.png");
}