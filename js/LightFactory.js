export class LightFactory{
    static DAY_LIGHT = "day";
    static SUNSET_LIGHT = "sunset";
    static NIGHT_LIGHT = "night";

    constructor(daytime=LightFactory.DAY_LIGHT, shadow=true){
        this.lights = [];
        switch(daytime){
            case LightFactory.NIGHT_LIGHT:
                //var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.0);
				var hemisphereLight = new THREE.HemisphereLight(0x333333, 0x666666, 0.5)
                this.lights.push(hemisphereLight);
                break;
            case LightFactory.SUNSET_LIGHT:
                var sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
                sun.position.set(0, 100, -100);
                sun.target.position.set(0, 0, 0);

                if(shadow){
                    sun.castShadow = true;
                    sun.shadow.bias = -0.001;
                    sun.shadow.mapSize.width = 4096;
                    sun.shadow.mapSize.height = 4096;
                    sun.shadow.camera.near = 0.1;
                    sun.shadow.camera.far = 1000.0;
                    sun.shadow.camera.left = 100;
                    sun.shadow.camera.right = -100;
                    sun.shadow.camera.top = 100;
                    sun.shadow.camera.bottom = -100;
                }
                this.lights.push(sun);
				
				var hemisphereLight = new THREE.HemisphereLight(0xfbd9ac, 0x666666, 0.5)
				this.lights.push(hemisphereLight);
                //var ambientLight = new THREE.AmbientLight(0xfbd9ac, 1.0);
                //this.lights.push(ambientLight);
                break;
            case LightFactory.DAY_LIGHT:
            default:
                var sun = new THREE.DirectionalLight(0xFFFFFF, 1.0);
                sun.position.set(-35, 100, 35);
                sun.target.position.set(0, 0, 0);

                if(shadow){
                    sun.castShadow = true;
                    sun.shadow.bias = -0.001;
                    sun.shadow.mapSize.width = 4096;
                    sun.shadow.mapSize.height = 4096;
                    sun.shadow.camera.near = 0.1;
                    sun.shadow.camera.far = 1000.0;
                    sun.shadow.camera.left = 100;
                    sun.shadow.camera.right = -100;
                    sun.shadow.camera.top = 100;
                    sun.shadow.camera.bottom = -100;
                }
                this.lights.push(sun);

				var hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x666666, 0.5);
				this.lights.push(hemisphereLight);
                //var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
                //this.lights.push(ambientLight);
                break;
        }
        
        return this.lights;
    }
}