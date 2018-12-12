import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { FinishDialogComponent } from '../finish-dialog/finish-dialog.component';
import { GameService } from '../game.service';
import { HomeService, SavedLevel } from '../home.service';
import { MenuDialogComponent } from '../menu-dialog/menu-dialog.component';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('loadingScreen') loadingScreen: ElementRef<HTMLDivElement>;
  levelId: number;

  constructor(public gameService: GameService,
    public homeService: HomeService,
    private dialog: MatDialog,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        const levelId = params.get('id');
        if (levelId) {
          this.levelId = +levelId;
          const storedLevel = this.homeService.data!.levels.find(x => x.id === this.levelId);
          if (storedLevel) {
            this.gameService.bestScore = storedLevel.bestScore;
          }
        }
      }
    });

    this.gameService.finished.subscribe((score: number) => {
      const dialogRef = this.dialog.open(FinishDialogComponent, { disableClose: true });
      dialogRef.componentInstance.score = score;

      if (this.homeService.data) {
        const level = this.homeService.data.levels.find(x => x.id === this.levelId);
        if (level) {
          dialogRef.componentInstance.bestScore = level.bestScore;

          if (score > level.bestScore) {
            level.bestScore = score;
            this.gameService.bestScore = level.bestScore;
            this.homeService.save();
          }
        } else {
          this.gameService.bestScore = score;

          this.homeService.data.levels.push(new SavedLevel(this.levelId, score));
          this.homeService.save();
        }
      }
    });
    this.gameService.init(this.canvas.nativeElement, this.loadingScreen.nativeElement, +this.route.snapshot.params['id']);
  }

  ngAfterViewInit() {
  }

  openMenu() {
    this.gameService.pause();
    this.dialog.open(MenuDialogComponent, { disableClose: true });
  }

  ngOnDestroy() {
    this.gameService.engine.dispose();
  }
}
