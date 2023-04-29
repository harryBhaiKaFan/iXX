export const lineCaps = {
	butt:"butt",
	round:"round",
	square:"sqaure"
};

export function Dmsns(x=0,y=0,w=10,h=10)
{
	return {
		x:x,
		y:y,
		w:w,
		h:h
	};
}

export function Color(fill="black",stroke="white")
{
	return {
		fill:fill,
		stroke:stroke,
		setFill(colorStr)
		{
			this.fill=colorStr;
		},
		setStroke(colorStr)
		{
			this.stroke=colorStr;
		}
	}
}

export function Text(text, color,bgColor, size, dmsns,x,y, maxTextWidth=100,padding=5,boldness=1)
{
	return {
		fontFamily:"monospace", // hard-coded value
		text: text,
		x: x,
		y: y,
		fontSize:size,
		rect: new Rect(dmsns,bgColor),
		color: color,
		maxWidth: maxTextWidth,
		padding: padding,
		boldness: boldness
	};
}

function Rect(dmsns,color=Color("transparent","transparent"),lineWidth=0)
{
	if(dmsns == null || typeof(dmsns) != "object") 
	{
		console.log("Invalid dimensions");
		return;
	}

	this.dmsns=dmsns;
	this.color=color;
	this.lineWidth=lineWidth;
	this.render=()=>{
		let {x,y,w,h} = {...this.dmsns};
		Draw.CTX.fillStyle=this.color.fill;
		Draw.CTX.strokeStyle=this.color.stroke;
		Draw.CTX.lineWidth=0;
		if(lineWidth != 0)
			Draw.CTX.strokeRect(x,y,w,h);
		Draw.CTX.fillRect(x,y,w,h);
	};
}

function Line(x1,y1,x2,y2,width,cap,color)
{
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
	this.width = width;
	this.color = color;
	this.cap = cap;

	this.render = () => {
		Draw.CTX.lineWidth = this.width;
		Draw.CTX.strokeStyle = this.color.stroke;
		Draw.CTX.fillStyle=this.color.fill;
		Draw.CTX.lineCap = this.cap;
		Draw.CTX.beginPath();
		Draw.CTX.moveTo(this.x1,this.y1);
		Draw.CTX.lineTo(this.x2,this.y2);
		Draw.CTX.stroke();
		Draw.CTX.closePath();
	}
}

function Arc(s_ang,e_ang,rad,cx,cy,width,color,cap="round",anticlockwise=false,isFilled=false)
{
	this.s_ang = s_ang;
	this.e_ang = e_ang;
	this.rad = rad;
	this.cx = cx;
	this.cy = cy;
	this.width = width;
	this.color = color;
	this.cap = cap;
	this.anticlockwise=anticlockwise;
	this.isFilled = isFilled;

	this.render = () => {
		Draw.CTX.strokeStyle=this.color.stroke;
		Draw.CTX.fillStyle=this.color.fill;
		Draw.CTX.lineWidth=this.width;
		Draw.CTX.lineCap=this.cap;
		Draw.CTX.beginPath();
		Draw.CTX.arc(this.cx,this.cy,this.rad,this.s_ang,this.e_ang,this.anticlockwise);
		if(this.width != 0)
			Draw.CTX.stroke();
		if(this.isFilled)
			Draw.CTX.fill();
		Draw.CTX.beginPath();
		Draw.CTX.closePath();
	}
}

function Circle(cx,cy,rad,width,color)
{
	this.arc = new Arc(0,2*Math.PI,rad,cx,cy,width,color,"butt",false);
	this.render = () => {
		this.arc.render();
	}
}


function Image(path,dmsns)
{
	this.rect=new Rect(dmsns);
	this.img_loaded=false;

	this.load=(path)=>{

		let img = document.createElement("img");
		this.img_loaded=false;
		img.src=path;
		this.img=img;

		img.onload=()=>{
			this.img_loaded = true;
		}
	};
	this.load(path);

	this.src=(path)=>{
		this.img_loaded=false;
		this.img.src=path;

		this.img.onload=()=>{
			this.img_loaded=true;
		}
	};

	this.render=()=>{
		if(!this.img_loaded) return;
		let {x,y,w,h} = {...this.rect.dmsns};
		Draw.CTX.drawImage(this.img,x,y,w,h);
	};
}

function AnimatedImage(path,frames,dmsns,title,format="png")
{
	this.frmCnt=frames;
	this.currFrm=0;
	this.path=path;
	this.title=title;
	this.format=format;
	this.imgObj=new Image(this.path+"/"+this.title+"_"+this.currFrm+"."+this.format,dmsns);
	let isFrmLeft = false;

	this.render=(frmDelay=0)=>{
		this.imgObj.render();

		if(isFrmLeft) return;
		isFrmLeft = true;

		setTimeout(()=>{
			this.currFrm=(this.currFrm+1)%this.frmCnt;
			this.imgObj.src(this.path+"/"+this.title+"_"+this.currFrm+"."+this.format);
			isFrmLeft = false;
		},frmDelay);
	}
}

function TextRect(text,isFilled=true)
{
	this.text = text;
	this.isFilled = isFilled;
	let {x,y,h,w} = {...this.text.rect.dmsns};
	x=x-this.text.padding;
	y=y-this.text.padding;
	w=w+this.text.padding;
	h=h+this.text.padding;
	this.text.rect.dmsns = Dmsns(x,y,w,h);

	this.render = () => {
		this.text.rect.render();

		Draw.CTX.textAlign="start";
		Draw.CTX.textBaseline="hanging";
		Draw.CTX.lineWidth=this.text.boldness;
		Draw.CTX.strokeStyle=this.text.color.stroke;
		Draw.CTX.fillStyle=this.text.color.fill;
		Draw.CTX.font = this.text.fontSize+"px "+this.text.fontFamily;
		if(this.text.boldness != 0)
			Draw.CTX.strokeText(this.text.text,this.text.x,this.text.y,this.text.rect.maxWidth);
		Draw.CTX.fillText(this.text.text,this.text.x,this.text.y,this.text.rect.maxWidth);
	}
}

export const Draw = {
	CTX: null,
	init: function(ctx){
		this.CTX=ctx;
	},
	Rect,
	Image,
	AnimatedImage,
	TextRect,
	Line,
	Arc,
	Circle
}
