class gameManager {
	constructor(){
		
		this.gameStarted = false;
		
		this.gameEnable = false;
		
		this.options = {
			mouseSensibility : 0.002,
			velocityFactorDefault : 0.2,
		}
		
		this.velocityFactor = this.options.velocityFactorDefault;
	}
	
	getMouseSensibility() {
		return this.options.mouseSensibility;
	}
	
	getVelocityFactor() {
		return this.velocityFactor;
	}
	
	resetVelocityFactor() {
		this.velocityFactor = this.options.velocityFactorDefault;
	}
	
	multiplyVelocityFactor(val = 2) {
		this.velocityFactor = this.options.velocityFactorDefault*val;
	}
	
	
	startGame() {
		this.gameStarted = true;
		APP = new gameEnvironment();
	}
}



class MenuEnvironment {
	constructor() {
		this.game = document.getElementById("game");
		
		this.playGameButton = document.getElementById("playGameButton");
		
		this.setUpButtons();
	}
	
	setUpButtons() {
		this.game.style.display = "none";
		this.playGameButton.addEventListener("click", () => {
			this.game.style.display = "block"
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.startGame();
        }, false);
	}
}

class gameEnvironment {
	constructor() {
		this.load();
		this.models = {};
	}
	
	load() {
		var promise = [
            this.getModel('Pistola/scene.gltf', 5.0),
		];
		Promise.all(promise).then(data => {
            var nameModels = [
                "Pistola",
            ];

			for(let i in nameModels){
                this.models[nameModels[i]] = {};
                this.models[nameModels[i]].model = data[i];
                this.models[nameModels[i]].name = nameModels[i];
            }
			
			setTimeout(this.init(), 3000);
		}, error => {
            console.log('An error happened:', error);
        });
	}
	
	getModel(path, scale=1.0) {
        const myPromise = new Promise((resolve, reject) => {
            const gltfLoader = new THREE.GLTFLoader();
            gltfLoader.load('resources/models/' + path, (gltf) => {
                var mesh = gltf.scene.children[0];
                if (mesh == null)
                    mesh = gltf.scene;

                mesh.traverse(c => {		//Questo non so che faccia
                    c.castShadow = true;
                });

                mesh.scale.setScalar(scale);

                resolve(mesh);
            },
                function (xhr) {
                },
                function (error) {
                    console.log('An error happened');
                    reject(error);
                });
        });
        return myPromise;
    }
	
	
	changeVisual() {
		this.activeCamera = (this.activeCamera+1)%2;
	}
	
	onWindowResize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera2.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.camera2.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	/*DA QUI è WORK IN PROGRESS FINO ALLA LINEA ---------------*/
	locker() {
		document.getElementById("loading").style.display = "none";
		
		var blocker = document.getElementById( 'blocker' );
		var pauseCanvas = document.getElementById( 'PauseCanvas' );
		var resumeButton = document.getElementById( 'resumeButton' );

		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {

			var element = document.body;

			var pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					MANAGER.gameEnable = true;

					blocker.style.display = 'none';
					pauseCanvas.style.display = 'none';

				} else {
					MANAGER.gameEnable = false;

					pauseCanvas.style.display = '-webkit-flex';
					pauseCanvas.style.display = '-moz-flex';
					pauseCanvas.style.display = 'flex';

				}

			}

			var pointerlockerror = function ( event ) {
				pauseCanvas.style.display = '-webkit-flex';
				pauseCanvas.style.display = '-moz-flex';
				pauseCanvas.style.display = 'flex';
			}

			// Hook pointer lock state change events
			document.addEventListener( 'pointerlockchange', pointerlockchange, false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange, false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange, false );

			document.addEventListener( 'pointerlockerror', pointerlockerror, false );
			document.addEventListener( 'mozpointerlockerror', pointerlockerror, false );
			document.addEventListener( 'webkitpointerlockerror', pointerlockerror, false );

				instructions.style.display = 'none';

				// Ask the browser to lock the pointer
				element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;

				if ( /Firefox/i.test( navigator.userAgent ) ) {

					var fullscreenchange = function ( event ) {

						if ( document.fullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element ) {

							document.removeEventListener( 'fullscreenchange', fullscreenchange );
							document.removeEventListener( 'mozfullscreenchange', fullscreenchange );

							element.requestPointerLock();
						}

					}

					document.addEventListener( 'fullscreenchange', fullscreenchange, false );
					document.addEventListener( 'mozfullscreenchange', fullscreenchange, false );

					element.requestFullscreen = element.requestFullscreen || element.mozRequestFullscreen || element.mozRequestFullScreen || element.webkitRequestFullscreen;

					element.requestFullscreen();

				} else {

					element.requestPointerLock();

				}
				
		} else {

			instructions.innerHTML = 'Your browser doesn\'t seem to support Pointer Lock API';

		}
		
		resumeButton.addEventListener('click', () => {
            element.requestPointerLock();
        }, false)
	}
	
	getShootDir(targetVec){
		var vector = targetVec;
		targetVec.set(0,0,1);
		vector.unproject(this.camera);
		var ray = new THREE.Ray(this.sphereBody.position, vector.sub(this.sphereBody.position).normalize() );
		targetVec.copy(ray.direction);
	}
	
	createNewBullet() {
		if(MANAGER.gameEnable==false) return;
		var x = this.sphereBody.position.x;
		var y = this.sphereBody.position.y+1.8;
		var z = this.sphereBody.position.z;
		var ballBody = new CANNON.Body({ mass: 0.1 });
		ballBody.addShape(this.ballShape);
		var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
		let material2 = new THREE.MeshPhongMaterial( { color: randomColor } );
		var ballMesh = new THREE.Mesh( this.ballGeometry, material2 );
		this.world.add(ballBody);
		this.scene.add(ballMesh);
		ballMesh.castShadow = true;
		ballMesh.receiveShadow = true;
		this.balls.push(ballBody);
		this.ballMeshes.push(ballMesh);
		this.getShootDir(this.shootDirection);
		ballBody.velocity.set(  this.shootDirection.x * this.shootVelo,
								this.shootDirection.y * this.shootVelo,
								this.shootDirection.z * this.shootVelo);

		// Move the ball outside the player sphere
		x += this.shootDirection.x * (this.sphereShape.radius*1.02 + this.ballShape.radius);
		y += this.shootDirection.y * (this.sphereShape.radius*1.02 + this.ballShape.radius);
		z += this.shootDirection.z * (this.sphereShape.radius*1.02 + this.ballShape.radius);
		ballBody.position.set(x,y,z);
		ballMesh.position.set(x,y,z);
	}
	
	shotManager() {
		this.ballShape = new CANNON.Sphere(0.2);
		this.ballGeometry = new THREE.SphereGeometry(this.ballShape.radius, 32, 32);
		this.shootDirection = new THREE.Vector3();
		this.shootVelo = 50;

		window.addEventListener("click",this.createNewBullet.bind(this));
	}
	
	
	update() {
		var dt = 1/60;
		this.world.step(dt);

		// Update ball positions
		for(var i=0; i<this.balls.length; i++){
			this.ballMeshes[i].position.copy(this.balls[i].position);
			this.ballMeshes[i].quaternion.copy(this.balls[i].quaternion);
		}

		// Update box positions
		for(var i=0; i<this.boxes.length; i++){
			this.boxMeshes[i].position.copy(this.boxes[i].position);
			this.boxMeshes[i].quaternion.copy(this.boxes[i].quaternion);
		}
		TWEEN.update()
	}

	//Draw Scene
	render() {
		this.controls.update( Date.now() - this.time );
		if(this.activeCamera==0)
			this.renderer.render( this.scene, this.camera );
		else
			this.renderer.render( this.scene, this.camera2 );
		this.time = Date.now();
	}

	//Run game loop (update, render, repet)
	GameLoop() {
		requestAnimationFrame(this.GameLoop.bind(this));
		if(MANAGER.gameEnable){
			this.update();
		}
			this.render();
	}
//---------------------------------------------------------------------
	
	init() {
		this.world = this.initCannon();
			
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
		
		this.camera2 = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 );
		this.camera2.translateY(3)
		
		this.activeCamera = 0;

		this.scene = new THREE.Scene();
		this.scene.fog = new THREE.Fog( 0x000000, 0, 500 );

		var ambient = new THREE.AmbientLight( 0x111111 );
		this.scene.add( ambient );

		this.light = new THREE.SpotLight( 0xffffff );
		this.light.position.set( 10, 30, 20 );
		this.light.target.position.set( 0, 0, 0 );
		if(true){
			this.light.castShadow = true;

			this.light.shadow.camera.near = 20;
			this.light.shadow.camera.far = 50;//camera.far;
			this.light.shadow.camera.fov = 40;

			this.light.shadowMapBias = 0.1;
			this.light.shadowMapDarkness = 0.7;
			this.light.shadow.mapSize.width = 2*512;
			this.light.shadow.mapSize.height = 2*512;

			//light.shadowCameraVisible = true;
		}
		this.scene.add( this.light );
		
		this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById( 'canvas' ), antialias: true});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		//this.renderer.setClearColor( this.scene.fog.color, 1 );
		this.renderer.setClearColor( 0xffffff, 0);

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );


		

		// floor
		var geometry = new THREE.PlaneGeometry( 300, 300, 50, 50 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		var material = new THREE.MeshLambertMaterial( { color: 0xeeee00 } );

		var mesh = new THREE.Mesh( geometry, material );
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		this.scene.add( mesh );
		
		

		this.boxes = [];
		this.boxMeshes = [];
		this.balls = [];
		this.ballMeshes=[];
		
		// Add boxes
		var halfExtents = new CANNON.Vec3(1,1,1);
		var boxShape = new CANNON.Box(halfExtents);
		var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
		for(var i=0; i<7; i++){
			var x = (Math.random()-0.5)*20;
			var y = 1 + (Math.random()-0.5)*1;
			var z = (Math.random()-0.5)*20;
			var boxBody = new CANNON.Body({ mass: 5 });
			boxBody.addShape(boxShape);
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			var material2 = new THREE.MeshLambertMaterial( { color: randomColor } );
			var boxMesh = new THREE.Mesh( boxGeometry, material2 );
			this.world.add(boxBody);
			this.scene.add(boxMesh);
			boxBody.position.set(x,y,z);
			boxMesh.position.set(x,y,z);
			boxMesh.castShadow = true;
			boxMesh.receiveShadow = true;
			this.boxes.push(boxBody);
			this.boxMeshes.push(boxMesh);
		}
		
		//Add personaggio
		this.person = new characterClass();
		
		this.controls = new PointerLockControls(this.sphereBody, this.person, this.camera);
		
		this.scene.add( this.controls.getObject() );


		// Add linked boxes
		var size = 0.5;
		var he = new CANNON.Vec3(size,size,size*0.1);
		var boxShape = new CANNON.Box(he);
		var mass = 0;
		var space = 0.1 * size;
		var N = 5, last;
		var boxGeometry = new THREE.BoxGeometry(he.x*2,he.y*2,he.z*2);
		for(var i=0; i<N; i++){
			var boxbody = new CANNON.Body({ mass: mass });
			var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
			material2 = new THREE.MeshBasicMaterial( { color: randomColor } );
			//console.log (randomColor);
			boxbody.addShape(boxShape);
			var boxMesh = new THREE.Mesh(boxGeometry, material2);
			boxbody.position.set(5,(N-i)*(size*2+2*space) + size*2+space,0);
			boxbody.linearDamping = 0.01;
			boxbody.angularDamping = 0.01;
			// boxMesh.castShadow = true;
			boxMesh.receiveShadow = true;
			this.world.add(boxbody);
			this.scene.add(boxMesh);
			this.boxes.push(boxbody);
			this.boxMeshes.push(boxMesh);

			if(i!=0){
				// Connect this body to the last one
				var c1 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(-size,size+space,0),last,new CANNON.Vec3(-size,-size-space,0));
				var c2 = new CANNON.PointToPointConstraint(boxbody,new CANNON.Vec3(size,size+space,0),last,new CANNON.Vec3(size,-size-space,0));
				this.world.addConstraint(c1);
				this.world.addConstraint(c2);
			} else {
				mass=0.3;
			}
			last = boxbody;
		}
		this.locker();
		this.time = Date.now();
		this.GameLoop();
		this.shotManager();
	}
	
	initCannon() {
		var world = new CANNON.World();
		world.quatNormalizeSkip = 0;
		world.quatNormalizeFast = false;

		var solver = new CANNON.GSSolver();

		world.defaultContactMaterial.contactEquationStiffness = 1e9;
		world.defaultContactMaterial.contactEquationRelaxation = 4;

		solver.iterations = 7;
		solver.tolerance = 0.1;
		var split = true;
		if(split)
			world.solver = new CANNON.SplitSolver(solver);
		else
			world.solver = solver;

		world.gravity.set(0,-20,0);
		world.broadphase = new CANNON.NaiveBroadphase();

		// Create a slippery material (friction coefficient = 0.0)
		var physicsMaterial = new CANNON.Material();
		var physicsContactMaterial = new CANNON.ContactMaterial(physicsMaterial,
																physicsMaterial,
																0.0, // friction coefficient
																0.3  // restitution
																);
		// Create other non slippery Material
		var groundMaterial = new CANNON.Material();
		groundMaterial.friction = 200.0;
		
		// We must add the contact materials to the world
		world.addContactMaterial(physicsContactMaterial);

		// Create a sphere
		var mass = 50, radius = 1;
		this.sphereShape = new CANNON.Sphere(radius);
		this.sphereBody = new CANNON.Body({ mass: mass });
		this.sphereShape.material = groundMaterial;
		this.sphereBody.addShape(this.sphereShape);
		this.sphereBody.position.set(0,5,0);
		this.sphereBody.linearDamping = 0.9;
		world.add(this.sphereBody);

		// Create a plane
		var groundShape = new CANNON.Plane();
		var groundBody = new CANNON.Body({ mass: 0 });
		groundShape.material = groundMaterial;
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		world.add(groundBody);
		return world
	}



	setUpButtons() {
		 this.playGameButton.addEventListener("click", () => {
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.StartGame();
        }, false);
	}
}

class characterClass {
	constructor(){
		//Generate character
		this.headMesh = this.generateBoxMesh(0.6,0.6,0.6, 0, 0, 0);
		this.headMesh.name = "skull"
		this.leftEyeMesh = this.sphereMesh(0.03, -0.12, 0.15, -0.3);
		this.leftEyeMesh.name = "Left Eye"
		this.rightEyeMesh = this.sphereMesh(0.03, 0.12, 0.15, -0.3);
		this.rightEyeMesh.name = "Right Eye"
		
		this.headGroup = new THREE.Group();
		this.headGroup.name = "head"
		this.headGroup.add(this.headMesh, this.leftEyeMesh, this.rightEyeMesh);
		
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
		
		//Add pistola
		APP.models["Pistola"].model.position.set(0.0,-1.05,0.0);
		APP.models["Pistola"].model.rotation.x = -Math.PI;
		this.rightArm.add(APP.models["Pistola"].model);
		
		this.armGroup = new THREE.Group();
		this.armGroup.name = "arm"
		this.armGroup.add(this.leftArm, this.rightArm);
		
		
		
		
		this.bodyGroup = new THREE.Group();
		this.bodyGroup.name = "body"
		this.bodyGroup.add(this.bodyMesh, this.legGroup, this.armGroup);
		
		// People Group
		this.character = new THREE.Group();
		this.character.name = "robot";
		this.character.add(this.headGroup, this.bodyGroup);
		this.character.position.set(0.0,2.0,0.3)
		
		//Generate Animations
		this.legTween1 = new TWEEN.Tween({x: 0, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 50/MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween2 = new TWEEN.Tween({x: Math.PI/6, y: 0, z: 0}).to( {x:-Math.PI/6, y: 0, z: 0}, 100/MANAGER.getVelocityFactor() )
			.easing(TWEEN.Easing.Quadratic.InOut)
		this.legTween3 = new TWEEN.Tween({x:-Math.PI/6, y: 0, z: 0}).to( {x: Math.PI/6, y: 0, z: 0}, 100/MANAGER.getVelocityFactor() )
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
	
	
	getCharachter() {
		return this.character;
	}
	
	changeRotation(rotX) {
		this.leftArm.rotation.x = rotX;
	}
	
	startMove() {
		this.legTween1.start();
	}
	
	stopMove() {
		this.legTween1.stop();
		const legTween4 = new TWEEN.Tween(this.leftLeg.rotation.clone()).to({x: 0, y: 0, z: 0}, 50/MANAGER.getVelocityFactor());
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

var PointerLockControls = function (cannonBody, person, camera) {
	
	
    var eyeYPos = 2; // eyes are 2 meters above the ground
    var jumpVelocity = 20;
    var scope = this;

	var yawObject = new THREE.Object3D();
	var pitchObject = new THREE.Object3D();	
	
	pitchObject.add(camera);
	
	pitchObject.position.set(0.0,2.0,0.0)
	yawObject.add(person.getCharachter());
	yawObject.add(pitchObject);
	yawObject.position.y = 200;

    var quat = new THREE.Quaternion();
	
	var isMoving = false;
    var moveForward = false;
    var moveBackward = false;
    var moveLeft = false;
    var moveRight = false;

    var canJump = false;

    var contactNormal = new CANNON.Vec3(); // Normal in the contact, pointing *out* of whatever the player touched
    var upAxis = new CANNON.Vec3(0,1,0);
    cannonBody.addEventListener("collide",function(e){
        var contact = e.contact;

        // contact.bi and contact.bj are the colliding bodies, and contact.ni is the collision normal.
        // We do not yet know which one is which! Let's check.
        if(contact.bi.id == cannonBody.id)  // bi is the player body, flip the contact normal
            contact.ni.negate(contactNormal);
        else
            contactNormal.copy(contact.ni); // bi is something else. Keep the normal as it is

        // If contactNormal.dot(upAxis) is between 0 and 1, we know that the contact normal is somewhat in the up direction.
        if(contactNormal.dot(upAxis) > 0.5) // Use a "good" threshold value between 0 and 1 here!
            canJump = true;
    });

    var velocity = cannonBody.velocity;

    var PI_2 = Math.PI / 2;

    var onMouseMove = function ( event ) {

        if ( MANAGER.gameEnable === false ) return;

        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;

        yawObject.rotation.y -= movementX * MANAGER.getMouseSensibility();
        pitchObject.rotation.x -= movementY * MANAGER.getMouseSensibility();
		
        pitchObject.rotation.x = Math.max( - PI_2, Math.min( PI_2, pitchObject.rotation.x ) );
		person.rightArm.rotation.x = pitchObject.rotation.x+PI_2;
    };

    var onKeyDown = function ( event ) {

        switch ( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = true;
                break;

            case 37: // left
            case 65: // a
                moveLeft = true; break;

            case 40: // down
            case 83: // s
                moveBackward = true;
                break;

            case 39: // right
            case 68: // d
                moveRight = true;
                break;

            case 32: // space
                if ( canJump === true ){
                    velocity.y = jumpVelocity;
                }
                canJump = false;
                break;
			
			case 16: //shift
				MANAGER.multiplyVelocityFactor();
				break;
			
			case 86: //v
				APP.changeVisual();
				break;
        }

    };

    var onKeyUp = function ( event ) {

        switch( event.keyCode ) {

            case 38: // up
            case 87: // w
                moveForward = false;
                break;

            case 37: // left
            case 65: // a
                moveLeft = false;
                break;

            case 40: // down
            case 83: // a
                moveBackward = false;
                break;

            case 39: // right
            case 68: // d
                moveRight = false;
                break;
			
			case 16: //shift
				MANAGER.resetVelocityFactor();
				break;
			
        }

    };

    document.addEventListener( 'mousemove', onMouseMove, false );
    document.addEventListener( 'keydown', onKeyDown, false );
    document.addEventListener( 'keyup', onKeyUp, false );

    this.enabled = false;

    this.getObject = function () {
        return yawObject;
    };

    this.getDirection = function(targetVec){
        targetVec.set(0,0,-1);
        quat.multiplyVector3(targetVec);
    }

    // Moves the camera to the Cannon.js object position and adds velocity to the object if the run key is down
    var inputVelocity = new THREE.Vector3();
    var euler = new THREE.Euler();
    this.update = function ( delta ) {

        if ( MANAGER.gameEnable === false ) return;

        delta *= 0.1;

        inputVelocity.set(0,0,0);
        if ( moveForward ){
            inputVelocity.z = -MANAGER.getVelocityFactor() * delta;
        }
        if ( moveBackward ){
            inputVelocity.z = MANAGER.getVelocityFactor() * delta;
        }

        if ( moveLeft ){
            inputVelocity.x = -MANAGER.getVelocityFactor() * delta;
        }
        if ( moveRight ){
            inputVelocity.x = MANAGER.getVelocityFactor() * delta;
        }
		if(!isMoving && !inputVelocity.equals(new THREE.Vector3())){
			person.startMove();
			isMoving = true;
		}
		else if(isMoving && inputVelocity.equals(new THREE.Vector3())){
			person.stopMove();
			isMoving = false;
		} 
		
        // Convert velocity to world coordinates
        euler.x = pitchObject.rotation.x;
        euler.y = yawObject.rotation.y;
        euler.order = "XYZ";
        quat.setFromEuler(euler);
        inputVelocity.applyQuaternion(quat);
        //quat.multiplyVector3(inputVelocity);

        // Add to the object
        velocity.x += inputVelocity.x;
        velocity.z += inputVelocity.z;

        yawObject.position.copy(cannonBody.position);
    };
};

APP = null;
var MANAGER = new gameManager();

window.addEventListener('DOMContentLoaded', () => {
    APP = new MenuEnvironment();
});
