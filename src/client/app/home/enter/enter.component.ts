import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HomeService } from '../home.service';

@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.scss']
})
export class EnterComponent {
  constructor(private homeService: HomeService,
    private router: Router) { }

  enter() {
    if (this.homeService.data && !this.homeService.data.settings.disableAudio) {
      this.homeService.enableAudio();
    }

    this.router.navigate(['/home/menu']);
  }
}
