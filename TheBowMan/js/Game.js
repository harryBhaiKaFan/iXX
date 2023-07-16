import { BowManLife,BowManScore,Bow,BowMan,Birds } from './Characters.js';
import { Background  } from './Background.js';
import { Draw } from './Draw.js'; 
import { OverScreen } from './GameOver.js';
import { Sound } from './Utils.js';

let GAME_STATE = null;
const REN_DELAY = 16.666;


export const Game = {
	cnvs:null,
	ctx:null,
	lstDrawMs: null,
	isBowManDead: false,
	init: function(screen){
		this.cnvs = screen;
		this.ctx = screen.getContext("2d");
		this.cnvs.width=parseInt(getComputedStyle(this.cnvs).width);
		this.cnvs.height=parseInt(getComputedStyle(this.cnvs).height);

		Draw.init(this.ctx);

		BowManScore.init(screen);
		BowManLife.init(screen);

		BowMan.init(screen);
		Bow.init(screen);
		Birds.init(screen);

		Background.init(screen);

		OverScreen.init(BowManScore,screen);

		GAME_STATE=this.render.bind(this);
		requestAnimationFrame(GAME_STATE);
	},
	render: function (ms){
		if(this.lstDrawMs != null && ms - this.lstDrawMs < REN_DELAY)
		{
			requestAnimationFrame(GAME_STATE);
			return;
		}

		let delta = ms - this.lstDrawMs;
		this.ctx.clearRect(0,0,this.cnvs.width,this.cnvs.height);

		Bow.render(delta);
		Background.render(delta);

		Birds.render(delta);
		BowMan.render();
		


		BowManLife.render();
		BowManScore.render();

		this.isBowManDead = Birds.render(delta);
		if(this.isBowManDead)
		{
			OverScreen.update(BowManScore,this.cnvs);
			Sound.play_dead();
			setTimeout(()=>{
				GAME_STATE = this.over.bind(this);
				requestAnimationFrame(GAME_STATE);
			},1500);

			return;
		}

		this.lstDrawMs=ms;
		requestAnimationFrame(GAME_STATE);
	},
	over: function (ms){

		requestAnimationFrame(GAME_STATE);
		if(this.lstDrawMs != null && ms - this.lstDrawMs < REN_DELAY) return;
		this.ctx.clearRect(0,0,this.cnvs.width,this.cnvs.height);

		OverScreen.render();

		this.lstDrawMs=ms;
	}
};


