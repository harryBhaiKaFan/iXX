#ifndef Flappy_Bird_Vars
#define Flappy_Bird_Vars

typedef struct Bird
{
	SDL_Rect *pos;
	char *birdPath1;
	char *birdPath2;
} BIRD;

int obsSpeed = 10;
int score = 0;
/***Type decs end****/
BIRD usr = {NULL, NULL};

/**Bird end**/
SDL_Rect SCREEN, Obs1, Obs2;

/***Obs and Background end***/

char *obsCOLOR = NULL;
char *backgroundPath = NULL;
#define BIRD_PATH1 usr.birdPath1
#define BIRD_PATH2 usr.birdPath2

/***Path end***/
TTF_Font *font;

#define BIRD_POS usr.pos
#endif