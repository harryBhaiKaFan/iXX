#ifndef NIN_GLOBAL
#define NIN_GLOBAL

#include <SDL2/SDL.h>
#include <SDL2/SDL_render.h>
#include <math.h>
#include <time.h>
#include "Utils.h"
#include "TextView.h"

#define LEFT 'L'
#define RIGHT 'R'

#define WALL_WIDTH SCREEN.w * 20 / 100
#define WALL_HEIGHT SCREEN.h

#define NINJA_IMG_W_RATIO 5
#define NINJA_IMG_H_RATIO 8

#define OBS_IMG_W_RATIO 5
#define OBS_IMG_H_RATIO 5

#define NINJA_IMG_SIZE_CONST 18
#define OBS_IMG_SIZE_CONST 12

SDL_Texture *NinjaLeft = NULL;
SDL_Texture *NinjaRight = NULL;
SDL_Texture *CactusLeft = NULL;
SDL_Texture *CactusRight = NULL;
SDL_Texture *BombPNG = NULL;
//Textures

SDL_Rect SCREEN = {.x = 0, .y = 0, .w = 0, .h = 0};

//SCREEN

long double NINJA_FALL = 0.025;
long double OBS_FALL = 2.5;
unsigned int score = 0;
unsigned long int last_time_cacti = 0;
unsigned long int last_time_bombs = 0;

void INIT_GLOBAL(SDL_Renderer *ren)
{
	SDL_Surface *imgNL = IMG_Load("./NinjaLeft.png");
	SDL_Surface *imgNR = IMG_Load("./NinjaRight.png");
	SDL_Surface *imgBL = IMG_Load("./CactusLeft.png");
	SDL_Surface *imgBR = IMG_Load("./CactusRight.png");
	SDL_Surface *bomb = IMG_Load("./Asteroid.png");

	NinjaLeft = SDL_CreateTextureFromSurface(ren, imgNL);
	NinjaRight = SDL_CreateTextureFromSurface(ren, imgNR);
	CactusLeft = SDL_CreateTextureFromSurface(ren, imgBL);
	CactusRight = SDL_CreateTextureFromSurface(ren, imgBR);

	BombPNG = SDL_CreateTextureFromSurface(ren, bomb);

	SDL_FreeSurface(imgNL);
	SDL_FreeSurface(imgNR);
	SDL_FreeSurface(imgBL);
	SDL_FreeSurface(imgBR);
	SDL_FreeSurface(bomb);
}
//GLOBAL INIT

struct
{
	SDL_Rect rect;
	char dir;
	SDL_Texture *curr_tx;
} Ninja = {
	.dir = 0,
	.rect.x = 0,
	.rect.y = 0,
	.rect.h = 0,
	.rect.w = 0};

// Ninja struct done here

void Nin_MoveNinja(char dir)
{
	if (Ninja.dir == dir)
		return;

	if (dir == RIGHT)
	{
		Ninja.curr_tx = NinjaRight;
		Ninja.dir = RIGHT;
		Ninja.rect.x = SCREEN.w - (WALL_WIDTH + Ninja.rect.w) + NINJA_IMG_SIZE_CONST;
	}
	else if (dir == LEFT)
	{
		Ninja.curr_tx = NinjaLeft;
		Ninja.dir = LEFT;
		Ninja.rect.x = 25 * SCREEN.w / 100 - (NINJA_IMG_SIZE_CONST + 30);
	}

	Ninja.rect.y -= (5 + NINJA_FALL) * SCREEN.h / 100;
}

void Nin_SizeNinja(int cnst)
{
	Ninja.rect.w = cnst * NINJA_IMG_W_RATIO;
	Ninja.rect.h = cnst * NINJA_IMG_H_RATIO;
	Ninja.rect.y = 50 * SCREEN.h / 100 - (Ninja.rect.h / 2);
}

void Nin_RenderNinja(SDL_Renderer *ren)
{
	SDL_RenderCopy(ren, Ninja.curr_tx, NULL, &Ninja.rect);
}

void Nin_DowngradeNinja()
{
	Ninja.rect.y += ceil(NINJA_FALL * SCREEN.h / 100);
}

// Ninja Functions done here

typedef struct
{
	SDL_Rect position;
	SDL_Texture *curr_tx;
} Bomb;

typedef struct
{
	SDL_Rect position;
	SDL_Texture *curr_tx;
	char dir; // left or right
} Cactus;

// Bomb + Cactus done here

Bomb *Nin_CreateBomb(void)
{
	Bomb *b = (Bomb *)malloc(sizeof(Bomb));

	b->position.w = OBS_IMG_SIZE_CONST * OBS_IMG_W_RATIO;
	b->position.h = OBS_IMG_SIZE_CONST * OBS_IMG_H_RATIO;
	b->position.x = randIntFrom0(SCREEN.w - b->position.w);
	b->position.y = -b->position.h;

	b->curr_tx = BombPNG;

	return (b);
}
void Nin_RenderBomb(Bomb *bomb, SDL_Renderer *ren)
{
	SDL_RenderCopy(ren, bomb->curr_tx, NULL, &bomb->position);
}

void Nin_DestroyBomb(Bomb *bomb)
{
	free(bomb);
	score++;
}

int Nin_CollideWithBomb(Bomb *bomb)
{
	if (isInRect(Ninja.rect, bomb->position))
	{
		return (1);
	}

	return (0);
}

int Nin_HandleBomb(SDL_Renderer *ren)
{
	static Bomb *bombs = NULL;
	static int bombs_len = 0;
	unsigned long int time_passed = 0;
	if (bombs_len == 0)
	{
		bombs_len++;
		bombs = Nin_CreateBomb();
		last_time_bombs = time(NULL);
	}
	time_passed = time(NULL) - last_time_bombs;

	for (int i = 0; i < bombs_len; i++)
	{
		bombs[i].position.y += OBS_FALL * (time_passed + 1);

		Nin_RenderBomb(bombs + i, ren);
		if (Nin_CollideWithBomb(bombs + i))
		{
			return 1;
		}

		if (bombs[i].position.y > SCREEN.h)
		{
			Nin_DestroyBomb(bombs + i);
			bombs_len--;
		}
	}

	return (0);
}

// Bomb Functions done here

Cactus *Nin_CreateCactus(char dir)
{
	Cactus *c = (Cactus *)malloc(sizeof(Cactus));

	c->position.w = OBS_IMG_W_RATIO * OBS_IMG_SIZE_CONST;
	c->position.h = OBS_IMG_H_RATIO * OBS_IMG_SIZE_CONST;
	c->position.y = -c->position.h;

	if (dir == LEFT)
	{
		c->position.x = WALL_WIDTH;
		c->curr_tx = CactusLeft;
	}
	else
	{
		c->position.x = SCREEN.w - (WALL_WIDTH + c->position.w);
		c->curr_tx = CactusRight;
	}

	return (c);
}

void Nin_RenderCactus(Cactus *cactus, SDL_Renderer *ren)
{
	SDL_RenderCopy(ren, cactus->curr_tx, NULL, &cactus->position);
}

void Nin_DestroyCactus(Cactus *cactus)
{
	free(cactus);
	score++;
}

int Nin_CollideWithCactus(Cactus *cactus)
{
	if (isInRect(Ninja.rect, cactus->position))
	{
		return (1);
	}

	return (0);
}

int Nin_HandleCactus(SDL_Renderer *ren)
{
	
	
	
	static Cactus **cacti = NULL;
	if (cacti == NULL)
		cacti = (Cactus **)malloc(sizeof(Cactus *) * 10);
	static int cacti_time[10];
	static int cacti_len = 0;

	if (cacti_len < 10 && time(NULL) - last_time_cacti >= 2-(OBS_FALL/10) && last_time_cacti - last_time_bombs > 2)
	{
		cacti[cacti_len] = Nin_CreateCactus(randIntFrom0(2) ? LEFT : RIGHT);
		last_time_cacti = time(NULL);
		cacti_time[cacti_len] = last_time_cacti;
		cacti_len++;
	}

	for (int i = 0; i < cacti_len; i++)
	{
		if (cacti[i] == NULL)
		{
			if (time(NULL) - last_time_cacti >= 2 - (OBS_FALL/10) && last_time_cacti - last_time_bombs > 2)
			{
				cacti[i] = Nin_CreateCactus(randIntFrom0(2) ? LEFT : RIGHT);
				last_time_cacti = time(NULL);
				cacti_time[i] = last_time_cacti;
			}
		}
		else
		{
			cacti[i]->position.y += OBS_FALL * (time(NULL) - cacti_time[i]);
			Nin_RenderCactus(cacti[i], ren);
			if (Nin_CollideWithCactus(cacti[i]))
			{
				return 1;
			}

			if (cacti[i]->position.y > SCREEN.h)
			{
				Nin_DestroyCactus(cacti[i]);
				cacti[i] = NULL;
				if (time(NULL) - last_time_cacti >= 2 - (OBS_FALL/10) && last_time_cacti - last_time_bombs > 2 )
				{
					cacti[i] = Nin_CreateCactus(randIntFrom0(2) ? LEFT : RIGHT);
					last_time_cacti = time(NULL);
					cacti_time[i] = last_time_cacti;
				}
			}
		}
	}

	return (0);
}

// Cactus Functions end here

void HANDLE_QUIT(char *score_str, SDL_Renderer *ren)
{
	SDL_Event e;
	SDL_Texture *score_view;
	SDL_Rect score_rect;

	char msg[200] = " Your Score:";

	score_rect = (SDL_Rect){
		.w = 80 * SCREEN.w / 100,
		.h = 8 * SCREEN.h / 100,
		.x = 10 * SCREEN.w / 100,
		.y = SCREEN.h / 2 - (4 * SCREEN.h / 100)};

	strcpy(msg + strlen(msg), score_str);
	strcpy(msg + strlen(msg), " ");
	score_view = Nin_MakeText(msg, ren);

	int r = randIntFrom0(200);
	int g = randIntFrom0(100);
	int b = randIntFrom0(100);
	while (1)
	{
		SDL_PollEvent(&e);

		if (e.type == SDL_QUIT)
			break;

		SDL_SetRenderDrawColor(ren, 0, 0, 0, 0);
		SDL_RenderClear(ren);

		SDL_SetRenderDrawColor(ren, r, g, b, 255);
		SDL_RenderFillRect(ren, &score_rect);

		Nin_RenderText(score_view, score_rect, ren);

		SDL_RenderPresent(ren);
	}
	return;
}
#endif