import { Mesh, Observer, Scene, Sprite, SpriteManager, StandardMaterial } from 'babylonjs';

export class Objects {

    constructor() {
        this.camera = { observer: null };
        this.background = { material: null, mesh: [] };
        this.foreground = { spriteManager: null, sprite: [] };
        this.gift = { material: null, sourceMesh: null, mesh: [] };
        this.house = {
            spriteManager: {
                small: null,
                medium: null,
                large: null
            },
            mesh: []
        };
        this.sleigh = { spriteManager: null, sprite: null, mesh: null };
    }

    camera: {
        observer: Observer<Scene> | null
    };
    background: {
        material: StandardMaterial | null,
        mesh: Array<Mesh>
    };
    foreground: {
        spriteManager: SpriteManager | null,
        sprite: Array<Sprite>,
    };
    gift: {
        material: StandardMaterial | null,
        sourceMesh: Mesh | null,
        mesh: Array<Mesh>
    };
    house: {
        spriteManager: { small: SpriteManager | null, medium: SpriteManager | null, large: SpriteManager | null },
        mesh: Array<Mesh>
    };
    sleigh: {
        spriteManager: SpriteManager | null,
        sprite: Sprite | null,
        mesh: Mesh | null,
    };
}
