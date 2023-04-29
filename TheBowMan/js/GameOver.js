import {Draw,Color,Text,Dmsns} from "./Draw.js"

export const OverScreen = {
	SCORE: 0,
	X:50,
	Y:200,
	textRect:null,
	init:function(scoreElem,screen){
		this.SCORE = scoreElem.SCORE;
		this.textRect = new Draw.TextRect(Text("YOUR SCORE : "+this.SCORE,Color("yellow","white"),Color("rgba(0,0,0,0)","rgba(0,0,0,0)"),25,Dmsns(this.X,this.Y,screen.width,screen.height),this.X,this.Y,0,screen.width),false);

	},
	update: function(scoreElem,screen){
		this.SCORE = scoreElem.SCORE;
		this.textRect = new Draw.TextRect(Text("YOUR SCORE : "+this.SCORE,Color("yellow","white"),Color("rgba(0,0,0,0)","rgba(0,0,0,0)"),25,Dmsns(this.X,this.Y,screen.width,screen.height),this.X,this.Y,0,screen.width),false);

	},
	render: function(){
		this.textRect.render();
	}
}
