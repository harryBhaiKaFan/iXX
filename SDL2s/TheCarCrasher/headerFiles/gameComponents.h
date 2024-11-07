#ifndef gameCmp_BRK
#define gameCmp_BRK

CAR* createCar_BRK(SDL_Rect carR,char carType){
	CAR *car=(CAR*)malloc(sizeof(CAR));
	car->carRect=carR;
	
	if(carType == 'm'){
		car->carColor=(SDL_Color){.r=50,.g=200,.b=50,.a=255};
	}else{
		car->carColor=(SDL_Color){.r=50,.g=50,.b=50,.a=255};
	}
	
	return(car);
}
//####

ROAD* createRoad_BRK(SDL_Rect roadRect){
	ROAD *road=(ROAD*)malloc(sizeof(ROAD));
	road->roadRect=roadRect;
	road->roadColor=(SDL_Color){
		.r=95,.g=95,.b=95,.a=255
	};
	return(road);
}
//####

void* destroyCar_BRK(CAR* car){
	free(car);
	return(NULL);
}
//####

void* destroyRoad_BRK(ROAD* road){
	free(road);
	return(NULL);
}

//####
void renderRoad(SDL_Renderer* ren,ROAD* road){
	SDL_SetRenderDrawColor(ren,road->roadColor.r,road->roadColor.g,road->roadColor.b,road->roadColor.a);
	SDL_RenderFillRect(ren,&road->roadRect);
}

//####
void renderCar(SDL_Renderer* ren,CAR *car){
	SDL_SetRenderDrawColor(ren,car->carColor.r,car->carColor.g,car->carColor.b,car->carColor.a);
	SDL_RenderFillRect(ren,&car->carRect);
	
	SDL_SetRenderDrawColor(ren,0,0,0,255);
	SDL_Rect w={
		.x=car->carRect.x-10,
		.y=car->carRect.y+10,
		.w=10,.h=15
	};//top left
	SDL_RenderFillRect(ren,&w);
	
	w=(SDL_Rect){
		.x=car->carRect.w+car->carRect.x,
		.y=car->carRect.y+10,
		.w=10,.h=15
	};//top right
	SDL_RenderFillRect(ren,&w);
	
  w=(SDL_Rect){
		.x=car->carRect.x-10,
		.y=car->carRect.h+car->carRect.y-20,
		.w=10,.h=15
	};//bottom left
	SDL_RenderFillRect(ren,&w);
	
	 w=(SDL_Rect){
		.x=car->carRect.x+car->carRect.w,
		.y=car->carRect.y-20+car->carRect.h,
		.w=10,.h=15
	};//bottom right
	SDL_RenderFillRect(ren,&w);
	
}


#endif