
let settingsWindow = document.getElementById("settingsWindow");
let gameWindow = document.getElementById("gameWindow");
let startGameDiv = document.getElementById("startGameDiv");
let customMinesInput = document.getElementById("custom-mines");
let eixeiBtn = document.getElementById("eixei");
let texteBtn = document.getElementById("texte");
let twxtwBtn = document.getElementById("twxtw");
let tableBox = document.getElementById("container");
let menuScreen = document.getElementById("head-menu");

startGameDiv.onclick = () => {
    settingsWindow.style.display = "none";
    gameWindow.style.display = "block";
    numberOfMines = parseInt(customMinesInput.value);
    startOfGame();
};

customMinesInput.addEventListener("change", () => {
    numberOfMines = parseInt(customMinesInput.value); 
});

eixeiBtn.addEventListener("click", () => {
    tableBox.style.width = "400px";
    tableBox.style.height = "400px";
    rows = 8;
    columns = 8;
    eixeiBtn.disabled = true;
    texteBtn.disabled = true;
    twxtwBtn.disabled = true;
    eixeiBtn.style.backgroundColor = "#000";
    eixeiBtn.style.color = "#fff";
    eixeiBtn.style.border = "3px solid #fff";
})

texteBtn.addEventListener("click", () => {
    rows = 10;
    columns = 10;
    eixeiBtn.disabled = true;
    texteBtn.disabled = true;
    twxtwBtn.disabled = true;
    texteBtn.style.backgroundColor = "#000";
    texteBtn.style.color = "#fff";
    texteBtn.style.border = "3px solid #fff";
})

twxtwBtn.addEventListener("click", () => {
    tableBox.style.width = "600px";
    tableBox.style.height = "600px";
    rows = 12;
    columns = 12;
    eixeiBtn.disabled = true;
    texteBtn.disabled = true;
    twxtwBtn.disabled = true;
    twxtwBtn.style.backgroundColor = "#000";
    twxtwBtn.style.color = "#fff";
    twxtwBtn.style.border = "3px solid #fff";

})

let reselectBtn = document.getElementById("reselect");
reselectBtn.addEventListener("click", () => {
    window.location.reload();
})


let timer = 0;
let interval;
let lastTimerValue;


function startTimer() {
interval = setInterval(function() {
    timer++;
    document.getElementById("timerCounter").innerText = timer;
}, 1000); 
}

// Creating a container in table style on which to place the clickable cells.
let container = [];

// Creating rows and columns for the said table to assign the grid size on which the cells will be placed... Example: 10x10.
    let rows = 10;
    let columns = 10;

// The number of mines that will be placed in the table.
let numberOfMines;

// Creating an array for the locations on which the mines will be placed according to the assigned ID.
let placeOfMines = []; 

// The number of cells that have been clicked. Originally zero. Used to later determine the way cells open up when clicked.
let clickedCells = 0; 

// A variable that will be later used to mark whether the game has ended or not by changing it's boolean value to "true" and specifing how that action should take place.
let endOfGame = false;

// Automatically runs the startOfGame() function when the window of the site loads. 
let playAgainButton = document.querySelector(".newgame")

playAgainButton.onclick = () => {
    window.location.reload();

}

// window.onload = function() {

// }

// Event listener to disable the menu that automatically appears when right click is used on a website.
window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
})    


// Function to assign mines accordng to a randomly generated ID.
setMines = () => {
    let minesLeft = numberOfMines;
    // While there are still mines to be assigned, the loop will run.
    while (minesLeft > 0) { 
        // Using Math.random to generate a random number that will later be assigned to the ID accordingly.
        let r = Math.floor(Math.random() * rows);
        let c = Math.floor(Math.random() * columns);
        // Creates ID variable 
        let id = r.toString() + "-" + c.toString();

        // Here it checks if the ID of the mine has not already been pushed into an array before in order to avoid ending up with less mines than originally mentioned.
        if (!placeOfMines.includes(id)) {
            placeOfMines.push(id);
            minesLeft -= 1;
        }
    }
}

// The function called above when the window loaded. 
function startOfGame() {
    document.getElementById("mines-number").innerText = numberOfMines;
    // Calling the function to place the mines once the game starts.
    setMines();

    // A loop to assign IDs automatically to cells by iterating through rows and cells.
    for (let r = 0; r < rows; r++) {
        // An array that will later be used to create a row in which the cells will be pushed 
        let row = [];
        for (let c = 0; c < columns; c++) {
            // Creates cells to assign them to the container
            let cell = document.createElement("div");
            cell.id = r.toString() + "-" + c.toString();
            cell.addEventListener("click", cellClick);
            document.getElementById("container").append(cell);
            // Array used to push in newly created cells
            row.push(cell);
            // Event listener that sets flag on right click. Used as a reminder for players.
            cell.addEventListener('contextmenu', (event) => {
                    if (cell.innerText == "") {
                        cell.innerText = "🚩";
                    }
                    else if (cell.innerText == "🚩") {
                        cell.innerText = "";
                    }
            });
        }
        // The before mentioned array will be used here to push it into the container itself in order to create the whole table.
        container.push(row);
    }
}

// A function used to determine certain actions that should talk place once the cell is clicked. This function was before mentioned in the event listener for clicking the cell.
function cellClick() {

    // In this statement, if the game ends or the cell has already been clicked, the actions following the statement will be ignored.
    if (endOfGame || this.classList.contains("clicked-cells")) {
        return;
    }

    // "This" assigned to cells to determine the one on which the action is taking place.
    let cell = this;
    // Statement that removes the possibility on clicking on a cell after the flag has been assigned.
    if (cell.innerText == "🚩") {
        cell.removeEventListener("click")
    }

    // A statement that checks whether a cell containing a mine has been clicked or not. If yes, the game will and and a function will be called that has an algorithm to reveal all the mines left.
    if (placeOfMines.includes(cell.id)) {
        endOfGame = true;
        lossCheck();
        showAllMines();
        return;
    }


    // Creating a variable for coordinates of the cells to be assigned inside an array without the dash("-").
    let coords = cell.id.split("-");
    // Specifying that the row coordinate is assigned first in the array. On position 0.
    let r = parseInt(coords[0]);
    // Specifying that the column coordinate is assigned second in the array. On position 1.
    let c = parseInt(coords[1]);
    // Calls a function using the before mentioned variables.
    verifyNearbyMines(r, c);
    if (!startTimer()) {
        startTimer = true
    }
}

// This function is used to reveal all the mines the their position after the game gas ended.
function showAllMines() {
    for (let r= 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {

            let cell = container[r][c];
            if (placeOfMines.includes(cell.id)) {
                cell.innerText = "💣";
                cell.style.border = "5px solid darkred";
                cell.style.backgroundColor = "red";                
            }

        }
    }
}

// Function in which the algoritm will verify the neighbouring cells for mines in order to assign numbers or reveal other cells in case no number is assigned
function verifyNearbyMines(r, c) {
    // Statement that checks whether the rows and the columns are within the boundaries of the container. If not, the actions following the statement will be ignored
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return;
    }
    if (container[r][c].classList.contains("clicked-cells")) {
        return;
    }

    container[r][c].classList.add("clicked-cells");
    clickedCells += 1;

    // Variable created to keep track of the mines found in the neighbouring cells
    let minesNearby = 0;

    //The following sequence checks whether mines have been found in the cells neighbouring the clicked cell from the top, bottom, left and right by calculating the cells that should be checked. If a mine has been found in any of the neighbouring cells. The number of variable created before will increment. 

    // Top 3
    minesNearby += verifyCellAround(r-1, c-1);      // Top-Left
    minesNearby += verifyCellAround(r-1, c);        // Top 
    minesNearby += verifyCellAround(r-1, c+1);      // Top Right

    //Left & Right
    minesNearby += verifyCellAround(r, c-1);        // Left
    minesNearby += verifyCellAround(r, c+1);        // Right

    // Bottom 3
    minesNearby += verifyCellAround(r+1, c-1);      // Bottom Left
    minesNearby += verifyCellAround(r+1, c);        // Bottom
    minesNearby += verifyCellAround(r+1, c+1);      // Bottom Right

    // A statement that checkes if there are any mines around the clicked cell. If yes, a sequence will follow that will write inside the clicked cell the number of the mines found around.
    if (minesNearby > 0) {
        container[r][c].innerText = minesNearby;
    }
    // If that is not the case, and there haven't been found any mines nearby, the following sequence will make it so the cells will uncover themselves until the nearest cells neighboured by a mine.
    else {
        //Top 3
        verifyNearbyMines(r-1, c-1);    // Top Left
        verifyNearbyMines(r-1, c);      // Top
        verifyNearbyMines(r-1, c+1);    // Top Right

        // Left & Right
        verifyNearbyMines(r, c-1);      // Left
        verifyNearbyMines(r, c+1);      // Right

        // Bottom 3
        verifyNearbyMines(r+1, c-1);    // Bottom Left
        verifyNearbyMines(r+1, c);      // Bottom
        verifyNearbyMines(r+1, c+1);    // Bottom Right
    }

    // Condition that end the game once the mines have been revealed
    if (clickedCells == rows * columns - numberOfMines) {
        endOfGame = true;
        winCheck();
        lastTimerValue = timer
        document.getElementById("timerCounter").innerHTML = lastTimerValue
    }

}


// The function used to check the cells for nearby mines.
function verifyCellAround(r, c) {
    // Simply returns the value of 0 in orther to not affect the calculated found mines when it checks for cells that have neighbouring cells outside the container boundaries. Example: border & corner cells.
    if (r < 0 || r >= rows || c < 0 || c >= columns) {
        return 0;
    }
    // Returns the value of 1 if mines have been found nearby in orther to increment it to the variables that keeps track of found mines.
    if (placeOfMines.includes(r.toString() + "-" + c.toString())) {
        return 1;
    }
    return 0;
}

function lossCheck() {
    document.getElementById("mines-text").innerHTML = "You Lost!";
    document.getElementById("timerCounter").style.display = "none";
    document.getElementById("timerLast").innerText = timer;
}
function winCheck() {
    document.getElementById("mines-text").innerHTML = "You Won!";
    document.getElementById("timerCounter").style.display = "none";
    document.getElementById("timerLast").innerText = timer;
}