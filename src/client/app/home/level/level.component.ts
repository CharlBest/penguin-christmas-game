import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService, Level } from '../home.service';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss']
})
export class LevelComponent implements OnInit, OnDestroy {

  @ViewChild('background') background: ElementRef<HTMLDivElement>;
  @ViewChild('sled') sled: ElementRef<HTMLDivElement>;
  @ViewChild('screen') screen: ElementRef<HTMLDivElement>;

  levelId: number;
  housePositions: Array<number>;
  presents = 0;
  score = 0;
  bestScore = 0;
  presentDropAnimationDuration = 1500;
  houseWidth = 100;
  presentWidth = 30;
  clickLock = false;
  countdown = 0;

  showCountdownOne = false;
  showCountdownTwo = false;
  showCountdownThree = true;

  backgroundIntervalId: any;
  backgroundLeftPosition = 0;

  showMenu = false;
  showEndScreen = false;

  countdownAudio: HTMLAudioElement = new Audio('assets/game/countdown.m4a');

  constructor(public homeService: HomeService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.has('id')) {
        const levelId = params.get('id');
        if (levelId) {
          this.levelId = +levelId;
          this.housePositions = levels.find(x => x.id === this.levelId)!.houses;
          const storedLevel = this.homeService.data!.levels.find(x => x.id === this.levelId);
          if (storedLevel) {
            this.bestScore = storedLevel.bestScore;
          }
          this.startCountdown();
        }
      }
    });
  }

  startCountdown() {
    this.countdownAudio.play();

    const timeoutOne = setTimeout(() => {
      this.showCountdownOne = false;
      this.showCountdownTwo = true;
      this.showCountdownThree = false;

      clearTimeout(timeoutOne);
    }, 1000);

    const timeoutTwo = setTimeout(() => {
      this.showCountdownOne = true;
      this.showCountdownTwo = false;
      this.showCountdownThree = false;

      clearTimeout(timeoutTwo);
    }, 2000);

    const timeoutThree = setTimeout(() => {
      this.showCountdownOne = false;
      this.showCountdownTwo = false;
      this.showCountdownThree = false;

      this.start();

      clearTimeout(timeoutThree);
    }, 3000);
  }

  start() {
    this.screen.nativeElement.addEventListener('click', this.onClick.bind(this));
    this.startBackgroundMove();
  }

  startBackgroundMove() {
    const lastHousePosition = this.housePositions[this.housePositions.length - 1] + this.houseWidth;

    this.backgroundIntervalId = setInterval(() => {
      this.backgroundLeftPosition += 1 + ((this.score === 0 ? 100 : this.score) / 100 * 0.1);
      // el.style.left = `-${this.backgroundLeftPosition}px`;
      this.background.nativeElement.style.transform = `translateX(-${this.backgroundLeftPosition}px)`;

      // Is done
      if (this.backgroundLeftPosition > lastHousePosition) {
        this.isDone();
      }
    }, 1000 / 60);
  }

  onClick() {
    if (this.clickLock) {
      return;
    }

    // TODO: this should be muted when sonud option is tured off
    const fallAudio = new Audio('assets/game/fall.mp3');
    fallAudio.play();

    const presentLeftStartPosition = this.sled.nativeElement.offsetLeft;

    this.clickLock = true;
    this.activateClickLock();

    this.presents++;

    const timeout = setTimeout(() => {
      const matrix = new WebKitCSSMatrix(window.getComputedStyle(this.background.nativeElement).webkitTransform!);
      const dropPosition = matrix.m41 * -1;

      // TODO: this can be optomized
      const leftDropPosition = dropPosition + presentLeftStartPosition;
      const rightDropPosition = leftDropPosition + this.presentWidth;

      this.housePositions.forEach(x => {
        if ((leftDropPosition > x && leftDropPosition < x + this.houseWidth) &&
          (rightDropPosition > x && rightDropPosition < x + this.houseWidth)) {
          this.score += 100;
        }
      });

      clearTimeout(timeout);
    }, this.presentDropAnimationDuration);
  }

  openMenu() {
    this.showMenu = true;
    clearInterval(this.backgroundIntervalId);
  }

  closeMenu() {
    this.showMenu = false;
    this.startBackgroundMove();
  }

  activateClickLock() {
    const timeout = setTimeout(() => {
      this.clickLock = false;
      clearTimeout(timeout);
    }, this.presentDropAnimationDuration);
  }

  createArray(num: number) {
    return new Array(num);
  }

  reset() {
    this.backgroundLeftPosition = 0;
    this.score = 0;
    this.presents = 0;
    this.showCountdownThree = true;
    this.showEndScreen = false;

    // TODO: this could be centralized. Improve
    this.background.nativeElement.style.transform = `translateX(0px)`;
  }

  restart() {
    this.reset();
    this.showMenu = false;
    window.removeEventListener('click', this.onClick);
    this.startCountdown();
  }

  ngOnDestroy() {
    window.removeEventListener('click', this.onClick);
  }

  isDone() {
    this.showEndScreen = true;
    clearInterval(this.backgroundIntervalId);

    if (this.homeService.data) {
      const level = this.homeService.data.levels.find(x => x.id === this.levelId);
      if (level) {
        if (this.score > level.bestScore) {
          level.bestScore = this.score;
          this.homeService.save();
        }
      } else {
        this.homeService.data.levels.push(new Level(this.levelId, this.score));
        this.homeService.save();
      }
    }
  }
}

const levels = [
  {
    id: 1,
    houses: [300, 600, 900, 1200, 1350, 1550, 1800, 2100, 2250, 2400]
  },
  {
    id: 2,
    houses: [200, 600, 900, 1200, 1350, 1550, 1800, 2100, 2250, 2400]
  },
  {
    id: 3,
    houses: [200, 600, 900, 1200, 1350, 1550, 1800, 2100, 2250, 2400]
  },
  {
    id: 4,
    houses: [200, 600, 900, 1200, 1350, 1550, 1800, 2100, 2250, 2400]
  },
  {
    id: 5,
    houses: [200, 600, 900, 1200, 1350, 1550, 1800, 2100, 2250, 2400]
  }
];
