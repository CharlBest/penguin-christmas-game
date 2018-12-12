import { Injectable } from '@angular/core';
import { House } from './models/house';
import { HouseSize } from './models/house-size';
import { Level } from './models/level';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    levels = levels;

    createHouse(houseSize: string, position: number) {
        return new House(this.getHouseSize(houseSize)!, position);
    }

    getHouseSize(houseSize: string): HouseSize | null {
        let size: HouseSize | null = null;

        switch (houseSize) {
            case 'small':
                size = HouseSize.small;
                break;
            case 'medium':
                size = HouseSize.medium;
                break;
            case 'large':
                size = HouseSize.large;
                break;

            default:
                console.log('How size doesn\'t exist');
                break;
        }

        return size;
    }
}

const levels: Array<Level> = [
    {
        id: 1,
        speed: 0.04,
        giftSize: 0.5,
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
        speed: 0.04,
        giftSize: 0.5,
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
        speed: 0.04,
        giftSize: 0.5,
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
        speed: 0.04,
        giftSize: 0.5,
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
        speed: 0.04,
        giftSize: 0.5,
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
        id: 6,
        speed: 0.04,
        giftSize: 0.5,
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
        id: 7,
        speed: 0.04,
        giftSize: 0.5,
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
        id: 8,
        speed: 0.04,
        giftSize: 0.5,
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
        id: 9,
        speed: 0.04,
        giftSize: 0.5,
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
        id: 10,
        speed: 0.04,
        giftSize: 0.5,
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
