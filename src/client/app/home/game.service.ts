import { EventEmitter, Injectable, Output } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { AssetsManager, Axis, Camera, Engine, FreeCamera, HemisphericLight, ILoadingScreen, Mesh, MeshBuilder, Observer, PhysicsImpostor, PointerEventTypes, Scene, Sound, Space, Sprite, SpriteManager, StandardMaterial, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';

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
    levelId: number;
    lastHouseXPosition: number;

    constructor() { }

    init(canvas: HTMLCanvasElement, loadingScreenElement: HTMLDivElement, levelId: number) {
        this.levelId = levelId;

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

    loadAssets() {
        // Assets manager
        this.assetsManager = new AssetsManager(this.scene);

        this.loadSounds();
        this.loadHouses();

        this.assetsManager.addTextureTask('backgroundTexture task', 'assets/game/images/background.svg').onSuccess = (task) => {
            this.objects.background.material = new StandardMaterial('backgroundMaterial', this.scene);
            this.objects.background.material.diffuseTexture = task.texture;
            this.objects.background.material.opacityTexture = task.texture;

            for (let x = 0; x < 30; x++) {
                this.createBackground(x * 10);
            }
        };

        // assetsManager.addMeshTask('giftTexture task', '', 'assets/game/objects/', 'gift.gltf').onSuccess = (task) => {
        this.assetsManager.addTextureTask('giftTexture task', 'assets/game/images/gift.svg').onSuccess = (task) => {
            this.objects.gift.material = new StandardMaterial('giftMaterial', this.scene);
            this.objects.gift.material.diffuseTexture = task.texture;
            this.objects.gift.material.opacityTexture = task.texture;
        };

        this.assetsManager.addTextureTask('sleighTexture task', 'assets/game/images/sleigh.svg').onSuccess = (task) => {
            this.objects.sleigh.material = new StandardMaterial('sleighMaterial', this.scene);
            this.objects.sleigh.material.diffuseTexture = task.texture;
            this.objects.sleigh.material.opacityTexture = task.texture;

            this.createSleigh();
        };

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
            30, 5, this.scene);
        this.objects.house.spriteManager.small.cellWidth = HouseSize.small.width * 100;
        this.objects.house.spriteManager.small.cellHeight = HouseSize.small.fullHeight * 100;

        this.objects.house.spriteManager.medium = new SpriteManager('mediumHouseSpriteManager', 'assets/game/images/medium-house.png',
            30, 5, this.scene);
        this.objects.house.spriteManager.medium.cellWidth = HouseSize.medium.width * 100;
        this.objects.house.spriteManager.medium.cellHeight = HouseSize.medium.fullHeight * 100;

        this.objects.house.spriteManager.large = new SpriteManager('largeHouseSpriteManager', 'assets/game/images/large-house.png',
            30, 5, this.scene);
        this.objects.house.spriteManager.large.cellWidth = HouseSize.large.width * 100;
        this.objects.house.spriteManager.large.cellHeight = HouseSize.large.fullHeight * 100;

        const level = levels.find(x => x.id === this.levelId);
        if (level) {
            // Set previous house widths
            let previousHousePosition = 0;
            let previousHouseWidth = 0;
            level.houses.forEach(x => {
                x.previousHousePosition = previousHousePosition + (previousHouseWidth / 2) + (x.size.width / 2) + x.xPosition;

                previousHouseWidth = x.size.width;
                previousHousePosition = x.previousHousePosition;
            });
            this.lastHouseXPosition = previousHousePosition;

            for (const house of level.houses) {
                this.createHouse(house);
            }
        }

        // this.assetsManager.addTextureTask('smallHouseTexture task', 'assets/game/images/small-house.svg').onSuccess = (task) => {
        //     housesReadyCount++;
        //     this.objects.house.material.small = new StandardMaterial('smallHouseMaterial', this.scene);
        //     this.objects.house.material.small.diffuseTexture = task.texture;
        //     this.objects.house.material.small.opacityTexture = task.texture;

        //     init();
        // };

        // this.assetsManager.addTextureTask('mediumHouseTexture task', 'assets/game/images/medium-house.svg').onSuccess = (task) => {
        //     housesReadyCount++;
        //     this.objects.house.material.medium = new StandardMaterial('mediumHouseMaterial', this.scene);
        //     this.objects.house.material.medium.diffuseTexture = task.texture;
        //     this.objects.house.material.medium.opacityTexture = task.texture;

        //     init();
        // };

        // this.assetsManager.addTextureTask('largeHouseTexture task', 'assets/game/images/large-house.svg').onSuccess = (task) => {
        //     housesReadyCount++;
        //     this.objects.house.material.large = new StandardMaterial('largeHouseMaterial', this.scene);
        //     this.objects.house.material.large.diffuseTexture = task.texture;
        //     this.objects.house.material.large.opacityTexture = task.texture;

        //     init();
        // };
    }

    customLoadingScreen(loadingScreenElement: HTMLDivElement) {
        const loadingScreen = new CustomLoadingScreen(loadingScreenElement);
        this.engine.loadingScreen = loadingScreen;
    }

    createHouse(house: House) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`housePlane-${this.objects.house.mesh.length + 1}`,
                { width: house.size.width, height: house.size.fullHeight }, this.scene);
        // mesh.material = this.objects.house.material[house.size.name];
        mesh.position.x = house.previousHousePosition;
        mesh.position.y = (house.size.fullHeight / 2) - 3.5 /*Lower house floor*/;
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
            .CreateBox(`housePlane-${this.objects.house.mesh.length + 1}-inner`,
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
            .CreateGround(`dropZonePlane-${this.objects.house.mesh.length + 1}`, { width: 1, height: 4 }, this.scene);
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
                    giftMesh.visibility = 0;
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
        // Mesh
        const mesh = MeshBuilder.CreateBox('sleighPlane', { width: 6, height: 2 }, this.scene);
        mesh.material = this.objects.sleigh.material;
        mesh.position.x = -1;
        mesh.position.y = 4;

        this.objects.sleigh.mesh = mesh;

        // Start auto scroll scene
        this.activateAutoHorizontalScroll();
    }

    createBackground(x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`backgroundPlane-${this.objects.background.mesh.length + 1}`, { width: 10, height: 10 }, this.scene);

        mesh.material = this.objects.background.material;
        mesh.position.x = x - 50; // -50 is to compensate for left offset
        mesh.position.y = 0;
        mesh.position.z = 10;

        // Save
        this.objects.background.mesh.push(mesh);
    }

    createGift(x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`giftPlane-${this.objects.gift.mesh.length + 1}`, { size: 0.7 }, this.scene);
        mesh.material = this.objects.gift.material;
        mesh.position.x = x - 2;
        mesh.position.y = 3.5;
        // TODO: fix gift going behind the house
        mesh.position.z = 2;

        // Save
        this.objects.gift.mesh.push(mesh);

        // Physics
        mesh.physicsImpostor =
            new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 1, restitution: 0.9 }, this.scene);

        // GLTF object
        // const gift = this.objects.gift.mesh[0].clone(`giftPlane-${this.objects.gift.mesh.length + 1}`, null);
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
                    if (this.objects.sleigh.mesh) {
                        this.createGift(this.objects.sleigh.mesh.position.x);
                        this.assets.giftFallSound.play();
                    }
                    break;
                // case PointerEventTypes.POINTERDOUBLETAP:
                //     console.log('POINTER DOUBLE-TAP');
                //     break;
            }
        });
    }

    activateAutoHorizontalScroll() {
        const speed = 0.04;
        const finishXPosition = this.lastHouseXPosition + 3 /*half sled width*/ + 6 /*full sled width*/;

        if (this.objects.sleigh.mesh) {
            this.objects.sleigh.observer = this.objects.sleigh.mesh.onBeforeRenderObservable.add(() => {
                this.objects.sleigh.mesh!.position.x += Math.sin(speed);
            });
        }

        this.objects.camera.observer = this.scene.onBeforeRenderObservable.add(() => {
            this.camera.position.x += Math.sin(speed);

            if (this.camera.position.x > finishXPosition) {
                this.onFinish();
            }
        });
    }

    deactivateAutoHorizontalScroll() {
        if (this.objects.sleigh.mesh) {
            this.objects.sleigh.mesh.onBeforeRenderObservable.remove(this.objects.sleigh.observer);
        }

        this.scene.onBeforeRenderObservable.remove(this.objects.camera.observer);
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
        if (this.objects.sleigh.mesh) {
            this.objects.sleigh.mesh.position.x = -1;
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


class Assets {
    countdownSound: Sound;
    backgroundSound: Sound;
    giftFallSound: Sound;
}

class Objects {

    constructor() {
        this.camera = { observer: null };
        this.background = { material: null, mesh: [] };
        this.gift = { material: null, mesh: [] };
        this.house = {
            spriteManager: {
                small: null,
                medium: null,
                large: null
            },
            mesh: []
        };
        this.sleigh = { material: null, mesh: null, observer: null };
    }

    camera: {
        observer: Observer<Scene> | null
    };
    background: {
        material: StandardMaterial | null,
        mesh: Array<Mesh>
    };
    gift: {
        material: StandardMaterial | null,
        mesh: Array<Mesh>
    };
    house: {
        spriteManager: { small: SpriteManager | null, medium: SpriteManager | null, large: SpriteManager | null },
        mesh: Array<Mesh>
    };
    sleigh: {
        material: StandardMaterial | null,
        mesh: Mesh | null,
        observer: Observer<Mesh> | null
    };
}

class CustomLoadingScreen implements ILoadingScreen {

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

class House {
    previousHousePosition: number;

    constructor(public size: HouseSize, public xPosition: number) {

    }
}

class HouseSize {
    static small: HouseSize = {
        name: 'small',
        width: 3,
        height: 2.5,
        fullHeight: 3,
        chimneyPosition: 1.5
    };

    // TODO: for some reason the houseCollisionMesh isn't aligning with medium house
    static medium: HouseSize = {
        name: 'medium',
        width: 4,
        height: 2.5,
        fullHeight: 3.2,
        chimneyPosition: 2
    };
    static large: HouseSize = {
        name: 'large',
        width: 6,
        height: 4,
        fullHeight: 4.8,
        chimneyPosition: 3
    };

    name: string;
    width: number;
    height: number;
    fullHeight: number;
    chimneyPosition: number;
}


const levels = [
    {
        id: 1,
        houses: [
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 0.4),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
        ]
    },
    {
        id: 2,
        houses: [
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
        ]
    },
    {
        id: 3,
        houses: [
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
        ]
    },
    {
        id: 4,
        houses: [
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
        ]
    },
    {
        id: 5,
        houses: [
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 3),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.medium, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.small, 2),
            new House(HouseSize.large, 2),
            new House(HouseSize.large, 1),
            new House(HouseSize.medium, 2),
        ]
    },
];
