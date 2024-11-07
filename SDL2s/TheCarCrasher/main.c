#include <stdlib.h>
#include <ctype.h>
#include <time.h>
#include <limits.h>
#include <math.h>
#include <stdint.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_render.h>
#include <SDL2/SDL_ttf.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_mixer.h>
#include "headerFiles/dataTypes.h"
#include "headerFiles/appComponents.h"
#include "headerFiles/gameComponents.h"
#include "headerFiles/basicFuncs.h"
//headers done here

int main(int ac,char *av[]){
	if(SDL_Init(SDL_INIT_EVERYTHING)!=0){
		printf("%s",SDL_GetError());
		return(EXIT_FAILURE);
	}
	//Init done here
	TTF_Init();
//Text init done here

	if (Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 4096) == -1)
	{
		fprintf(stderr, "Mix_OpenAudio Error: %s\n", Mix_GetError());
		return (EXIT_FAILURE);
	}
	//Sound init done here
	
	clickMus=loadMusic("./gameFiles/sound/click.wav");
	gameOverMus=loadMusic("./gameFiles/sound/gameOver.wav");
	scoreMus=loadMusic("./gameFiles/sound/score.wav");
	
	SDL_Window *win=SDL_CreateWindow("title",400,400,720,1280,SDL_WINDOW_FULLSCREEN);
	
	SDL_Renderer *ren=SDL_CreateRenderer(win,-1,SDL_RENDERER_TARGETTEXTURE);
	SDL_Event e;
	
	SDL_SetRenderDrawBlendMode(ren,SDL_BLENDMODE_BLEND);
	
	extern int mx,my,click;
	mutex=SDL_CreateMutex();
	//Basic vars done here
	
	while(1){
		SDL_PollEvent(&e);
		if(e.type == SDL_QUIT){
			renderGame_BRK(ren,0);
			renderHome_BRK(ren,0);
			break;
		}
      SDL_RenderGetViewport(ren,&SCREEN);
      SDL_SetRenderDrawColor(ren,100,50,50,0);
	  SDL_RenderClear(ren);
	  
	  //What to render and when
		 if(currentRendering == HOME)
		 {
		 	renderGame_BRK(ren,0);
		 	renderHome_BRK(ren,1);
		 }else if(currentRendering == GAME)
		 {
		 	renderHome_BRK(ren,0);
		 	renderGame_BRK(ren,1);
		 }
		
		//mouse state
		click=SDL_GetMouseState(&mx,&my);
		//real rendering
		SDL_RenderPresent(ren);
		SDL_Delay(17);
	}
	//rendering loop done here
	
	
	//Exiting the game here
	SDL_DestroyRenderer(ren);
	SDL_DestroyWindow(win);
	TTF_Quit();
	SDL_Quit();
	return (EXIT_SUCCESS);
}
