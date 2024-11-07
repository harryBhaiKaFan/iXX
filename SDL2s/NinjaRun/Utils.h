#ifndef NIN_UTILS
#define NIN_UTILS

#include <math.h>
#include <stdlib.h>
#include <time.h>

// basic utility functions

int isInRect(SDL_Rect rect1, SDL_Rect rect2)
{
	if (rect1.x < rect2.x + rect2.w && rect1.y < rect2.y + rect2.h && rect1.x + rect1.w > rect2.x && rect1.y + rect1.h > rect2.y)
	{
		return (1);
	}

	return (0);
}

int randIntFrom0(int max)
{
	srand(time(NULL) + rand());
	return (rand() % max);
}

#endif