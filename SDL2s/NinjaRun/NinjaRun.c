#include <stdlib.h>
#include <stdbool.h>
#include <SDL2/SDL.h>
#include <SDL2/SDL_render.h>
#include <SDL2/SDL_ttf.h>
#include <SDL2/SDL_image.h>
#include <time.h>
#include "Global.h"
#include "TextView.h"

int main(int argc, char *argv[])
{
	if (SDL_Init(SDL_INIT_EVERYTHING) != 0)
	{
		printf("SDL_Error: %s", SDL_GetError());
		return (EXIT_FAILURE);
	}
	TTF_Init();

	//Init done here

	SDL_Window *win = SDL_CreateWindow("NinjaRun", 0, 0, 0, 0, SDL_WINDOW_FULLSCREEN);

	SDL_Renderer *ren = SDL_CreateRenderer(win, -1, 0);

	INIT_GLOBAL(ren);

	SDL_SetHint(SDL_HINT_RENDER_SCALE_QUALITY, "2");
	
	SDL_Event e;
	//Event object
	
	last_time_cacti=time(NULL);
	last_time_bombs=time(NULL);
	//last time
	
	int mx = 0, prevX = 0, click = 0;
	//Mouse position

	bool running = true;
	//game state

	int collide1 = 0, collide2 = 0;
	SDL_Rect walls[2];

	//Game objects

	SDL_Texture *score_view = NULL;
	SDL_Rect score_rect;
	extern unsigned int score;
	char score_str[10];
	//UI objects
	
	int r=80;
	int g=randIntFrom0(50);
	int b=randIntFrom0(50);
	//Colored walls
	
	SDL_RenderGetViewport(ren, &SCREEN);
	Nin_MoveNinja(LEFT);
	Nin_SizeNinja(NINJA_IMG_SIZE_CONST);
	sprintf(score_str, "%u", score);
	score_view = Nin_MakeText(score_str, ren);

	while (running) // Game loop
	{
		while (SDL_PollEvent(&e))
		{
			if (e.type == SDL_QUIT)
			{
				running = false;
			}
		}
		//Event loop end

		SDL_SetRenderDrawColor(ren, 0, 150, 200, 255);
		SDL_RenderClear(ren);
		SDL_RenderGetViewport(ren, &SCREEN);
		//Clearing screen and
		//updating {SCREEN}

		//Walls here
		walls[0].x = 0;
		walls[0].y = 0;
		walls[0].w = WALL_WIDTH;
		walls[0].h = WALL_HEIGHT;

		walls[1].x = SCREEN.w * 80 / 100;
		walls[1].y = 0;
		walls[1].w = WALL_WIDTH;
		walls[1].h = WALL_HEIGHT;

		SDL_SetRenderDrawColor(ren, r, g, b, 0);
		SDL_RenderFillRect(ren, &walls[0]);
		SDL_RenderFillRect(ren, &walls[1]);

		//Ninja stuff

		click = SDL_GetMouseState(&mx, NULL);

		if (click == 0)
			prevX = 0;

		if (click != 0)
		{
			if (prevX == 0)
			{
				prevX = mx;
			}
			else
			{
				if (mx < prevX)
				{
					Nin_MoveNinja(LEFT);
				}
				else
				{
					Nin_MoveNinja(RIGHT);
				}
			}
		}
		//Score stuff

		if (atoi(score_str) != score)
		{
			sprintf(score_str, "%u", score);
			Nin_DestroyText(score_view);
			score_view = Nin_MakeText(score_str, ren);
			NINJA_FALL += 0.001;
			OBS_FALL += 0.7;
		}

		//making score view
		score_rect = (SDL_Rect){
			.w = (10 + strlen(score_str)) * SCREEN.w / 100,
			.h = 7 * SCREEN.h / 100,
			.x = SCREEN.w / 2 - score_rect.w / 2,
			.y = 0};
		SDL_SetRenderDrawColor(ren, 200, 100, 0, 255);
		SDL_RenderFillRect(ren, &score_rect);
		Nin_RenderText(score_view, score_rect, ren);
		
		// Ninja rendering
		Nin_RenderNinja(ren);
	
		
		// collision check
		collide1 = Nin_HandleCactus(ren);
		collide2 = Nin_HandleBomb(ren);

		if (collide1 || collide2)
		{
			SDL_RenderPresent(ren);
			SDL_Delay(1500);
			HANDLE_QUIT(score_str,ren);
			break;
		}
		
		
		Nin_DowngradeNinja();
		SDL_RenderPresent(ren);
		SDL_Delay(17);
	}
	//Game loop end

	SDL_Quit();
	return (EXIT_SUCCESS);
}