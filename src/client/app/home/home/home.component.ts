import { Component } from '@angular/core';
import { ShareService } from '../../shared/services/share.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private shareService: ShareService) { }

  share() {
    const url = ['/'];
    if (!this.shareService.webShareWithUrl('Game', url)) {
      console.log('Web share API not found');
    }
  }
}
