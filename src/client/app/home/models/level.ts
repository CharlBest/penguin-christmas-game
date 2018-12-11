import { House } from './house';

export class Level {
    speed: number;
    houses: Array<House>;

    constructor(public id: number) {
        this.speed = 0.04;
        this.houses = [];
    }
}
