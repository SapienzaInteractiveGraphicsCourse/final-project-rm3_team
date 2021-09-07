import {CharacterController} from './js/Controllers/CharacterController.js';
import {CharacterFactory} from './js/CharacterFactory.js';
import {EntityManager} from './js/EntityManager.js';
import {BulletManager} from './js/BulletManager.js';
import {ScoreManager} from './js/ScoreManager.js';
import {SceneFactory} from './js/SceneFactory.js';
import {LightFactory} from './js/LightFactory.js';
import {BossFactory} from './js/BossFactory.js';

class gameManager {
	constructor(){
		
		this.gameStarted = false;
		
		this.gameEnable = false;
		
		this.APP = null;
		
		this.dayTimeOptions = {
			dayTime: "",
            lights: "",
            skybox: "",
		};
		
		this.setGameOptionsDefault = function() {
			this.gameOptions = {
				mouseSensibility : 1,
				lifes: 5,
				enemyQuantity: 30,
				time: 180,
				viewfinder: true,
				velocityFactorDefault : 0.2,
			}
		}
		this.setGameOptionsDefault();
		this.setGameSettingsDefault = function() {
			this.gameSettings = {
				useNormalMap: true,
				shadow: true,
				ambientTexture: true,
			}
		}
		this.setGameSettingsDefault();
		this.deletedBody = [];
		
		this.velocityFactor = this.gameOptions.velocityFactorDefault;
	}
	
	getGameOptions() {return this.gameOptions;}
	getMouseSensibility() {return this.gameOptions.mouseSensibility;}
	getEnemyQuantity() {return this.gameOptions.enemyQuantity;}
	getLifes() {return this.gameOptions.lifes;}
	getTime() {return this.gameOptions.time;}
	getViewfinder() {return this.gameOptions.viewfinder;}
	getVelocityFactor() {return this.velocityFactor;}
	getDayTimeOptions() {return this.dayTimeOptions;}
	getDayTime() {return this.dayTimeOptions.dayTime;}
	getLights() {return this.dayTimeOptions.lights;}
	getSkyBox() {return this.dayTimeOptions.skybox;}
	
	getGameSettings() {return this.gameSettings;}
	getNormalMapRule() {return this.gameSettings.useNormalMap;}
	getShadowRule() {return this.gameSettings.shadow;}
	getAmbientTextureRule() {return this.gameSettings.ambientTexture;}
	
	setGameOptions(options) {this.gameOptions = options;}
	setGameSettings(settings) {this.gameSettings = settings;}
	setDayTimeOptions(options) {this.dayTimeOptions = options;}
	
	resetVelocityFactor(){this.velocityFactor = this.gameOptions.velocityFactorDefault;}
	multiplyVelocityFactor(val = 2) {this.velocityFactor = this.gameOptions.velocityFactorDefault*val;}
	
	startGame() {
		this.gameStarted = true;
		this.APP = new gameEnvironment();
	}
	
	endGame(params) {
		this.APP = new gameOverEnvironment(params);
	}
	
}



class MenuEnvironment {
	constructor() {
		this.game = document.getElementById("game");
		
		this.playGameButton = document.getElementById("playGameButton");
		this.settingButton = document.getElementById("settingsButton");
		
		this.setting = document.getElementById("settings");
		this.exitSettings = document.getElementById("exitSettings");
		this.confirmSettings = document.getElementById("confirmSettings");
		this.resetSettings = document.getElementById("resetSettings");
		
		this.difficultyEasy = document.getElementById("easyMode");
		this.difficultyNormal = document.getElementById("normalMode");
		this.difficultyHard = document.getElementById("hardMode");
		
		this.sliderMouseSens = document.getElementById("sliderMouseSens");
		this.sliderLifes = document.getElementById("sliderLifes");
		this.sliderEnemys = document.getElementById("sliderEnemys");
		this.sliderTime = document.getElementById("sliderTime");
		
		this.wiewfinderCkBox = document.getElementById("wiewfinderCkBox");
		
		this.normalMapCkBox = document.getElementById("normalMapCkBox");
		this.shadowCkBox = document.getElementById("shadowCkBox");
		this.ambientTextureCkBox = document.getElementById("ambientTextureCkBox");
		
		this.dayButton = document.getElementById("dayButton");
		this.dayOptions = {
            dayTime: "day",
            lights: LightFactory.DAY_LIGHT,
            skybox: SceneFactory.DAY_SKYBOX3,
        };
        this.sunSetButton = document.getElementById("sunSetButton");
        this.sunSetOptions = {
            dayTime: "sunset",
            lights: LightFactory.SUNSET_LIGHT,
            skybox: SceneFactory.SUNSET_SKYBOX2,
        };
		this.nightButton = document.getElementById("nightButton");
        this.nightOptions = {
            dayTime: "night",
            lights: LightFactory.NIGHT_LIGHT,
            skybox: SceneFactory.GALAXY_SKYBOX,
        };
		this.elemChecked = dayButton;
		
		this.setUpMainButtons();
		this.setUpSettingButton();
		this.giveValueFromCookie();
	}
	
	setUpMainButtons() {
		this.game.style.display = "none";
		this.playGameButton.addEventListener("click", () => {
			this.game.style.display = "block"
            this.game.style.bottom = "0px";
            this.game.style.animation = "1s newPage normal";
            document.activeElement.blur();
            MANAGER.startGame();
        }, false);
		this.setting.style.display = "none";
		this.settingButton.addEventListener("click", () => {
			this.updateAllSlider();
			this.setting.style.display = "block"
            this.setting.style.bottom = "0px";
            this.setting.style.animation = "1s newPage normal";
            document.activeElement.blur();		
        }, false);
	}
	setUpSettingButton() {
		this.exitSettings.addEventListener("click", this.exitSetting.bind(this), false);
		this.confirmSettings.addEventListener("click", () => {
			this.updateAllOptions();
            var currentGameOptions = MANAGER.getGameOptions();
			var curretGameSettings = MANAGER.getGameSettings();
			document.cookie = "dayTime="+MANAGER.getDayTime()+";";
            document.cookie = "gameOptions={mouseSensibility:"+currentGameOptions.mouseSensibility+
				", lifes:"+currentGameOptions.lifes+
                ", enemyQuantity:"+currentGameOptions.enemyQuantity+
                ", time:"+currentGameOptions.time+
				", viewfinder:"+currentGameOptions.viewfinder+"};";
			document.cookie = "gameSettings={useNormalMap:"+curretGameSettings.useNormalMap+
				", shadow:"+curretGameSettings.shadow+
				", ambientTexture:"+curretGameSettings.ambientTexture+"};";
			this.exitSetting();
        }, false);
		this.resetSettings.addEventListener("click", () => {
			MANAGER.setGameOptionsDefault();
			MANAGER.setGameSettingsDefault();
			this.updateAllSlider();
        }, false);
		this.difficultyEasy.addEventListener("click", this.setDifficulty.bind(this, 0), false);
		this.difficultyNormal.addEventListener("click", this.setDifficulty.bind(this, 1), false);
		this.difficultyHard.addEventListener("click", this.setDifficulty.bind(this, 2), false);
		
        this.dayButton.addEventListener('change', this.selectElementDayTime.bind(this, this.dayButton, this.dayOptions), false);
        this.nightButton.addEventListener('change', this.selectElementDayTime.bind(this, this.nightButton, this.nightOptions), false);
        this.sunSetButton.addEventListener('change', this.selectElementDayTime.bind(this, this.sunSetButton, this.sunSetOptions), false);
	}
	giveValueFromCookie() {
		var cookieOptions = this.getCookie("gameOptions");
        if(cookieOptions != null){
            var data = cookieOptions.slice(1, cookieOptions.length-1).split(", ");
            MANAGER.setGameOptions({
                mouseSensibility: parseFloat(data[0].split(":")[1]),
                lifes: parseFloat(data[1].split(":")[1]),
                enemyQuantity: parseFloat(data[2].split(":")[1]),
                time: parseFloat(data[3].split(":")[1]),
				viewfinder: (data[4].split(":")[1] === 'true'),
				velocityFactorDefault: 0.2,
            });
        }
		
		var cookieSettings = this.getCookie("gameSettings");
        if(cookieSettings != null){
            var data = cookieSettings.slice(1, cookieSettings.length-1).split(", ");
			console.log(data[0].split(":")[1] === 'true')
            MANAGER.setGameSettings({
                useNormalMap: (data[0].split(":")[1] === 'true'),
                shadow: (data[1].split(":")[1] === 'true'),
                ambientTexture: (data[2].split(":")[1] === 'true'),
            });
        }
		
		var cookieDayTime = this.getCookie("dayTime");
        switch(cookieDayTime){
            case "night":
				if(this.nightButton != this.elemChecked) {
					this.elemChecked.checked = false;
					this.elemChecked = this.nightButton;
				}
                MANAGER.setDayTimeOptions(this.nightOptions);
                break;
            case "sunset":
				if(this.sunSetButton != this.elemChecked) {
					this.elemChecked.checked = false;
					this.elemChecked = this.sunSetButton;
				}
                MANAGER.setDayTimeOptions(this.sunSetOptions);
                break;
			case "day":
            default:
				if(this.dayButton != this.elemChecked) {
					this.elemChecked.checked = false;
					this.elemChecked = this.dayButton;
				}
                MANAGER.setDayTimeOptions(this.dayOptions);
                break;
        }
		this.elemChecked.checked = true;
	}
	
	
	getCookie(name){
        var elem = document.cookie.split("; ").find(row => row.startsWith(name))
        if(elem == null)
            return null;
        return elem.split('=')[1];
    }
	selectElementDayTime(elem,options) {
		if(!elem.checked)
			return;
		if(elem != this.elemChecked)
			this.elemChecked.checked = false;
		this.elemChecked = elem;
		MANAGER.setDayTimeOptions(options);
	}
	exitSetting() {
		this.setting.style.display = "none";
		document.activeElement.blur();
	}
	updateAllSlider() {
		this.updateGameOptionsUI();
		this.updateGameSettingsUI();
	}
	updateGameOptionsUI() {
		var curGameOptions = MANAGER.getGameOptions();
		this.sliderMouseSens.value = curGameOptions.mouseSensibility;
		this.sliderLifes.value = curGameOptions.lifes;
		this.sliderEnemys.value = curGameOptions.enemyQuantity;
		this.sliderTime.value = curGameOptions.time;
		this.wiewfinderCkBox.checked = curGameOptions.viewfinder;
	}
	updateGameSettingsUI() {
		var curGameSettings = MANAGER.getGameSettings();
		this.normalMapCkBox.checked = curGameSettings.useNormalMap;
		this.shadowCkBox.checked = curGameSettings.shadow;
		this.ambientTextureCkBox.checked = curGameSettings.ambientTexture;
	}
	
	
	updateAllOptions() {
		MANAGER.setGameOptions({
			mouseSensibility: parseFloat(this.sliderMouseSens.value),
			lifes: parseFloat(this.sliderLifes.value),
			enemyQuantity: parseFloat(this.sliderEnemys.value),
			time: parseFloat(this.sliderTime.value),
			viewfinder: this.wiewfinderCkBox.checked,
			velocityFactorDefault: 0.2,
		});
		MANAGER.setGameSettings({
			useNormalMap: this.normalMapCkBox.checked,
			shadow: this.shadowCkBox.checked,
			ambientTexture: this.ambientTextureCkBox.checked,
		})
	}
	setDifficulty(difficulty) {
		switch(difficulty){
			case 0:		//easy
				var gameOptions = {
					mouseSensibility : 1,
					lifes: 10,
					enemyQuantity: 10,
					time: 180,
					viewfinder: true,
					velocityFactorDefault : 0.2,
				}
				break
			case 1:		//normal
				var gameOptions = {
					mouseSensibility : 1,
					lifes: 5,
					enemyQuantity: 25,
					time: 150,
					viewfinder: true,
					velocityFactorDefault : 0.2,
				}
				break;
			case 2:		//hard
				var gameOptions = {
					mouseSensibility : 1,
					lifes: 2,
					enemyQuantity: 50,
					time: 120,
					viewfinder: false,
					velocityFactorDefault : 0.2,
				}
				break
		}
		MANAGER.setGameOptions(gameOptions);
		this.updateGameOptionsUI();
	}
}

function searchInChild(root, name) {
	if(root.name == name) return root;
	if(root.children == null) return null;
	for(let i in root.children) {
		var result = searchInChild(root.children[i],name);
		if(result!=null) return result;
	}
	return null;
}

function randRange(min, max) {
	return Math.random() * (max - min) + min;
}

class gameEnvironment {
	constructor() {
		this.models = {};
		this.characterTexture = {};
		this.texture = {};
		this.buildings = {};
		this.load();
		
		this.scoreManager = new ScoreManager({
			//hBar: document.getElementById("health-bar"),
			bar: document.getElementById("bar"),
			//lifesTarget: document.getElementById("lifesSpanGame"),
			timeTarget: document.getElementById("timeSpanGame"),
			enemyTarget: document.getElementById("enemySpanGame"),
			gunTarget: document.getElementById("gunSpanGame"),
			ammoTarget: document.getElementById("ammoSpanGame"),
			lifes: MANAGER.getLifes(), numEnemy: MANAGER.getEnemyQuantity(),
			time: MANAGER.getTime(),
		})
	}
	
	load() {
		var promise = [
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_03'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_04'),
            this.getModel('Guns/scene.gltf', 0.0006, 'Weapon_06'),
            this.getModel('Guns/scene.gltf', 0.001, 'Weapon_08'),
			
			this.getCharacterTexture('character/protagonist/', MANAGER.getNormalMapRule()),
			this.getCharacterTexture('character/soldier/', MANAGER.getNormalMapRule()),
			
			this.getBossTexture('character/boss/', MANAGER.getNormalMapRule()),
			
			this.getTexture('textures/terrain2.jpg',MANAGER.getNormalMapRule(),{wrapS: 1, wrapT: 1, repeat: [10, 10]}),
			this.getTexture('textures/wall.jpg',MANAGER.getNormalMapRule(),{wrapS: 1, wrapT: 1, repeat: [50, 7]}),
			this.getImages('textures/buildings/building1',MANAGER.getNormalMapRule()),
			this.getImages('textures/buildings/building2',MANAGER.getNormalMapRule()),
			this.getImages('textures/buildings/building3',MANAGER.getNormalMapRule()),
			this.getImages('textures/buildings/building4',MANAGER.getNormalMapRule()),
			this.getImages('textures/buildings/building5',MANAGER.getNormalMapRule()),
			this.getImages('textures/buildings/building6',MANAGER.getNormalMapRule()),
		];
		Promise.all(promise).then(data => {
            var nameModels = [
				"ak47",
				"pistol",
				"sniper",
				"rpg",
            ];
			var nameCharacter = [
				"protagonist",
				"soldier",
				"boss",
			]
			var nameTexture = [
				"terrain",
				"wall",
			]
			
			this.buildingNames = ["building1", "building2", "building3", "building4", "building5", "building6"];

			for(let i in nameModels){
                this.models[nameModels[i]] = {};
                this.models[nameModels[i]].model = data[i];
                this.models[nameModels[i]].name = nameModels[i];
            }
			var displace = nameModels.length;
			for(let i in nameCharacter) {
				this.characterTexture[nameCharacter[i]] = {};
				this.characterTexture[nameCharacter[i]] = data[(parseInt(i) + displace)];
			}
			displace += nameCharacter.length;
			for(let i in nameTexture) {
				this.texture[nameTexture[i]] = {};
				this.texture[nameTexture[i]] = data[(parseInt(i) + displace)];
			}
			
			displace += nameTexture.length;
			for(let i in this.buildingNames) {
				this.buildings[this.buildingNames[i]] = {};
				this.buildings[this.buildingNames[i]] = data[(parseInt(i) + displace)];
			}
			
			setTimeout(this.init(), 3000);
		}, error => {
            console.log('An error happened:', error);
        });
	}
	
	getModel(path, scale=1.0, childName=null) {
        const myPromise = new Promise((resolve, reject) => {
            const gltfLoader = new THREE.GLTFLoader();
            gltfLoader.load("./resources/models/" + path, (gltf) => {
				var mesh;
                if (childName == null)
                    mesh = gltf.scene;
				else
					mesh = searchInChild(gltf.scene, childName)
				if (mesh == null)
					throw 'Error in searching ' + childName + ' in ' + path;

                mesh.traverse(c => {
                    c.castShadow = MANAGER.getShadowRule();;
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
	
	getTexture(path, useNormalMap=false, mode={wrapS: 1, wrapT: 1, repeat: [1, 1]}) {
        const myPromise = new Promise((resolve, reject) => {
            var textureLoader = new THREE.TextureLoader();
            textureLoader.load("./resources/" + path, (img) => {
                img.wrapS = mode.wrapS;
                img.wrapT = mode.wrapT;
                img.repeat.set(...mode.repeat);

                if(useNormalMap){
                    var normalMap = new THREE.TextureLoader().load("./resources/normalMap/"+ path);
                    normalMap.wrapS = mode.wrapS;
                    normalMap.wrapT = mode.wrapT;
                    normalMap.repeat.set(...mode.repeat);
                } else {
                    var normalMap = null;
                }

                var material = new THREE.MeshStandardMaterial({
                    map: img,
                    normalMap: normalMap,
                    emissive: 'white',
                    emissiveIntensity: 0.0,
                 });
                resolve(material);
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
	
	getImages(path, useNormalMap=false) {
		const myPromise = new Promise((resolve, reject) => {
			var textureLoader = new THREE.TextureLoader();
			textureLoader.load("./resources/" + path +".jpg", (img) => {
				img.wrapS = THREE.RepeatWrapping;
				img.wrapT = THREE.RepeatWrapping;
				if(useNormalMap) {
					new THREE.TextureLoader().load("./resources/normalMap/"+ path+".png", (normalMap) => {
						normalMap.wrapS = THREE.RepeatWrapping;
						normalMap.wrapT = THREE.RepeatWrapping;
						resolve({map: img, normalMap: normalMap});
					});
				}
				else {
					resolve({map: img, normalMap: null});
				}
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
	
	buildingBuildings(){
		var buildingRepeatFactors = [{x: 1, y: 1}, {x: 1, y: 1}, {x: 1, y: 1}, {x: 1, y: 1}, {x: 3, y: 4}, {x: 2, y: 1}]

		for(var i=0; i<165; i++){
			var halfExtents = new CANNON.Vec3(randRange(3,10), randRange(3,12), randRange(3,10));
			var boxShape = new CANNON.Box(halfExtents);
			var boxGeometry = new THREE.BoxGeometry(halfExtents.x*2,halfExtents.y*2,halfExtents.z*2);
			do {
				var x = (Math.random()-0.5)*300;
				//var y = 5 + (Math.random()-0.5)*1;
				var y = halfExtents.y;
				var z = (Math.random()-0.5)*300;
			} while(this.unsafeSpawn(x, z, halfExtents.x, halfExtents.z));
			this.positionsList.push([x, z, halfExtents.x, halfExtents.z]);
			
			var boxBody = new CANNON.Body({ mass: 1000 });
			boxBody.addShape(boxShape);
			if(!MANAGER.getAmbientTextureRule()){
				var randomColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
				var material = new THREE.MeshStandardMaterial({color: randomColor});
			}
			else {
				var index = Math.floor(Math.random()*this.buildingNames.length);
				var texture = this.buildings[this.buildingNames[index]].map.clone();
				texture.needsUpdate = true;
				var repeatingFactorY = Math.floor(y/3)*buildingRepeatFactors[index].y;
				texture.repeat.set(buildingRepeatFactors[index].x, repeatingFactorY);
				if(this.buildings[this.buildingNames[index]].normalMap) {
					var normalMap = this.buildings[this.buildingNames[index]].normalMap.clone();
					if(!normalMap.image)
						console.log(index)
					normalMap.needsUpdate = true;
					normalMap.repeat.set(buildingRepeatFactors[index].x, repeatingFactorY);
				}
				else normalMap = null;
				
				var material = new THREE.MeshStandardMaterial({
                    map: texture,
                    normalMap: normalMap,
                 });
			}
			var boxMesh = new THREE.Mesh( boxGeometry, material );
			//var boxMesh = new THREE.Mesh( boxGeometry, this.characterTexture["protagonist"]["head"] );
			this.world.add(boxBody);
			this.scene.add(boxMesh);
			boxBody.position.set(x,y,z);
			boxMesh.position.set(x,y,z);
			boxMesh.castShadow = MANAGER.getShadowRule();
			boxMesh.receiveShadow = MANAGER.getShadowRule();
			this.boxes.push(boxBody);
			this.boxMeshes.push(boxMesh);
		}
			
		
	}
	
	getBossTexture(path, useNormalMap=false) {
		const myPromise = new Promise((resolve, reject) => {
			var characterTexture = {};
			var promiseCharacter = [
				this.getTexture(path+"ragnoFace.png",useNormalMap),
				this.getTexture(path+"spiderBody.png",useNormalMap),
			]
			Promise.all(promiseCharacter).then(data => {
				var nameCharacterPart = [
					"face",
					"skin",
				];

				for(let i in nameCharacterPart){
					characterTexture[nameCharacterPart[i]] = data[i];
				}
				characterTexture["head"] = [
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["face"],
				]
				characterTexture["body"] = [
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
					characterTexture["skin"],
				]
				resolve(characterTexture);
			}, error => {
				console.log('An error happened:');
				reject(error);
			});
		});
        return myPromise;
	}
	
	getCharacterTexture(path, useNormalMap=false) {
		const myPromise = new Promise((resolve, reject) => {
			var characterTexture = {};
			var promiseCharacter = [
				this.getTexture(path+"headTop.png",useNormalMap),
				this.getTexture(path+"headBottom.png",useNormalMap),
				this.getTexture(path+"headLeft.png",useNormalMap),
				this.getTexture(path+"headFace.png",useNormalMap),
				this.getTexture(path+"headRight.png",useNormalMap),
				this.getTexture(path+"headBack.png",useNormalMap),
				this.getTexture(path+"bodyTop.png",useNormalMap),
				this.getTexture(path+"bodyBottom.png",useNormalMap),
				this.getTexture(path+"bodyLeft.png",useNormalMap),
				this.getTexture(path+"bodyFront.png",useNormalMap),
				this.getTexture(path+"bodyRight.png",useNormalMap),
				this.getTexture(path+"bodyBack.png",useNormalMap),
				this.getTexture(path+"handTop.png",useNormalMap),
				this.getTexture(path+"handBottom.png",useNormalMap),
				this.getTexture(path+"armLeft.png",useNormalMap),
				this.getTexture(path+"armFront.png",useNormalMap),
				this.getTexture(path+"armRight.png",useNormalMap),
				this.getTexture(path+"armBack.png",useNormalMap),
				this.getTexture(path+"footTop.png",useNormalMap),
				this.getTexture(path+"footBottom.png",useNormalMap),
				this.getTexture(path+"legLeft.png",useNormalMap),
				this.getTexture(path+"legFront.png",useNormalMap),
				this.getTexture(path+"legRight.png",useNormalMap),
				this.getTexture(path+"legBack.png",useNormalMap),
			]
			
			Promise.all(promiseCharacter).then(data => {
				var nameCharacterPart = [
					"headTop",
					"headBottom",
					"headLeft",
					"headFace",
					"headRight",
					"headBack",
					"bodyTop",
					"bodyBottom",
					"bodyLeft",
					"bodyFront",
					"bodyRight",
					"bodyBack",
					"handTop",
					"handBottom",
					"armLeft",
					"armFront",
					"armRight",
					"armBack",
					"footTop",
					"footBottom",
					"legLeft",
					"legFront",
					"legRight",
					"legBack",
				];

				for(let i in nameCharacterPart){
					characterTexture[nameCharacterPart[i]] = data[i];
				}
				characterTexture["head"] = [
					characterTexture["headLeft"],
					characterTexture["headRight"],
					characterTexture["headTop"],
					characterTexture["headBottom"],
					characterTexture["headBack"],
					characterTexture["headFace"],
				]
				characterTexture["body"] = [
					characterTexture["bodyLeft"],
					characterTexture["bodyRight"],
					characterTexture["bodyTop"],
					characterTexture["bodyBottom"],
					characterTexture["bodyBack"],
					characterTexture["bodyFront"],
				]
				characterTexture["arm"] = [
					characterTexture["armLeft"],
					characterTexture["armRight"],
					characterTexture["handTop"],
					characterTexture["handBottom"],
					characterTexture["armBack"],
					characterTexture["armFront"],
				]
				characterTexture["leg"] = [
					characterTexture["legLeft"],
					characterTexture["legRight"],
					characterTexture["footTop"],
					characterTexture["footBottom"],
					characterTexture["legBack"],
					characterTexture["legFront"],
				]
				resolve(characterTexture);
			}, error => {
				console.log('An error happened:');
				reject(error);
			});
		});
        return myPromise;
	}
	
	changeVisual() {
		this.activeCamera = (this.activeCamera+1)%3;
		if(MANAGER.getViewfinder()) {
		if(this.activeCamera==1)
			document.getElementById('viewfinder').style.display = 'none';
		else if(this.activeCamera==0)
			document.getElementById('viewfinder').style.display = 'block';
		}
		
	}
	
	onWindowResize() {
		for(let i in this.camera) {
			this.camera[i].aspect = window.innerWidth / window.innerHeight;
			this.camera[i].updateProjectionMatrix();
		}
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
	
	/*DA QUI è WORK IN PROGRESS FINO ALLA LINEA ---------------*/
	locker() {
		document.getElementById("loading").style.display = "none";
		
		var blocker = document.getElementById( 'blocker' );
		var pauseCanvas = document.getElementById( 'PauseCanvas' );
		var resumeButton = document.getElementById( 'resumeButton' );
		
		if(MANAGER.getViewfinder())
			document.getElementById('viewfinder').style.display = 'block'
		else
			document.getElementById('viewfinder').style.display = 'none'

		var havePointerLock = 'pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document;

		if ( havePointerLock ) {

			var element = document.body;

			var pointerlockchange = function ( event ) {
				if ( document.pointerLockElement === element || document.mozPointerLockElement === element || document.webkitPointerLockElement === element ) {
					MANAGER.gameEnable = true;
					
					if(this.pauseTime){
						this.pausePassedTime = Date.now()-this.pauseTime;
						this.scoreManager.addPauseTime(this.pausePassedTime);
					}
					
					blocker.style.display = 'none';
					pauseCanvas.style.display = 'none';

				} else {
					this.pauseTime = Date.now();
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
			document.addEventListener( 'pointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'mozpointerlockchange', pointerlockchange.bind(this), false );
			document.addEventListener( 'webkitpointerlockchange', pointerlockchange.bind(this), false );

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
		
	update() {
		var dt = 1/60;
		this.world.step(dt);
		for(let i in MANAGER.deletedBody) {
			this.world.remove(MANAGER.deletedBody[i]);
		}
		MANAGER.deletedBody = [];
		
		var time = Date.now() - this.time - this.addedTime;
		//console.log(time);
		this.scoreManager.updateCurrTime(Date.now());
        if(this.scoreManager.isGameOver()){
			cancelAnimationFrame(this.animationFrameID);
            document.exitPointerLock();
            MANAGER.endGame({
                win: this.scoreManager.isWin(),
                enemyKilled: this.scoreManager.getEnemyKilled(),
				numEnemy: this.scoreManager.getNumEnemy(),
                time: this.scoreManager.getRemaningTime(),
            });
            return;
        }
		this.entityManager.update(time);
		this.bulletManager.update(time);
		this.controls.update(time);
		
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

	//Run game loop (update, render, repet)
	GameLoop() {
		this.animationFrameID = requestAnimationFrame(this.GameLoop.bind(this));
		if(MANAGER.gameEnable){
			this.addedTime = this.pausePassedTime ? this.pausePassedTime : 0;
			this.update();
			this.renderer.render(this.scene, this.camera[this.activeCamera]);
			this.pausePassedTime = 0;
			this.time = Date.now();
        }
	}
//---------------------------------------------------------------------

	// Check if a position is busy
	unsafeSpawn(posX, posZ, halfDimX, halfDimZ) {
		var unsafe = false;
		const margin = randRange(2, 5);
		for (const item of this.positionsList) {
			let [left1, top1, right1, bottom1] = [posX-halfDimX-margin, posZ+halfDimZ+margin, posX+halfDimX+margin, posZ-halfDimZ-margin],
				[left2, top2, right2, bottom2] = [item[0]-item[2], item[1]+item[3], item[0]+item[2], item[1]-item[3]];
			/*
			// The first rectangle is under the second or vice versa
			if ((top1 < bottom2 || top2 < bottom1)) {
				return false;
			}
			// The first rectangle is to the left of the second or vice versa
			if ((right1 < left2 || right2 < left1)) {
				return false;
			}
			*/
			if (!(top1 < bottom2 || top2 < bottom1 || right1 < left2 || right2 < left1))
				return true;
		}
		return false;
	}
	
	init() {
		this.world = this.initCannon();
		this.camera = [];
		this.camera.push(new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.15, 1000 ));
		
		this.camera.push(new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 ));
		this.camera[1].translateY(1.4)
		this.camera[1].translateX(0.4)
		this.camera[1].translateZ(3)
		this.camera[1].rotation.x = -Math.PI/30;
		
		this.camera.push(new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.1, 1000 ));
		this.camera[2].translateY(80)
		this.camera[2].translateZ(-5)
		this.camera[2].rotation.x = -Math.PI/2;
		
		this.activeCamera = 0;

		this.scene = new SceneFactory(MANAGER.getSkyBox());
		this.scene.fog = new THREE.Fog( 0x000000, 0, 500 );
		
		this.bulletManager = new BulletManager({manager: MANAGER, world: this.world, scene: this.scene});
		this.entityManager = new EntityManager({scene: this.scene, world: this.world, manager: MANAGER,scoreManager: this.scoreManager ,bulletManager: this.bulletManager})
		
		this.lights = new LightFactory(MANAGER.getLights());
        for (var i in this.lights) {
			this.lights.castShadow = MANAGER.getShadowRule();
            this.scene.add(this.lights[i]);
        }
		//var ambient = new THREE.AmbientLight( 0xAAAAAA );
		//var hemisphere = new THREE.HemisphereLight( 0xC8C8FF, 0x666666, 1 )
		//var ambient = new THREE.AmbientLight( 0xffffff );
		//this.scene.add(ambient);
		//this.scene.add(hemisphere);
		/* //Old light
		this.light = new THREE.SpotLight( 0x666666 );
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
		}*/
		
		this.tourch = new THREE.SpotLight(0xffffff);
		this.tourch.angle = Math.PI/4
		this.tourch.distance = 100;
		this.tourch.penumbra = 0.3;
		this.tourch.intensity = 1;
		this.tourch.castShadow = MANAGER.getShadowRule();
		if(MANAGER.getShadowRule()){
			this.tourch.shadow.camera.near = 3.5;
			this.tourch.shadow.camera.far = 50;//camera.far;
			this.tourch.shadow.camera.fov = 40;

			this.tourch.shadowMapBias = 0.1;
			this.tourch.shadowMapDarkness = 0.7;
			this.tourch.shadow.mapSize.width = 2*512;
			this.tourch.shadow.mapSize.height = 2*512;

			this.tourch.shadowCameraVisible = true;
		}
		this.tourch.position.set(0, 1.5, 0);
		this.tourch.target.position.set(0, 1.5, -1);
		  
		
		this.renderer = new THREE.WebGLRenderer({canvas: document.getElementById( 'canvas' ), antialias: true});
		this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMapSoft = true;
		this.renderer.setSize( window.innerWidth, window.innerHeight );
		//this.renderer.setClearColor( this.scene.fog.color, 1 );
		this.renderer.setClearColor( 0xffffff, 0);

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );

		// floor
		var geometry = new THREE.PlaneGeometry( 324, 324, 50, 50 );
		geometry.applyMatrix( new THREE.Matrix4().makeRotationX( - Math.PI / 2 ) );

		//var material = new THREE.MeshLambertMaterial({color: 0xeeee00});
		//var material = new THREE.MeshPhongMaterial({color: 0xeeee00, dithering: true});
		//var loader = new THREE.TextureLoader();
		//var material = loader.load("./resources/textures/terrain.jpg");
		//console.log(material.image);
		//terrain = this.texture["terrain"]
		//const texture = new THREE.TextureLoader().load('./resources/textures/terrain.jpg');
		// immediately use the texture for material creation
		//texture.wrapS = THREE.RepeatWrapping;
		//texture.wrapT = THREE.RepeatWrapping;
		//texture.repeat.set(10,10);
		//const material = new THREE.MeshPhongMaterial( { map: texture } );
		if(MANAGER.getAmbientTextureRule())
			var mesh = new THREE.Mesh(geometry, this.texture["terrain"]);
		else {
			var material = new THREE.MeshStandardMaterial({color: 0xffeb0f});
			var mesh = new THREE.Mesh(geometry, material);
		}
			
		mesh.castShadow = MANAGER.getShadowRule();
		mesh.receiveShadow = MANAGER.getShadowRule();
		this.scene.add(mesh);

		this.boxes = [];
		this.boxMeshes = [];
		this.balls = [];
		this.ballMeshes=[];

		this.positionsList = [[0, 0, 1, 1]];

		//Add walls
		var posXs = [162, -162, 0, 0]
		var posZs = [0, 0, 162, -162]
		for (var i=0; i<4; i++){
			if (posZs[i] == 0) var half = new CANNON.Vec3(2, 20, 162);
			else var half = new CANNON.Vec3(162, 20, 2);

			var posY = 20
			var posX = posXs[i]
			var posZ = posZs[i]
			var shape = new CANNON.Box(half);
			var boxGeom = new THREE.BoxGeometry(half.x*2,half.y,half.z*2);

			var body = new CANNON.Body({ mass: 0 });
			body.addShape(shape);
			if(MANAGER.getAmbientTextureRule())
				var mesh = new THREE.Mesh( boxGeom, this.texture["wall"] );
			else {
				var randColor = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
				var mesh = new THREE.Mesh(boxGeom, new THREE.MeshStandardMaterial({color: randColor}));
			}
			mesh.castShadow = MANAGER.getShadowRule();
			mesh.receiveShadow = MANAGER.getShadowRule();
	
			this.world.add(body);
			this.scene.add(mesh);
			body.position.set(posX,posY,posZ);
			mesh.position.set(posX,posY/2,posZ);
		}
		
		// Add boxes
		this.buildingBuildings();	

		//Add personaggio
		var gunsPlayer = [CharacterFactory.GUN_PISTOL, "ak47", "sniper", "rpg"];
		var playerStartPosition = [0, 1.6, 0];
		this.playerEntity = this.entityManager.addEntityAndReturn({name: EntityManager.ENTITY_PLAYER, guns : gunsPlayer, position: playerStartPosition});
		
		this.entityManager.setPlayer(this.playerEntity);
		//this.person = new CharacterFactory({manager : MANAGER, guns : [CharacterFactory.GUN_PISTOL, "ak47", "sniper", "rpg"]});

		this.controls = new CharacterController({manager: MANAGER, entity: this.playerEntity, camera: this.camera, bulletManager: this.bulletManager, scoreManager: this.scoreManager});
		this.playerEntity.setControls(this.controls);
		this.controls.addTourch(this.tourch);
		
		this.scene.add(this.controls.getObject());
		
		this.spawnEnemy();
		
		//Add boss
		var bossPosition = [0, 20, -50];
		//this.boss = new BossFactory({manager: MANAGER, position: bossPosition});
		this.boss = this.entityManager.addEntityAndReturn({name: EntityManager.ENTITY_BOSS, position: bossPosition, maxDistance: 40})
		
		// Add linked boxes
		/*
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
		*/
		
		this.locker();
		var time = Date.now();
		this.time = Date.now();
		this.scoreManager.setStartTime(time);
        this.scoreManager.updateCurrTime(time);
		this.GameLoop();
	}
	
	spawnEnemy() {
		for(let i=0;i<MANAGER.getEnemyQuantity();i++) {
			var gun = CharacterFactory.GUN_ALL[Math.floor(Math.random()*CharacterFactory.GUN_ALL.length)];
			var minDistanceSquared = 625;
			do {
				var position = [0,20,0];
				position[0] = Math.random()*2-1;
				position[2] = Math.random()*2-1;
				var distanceSquared = position[0]*position[0]+position[2]*position[2];
				var factor = Math.sqrt(minDistanceSquared/distanceSquared);
				position[0] *= (factor+Math.random()*100);
				position[2] *= (factor+Math.random()*100);
				//console.log("Enemy: " + position[0] + position[2]);
				//console.log(this.positionsList[0] + " " + this.positionsList[1] + " " + " " + this.positionsList[2] + " " + " " + this.positionsList[3] + " " + " " + this.positionsList[4] + " " + " " + this.positionsList[5] + " ");
				//console.log(this.positionsList);
			} while(this.unsafeSpawn(position[0], position[2], 1, 1));
			this.positionsList.push([position[0], position[2], 1, 1]);
			this.entityManager.addEntity({name: EntityManager.ENTITY_SIMPLE_ENEMY, guns: [gun], position: position, maxDistance: 25});
		}
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

		world.gravity.set(0,-10,0);
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
		
		// Create a plane
		var groundShape = new CANNON.Plane();
		var groundBody = new CANNON.Body({ mass: 0 });
		groundShape.material = groundMaterial;
		groundBody.addShape(groundShape);
		groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0),-Math.PI/2);
		groundBody.isGround = true;
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

class gameOverEnvironment {
    constructor(params){
        this.gameOver = document.getElementById("gameOver");

        this.gameOverResult = document.getElementById("gameOverResult");

        this.statsEnemy = document.getElementById("statsEnemy");
        //this._statsScore = document.getElementById("statsScore");
        this.statsTime = document.getElementById("statsTime");

        this.winGame = document.getElementById("winGame");

        if(params.win){
            this.gameOverResult.innerHTML ="You WIN";
            this.winGame.style.background = "#85B24D";
        } else {
            this.gameOverResult.innerHTML ="You LOSE";
        }

        this.statsEnemy.innerHTML = params.enemyKilled+"/"+params.numEnemy;
        //var score = ("0000" + params.score);
        //this._statsScore.innerHTML = score.substr(score.length-4);
        this.statsTime.innerHTML = parseInt(params.time / 60) + ":" + (params.time % 60).toLocaleString('en-US',
            { minimumIntegerDigits: 2, useGrouping: false });
        
        this.gameOver.style.display = "block";
    }
}

var MANAGER = new gameManager();

window.addEventListener('DOMContentLoaded', () => {
    MANAGER.APP = new MenuEnvironment();
});
