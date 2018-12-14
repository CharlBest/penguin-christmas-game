import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ShareService } from '../../shared/services/share.service';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private shareService: ShareService,
    public homeService: HomeService,
    private router: Router) { }

  share() {
    const url = ['/'];
    if (!this.shareService.webShareWithUrl('Game', url)) {
      console.log('Web share API not found');
    }
  }

  play() {
    if (this.homeService.data && !this.homeService.data.settings.disableAudio) {
      this.homeService.enableAudio();
    }

    this.router.navigate(['/home/levels']);
  }
}
