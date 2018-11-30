import { Component } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-levels',
  templateUrl: './levels.component.html',
  styleUrls: ['./levels.component.scss']
})
export class LevelsComponent {
  constructor(private homeService: HomeService) { }

  getBestCore(id: number) {
    const level = this.homeService.data!.levels.find(x => x.id === id);
    return level ? level.bestScore : null;
  }
}
