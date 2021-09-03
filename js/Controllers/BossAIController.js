export class BossAIController {
	constructor(params) {
		this.MANAGER = params.manager
		this.target = params.target;
		this.body = params.body;
		this.player = params.player;
		this.maxDistance = params.maxDistance;
		this.entity = params.entity;
		this.move = false;
	}
	
		update(time) {
		this.target.position.copy(this.body.position);
		this.target.position.y -= 4;
		this.body.velocity.x *= 0.95;
		this.body.velocity.z *= 0.95;
		
		var distance = this.player.body.position.distanceTo(this.body.position);
		if(distance<this.maxDistance*1.2){				//From maxDistance*1.2 start to move in player direction
			var direction = this.computeDirection();
			this.target.rotation.y = Math.atan2(-direction.x,-direction.z);
			if(!this.move) {
				this.entity.character.startMove();
				this.move = true;
			}
			var move = new THREE.Vector3();
			move.z = -time*0.03;
			move.applyAxisAngle(new THREE.Vector3(0,1,0),this.target.rotation.y);
			this.body.velocity.x += move.x;
			this.body.velocity.z += move.z;
		}
		else {
			if(this.move) {
				this.move = false;
				this.entity.character.stopMove();
			}
		}
	}
	
	
	computeDirection() {
		var objective = (new THREE.Vector3()).copy(this.player.body.position);
		var from = this.target.position.clone();
		var direction = objective.sub(from).normalize();
		return (new THREE.Ray(this.body.position, direction)).direction;
	}
}