import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements AfterViewInit {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingScreen') loadingScreen: ElementRef<HTMLDivElement>;

  constructor(public gameService: GameService) { }

  ngAfterViewInit() {
    this.gameService.init(this.canvas.nativeElement, this.loadingScreen.nativeElement);
  }
}
