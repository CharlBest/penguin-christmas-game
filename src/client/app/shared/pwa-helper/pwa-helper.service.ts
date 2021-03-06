import { Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { NavigationStart, Router, RouterEvent } from '@angular/router';
import { filter, take, tap } from 'rxjs/operators';
import { PWAHelperComponent } from './pwa-helper/pwa-helper.component';

@Injectable()
export class PWAHelperService {

    constructor(private overlay: Overlay,
        private router: Router) { }

    open() {
        const config = new OverlayConfig({
            hasBackdrop: true,
            // backdropClass: 'cdk-overlay-transparent-backdrop',
            positionStrategy: this.overlay.position().global().top().right()
        });

        const overlayRef = this.overlay.create(config);

        overlayRef.backdropClick().subscribe(() => {
            overlayRef.dispose();
        });

        // Close on navigate
        this.router.events.pipe(
            filter((event: RouterEvent) => event instanceof NavigationStart),
            tap(() => overlayRef.dispose()),
            take(1)
        ).subscribe();

        const userProfilePortal = new ComponentPortal(PWAHelperComponent);
        overlayRef.attach(userProfilePortal);
    }
}
