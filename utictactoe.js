const utictactoe = (function(){
    const innerCellElements = document.getElementsByClassName('inner-cell');
    const outerCellElements = document.getElementsByClassName('outer-cell');
    const coverElements = document.getElementsByClassName('cover');
    const innerCells = [];
    const outerCells = [];
    const magicsq = [2, 7, 6, 9, 5, 1, 4, 3, 8]; // 8, 1, 6, 3, 5, 7, 4, 9, 2
    
    let turn = 'O' // O gonna go first
    let playing = true

    for(let index = 0, inPlace = 0; index < innerCellElements.length; index++){
        inPlace = index%9;
        outPlace = Math.floor(index/9);
        innerCellElements[index].addEventListener('click', evt => cellClick(evt, index));
        innerCells[index] = {
            inPlace: inPlace,   //identifies which location in the outer
            outPlace: outPlace, //identifies which outer location
            element: innerCellElements[index],
            value: null, // indicates if cell is O or X
            magicsq: 0, // magicsq[inPlace],
            reset: function(){
                this.element.classList.remove(this.value);
                this.value = null;
                this.magicsq =  0;
            }
        }
    }

    let counter = 0; 
    for (let outer = 0; outer < outerCellElements.length; outer++){
        tempInnerCells = [];
        for (let i = 0; i < 9; i++, counter++){
            //console.log(i+' '+counter);
            tempInnerCells[i] = innerCells[counter];
        }
        outerCells[outer] = {
            element: outerCellElements[outer],
            value: null,
            left: 9,
            inner: tempInnerCells,
            magicsq: 0, //magicsq[outer],
            reset: function(){
                this.element.classList.remove(this.value);
                this.element.classList.remove('highlight');
                this.value = null;
                this.magicsq = 0;
                this.left = 9;
            }
        }
    }

    //add in listener to outer to update the cover
    for (let i = 0; i < coverElements.length; i++){
        outerCellElements[i].addEventListener('mouseover', evt => coverHover(evt, i));
        outerCellElements[i].addEventListener("mouseout", evt => coverUnhover(evt, i));
    }
    function coverHover(evt, i){
        coverElements[i].classList.add('hover');
    }
    function coverUnhover(evt, i){
        coverElements[i].classList.remove('hover');
    }

    let highlighted = null;
    document.getElementsByClassName('wrapper')[0].classList.add('highlight'); 

    function cellClick(evt, inner){
        if(playing && innerCells[inner].value === null && 
        (highlighted === null || highlighted === innerCells[inner].outPlace)){

            if(highlighted !== null){
                outerCells[highlighted].element.classList.remove('highlight');
            }
            outerCells[innerCells[inner].outPlace].left--; //decrement left for the outercell
            innerCells[inner].value = turn; 
            innerCells[inner].element.classList.add(turn); 
            innerCells[inner].magicsq = (turn === 'O' ? 1 : -1) * magicsq[innerCells[inner].inPlace]; //updates magicsq*[1 = O while -1 = X]
            toggleTurn(inner);
            checkInnerWinner(inner);
            turn = (turn === 'O' ? 'X' : 'O');
            if (checkOuterWinner()){
                document.getElementsByClassName('info')[0].innerText = 'Turn: ' + turn;
            }
        }
    }

    function toggleTurn(inner){
        if (outerCells[innerCells[inner].inPlace].left === 0){ //if outercell has full innercell
            highlighted = null;
            document.getElementsByClassName('wrapper')[0].classList.add('highlight'); 
        } 
        else {
            document.getElementsByClassName('wrapper')[0].classList.remove('highlight');  
            highlighted = innerCells[inner].inPlace;
            outerCells[innerCells[inner].inPlace].element.classList.add('highlight'); 
        }
    }

    function checkInnerWinner(inner){
        if(outerCells[innerCells[inner].outPlace].value === null){
            let winner = checkWinner(outerCells[innerCells[inner].outPlace].inner);
            if (winner !== null){
                coverElements[innerCells[inner].outPlace].classList.add(winner); //indicate cover
                outerCells[innerCells[inner].outPlace].value = winner; //update outer value
                outerCells[innerCells[inner].outPlace].magicsq = (winner === 'O' ? 1 : -1) * magicsq[innerCells[inner].outPlace]; //updates magicsq*[1 = O while -1 = X]
            }
            else if (outerCells[innerCells[inner].outPlace].left === 0){
                outerCells[innerCells[inner].outPlace].value = "draw";
            }
        }
    }

    function checkOuterWinner(){
        //case 1: a player wins = there is 3 in a row
        let winner = checkWinner(outerCells);
        if (winner !== null){
            document.getElementsByClassName('info')[0].innerText = 'WINNER! '+winner;
            playing = false;
            return false;
        }
        //case 2: draw = there is no 2 in a row ==> all outercells has left = 0
        //better: draw = all outer has a value
        var draw = true;
        for (i = 0; i < outerCells.length; i++){
            draw = draw && (outerCells[i].value !== null?true:false); //if one cell doesn't have a value then it will make draw false
        }
        if (draw){
            document.getElementsByClassName('info')[0].innerText = 'DRAW!';
            playing = false;
            return false;
        }
        return true;
    }

    function checkWinner(cell){
        let winner = null;
        if (cell[0].magicsq+cell[1].magicsq+cell[2].magicsq==15 ||
            cell[3].magicsq+cell[4].magicsq+cell[5].magicsq==15 ||
            cell[6].magicsq+cell[7].magicsq+cell[8].magicsq==15 ||
            cell[0].magicsq+cell[3].magicsq+cell[6].magicsq==15 ||
            cell[1].magicsq+cell[4].magicsq+cell[7].magicsq==15 ||
            cell[2].magicsq+cell[5].magicsq+cell[8].magicsq==15 ||
            cell[0].magicsq+cell[4].magicsq+cell[8].magicsq==15 ||
            cell[2].magicsq+cell[4].magicsq+cell[6].magicsq==15){
            winner = 'O';
        }
        else if (cell[0].magicsq+cell[1].magicsq+cell[2].magicsq==-15 ||
            cell[3].magicsq+cell[4].magicsq+cell[5].magicsq==-15 ||
            cell[6].magicsq+cell[7].magicsq+cell[8].magicsq==-15 ||
            cell[0].magicsq+cell[3].magicsq+cell[6].magicsq==-15 ||
            cell[1].magicsq+cell[4].magicsq+cell[7].magicsq==-15 ||
            cell[2].magicsq+cell[5].magicsq+cell[8].magicsq==-15 ||
            cell[0].magicsq+cell[4].magicsq+cell[8].magicsq==-15 ||
            cell[2].magicsq+cell[4].magicsq+cell[6].magicsq==-15){
            winner = 'X'
        }
        return winner;
    }

    return {
        restart: function() {
            playing = true;
            turn = 'O';
            highlighted = null;
            document.getElementsByClassName('wrapper')[0].classList.add('highlight'); 
            document.getElementsByClassName('info')[0].innerTextinnerText = turn + '\'s TURN';
            for (let index = 0; index < outerCells.length; index++) {
                coverElements[index].classList.remove(outerCells[index].value);
                outerCells[index].reset();
            }
            for (let index = 0; index <innerCells.length; index++){
                innerCells[index].reset();
            }
        }
    }
})();