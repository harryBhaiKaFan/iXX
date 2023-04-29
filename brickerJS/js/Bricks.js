import {randInt} from "./Utils.js";
import {Draw} from "./Draw.js"

function Map(ROW,COLUMN)
{
	let m=[];
	
	for(let i=0;i<ROW;i++)
	{
		m[i]=[];
		for(let j=0;j<COLUMN;j++)
		{
			m[i][j]=randInt(1,10)%2;
		}
	}
	
	return(m);
}

export const Bricks={
	ROW:0,
	COL:0,
	UP_DSPLC:50,
	BALL:null,
	BrickMeta:{
		w:70,
		h:30,
		bg:"#ff0404"
	},
	Game:null,
	Bricks:null,
	init: function (cnv,Ball,Game){
		this.BALL=Ball;
		this.Game=Game;
		this.ROW=Math.floor(cnv.width/this.BrickMeta.w);
		this.COLUMN=Math.floor((cnv.height*40/100)/this.BrickMeta.h);
		this.Bricks=Map(this.ROW,this.COLUMN);
	},
	render: function (ctx,change){
		let zero=true; // whether bricks are zero or not
		for(let i=0;i<this.ROW;i++)
		{
			for(let j=0;j<this.COLUMN;j++)
			{
				let dmsn={
					x:this.BrickMeta.w*i,
					y:this.BrickMeta.h*j+this.UP_DSPLC,
					w:this.BrickMeta.w,
					h:this.BrickMeta.h
				};
				
				if(this.Bricks[i][j]){
					zero=false;
					Draw.drawRect(ctx,dmsn,this.BrickMeta.bg,true);
					
					if(this.BALL.collides(dmsn)){
						this.Bricks[i][j]=0;
						this.Game.SCORE=this.Game.SCORE+1;
					}
				}
			}
		}
		
		if(zero){
			this.Bricks=Map(this.ROW,this.COLUMN);
		}
		
	}
}