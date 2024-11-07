#ifndef NIN_T_VIEW
#define NIN_T_VIEW

//TextRendering functions

SDL_Texture* Nin_MakeText(const char *txt,SDL_Renderer *ren)
{
	TTF_Font *font=TTF_OpenFont("./CutiveMono.ttf",256);
	
	if (font == NULL)
	{
		fprintf(stderr, "TTF_OpenFont Error: %s\n", TTF_GetError());
		return NULL;
	}
	
	SDL_Color color={255,255,255,255};
	
	SDL_Surface *surface = TTF_RenderText_Solid(font, txt, color);
		
	SDL_Texture *texture = SDL_CreateTextureFromSurface(ren, surface);
	
	SDL_FreeSurface(surface);
	
	return(texture);
}

void Nin_RenderText(SDL_Texture *texture,SDL_Rect position,SDL_Renderer *ren)
{
	SDL_RenderCopy(ren, texture, NULL, &position);
}

void Nin_DestroyText(SDL_Texture *txt)
{
	SDL_DestroyTexture(txt);
}

#endif