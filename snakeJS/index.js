const canvaElem=document.querySelector("#gameScreen");
const ctx=canvaElem.getContext("2d");
const ctrlElem=document.querySelectorAll(".ctrl");
const scoreElem=document.querySelector(".score");
let score=0;
/***commonVars declared**/
function randInt(min,max)
{
    return (min+Math.ceil(Math.random()*(max-min)));
}

function createCtxNode(x,y,rad)
{
    this.sx=x-rad;
    this.sy=y-rad;
    this.ex=y+rad;
    this.ey=y+rad;
    this.rad=rad;
    this.cx=x;
    this.cy=y;
    
}

function objcpy(objTo,objFrom)
{
    objTo.sx=objFrom.sx;
    objTo.sy=objFrom.sy;
    objTo.ex=objFrom.ex;
    objTo.ey=objFrom.ey;
    objTo.rad=objFrom.rad;
    objTo.cx=objFrom.cx;
    objTo.cy=objFrom.cy;
    
}

/**Funs defined***/
let snake={
    snakeBody:[],
    snakeLen:4,
    snakeRad:10,
    snakeX:150,
    snakeY:90,
    snakeDirection:'right',
    init_snake:function(){
        
        for(let i=0;i<this.snakeLen;i++)
        {
            this.snakeBody.push(new createCtxNode(this.snakeX,this.snakeY,this.snakeRad));
            this.snakeX-=(2*this.snakeRad);
        }
    },
    draw_snake:function(){
        for(let i=0;i<this.snakeLen;i++)
        {
            ctx.fillStyle="#0f0";
            ctx.beginPath();
            ctx.arc(this.snakeBody[i].cx,this.snakeBody[i].cy,this.snakeBody[i].rad,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
            
            if(i==0)
            { 
            ctx.fillStyle="#f00";
            ctx.strokeStyle="#f00"
            ctx.beginPath();
            ctx.arc(this.snakeBody[i].cx,this.snakeBody[i].cy,40/100*this.snakeRad,0,2*Math.PI);
            ctx.fill();
            ctx.stroke();
                
            }
        }
    },
    push_forward:function(direction){

for(let i=this.snakeLen-1;i>0;i--)
    objcpy(this.snakeBody[i],this.snakeBody[i-1]);

   if(direction == "left")
        {
            
          this.snakeBody[0].cx-=2*this.snakeRad;
          if(this.snakeBody[0].cx<0)
          {
              this.snakeBody[0].cx=canvaElem.width;
          }
        }
   else if(direction == "right")
        {
         
            this.snakeBody[0].cx+=2*this.snakeRad;
        if(this.snakeBody[0].cx>canvaElem.width)
          {
              this.snakeBody[0].cx=0;
          }
        }
   else if(direction == "up")
        {
            
          this.snakeBody[0].cy-=2*this.snakeRad;
          
      if(this.snakeBody[0].cy<0)
          {
              this.snakeBody[0].cy=canvaElem.height;
          }
        }
   else if(direction == "down")
        {
            
          this.snakeBody[0].cy+=2*this.snakeRad; 
        if(this.snakeBody[0].cy>canvaElem.height)
          {
              this.snakeBody[0].cy=0;
          }
        }
        
        
        
        this.draw_snake();
    },
    add_node:function(){
        this.snakeBody.push(new createCtxNode(null,null,null));
        this.snakeLen++;
    },
    isInSelf:function(){
        let snakeHead=this.snakeBody[0];
        
        for(let i=1;i<this.snakeLen;i++)
        {
            if(snakeHead.cx==this.snakeBody[i].cx&&snakeHead.cy==this.snakeBody[i].cy)
            {
                return(true);
            }
        }
        return(false);
    }
};


/**SnakeWork done***/
let food=null;

function foodCreate(x,y,rad)
{
    food=new createCtxNode(x,y,rad);
    food.render=function(){
        ctx.fillStyle="#f00";
        ctx.strokeStyle="#f00";
        ctx.beginPath();
        ctx.arc(this.cx,this.cy,this.rad,0,2*Math.PI);
        ctx.fill();
        ctx.stroke();
    }
    food.remove=function(){
        food=null;
    }
    
    food.render();
}

function isInFood(snakeObj,foodObj)
{
    let snakeHead=snakeObj.snakeBody[0];
    let rad=snakeObj.snakeRad;
    let snakeSx=snakeHead.cx-10;
    let snakeSy=snakeHead.cy-10;
    
    let sideLen=2*rad;
    
    if(
        ((snakeSx>=foodObj.sx&&snakeSx<=foodObj.sx+sideLen)||(snakeSx+sideLen>=foodObj.sx&&snakeSx+sideLen<=foodObj.sx+sideLen))
        &&
        ((snakeSy>=foodObj.sy&&snakeSy<=foodObj.sy+sideLen)||(snakeSy+sideLen>=foodObj.sy&&snakeSy+sideLen<=foodObj.sy+sideLen))
       
        
    )
    {
        return(true);
    }
    
    return(false);
}

function isNoFood(foodObj)
{
    if(foodObj == null)
      return(true);
      
    return(false);
}
/**FoodWork done***/


window.onload=(e)=>{
    canvaElem.width=parseInt(getComputedStyle(canvaElem).width);
    canvaElem.height=parseInt(getComputedStyle(canvaElem).height);
    let toPush=true;
 for (let i = 0; i < ctrlElem.length; i++) {
        
        if(i==0){ //up
            ctrlElem[i].onclick=(e)=>{
                
            if(snake.snakeDirection!='down'&&snake.snakeDirection!='up'){
            
                      snake.snakeDirection='up';
                      toPush=false;
             ctx.clearRect(0,0,canvaElem.width,canvaElem.height);
                snake.push_forward(snake.snakeDirection);
                food.render();
                    }
            }
        }else if(i == 1) //left
        {
           ctrlElem[i].onclick=(e)=>{
                
            if(snake.snakeDirection!='right'&&snake.snakeDirection!='left'){
                
                      snake.snakeDirection='left';
                      toPush=false;
             ctx.clearRect(0,0,canvaElem.width,canvaElem.height);
            snake.push_forward(snake.snakeDirection);
            food.render();
                    }
            } 
        }else if(i==2) //right
        {
            ctrlElem[i].onclick=(e)=>{
                
            if(snake.snakeDirection!='right'&&snake.snakeDirection!='left'){
         
                      snake.snakeDirection='right';
                      toPush=false;
             ctx.clearRect(0,0,canvaElem.width,canvaElem.height);
            snake.push_forward(snake.snakeDirection);
            food.render();
                    }
            }
        }else //down
        {
            ctrlElem[i].onclick=(e)=>{
                
          if(snake.snakeDirection!='down'&&snake.snakeDirection!='up'){
            
                      snake.snakeDirection='down';
                      toPush=false;
             ctx.clearRect(0,0,canvaElem.width,canvaElem.height);
             
            snake.push_forward(snake.snakeDirection);
            food.render();
                    }
            }
        }
        
    }
    
    snake.init_snake();
    snake.draw_snake();
    let i=10;
	let mainLoop=setInterval(()=>{
	    if(snake.isInSelf())
	    {
	       clearInterval(mainLoop);
	       document.querySelector(".scoreElem").innerHTML="Game Over"
	       document.querySelector(".scoreElem").style.color="#0f0";
	       scoreElem.innerHTML=" : "+score;
	       document.querySelector(".scoreElem").appendChild(scoreElem);
	       
	       window.navigator.vibrate(1000);
	       
 for (let i = 0; i < ctrlElem.length; i++) {
	           ctrlElem[i].onclick=null;
     }
	    }else{
	    if(toPush){
	   ctx.clearRect(0,0,canvaElem.width,canvaElem.height);
	   snake.push_forward(snake.snakeDirection);
	    }
	  
	  
 if(isNoFood(food)||isInFood(snake,food))
	  {
	      if(!isNoFood(food))
	      {
	          food.remove();
	          i=randInt(0,canvaElem.width);
	          foodCreate(i,i,10);
	          
	          snake.add_node();
	          window.navigator.vibrate(30);
	          score++;
	          scoreElem.innerHTML=score;
	      }else{
	          foodCreate(i,i,10);
	      }
	  }else
	  {
	      food.render();
	  }
	  toPush=true;
	    }
	},300);
}
