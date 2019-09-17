import {DrawingType} from "./enum/drawing-type.enum";

export class DrawingTypeSelector {
	public currentType:DrawingType = DrawingType.WATER;
	private activeDomElement:Element;


	init(){
		const parent = document.getElementById('drawSelector');
		parent.children[0].addEventListener('click', ()=>{
			this.updateDrawingType(DrawingType.WATER, parent.children[0])
		});
		parent.children[1].addEventListener('click', ()=>{
			this.updateDrawingType(DrawingType.WALL, parent.children[1])
		});
		parent.children[2].addEventListener('click', ()=>{
			this.updateDrawingType(DrawingType.DELETE, parent.children[2])
		});
		this.activeDomElement = parent.children[0];
		this.activeDomElement.className = 'option active';
	}
	private updateDrawingType(newType:DrawingType, node:Element){
		if(this.currentType !== newType){
			this.currentType = newType;
			this.activeDomElement.className = 'option';
			node.className = 'option active';
			this.activeDomElement = node;
		}
	}
}