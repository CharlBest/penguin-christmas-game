import { Component } from '@angular/core';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(public homeService: HomeService) { }

  playAudio() {
    this.homeService.backgroundAudio.play();

    if (this.homeService.data) {
      this.homeService.data.settings.audio = true;
      this.homeService.save();
    }
  }

  pauseAudio() {
    this.homeService.backgroundAudio.pause();

    if (this.homeService.data) {
      this.homeService.data.settings.audio = false;
      this.homeService.save();
    }
  }
}
