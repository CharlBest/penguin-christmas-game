import { EventEmitter, Injectable, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { AssetsManager, Axis, Camera, Engine, FreeCamera, HemisphericLight, ILoadingScreen, Mesh, MeshBuilder, PhysicsImpostor, PointerEventTypes, Scene, Sound, Space, Sprite, SpriteManager, StandardMaterial, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';
import { ConfigService } from './config.service';
import { HomeService } from './home.service';
import { Assets } from './models/assets';
import { House } from './models/house';
import { HouseSize } from './models/house-size';
import { Level } from './models/level';
import { Objects } from './models/objects';

// Incrementally create 3D object and set the billboard property to make them 2D and
// migrate to a full 3D game. Auto move camera for cool tour

// GalaxyWars game example: https://github.com/AbdoA2/GalaxyWars
// Ortho camera: http://www.html5gamedevs.com/topic/8712-ortho-camera/
// 2D sprite: https://www.eternalcoding.com/?p=323
// 2D sprite interacting in 3D world: https://www.youtube.com/watch?v=qDKw78O7yIY
// Resize content based on ratio: http://www.html5gamedevs.com/topic/27199-solved-stage-width-and-height/
// Move meshes with pointers: https://www.babylonjs-playground.com/#7CBW04
// Pointer events: https://doc.babylonjs.com/how_to/interactions
// 2D unity game concepts: http://www.third-helix.com/2012/02/05/making-2d-games-with-unity.html

@Injectable({
    providedIn: 'root'
})
export class GameService {

    @Output() finished: EventEmitter<number> = new EventEmitter<number>();
    engine: Engine;
    camera: Camera;
    scene: Scene;
    assetsManager: AssetsManager;

    assets: Assets = new Assets();
    objects: Objects = new Objects();

    assetManagerProgress = 0;
    score = 0;
    bestScore = 0;
    level: Level | undefined;
    lastHouseXPosition: number;

    constructor(private homeService: HomeService,
        private configService: ConfigService) { }

    init(canvas: HTMLCanvasElement, loadingScreenElement: HTMLDivElement, levelId: number) {
        this.level = this.configService.levels.find(x => x.id === levelId);

        this.overwriteLevelForTesting();

        const createScene = (): void => {

            // This creates a basic Babylon Scene object (non-mesh)
            this.scene = new Scene(this.engine);

            // Custom loading screen
            this.customLoadingScreen(loadingScreenElement);

            // This creates and positions a free camera (non-mesh)
            this.camera = new FreeCamera('camera1', new Vector3(0, 0, -10), this.scene);
            this.camera.mode = Camera.ORTHOGRAPHIC_CAMERA;

            this.updateCameraAspectRatio();

            // TODO: what does this do
            // This targets the camera to scene origin
            // camera.setTarget(Vector3.Zero());

            // This attaches the camera to the canvas
            // this.camera.attachControl(canvas, true);

            // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
            // const light = new BABYLON.PointLight('pointLight', new Vector3(0, 100, 100), this.scene);
            const light = new HemisphericLight('light1', new Vector3(0, 1, 0), this.scene);
            light.intensity = 2;

            // Below approach or this canvas.addEventListener('resize', () => {}) ?
            this.engine.onResizeObservable.add(() => {
                this.updateCameraAspectRatio();
            });

            // Tap event
            this.onPointerEvents();

            // Physics
            // this.scene.enablePhysics(new Vector3(0, -9.81, 0), new OimoJSPlugin());
            this.scene.enablePhysics(new Vector3(0, -9.81, 0));

            // Load Assets
            this.loadAssets();
        };

        this.engine = new Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true });
        createScene();

        // Debug
        // this.scene.debugLayer.show();

        // TODO: should I be doing this here and in the asset loader?
        // this.engine.runRenderLoop(() => {
        //     if (this.scene) {
        //         this.scene.render();
        //     }
        // });

        // Resize
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }

    overwriteLevelForTesting() {
        // TODO: remove this in prod
        const levelsOverride = localStorage.getItem('levels');
        try {
            if (levelsOverride) {
                const levelsOverrideJSON = JSON.parse(levelsOverride) as Array<Level>;
                levelsOverrideJSON.forEach(levelOverride => {
                    const level = this.configService.levels.find(x => x.id === levelOverride.id);
                    if (level) {
                        level.speed = levelOverride.speed;
                        level.giftSize = levelOverride.giftSize;
                        level.houses = [];
                        for (const house of levelOverride.houses) {
                            level.houses.push(this.configService.createHouse((<any>house).size, (<any>house).position));
                        }
                    }
                });
            }
        } catch {
            console.log('Not valid JSON');
        }
    }

    loadAssets() {
        // Assets manager
        this.assetsManager = new AssetsManager(this.scene);

        this.loadSounds();
        this.loadHouses();

        const amountOfBackAndForegrounds = 10;
        // TODO: this could actually change to sprites
        this.assetsManager.addTextureTask('backgroundTexture task', 'assets/game/images/background.png').onSuccess = (task) => {
            // Set background
            this.objects.background.material = new StandardMaterial('backgroundMaterial', this.scene);
            this.objects.background.material.diffuseTexture = task.texture;
            this.objects.background.material.opacityTexture = task.texture;

            // Load foreground
            this.objects.foreground.spriteManager = new SpriteManager(`forgroundSpriteManager`,
                'assets/game/images/foreground.png',
                amountOfBackAndForegrounds, { width: 1800, height: 300 }, this.scene);

            // Create back/front ground scenes
            for (let x = 0; x < amountOfBackAndForegrounds; x++) {
                this.createBackground(x * 18);
                this.createForeground(x * 18);
            }
        };

        // assetsManager.addMeshTask('giftTexture task', '', 'assets/game/objects/', 'gift.gltf').onSuccess = (task) => {
        this.assetsManager.addTextureTask('giftTexture task', 'assets/game/images/gift.svg').onSuccess = (task) => {
            this.objects.gift.material = new StandardMaterial('giftMaterial', this.scene);
            this.objects.gift.material.diffuseTexture = task.texture;
            this.objects.gift.material.opacityTexture = task.texture;

            this.createGiftMesh();
        };

        this.createSleigh();

        this.assetsManager.onFinish = (tasks) => {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        };

        this.assetsManager.load();

        this.assetsManager.onProgressObservable.add((event) => {
            this.assetManagerProgress = ((event.totalCount - event.remainingCount) / event.totalCount) * 100;
        });
    }

    loadSounds() {
        this.assetsManager.addBinaryFileTask('countdownSound task', 'assets/game/sounds/countdown.m4a').onSuccess = (task) => {
            this.assets.countdownSound = new Sound('countdownSound', task.data, this.scene, soundsReady);
        };

        this.assetsManager.addBinaryFileTask('backgroundSound task', 'assets/game/sounds/background.mp3').onSuccess = (task) => {
            this.assets.backgroundSound = new Sound('backgroundSound', task.data, this.scene, soundsReady, { loop: true });
        };

        this.assetsManager.addBinaryFileTask('giftFallSound task', 'assets/game/sounds/gift-fall.mp3').onSuccess = (task) => {
            this.assets.giftFallSound = new Sound('giftFallSound', task.data, this.scene, soundsReady);
        };

        let soundsReadyCount = 0;

        const soundsReady = () => {
            soundsReadyCount++;
            if (soundsReadyCount === 3) {
                console.log('All sounds are ready');
            }
        };
    }

    loadHouses() {
        // TODO: set precise instance count for every level (not fixed 30)
        this.objects.house.spriteManager.small = new SpriteManager('smallHouseSpriteManager', 'assets/game/images/small-house.png',
            30, { width: HouseSize.small.width * 100, height: HouseSize.small.fullHeight * 100 }, this.scene);

        this.objects.house.spriteManager.medium = new SpriteManager('mediumHouseSpriteManager', 'assets/game/images/medium-house.png',
            30, { width: HouseSize.medium.width * 100, height: HouseSize.medium.fullHeight * 100 }, this.scene);

        this.objects.house.spriteManager.large = new SpriteManager('largeHouseSpriteManager', 'assets/game/images/large-house.png',
            30, { width: HouseSize.large.width * 100, height: HouseSize.large.fullHeight * 100 }, this.scene);

        if (this.level) {
            // Set previous house widths
            let previousHousePosition = 0;
            let previousHouseWidth = 0;
            this.level.houses.forEach(x => {
                x.previousHousePosition = previousHousePosition + (previousHouseWidth / 2) + (x.size.width / 2) + x.xPosition;

                previousHouseWidth = x.size.width;
                previousHousePosition = x.previousHousePosition;
            });
            this.lastHouseXPosition = previousHousePosition;

            for (const house of this.level.houses) {
                this.createHouse(house);
            }
        }
    }

    customLoadingScreen(loadingScreenElement: HTMLDivElement) {
        const loadingScreen = new CustomLoadingScreen(loadingScreenElement);
        this.engine.loadingScreen = loadingScreen;
    }

    createHouse(house: House) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`houseBox-${this.objects.house.mesh.length + 1}`,
                { width: house.size.width, height: house.size.fullHeight }, this.scene);
        // mesh.material = this.objects.house.material[house.size.name];
        mesh.position.x = house.previousHousePosition;
        mesh.position.y = (house.size.fullHeight / 2) - 3.7 /*Lower house floor*/;
        mesh.visibility = 0;

        // House sprite image
        const smallHouseSprite = new Sprite(`houseSprite-${this.objects.house.mesh.length + 1}`,
            this.objects.house.spriteManager[house.size.name]);
        smallHouseSprite.width = house.size.width;
        smallHouseSprite.height = house.size.fullHeight;
        smallHouseSprite.position.x = mesh.position.x;
        smallHouseSprite.position.y = mesh.position.y;

        // House collision wrapper
        const houseCollisionMesh = MeshBuilder
            .CreateBox(`houseBox-${this.objects.house.mesh.length + 1}-inner`,
                { width: house.size.width, height: house.size.height, depth: 4 }, this.scene);
        houseCollisionMesh.position.y = (house.size.fullHeight - house.size.height) / 2 * -1;
        houseCollisionMesh.visibility = 0;
        houseCollisionMesh.parent = mesh;

        // Physics
        houseCollisionMesh.physicsImpostor =
            new PhysicsImpostor(houseCollisionMesh, PhysicsImpostor.BoxImpostor,
                { ignoreParent: true, mass: 0, restitution: 0.9 }, this.scene);

        this.createChimney(mesh, house, house.size.chimneyPosition);
        this.createChimney(mesh, house, house.size.chimneyPosition + 1);

        // Create Gift Drop Zone
        const dropZone = MeshBuilder
            .CreateGround(`dropZoneGround-${this.objects.house.mesh.length + 1}`, { width: 1, height: 4 }, this.scene);
        dropZone.position.x = (house.size.width / 2 * -1) + house.size.chimneyPosition + 0.5 /*half ground width*/;
        dropZone.position.y = (house.size.height / 2);
        dropZone.parent = mesh;

        // Physics
        dropZone.physicsImpostor =
            new PhysicsImpostor(dropZone, PhysicsImpostor.BoxImpostor, { ignoreParent: true, mass: 0, restitution: 0.9 }, this.scene);

        // Points
        dropZone.physicsImpostor.onCollideEvent = (collider: PhysicsImpostor, collidedWith: PhysicsImpostor) => {
            if (!collider.object['dropZoneSuccess']) {
                collider.object['dropZoneSuccess'] = true;
                this.score += 100;
                const giftMesh = this.objects.gift.mesh.find(y => y.id === collidedWith.object['id']);
                if (giftMesh) {
                    smallHouseSprite.cellIndex = 1;
                    const timeoutId = setTimeout(() => {
                        giftMesh.dispose();
                        clearTimeout(timeoutId);
                    }, 1);
                }
            }
        };

        // Save
        this.objects.house.mesh.push(dropZone);
    }

    createChimney(parentMesh: Mesh, house: House, x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateCylinder(`chimneyCylinder-${this.objects.house.mesh.length}-${Math.random()}`, { diameter: 0.1, height: 4 }, this.scene);
        mesh.position.x = (house.size.width / 2 * -1) + x;
        mesh.position.y = (house.size.fullHeight / 2) - 0.1 /*Place below chimney*/;
        mesh.rotate(Axis.X, Math.PI / 2, Space.WORLD);
        mesh.visibility = 0;
        mesh.parent = parentMesh;

        // Physics
        mesh.physicsImpostor =
            new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { ignoreParent: true, mass: 0, restitution: 0.9 }, this.scene);
    }

    createSleigh() {
        // Load
        this.objects.sleigh.spriteManager = new SpriteManager('sleighSpriteManager', 'assets/game/images/sleigh.png',
            1, { width: 600, height: 150 }, this.scene);

        // Sprite
        const sprite = new Sprite(`sleighSprite`, this.objects.sleigh.spriteManager!);
        sprite.width = 6;
        sprite.height = 1.5;
        sprite.position.x = -1;
        sprite.position.y = 4;

        this.objects.sleigh.sprite = sprite;

        // Start auto scroll scene
        this.activateAutoHorizontalScroll();
    }

    createBackground(x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`backgroundBox-${this.objects.background.mesh.length + 1}`, { width: 18, height: 10 }, this.scene);

        mesh.material = this.objects.background.material;
        mesh.position.x = x;
        mesh.position.y = 0;
        mesh.position.z = 10;

        // Save
        this.objects.background.mesh.push(mesh);
    }

    createForeground(x: number) {
        // Sprite
        const sprite = new Sprite(`foregroundSprite-${this.objects.foreground.sprite.length + 1}`, this.objects.foreground.spriteManager!);
        sprite.width = 18;
        sprite.height = 3;
        sprite.position.x = x;
        sprite.position.y = -3.5;

        // Save
        this.objects.foreground.sprite.push(sprite);
    }

    createGiftMesh() {
        const mesh = MeshBuilder
            .CreateBox(`sourceGiftBox`, { size: this.level!.giftSize }, this.scene);
        mesh.material = this.objects.gift.material;
        mesh.position.y = -10;

        // Save
        this.objects.gift.sourceMesh = mesh;
    }

    createGift(x: number) {
        // Mesh
        const mesh = this.objects.gift.sourceMesh!.clone(`giftBox-${this.objects.gift.mesh.length + 1}`, undefined, false, false);
        mesh.position.x = x - 2;
        mesh.position.y = 3.5;
        // TODO: fix gift going behind the house
        mesh.position.z = 2;

        // Physics
        mesh.physicsImpostor =
            new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, this.scene);

        // Destory
        const timeoutId = setTimeout(() => {
            mesh.dispose();
            clearTimeout(timeoutId);
        }, 4000);

        // Save
        this.objects.gift.mesh.push(mesh);

        // GLTF object
        // const gift = this.objects.gift.mesh[0].clone(`giftBox-${this.objects.gift.mesh.length + 1}`, null);
        // gift.position.x = x - 2;
        // gift.position.y = 3.5;
    }

    updateCameraAspectRatio() {
        const sceneSize = 5;
        const tAspect = this.engine.getAspectRatio(this.camera);
        const tOrtho = this.camera.orthoTop || sceneSize;
        this.camera.orthoTop = sceneSize;
        this.camera.orthoBottom = -tOrtho;
        this.camera.orthoLeft = -tOrtho * tAspect;
        this.camera.orthoRight = tOrtho * tAspect;
    }

    onPointerEvents() {
        this.scene.onPointerObservable.add((pointerInfo) => {
            switch (pointerInfo.type) {
                // TODO: should I rather use window.addEventListener('click')
                case PointerEventTypes.POINTERTAP:
                    if (this.objects.sleigh.sprite) {
                        this.createGift(this.objects.sleigh.sprite.position.x);

                        if (this.homeService.data && !this.homeService.data.settings.disableAudio) {
                            this.assets.giftFallSound.play();
                        }
                    }
                    break;
                // case PointerEventTypes.POINTERDOUBLETAP:
                //     console.log('POINTER DOUBLE-TAP');
                //     break;
            }
        });
    }

    activateAutoHorizontalScroll() {
        const finishXPosition = this.lastHouseXPosition + 3 /*half sled width*/ + 6 /*full sled width*/;

        // Sled sprite animation
        this.objects.sleigh.sprite!.playAnimation(0, 4, true, 100, () => { });

        this.objects.camera.observer = this.scene.onBeforeRenderObservable.add(() => {
            this.objects.sleigh.sprite!.position.x += Math.sin(this.level!.speed);
            this.camera.position.x += Math.sin(this.level!.speed);

            if (this.camera.position.x > finishXPosition) {
                this.onFinish();
            }
        });
    }

    deactivateAutoHorizontalScroll() {
        this.scene.onBeforeRenderObservable.remove(this.objects.camera.observer);
        this.objects.sleigh.sprite!.stopAnimation();
    }

    pause() {
        this.deactivateAutoHorizontalScroll();
    }

    resume() {
        this.activateAutoHorizontalScroll();
    }

    restart() {
        // Score
        this.score = 0;

        // Positions
        this.camera.position.x = 0;
        if (this.objects.sleigh.sprite) {
            this.objects.sleigh.sprite.position.x = -1;
        }

        // Reset dropzones
        this.objects.house.mesh.forEach(x => x['dropZoneSuccess'] = null);

        // Reset lights
        this.objects.house.spriteManager.small!.sprites.forEach(x => x.cellIndex = 0);
        this.objects.house.spriteManager.medium!.sprites.forEach(x => x.cellIndex = 0);
        this.objects.house.spriteManager.large!.sprites.forEach(x => x.cellIndex = 0);

        this.activateAutoHorizontalScroll();
    }

    onFinish() {
        this.deactivateAutoHorizontalScroll();
        this.finished.emit(this.score);
    }
}



export class CustomLoadingScreen implements ILoadingScreen {

    loadingUIBackgroundColor: string;
    loadingUIText: string;

    constructor(public element: HTMLDivElement) { }

    displayLoadingUI() {
        this.element.style.display = 'flex';
    }

    hideLoadingUI() {
        this.element.style.display = 'none';
        console.log('this will maybe hit twice because the scene and assets both use this');
    }
}
