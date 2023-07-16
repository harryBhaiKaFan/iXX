import { Draw, Color, Text, Dmsns, lineCaps } from './Draw.js';
import { randInt, Sound } from './Utils.js';


const PATH = {
	BIRD_SYM_IMG: location.href+"/img/Bird/Bird_3.png",
	LIFE_IMG: location.href+"/img/Life.png",
	BIRD_ANIM_FLDR: location.href+"/img/Bird",
	POOP_IMG: location.href+"/img/Poop.png"
}


export const BowManScore = {
	SCORE: 0,
	textRect: null,
	birdRect: null,
	X: 0,
	Y: 0,
	WIDTH: 0,
	HEIGHT: 0,
	init: function (screen) {
		this.WIDTH = Math.min((6 * screen.width / 100), 300);
		this.HEIGHT = Math.min((8 * screen.height / 100), 150);
		this.X = (60 * screen.width / 100) - (this.WIDTH / 2);
		this.Y = (1 * screen.height / 100);
		this.birdRect = new Draw.Image(PATH.BIRD_SYM_IMG, Dmsns(this.X, this.Y, this.WIDTH, this.HEIGHT));
		this.textRect = new Draw.TextRect(Text(this.SCORE.toString(), Color("yellow", "white"), Color("rgba(10,10,10,0.3)", "rgba(0,0,0,0)"), 22, Dmsns(this.X, this.Y, 2 * this.WIDTH + 15, this.HEIGHT), this.X + this.WIDTH + 10, this.Y + this.HEIGHT / 2 - 10, this.WIDTH), false);

	},
	update: function () {
		this.textRect = new Draw.TextRect(Text(this.SCORE.toString(), Color("yellow", "white"), Color("rgba(10,10,10,0.3)", "rgba(0,0,0,0)"), 18, Dmsns(this.X, this.Y, 2 * this.WIDTH + 15, this.HEIGHT), this.X + this.WIDTH + 10, this.Y + this.HEIGHT / 2 - 10, this.WIDTH, this.width, 1), false);
	},
	render: function () {
		this.birdRect.render();
		this.textRect.render();
	}
}; //Score viewer

export const BowManLife = {
	LIVES: 3,
	X: 0,
	Y: 0,
	WIDTH: 0,
	HEIGHT: 0,
	lifeRects: [null],
	cntnr: null,
	init: function (screen) {
		this.WIDTH = Math.min((5 * screen.width / 100) * this.LIVES, 5 * 30);
		this.HEIGHT = Math.min((7 * screen.height / 100), 7 * 30);
		this.X = (30 * screen.width / 100) - (this.WIDTH / 2);
		this.Y = (3 * screen.height / 100);
		this.lifeRects = new Array(this.LIVES);
		this.cntnr = new Draw.Rect(Dmsns(this.X, 0, this.WIDTH, this.HEIGHT), Color("rgba(10,10,10,0.3)", "rgba(0,0,0,0)"));


		for (let i = 0; i < this.lifeRects.length; i++) {
			this.lifeRects[i] = new Draw.Image(PATH.LIFE_IMG, Dmsns(this.X + (this.WIDTH / 3) * i, this.Y, this.WIDTH / 3, this.HEIGHT / 3));
		}

	},
	render: function () {
		this.cntnr.render();
		for (let i = 0; i < this.LIVES; i++) {
			this.lifeRects[i].render();
		}
	}
}; // Life Viewer 

function Arrow(headX, headY, angle) {
	this.hx = headX;
	this.hy = headY;
	this.angle = angle;
	this.ty = headY - 3;
	this.tx = headX - 20;
	this.shot = false;
	this.speed = 0.4;

	this.front = new Draw.Circle(this.hx, this.hy, 3, 0, Color("rgba(230,1100,50,255)", "rgba(230,100,50,255)"));
	this.front.arc.isFilled = true;
	this.mid = new Draw.Line(this.hx, this.hy, this.hx - 20, this.hy, 2, lineCaps.round, Color("rgba(200,130,50,255)", "rgba(200,130,50,255)"));
	this.back = new Draw.Rect(Dmsns(this.hx - 20, this.hy - 3, 5, 5), Color("#ff0", "#ff0"));

	this.displace = (dx, dy, a) => {
		this.hx += dx;
		this.hy += dy;

		if (!this.shot)
			this.angle = a;


		this.hy = this.ty + 20 * Math.sin(this.angle);
		this.hx = this.tx + 20 * Math.cos(this.angle);

		this.front = new Draw.Circle(this.hx, this.hy, 3, 0, Color("rgba(230,1100,50,255)", "rgba(230,100,50,255)"));
		this.front.arc.isFilled = true;

		this.mid = new Draw.Line(this.hx, this.hy, this.tx, this.ty, 2, lineCaps.round, Color("rgba(200,130,50,255)", "rgba(200,130,50,255)"));

		this.back = new Draw.Rect(Dmsns(this.tx - 2, this.ty - 2, 5, 5), Color("#ff0", "#ff0"));

	}

	this.rect = () => {
		return Dmsns(this.hx - 20, this.hy - 6, 20, 6);
	}

	this.render = (delta) => {

		if (this.shot == true) {
			this.hx += this.speed * delta * Math.cos(this.angle);
			this.hy -= this.speed * delta * Math.sin(-this.angle);

			this.angle += delta * (this.speed / 1000);

			this.ty = this.hy - 20 * Math.sin(this.angle);
			this.tx = this.hx - 20 * Math.cos(this.angle);

			this.front = new Draw.Circle(this.hx, this.hy, 3, 0, Color("rgba(230,1100,50,255)", "rgba(230,100,50,255)"));
			this.front.arc.isFilled = true;

			this.mid = new Draw.Line(this.hx, this.hy, this.tx, this.ty, 2, lineCaps.round, Color("rgba(200,130,50,255)", "rgba(200,130,50,255)"));

			this.back = new Draw.Rect(Dmsns(this.tx - 2, this.ty - 2, 5, 5), Color("#ff0", "#ff0"));
		}
		this.mid.render();
		this.front.render();
		this.back.render();
	}
}

function isInRect(big, sml) {
	if (((sml.x >= big.x && sml.x <= big.x + big.w) || (sml.x + sml.w >= big.x && sml.x + sml.w <= big.x + big.w)) && ((sml.y >= big.y && sml.y <= big.y + big.h) || (sml.y + sml.h >= big.y && sml.y + sml.h <= big.y + big.h))) {
		return true;
	}

	return false;
}

export const Bow = {
	WD: {
		minAngle: -Math.PI, // angles respect to bowman's 
		currAngle: 0, // vertical position.
		maxAngle: Math.PI,
		RAD: 0,
		CX: 0,
		CY: 0,
		S_ANG: -Math.PI / 2,
		E_ANG: Math.PI / 2
	},
	ROPE_WIDTH: 0,
	WOOD_WIDTH: 0,
	mtrl: {
		wood: null,
		rope: {
			X1: 0,
			Y1: 0,
			X2: 0,
			Y2: 0,
			LENGTH: 0,
			elem: null
		}
	},
	arrow: null,
	SCREEN: null,
	init: function (screen) {
		this.SCREEN = screen;
		this.WD.RAD = 15;
		this.WD.CX = BowMan.X + BowMan.WIDTH;
		this.WD.CY = BowMan.Y + this.WD.RAD;

		this.ROPE_WIDTH = 3;
		this.WOOD_WIDTH = 5;

		let rope = this.mtrl.rope;

		rope.LENGTH = 2 * this.WD.RAD;
		rope.Y1 = this.WD.CY - this.WD.RAD;
		rope.Y2 = this.WD.CY + this.WD.RAD;
		rope.X1 = this.WD.CX;
		rope.X2 = this.WD.CX;

		this.updateBow();
	},
	render: function (delta) {
		// this.mtrl.wood.render();
		// this.mtrl.rope.elem.render();
		this.arrow.render(delta);

		if (!this.arrow.shot) return;

		let arrow = this.arrow.rect();

		Birds.birds.forEach((val, i, arr) => {
			let bx = val.animeImg.imgObj.rect.dmsns.x;
			let by = val.animeImg.imgObj.rect.dmsns.y;
			let bWH = Birds.Img_W_H;


			if (isInRect(Dmsns(bx, by, bWH, bWH), arrow)) {
				Sound.play_shot();
				Birds.birds[i] = null;
				BowManScore.SCORE++;
				BowManScore.update();
			}
		});

		if (!isInRect(Dmsns(0, 0, this.SCREEN.width, 2 * this.SCREEN.height / 3), arrow)) {
			this.updateBow();
		}

	},
	changeAngle: function (r_angle) {
		this.arrow.displace(0, 0, r_angle);
		let rope = this.mtrl.rope;

		rope.X1 = rope.X1 * Math.cos(r_angle);
		rope.Y1 -= Math.sin(-r_angle);

		rope.X2 = rope.X1 + rope.LENGTH * Math.cos(r_angle);
		rope.Y2 = rope.Y1 + rope.LENGTH * Math.sin(r_angle);


		rope.elem.x1 = rope.X1;
		rope.elem.y1 = rope.Y1;
		rope.elem.x2 = rope.X2;
		rope.elem.y2 = rope.Y2;

		let angle = r_angle / 50;

		if (this.WD.S_ANG + angle > this.WD.minAngle && this.WD.E_ANG + angle < this.WD.maxAngle) {
			this.WD.S_ANG += angle;
			this.WD.E_ANG += angle;
		}

		this.mtrl.wood.s_ang = this.WD.S_ANG;
		this.mtrl.wood.e_ang = this.WD.E_ANG;
	},
	shoot: function () {
		Sound.play_launch();
		this.arrow.shot = true;
	},
	updateBow: function () {
		this.mtrl.wood = new Draw.Arc(this.WD.S_ANG, this.WD.E_ANG, this.WD.RAD, this.WD.CX, this.WD.CY, this.WOOD_WIDTH, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"), lineCaps.round, false);

		let rope = this.mtrl.rope;

		rope.elem = new Draw.Line(rope.X1,rope.Y1,rope.X2,rope.Y2,this.ROPE_WIDTH,lineCaps.butt, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));

		this.arrow = new Arrow(this.WD.CX + this.WD.RAD, this.WD.CY, 0);
	}
}; // The Bow 

export const BowMan = {
	mtrl: {
		head: null,
		hands: [null, null],
		body: null,
		legs: [null, null]
	},
	X: 0,
	Y: 0,
	WIDTH: 0,
	HEIGHT: 0,
	manRect: null,
	touch: {
		sx: 0,
		sy: 0,
		mx: 0,
		my: 0,
		ex: 0,
		ey: 0
	},
	init: function (screen) {
		this.WIDTH = Math.min(15 * screen.width / 100, 100);
		this.HEIGHT = Math.min(8 * screen.height / 100, 200);
		this.X = 2 * screen.width / 100;
		this.Y = 2 * screen.height / 3 - this.HEIGHT;


		screen.onpointerdown = (e) => {

			if (this.touch.ex !== 0)

				this.touch.sx = e.x;
			this.touch.sy = e.y;
		}

		screen.onpointermove = (e) => {
			this.touch.mx = e.x;
			this.touch.my = e.y;

			let diffY = this.touch.my - this.touch.sy;

			let angle = Math.atan(diffY / 100);
			Bow.changeAngle(-angle);
		}

		screen.onpointerup = () => {
			Bow.shoot();
		}

		this.mtrl.head = new Draw.Circle(this.X + this.WIDTH / 2, this.Y, this.WIDTH / 8, 2, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));
		this.mtrl.head.arc.isFilled = true;

		this.mtrl.hands[0] = new Draw.Line(this.X + this.WIDTH / 2, this.Y + this.HEIGHT / 3, this.X + this.WIDTH, this.Y + this.HEIGHT / 3, 5, lineCaps.round, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));

		this.mtrl.hands[1] = new Draw.Line(this.X + this.WIDTH / 2, this.Y + this.HEIGHT / 3, this.X + this.WIDTH, this.Y + this.HEIGHT / 3 - 10, 5, lineCaps.round, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));

		this.mtrl.body = new Draw.Rect(Dmsns(this.X + this.WIDTH / 2 - this.WIDTH / 8, this.Y + this.HEIGHT / 8, this.WIDTH / 4, this.HEIGHT * 50 / 100), Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));

		this.mtrl.legs[0] = new Draw.Line(this.X + this.WIDTH / 2, this.Y + this.HEIGHT / 2, this.X + this.WIDTH / 2 - 10, this.Y + this.HEIGHT, 5, lineCaps.round, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));

		this.mtrl.legs[1] = new Draw.Line(this.X + this.WIDTH / 2, this.Y + this.HEIGHT / 2, this.X + this.WIDTH / 2 + 10, this.Y + this.HEIGHT, 5, lineCaps.round, Color("rgba(100,50,50,255)", "rgba(100,50,50,255)"));


		this.manRect = new Draw.Rect(Dmsns(this.X, this.Y, this.WIDTH, this.HEIGHT), Color("#0000", "#0000"));
	},
	getRect: function () {
		return (Dmsns(this.X, this.Y, this.WIDTH, this.HEIGHT));
	},
	render: function () {
		this.manRect.render();
		this.mtrl.legs[0].render();
		this.mtrl.legs[1].render();
		this.mtrl.body.render();
		this.mtrl.hands[0].render();
		this.mtrl.hands[1].render();
		this.mtrl.head.render();
	}
}; // A man holding bow 


function Bird(maxX, minY, maxY, width, height) {
	let x = maxX;
	let y = randInt(minY, maxY);
	this.animeImg = new Draw.AnimatedImage(PATH.BIRD_ANIM_FLDR, 8, Dmsns(x, y, width, height), "Bird");
}

function Poop(x, y, birdWH) {
	let h = 60 * birdWH / 100;
	let w = 60 * birdWH / 100;
	this.img = new Draw.Image(PATH.POOP_IMG, Dmsns(x, y, w, h));
}

export const Birds = {
	minX: 0,
	maxX: 0,
	minY: 0,
	maxY: 0,
	Img_W_H: 0,
	birdsCnt: 0,
	birds: [],
	poops: [],
	SPEED: 0,
	init: function (screen) {
		this.Img_W_H = 6 * screen.height / 100;
		this.minX = -100;
		this.maxX = screen.width + 100;
		this.minY = (screen.height / 15) + 2 * this.Img_W_H;
		this.maxY = (2 * screen.height / 3) - 4 * this.Img_W_H;
		this.SPEED = 0.01;
		this.birdsCnt = 5;

		for (let i = 0; i < this.birdsCnt; i++) {
			this.birds[i] = new Bird(this.maxX, this.minY, this.maxY, this.Img_W_H, this.Img_W_H);
		}
	},
	getBirdsRects: function () {

	},
	render: function (delta) {
		this.poops.forEach((val) => {
			val.img.rect.dmsns.y += delta * 0.04;
			val.img.render();
			if (val.img.rect.dmsns.y >= BowMan.Y) {
				this.poops.pop();
				Sound.play_damage();
				BowManLife.LIVES--;
			}
		});

		for (let i = 0; i < this.birdsCnt; i++) {
			if (this.birds[i] == null) {
				this.birds[i] = new Bird(this.maxX, this.minY, this.maxY, this.Img_W_H, this.Img_W_H);
			}

			this.birds[i].animeImg.imgObj.rect.dmsns.x -= this.SPEED * delta * (i + 1);
			this.birds[i].animeImg.render(100);
			let bx = this.birds[i].animeImg.imgObj.rect.dmsns.x;
			let by = this.birds[i].animeImg.imgObj.rect.dmsns.y;
			let bmx = BowMan.X;
			let bmw = BowMan.WIDTH;

			if (bx >= bmx && bx <= bmx + bmw) {
				if (this.poops.length == 0)
					this.poops.push(new Poop(bx, by, this.Img_W_H));
			}

			if (bx <= this.minX) {
				this.birds[i] = new Bird(this.maxX, this.minY, this.maxY, this.Img_W_H, this.Img_W_H);
			}
		}

		return (BowManLife.LIVES == 0);
	}
} // Birds pooping down 
