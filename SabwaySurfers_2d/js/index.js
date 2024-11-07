//score management
let scoreElem=document.getElementById("score");
let score=0;

//jack object
let jack={
	elem: document.querySelector(".mainCharacter"),
	state:"running",
	runLoop: null,
	startRun: function (){
	//Just an animation train will move actually
if(this.runLoop != null) return;
		const legFoot=document.querySelectorAll(".foot");
		const hand=document.querySelector(".hand");
		
		this.runLoop=[];
		
		legFoot.forEach((val,i,arr)=>{
			this.runLoop.push(setInterval(()=>{
					val.style.transform="rotate(80deg)";
					hand.style.transform="rotate(-80deg)";
					val.style.left="-60%";
					val.style.top="-15%";
					
					arr[Number(!i)].style.transform="none";
					arr[Number(!i)].style.left="0";
					arr[Number(!i)].style.top="0";
					if(!i)
					hand.style.transform="rotate(80deg)";
			},250*(i+1)));
		});
	},
	stopRun: function (){
		if(this.runLoop == null) return;
		
		this.runLoop.forEach((val)=>{
				clearInterval(val);
		});
			
		this.runLoop=null;	
		
	},
	jump: function (){
	//jack will jump with animation
this.elem.style.top="-60px";
this.state="jumping";
setTimeout(()=> {
	this.elem.style.top='0';
	setTimeout(()=>{
	this.state="running";
	},360);
}, 400);
	}
};//jack (mainCharacter) object ends

//Train object
let train = {
	DOMElem:document.querySelector(".train"),
	DOMParts:document.querySelectorAll(".train-part"),
	currFront:0,
	speed:0.4,
	DOMObs:document.querySelectorAll(".train-obstacle"),
	init: function (){
		this.DOMParts.forEach((val)=>{
			val.style.left='0';
			val.style.top='0';
		});
		this.speed=1;
	},
	//making train exist

	run: function (jackElem){
			this.DOMParts.forEach((val,i,arr)=>{
			val.style.left=parseFloat(val.style.left)-this.speed+"%";
			
			if(parseFloat(val.style.left) < -100)
			{
				this.DOMParts[this.currFront].style.left='0';
				
				if(this.currFront == 0)
					this.currFront=1;
				else
					this.currFront=0;
			}
		});
		
		//Checking collision here
		let collides=false;
		let isBetween=false;
		
		let jackX=window.innerWidth/2;
		let jackY = parseInt(getComputedStyle(jackElem).top);
		let jackW=parseInt(getComputedStyle(jackElem).width);
		jackX-=(jackW/2);
		
		
		let ob1X=parseInt(getComputedStyle(this.DOMObs[0]).left);
		let ob1W=parseInt(getComputedStyle(this.DOMObs[0]).width);
		let currX=window.innerWidth+parseInt(getComputedStyle(this.DOMParts[this.currFront]).left);
		
		ob1X+=currX;
		

		
		if(
			(jackX >= ob1X && jackX <= ob1X+ob1W)
			||
			(jackX+jackW >= ob1X && jackX+jackW <= ob1X+ob1W)
			){
				isBetween=true;
			}
			
		
		if(isBetween && jackY>=0) collides=true;
		
		if(isBetween && !collides)
		{
			score++;
			this.speed+=0.0001;
		}
		
		return(collides);
	},
	//running train here

};


//Game loop here
let oldTime=null;
let renDelay=300;
let ended=false;


function gameLoop(currTime)
{
	if(oldTime == null)
	{
		oldTime = currTime;
	}else if((currTime-oldTime) >= renDelay)
	{
	//###
	ended=train.run(jack.elem);
	scoreElem.innerHTML=score;
	if(ended)
	{
		jack.stopRun();
		jack.elem.style.top="5%";
		window.ondblclick=gameLoad;
		window.onclick=null;
		window.onkeydown=null;
		alert("Game Over !");
		alert("Your Score "+score+"\n Double click to play Again |>");
		score=0;
		return;
	}
	//###
	}
	
	requestAnimationFrame(gameLoop);
	
}//gameLoop ends here


//Event handling goes here ✊👈👇
const jumpJack=(e)=>{
	//move character up here
	if(jack.state != "running") return;
	jack.stopRun();
	jack.jump();
	setTimeout(()=>jack.startRun(),180);
}

const gameLoad=(e)=>{
	//start game loop with all basic settings
	//alert("Tap on screen or press any key to jump !");
	jack.startRun();
	jack.elem.style.left="10%";
	jack.elem.style.top="0%";
	train.init();
	
	requestAnimationFrame(gameLoop);
	window.ondblclick=null;
	window.onclick=jumpJack;
	window.onkeydown=jumpJack;
}


window.onload=(e)=>{
	alert("Click ok start!");
	gameLoad();
}
