let solved=0;
let live=3;
let i=5;

function randInt(min,max)
{
	return(Math.floor(Math.random()*(max-min))+min);
}

function resetQue()
{
const ops="/*+-";
	oprand1.value=randInt(1,solved);
	operator.value=ops[randInt(0,4)];
	oprand2.value=randInt(1,solved);
	
	oprand1.style.fontSize="3rem";
	oprand2.style.fontSize="3rem";
	operator.style.fontSize="3rem";

	setTimeout(()=>{
		ANS.value="";
		oprand1.style.fontSize="1.5rem";          
		oprand2.style.fontSize="1.5rem";        
		operator.style.fontSize="1.5rem";
	},300);
}

window.onload=(e)=>{
	resetQue();
let itrvl=setInterval(()=>{
	i--;
if(i<=0){
live--;
lives.innerText="Lives: "+live;
	if(live==0)
	{
		alert("Score: "+solved);
		ANS.oninput=null;
		clearInterval(itrvl);
	}else{
	resetQue();
	i=5;
	}
}

	timeLeft.innerText=i+"";
	
},1000);

}

ANS.oninput=(e)=>{

if(parseInt(ANS.value)==Math.floor(eval(oprand1.value+operator.value+oprand2.value)))
        {
                solved++;
                score.innerText="Solved: "+solved;                         resetQue();
                i=6;
        }
}
