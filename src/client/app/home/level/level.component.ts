import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { GameService } from '../game.service';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingScreen') loadingScreen: ElementRef<HTMLDivElement>;

  constructor(public gameService: GameService,
    private dialog: MatDialog) { }

  ngAfterViewInit() {
    this.gameService.init(this.canvas.nativeElement, this.loadingScreen.nativeElement);
  }

  openMenu() {
    this.gameService.pause();
    this.dialog.open(MenuDialogComponent, { disableClose: true });
  }

  ngOnDestroy() {
    this.gameService.engine.dispose();
  }
}
