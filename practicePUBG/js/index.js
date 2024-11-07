let screen = document.getElementById("screen");
let bg = document.querySelectorAll(".bg");
let header = document.querySelector("header");

function randInt(min, max) {
	return((Math.random()*(max-min))+min);
}

function initColor(e) {
	bg.forEach((val,i,arr)=>{
		val.style.background = "linear-gradient(to right,rgb("+randInt(0,150)+","+randInt(0, 150)+","+randInt(0, 150)+"),#000)";
		val.style.top=randInt(-10,100)+"%";
		val.style.left=randInt(-10,100)+"%";
	});
}

window.onload=initColor;
window.ondblclick=initColor;