#ifndef Flappy_Bird_Funcs
#define Flappy_Bird_Funcs
int createSound_FBF(const char *);

/**-----***/
int randInt_FBF(int min, int max)
{
	srand(time(NULL));
	return ((rand() % max) + min);
}
/***OutOfGame funs end***/

void updateScreen_FBF(SDL_Renderer *ren)
{
	SDL_RenderGetViewport(ren, &SCREEN);
}
/***######*/

void initObs(int h1, int h2)
{
	int Obsw = (25 * SCREEN.w) / 100;

	Obs1.x = SCREEN.w;
	Obs1.y = 0;
	Obs1.w = Obsw;
	Obs1.h = h1;

	Obs2.x = SCREEN.w;
	Obs2.y = h1 + (BIRD_POS->h) + (12 * SCREEN.h) / 100;
	Obs2.w = Obsw;
	Obs2.h = h2;
}

/***"""""""***/
void updateObs(void)
{
	if (((Obs1.x + Obs1.w) > 0) && ((Obs2.x + Obs2.w) > 0))
	{
		Obs1.x -= (obsSpeed + score / 2);
		Obs2.x -= (obsSpeed + score / 2);
	}
	else
	{
		srand(time(NULL));
		int h1 = rand() % (((80 * SCREEN.h) / 100));
		int h2 = SCREEN.h - (h1 + (BIRD_POS->h) + (12 * SCREEN.h) / 100);
		initObs(h1, h2);
		score++;
	}
}

void updateBirdPos_FBF(int x, int y)
{
	BIRD_POS->w = (10 * SCREEN.w) / 100;
	BIRD_POS->h = (8 * SCREEN.h) / 100;
	BIRD_POS->x = x - BIRD_POS->w;
	BIRD_POS->y = y - BIRD_POS->h;
}

/*****#######**/

void renderText(SDL_Renderer *renderer, SDL_Rect *in, const char *text)
{
	SDL_Color color = {255, 255, 255};
	SDL_Surface *surface = TTF_RenderText_Solid(font, text, color);

	SDL_Texture *texture = SDL_CreateTextureFromSurface(renderer, surface);
	SDL_QueryTexture(texture, NULL, NULL, &in->w, &in->h);

	in->x = in->x - in->w / 2;
	in->y = in->y - in->h / 2;

	SDL_RenderCopy(renderer, texture, NULL, in);
	SDL_FreeSurface(surface);
	SDL_DestroyTexture(texture);
}

/**####*######**/
void updateScore_FBF(SDL_Renderer *ren, int score)
{
	static int Pscore = 0;

	if (Pscore != score)
	{
		Pscore = score;
		createSound_FBF("Game_Files/Audios/point.mp3");
	}
	SDL_Rect rect = {
		.x = SCREEN.w / 2,
		.y = SCREEN.h / 7};

	char *str = (char *)malloc(sizeof(char) * 10);
	int i = 0;
	while (score)
	{
		str[i] = score % 10 + '0';
		score /= 10;
		i++;
	}
	str[i] = '\0';
	if (i == 0)
	{
		str[0] = '0';
		str[1] = '\0';
	}
	for (int j = 0; j < (i / 2); j++)
	{
		char temp = str[j];
		str[j] = str[i - (j + 1)];
		str[i - (j + 1)] = temp;
	}

	renderText(ren, &rect, str);
	free(str);
}
// ############

void initVars_FBF(SDL_Renderer *ren)
{
	extern char *backgroundPath;

	backgroundPath = (char *)malloc(sizeof(char) * 90);

	BIRD_PATH1 = (char *)malloc(sizeof(char) * 90);
	BIRD_PATH2 = (char *)malloc(sizeof(char) * 90);

	BIRD_POS = (SDL_Rect *)malloc(sizeof(SDL_Rect));

	obsCOLOR = (char *)malloc(sizeof(char) * 90);

	strcpy(backgroundPath, "./Game_Files/Imgs/BackgroundImgs/Background_1.jpg");

	strcpy(BIRD_PATH1, "./Game_Files/Imgs/BirdPics/BirdState1.jpg");

	strcpy(BIRD_PATH2, "./Game_Files/Imgs/BirdPics/BirdState2.jpg");

	strcpy(obsCOLOR, "./Game_Files/Imgs/ObsColor/Obs_color_brown.jpg");

	updateScreen_FBF(ren);
	updateBirdPos_FBF((50 * SCREEN.w) / 100, (20 * SCREEN.h) / 100);

	srand(time(0));
	int h1 = rand() % (SCREEN.h - ((60 * SCREEN.h) / 100));
	int h2 = SCREEN.h - (h1 + (BIRD_POS->h) + 8 * SCREEN.h / 100);
	initObs(h1, h2);
}

// #########

void freeAllGlobal_FBF(void)
{
	extern char *backgroundPath;

	free(backgroundPath);
	free(BIRD_PATH1);
	free(BIRD_PATH2);
}

int isInObs(SDL_Rect Obs, SDL_Rect *Bird)
{
	if (((Bird->x + Bird->w >= Obs.x + 10 && Bird->x + Bird->w <= Obs.w + Obs.x - 10) || (Bird->x >= Obs.x + 10 && Bird->x <= Obs.w + Obs.x - 10)) &&
		((Bird->y + Bird->h >= Obs.y + 10 && Bird->y + Bird->h <= Obs.h + Obs.y - 10) || (Bird->y >= Obs.y + 10 && Bird->y <= Obs.h + Obs.y - 10)))
	{
		return (1);
	}

	return (0);
}

/***Inits and delete end****/

SDL_Texture *createImage_FBF(SDL_Renderer *ren, char *path)
{
	SDL_Surface *img = IMG_Load(path);

	if (img == NULL)
	{
		printf("%s", IMG_GetError());
		exit(EXIT_FAILURE);
	}

	SDL_Texture *texture = SDL_CreateTextureFromSurface(ren, img);
	SDL_FreeSurface(img);

	return texture;
}

// #########

int createSound_FBF(const char *sng)
{
	Mix_Music *music = Mix_LoadMUS(sng);
	if (music == NULL)
	{
		printf("%s", Mix_GetError());
		return (1);
	}
	Mix_PlayMusic(music, 1);
	return (0);
}

/***Img and sound funs end***/
void gameOver_FBF(SDL_Renderer *ren)
{
	createSound_FBF("Game_Files/Audios/crashed.mp3");
	SDL_Delay(500);
	createSound_FBF("Game_Files/Audios/lost.mp3");
	SDL_Texture *birdIMG2 = createImage_FBF(ren, BIRD_PATH2);

	SDL_Delay(200);
	while (BIRD_POS->y + BIRD_POS->h <= SCREEN.h)
	{
		SDL_RenderClear(ren);
		SDL_RenderCopy(ren, birdIMG2, NULL, BIRD_POS);
		SDL_Delay(10);
		SDL_RenderPresent(ren);
		BIRD_POS->y += 10;
	}
}
/****End game end***/

int handleBird_FBF(SDL_Renderer *ren, SDL_Rect *pos, int8_t isClicked, SDL_Texture *birdIMG1, SDL_Texture *birdIMG2)
{
	static int force = 6;
	if (isClicked)
	{
		pos->y -= (force + 15);
		force = 6;
		createSound_FBF("Game_Files/Audios/wing.mp3");
		//Bird state 2;
		SDL_RenderCopy(ren, birdIMG2, NULL, BIRD_POS);
		if (pos->y + 10 <= 0)
		{
			return 1;
		}
	}
	else
	{
		pos->y = pos->y + force;
		force++;
		//Bird state 1;
		SDL_RenderCopy(ren, birdIMG1, NULL, BIRD_POS);
		if (pos->y + pos->h - 10 >= SCREEN.h)
		{
			return 1;
		}
	}

	return (0);
}

// ##########

/***Main Game funs end***/
#endif