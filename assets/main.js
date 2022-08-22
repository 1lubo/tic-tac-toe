
function Game() {
    this.board = new GameBoard();
    this.player1 = new Player('Player1', 'X');
    this.player2 = new Player('Player2', 'O');
    this.winner = false;
    this.players = [this.player1, this.player2];    
    this.winningFields = null;
    
    
}

Game.prototype.getPlayerNames = function() {
    var player1name = document.getElementById('player1').value;
    var player2name = document.getElementById('player2').value;
    var displayPlayer1Name = document.getElementById('player1name');
    var displayPlayer2Name = document.getElementById('player2name');

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
    
    document.getElementById('player1name').value = '';
    document.getElementById('player2name').value = '';
    
}

Game.prototype.showWinningFields = function(){     
    var gameBoard = document.getElementsByClassName('game-board')[0];

    this.winningFields.forEach(field => gameBoard.childNodes[field].className = 'box winning')    
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
        this.winningFields = [0,1,2];
        return this.board.row1[0];
    } else if (allAreEqual(this.board.row2) && this.board.row2[0] != '') {
        this.winningFields = [3,4,5];
        return this.board.row2[0];
    } else if (allAreEqual(this.board.row3) && this.board.row3[0] != '') {
        this.winningFields = [6,7,8];
        return this.board.row3[0];
    } else {
        return false;
    }
}

Game.prototype.checkColumns = function() {
    if (allAreEqual(this.board.col1) && this.board.col1[0] != '') {
        this.winningFields = [0, 3, 6];
        return this.board.col1[0];
    } else if (allAreEqual(this.board.col2) && this.board.col2[0] != '') {
        this.winningFields = [1, 4, 7];
        return this.board.col2[0];
    } else if (allAreEqual(this.board.col3) && this.board.col3[0] != '') {
        this.winningFields = [2, 5, 8];
        return this.board.col3[0];
    } else {
        return false;
    }
}

Game.prototype.checkDiagonals = function(){
    if (allAreEqual(this.board.diag1) && this.board.diag1[0] != '') {
        this.winningFields = [0, 4, 8];
        return this.board.diag1[0];
    } else if (allAreEqual(this.board.diag2) && this.board.diag2[0] != '') {
        this.winningFields = [2, 4, 6];
        return this.board.diag2[0];    
    } else {
        return false;
    }
}

Game.prototype.play = function() { 
    var game = this
    var button = document.getElementById('start');
    var resetButton = document.getElementById('reset');
    var closeSettings = document.getElementById("closeSettings");
    var openSettings = document.getElementById("openSettings");
    var confirm = document.getElementById("confirm");
    openSettings.addEventListener('click', function(){
        game.openSettings();
    } );
    closeSettings.addEventListener('click', function() {
        game.closeSettings();
    });

    confirm.addEventListener('click', function(){
        game.getPlayerNames();
        game.closeSettings();
    })

    game.winningFields = null;
    game.players.reverse();  /* reverse player order after each round*/      
    var counter = 0;  
    game.board.resetBoard(); 
    game.whosTurn(game.players[counter%2].symbol);
    
    
    var availableFields = Array.from(document.getElementsByClassName('box')).filter(field => field.innerHTML === ''); /* make an array of available fields */
    
    availableFields.forEach(element => element.addEventListener('click', function() { /* add event listener to every game board field*/

        if (availableFields.length > 0) {
            
            this.innerHTML = game.players[counter%2].symbol; /* put player symbol on the clicked field*/
            availableFields.splice(availableFields.indexOf(this), 1); /* remove field from list of available fields*/
            counter ++;
            game.whosTurn(game.players[counter%2].symbol);
        } 

        game.refreshBoard(); /* after every turn refresh arrays which keep track of player moves*/
        game.checkBoard(); /* after every turn check if any array holds three identical symbols*/

        /* game round ends in win */
        if(game.winner) {    
            game.makeAnnouncement(game.result());            
            game.updateScore();
            game.showWinningFields();
            game.winner = false;                                   
            game.showModal()

            button.addEventListener('click', function(e){                                
                game.clearAnnouncement();
                game.play()
                game.hideModal()
            }, {once: true}) 

            resetButton.addEventListener('click', function(e){                                
                game.clearAnnouncement();
                game.player1.score = 0;
                game.player2.score = 0;
                game.updateScore();
                game.play()
                game.hideModal()
            }, {once: true}) 
                   
            
            
        }   
        
        /* game round ends in tie */
        if(availableFields.length < 1) {
            game.makeAnnouncement("It's a tie");                        
            game.showModal();

            button.addEventListener('click', function(e){                                
                game.clearAnnouncement();
                game.play()
                game.hideModal()
            }, {once: true}) 

            resetButton.addEventListener('click', function(e){                                
                game.clearAnnouncement();
                game.player1.score = 0;
                game.player2.score = 0;
                game.updateScore();
                game.play()
                game.hideModal()
            }, {once: true}) 
        }

        }, { once: true }));     
        
}


/* open modal after a game round finishes*/
Game.prototype.showModal = function(){
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    document.getElementsByClassName('player active')[0].setAttribute('class', 'player');
    document.getElementsByClassName('score-board')[0].setAttribute('style', 'opacity: 0')
}

/* hide modal after a game round finishes*/
Game.prototype.hideModal = function(){
    var modal = document.getElementById("myModal");
    modal.style.display = "none";
    document.getElementsByClassName('score-board')[0].setAttribute('style', 'opacity: 1');
}


/* show which player is supposed to make the next turn */
Game.prototype.whosTurn = function(id){
 var inActiveSymbol = (id === 'X') ? 'O' : 'X';
 var inActive = document.getElementById(inActiveSymbol); 
 var active = document.getElementById(id);

 active.setAttribute("class", "player active");
 inActive.setAttribute("class", "player");
}


/* display announcement on score board */
Game.prototype.makeAnnouncement = function(string){
    var announcement = document.getElementsByClassName('announcement')[0];
    announcement.innerHTML = string;
}

/* clear announcement on score board */
Game.prototype.clearAnnouncement = function(){
    var announcement = document.getElementsByClassName('announcement')[0];
    announcement.innerHTML = '';
}

/* update player score on score board */
Game.prototype.updateScore = function() {
    var player1Score = document.getElementsByClassName('player')[0].querySelector('#score');
    var player2Score = document.getElementsByClassName('player')[1].querySelector('#score');

    player1Score.innerHTML = this.player1.score;
    player2Score.innerHTML = this.player2.score;
}


/* open modal with settings menu */
Game.prototype.openSettings = function(){    
    var modal = document.getElementById("settingsModal");
    modal.style.display = "block";

    
    document.getElementsByClassName('score-board')[0].setAttribute('style', 'opacity: 0')
    document.getElementById('settings').setAttribute('style', 'opacity: 0');
}

/* close modal with settings menu */
Game.prototype.closeSettings = function(){
    var modal = document.getElementById("settingsModal");
    modal.style.display = "none";
    document.getElementsByClassName('score-board')[0].setAttribute('style', 'opacity: 1');
    document.getElementById('settings').setAttribute('style', 'opacity: 1');
}



/* Player object */
function Player (name, symbol) {
    this.name = name || '';
    this.symbol = symbol;
    this.score = 0;
}


/* Gameboard object */
function GameBoard (){
    this.fields = [];
    }

/* create rows to check for winning conditions */
GameBoard.prototype.makeRows = function () {
    this.row1 = this.fields.slice(0,3);
    this.row2 = this.fields.slice(3,6);
    this.row3 = this.fields.slice(6);
}

/* create columns to check for winning conditions */
GameBoard.prototype.makeColumns = function () {
    this.col1 = [this.fields.at(0), this.fields.at(3), this.fields.at(6)]
    this.col2 = [this.fields.at(1), this.fields.at(4), this.fields.at(7)]
    this.col3 = [this.fields.at(2), this.fields.at(5), this.fields.at(8)]
}

/* create diagonals to check for winning conditions */
GameBoard.prototype.makeDiagonals = function () {
    this.diag1 = [this.fields.at(0), this.fields.at(4), this.fields.at(8)]
    this.diag2 = [this.fields.at(2), this.fields.at(4), this.fields.at(6)]
    }

/* refresh fields to keep track of player moves */ 

GameBoard.prototype.refreshFields = function() {
    this.fields = [];
    Array.from(document.getElementsByClassName('box')).forEach(element =>
        this.fields.push(element.innerHTML));        
    
}

/* create 9 boxes for the game board */ 
GameBoard.prototype.createBoard = function(){
    console.log('creating board function')
    var boardParent = document.getElementsByClassName('game-board')[0];
    for (let i = 0; i < 9; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.id = i;
        boardParent.appendChild(box);
        this.fields.push(box.innerHTML);
    }
}

/* reset game board - create new boxes */
GameBoard.prototype.resetBoard = function() {
    
    var boardParent = document.getElementsByClassName('game-board')[0];
    while (boardParent.firstChild) {
        boardParent.removeChild(boardParent.lastChild)
    }
    console.log('resetting board function')
    this.createBoard();
}


/* helper function to check if all items in array are equal or not */ 
function allAreEqual(array) {
    const result = array.every(element => {
      if (element === array[0]) {
        return true;
      }
    });
  
    return result;
  }



var newGame = new Game(); /* create new Game instance */
window.addEventListener('onload', newGame.play()) /* start Game on window load */


