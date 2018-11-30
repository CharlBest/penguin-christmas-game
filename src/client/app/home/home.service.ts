import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ItemRoutes } from '../../../shared/routes/item.routes';
import { ItemViewModel } from '../../../shared/view-models/item/item.view-model';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class HomeService {

    localStorageDataKey = 'data';
    backgroundAudio: HTMLAudioElement = new Audio('assets/game/music.mp3');
    data: Data | null;

    constructor(private http: HttpClient) {
        this.data = this.getData();
    }

    private getData(): Data | null {
        const stringData = localStorage.getItem(this.localStorageDataKey);
        try {
            if (stringData) {
                return JSON.parse(stringData);
            } else {
                return new Data();
            }
        } catch {
            return null;
        }
    }

    save() {
        localStorage.setItem(this.localStorageDataKey, JSON.stringify(this.data));
    }

    getItems(pageIndex: number, pageSize?: number): Observable<ItemViewModel[] | null> {
        return this.http.get<ItemViewModel[]>(`${environment.httpDomain}${ItemRoutes.getItems().client({ pageIndex, pageSize })}`);
    }
}

export class Data {

    constructor() {
        this.settings = {
            audio: true
        };
        this.levels = [];
    }

    settings: {
        audio: boolean;
    };

    levels: Array<Level>;
}

export class Level {

    constructor(public id: number, public bestScore: number) {
        this.id = id;
        this.bestScore = bestScore;
    }
}
