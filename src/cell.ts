

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

	setLoad(load:number){
		this.currentLoad = load;
		this.updateClass();
		this.queueDistribution();
	}
	addLoad(load:number){
		this.currentLoad += load;
		if(this.currentLoad > 100){
			this.currentLoad = 100;
		}
		else if(this.currentLoad < 0){
			this.currentLoad = 0;
		}
		this.updateClass();
		this.queueDistribution();
	}
	erase(){
		this.isWall = false;
		this.currentLoad = 0;
		this.updateClass();
		this.clearTimeout();
		this.queueSiblings();
	}
	setAsWall(){
		this.isWall = true;
		this.currentLoad = 0;
		this.updateClass();
		this.clearTimeout();
	}
	acceptsLoad(){
		return !this.isWall && this.currentLoad < 100;
	}


	distribute(){
		if(this.timeout){
			this.timeout = null;
		}
		let anyChange = false;
		if(this.currentLoad === 0){
			return;
		}

		if(this.down && this.down.acceptsLoad()){
			let quantity = Math.min(100-this.down.currentLoad, this.currentLoad);
			this.down.addLoad(quantity);
			this.currentLoad -= quantity;
			anyChange = true;
		}
		if(this.currentLoad){
			let siblings = [];
			if(this.right && this.right.acceptsLoad() && this.right.currentLoad < this.currentLoad){
				siblings.push(this.right);
			}
			if(this.left && this.left.acceptsLoad() && this.left.currentLoad < this.currentLoad){
				siblings.push(this.left);
			}
			if(siblings.length !== 0){
				let totalLoad = this.currentLoad + siblings.reduce((sum:number, cell:Cell)=>{
					return sum + cell.currentLoad;
				}, 0);
				let splitLoad = Math.floor(totalLoad / (siblings.length+1));

				siblings.forEach((cell:Cell)=>{
					if(Math.abs(cell.currentLoad-splitLoad) > 2){
						anyChange = true;
						cell.setLoad(splitLoad);
					}
					totalLoad -= splitLoad;
				});
				this.currentLoad = totalLoad;
			}
		}

		if(anyChange){
			this.queueDistribution();
			this.queueSiblings();
		}
		this.updateClass();
	}

	private timeout:any = null;
	private queueDistribution(){
		if(this.timeout === null){
			this.timeout = setTimeout(this.distribute.bind(this), 5);
		}
	}
	private clearTimeout(){
		if(this.timeout){
			this.timeout = null;
		}
	}
	private queueSiblings(){
		if(this.up && !this.up.isWall && this.up.currentLoad){
			this.up.queueDistribution();
		}
		if(this.right && !this.right.isWall && this.right.currentLoad){
			this.right.queueDistribution();
		}
		if(this.left && !this.left.isWall && this.left.currentLoad){
			this.left.queueDistribution();
		}
	}

	private updateClass(){
		if(this.isWall){
			this.node.className = 'cell wall';
		}
		else if(this.currentLoad >= 100){
			this.node.className = 'cell high';
		}
		else if(this.currentLoad > 60){
			this.node.className = 'cell med';
		}
		else if(this.currentLoad > 0){
			this.node.className = 'cell low';
		}
		else{
			this.node.className = 'cell';
		}
		// this.node.innerText = this.currentLoad.toString();
	}
}