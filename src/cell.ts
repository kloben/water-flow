

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
		public node:HTMLElement
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
		this.queueDistribution();
	}
	addLoad(load:number){
		this.currentLoad += load;
		if(this.currentLoad > 100){
			this.currentLoad = 100;
		}
		this.updateClass();
		this.queueDistribution();
	}
	erase(){
		this.isWall = false;
		this.node.className = 'cell';
		this.currentLoad = 0;
		if(this.timeout){
			this.timeout = null;
		}
		if(this.up){
			this.up.queueDistribution();
		}
	}


	distribute(){
		if(this.timeout){
			this.timeout = null;
		}
		let anyChange = false;
		if(this.currentLoad === 0){
			return;
		}
		if(this.down && !this.down.isWall && this.down.currentLoad < 100){
			let quantity = Math.min(100-this.down.currentLoad, this.currentLoad);
			this.down.addLoad(quantity);
			this.currentLoad -= quantity;
			anyChange = true;
		}
		if(anyChange){
			if(this.up){
				this.up.queueDistribution();
			}
			this.updateClass();
			this.queueDistribution();
		}
	}

	private timeout:any = null;
	private queueDistribution(){
		if(this.timeout === null){
			this.timeout = setTimeout(this.distribute.bind(this), 100);
		}
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
		this.node.innerText = this.currentLoad.toString();
	}


	setAsWall(){
		this.isWall = true;
		this.node.className = 'cell wall';
		this.currentLoad = 0;
		if(this.timeout){
			this.timeout = null;
		}
	}
}