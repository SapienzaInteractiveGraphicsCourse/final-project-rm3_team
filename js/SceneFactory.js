import * as THREE from 'https://cdn.skypack.dev/three@v0.129.0-oVPEZFilCYUpzWgJBZqM/build/three.module.js';

export class SceneFactory{
    static DAY_SKYBOX = "daySkyBox"
    static SUNSET_SKYBOX = "sunsetSkyBox"
    static NIGHT_SKYBOX = "nightSkyBox"
    static GALAXY_SKYBOX = "galaxySkyBox"

    constructor(skyBox = SceneFactory.DAY_SKYBOX){
        this.scene = new THREE.Scene();

        switch(skyBox){
            case SceneFactory.SUNSET_SKYBOX:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.SUNSET_SKYBOX+'/');
                this.texture = this.loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
				
			case SceneFactory.GALAXY_SKYBOX:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.GALAXY_SKYBOX+'/');
                this.texture = this.loader.load([
                    'posx.png', 'negx.png', 'posy.png',
                    'negy.png', 'posz.png', 'negz.png',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
            
            case SceneFactory.NIGHT_SKYBOX:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.NIGHT_SKYBOX+'/');
                this.texture = this.loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
                
            case SceneFactory.DAY_SKYBOX:
            default:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.DAY_SKYBOX+'/');
                this.texture = this.loader.load([
                    'posx.jpg', 'negx.jpg', 'posy.jpg',
                    'negy.jpg', 'posz.jpg', 'negz.jpg',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
        }

        return this.scene;
    }
}