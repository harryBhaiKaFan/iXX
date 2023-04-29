import {GAME_STATE} from "./Game.js";

const SCREEN_ELEM=document.querySelector("[data-screen]");
const LOADER_ELEM=document.querySelector("[data-loader]");


const App = {
	init: function (){
		LOADER_ELEM.style.display="flex";
		SCREEN_ELEM.width = parseInt(getComputedStyle(SCREEN_ELEM).width);
		
		SCREEN_ELEM.height = parseInt(getComputedStyle(SCREEN_ELEM).height);
		
		LOADER_ELEM.addEventListener("click", function (){
			
			LOADER_ELEM.style.display="none";
			
			GAME_STATE(SCREEN_ELEM);
		});
		
	}
}

window.onload=(e)=>{
	App.init();
}