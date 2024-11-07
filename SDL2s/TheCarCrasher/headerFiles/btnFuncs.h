#ifndef btnFunc_BRK
#define btnFunc_BRK


void playFunc(void *btn){
	extern int currentRendering;
	currentRendering=GAME;
}
//#####

void soundFunc(void *btnV){
	BUTTON *btn=(BUTTON*)btnV;
	if(isSound==1){
		isSound=0;
		btn->btnColor.r=0;
	}else{
		isSound=1;
		btn->btnColor.r=255;
	}
}
//#####

//Home button functions done here


void backFunc(void *btn){
	extern int currentRendering;
	currentRendering=HOME;
}
//#####

void leftMovFunc(void* btn){
	extern double accleLeft;
	
	if((myCar->carRect.x-10-accleLeft) > SCREEN.w*28/100){
		myCar->carRect.x-=accleLeft;
		accleLeft+=0.2;
	}else{
		myCar->carRect.x=(SCREEN.w*28/100)+10;
	}
}
//#####

void rightMovFunc(void* btn){
	extern double accleRight;
	
	if((myCar->carRect.x+myCar->carRect.w+10+accleRight) < (SCREEN.w*28+SCREEN.w*50)/100){
	myCar->carRect.x+=accleRight;
	accleRight+=0.2;
	}else{
		myCar->carRect.x+=((SCREEN.w*28+SCREEN.w*50)/100)-(myCar->carRect.x+myCar->carRect.w+10);
	}
	
}
//#####

//Game button functions done here
#endif