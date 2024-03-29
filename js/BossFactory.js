export class BossFactory {
	constructor(params){
		this.MANAGER = params.manager;
		this.texture = params.texture;
		this.buildBoss();
		this.boss.position.set(...params.position);
		this.initializeAnimation();
		this.initializeAudio();
		this.deathAnimation();
		this.boss.scale.set(5,5,5);
	}
	
	buildBoss(){
		this.headMesh = this.generateBoxMesh(0.8, 0.8, 0.8, 0, 0, -0.6, 'head');
		this.headMesh.name = "skull";
		
		this.neckMesh = this.generateBoxMesh(0.6, 0.6, 0.4, 0, 0, 0, 'body');
		this.neckMesh.name = "neck";
		
		this.bottomMesh = this.generateBoxMesh(1.2, 1, 1.6, 0, 0, 1, 'body');
		this.bottomMesh.name = "bottom";
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body";
		this.bodyGroup.add(this.headMesh, this.neckMesh, this.bottomMesh);
		
		this.leftLeg1 = new THREE.Object3D;
		this.leftLeg1.name = "Leg 1"
		this.leftUpperLegMesh = this.generateBoxMesh(1, 0.25, 0.25, 0.45, 0, 0, 'body');
		this.leftLeg1.add(this.leftUpperLegMesh)
		this.leftLeg1.rotateZ(Math.PI/12)
		
		this.leftLowerLeg = new THREE.Object3D;
		this.leftLowerLeg.position.x = 0.9
		this.leftLowerLeg.name = "Lower Leg"
		this.leftLowerLegMesh = this.generateBoxMesh(1, 0.23, 0.23, 0.45, 0, 0, 'body');
		this.leftLowerLeg.add(this.leftLowerLegMesh)
		this.leftLowerLeg.rotateZ(-Math.PI/3)
		
		this.leftLeg1.add(this.leftLowerLeg)
		this.leftLeg1.position.x = 0.25
		this.leftLeg1.position.z = -0.65
		
		this.leftLeg2 = this.leftLeg1.clone()
		this.leftLeg2.name = "Leg 2"
		this.leftLeg2.position.z = -0.15
		
		this.leftLeg3 = this.leftLeg1.clone()
		this.leftLeg3.name = "Leg 3"
		this.leftLeg3.position.z = 0.25
		
		this.leftLeg4 = this.leftLeg1.clone()
		this.leftLeg4.name = "Leg 4"
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
		this.rightLegs.name = "right legs";
		this.rightLegs.rotateY(Math.PI)
		
		this.legs = new THREE.Group();
		this.legs.name = "legs";
		this.legs.add(this.leftLegs, this.rightLegs)
		
		//Boss group
		this.boss = new THREE.Group();
		this.boss.name = "boss";
		this.boss.add(this.bodyGroup, this.legs);
		
	}
	
	generateBoxMesh(width, height, depth, x, y, z, texturePart=null) {
		var boxGeometry = new THREE.BoxGeometry(width, height, depth);
		if(this.texture == null ||  texturePart == null){
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
	
	deathAnimation() {
		this.deathTween = new TWEEN.Tween({upz: Math.PI/12, lowz: -Math.PI/3, posY: this.boss.position.y-17}).to({upz: -Math.PI/18, lowz: -Math.PI/18, posY: 2.5}, 300/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.deathTween2 = new TWEEN.Tween({upz: -Math.PI/18, lowz: -Math.PI/18, posY: 2.5}).to({upz: -Math.PI/18, lowz: -Math.PI/18, posY: -10}, 1000/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut).delay(1)
			
		this.deathTween.chain(this.deathTween2)	
		this.updateDeath = function(object){
			for(var i in this.legs.children){
				for (var j in this.legs.children[i].children){
					
				var leg = this.legs.children[i].children[j];
				var lowerLeg = leg.children[1];
				
				leg.rotation.z = object.upz;
				lowerLeg.rotation.z = object.lowz;
				this.boss.position.y = object.posY;
				}
			}
		}
		this.deathTween.onUpdate(this.updateDeath.bind(this))
		this.deathTween2.onUpdate(this.updateDeath.bind(this))
	}
	
	startDeathAnimation() {
		this.deathTween.start();
	}
	
	initializeAnimation() {
		//Generate Animations
		this.legTween1 = new TWEEN.Tween({upz: Math.PI/12, lowz: -Math.PI/3, roty: Math.PI/6}).to({upz: Math.PI/9, lowz: -Math.PI/2, roty: Math.PI/4.5}, 60/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({upz: Math.PI/9, lowz: -Math.PI/2, roty: Math.PI/4.5}).to({upz: Math.PI/18, lowz: -Math.PI/6, roty: Math.PI/12}, 120/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({upz: Math.PI/18, lowz: -Math.PI/6, roty: Math.PI/12}).to( {upz: Math.PI/9, lowz: -Math.PI/2, roty: Math.PI/4.5}, 120/this.MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween1.chain(this.legTween2)
		this.legTween2.chain(this.legTween3)
		this.legTween3.chain(this.legTween2)
		
		this.updateLeg1 = function(object){
			for(var i in this.legs.children){
				for (var j in this.legs.children[i].children){
					
					var leg = this.legs.children[i].children[j];
					var lowerLeg = leg.children[1];
					
					if(j == 0){
						if(i==0) {
							leg.rotation.y = object.roty;
						}
						if(i==1) {
							leg.rotation.y = Math.PI/3 - object.roty;
						}
					}
					if(j == 3){
						if(i==0) {
							leg.rotation.y = -object.roty;
						}
						if(i==1) {
							leg.rotation.y = -Math.PI/3 + object.roty;
						}
					}
					if(j == 1) {
						if(i==0) leg.rotation.y = Math.PI/6 - object.roty/2;
						if(i==1) leg.rotation.y = object.roty/2;
					}
					if(j == 2) {
						if(i==0) leg.rotation.y = -(Math.PI/6 - object.roty/2);
						if(i==1) leg.rotation.y = -object.roty/2
					}
					
				}
			}

		}
		this.legTween1.onUpdate(this.updateLeg1.bind(this))
		this.legTween2.onUpdate(this.updateLeg1.bind(this))
		this.legTween3.onUpdate(this.updateLeg1.bind(this))		
	}

	initializeAudio() {
		this.spiderMusic_audio = new Audio(".\\resources\\audio\\spider_music.mp3");
		this.spiderDeathScream_audio = new Audio(".\\resources\\audio\\spider_deathScream.mp3");
		this.spiderMusic_audio.volume = 1*this.MANAGER.getEffectVolume();
		this.spiderDeathScream_audio.volume = 1*this.MANAGER.getEffectVolume();
	}
	
	startMove() {
		this.legTween1.start();
		this.spiderMusic_audio.play();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween({upz: this.leftLeg1.rotation.z, lowz: this.leftLowerLeg.rotation.z, roty: this.leftLeg1.rotation.y}).to({upz: Math.PI/12, lowz: -Math.PI/3, roty: Math.PI/6}, 60/this.MANAGER.getVelocityFactor());
		legTween4.onUpdate(this.updateLeg1.bind(this));
		legTween4.start();
	}
	
	getBoss() {
		return this.boss;
	}
}