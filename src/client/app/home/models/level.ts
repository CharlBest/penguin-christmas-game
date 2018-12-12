import { House } from './house';

export class Level {
    speed: number;
    giftSize: number;
    houses: Array<House>;

    constructor(public id: number) {
        this.speed = 0.04;
        this.giftSize = 0.5;
        this.houses = [];
    }
}
