
export class BulletManager {
	static BULLET_PISTOL = "bulletPistol";
	static BULLET_RPG = "bulletRpg";
	
	constructor(params) {
		this.MANAGER = params.manager;
		this.world = params.world;
		this.scene = params.scene;
		this.bullets = [];
	}
	
	spawnNewBullet(objectFrom, direction, type) {
		var position = objectFrom.position;
		if(this.MANAGER.gameEnable==false) return;
		var bullet = this.createNewBullet(type);
		var x = position.x;
		var y = position.y+1.8;
		var z = position.z;
		
		this.bullets.push(bullet);
		
		bullet.body.velocity.set(  direction.x * bullet.velocity,
								direction.y * bullet.velocity,
								direction.z * bullet.velocity);

		// Move the ball outside the player sphere
		var radiusDistance = objectFrom.shapes[0].radius*1.02 + bullet.shape.radius;
		x += direction.x * (radiusDistance);
		y += direction.y * (radiusDistance);
		z += direction.z * (radiusDistance);
		bullet.body.position.set(x,y,z);
		bullet.mesh.position.set(x,y,z);
		this.world.add(bullet.body);
		this.scene.add(bullet.mesh);
	}
	
	createNewBullet(type) {
		switch(type) {
			case BulletManager.BULLET_PISTOL:
				var bulletBody = new CANNON.Body({mass: 0.1});
				var bulletShape = new CANNON.Sphere(0.2);
				var ballGeometry = new THREE.SphereGeometry(0.05, 32, 32);
				var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
				var material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
				var shootVelocity = 50;
				break;
			
			case BulletManager.BULLET_RPG:
				var bulletBody = new CANNON.Body({mass: 50});
				var bulletShape = new CANNON.Sphere(0.5);
				var ballGeometry = new THREE.SphereGeometry(0.5, 32, 32);
				var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
				var material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
				var shootVelocity = 50;
				break;
		}
		var bulletMesh = new THREE.Mesh( ballGeometry, material2 );
		bulletBody.addShape(bulletShape);
		bulletBody.isBullet = 1;
		bulletMesh.castShadow = true;
		bulletMesh.receiveShadow = true;
		return {body: bulletBody, mesh: bulletMesh, shape: bulletShape, velocity: shootVelocity}
	}
	
	update(timeInMilliSecond) {
		for(let i in this.bullets) {
			var bullet = this.bullets[i];
			bullet.mesh.position.copy(bullet.body.position);
			bullet.mesh.quaternion.copy(bullet.body.quaternion);
		}
		//if(this.bullets[0])
			//console.log(this.bullets[0].mesh.position)
	}
}

