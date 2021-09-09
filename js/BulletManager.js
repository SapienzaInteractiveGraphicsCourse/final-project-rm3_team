import {CharacterFactory} from './CharacterFactory.js';

export class BulletManager {
	static BULLET_PISTOL = "bulletPistol";
	static BULLET_RPG = "bulletRpg";
	
	constructor(params) {
		this.MANAGER = params.manager;
		this.world = params.world;
		this.scene = params.scene;
		this.bullets = [];
		this.deletedBullets = [];
	}
	
	spawnNewBullet(entity, direction) {
		var position = entity.body.position;
		if(this.MANAGER.gameEnable==false) return;
		var bullet = this.createNewBullet(entity.character.getActualGun().bullet);
		bullet.body.idBullet = entity.bulletId;
		bullet.body.addEventListener("collide", function (e){		//se il proiettile colpisce il pavimento
                if ( !(e.contact.bi.isGround || e.contact.bj.isGround) )
                    return;
                bullet.body.isBullet = undefined;
				this.deletedBullets.push(bullet)
            }.bind(this));
		var x = position.x;
		var y = position.y+1.8;
		var z = position.z;
		
		this.bullets.push(bullet);
		
		bullet.body.velocity.set(direction.x * bullet.velocity,
								direction.y * bullet.velocity,
								direction.z * bullet.velocity);

		// Move the ball outside the player sphere
		var radiusDistance = entity.body.shapes[0].radius*1.02 + bullet.shape.radius;
		x += direction.x * (radiusDistance);
		y += direction.y * (radiusDistance);
		z += direction.z * (radiusDistance);
		bullet.body.position.set(x,y,z);
		bullet.mesh.position.set(x,y,z);
		this.world.add(bullet.body);
		this.scene.add(bullet.mesh);
	}
	
	createNewBullet(bullet) {
		var bulletBody = new CANNON.Body({mass: bullet.mass});
		var bulletShape = new CANNON.Sphere(bullet.radius);
		var ballGeometry = new THREE.SphereGeometry(bullet.radius, 32, 32);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		var material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
		var shootVelocity = bullet.shootVelocity;
		var bulletMesh = new THREE.Mesh( ballGeometry, material2 );
		bulletBody.addShape(bulletShape);
		bulletBody.isBullet = 1;
		bulletMesh.castShadow = true;
		bulletMesh.receiveShadow = true;
		return {body: bulletBody, mesh: bulletMesh, shape: bulletShape, velocity: shootVelocity, pos: this.bullets.length}
	}
	
	update(timeInMilliSecond) {
		for(let i in this.deletedBullets) {
			var bullet = this.deletedBullets[i]
			this.world.remove(bullet.body);
			bullet.mesh.parent.remove(bullet.mesh);
			var pos = bullet.pos;
			this.bullets.splice(pos, 1);
			for (let j = pos; j < this.bullets.length; j++)
				this.bullets[j].pos -= 1;
		}
		this.deletedBullets = [];
		for(let i in this.bullets) {
			var bullet = this.bullets[i];
			bullet.mesh.position.copy(bullet.body.position);
			bullet.mesh.quaternion.copy(bullet.body.quaternion);
		}
	}
}

