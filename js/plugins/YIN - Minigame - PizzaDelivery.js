//-----------------------------------------------------------------------------
// OMORI Minigame - Pizza Delivery
//-----------------------------------------------------------------------------

Game_Interpreter.prototype.initPizzaDelivery = function () {
    ImageManager.loadPicture("PIZZA-Background");
    ImageManager.loadAtlas("MN_PizzaItems");

    $gameSystem._chosenHouses = [];
    $gameSystem._checkedHouses = [];

    var _pizzaHouse1 = this.generateHouse(1);
    var _pizzaHouse2 = this.generateHouse(2);
    var _pizzaHouse3 = this.generateHouse(3);

    this._pizzaHouse1 = _pizzaHouse1;
    this._pizzaHouse2 = _pizzaHouse2;
    this._pizzaHouse3 = _pizzaHouse3;

    // this.checkImages();
}

Game_Interpreter.prototype.checkImages = function () {
    var houseText = this.houseHints();
    for (var i = 1; i < 37; i++) {
        // console.log(houseText[i]);
        for (var j = 0; j < houseText[i].length; j++) {
            // console.log(houseText[i][j]);
            text = houseText[i][j];
            text = text.split(" ");
            for (var word = 0; word < text.length; word++) {
                ImageManager.loadPicture('PIZZA-' + text[word]);
            }
        }
    }
}

Game_Interpreter.prototype.houseHints = function () {
    return {
        1: ["Cans On Yard", "Pickup In Down Red", "Rug In Down Green", "Cans By Garbage", "Truck Roof In Down Brown", "Boarded Window", "Brick Front", "No Fence", "Roots On Yard", "Plants On Driveway", "Van On Yard"],

        2: ["Pickup In Down Dark Green", "Rug In Down Purple", "Stone Chimney On Four In Down Yellow", "Door In Down Yellow With Windows", "Door With Windows"],

        3: ["Rug In Down White", "Door In Down Dark Pink", "Ball On Yard", "Roof In Down Pink", "One Window In Down Pink", "Flowers In Down Purple Up Window"],

        4: ["Rug In Down Gray", "Door In Down Orange", "Broken By Driveway", "Roof In Down Light Blue", "Clean With Ladder"],
        //-----------------------------------------
        5: ["Car In Down Gray", "Large Rock On Yard", "Flowers By Large Rock", "Rug In Down Purple", "Roof In Down Orange", "Brick Front", "No FoodCart"],

        6: ["Door In Down White", "Roof In Down Dark Blue With Stone Chimney", "Truck Front", "Easel On Yard", "Plants On Yard"],

        7: ["Pickup In Down Red", "Door In Down Light Yellow With Windows", "Boxes On Yard", "Flowers In Down Purple Up Window", "Rug In Down Dark Purple", "No FoodCart", "Roof In Down Red", "No Fence"],

        8: ["Roof In Down Purple With Chimney", "Truck Tether", "Rug In Down Brown", "No Fence", "Ladder By Wood", "Hydrant For Tether", "Door In Down Dark Red"],
        //-----------------------------------------
        9: ["Roof In Down Light Brown", "Door In Down Pink", "Pickup In Down Gray", "No Fence"],

        10: ["Roof In Down Yellow", "Tires On Yard", "Door In Down White No Picnic", "Table On Yard", "Grill On Yard"],

        11: ["Roof In Down Blue", "Door In Down Light Brown", "Rug In Down Brown", "Look Three Dog", "Roots On Yard"],

        12: ["Roof In Down Light Green", "Toys On Yard", "Cans By Patch In Down White", "Rug In Down White", "One Window In Down Green", "Large Rock On Yard", "Hydrant For Tether"],
        //-----------------------------------------======================================================================================================================================================================================
        13: ["Landscaping By Driveway", "Rug In Down Dark Green", "Pickup In Down Blue", "Bushes By Patch In Down Brown", "Hydrant For Tether", "Brick Chimney In Down Purple On Four In Down Dark Green"],

        14: ["Roof In Down Brown", "Roots And Plants On Yard", "Tree On Yard", "Rug In Down Dark Yellow", "Door In Down Dark Red", "Garage In Down White"],

        15: ["Roof In Down Blue With Brick Chimney In Down Blue", "Brick Front In Down White", "Pickup In Down Green", "Van On Left", "Hoops On Yard", "Ball", "Bushes By Spout In Down Light Brown"],

        16: ["Car In Down Pink On Driveway", "Roof In Down Brown With Chimney In Down Dark Green", "Door In Down Yellow With Windows", "Bushes With Flowers In Down Yellow"],
        //-----------------------------------------
        17: ["Car In Down White", "Garage In Down Light Pink", "Rug In Down Light Pink", "Door In Down White With Windows", "Dirt By Patch", "Roof In Down Light Gray", "Flowers On Yard", "Boxes By Spout"],

        18: ["Brick Roof In Down Dark Brown", "Garage No Picnic", "Truck Beat", "Pickup In Down Green", "Out For Tether", "Bushes With Flowers In Down Yellow", "Tree On Yard", "Couch By Garbage"],

        19: ["Roof In Down Red", "Van On Left", "Rug In Down Blue", "Door In Down Gray", "Small By Driveway", "Bottles And Cans On Yard", "Clean By Wood", "Garage No Picnic", "Brick Chimney In Down Red"],

        20: ["Roof In Down Light Brown", "Door In Down Orange", "Out By Driveway", "Car In Down Gray",  "Chimney In Down Brown", "Bushes With Flowers By Driveway"],
        //-----------------------------------------
        21: ["Roof In Down Purple", "Chimney In Down Purple", "Door In Down Pink", "Garage In Down Dark Red", "Hydrant For Tether", "Rug In Down Dark Blue", "Car In Down Pink", "Look Three Birdhouse On Yard", "Side On Mailbox For Tether", "Messy With Flowers", "Grill On Right", "Planks By Fourth"],

        22: ["Door In Down Dark Brown", "Roof In Down Dark Green", "Brick Front In Down White", "Plants By Wood", "Mulch On Yard", "Out By Patch", "Look Three Dog", "Brick Chimney In Down Purple", "Hoops"],

        23: ["Roof In Down Yellow", "Work On Yard", "Tools On Yard", "Rug In Down Yellow", "Pickup In Down Gray", "Garage In Down White With Windows", "Tires On Yard"],

        24: ["Pickup In Down Red", "Roof In Down Blue", "Broken For Tether", "Door In Down Yellow With Windows", "Flamingo", "Look Three Birdhouse", "Brick Chimney In Down Blue"],
        //-----------------------------------------======================================================================================================================================================================================
        25: ["Roof In Down Purple", "Rug In Down White", "Flamingo And Tree By Driveway", "Beat On Left In Down Brown", "Stone Chimney In Down Gray", "One Window In Down Pink", "Grill By You"],

        26: ["Roof In Down Light Brown", "Door In Down Brown", "Hoops By Patch In Down Brown", "Rug In Down Purple", "Two Van In Down Black", "Toys On Yard", "Brick Front In Down Light Brown", "Broken For Tether"],

        27: ["Roof In Down Dark Brown", "Sign For Tether", "Roots On Yard", "Flowers In Down Red Up Window In Down Yellow"],

        28: ["Path With Flowers", "Out On Right And On Left", "Two Van On Right In Down Green", "Roof In Down White", "Door In Down White", "Hydrant For Tether", "Stone Chimney In Down White"],
        //-----------------------------------------
        29: ["Roof In Down Yellow", "Door In Down Dark Red", "Rug In Down Brown", "Van For Tether", "Tires On Yard", "Ladder By Wood", "Pickup In Down Gray", "Pickup In Down Blue", "Planks On Yard"],

        30: ["Beat In Down White", "Car In Down Pink", "Flowers By Driveway", "Roof In Down Light Brown", "Grill On Left", "Door In Down Dark Pink"],

        31: ["Roof In Down Dark Brown", "Swing", "Ball", "Flowers On Yard", "Out On Left", "Path", "Toys On Yard"],

        32: ["Roof In Down Red", "Rug In Down Gray", "Door In Down Orange", "Roots On Yard", "Two Van In Down Green", "Truck Front", "Hydrant For Tether", "Ladder On Long", "Stone Chimney In Down Gray"],
        //-----------------------------------------
        33: ["Roof In Down Gray", "Brick Front", "Rug In Down Purple", "Ladder By Wood", "Two Van", "Bottles By Garbage", "Look Three Dog", "Planks On Yard", "No Fence", "Pickup In Down Gray For Tether"],

        34: ["Car In Down White For Tether", "Side On Mailbox For Tether", "Cans By Garbage", "Roof In Down Light Blue", "Tree For Tether", "Door In Down Light Red", "Hoops", "Rug In Down Light Green"],

        35: ["Car In Down Yellow For Tether", "Flowers In Down Red Up Window", "Path With Flowers", "Mulch On Yard", "Roof In Down Blue", "Rug In Down Dark Blue", "Tree For White Beat"],

        36: ["Hydrant For Tether", "No Fence", "Flowers In Down Purple Up Window In Down Pink", "Out On Right", "Door In Down Pink", "Roof In Down White", "Car In Down Gray", "Toys On Yard"],
    }
}

Game_Interpreter.prototype.generateHouse = function (neighborhood) {
    var neighborhoodHouses = {
        1: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
        2: [13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        3: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
    }

    var houseHintsPt1 = this.houseHints();
    var chosenHouse = $gameSystem.randomizeArray(neighborhoodHouses[neighborhood])[0];

    while (!chosenHouse || $gameSystem._chosenHouses.contains(chosenHouse)) {
        chosenHouse = $gameSystem.randomizeArray(neighborhoodHouses[neighborhood])[0];
    }
    // console.log(chosenHouse);


    $gameSystem._chosenHouses.push(chosenHouse);
    var wordPool = houseHintsPt1[chosenHouse];

    $gameSystem.randomizeArray(wordPool);
    var description1 = wordPool[0];
    wordPool.splice(0, 1);

    $gameSystem.randomizeArray(wordPool);
    var description2 = wordPool[0];
    wordPool.splice(0, 1);

    $gameSystem.pizza = [description1, description2];

    var partPool = [
        "This Pizza Can Street To House With ",
        "This Pizza Can Street To House With ",
        "Find The With ",
        "Find The With ",
        "This Pizza Can Has Lined In House With ",
        "This Pizza Can Has Lined In House With ",
        "Please Find The With ",
        "Please Find The With ",
        "Please This Pizza Can Street To House With ", 
        "Please This Pizza Can Street To House With ",
        "This Pizza Goes To House With ",
        "This Pizza Goes To House With ",
    ]

    $gameSystem.randomizeArray(partPool);
    var part = partPool[0];

    let middlePart = " And ";

    let firstHintWord = $gameSystem.pizza[0].split(" ")[0];
    let secondHintWord = $gameSystem.pizza[1].split(" ")[0];
    // Check if z should be replaced with ze
    if (firstHintWord.contains("Easel") || firstHintWord.contains("Table") || firstHintWord.contains("Van") || firstHintWord.contains("Out")) {
        part = part.replace("With", "New");
    }
    else if (firstHintWord.contains("No")) { 
        part = part.replace(" With", "");
        middlePart = " And With ";
    }

    if (secondHintWord.contains("Easel") || secondHintWord.contains("Table") || secondHintWord.contains("Van") || secondHintWord.contains("Out")) {
            middlePart = " And New "
    }
    else if (secondHintWord.contains("No")) middlePart = " And ";

    text = part + $gameSystem.pizza[0] + middlePart + $gameSystem.pizza[1];

    return text;
}

Game_Interpreter.prototype.showPizzaNote = function (text) {
    AudioManager.playSe({name: 'GEN_mess_paper', volume: 100, pitch: 100})
    if (text === 0) text = this._pizzaHouse1;
    if (text === 1) text = this._pizzaHouse2;
    if (text === 2) text = this._pizzaHouse3;

    var note = SceneManager._scene._pizzaNote = new Window_PizzaDeliveryNote(text);
    SceneManager._scene.addChild(note);
}

Game_Interpreter.prototype.correctHouse = function (houseID) {
    if (houseID === $gameSystem._chosenHouses[$gameVariables.value(817)]) return true;
    return false;
}

Game_Interpreter.prototype.checkedHouseAlready = function () {
    if (!$gameSystem._checkedHouses.contains($gameVariables.value(822))) {
        $gameSystem._checkedHouses.push($gameVariables.value(822));
        return false;
    }
    return true;
}

Game_Interpreter.prototype.checkingCurrentHouse = function (houseID) {
    $gameVariables.setValue(822, houseID);
}

//=============================================================================
//
//=============================================================================
Game_System.prototype.randomizeArray = function (array) {
    if (!array) return;
    var curElement = array.length;
    var temp;
    var randomizedLoc;
    while (0 !== curElement) {
        randomizedLoc = Math.floor(Math.random() * curElement);
        curElement -= 1;
        temp = array[curElement];
        array[curElement] = array[randomizedLoc];
        array[randomizedLoc] = temp;
    };
    return array;
}

//=============================================================================
//
//=============================================================================
function Window_PizzaDeliveryNote() {
    this.initialize.apply(this, arguments);
}

Window_PizzaDeliveryNote.prototype = Object.create(Window_Base.prototype);
Window_PizzaDeliveryNote.prototype.constructor = Window_PizzaDeliveryNote;

Window_PizzaDeliveryNote.prototype.initialize = function (text) {
    var x = (Graphics.boxWidth - this.windowWidth()) / 2;
    var y = (Graphics.boxHeight - this.windowHeight()) / 3;
    Window_Base.prototype.initialize.call(this, x, y, this.windowWidth(), this.windowHeight());
    this.opacity = 0;
    this.refresh(text);
};

Window_PizzaDeliveryNote.prototype.standardPadding = function () {
    return 0;
}

Window_PizzaDeliveryNote.prototype.refresh = function (text) {
    this.contents.clear();
    this.visible = true;
    var bitmap = ImageManager.loadPicture('PIZZA-Background');
    this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, 0, 0);
    text = text.split(" ");
    // console.log(text);
    var nextX = 24;
    var nextY = 32;
    for (var i = 0; i < text.length; i++) {
        var bitmap = ImageManager.loadPicture('PIZZA-' + text[i]);
        if (nextX + bitmap.width > 580) {
            nextX = 24;
            nextY += 64;
        }
        this.contents.blt(bitmap, 0, 0, bitmap.width, bitmap.height, nextX, nextY);
        nextX = nextX + bitmap.width + 20;
    }
}

Window_PizzaDeliveryNote.prototype.update = function () {
    Window_Base.prototype.update.call(this);
    if (Input.isTriggered("ok")) {
        this.closeNote();
    }
}

Window_PizzaDeliveryNote.prototype.windowWidth = function () {
    return Graphics.boxWidth - 20;
};

Window_PizzaDeliveryNote.prototype.windowHeight = function () {
    return Graphics.boxHeight - 40;
};

Window_PizzaDeliveryNote.prototype.closeNote = function () {
    this.close();
    this.visible = false;
    SceneManager._scene.removeChild(SceneManager._scene._pizzaNote);
}

var yin_updateCallMenu = Scene_Map.prototype.updateCallMenu;
Scene_Map.prototype.updateCallMenu = function () {
    if ($gamePlayer.canMove() && this.isMenuCalled() && $gameSwitches.value(818)) {
        if ((SceneManager._scene._pizzaNote && !SceneManager._scene._pizzaNote.visible)) {
            SceneManager._scene._pizzaNote.closeNote();
            $gameMap._interpreter.showPizzaNote($gameVariables.value(817));
            return;
        } else if (!SceneManager._scene._pizzaNote) {
            $gameMap._interpreter.showPizzaNote($gameVariables.value(817));
        }
    } else {
        yin_updateCallMenu.apply(this);
    }
}

var yin_Pizza_moveByInput = Game_Player.prototype.moveByInput;
Game_Player.prototype.moveByInput = function () {
    if (SceneManager._scene._pizzaNote && SceneManager._scene._pizzaNote.visible) return;
    yin_Pizza_moveByInput.call(this);
};

Game_Character.prototype.getRandomNPCGraphic = function () {
    this._opacity = 0;
    this._characterName = $gameSystem.randomizeArray(["FA_PizzaPeople_01", "FA_PizzaPeople_02"])[0];
    this._characterIndex = $gameSystem.randomizeArray([0, 1, 2, 3, 4, 5, 6, 7])[0];
    var frame = 1;
    this._direction = 2;
    this._pattern = this._originalPattern = frame % 3;
    this._priorityType = 2;
}
