#include <stdlib.h>
#include <stdint.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_image.h>
#include <SDL2/SDL_ttf.h>
#include <SDL2/SDL_mixer.h>
#include "./vars.h"
#include "./funcs.h"

int main(int ac, char *av[])
{
	extern int score;
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0)
	{
		printf("%s", SDL_GetError());
		return (EXIT_FAILURE);
	}
	if (TTF_Init() == -1)
		return (-1);

	extern TTF_Font *font;
	font = TTF_OpenFont("/system/fonts/Roboto-Bold.ttf", 67);

	Mix_Init(MIX_INIT_FLAC | MIX_INIT_MOD);

	Mix_OpenAudio(44100, MIX_DEFAULT_FORMAT, 2, 4096);
	SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY, "2");
	SDL_Event e;
	SDL_Window *win = SDL_CreateWindow("title", SDL_WINDOWPOS_UNDEFINED, SDL_WINDOWPOS_UNDEFINED, 720, 1280, SDL_WINDOW_FULLSCREEN);
	SDL_Renderer *ren = SDL_CreateRenderer(win, 0, SDL_RENDERER_TARGETTEXTURE);
	/***Renderer ends here***/
	initVars_FBF(ren);
	int8_t click = 0;
	/**Var Inits***/

	SDL_Texture *backgroundIMG = createImage_FBF(ren, backgroundPath);

	SDL_Texture *obsIMG = createImage_FBF(ren, obsCOLOR);

	SDL_Texture *birdIMG1 = createImage_FBF(ren, BIRD_PATH1);

	SDL_Texture *birdIMG2 = createImage_FBF(ren, BIRD_PATH2);
	/**Choose BirdColor and Background**/

	while (1)
	{
		SDL_PollEvent(&e);
		if (e.type == SDL_QUIT)
		{
			break;
		}

		SDL_SetRenderDrawColor(ren, 0, 0, 0, 0);
		updateObs();
		updateScreen_FBF(ren);
		SDL_RenderClear(ren);

		click = SDL_GetMouseState(NULL, NULL);

		//BACKGROUND IMG Down
		SDL_RenderCopy(ren, backgroundIMG, NULL, &SCREEN);
		//onClick screen
		int quit = handleBird_FBF(ren, BIRD_POS, click, birdIMG1, birdIMG2);
		//OBSs IMG Down
		SDL_RenderCopy(ren, obsIMG, NULL, &Obs1);
		SDL_RenderCopy(ren, obsIMG, NULL, &Obs2);
		updateScore_FBF(ren, score);

		if (isInObs(Obs1, BIRD_POS) || isInObs(Obs2, BIRD_POS) || quit)
		{
			SDL_Delay(400);
			gameOver_FBF(ren);
			break;
		}

		//RENDERING GRAPHICS
		SDL_RenderPresent(ren);
		SDL_Delay(60);
	}

	// ########

	freeAllGlobal_FBF();
	SDL_DestroyRenderer(ren);
	SDL_DestroyWindow(win);
	SDL_Quit();
	return (EXIT_SUCCESS);
}