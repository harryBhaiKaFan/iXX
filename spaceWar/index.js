/**
 * !!! Only supports mobile devices...
 */


let screenElem = null;
let myBoxElem = null;
let scrElem = null; //score Elem
let livesElem = null;
let shootElem = null;
let isTouchEnded = null;
let btns = null;
let gameOver = false;

/****myBoxElem related vars***/
let m_Speed = 1;
let m_Score = 0;
let m_lives = 75;
let mY_percent = 60;
let mX_percent = 40;
let m_y = null;
let m_x = null;

/***Obs related vars***/
let obsCount = 0;
let obsMaxLives = 1;

/***Var declared***/

function randInt(min, max) {
	return(Math.ceil(Math.random()*max)+min);
}

function isInRect(m_x, m_y, m_w, m_h, b_x, b_y, b_w, b_h) {
	if (
		((m_x+m_w) >= (b_x) &&
			(m_x+m_w) <= (b_x+b_w)) &&
		((m_y+m_h) >= (b_y) &&
			(m_y+m_h) <= (b_y+b_h))
	) {
		return true;
	}

	return(false);
}

/***Func. defined***/

window.onload = (e)=> {
	screenElem = gameScreen;
	myBoxElem = myBox;
	scrElem = scr; //Score elem
	livesElem = lives; //lives elem
	shootElem = shootBtn;
	myBoxElem.style.top = "60%";
	myBoxElem.style.left = "40%";

	left = document.querySelector(".Left");
	up = document.querySelector(".Up");
	right = document.querySelector(".Right");
	down = document.querySelector(".Down");
	btns = document.querySelectorAll(".ctrlBtn");

	/***myBoxElem move event listeners here***/

	btns.forEach((val)=> {
		val.ontouchend = (e)=> {
			isTouchEnded = true;
		}
		shootElem.ontouchend = val.ontouchend;
	});

	up.ontouchstart = (e) => {
		if (isTouchEnded == true) {
			isTouchEnded = false;
			return;
		}
		isTouchEnded = false;
		if (mY_percent > 0) {
			mY_percent -= m_Speed;
			myBoxElem.style.top = mY_percent+"%";
		}
		requestAnimationFrame(up.ontouchstart);
	}

	down.ontouchstart = (e) => {
		if (isTouchEnded == true) {
			isTouchEnded = false;
			return;
		}
		isTouchEnded = false;
		if (mY_percent < 90) {
			mY_percent += m_Speed;
			myBoxElem.style.top = mY_percent+"%";
		}
		requestAnimationFrame(down.ontouchstart);
	}
	//LEFT
	left.ontouchstart = (e) => {
		if (isTouchEnded == true) {
			isTouchEnded = false;
			return;
		}
		isTouchEnded = false;
		if (mX_percent > 0) {
			mX_percent -= m_Speed;
			myBoxElem.style.left = mX_percent+"%";
		}
		requestAnimationFrame(left.ontouchstart);
	}
	//RIGHT
	right.ontouchstart = (e) => {
		if (isTouchEnded == true) {
			isTouchEnded = false;
			return;
		}
		isTouchEnded = false;
		if (mX_percent < 90) {
			mX_percent += m_Speed;
			myBoxElem.style.left = mX_percent+"%";
		}
		requestAnimationFrame(right.ontouchstart);
	}

	/*******/

	/***myBoxElem shoot here***/
	shootElem.ontouchstart = (e) => {
		if (isTouchEnded == true) {
			isTouchEnded = false;
			return;
		}

		isTouchEnded = false;
		let bulletElem = document.createElement("div");
		let top = mY_percent+4.5;
		let left = mX_percent+4.5;

		bulletElem.className = "bullet";
		bulletElem.style.top = top+"%";
		bulletElem.style.left = left+"%";

		let bulItrvl = setInterval(()=> {
			//For moving bullet up
			top -= 4;
			bulletElem.style.top = top+"%";
			if (top <= 0) {
				bulletElem.remove();
				clearInterval(bulItrvl);
			}
			let obsCont = document.querySelectorAll(".ostkl");
			for (let i = 0; i < obsCont.length; i++) {
				let obsTmp = obsCont[i];
				let obsX = parseInt(obsTmp.style.left);
				let obsY = parseInt(obsTmp.style.top);


				if (isInRect(left, top, 1, 1, obsX, obsY, 10, 10)) {
					let prgElem = obsTmp.firstChild;
					let life = parseInt(prgElem.value);

					life -= 1;
					prgElem.value = life;

					if (life <= 0 && !gameOver) {
						obsTmp.remove();
						obsCount--;
						m_Score++;
					}


					bulletElem.remove();
				}
			}
		},
			100);
		screenElem.appendChild(bulletElem);

		requestAnimationFrame(shootElem.ontouchstart);
	}

	/***Obs launch and shoot loop here***/
	let obsAllItr = setInterval(() => {
		if (obsCount < 3) {
			let obsObj = document.createElement('div');
			let obsPrgrres = document.createElement('progress');
			let topObj = randInt(10, 90),
			leftObj = randInt(10, 90);

			obsObj.className = "ostkl";
			obsPrgrres.className = "ostklLiv";
			obsPrgrres.value = obsMaxLives;
			obsPrgrres.max = obsMaxLives;

			obsObj.style.top = topObj+"%";
			obsObj.style.left = leftObj+"%";

			let chaseIrvl = setInterval(()=> {
				//For chasing myBoxElem
				if (m_lives <= 0) {
					clearInterval (chaseIrvl);
				}

				if (topObj != m_y - 20) {
					if (topObj > m_y - 20) {
						topObj--;
					} else
					{
						topObj++;
					}
				}
				setTimeout(()=> {
					let rndX = randInt(-40, 80);

					if (leftObj != m_x + rndX) {
						if (leftObj > m_x + rndX) {
							leftObj--;
						} else
						{
							leftObj++;
						}
					}
					obsObj.style.left = leftObj+"%";
				},
					100);

				obsObj.style.top = topObj+"%";

			}, 100);

			let creIrvl = setInterval(()=> {
				//For firing bullets
				if (m_lives <= 0 || obsPrgrres.value <= 0) {
					clearInterval (creIrvl);
				}
				let bulletElem = document.createElement("div");
				let top = topObj+4.5;
				let left = leftObj+4.5;

				bulletElem.className = "bullet";
				bulletElem.style.top = top+"%";
				bulletElem.style.left = left+"%";

				let bulItrvl = setInterval(()=> {
					//For moving bullet down
					top += 4;
					bulletElem.style.top = top+"%";
					if (top >= 100) {
						bulletElem.remove();
						clearInterval(bulItrvl);
					}

					if (isInRect(left, top, 1, 1, m_x, m_y, 10, 10)) {
						m_lives--;
						bulletElem.remove();
						clearInterval(bulItrvl);
					}

				},
					100);
				
				

				screenElem.appendChild(bulletElem);
			}, 500);
			
			obsObj.appendChild(obsPrgrres);
			screenElem.appendChild(obsObj);
			obsCount++;
		}
	}, 150);

	/***myBoxElem loop here***/

	let itrlLoop = setInterval(() => {
		if (m_lives <= 0) {
			alert("You are dead!");
			
			gameOver=true;
			clearInterval (obsAllItr);
			clearInterval (itrlLoop);
		} else {

			m_y = parseInt(myBoxElem.style.top);
			m_x = parseInt(myBoxElem.style.left);

			scrElem.innerText = m_Score;
			livesElem.value = m_lives;
			obsMaxLives = m_Score+1;
		}
	},
		100);
}