import { Component, Input, OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-finish-dialog',
  templateUrl: './finish-dialog.component.html',
  styleUrls: ['./finish-dialog.component.scss']
})
export class FinishDialogComponent implements OnInit {

  @Input() bestScore: number;
  @Input() score: number;

  constructor(private gameService: GameService) { }

  ngOnInit() {
  }

  restart() {
    this.gameService.restart();
  }
}
