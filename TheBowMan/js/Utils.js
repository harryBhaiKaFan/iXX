export const Sound = {
	DAMAGE_SOUND: location.href+"/sound/damage.mp3",
	DEAD_SOUND: location.href+"/sound/dead.mp3",
	LAUNCH_SOUND: location.href+"/sound/launch.mp3",
	SHOT_SOUND: location.href+"/sound/shot_blast.mp3",
	audio: null,
	get SOUND(){
		return !this.audio.muted;
	},
	set SOUND(val){
		this.audio.muted = !val;
	},
	init: function(){
		this.audio = new Audio();
		this.audio.muted = true;
	},
	play_damage(){
		this.audio.src = this.DAMAGE_SOUND;
		this.play();
	},
	play_launch(){
		this.audio.src = this.LAUNCH_SOUND;
		this.play();
	},
	play_dead(){
		this.audio.src = this.DEAD_SOUND;
		this.play();
	},
	play_shot(){
		this.audio.src = this.SHOT_SOUND;
		this.play();
	},
	play(){
		this.audio.oncanplay = () => {
			this.audio.play();
		}
	}
};

export function randNum(min,max)
{
	return(Math.random()*(max-min)+min);
}


export function randInt(min,max)
{
	return(Math.floor(Math.random()*(max-min))+min);
}
