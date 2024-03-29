import {CharacterController} from './Controllers/CharacterController.js';
import {BasicAIController} from './Controllers/BasicAIController.js';
import {BossAIController} from './Controllers/BossAIController.js';
import {CharacterFactory} from './CharacterFactory.js';
import {BossFactory} from './BossFactory.js';

export class EntityManager{
	static ENTITY_SIMPLE_ENEMY = "SimpleEnemy";
	static ENTITY_PLAYER = "Player";
	static ENTITY_BOSS = "Boss";
	
	constructor(params){
        this.entities = [];
        this.player = null;

        this.scene = params.scene;
        this.world = params.world;
        this.MANAGER = params.manager;
		this.bulletManager = params.bulletManager;
        this.scoreManager = params.scoreManager;
		this.entityEnemy = null;
    }

	addEntity(params) {
		switch(params.name){
            case EntityManager.ENTITY_SIMPLE_ENEMY:
				if(this.entityEnemy == null) {
					this.entityEnemy = new CharacterFactory({manager: this.MANAGER, guns: [], position: [0,0,0], texture: this.MANAGER.APP.characterTexture["soldier"]})
				}
				var character = this.entityEnemy.clone(params.position, params.guns)
                var entity = new SimpleEnemyEntity({
                    manager: this.MANAGER,
					entityManager: this,
					maxDistance: params.maxDistance,
                    scoreManager: this.scoreManager,
					pos: this.entities.length,
                    target: character.getMesh(),
                    body: this.buildBody(params),
                    player: this.player,
					character: character,
					bulletId: 2,
                });
                this.entities.push(entity);
                break;
            case EntityManager.ENTITY_PLAYER:
				var character = new CharacterFactory({manager: this.MANAGER, guns: params.guns, position: params.position, texture: this.MANAGER.APP.characterTexture["protagonist"]})
                var entity = new PlayerEntity({
                    manager: this.MANAGER,
					entityManager: this,
					pos: this.entities.length,
                    scoreManager: this.scoreManager,
                    target: character.getMesh(),
					body: this.buildBody(params),
					character: character,
					bulletId : 3,
                });
                this.entities.push(entity);
                break;
			case EntityManager.ENTITY_BOSS:
				var character = new BossFactory({manager: this.MANAGER, position: params.position, texture: this.MANAGER.APP.characterTexture["boss"]})
                var entity = new BossEntity({
                    manager: this.MANAGER,
					entityManager: this,
					maxDistance: params.maxDistance,
					pos: this.entities.length,
                    scoreManager: this.scoreManager,
                    target: character.getBoss(),
					body: this.buildBody(params),
					player: this.player,
					character: character,
					bulletId : 2,
                });
                this.entities.push(entity);
                break;
        }
		this.scene.add(entity.target);
        if(entity.body != null){
            this.world.add(entity.body);
		}
	}
	addEntityAndReturn(params){
        this.addEntity(params);
        return this.entities[this.entities.length-1];
    }

	buildBody(params){
        switch(params.name){ 
            case EntityManager.ENTITY_SIMPLE_ENEMY:
                var body = new CANNON.Body({ mass: 30, shape: new CANNON.Sphere(2),});
                break;
            case EntityManager.ENTITY_PLAYER:
                var body = new CANNON.Body({ mass: 50, shape: new CANNON.Sphere(1),});
                body.linearDamping = 0.9;
                break;
			case EntityManager.ENTITY_BOSS:
				var body = new CANNON.Body({ mass: 100000, shape: new CANNON.Sphere(7),});
				body.isBoss = true;
				break;
        }
        body.position.set(...params.position);
        if(params.rotation){
            if(params.rotation[0] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), params.rotation[0]);
            if(params.rotation[1] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), params.rotation[1]);
            if(params.rotation[2] != 0)
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 0, 1), params.rotation[2]);
        }
        return body;
    }
	
	eliminateThisEntity(elem){
		elem.target.parent.remove(elem.target);
		this.MANAGER.deletedBody.push(elem.body);
        var pos = elem.pos;
        this.entities.splice(pos, 1);
        for (var i = pos; i < this.entities.length; i++){
            this.entities[i].pos -= 1;
        }
    }
	
	setPlayer(player){
        this.player = player;
    }
	
	update(timeInSeconds){
        for(var i in this.entities){
            this.entities[i].update(timeInSeconds);
        }
    }
}

class Entity{
    constructor(params){
        this.MANAGER = params.manager;
        this.entityManager = params.entityManager;
        this.target = params.target;
        this.body = params.body;
        this.pos = params.pos;
		this.bulletId = params.bulletId;

        this.player = params.player;
        if(this.body){
            this.contactNormal = new CANNON.Vec3();
            this.upAxis = new CANNON.Vec3(0, 1, 0);
            
            this.body.addEventListener("collide", function (e){
				
				if(e.contact.bi.isBoss)
					this.hittedBoss(e.contact.bi);
				if(e.contact.bj.isBoss)
					this.hittedBoss(e.contact.bj);
				
                if ( !(e.contact.bi.isBullet || e.contact.bj.isBullet) )
                    return;
				
				if (e.contact.bi.idBullet && e.contact.bi.idBullet==this.bulletId || e.contact.bj.idBullet && e.contact.bj.idBullet==this.bulletId)
					return;
				
                if (e.contact.bi.id == this.body.id)
                    e.contact.ni.negate(this.contactNormal);
                else
                    this.contactNormal.copy(e.contact.ni);
				
				
				this.hitted();
            }.bind(this));
        }
    }
	deleteEntity() {this.entityManager.eliminateThisEntity(this);}
    collected(){}
    hitted(){}
	hittedBoss(bossBody){}
    update(timeInSeconds){}
}
	
class SimpleEnemyEntity extends Entity {
	constructor(params) {
		super(params);
		
		this.scoreManager = params.scoreManager;
		this.maxDistance = params.maxDistance;
		this.character = params.character;

		this.controls = new BasicAIController({
			manager: this.MANAGER,
			character: this.character,
			entity: this,
			target: this.target,
			body: this.body,
			player: this.player,
			maxDistance: this.maxDistance,
			bulletManager: this.entityManager.bulletManager,
		});
	}

	hitted(){
		this.scoreManager.enemyKilled();
		this.entityManager.eliminateThisEntity(this);
	}

	update(timeInSeconds){
		this.controls.update(timeInSeconds);

		if(this.body.position.y < -20){
			this.scoreManager.enemyKilled();
			this.entityManager.eliminateThisEntity(this);
		}
	}
}

class PlayerEntity extends Entity {
	constructor(params){
		super(params);
		
		this.scoreManager = params.scoreManager;
		this.character = params.character;
	}
	setControls(controls) {
		this.controls = controls;
	}
	hittedBoss(bossBody) {
		this.controls.kickBack(bossBody.position)
		this.hitted();
		var spiderAttack_audio = new Audio(".\\resources\\audio\\spider_attack.mp3");
		spiderAttack_audio.volume = this.MANAGER.getEffectVolume();
		spiderAttack_audio.play();
	};
	hitted(){
		this.scoreManager.lose1life();
	}
}

class BossEntity extends Entity {
	constructor(params){
		super(params);
		
		this.scoreManager = params.scoreManager;
		this.maxDistance = params.maxDistance;
		this.character = params.character;
		this.life = 20;
		this.alive = true;
		this.controls = new BossAIController({
			manager: this.MANAGER,
			character: this.character,
			entity: this,
			target: this.target,
			body: this.body,
			player: this.player,
			maxDistance: this.maxDistance,
		});
	}
	hitted(){
		this.life -= 1;
		if(this.life<=0 && this.alive) {
			this.body.isBoss = false;
			this.alive = false;
			this.controls.death();
		}
		else {
			let audio = new Audio(".\\resources\\audio\\spider_hit.mp3");
			audio.volume = this.MANAGER.getEffectVolume();
			audio.play();
		}

	}
	update(timeInSeconds){
		this.controls.update(timeInSeconds);
	}
}