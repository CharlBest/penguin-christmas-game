import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatBottomSheet, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { TutorialType } from '../../../../../shared/view-models/tutorial/tutorial-type.enum';
import { TutorialService } from '../../../shared/tutorial/tutorial.service';
import { WebSocketService } from '../../../shared/websocket.service';
import { AuthService } from '../../auth.service';
import { BreakpointService } from '../../breakpoint.service';
import { PaymentDialogService } from '../../payment-dialog/payment-dialog.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  loggedInUserId: number = this.authService.getLoggedInUserId();
  activeNavigation = Navigation.Primary;
  navigationTypes = Navigation;
  navigationBackTitle = '';
  backRouterPath: string;
  tutorialTypeEnum = TutorialType;
  private _isDarkTheme: boolean;
  private _isDarkThemeStorageKey = 'is_dark_theme';

  constructor(private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private titleService: Title,
    private location: Location,
    private tutorialService: TutorialService,
    public snackBar: MatSnackBar,
    private paymentDialogService: PaymentDialogService,
    private webSocketService: WebSocketService,
    public bottomSheet: MatBottomSheet,
    public bpService: BreakpointService) {
    this.checkHasVisited();
  }

  ngOnInit() {
    this.themeOnInit();

    this.authService.loggedInUserId$.subscribe(id => {
      this.loggedInUserId = id;
    });

    this.router.events
      .pipe(
        map(() => this.route),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        })
      )
      .subscribe((event) => {
        if (event.snapshot.data) {
          const title = event.snapshot.data['title'];
          if (title !== null) {
            this.titleService.setTitle(title);
            this.navigationBackTitle = title;
          }

          const nav = event.snapshot.data['nav'] as Navigation;
          if (nav !== null) {
            this.activeNavigation = nav;
          }

          const backRouterPath = event.snapshot.data['backRouterPath'] as string;
          if (backRouterPath !== null) {
            this.backRouterPath = backRouterPath;
          } else {
            this.backRouterPath = null;
          }
        }
      });

    this.webSocketService.messages.subscribe((data) => {
      this.snackBar.open(data, 'Say hallo back', {
        duration: 5000,
        verticalPosition: this.bpService.isWeb ? 'top' : 'bottom',
        horizontalPosition: this.bpService.isWeb ? 'right' : 'center'
      }).onAction().subscribe(() => {
        this.webSocketService.messages.next('Hallo to you too');
      });
    });
  }

  logout() {
    this.authService.removeToken();
  }

  back() {
    if (this.backRouterPath !== null && this.backRouterPath !== undefined) {
      this.router.navigate([this.backRouterPath]);
    } else {
      // TODO: check if there is a back otherwise redirect to home/discover page
      this.location.back();
    }
  }

  takeTour() {
    this.tutorialService.activateTutorial(TutorialType.ContextMenu);
  }

  checkHasVisited() {
    const hasVisitedStorageKey = 'has_user_visited';
    const hasUserVisited = localStorage.getItem(hasVisitedStorageKey) === 'true';

    if (!hasUserVisited) {
      localStorage.setItem(hasVisitedStorageKey, 'true');

      this.snackBar.open('Take the tour', 'Go', {
        duration: 20000,
      }).onAction().subscribe(() => {
        this.router.navigate([], { queryParams: { tut: TutorialType.ContextMenu } });
      });
    }
  }

  openPaymentDialog() {
    this.paymentDialogService.open();
  }

  toggleTheme() {
    const darkThemeClass = 'dark-theme';

    this._isDarkTheme = !this._isDarkTheme;

    if (this._isDarkTheme) {
      document.querySelector('app-root').classList.add(darkThemeClass);
    } else {
      document.querySelector('app-root').classList.remove(darkThemeClass);
    }

    this.updateStoredTheme();
  }

  themeOnInit() {
    this._isDarkTheme = localStorage.getItem(this._isDarkThemeStorageKey) === 'true';
    this._isDarkTheme = !this._isDarkTheme;
    this.toggleTheme();
  }

  updateStoredTheme() {
    localStorage.setItem(this._isDarkThemeStorageKey, `${this._isDarkTheme}`);
  }
}

// TODO: move this to another file
export enum Navigation {
  Primary = 1,
  Back = 2
}
