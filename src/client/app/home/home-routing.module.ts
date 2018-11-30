import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { DonateComponent } from './donate/donate.component';
import { EnterComponent } from './enter/enter.component';
import { HomeComponent } from './home/home.component';
import { LevelComponent } from './level/level.component';
import { LevelsComponent } from './levels/levels.component';
import { SettingsComponent } from './settings/settings.component';
import { StoreComponent } from './store/store.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: EnterComponent, pathMatch: 'full',
                data: { title: 'Enter', nav: NavigationType.Primary }
            },
            {
                path: 'menu', component: HomeComponent, pathMatch: 'full',
                data: { title: 'Home', nav: NavigationType.Primary }
            },
            {
                path: 'levels', component: LevelsComponent, pathMatch: 'full',
                data: { title: 'Levels', nav: NavigationType.Primary }
            },
            {
                path: 'level/:id', component: LevelComponent, pathMatch: 'full',
                data: { title: 'Level', nav: NavigationType.Primary }
            },
            {
                path: 'settings', component: SettingsComponent, pathMatch: 'full',
                data: { title: 'Settings', nav: NavigationType.Primary }
            },
            {
                path: 'donate', component: DonateComponent, pathMatch: 'full',
                data: { title: 'Donate', nav: NavigationType.Primary }
            },
            {
                path: 'store', component: StoreComponent, pathMatch: 'full',
                data: { title: 'Store', nav: NavigationType.Primary }
            },
        ])
    ],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
