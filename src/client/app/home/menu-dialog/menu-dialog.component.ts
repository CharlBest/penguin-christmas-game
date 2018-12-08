import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  resume() {
    this.gameService.resume();
  }

  restart() {
    this.gameService.restart();
  }
}
