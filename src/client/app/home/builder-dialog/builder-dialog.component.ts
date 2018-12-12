import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from '../config.service';
import { House } from '../models/house';
import { Level } from '../models/level';

@Component({
  selector: 'app-builder-dialog',
  templateUrl: './builder-dialog.component.html',
  styleUrls: ['./builder-dialog.component.scss']
})
export class BuilderDialogComponent implements OnInit {

  levelId: number;
  exportData: string | null;

  constructor(public configService: ConfigService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    // HACK!!
    this.levelId = +window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
  }

  addHouse(level: Level) {
    const localLevel = this.configService.levels.find(x => x.id === level.id);
    if (localLevel) {
      localLevel.houses.push(this.configService.createHouse('small', 1));
    }
  }

  removeHouse(level: Level, index: number) {
    const localLevel = this.configService.levels.find(x => x.id === level.id);
    if (localLevel) {
      localLevel.houses.splice(index, 1);
    }
  }

  addLevel() {
    this.configService.levels.push(new Level(this.configService.levels.length + 1));
  }

  save() {
    const data = [];

    for (const level of this.configService.levels) {
      const newLevel = {
        id: level.id,
        speed: level.speed,
        giftSize: level.giftSize,
        houses: new Array()
      };
      for (const house of level.houses) {
        newLevel.houses.push({
          size: house.size.name,
          position: +house.xPosition
        });
      }
      data.push(newLevel);
    }

    localStorage.setItem('levels', JSON.stringify(data));
    window.location.reload();
  }

  export() {
    const data = localStorage.getItem('levels');
    this.exportData = data;
  }

  updateHouseSize(house: House, value: string) {
    house.size = this.configService.getHouseSize(value)!;
  }
}
