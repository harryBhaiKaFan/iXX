export const Draw = {
	drawCircle: function (ctx, cx, cy, rad,fillColor="#000")
	{
		ctx.beginPath();
		ctx.fillStyle=fillColor;
		ctx.arc(cx,cy,rad,0,2*Math.PI);
		ctx.fill();
		ctx.closePath();
	},

	drawRect: function (ctx, dmsns,fillColor="#000",bordered=false)
	{
		ctx.fillStyle=fillColor;
		ctx.fillRect(dmsns.x,dmsns.y,dmsns.w,dmsns.h);
		
		if(bordered){
			ctx.strokeRect(dmsns.x,dmsns.y,dmsns.w,dmsns.h);
		}
	},

	drawTextRect: function (ctx, dmsns,fillColor="#f00",textColor="#fff",textSize=50, text="Hello")
	{
		ctx.fillStyle=fillColor;
		ctx.textAlign="left";
		ctx.textBaseline="hanging";
		ctx.font=textSize+"px monospace";
		ctx.fillRect(dmsns.x,dmsns.y,textSize*text.length,textSize*6/5);
		ctx.fillStyle=textColor;
		ctx.fillText(text,dmsns.x,dmsns.y+(textSize*6/5)*10/100);
	},

	drawImage: function (ctx, dmsns, img)
	{
		ctx.drawImage(img,dmsns.x,dmsns.y,dmsns.w,dmsns.h);
	}
}