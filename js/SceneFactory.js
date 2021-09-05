export class SceneFactory{
    static DAY_SKYBOX = "daySkyBox"
    static DAY_SKYBOX2 = "daySkyBox2"
    static DAY_SKYBOX3 = "daySkyBox3"
    static SUNSET_SKYBOX = "sunsetSkyBox"
    static SUNSET_SKYBOX2 = "sunsetSkyBox2"
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
                    'right1.png', 'left.png', 'top.png',
                    'bottom.png', 'center.png', 'right2.png',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
			
			case SceneFactory.DAY_SKYBOX2:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.DAY_SKYBOX2+'/');
                this.texture = this.loader.load([
                    'right1.png', 'left.png', 'top.png',
                    'bottom.png', 'center.png', 'right2.png',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
			
			case SceneFactory.DAY_SKYBOX3:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.DAY_SKYBOX3+'/');
                this.texture = this.loader.load([
                    'right1.jpg', 'left.jpg', 'top.jpg',
                    'bottom.jpg', 'center.jpg', 'right2.jpg',
                ]);
                this.texture.encoding = THREE.sRGBEncoding;
                this.scene.background = this.texture;
                break;
			
			case SceneFactory.SUNSET_SKYBOX2:
                this.loader = new THREE.CubeTextureLoader();
                this.loader.setPath('./resources/skyboxs/'+SceneFactory.SUNSET_SKYBOX2+'/');
                this.texture = this.loader.load([
                    'right1.png', 'left.png', 'top.png',
                    'bottom.png', 'center.png', 'right2.png',
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