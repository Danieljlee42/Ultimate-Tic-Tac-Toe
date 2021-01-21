const utictactoe = (function(){
    const innerCellElements = document.getElementsByClassName('inner-cell');
    const outerCellElements = document.getElementsByClassName('outer-cell');
    const coverElements = document.getElementsByClassName('cover');
    const innerCells = [];
    const outerCells = [];
    const magicsq = [8, 1, 6, 3, 5, 7, 4, 9, 2];
    
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
            magicsq: magicsq[inPlace],
            reset: function(){
                this.element.classList.remove(this.value);
                this.value = null;
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
            magicsq: magicsq[outer],
            reset: function(){ 
                this.element.classList.remove(this.value);
                this.value = null;
                //TODO: refresh the innner cell values
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
        if(playing && 
            innerCells[inner].value === null && 
            (highlighted === null || highlighted === innerCells[inner].outPlace)){
            if(highlighted !== null){
                outerCells[highlighted].element.classList.remove('highlight');
            }
            outerCells[innerCells[inner].outPlace].left--; //decrement left for the outercell
            innerCells[inner].value = turn; 
            innerCells[inner].element.classList.add(turn); 
            toggleTurn(inner);
            checkInnerWinner(inner);
            checkOuterWinner();
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
        //infoElement.innerText = turn + '\'s TURN';
    }

    function checkInnerWinner(inner){
        if(outerCells[innerCells[inner].outPlace].value === null){
            let tempCells = outerCells[innerCells[inner].outPlace].inner;
            let winner = null;
            if (tempCells[0].value !== null && tempCells[0].value === tempCells[1].value && tempCells[0].value === tempCells[2].value) winner = tempCells[0].value //1 row [0,1,2]
            else if (tempCells[3].value !== null && tempCells[3].value === tempCells[4].value && tempCells[4].value === tempCells[5].value) winner = tempCells[3].value //2 row [3,4,5]
            else if (tempCells[6].value !== null && tempCells[6].value === tempCells[7].value && tempCells[7].value === tempCells[8].value) winner = tempCells[6].value //3 row [6,7,8]

            else if (tempCells[0].value !== null && tempCells[0].value === tempCells[3].value && tempCells[3].value === tempCells[6].value) winner = tempCells[0].value //1 col [0,3,6]
            else if (tempCells[1].value !== null && tempCells[1].value === tempCells[4].value && tempCells[4].value === tempCells[7].value) winner = tempCells[1].value //2 col [1,4,7]
            else if (tempCells[2].value !== null && tempCells[2].value === tempCells[5].value && tempCells[5].value === tempCells[8].value) winner = tempCells[2].value //3 col [2,5,8]

            else if (tempCells[0].value !== null && tempCells[0].value === tempCells[4].value && tempCells[4].value === tempCells[8].value) winner = tempCells[0].value //left dia [0,4,8]
            else if (tempCells[2].value !== null && tempCells[2].value === tempCells[4].value && tempCells[4].value === tempCells[6].value) winner = tempCells[2].value //right dia [2,4,6]
        
            // if (tempCells[0].value !== null)
            if (winner !== null){
                coverElements[innerCells[inner].outPlace].classList.add(winner); //indicate cover
                outerCells[innerCells[inner].outPlace].value = winner; //update outer value
            }

        }
    }

    function checkOuterWinner(){
        //case 1: a player wins = there is 3 in a row
        tempCells = outerCells;
        let winner = null;
        if (tempCells[0].value !== null && tempCells[0].value === tempCells[1].value && tempCells[0].value === tempCells[2].value) winner = tempCells[0].value //1 row [0,1,2]
        else if (tempCells[3].value !== null && tempCells[3].value === tempCells[4].value && tempCells[4].value === tempCells[5].value) winner = tempCells[3].value //2 row [3,4,5]
        else if (tempCells[6].value !== null && tempCells[6].value === tempCells[7].value && tempCells[7].value === tempCells[8].value) winner = tempCells[6].value //3 row [6,7,8]

        else if (tempCells[0].value !== null && tempCells[0].value === tempCells[3].value && tempCells[3].value === tempCells[6].value) winner = tempCells[0].value //1 col [0,3,6]
        else if (tempCells[1].value !== null && tempCells[1].value === tempCells[4].value && tempCells[4].value === tempCells[7].value) winner = tempCells[1].value //2 col [1,4,7]
        else if (tempCells[2].value !== null && tempCells[2].value === tempCells[5].value && tempCells[5].value === tempCells[8].value) winner = tempCells[2].value //3 col [2,5,8]

        else if (tempCells[0].value !== null && tempCells[0].value === tempCells[4].value && tempCells[4].value === tempCells[8].value) winner = tempCells[0].value //left dia [0,4,8]
        else if (tempCells[2].value !== null && tempCells[2].value === tempCells[4].value && tempCells[4].value === tempCells[6].value) winner = tempCells[2].value //right dia [2,4,6]
        
        if (winner !== null){
            document.getElementsByClassName('info')[0].innerText = 'WINNER! '+winner;
            playing = false;
            return false;
        }
    
        //case 2: draw = there is no 2 in a row ==> all outercells has left = 0
        var totalLeft = 0;
        for (i = 0; i < outerCells.length; i++){
            totalLeft+=outerCells[i].left;
        }
        if (totalLeft === 0){
            document.getElementsByClassName('info')[0].innerText = 'DRAW!';
            playing = false;
            return false;
        }
        return true;
    }
})();