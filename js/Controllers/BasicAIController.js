import {BulletManager} from './../BulletManager.js';

export class BasicAIController {
	constructor(params) {
		this.MANAGER = params.manager
		this.target = params.target;
		this.body = params.body;
		this.player = params.player;
		this.maxDistance = params.maxDistance;
		this.entity = params.entity;
		this.bulletManager = params.bulletManager;
		this.timeToShot = Math.random() * 500;
	}
	
	update(timeInSeconds) {
		this.target.position.copy(this.body.position);
		this.target.position.y += 0.3;
		
		var distance = this.player.body.position.distanceTo(this.body.position);
		if(distance<this.maxDistance) {
			var direction = this.computeDirection();
			this.target.rotation.y = Math.atan2(-direction.x,-direction.z);
			if(this.timeToShot<0) {
				this.bulletManager.spawnNewBullet(this.entity,direction)
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