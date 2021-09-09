function randRange(min, max) {
	return Math.random() * (max - min) + min;
}

export class ScoreManager{
    constructor(params){
		this.MANAGER = params.manager;
      	this.bar = params.bar;
        this.timeSpanGame = params.timeTarget;
        this.enemySpanGame = params.enemyTarget;
        this.gunSpanGame = params.gunTarget;
		this.ammoSpanGame = params.ammoTarget;

        this.totalLifes = params.lifes;
		this.time = params.time;

        this.currLifes = this.totalLifes;

        this.startTime = 0;
        this.currTime = 0;
        this.pauseTime = 0;
        this.currPassedTime = 0;
		
        this.lastHit = null;
		
		this.quantityEnemy = params.numEnemy;
		this.killedEnemy = 0;
        this.win = false;
        this.gameOver = false;

        this.updateSpansGame()
    }

    getRemaningTime(){return this.time-this.currPassedTime;}
    getEnemyKilled(){return this.killedEnemy;}
	getNumEnemy(){return this.quantityEnemy;}


    setStartTime(time){this.startTime = time}

    addPauseTime(time){
        this.pauseTime += time;
    }

    isWin(){return this.win}
    isGameOver(){
        this.updateGameOver();
        return this.gameOver;
    }
    updateGameOver(){
        if(this.currLifes <= 0 || this.currPassedTime < 0){
            this.gameOver = true;
        }
        if(this.killedEnemy >= this.quantityEnemy){
            this.win = true;
            this.gameOver = true;
        }
    }
	
	setUpGun(params) {
		this.gun = {
			name: params.name,
			ammo: params.ammo,
			currAmmo: params.currAmmo,
		}
		this.updateSpansGame();
	}
	
	setCurrAmmo(quantity) {
		this.gun.currAmmo = quantity;
		this.updateSpansGame();
	}

    lose1life(){
        var hitTime = Date.now();
		if(this.lastHit && hitTime-this.lastHit < 500)	//After being hit, we have half a second of immunity
			return;
		this.lastHit = hitTime;
		this.currLifes -= 1;
		this.playPainSound();
		this.updateSpansGame();
		this.updateGameOver();
    }

    playPainSound() {
    	var randomNumber = Math.round(randRange(1, 15));
    	let audio = new Audio(".\\resources\\audio\\pain\\pain ("+randomNumber+").mp3");
		audio.volume = this.MANAGER.getEffectVolume();
		audio.play();
    }
	
    updateCurrTime(time) {
        this.currTime = time;
		var oldPassedTime = this.currPassedTime;
        this.currPassedTime = parseInt(this.time - (this.currTime - this.startTime - this.pauseTime) / 1000);
		this.updateGameOver();
		if(oldPassedTime!=this.currPassedTime && !this.gameOver) {
			this.updateSpansGame();
		}
    }
	
    changeScore(value) {
        this.currScore += value;
        this.updateSpansGame();
    }
	enemyKilled() {
		this.killedEnemy++;
		this.updateSpansGame();
		var enemyDeath_audio = new Audio(".\\resources\\audio\\enemyDeath2.mp3");
		enemyDeath_audio.volume = this.MANAGER.getEffectVolume();
		enemyDeath_audio.play();
	}

    updateSpansGame() {
        var currLifes = this.currLifes;
        var totalLifes = this.totalLifes;
	    setTimeout(function(){
	    	bar.style.width = "" + (currLifes/totalLifes * 100) + "%";
	    }, 500);

        this.timeSpanGame.innerHTML = parseInt(this.currPassedTime / 60) + ":" + (this.currPassedTime % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        this.enemySpanGame.innerHTML = "Kills: " + this.killedEnemy + "/" + this.quantityEnemy;

		if(this.gun) {
			this.gunSpanGame.innerHTML = this.gun.name.toUpperCase();
			this.ammoSpanGame.innerHTML = this.gun.currAmmo + "/" + this.gun.ammo;
		}
    }
}