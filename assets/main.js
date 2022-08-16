
function createBoard(){
    var boardParent = document.getElementsByClassName('game-board')[0];
    for (let i = 0; i < 9; i++) {
        let box = document.createElement('div');
        box.className = 'box';
        box.id = i;
        boardParent.appendChild(box);
    }
}

createBoard()

Array.from(document.getElementsByClassName('box')).forEach(element => element.addEventListener('click', function(){
    console.log(this.id);
}));