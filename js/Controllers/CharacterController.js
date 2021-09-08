import { InputController } from './InputController.js';

var PI_2 = Math.PI / 2;
		
export class CharacterController {
	constructor(params) {
		this.MANAGER = params.manager;
		this.entity = params.entity;
		this.camera = params.camera;
		this.bulletManager = params.bulletManager;
		this.scoreManager = params.scoreManager;
		this.document = params.document;
		
		this.characterBody = this.entity.body;
		this.character = this.entity.character;
		
		this.currentGun = this.character.getActualGun();
		this.setUpGun();
		this.setAmmo(this.ammo);
		this.shotTime = -1;
		this.input = new InputController({manager : this.MANAGER});
		this.jumpVelocity = 20;

		this.yawObject = new THREE.Object3D();
		this.pitchObject = new THREE.Object3D();	
		
		this.setUpObject();		
		
		this.isMoving = false;
		this.canJump = false;

		this.contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
		this.upAxis = new CANNON.Vec3(0,1,0);
		
		this.quat = new THREE.Quaternion();
		this.inputVelocity = new THREE.Vector3();
		this.euler = new THREE.Euler();
	
		this.velocity = this.characterBody.velocity;
		this.shiftHelded = false;
		this.tabHelded = false;
		this.shiftFactor = 1;
		
		this.characterBody.addEventListener("collide",this.onCollision.bind(this));
		
		this.shootDirection = new THREE.Vector3();
		window.addEventListener("click",this.shot.bind(this));
	}
	
	onCollision(e) {
		var contact = e.contact;

		// contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
		// We do not yet know which one is which! Let's check.
		if(contact.bi.id == this.characterBody.id)  // bi is the player body, flip the contact normal
			contact.ni.negate(this.contactNormal);
		else
			this.contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

		// If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
		if(this.contactNormal.dot(this.upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
			this.canJump = true;
	}
	
	setUpObject() {
		this.pitchObject.position.set(0.0,2,-0.2);
		this.yawObject.add(this.character.getMesh());
		this.yawObject.add(this.pitchObject);
		
		//CAMERA SETTING
		this.pitchObject.add(this.camera[0]);		//First person camera, move in all direction with the arm
		//Third person camera, move in all direction but whit focus on the head
		this.camera1RotationObject = new THREE.Object3D();
		this.camera1RotationObject.position.y = 1;
		this.camera1RotationObject.add(this.camera[1]);
		this.yawObject.add(this.camera1RotationObject);
		this.yawObject.add(this.camera[2]);		// Camera from above, move only on y, not on x.
	}
	
    getObject() {
        return this.yawObject;
    };
	kickBack(enemyPosition) {
		var playerPos = new THREE.Vector3(this.entity.body.position.x, this.entity.body.position.y, this.entity.body.position.z);
		var enemyPos = new THREE.Vector3(enemyPosition.x,enemyPosition.y,enemyPosition.z)
		var directionMove = playerPos.sub(enemyPos).normalize()
		this.velocity.x += directionMove.x*200;
		this.velocity.z += directionMove.z*200;
	}
	addTourch(tourch) {
		var tourchGroup = new THREE.Group();
		tourchGroup.add(tourch, tourch.target);
		tourchGroup.rotateX(-Math.PI/2);
		this.character.rightArm.add(tourchGroup);
		this.tourch = tourch;
	}
	turnTourch() {
		this.tourch.visible = !this.tourch.visible;
	}
	getShootDir(targetVec){
		var vector = targetVec;
		targetVec.set(0,0,1);
		vector.unproject(this.camera[0]);
		var ray = new THREE.Ray(this.entity.body.position, vector.sub(this.entity.body.position).normalize() );
		targetVec.copy(ray.direction);
	}
	
	createBulletFromPlayer() {
		this.getShootDir(this.shootDirection);
		this.bulletManager.spawnNewBullet(this.entity, this.shootDirection)
	}
	reloadComplete() {
		this.setAmmo(this.ammo);
		this.shotTime = -1;
		this.isReloading = false;
		this.audioReloading = false;
		document.getElementById("reloading").style.visibility = "hidden";
	}
	reload() {
		this.shotTime = this.timeReload;
		this.isReloading = true;
		var document = this.document;
		document.getElementById("bulletImg").style.visibility = "hidden";

		document.getElementById("reloading").style.visibility = "visible";
		setTimeout(function(){
	    	document.getElementById("reloading").style.visibility = "hidden";
	    }, 4000);

		setTimeout(function(){
	    	document.getElementById("bulletImg").style.visibility = "visible";
	    	/*document.getElementById("reloading").style.visibility = "hidden";*/
	    }, 400);
	    setTimeout(function(){
	    	document.getElementById("bulletImg").style.visibility = "hidden";
	    	/*document.getElementById("reloading").style.visibility = "visible";*/
	    }, 800);
	    setTimeout(function(){
	    	document.getElementById("bulletImg").style.visibility = "visible";
	    	/*document.getElementById("reloading").style.visibility = "hidden";*/
	    }, 1200);
	    setTimeout(function(){
	    	document.getElementById("bulletImg").style.visibility = "hidden";
	    	/*document.getElementById("reloading").style.visibility = "visible";*/
	    }, 1600);
	    setTimeout(function(){
	    	document.getElementById("bulletImg").style.visibility = "visible";
	    	/*document.getElementById("reloading").style.visibility = "hidden";*/
	    }, 2000);
	}
	shot() {
		if(this.MANAGER.gameEnable==false) return;
		
		if(this.shotTime<=0) {
			this.createBulletFromPlayer();
			this.setAmmo()
			if(this.currAmmo<=0)
				this.reload();
			else{
				this.shotTime = this.timeBetweenAmmo;
			}
			var shotAudio = new Audio(this.character.getActualGun().audio.shot);
			shotAudio.volume = this.MANAGER.getEffectVolume()*this.character.getActualGun().audio.shotVolumeFactor;
			shotAudio.play();
		}
	}
	setAmmo(quantity=null) {
		if(quantity!=null)
			this.currAmmo = quantity;
		else
			this.currAmmo--;
		this.currentGun.curAmmo = this.currAmmo;
		this.scoreManager.setCurrAmmo(this.currAmmo);
	}
	
	setUpGun() {
		this.currentGun = this.character.getActualGun();
		this.timeReload = this.currentGun.timeReloading*500;
		this.ammo = this.currentGun.ammo;
		this.timeBetweenAmmo = this.currentGun.timeBetweenAmmo*350;
		this.currAmmo = this.currentGun.curAmmo;
		this.scoreManager.setUpGun({name: this.currentGun.name, ammo: this.ammo, currAmmo: this.currAmmo});
	}
	
	changeGun() {
		this.character.changeGun();
		this.setUpGun();
		if(this.currAmmo<=0) {
			this.reload();
		}
		else {
			this.isReloading = false;
			this.shotTime = this.timeBetweenAmmo;
		}
	}
	
	updateReloading(time) {
		if(this.shotTime>0)
			this.shotTime -= time;
		if(this.shotTime<1500 && this.isReloading && !this.audioReloading) {
			this.character.getActualGun().audio.reload.play();
			this.audioReloading = true;
		}
		if(this.shotTime<=0 && this.isReloading)
			this.reloadComplete();	
	}

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    update(time) {
        if ( this.MANAGER.gameEnable === false ) return;
		
		this.updateReloading(time);
		
		this.yawObject.rotation.y = this.input.rotationY;
		this.pitchObject.rotation.x = this.input.rotationX;
		this.camera1RotationObject.rotation.x = this.input.rotationX;
		this.character.rightArm.rotation.x = this.input.rotationX+PI_2

        time *= 0.1;

        this.inputVelocity.set(0,0,0);
        if (this.input.keys.forward){
            this.inputVelocity.z = -this.MANAGER.getVelocityFactor() * time * this.shiftFactor;
        }
        if (this.input.keys.backward){
            this.inputVelocity.z = this.MANAGER.getVelocityFactor() * time * this.shiftFactor;
        }
        if (this.input.keys.left){
            this.inputVelocity.x = -this.MANAGER.getVelocityFactor() * time * this.shiftFactor;
        }
        if (this.input.keys.right){
            this.inputVelocity.x = this.MANAGER.getVelocityFactor() * time * this.shiftFactor;
        }
		if (this.input.keys.space && this.canJump){
			this.velocity.y = this.jumpVelocity;
			this.canJump = false;
			this.input.keys.space = false;
		}
		if (this.input.keys.shift && !this.shiftHelded){
			//this.MANAGER.multiplyVelocityFactor();
			this.shiftFactor = 2;
			this.shiftHelded = true;
		}
		if (this.shiftHelded && !this.input.keys.shift){
			//this.MANAGER.resetVelocityFactor();
			this.shiftFactor = 1;
			this.shiftHelded = false;
		}
		if (this.input.keys.tab && !this.tabHelded){
			this.changeGun();
			this.tabHelded = true;
		}
		if (this.tabHelded && !this.input.keys.tab){
			this.tabHelded = false;
		}
		if(!this.isMoving && !this.inputVelocity.equals(new THREE.Vector3())){
			this.character.startMove();
			this.isMoving = true;
		}
		else if(this.isMoving && this.inputVelocity.equals(new THREE.Vector3())){
			this.character.stopMove();
			this.isMoving = false;
		}
		if (this.input.keys.r && !this.rHelded){
			if(!this.isReloading) this.reload();
			this.rHelded = true;
		}
		if (this.rHelded && !this.input.keys.r){
			this.rHelded = false;
		}
		if (this.input.keys.t && !this.tHelded){
			this.turnTourch();
			this.tHelded = true;
		}
		if (this.tHelded && !this.input.keys.t){
			this.tHelded = false;
		}
		
        // Convert velocity to world coordinates
        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        //this.quat.multiplyVector3(this.inputVelocity);
		if(!this.isMoving) {		//to avoid too much slippage
			this.velocity.x *= 0.93;
			this.velocity.z *= 0.93;
		}
        // Add to the object
        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;
        this.yawObject.position.copy(this.characterBody.position);
		this.yawObject.position.y -= 0.15;
    };
	
};