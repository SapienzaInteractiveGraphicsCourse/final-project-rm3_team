export class ScoreManager{
    constructor(params){
        this.lifesSpanGame = params.lifesTarget;
        this.timeSpanGame = params.timeTarget;
        this.enemySpanGame = params.enemyTarget;
		this.ammoSpanGame = params.ammoTarget;

        this.totalLifes = params.lifes;
		this.time = params.time;

        this.currLifes = this.totalLifes;
		
        //this.currScore = 0;
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
			currAmmo: 0,
		}
		this.updateSpansGame();
	}
	
	setCurrAmmo(quantity) {
		this.gun.currAmmo = quantity;
		this.updateSpansGame();
	}

    lose1life(){
		console.log("Colpito")
        var hitTime = Date.now();
		if(this.lastHit && hitTime-this.lastHit < 500)	//After being hit, we have half a second of immunity
			return;
		console.log("Eseguo")
		this.lastHit = hitTime;
		this.currLifes -= 1;
		this.updateSpansGame();
		this.updateGameOver();
    }
	
    updateCurrTime(time){
        this.currTime = time;
		var oldPassedTime = this.currPassedTime;
        this.currPassedTime = parseInt(this.time - (this.currTime - this.startTime - this.pauseTime) / 1000);
		this.updateGameOver();
		if(oldPassedTime!=this.currPassedTime && !this.gameOver) {
			this.updateSpansGame();
		}
    }
	
    changeScore(value){
        this.currScore += value;
        this.updateSpansGame();
    }
	enemyKilled() {
		this.killedEnemy++;
		this.updateSpansGame();
	}

    updateSpansGame() {
        this.lifesSpanGame.innerHTML = "Lifes: " + this.currLifes;
        this.timeSpanGame.innerHTML = "time: " + parseInt(this.currPassedTime / 60) + ":" + (this.currPassedTime % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        this.enemySpanGame.innerHTML = "enemy: " + this.killedEnemy + "/" + this.quantityEnemy;
        //var score = ("0000" + this.currScore);
        //this.scoreSpanGame.innerHTML = "score: " + score.substr(score.length-4);
		if(this.gun) {
			this.ammoSpanGame.innerHTML = this.gun.name +": " + this.gun.currAmmo + "/" + this.gun.ammo;
		}
    }
}