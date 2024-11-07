let touchArea = document.getElementById("touchArea");
let fireArea = document.getElementById("fireArea");
let shotPointer = document.getElementById("shotPointer");
let hyphens = document.querySelectorAll(".hyphen");
let screenHeight = parseInt(getComputedStyle(screen).height);
let screenWidth = parseInt(getComputedStyle(screen).width);
let prevTouch = {
	x: null,
	y: null
};
let shots = 0;
let shotCX = parseInt(getComputedStyle(screen).width)/2;
let shotCY = parseInt(getComputedStyle(screen).height)/2;
let targetArr = [];


function createTarget(x, y) {
	let elem = document.createElement("div");
	elem.classList.add("shootingTarget");
	elem.style.top = y;
	elem.style.left = x;
	screen.appendChild(elem);

	this.y = parseInt(getComputedStyle(elem).top);
	this.x = parseInt(getComputedStyle(elem).left);
	this.w = parseInt(getComputedStyle(elem).width);
	this.h = parseInt(getComputedStyle(elem).height);
	this.elem = elem;
	this.refresh = function() {
		this.elem.style.top = this.y+"px";
		this.elem.style.left = this.x+"px";
	}
}

function insertTarget() {
	for (let i = 0; i < 10; i++) {
		targetArr.push(new createTarget(
			randInt(0, 100)+"vw",
			randInt(0, 100)+"vh"
		));
	}
}

insertTarget();

/**** screen listeners ****/
touchArea.ontouchmove = (e)=> {
	let touch = e.touches['0'];

	if (prevTouch.x != null &&
		prevTouch.y != null) {

		let diffX = -touch.screenX+prevTouch.x;
		let diffY = -touch.screenY+prevTouch.y;

		targetArr.forEach((val, i, arr)=> {
			if (val != null) {
				val.x += diffX;
				val.y += diffY;
				val.refresh();
			}
		});
		
		bg.forEach((val, i, arr)=> {
		/*	val.style.top = parseInt(getComputedStyle(val).top)+randInt(-100,100)+"px";
			val.style.left = parseInt(getComputedStyle(val).left)+randInt(-100,100)+"px";*/
			val.style.top=randInt(0,90)+"%";
			val.style.left=randInt(0,90)+"%";
		});
	}

	prevTouch.x = touch.screenX;
	prevTouch.y = touch.screenY;
}

touchArea.onmousemove = (e)=> {
	//To be implemented ....
}

fireArea.onclick = (e)=> {
	let pointX = shotCX;
	let pointY = shotCY;
	navigator.vibrate(40);
	hyphens.forEach((val, i, arr)=> {
		val.style.fontSize = "1rem";
	});
	shotPointer.style.fontSize = "2.5rem";
	targetArr.forEach((val, i, arr)=> {
		if (val != null) {
			if (pointX >= val.x && pointX <= val.w+val.x && pointY >= val.y && pointY <= val.h+val.y) {
				screen.removeChild(val.elem);
				arr[i] = null;
				shots++;
				kills.innerText = shots;
				if (shots%10 == 0) {
					insertTarget();
				}
			}
		}
	});
	setTimeout(()=> {
		shotPointer.style.fontSize = "2rem";
		hyphens.forEach((val, i, arr)=> {
			val.style.fontSize = "2rem";
		});
	},
		200);
}

let ox = null, oy = null;
setInterval(()=> {
	if (ox == prevTouch.x) {
		prevTouch.x = null;
	}
	if (oy == prevTouch.y) {
		prevTouch.y = null;
	}

	ox = prevTouch.x;
	oy = prevTouch.y;
}, 80);