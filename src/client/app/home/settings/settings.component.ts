import { Component } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

  constructor(public homeService: HomeService) { }

  getJSONExample() {
    return JSON.stringify([
      {
        'id': 1,
        'speed': 0.04,
        'houses': [
          { 'size': 'small', 'position': 2 },
          { 'size': 'medium', 'position': 3 },
          { 'size': 'large', 'position': 1 }
        ]
      },
      {
        'id': 2,
        'speed': 0.06,
        'houses': [
          { 'size': 'large', 'position': 4 },
          { 'size': 'medium', 'position': 2 },
          { 'size': 'small', 'position': 3 }
        ]
      }
    ]);
  }
}
