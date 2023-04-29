window.addEventListener("click",(e)=>{
	document.body.classList.toggle("light");
	
});


window.addEventListener("load",(e)=>{
	setInterval(()=>{
		let DateObj=new Date();

		sec.style.transform="rotate("+6*DateObj.getSeconds()+"deg)";
		min.style.transform="rotate("+(6*DateObj.getMinutes()+(DateObj.getSeconds()/10))+"deg)";
		hr.style.transform="rotate("+((30*DateObj.getHours())+(DateObj.getMinutes()/2))+"deg)";

	},1000);
});
