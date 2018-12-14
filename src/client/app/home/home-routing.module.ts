import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NavigationType } from '../shared/navigation/navigation-type.enum';
import { DonateComponent } from './donate/donate.component';
import { HomeComponent } from './home/home.component';
import { LevelComponent } from './level/level.component';
import { LevelsComponent } from './levels/levels.component';
import { StoreComponent } from './store/store.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '', component: HomeComponent, pathMatch: 'full',
                data: { title: 'Home' }
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
                path: 'donate', component: DonateComponent, pathMatch: 'full',
                data: { title: 'Donate', nav: NavigationType.Back }
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
