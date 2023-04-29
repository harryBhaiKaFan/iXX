import {Game} from './Game.js';
import {Sound} from './Utils.js';

const loader=document.querySelector("[data-loader]");
const gameScreen=document.querySelector("[data-game-screen]");
const togScreenBtn=document.querySelector("[data-toggle-fullscreen]");
const togSoundBtn=document.querySelector("[data-toggle-sound]");


/*
  ####   BUGS  or  INCOMPLETES   ####

  --> Bow is incomplete
  --> No GRAVITY for arrow
  --> BEST WORKED ON MOBILE PHONES ONLY
  
*/
const App={
	init:function(){
		Sound.init();

		//sound
		togSoundBtn.addEventListener("click",()=>{
			togSoundBtn.classList.toggle("active-btn");
			App.toggleSound();
		});

		//fullscreen
		togScreenBtn.addEventListener("click",()=>{
			togScreenBtn.classList.toggle("active-btn");
			App.toggleFullscreen();
		});

		//loader

		loader.addEventListener("click", ()=>{
			loader.classList.toggle("hidden");
			gameScreen.classList.toggle("hidden");
			Game.init(gameScreen);
			togSoundBtn.click();
			togScreenBtn.click();
		});
	},
	toggleFullscreen:function(){

		if(document.fullscreenElement != null)
			{
				document.exitFullscreen();
				return;
			}
			document.body.requestFullscreen();

	},
	toggleSound:function(){
		if(Sound.SOUND == false)
			Sound.SOUND = true;
		else
			Sound.SOUND = false;
	}
}



// Loading App on window load
window.onload=App.init;
