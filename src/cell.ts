

export class Cell{
	public isWall:boolean = false;
	public currentLoad:number = 0;

	private up:Cell;
	private left:Cell;
	private right:Cell;
	private down:Cell;

	constructor(
		public readonly x:number,
		public readonly y:number,
		public node:Element
	){}

	setSiblings(left?:Cell, up?:Cell, right?:Cell, down?:Cell){
		this.left = left;
		this.up = up;
		this.right = right;
		this.down = down;
	}

	setFull(){
		this.currentLoad = 100;
		this.updateClass();
	}
	private updateClass(){
		if(this.currentLoad >= 100){
			this.node.className = 'cell high';
		}
		else if(this.currentLoad > 60){
			this.node.className = 'cell med';
		}
		else if(this.currentLoad === 0){
			this.node.className = 'cell';
		}
		else{
			this.node.className = 'cell low';
		}
	}


	setAsWall(){
		this.isWall = true;
		this.node.className = 'cell wall';
		this.currentLoad = 0;
	}
	erase(){
		this.isWall = false;
		this.node.className = 'cell';
		this.currentLoad = 0;
	}
}