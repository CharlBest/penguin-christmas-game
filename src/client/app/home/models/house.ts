import { HouseSize } from './house-size';

export class House {
    previousHousePosition: number;

    constructor(public size: HouseSize, public xPosition: number) {

    }
}
