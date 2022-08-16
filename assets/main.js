
function Game() {
    this.board = new GameBoard();
    this.player1 = new Player('', 'X');
    this.player2 = new Player('', 'O');
}

Game.prototype.initialize = function () {    
    this.board.initialize();
    this.board.makeColumns();
    this.board.makeDiagonals();
    this.board.makeRows();
    modal.style.display = "block";
}

Game.prototype.getPlayerNames = function() {
    var player1name = document.getElementById('player1').value;
    var player2name = document.getElementById('player2').value;
    if (player1name.length < 1) {
        player1name = 'John Doe';
    } 
    
    if (player2name.length < 1) {
        player2name = 'Jim Doe';
    }
    
    this.player1.name = player1name;
    this.player2.name = player2name;    
}

Game.prototype.checkRows = function() {
    
}

Game.prototype.checkColumns = function() {

}

Game.prototype.checkDiagonals = function(){

}

function allAreEqual(array) {
    const result = array.every(element => {
      if (element === array[0]) {
        return true;
      }
    });
  
    return result;
  }

function Player (name, symbol) {
    this.name = name || 'John Doe';
    this.symbol = symbol;
}

function GameBoard (){
    this.fields = [];
    
}

GameBoard.prototype.makeRows = function () {
    this.row1 = this.fields[0,3];
    this.row2 = this.fields[3,6];
    this.row3 = this.fields[7];
}

GameBoard.prototype.makeColumns = function () {
    this.col1 = [this.fields.at(0), this.fields.at(3), this.fields.at(6)]
    this.col2 = [this.fields.at(1), this.fields.at(4), this.fields.at(7)]
    this.col3 = [this.fields.at(2), this.fields.at(5), this.fields.at(8)]
}

GameBoard.prototype.makeDiagonals = function () {
    this.diag1 = [this.fields.at(0), this.fields.at(4), this.fields.at(8)]
    this.diag2 = [this.fields.at(2), this.fields.at(4), this.fields.at(6)]
    
}


GameBoard.prototype.initialize = function() {
    this.createBoard();
    console.log('Game Board Created');
}

GameBoard.prototype.createBoard = function(){
    var boardParent = document.getElementsByClassName('game-board')[0];
    for (let i = 0; i < 9; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.id = i;
        boardParent.appendChild(box);
        this.fields.push(box.innerText);
    }
}

var newGame = new Game()
var modal = document.getElementById("myModal");
window.addEventListener('onload', newGame.initialize())

window.onclick = function(event) {
    if (event.target == modal) {            
      modal.style.display = "none";
    } 
  }


Array.from(document.getElementsByClassName('box')).forEach(element => element.addEventListener('click', function(){
    this.innerText = 'O';
}));



var getNamesButton = document.getElementById("getnames");

//getNamesButton.addEventListener('onclick', getPlayerNames());
getNamesButton.addEventListener('click', function() {newGame.getPlayerNames()});
getNamesButton.addEventListener('click', function(){modal.style.display = "none"});

