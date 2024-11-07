#ifndef basicFuncs_BRK
#define basicFuncs_BRK
#include <string.h>
#include "headerFiles/btnFuncs.h"

void iTos(unsigned int num,char *str){
	int i=0;
	
	while(num){
		str[i]=num%10+'0';
		i++;
		num/=10;
	}
	str[i]='\0';
	
	for(int k=0;k<i/2;k++){
		char ch = str[k];
		str[k]=str[i-(k+1)];
		str[i-(k+1)]=ch;
	}
	
}

int randInt(int min,int max){
	srand(time(NULL));
	
	return((rand()%(max-min))+min);
}

//common stuff above !!!DO NOT FOCUS!!! 
//Go below >>>>

//Obs thread functions goes here

int obs_deleteFrontObs(CAR **obsArr,int len){
	int newLen=len-1;
	
	CAR *newArr=(CAR*)calloc(sizeof(CAR),newLen);
	int o=0;
	
	for(int i=1;i<len;i++,o++){
		(newArr+o)->carRect=(*(obsArr)+i)->carRect;
		(newArr+o)->carColor=(*(obsArr)+i)->carColor;
	}
	free(*(obsArr));
	
	*(obsArr)=newArr;
	
	return(newLen);
}
//#####

int8_t obs_isCollided(CAR *obs){
	extern CAR* myCar;
	
	if((((obs->carRect.x <= myCar->carRect.x)
	 &&(obs->carRect.x+obs->carRect.w >= myCar->carRect.x)) ||
	 ((obs->carRect.x <= myCar->carRect.x+myCar->carRect.w)
	 &&(obs->carRect.x+obs->carRect.w >= myCar->carRect.x+myCar->carRect.w)))
	 &&
	 (((obs->carRect.y <= myCar->carRect.y)
	 &&(obs->carRect.y+obs->carRect.h >= myCar->carRect.y)) ||
	 ((obs->carRect.y <= myCar->carRect.y+myCar->carRect.h)
	 &&(obs->carRect.y+obs->carRect.h >= myCar->carRect.y+myCar->carRect.h)))
	 
	){
		return(1);
	}
	
	return(0);
}
//#####

void obs_initObs(CAR *obs){
			obs->carRect=(SDL_Rect){
				.x=randInt((SCREEN.w*28/100)+10,(SCREEN.w*78/100)-(SCREEN.w*7/100)-10),
				.y=-(SCREEN.h*5/100),
				.w=SCREEN.w*7/100,
				.h=SCREEN.h*5/100
			};
			obs->carColor=(SDL_Color){.r=220,.g=70,.b=70,.a=255};
		
}
//#####

int obs_Thrd(void *arg){
	int *isExit=(int*)arg;
	extern CAR *obsCarsPtr;
	int collided = 0;
	double obsAccle=2;
	extern int obsArrLen;
	extern unsigned int obsEnded;
	extern CAR* myCar;
	
	obsCarsPtr = (CAR*)calloc(sizeof(CAR),1);
	obsArrLen++;
	
	obs_initObs(obsCarsPtr+(obsArrLen-1));
	
	while(!collided){
		if(*isExit == 1){
			break;
		}
		
		//position updating loop
		for(int i=0;i<obsArrLen; ++i){
			(obsCarsPtr+i)->carRect.y+=(int)obsAccle;
		}
		
		//collision checking loop
		for(int i=0;i<obsArrLen; ++i){
			if(obs_isCollided(obsCarsPtr+i)){
				collided=1;
			}
		}
		
		//Initing new obs
		if((obsCarsPtr+obsArrLen-1)->carRect.y > SCREEN.h*5/100+80){
			CAR* temp=obsCarsPtr;
			
			obsCarsPtr=(CAR*)calloc(sizeof(CAR),obsArrLen+1);
			
			for(int i=0;i<obsArrLen;i++){
				(obsCarsPtr+i)->carRect=(temp+i)->carRect;
				(obsCarsPtr+i)->carColor=(temp+i)->carColor;
			}
			
			obs_initObs(obsCarsPtr+obsArrLen);
			obsArrLen++;
			
			free(temp);
			//obsAccle+=0.2;
		}
		
		
		//Deleting old obs
		if((obsCarsPtr)->carRect.y >= SCREEN.h){
			obsArrLen=obs_deleteFrontObs(&obsCarsPtr,obsArrLen);
			obsEnded++;
			obsAccle+=0.1;
			if(isSound)			SDL_CreateThread(playSound,"sound",scoreMus);
		}
		
		SDL_Delay(17);
		
	}
	
	//EOF of everything
	free(obsCarsPtr);
	obsArrLen=0;
	*isExit=2;
	return(0);
}


//######## rendering menu here
void renderHome_BRK(SDL_Renderer *ren, uint16_t is) 
{
	static uint16_t isPrev = 0;
	static BUTTON *playBtn = NULL,
	*highScoreBtn = NULL,
	*soundBtn = NULL;
	static char buf[100] = "Highscore : ";

	if(isPrev != is) {
		
		isPrev = is;
		if(isPrev) {
			//CreateThreads and OBJS

			strcpy(buf, "MaxScore : ");
			FILE* fptr = fopen("gameFiles/score.txt", "r");
			fgets(&buf[strlen(buf)], 100, fptr);
			//score getting done

			playBtn = createButton_BRK("Play", 65, &playFunc, SCREEN.w/3, SCREEN.h/2.5);

			highScoreBtn = createButton_BRK(buf, 50, NULL,10,10);

			soundBtn = createButton_BRK("Sound", 65, soundFunc, SCREEN.w/3, SCREEN.h/2.5+SCREEN.h*15/100);
			//button creation done

			if(isSound) //isSound enabled ?
			soundBtn->btnColor.r = 255;
		}else {
			//Destroying OBJS
			playBtn = destroyButton_BRK(playBtn);

			highScoreBtn = destroyButton_BRK(highScoreBtn);

			soundBtn = destroyButton_BRK(soundBtn);
		}
	}

	//Rendering with this if statement
	if(is) {
		renderBtn(ren, playBtn);
		renderBtn(ren, highScoreBtn);
		renderBtn(ren, soundBtn);
	}
}


//######### rendering game here
void renderGame_BRK(SDL_Renderer *ren, uint16_t is) 
{
	//stuff objs
	static uint16_t isPrev = 0;
	static BUTTON *backBtn = NULL,*leftMov = NULL,*rightMov=NULL,*scoreBtn = NULL;
	static SDL_Thread *obsThread=NULL;
	static int isExit=0;
	extern int obsArrLen;
	static char* scoreStr=NULL;
	
	//game Objs
	static ROAD* rideRoad=NULL;
	extern CAR *myCar;
	extern unsigned int obsEnded;
	extern int currentRendering;
	
	if(isPrev != is) {
		
		isPrev = is;
		if(isPrev) {
			//CreateButtons
			
			backBtn = createButton_BRK("X", 90, &backFunc, 10, 10);
			
			leftMov = createButton_BRK("<",85,leftMovFunc,SCREEN.w-(SCREEN.w*90/100),SCREEN.h-(SCREEN.h*15/100));
			leftMov->strict='f';
			
			rightMov = createButton_BRK(">",85,rightMovFunc,SCREEN.w-(SCREEN.w*15/100),SCREEN.h-(SCREEN.h*15/100));
			rightMov->strict='f';
			
			scoreBtn = createButton_BRK("0",45,NULL,(SCREEN.w*80/100),0);
			
			//creating gameComps
			rideRoad = createRoad_BRK((SDL_Rect){
				.x=SCREEN.w*28/100,
				.y=0,
				.w=SCREEN.w*50/100,
				.h=SCREEN.h
			});
			
			myCar = createCar_BRK((SDL_Rect){
				.x=SCREEN.w*50/100,
				.y=SCREEN.h*50/100,
				.w=SCREEN.w*7/100,
				.h=SCREEN.h*5/100
			},'m');
		
			//Threads and other stuff
			isExit=0;
				obsThread=SDL_CreateThread(obs_Thrd,"obsMainThread",&isExit);
			
			scoreStr=(char*)malloc(sizeof(char)*15);
			scoreStr[0]='0';
			scoreStr[1]='\0';
			
			scoreBtn->txt=scoreStr;
			
		}else {
			//Destroying Buttons
			backBtn = destroyButton_BRK(backBtn);
			rightMov = destroyButton_BRK(rightMov);
			leftMov = destroyButton_BRK(leftMov);
			scoreBtn = destroyButton_BRK(scoreBtn);
			
			//Destroying game comps
			myCar = destroyCar_BRK(myCar);
			rideRoad = destroyRoad_BRK(rideRoad);
			if(isExit != 2){
				isExit = 1;
			}
			SDL_DetachThread(obsThread);
			while(isExit != 2);
			
			obsThread = NULL;
			
			FILE *scoreP=fopen("gameFiles/score.txt","r");
			fgets(scoreStr,14,scoreP);
			int prevScore = atoi(scoreStr);
			
			if(obsEnded > prevScore){
				fclose(scoreP);
				scoreP=fopen("gameFiles/score.txt","w");
				iTos(obsEnded,scoreStr);
				fputs(scoreStr,scoreP);
			}
			fclose(scoreP);
			
			obsEnded = 0;
			free(scoreStr);
			
		}
	}

	//Rendering with this if statement
	if(is) {
		//rendering btns
		renderBtn(ren, backBtn);
		renderBtn(ren, rightMov);
		renderBtn(ren, leftMov);
		iTos(obsEnded, scoreStr);
			if(scoreStr[0]=='\0')
			{
				scoreStr[0]='0';
				scoreStr[1]='\0';
			}
		renderBtn(ren, scoreBtn);
		
		//rendering game comps
		renderRoad(ren, rideRoad);
		renderCar(ren, myCar);
		for(int i=0;i<obsArrLen;i++){
			renderCar(ren,obsCarsPtr+i);
		}
		
		//handle obs and mycar crash here
		if(isExit == 2){
			if(isSound)			SDL_CreateThread(playSound,"sound",gameOverMus);
			SDL_Delay(1000);
			currentRendering=HOME;
		}
	}
}

//######
#endif