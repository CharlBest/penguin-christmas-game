import { Injectable } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { AssetsManager, Axis, Camera, Engine, FreeCamera, HemisphericLight, ILoadingScreen, Mesh, MeshBuilder, Observer, PhysicsImpostor, PointerEventTypes, Scene, Sound, Space, StandardMaterial, Vector3 } from 'babylonjs';
import 'babylonjs-loaders';

// import * as BABYLON from 'babylonjs';
// import * as GUI from 'babylonjs-gui';
// import { AdvancedDynamicTexture, Button } from 'babylonjs-gui';
// import BABYLONGUI = require('babylonjs-gui');

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

// TODO:
// Add music
// Add menu
// Add countdown
// Add colision
// TODO: remove console.logs
// TODO: Fade out loading screen when finished
// TODO: add progress bar to loading screen

@Injectable({
    providedIn: 'root'
})
export class GameService {
    engine: Engine;
    camera: Camera;
    scene: Scene;

    assets: Assets = new Assets();
    objects: Objects = new Objects();

    assetManagerProgress = 0;
    score = 0;

    constructor() { }

    init(canvas: HTMLCanvasElement, loadingScreenElement: HTMLDivElement) {
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
        const assetsManager = new AssetsManager(this.scene);

        assetsManager.addBinaryFileTask('countdownSound task', 'assets/game/sounds/countdown.m4a').onSuccess = (task) => {
            this.assets.countdownSound = new Sound('countdownSound', task.data, this.scene, soundsReady);
        };

        assetsManager.addBinaryFileTask('backgroundSound task', 'assets/game/sounds/background.mp3').onSuccess = (task) => {
            this.assets.backgroundSound = new Sound('backgroundSound', task.data, this.scene, soundsReady, { loop: true });
        };

        assetsManager.addBinaryFileTask('giftFallSound task', 'assets/game/sounds/gift-fall.mp3').onSuccess = (task) => {
            this.assets.giftFallSound = new Sound('giftFallSound', task.data, this.scene, soundsReady);
        };

        assetsManager.addTextureTask('backgroundTexture task', 'assets/game/images/background.svg').onSuccess = (task) => {
            this.objects.background.material = new StandardMaterial('backgroundMaterial', this.scene);
            this.objects.background.material.diffuseTexture = task.texture;
            this.objects.background.material.opacityTexture = task.texture;

            for (let x = 0; x < 30; x++) {
                this.createBackground(x * 10);
            }
        };

        assetsManager.addTextureTask('houseTexture task', 'assets/game/images/house.svg').onSuccess = (task) => {
            this.objects.house.material = new StandardMaterial('houseMaterial', this.scene);
            this.objects.house.material.diffuseTexture = task.texture;
            this.objects.house.material.opacityTexture = task.texture;

            for (let x = 0; x < 30; x++) {
                this.createHouse(x * 8);
            }
        };

        // assetsManager.addMeshTask('giftTexture task', '', 'assets/game/objects/', 'gift.gltf').onSuccess = (task) => {
        assetsManager.addTextureTask('giftTexture task', 'assets/game/images/gift.svg').onSuccess = (task) => {
            this.objects.gift.material = new StandardMaterial('giftMaterial', this.scene);
            this.objects.gift.material.diffuseTexture = task.texture;
            this.objects.gift.material.opacityTexture = task.texture;
        };

        assetsManager.addTextureTask('sleighTexture task', 'assets/game/images/sleigh.svg').onSuccess = (task) => {
            this.objects.sleigh.material = new StandardMaterial('sleighMaterial', this.scene);
            this.objects.sleigh.material.diffuseTexture = task.texture;
            this.objects.sleigh.material.opacityTexture = task.texture;

            this.createSleigh();
        };

        let soundsReadyCount = 0;

        const soundsReady = () => {
            soundsReadyCount++;
            if (soundsReadyCount === 3) {
                console.log('All sounds are ready');
            }
        };

        assetsManager.onFinish = (tasks) => {
            this.engine.runRenderLoop(() => {
                this.scene.render();
            });
        };

        assetsManager.load();

        assetsManager.onProgressObservable.add((event) => {
            this.assetManagerProgress = ((event.totalCount - event.remainingCount) / event.totalCount) * 100;
        });
    }

    customLoadingScreen(loadingScreenElement: HTMLDivElement) {
        const loadingScreen = new CustomLoadingScreen(loadingScreenElement);
        this.engine.loadingScreen = loadingScreen;
    }

    createHouse(x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateBox(`housePlane-${this.objects.house.mesh.length + 1}`, { width: 4, height: 4 }, this.scene);
        mesh.material = this.objects.house.material;
        mesh.position.x = x;
        mesh.position.y = -2;

        const houseCollisionMesh = MeshBuilder
            .CreateBox(`housePlane-${this.objects.house.mesh.length + 1}-inner`, { width: 4, height: 3.4, depth: 4 }, this.scene);
        houseCollisionMesh.position.x = x;
        houseCollisionMesh.position.y = -2.4;
        houseCollisionMesh.visibility = 0;

        // Save
        this.objects.house.mesh.push(houseCollisionMesh);

        // Physics
        houseCollisionMesh.physicsImpostor =
            new PhysicsImpostor(houseCollisionMesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);

        this.createChimney(mesh.position.x - 1.3);
        this.createChimney(mesh.position.x + 0.2);

        // createGiftDropZone
        const dropZone = MeshBuilder
            .CreateGround(`dropZonePlane-${this.objects.house.mesh.length}`, { width: 1.5, height: 4 }, this.scene);
        dropZone.position.x = x - 0.5;
        dropZone.position.y = -0.5;

        // Physics
        dropZone.physicsImpostor =
            new PhysicsImpostor(dropZone, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);

        // Points
        dropZone.physicsImpostor.onCollideEvent = (collider: PhysicsImpostor, collidedWith: PhysicsImpostor) => {
            if (!collider.object['dropZoneSuccess']) {
                collider.object['dropZoneSuccess'] = true;
                this.score += 100;
                const giftMesh = this.objects.gift.mesh.find(y => y.id === collidedWith.object['id']);
                if (giftMesh) {
                    giftMesh.visibility = 0;
                }
            }
            // console.log(collider.object['id'], collidedWith.object['id']);
        };
    }

    createChimney(x: number) {
        // Mesh
        const mesh = MeshBuilder
            .CreateCylinder(`chimneyCylinder-${this.objects.house.mesh.length}-${Math.random()}`, { diameter: 0.1, height: 4 }, this.scene);
        mesh.position.x = x;
        mesh.position.y = 0;
        mesh.rotate(Axis.X, Math.PI / 2, Space.WORLD);
        mesh.visibility = 0;

        // Physics
        mesh.physicsImpostor =
            new PhysicsImpostor(mesh, PhysicsImpostor.BoxImpostor, { mass: 0, restitution: 0.9 }, this.scene);
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
            .CreateBox(`giftPlane-${this.objects.gift.mesh.length + 1}`, { width: 1, height: 1, depth: 1 }, this.scene);
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
        if (this.objects.sleigh.mesh) {
            this.objects.sleigh.observer = this.objects.sleigh.mesh.onBeforeRenderObservable.add(() => {
                this.objects.sleigh.mesh!.position.x += Math.sin(0.02);
            });
        }

        this.objects.camera.observer = this.scene.onBeforeRenderObservable.add(() => {
            this.camera.position.x += Math.sin(0.02);
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
        this.score = 0;
        this.camera.position.x = 0;
        if (this.objects.sleigh.mesh) {
            this.objects.sleigh.mesh.position.x = -1;
        }
        this.activateAutoHorizontalScroll();
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
        this.house = { material: null, mesh: [] };
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
        material: StandardMaterial | null,
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
