import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    localStorageDataKey = 'data';
    backgroundAudio: HTMLAudioElement;
    data: Data | null;

    constructor(private http: HttpClient) {
        this.createBackgroundAudio();
        this.data = this.getData();
    }

    createBackgroundAudio() {
        this.backgroundAudio = new Audio('assets/game/sounds/background.mp3');
        this.backgroundAudio.loop = true;
    }

    private getData(): Data | null {
        const stringData = localStorage.getItem(this.localStorageDataKey);
        try {
            if (stringData) {
                return JSON.parse(stringData);
            } else {
                const data = new Data();
                localStorage.setItem(this.localStorageDataKey, JSON.stringify(data));
                return data;
            }
        } catch {
            return null;
        }
    }

    save() {
        localStorage.setItem(this.localStorageDataKey, JSON.stringify(this.data));
    }

    enableAudio() {
        this.backgroundAudio.play();

        if (this.data) {
            this.data.settings.disableAudio = false;
            this.save();
        }
    }

    disableAudio() {
        this.backgroundAudio.pause();

        if (this.data) {
            this.data.settings.disableAudio = true;
            this.save();
        }
    }
}

export class Data {

    constructor() {
        this.settings = {
            disableAudio: true
        };
        this.levels = [];
    }

    settings: {
        disableAudio: boolean;
    };

    levels: Array<Level>;
}

export class Level {

    constructor(public id: number, public bestScore: number) {
        this.id = id;
        this.bestScore = bestScore;
    }
}
