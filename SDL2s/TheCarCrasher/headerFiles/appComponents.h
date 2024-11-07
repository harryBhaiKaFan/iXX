#ifndef appCmp_BRK
#define appCmp_BRK

#include <unistd.h>

SDL_Texture *renderText_BRK(SDL_Renderer *ren, const char *txt, SDL_Rect *pos, SDL_Color color, TTF_Font *font)
{
	SDL_Surface *surface = TTF_RenderText_Solid(font, txt, color);

	SDL_Texture *texture = SDL_CreateTextureFromSurface(ren, surface);

	SDL_QueryTexture(texture, NULL, NULL, &pos->w, &pos->h);

	SDL_FreeSurface(surface);

	return (texture);
}
//#######

//Basic rendering end here

SDL_mutex *mutex=NULL;
int btnLoop(void *btnPtr)
{
	extern double accleLeft, accleRight;
	BUTTON *b = (BUTTON *)btnPtr;
	SDL_Thread *fnPtr = b->click;
	
	while (1)
	{
		
		usleep(4);
		
		
		if ((b->btnRect.x <= mx && b->btnRect.w + b->btnRect.x >= mx && b->btnRect.y <= my && b->btnRect.h + b->btnRect.y >= my) && (click))
		{
			b->btnColor.g = 255;
			
			if (b->strict != 'f')
			{
				while (click)
				{}
					if(isSound)
					{
						SDL_Thread *th=SDL_CreateThread(playSound,"music",clickMus);
						SDL_DetachThread(th);
					}
			}
			if (b->fn != NULL)
			{
				b->fn(btnPtr);
				if (b->strict == 'f')
				{
					SDL_Delay(10);
				}
			}
		}
		else
		{
			b->btnColor.g = 200;
			if (b->strict == 'f' && strcmp("<", b->txt) == 0)
			{
				accleLeft = 1;
			}
			else if (b->strict == 'f' && strcmp(">", b->txt) == 0)
			{
				accleRight = 1;
			}
		}
		
		fnPtr = b->click;
		if (fnPtr == NULL)
		{
			b->fn = NULL;
			break;
		}
		
		
	}
	

	while (b->font != NULL)
		;
	free(b);
	
	return (0);
}

//Btn loop end here
//#####

BUTTON *createButton_BRK(const char *txt, uint32_t txtSize, void (*fn)(void *), int x, int y)
{
	BUTTON *nBtn = (BUTTON *)malloc(sizeof(BUTTON));

	TTF_Font *font = TTF_OpenFont("./gameFiles/fonts/DroidSansMono.ttf", txtSize);
	nBtn->txt = txt;
	nBtn->font = font;
	nBtn->btnColor.r = 0;
	nBtn->btnColor.g = 200;
	nBtn->btnColor.b = 170;
	nBtn->btnColor.a = 255;

	nBtn->txtColor.r = 0;
	nBtn->txtColor.g = 0;
	nBtn->txtColor.b = 0;
	nBtn->txtColor.a = 255;

	nBtn->txtRect.x = x;
	nBtn->txtRect.y = y;

	nBtn->fn = fn;
	nBtn->strict = 't';
	nBtn->click = SDL_CreateThread(btnLoop, "click", (void *)nBtn);

	return (nBtn);
}
//#####

void *destroyButton_BRK(BUTTON *btn)
{
	SDL_DetachThread(btn->click);
	btn->click = NULL;
	TTF_CloseFont(btn->font);
	while (btn->fn != NULL)
		;
	
	btn->font = NULL;
	return (NULL);
}
//#####

void renderBtn(SDL_Renderer *ren, BUTTON *btn)
{
	SDL_Texture *tex = renderText_BRK(ren, btn->txt, &btn->txtRect, btn->txtColor, btn->font);

	SDL_SetRenderDrawColor(ren, btn->btnColor.r, btn->btnColor.g, btn->btnColor.b, btn->btnColor.a);

	btn->btnRect.x = btn->txtRect.x - 10;
	btn->btnRect.y = btn->txtRect.y - 10;
	btn->btnRect.w = btn->txtRect.w + 20;
	btn->btnRect.h = btn->txtRect.h + 20;

	SDL_RenderFillRect(ren, &btn->btnRect);
	SDL_RenderCopy(ren, tex, NULL, &btn->txtRect);
	SDL_DestroyTexture(tex);
}
//#####
//### Btns end here

#endif
