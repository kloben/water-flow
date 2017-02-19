var maxGrid = 50;
var oFps = document.getElementById('fpsCounter');
var nFpsCounter = 0;

class Cell{
    constructor(x, y, oNode){
        this.x = x;
        this.y = y;
        this.load = 0;
        this.node = oNode;
        this.incoming = 0;
        this.bWall = false;
        this.bPaintedWall = false;
    }

    getString(){
        return `(${this.x}, ${this.y})`;
    }

    addLoad(val){
        this.incoming += val;
    }
    setLoad(val){
        this.load = val;
    }
    setWall(bWall){
        this.bPaintedWall = false;
        this.bWall = bWall;
    }
    isWall(){
        return this.bWall;
    }
    getLoad(){
        return this.load+this.incoming;
    }

    process(){
        if(!this.bWall && this.load > 0){//I have load
            if(this.x < maxGrid-1){//Can give down
                let oDown = aCells[this.x+1][this.y];
                if(!oDown.isWall()){
                    let nMaxAccept = 100 - oDown.getLoad();
                    let nAmount = 0;
                    if(nMaxAccept < this.load){
                        nAmount = nMaxAccept;
                    }
                    else{
                        nAmount = this.load;
                    }

                    oDown.addLoad(nAmount);
                    this.load -= nAmount;
                }
            }
            if(this.load > 0){
                let oLeft = aCells[this.x][this.y-1];
                let oRight = aCells[this.x][this.y+1];

                let nCanReceiveL = (oLeft && !oLeft.isWall())?this.load > oLeft.getLoad():false;
                let nCanReceiveR = (oRight && !oRight.isWall())?this.load > oRight.getLoad():false;

                let nTotal = this.load;
                let nCount = 1;
                if(nCanReceiveL){
                    nTotal += oLeft.getLoad();
                    nCount++;
                }
                if(nCanReceiveR){
                    nTotal += oRight.getLoad();
                    nCount++;
                }
                let nEach = nTotal/nCount;

                if(nCanReceiveL){
                    let nAmountL;
                    if(this.load < 5){
                        nAmountL = this.load;
                    }
                    else{
                        nAmountL = nEach-oLeft.getLoad();
                    }
                    oLeft.addLoad(nAmountL);
                    this.load -= nAmountL;
                }
                if(nCanReceiveR){
                    let nAmountR;
                    if(this.load < 5){
                        nAmountR = this.load;
                    }
                    else{
                        nAmountR = nEach-oRight.getLoad();
                    }
                    oRight.addLoad(nAmountR);
                    this.load -= nAmountR;
                }
            }
        }
    }
    autoPaint(){
        if(this.bWall){
            if(!this.bPaintedWall){
                this.node.className = 'wall';
                this.bPaintedWall = true;
            }
            return;
        }
        this.load += this.incoming;
        this.incoming = 0;
        if(this.load <= 0){
            this.node.className = '';
        }
        else if(this.load < 33){
            this.node.className = 'low';
        }
        else if(this.load < 66){
            this.node.className = 'med';
        }
        else{
            this.node.className = 'high';
        }
        let cleanLoad = Math.round(this.load);
        //this.node.innerHTML = Math.round(this.load);
        let oUp = (this.x >0)?(aCells[this.x-1][this.y]):null;

        this.node.style.height = (oUp && oUp.getLoad() > 0)?'100%':cleanLoad+'%';
    }
}

var oGridContainer = document.getElementById('gridContainer');
var aCells = [];

//Init - create
for(let i = 0; i<maxGrid; i++){
    let aRow = [];

    for(let j = 0;j<maxGrid;j++){
        let oNode = document.createElement('div');
        oNode.className += 'cell';
        oNode.onmouseover = function(){
            if(bMouseDown){
                newCell(i, j)
            }
        };

        let oInner = document.createElement('span');
        oNode.appendChild(oInner);

        oGridContainer.appendChild(oNode);

        let oCell = new Cell(i, j, oInner);

        aRow.push(oCell);
    }

    aCells.push(aRow);
}


//HERE GOES HARD INITS

function renderAll(){
    for(let aRow of aCells){
        for(let oCell of aRow){
            oCell.autoPaint();
        }
    }
    window.setTimeout(processAll, 1);
}
function processAll(){
    for(let aRow of aCells){
        for(let oCell of aRow){
            oCell.process();
        }
    }
    renderAll();
    nFpsCounter++;
}
function newCell(x, y){
    let eSel = document.getElementById('cursorSelector');
    let sSel = eSel.options[eSel.selectedIndex].value;
    let oCell = aCells[x][y];

    if(sSel == 'del'){
        oCell.setLoad(0);
        oCell.setWall(false);
    }
    else if(sSel == 'water'){
        oCell.setLoad(100);
        oCell.setWall(false);
    }
    else if(sSel == 'wall'){
        oCell.setLoad(0);
        oCell.setWall(true);
    }
}
processAll();

window.setInterval(checkFps, 1000);
function checkFps(){
    oFps.innerText = nFpsCounter;
    nFpsCounter = 0;
}

var bMouseDown = false;

document.getElementById('gridContainer').onmousedown = function(){
    bMouseDown = true;
};

document.getElementById('gridContainer').onmouseup = function(){
    bMouseDown = false;
};