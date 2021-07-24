export class CharacterFactory {
	static GUN_PISTOL = "pistol";
	static GUN_PISTOL_STATISTIC = {
		name: CharacterFactory.GUN_PISTOL,
		timeReloading: 4,
		ammo: 6,
		timeBetweenAmmo: 1.2,
		bullet: {
			mass: 0.1,
			radius: 0.1,
			shootVelocity: 45,
		}
	};
    static GUN_AK47 = "ak47";
	static GUN_AK47_STATISTIC = {
		name: CharacterFactory.GUN_AK47,
		timeReloading: 4,
		ammo: 10,
		timeBetweenAmmo: 0.5,
		bullet: {
			mass: 0.5,
			radius: 0.15,
			shootVelocity: 55,
		}
	};
    static GUN_SNIPER = "sniper";
	static GUN_SNIPER_STATISTIC = {
		name: CharacterFactory.GUN_SNIPER,
		timeReloading: 5,
		ammo: 4,
		timeBetweenAmmo: 1.4,
		bullet: {
			mass: 0.5,
			radius: 0.2,
			shootVelocity: 90,
		}
	};
    static GUN_RPG = "rpg";
	static GUN_RPG_STATISTIC = {
		name: CharacterFactory.GUN_RPG,
		timeReloading: 5,
		ammo: 1,
		timeBetweenAmmo: 3,
		bullet: {
			mass: 50,
			radius: 0.5,
			shootVelocity: 35,
		}
	};
	
	static GUN_ALL = [CharacterFactory.GUN_PISTOL,
						CharacterFactory.GUN_AK47,
						CharacterFactory.GUN_SNIPER,
						CharacterFactory.GUN_RPG]
	static GUN_ALL_STATISTIC = [CharacterFactory.GUN_PISTOL_STATISTIC,
						CharacterFactory.GUN_AK47_STATISTIC,
						CharacterFactory.GUN_SNIPER_STATISTIC,
						CharacterFactory.GUN_RPG_STATISTIC]
	static GUN_RANDOM = CharacterFactory.GUN_ALL[Math.floor(Math.random() * CharacterFactory.GUN_ALL.length)]
	
	constructor(params){
		this.MANAGER = params.manager;
		this.gunsName = params.guns;
		this.guns = [];
		this.gunsQuantity = 0;
		this.actualGun = 0;
		
		this.buildCharacter();
		
		if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
		this.character.position.set(...params.position);
        if(params.rotation)
            this.character.rotation.set(...params.rotation);
		
		this.prepareGuns();
		
		this.initializeAnimation();
	}
	
	buildCharacter() {
		//Generate character
		this.headMesh = this.generateBoxMesh(0.6,0.6,0.6, 0, 0, 0);
		this.headMesh.name = "skull"

		this.headGroup = new THREE.Group();
		this.headGroup.name = "head"
		this.headGroup.add(this.headMesh);
		
		// Body mesh models and groups
		this.bodyMesh = this.generateBoxMesh(0.6, 1.2, 0.45, 0, -0.9, 0);
		this.bodyMesh.name = "abdomen"
		
		//Legs
		this.leftLeg = new THREE.Object3D;
		this.leftLeg.position.y = -1.5
		this.leftLeg.position.x = -0.155
		this.leftLeg.name = "Left Leg"
		this.leftLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0);
		this.leftLeg.add(this.leftLegMesh)
		this.rightLeg = new THREE.Object3D;
		this.rightLeg.position.y = -1.5
		this.rightLeg.position.x = 0.155
		this.rightLeg.name = "Right Leg"
		this.rightLegMesh = this.generateBoxMesh(0.28, 1.0, 0.3, 0, -0.45, 0);
		this.rightLeg.add(this.rightLegMesh)
		this.legGroup = new THREE.Group();
		this.legGroup.name = "leg"
		this.legGroup.add(this.leftLeg, this.rightLeg);
		
		//Arms
		this.leftArm = new THREE.Object3D;
		this.leftArm.position.x = -0.45
		this.leftArm.position.y = -0.45
		this.leftArm.name = "Left Arm"
		this.leftArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3, 0, -0.3, 0);
		this.leftArm.add(this.leftArmMesh)
		this.rightArm = new THREE.Object3D;
		this.rightArm.position.x = 0.45
		this.rightArm.position.y = -0.45
		this.rightArm.name = "Right Arm"
		this.rightArmMesh = this.generateBoxMesh(0.2775, 0.9, 0.3,0, -0.3, 0);
		this.rightArm.add(this.rightArmMesh)
		this.rightArm.rotation.x = Math.PI / 2;
		
		this.armGroup = new THREE.Group();
		this.armGroup.name = "arm"
		this.armGroup.add(this.leftArm, this.rightArm);
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body"
		this.bodyGroup.add(this.bodyMesh, this.legGroup, this.armGroup);
		
		// Character Group
		this.character = new THREE.Group();
		this.character.name = "robot";
		this.character.add(this.headGroup, this.bodyGroup);
		}
	

	
	prepareGuns() {
		for(let i in this.gunsName) {
			switch(this.gunsName[i]) {
				case CharacterFactory.GUN_PISTOL:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_PISTOL].model.clone())
					this.guns[this.gunsQuantity].position.set(0.0,-0.9,-0.3);
					this.guns[this.gunsQuantity].rotation.x = -Math.PI/2;
					break;
				case CharacterFactory.GUN_AK47:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_AK47].model.clone())
					this.guns[this.gunsQuantity].position.set(0.0,-0.6,-0.3);
					this.guns[this.gunsQuantity].rotation.x = -Math.PI/2;
					break;
				case CharacterFactory.GUN_SNIPER:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_SNIPER].model.clone())
					this.guns[this.gunsQuantity].position.set(0.0,-1.0,-0.4);
					this.guns[this.gunsQuantity].rotation.x = -Math.PI;
					break;
				case CharacterFactory.GUN_RPG:
					this.guns.push(this.MANAGER.APP.models[CharacterFactory.GUN_RPG].model.clone())
					this.guns[this.gunsQuantity].position.set(0.0,-0.0,-0.3);
					this.guns[this.gunsQuantity].rotation.x = -Math.PI;
					break;
			}
			this.gunsQuantity++;
		}
		if(this.gunsQuantity!=0)
			this.rightArm.add(this.guns[0]);
	}
	
	changeGun() {
		if(this.gunsQuantity==0) return;
		this.rightArm.remove(this.guns[this.actualGun]);
		this.actualGun = (this.actualGun+1)%this.gunsQuantity;
		this.rightArm.add(this.guns[this.actualGun])
	}
	
	initializeAnimation() {
		//Generate Animations
		this.legTween1 = new TWEEN.Tween({x: 0, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({x: Math.PI/6, y: 0, z: 0}).to( {x:-Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({x:-Math.PI/6, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 100/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween1.chain(this.legTween2)
		this.legTween2.chain(this.legTween3)
		this.legTween3.chain(this.legTween2)
		
		this.updateLeg1 = function(object){
			this.leftLeg.rotation.x = object.x;
			this.rightLeg.rotation.x = -object.x;
			this.leftArm.rotation.x = object.x *0.5;
		}
		this.legTween1.onUpdate(this.updateLeg1.bind(this))
		this.legTween2.onUpdate(this.updateLeg1.bind(this))
		this.legTween3.onUpdate(this.updateLeg1.bind(this))		
	}
	
	getMesh() {
		return this.character;
	}
	
	getActualGun() {
		return CharacterFactory.GUN_ALL_STATISTIC.find(gun => gun.name==this.gunsName[this.actualGun]);
	}
	
	changeRotation(rotX) {
		this.leftArm.rotation.x = rotX;
	}
	
	startMove() {
		this.legTween1.start();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/this.MANAGER.getVelocityFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();
	}
	
	sphereMesh(radius, x, y, z, color='#' + (Math.random() * 0xFFFFFF << 0).toString(16)) {
		var sphereGeometry = new THREE.SphereGeometry(radius, 32, 32);
		var sphereMaterial = new THREE.MeshPhongMaterial( { color: color } );
		var mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
		mesh.position.set(x,y,z);
		return mesh;
	}
	generateBoxMesh(width, height, depth, x, y, z) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		var boxMaterial = new THREE.MeshPhongMaterial( { color: randomColor } );
		var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}

	cylinderMesh(radius, height, x, y, z) {
		var cylinderGeometry = new THREE.CylinderGeometry(radius,radius, height, 32, 32);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		var cylinderMaterial = new THREE.MeshPhongMaterial( { color: randomColor } );
		var mesh = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
		mesh.position.set(x,y,z);
		return mesh;
	}
}