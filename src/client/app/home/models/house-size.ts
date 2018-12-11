export class HouseSize {
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
