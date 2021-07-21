import { InputController } from './InputController.js';

var PI_2 = Math.PI / 2;
		
export class CharacterController {
	constructor(params) {
		this.MANAGER = params.manager;
		this.characterBody = params.body;
		this.character = params.character;
		this.camera = params.camera;
		
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
		this.run = false;
		
		this.characterBody.addEventListener("collide",this.onCollision.bind(this));
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
		this.pitchObject.add(this.camera);
		this.pitchObject.position.set(0.0,1.6,-0.2)
		this.yawObject.add(this.character.getMesh());
		this.yawObject.add(this.pitchObject);
		this.yawObject.position.y = 5;
	}
	
    getObject() {
        return this.yawObject;
    };

    getDirection(targetVec) {
        targetVec.set(0,0,-1);
        this.quat.multiplyVector3(targetVec);
    }
	

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    update(delta) {
        if ( this.MANAGER.gameEnable === false ) return;
		
		this.yawObject.rotation.y = this.input.rotationY;
		this.pitchObject.rotation.x = this.input.rotationX;
		this.character.rightArm.rotation.x = this.input.rotationX+PI_2

        delta *= 0.1;

        this.inputVelocity.set(0,0,0);
        if (this.input.keys.forward){
            this.inputVelocity.z = -this.MANAGER.getVelocityFactor() * delta;
        }
        if (this.input.keys.backward){
            this.inputVelocity.z = this.MANAGER.getVelocityFactor() * delta;
        }
        if (this.input.keys.left){
            this.inputVelocity.x = -this.MANAGER.getVelocityFactor() * delta;
        }
        if (this.input.keys.right){
            this.inputVelocity.x = this.MANAGER.getVelocityFactor() * delta;
        }
		if (this.input.keys.space && this.canJump){
			this.velocity.y = this.jumpVelocity;
			this.canJump = false;
			this.input.keys.space = false;
		}
		if (this.input.keys.shift && !this.run){
			this.MANAGER.multiplyVelocityFactor();
			this.character.changeGun();
			this.run = true;
		}
		if (this.run && !this.input.keys.shift){
			this.MANAGER.resetVelocityFactor();
			this.run = false;
		}
		if(!this.isMoving && !this.inputVelocity.equals(new THREE.Vector3())){
			this.character.startMove();
			this.isMoving = true;
		}
		else if(this.isMoving && this.inputVelocity.equals(new THREE.Vector3())){
			this.character.stopMove();
			this.isMoving = false;
		} 
		
        // Convert velocity to world coordinates
        this.euler.x = this.pitchObject.rotation.x;
        this.euler.y = this.yawObject.rotation.y;
        this.euler.order = "XYZ";
        this.quat.setFromEuler(this.euler);
        this.inputVelocity.applyQuaternion(this.quat);
        //this.quat.multiplyVector3(this.inputVelocity);

        // Add to the object
        this.velocity.x += this.inputVelocity.x;
        this.velocity.z += this.inputVelocity.z;

        this.yawObject.position.copy(this.characterBody.position);
    };
};