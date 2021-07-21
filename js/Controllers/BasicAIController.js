import {BulletManager} from './../BulletManager.js';

export class BasicAIController {
	constructor(params) {
		this.MANAGER = params.manager
		this.target = params.target;
		this.body = params.body;
		this.player = params.player;
		this.maxDistance = params.maxDistance;
		this.character = params.character;
		this.bulletManager = params.bulletManager;
		this.timeToShot = Math.random() * 500;
	}
	
	update(timeInSeconds) {
		this.target.position.copy(this.body.position);
		this.target.position.y += 0.3;
		
		var distance = this.player.body.position.distanceTo(this.body.position);
		if(distance<this.maxDistance) {
			
			if(this.timeToShot<0) {
				
				
				this.bulletManager.spawnNewBullet(this.body,this.computeDirection(),BulletManager.BULLET_PISTOL)
				this.timeToShot = this.computeNewTime();
			}
			else
				this.timeToShot -= timeInSeconds;
		}
	}
	
	computeNewTime() {
		return (Math.random()+1)*1000;
	}
	
	computeDirection() {
		var objective = (new THREE.Vector3()).copy(this.player.body.position);
		var from = this.target.position.clone();
		var direction = objective.sub(from).normalize();
		return (new THREE.Ray(this.body.position, direction)).direction;
	}
	
	/*
	selectBullet() {
		switch()
	}
	*/
}