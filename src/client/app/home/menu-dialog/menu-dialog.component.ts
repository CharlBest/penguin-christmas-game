import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { BuilderDialogComponent } from '../builder-dialog/builder-dialog.component';
import { GameService } from '../game.service';

@Component({
  selector: 'app-menu-dialog',
  templateUrl: './menu-dialog.component.html',
  styleUrls: ['./menu-dialog.component.scss']
})
export class MenuDialogComponent implements OnInit {

  constructor(private gameService: GameService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  resume() {
    this.gameService.resume();
  }

  restart() {
    this.gameService.restart();
  }

  openLevelBuilder() {
    this.dialog.open(BuilderDialogComponent, { disableClose: true });
  }
}
