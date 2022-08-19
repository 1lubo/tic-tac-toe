
function Game() {
    this.board = new GameBoard();
    this.player1 = new Player('', 'X');
    this.player2 = new Player('', 'O');
    this.winner = false;
    this.players = [this.player1, this.player2];
    this.continue = false;
    this.playCounter = 0;
}

Game.prototype.initialize = function () {    
    this.board.initialize();
    this.refreshBoard();
    this.getPlayerNames();
    //modal.style.display = "block";
}

Game.prototype.getPlayerNames = function() {
    var player1name = document.getElementById('player1').value;
    var player2name = document.getElementById('player2').value;
    var displayPlayer1Name = document.getElementById('player1name');
    var displayPlayer2Name = document.getElementById('player2name')

    if (player1name.length < 1 || player1name.length == null) {
        player1name = 'John Doe';
    } 
    
    if (player2name.length < 1  || player2name.length == null) {
        player2name = 'Jim Doe';
    }
    
    this.player1.name = player1name;
    this.player2.name = player2name;    

    displayPlayer1Name.innerText = player1name;
    displayPlayer2Name.innerText = player2name;
}

Game.prototype.result = function() {
    
    if(this.winner === this.player1.symbol) {        
        this.player1.score ++;
        return `${this.player1.name} wins!`;
    } else if(this.winner === this.player2.symbol) {
        this.player2.score ++;
        return `${this.player2.name} wins!`;
    }
}

Game.prototype.refreshBoard = function() {
    this.board.refreshFields();
    this.board.makeRows();
    this.board.makeColumns();
    this.board.makeDiagonals();    
}

Game.prototype.checkBoard = function() {
    if(this.checkRows()) {
        this.winner = this.checkRows();
        return
    } else if(this.checkColumns()) {
        this.winner = this.checkColumns();
        return
    } else if(this.checkDiagonals()) {
        this.winner = this.checkDiagonals();
        return 
    }
}

Game.prototype.checkRows = function() {
    if (allAreEqual(this.board.row1) && this.board.row1[0] != '') {
        return this.board.row1[0];
    } else if (allAreEqual(this.board.row2) && this.board.row2[0] != '') {
        return this.board.row2[0];
    } else if (allAreEqual(this.board.row3) && this.board.row3[0] != '') {
        return this.board.row3[0];
    } else {
        return false;
    }
}

Game.prototype.checkColumns = function() {
    if (allAreEqual(this.board.col1) && this.board.col1[0] != '') {
        return this.board.col1[0];
    } else if (allAreEqual(this.board.col2) && this.board.col2[0] != '') {
        return this.board.col2[0];
    } else if (allAreEqual(this.board.col3) && this.board.col3[0] != '') {
        return this.board.col3[0];
    } else {
        return false;
    }
}

Game.prototype.checkDiagonals = function(){
    if (allAreEqual(this.board.diag1) && this.board.diag1[0] != '') {
        return this.board.diag1[0];
    } else if (allAreEqual(this.board.diag2) && this.board.diag2[0] != '') {
        return this.board.diag2[0];    
    } else {
        return false;
    }
}

Game.prototype.play = function() { 
    var game = this
    console.log(`Game # ${game.playCounter}`);
    game.playCounter++;
    
    game.players.reverse()    
    game.continue = false;
    var counter = 0;   
    game.board.resetBoard();     
    game.whosTurn(`${game.players[counter%2].name}'s turn.`)
    
    var availableFields = Array.from(document.getElementsByClassName('box')).filter(field => field.innerHTML === '');  
    console.log(`Available fields: ${availableFields.length}`)
    availableFields.forEach(element => element.addEventListener('click', function() {

        if (availableFields.length > 0) {
            console.log(counter)
            this.innerHTML = game.players[counter%2].symbol;                        
            availableFields.splice(availableFields.indexOf(this), 1);            
            counter ++;
            game.whosTurn(`${game.players[counter%2].name}'s turn.`)
        } 

        game.refreshBoard();
        game.checkBoard();

        if(game.winner) {    
            game.makeAnnouncement(game.result());            
            game.updateScore();
            game.winner = false;            
            game.continue = false;

            document.addEventListener('click', function(){                
                game.continue = true;                
                game.play()
            }, {once: true})            
           
        }   
        
        if(availableFields.length < 1) {
            game.makeAnnouncement("It's a tie");            
            game.continue = false;            
            document.addEventListener('click', function(){                
                game.continue = true;                
                game.play()
            }, {once: true})
        }

        }, { once: true }));     
        
}


Game.prototype.whosTurn = function(string){
    var whosTurn = document.getElementsByClassName('whosturn')[0];
    whosTurn.innerHTML = string;
}

Game.prototype.makeAnnouncement = function(string){
    var announcement = document.getElementsByClassName('announcement')[0];
    announcement.innerHTML = string;
}

Game.prototype.clearAnnouncement = function(){
    var announcement = document.getElementsByClassName('announcement')[0];
    announcement.innerHTML = '';
}

Game.prototype.updateScore = function() {
    var player1Score = document.getElementsByClassName('player')[0].querySelector('#score');
    var player2Score = document.getElementsByClassName('player')[1].querySelector('#score');

    player1Score.innerHTML = this.player1.score;
    player2Score.innerHTML = this.player2.score;
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
    this.name = name || '';
    this.symbol = symbol;
    this.score = 0;
}



function GameBoard (){
    this.fields = [];
    }

GameBoard.prototype.makeRows = function () {
    this.row1 = this.fields.slice(0,3);
    this.row2 = this.fields.slice(3,6);
    this.row3 = this.fields.slice(6);
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
}

GameBoard.prototype.refreshFields = function() {
    this.fields = [];
    Array.from(document.getElementsByClassName('box')).forEach(element =>
        this.fields.push(element.innerHTML));        
    
}

GameBoard.prototype.resetBoard = function() {
    var boardParent = document.getElementsByClassName('game-board')[0];
    while (boardParent.firstChild) {
        boardParent.removeChild(boardParent.lastChild)
    }
    this.createBoard();
}

GameBoard.prototype.createBoard = function(){
    var boardParent = document.getElementsByClassName('game-board')[0];
    for (let i = 0; i < 9; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.id = i;
        boardParent.appendChild(box);
        this.fields.push(box.innerHTML);
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

  newGame.play()





var getNamesButton = document.getElementById("getnames");


//getNamesButton.addEventListener('onclick', getPlayerNames());
getNamesButton.addEventListener('click', function() {newGame.getPlayerNames()});
getNamesButton.addEventListener('click', function(){modal.style.display = "none"});

//document.getElementById('0').innerHTML = 'X';
//document.getElementById('1').innerHTML = 'X';
//document.getElementById('2').innerHTML = 'X';