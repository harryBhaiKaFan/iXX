import { Dmsns, Draw, Color } from './Draw.js';
import { randInt } from './Utils.js';

const PATH = {
	CLOUD_IMG: "../img/Cloud.png",
	GRASS_IMG: "../img/Grass.png",
};

const DMSNS_CNST = {
	Grass_Width: function(vw){
		return(Math.ceil(vw/8));
	},
	Grass_Height: function(vh){
		return(Math.ceil(vh/8));
	},
	Cloud_Width: function(vw){
		return(Math.ceil(vw/5));
	},
	Cloud_Height: function(vh){
		return(Math.ceil(vh/3));
	}
}


function Grass(parentRect)
{
	let w=DMSNS_CNST.Grass_Width(parentRect.w);
	let h=DMSNS_CNST.Grass_Height(parentRect.h);
	let x=randInt(parentRect.x,parentRect.x+parentRect.w - w);
	let y=randInt(parentRect.y,parentRect.y+parentRect.h - h);
	this.img = new Draw.Image (PATH.GRASS_IMG,Dmsns(x,y,w,h))
}

function Cloud(parentRect)
{
	let w=DMSNS_CNST.Cloud_Width(parentRect.w);
	let h=DMSNS_CNST.Cloud_Height(parentRect.h);
	let x=randInt(parentRect.x,parentRect.x+parentRect.w - w);
	let y=randInt(parentRect.y,parentRect.y+parentRect.h - h);
	this.img = new Draw.Image(PATH.CLOUD_IMG,Dmsns(x,y,w,h));
}

const Ground = {
	grasses: [null],
	X:0,
	Y:0,
	WIDTH: 0,
	HEIGHT: 0,
	RECT: null,
	grassCnt:0,
	init:function(dmsns){

		this.WIDTH = dmsns.w;
		this.HEIGHT = dmsns.h;
		this.Y = dmsns.y;
		this.X = dmsns.x;

		this.grassCnt = randInt(5,12);

		for (let i = 0; i < this.grassCnt ; i++) {
			this.grasses[i] = new Grass(Dmsns(this.X,this.Y,this.WIDTH,this.HEIGHT));		
		}

		this.RECT = new Draw.Rect(Dmsns(this.X,this.Y,this.WIDTH,this.HEIGHT),Color("Green")); // Ground 
	},

	render:function()	{
		this.RECT.render(); // Rendering ground 

		for (let i = 0; i < this.grassCnt ; i++) {
			this.grasses[i].img.render();
		}
	}
}; // A ground with grasses

const Sky = {
	clouds:[null],
	cloudCnt: 0,
	X:0,
	Y:0,
	WIDTH:0,
	HEIGHT:0,
	times:0.01,
	init:function(dmsns){

		this.X = dmsns.x;
		this.Y = dmsns.y;
		this.WIDTH = dmsns.w;
		this.HEIGHT = dmsns.h;
		this.cloudCnt = randInt(1,4);

		for (let i = 0; i < this.cloudCnt; i++) {
			this.clouds[i] = new Cloud(Dmsns(this.X,this.Y,this.WIDTH,this.HEIGHT));	
		}
	},
	render:function(delta){
		for (let i = 0; i < this.clouds.length; i++) {
			this.clouds[i].img.render();
			this.clouds[i].img.rect.dmsns.x -= delta * this.times * (i+1);

			if(this.clouds[i].img.rect.dmsns.x + DMSNS_CNST.Cloud_Width(this.WIDTH) <= 0)
			{
				this.clouds[i].img.rect.dmsns.x = this.X+this.WIDTH+100;
				this.clouds[i].img.rect.dmsns.y = randInt(this.Y,this.Y+this.HEIGHT - DMSNS_CNST.Cloud_Height(this.HEIGHT));
			}
		}
	}
}; // A sky with floating clouds color already filled 

export const Background = {
	init: function(cnvs){
		Sky.init(Dmsns(0,0,cnvs.width,cnvs.height/5));
		Ground.init(Dmsns(0,2*cnvs.height/3,cnvs.width,cnvs.height/3));
	},
	render: function(delta){
		Sky.render(delta);
		Ground.render();
	}
}
