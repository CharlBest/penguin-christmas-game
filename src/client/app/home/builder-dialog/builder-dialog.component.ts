import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service';
import { House } from '../models/house';
import { Level } from '../models/level';

@Component({
  selector: 'app-builder-dialog',
  templateUrl: './builder-dialog.component.html',
  styleUrls: ['./builder-dialog.component.scss']
})
export class BuilderDialogComponent implements OnInit {

  level: Level;
  exportData: string | null;

  constructor(private configService: ConfigService,
    private router: Router) { }

  ngOnInit() {
    // HACK!!
    const levelId = +window.location.pathname.substring(window.location.pathname.lastIndexOf('/') + 1, window.location.pathname.length);
    this.level = this.configService.levels.find(x => x.id === levelId)!;
  }

  addHouse() {
    this.level.houses.push(this.configService.createHouse('small', 1));
  }

  removeHouse(index: number) {
    this.level.houses.splice(index, 1);
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

    this.router.navigate(['/home/levels']).then(success => {
      if (success) {
        this.router.navigate(['/home/level', this.level.id]);
      }
    });
  }

  export() {
    const data = localStorage.getItem('levels');
    this.exportData = data;
  }

  updateHouseSize(house: House, value: string) {
    house.size = this.configService.getHouseSize(value)!;
  }
}
