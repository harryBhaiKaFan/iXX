import {Draw} from "./Draw.js";
import {Bricks} from "./Bricks.js";
import {randNum} from "./Utils.js";

/***
 * 
 * BUGS 🐞 (known) (NEVER FIXED)
 * 
 * 1. PLATFORM NOT WORKING WHEN BALL IS TOO FAST.
 * 2. When Ball launch angle == π/2, the ball falls in a loop of going up and down.
 * 
*/

const SCORE_ELEM={
	SCORE_VAL:0,
	dmsns:{
		x:0,
		y:0,
		fontSize:0
	},
	init: function (cnv){
		this.x=cnv.width*80/100;
		this.y=5;
		this.fontSize=23;
	},
	render: function (ctx,change){
		Draw.drawTextRect(ctx,{x:this.x,y:this.y},"rgba(0,0,0,0)","#ff2b00",this.fontSize,this.SCORE_VAL);
	}
};

const LIFE_ELEM={
	LIFE_IMG:null,
	LIVES:3,
	dmsns:{
		x:5,
		y:5,
		w:25,
		h:20
	},
	init: function (cnv){
		this.LIFE_IMG=new Image();
		this.LIFE_IMG.src=location.href+"/img/life.png";
	},
	render: function (ctx,change){
		let curr_lives=this.LIVES
		while(curr_lives > 0){
			Draw.drawImage(ctx,this.dmsns,this.LIFE_IMG);
			this.dmsns.x+=this.dmsns.w;
			curr_lives--;
		}
		this.dmsns.x=5;
	}
	
};

const BALL_ELEM={
	cx:0,
	cy:0,
	radius:0,
	velocity:0.08,
	drxn:{x:null,y:null},
	accn:0.0011,
	init: function (cnv,padms){
		this.radius=8;
		this.cx=(padms.x+padms.w/2);
		this.cy=(padms.y-this.radius);
		this.velocity=0.08;
		this.accn=0.0011;
		
		let angle = randNum(0,Math.PI);
		
		this.drxn.x=Math.cos(angle);
		this.drxn.y=-Math.sin(angle);
		
	},
	collides: function(dmns){
		let sx=this.cx-this.radius;
		let ex=this.cx+this.radius;
		let sy=this.cy-this.radius;
		let ey=this.cy+this.radius;
		let cy=this.cy;
		let cx=this.cx;
		
		if(sx > dmns.x && sx < dmns.x+dmns.w && cy > dmns.y && cy < dmns.y+dmns.h)
		{
			this.drxn.x*=-1;
			return(true);
		}
		else if(ex > dmns.x && ex < dmns.x+dmns.w && cy > dmns.y && cy < dmns.y+dmns.h)
		{
			this.drxn.x*=-1;
			return(true);
		}
		else if(sy > dmns.y && sy < dmns.y+dmns.h && cx > dmns.x && cx < dmns.x+dmns.w)
		{
			this.drxn.y*=-1;
			return(true);
		}
		else if(ey > dmns.y && ey < dmns.y+dmns.h && cx > dmns.x && cx < dmns.x+dmns.w)
		{
			this.drxn.y*=-1;
			return(true);
		}
		
		return(false);
	},
	render: function (ctx,change){
		
		if(this.cy+this.radius >= Game.SCREEN_HEIGHT)
		{
			//Game over state!
			if(LIFE_ELEM.LIVES > 1){ 
				// 1 heart 💓 is the last life.
				LIFE_ELEM.LIVES--;
				this.init(Game.CANVAS,PLATFORM_ELEM.dmsns);
				return;
			}
			setTimeout(()=>{
				GAME_STATE=Game.over.bind(Game);
			},200);
		}
		
		if(this.cx-this.radius <= 0)
		{
			this.drxn.x*=-1;
		}
		
		if(this.cx + this.radius >= Game.SCREEN_WIDTH)
		{
			this.drxn.x*=-1;
		}
		
		if(this.cy-this.radius <= 0)
		{
			this.drxn.y*=-1;
		}
		
		
		this.cx+=(this.velocity*this.drxn.x);
		this.cy+=(this.velocity*this.drxn.y);
		
		this.velocity += this.accn * change/8;
		
		
		Draw.drawCircle(ctx,this.cx,this.cy,this.radius,"#dfff0b");
	}
};

const PLATFORM_ELEM={
	touch:{
		sx:0,
		ex:0
	},
	dmsns:{
		x:0,
		y:0,
		w:0,
		h:0,
		lift:5
	},
	BG_COLOR: null,
	init:function(cnv,ball){
		
		this.dmsns.w=80;
		this.dmsns.h=5;
		this.dmsns.x=Game.SCREEN_WIDTH/2 - this.dmsns.w/2;
		this.dmsns.y=Game.SCREEN_HEIGHT-(this.dmsns.h+this.dmsns.lift);
		this.BG_COLOR="#00ccff";
		
		cnv.addEventListener("pointerdown",(e)=>{
			this.touch.sx=e.x;
		});
		
		cnv.addEventListener("pointermove",(e)=>{
			let width=this.dmsns.w;
			let x=this.dmsns.x;
			this.touch.ex=e.x;
			let diff=this.touch.ex-this.touch.sx;
			
			if(x+diff >= 0 && x+diff+width <= cnv.width)
				this.dmsns.x+=diff;
			
			this.touch.sx=e.x;
		});
	},
	move:function(x,ctx){
		this.dmsns.x=x-this.dmsns.w/2;
	},
	render: function (ctx,change){
		Draw.drawRect(ctx, this.dmsns,this.BG_COLOR);
		BALL_ELEM.collides(this.dmsns);
	}
};


export const Game={
	SCREEN_WIDTH:null,
	SCREEN_HEIGHT:null,
	CTX:null,
	CANVAS:null,
	LAST_RENDERED_TIME:null,
	
	set SCORE(val){
		SCORE_ELEM.SCORE_VAL=val;
	},
	get SCORE(){
		return SCORE_ELEM.SCORE_VAL;
	},
	start:function(canvas){
		
		this.SCREEN_WIDTH=canvas.width;
		this.SCREEN_HEIGHT=canvas.height;
		this.CTX=canvas.getContext("2d");
		this.SCORE=0;
		this.CANVAS=canvas;
		
		PLATFORM_ELEM.init(canvas);
		LIFE_ELEM.init(canvas);
		SCORE_ELEM.init(canvas);
		BALL_ELEM.init(canvas,PLATFORM_ELEM.dmsns);
		Bricks.init(canvas,BALL_ELEM,this);
		
		GAME_STATE=this.render.bind(Game);
		
		requestAnimationFrame(GAME_STATE);
	},
	render: function (curr_time){
		
		let change=curr_time - this.LAST_RENDERED_TIME;
		
		this.CTX.clearRect(0,0,this.SCREEN_WIDTH,this.SCREEN_HEIGHT);
		
		
		BALL_ELEM.render(this.CTX,change);
		PLATFORM_ELEM.render(this.CTX,change);
		Bricks.render(this.CTX,change);
		SCORE_ELEM.render(this.CTX,change);
		LIFE_ELEM.render(this.CTX,change);
		
		
		this.LAST_RENDERED_TIME=curr_time;
		requestAnimationFrame(GAME_STATE);
	},
	over: function(){
		this.CTX.clearRect(0,0,this.SCREEN_WIDTH,this.SCREEN_HEIGHT);
		Draw.drawTextRect(this.CTX,{x:10,y:10},"#f0f0f0","#000",25,"Game over!");
		Draw.drawTextRect(this.CTX,{x:10,y:50},"#fff","#000",25,"Score: "+this.SCORE);
	}
};

export let GAME_STATE=Game.start.bind(Game);