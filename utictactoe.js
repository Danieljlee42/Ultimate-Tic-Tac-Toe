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
            // checkInnerWinner(inner);
            checkOuterWinner();
        }
    }

    function toggleTurn(inner){
        turn = (turn === 'O' ? 'X' : 'O');
        
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

    // function checkInnerWinner(inner){
    //     if(outerCells[innerCells[inner].outPlace].value === null){
    //         outerCells[innerCells[inner].outPlace].element.classList.add('');
    //     }
    // }

    function checkOuterWinner(){

    }


})();