#ifndef dataTypes_BRK
#define dataTypes_BRK

Mix_Music *loadMusic(const char *path)
{
	Mix_Music *music = Mix_LoadMUS(path);
	if (music == NULL)
	{
		fprintf(stderr, "Mix_LoadMUS Error: %s\n", Mix_GetError());
		return NULL;
	}
	return music;
}

void playSound(Mix_Music* mus)
{
	Mix_PlayMusic(mus,1);
}
//Music loader end here
//######

//rendering division
#define HOME 0
#define GAME 1

//some datatypes


typedef struct Button{
	SDL_Rect btnRect;
	SDL_Rect txtRect;
	const char *txt;
	TTF_Font* font;
	void (*fn)(void*);
	SDL_Color txtColor;
	SDL_Color btnColor;
	SDL_Thread* click;
	char strict;
}BUTTON; //Button type

typedef struct Car{
	SDL_Rect carRect;
	SDL_Color carColor;
}CAR; //Car type

typedef struct Road{
	SDL_Rect roadRect;
	SDL_Color roadColor;
}ROAD; //Road type


//global vars
SDL_Rect SCREEN;
CAR* obsCarsPtr=NULL;
CAR* myCar=NULL;
int currentRendering=HOME;
int obsArrLen=0;
double accleRight=1,accleLeft=1;
int isSound=1;
unsigned int obsEnded=0;

int mx=-1,my=-1,click=-1;

Mix_Music *clickMus=NULL;
Mix_Music *gameOverMus=NULL;
Mix_Music *scoreMus=NULL;
#endif
