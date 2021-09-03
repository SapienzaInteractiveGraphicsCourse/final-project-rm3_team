export class BossFactory {
	constructor(params){
		this.MANAGER = params.manager;
		this.buildBoss();
		console.log(this.boss)
		this.boss.position.set(...params.position);
	}
	
	buildBoss(){
		this.headMesh = this.generateBoxMesh(0.8, 0.8, 0.8, 0, 0, -0.6);
		this.headMesh.name = "skull";
		
		this.neckMesh = this.generateBoxMesh(0.6, 0.6, 0.4, 0, 0, 0);
		this.neckMesh.name = "neck";
		
		this.bottomMesh = this.generateBoxMesh(1.2, 1, 1.6, 0, 0, 1);
		this.bottomMesh.name = "bottom";
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body";
		this.bodyGroup.add(this.headMesh, this.neckMesh, this.bottomMesh);
		
		this.leftLeg1 = new THREE.Object3D;
		this.leftLeg1.name = "Left Leg 1"
		this.leftUpperLegMesh = this.generateBoxMesh(1, 0.25, 0.25, 0.45, 0, 0);
		this.leftLeg1.add(this.leftUpperLegMesh)
		this.leftLeg1.rotateZ(Math.PI/12)
		
		this.leftLowerLeg = new THREE.Object3D;
		this.leftLowerLeg.position.x = 0.9
		this.leftLowerLeg.name = "Lower Leg"
		this.leftLowerLegMesh = this.generateBoxMesh(1, 0.23, 0.23, 0.45, 0, 0);
		this.leftLowerLeg.add(this.leftLowerLegMesh)
		this.leftLowerLeg.rotateZ(-Math.PI/3)
		
		this.leftLeg1.add(this.leftLowerLeg)
		this.leftLeg1.position.x = 0.25
		this.leftLeg1.position.z = -0.65
		
		this.leftLeg2 = this.leftLeg1.clone()
		this.leftLeg2.name = "Left Leg 2"
		this.leftLeg2.position.z = -0.15
		
		this.leftLeg3 = this.leftLeg1.clone()
		this.leftLeg3.name = "Left Leg 3"
		this.leftLeg3.position.z = 0.25
		
		this.leftLeg4 = this.leftLeg1.clone()
		this.leftLeg4.name = "Left Leg 4"
		this.leftLeg4.position.z = 0.65
		
		this.leftLeg1.rotateY(Math.PI/6)
		this.leftLeg4.rotateY(-Math.PI/6)
		this.leftLeg2.rotateY(Math.PI/12)
		this.leftLeg3.rotateY(-Math.PI/12)
		
		this.leftLegs = new THREE.Group();
		this.leftLegs.name = "left legs";
		this.leftLegs.add(this.leftLeg1, this.leftLeg2, this.leftLeg3, this.leftLeg4)
		this.leftLegs.position.z = 0.65
		
		this.rightLegs = this.leftLegs.clone()
		this.rightLegs.rotateY(Math.PI)
		
		//Boss group
		this.boss = new THREE.Group();
		this.boss.name = "boss";
		this.boss.add(this.bodyGroup, this.leftLegs, this.rightLegs);
		
	}
	
	generateBoxMesh(width, height, depth, x, y, z, texturePart=null) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		if(this.texture == null || texturePart == null){
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			var boxMaterial = new THREE.MeshPhongMaterial( { color: randomColor } );
		}
		else {
			var boxMaterial = this.texture[texturePart];
		}
		var mesh = new THREE.Mesh(boxGeometry, boxMaterial);
		mesh.castShadow = true;
		mesh.position.set(x,y,z);
		return mesh;
	}
	
	getBoss() {
		return this.boss;
	}
}