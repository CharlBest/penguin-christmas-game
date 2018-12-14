import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule, MatButtonToggleModule, MatCardModule, MatDialogModule, MatExpansionModule, MatIconModule, MatInputModule, MatProgressBarModule, MatProgressSpinnerModule, MatSliderModule } from '@angular/material';
import { ItemModule } from '../item/item.module';
import { GitHubModule } from '../shared/github/github.module';
import { NetworkStatusModule } from '../shared/network-status/network-status.module';
import { BuilderDialogComponent } from './builder-dialog/builder-dialog.component';
import { DonateComponent } from './donate/donate.component';
import { FinishDialogComponent } from './finish-dialog/finish-dialog.component';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { LevelComponent } from './level/level.component';
import { LevelsComponent } from './levels/levels.component';
import { MenuDialogComponent } from './menu-dialog/menu-dialog.component';
import { SettingsComponent } from './settings/settings.component';
import { StoreComponent } from './store/store.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatProgressSpinnerModule,
  MatExpansionModule,
  MatProgressBarModule,
  MatIconModule,
  MatDialogModule,
  MatInputModule,
  MatSliderModule,
  MatButtonToggleModule,
];

@NgModule({
  imports: [
    CommonModule,
    HomeRoutingModule,
    ItemModule,
    GitHubModule,
    NetworkStatusModule,
    FormsModule,
    ...materialModules
  ],
  declarations: [
    HomeComponent,
    LevelsComponent,
    LevelComponent,
    DonateComponent,
    SettingsComponent,
    StoreComponent,
    MenuDialogComponent,
    FinishDialogComponent,
    BuilderDialogComponent,
  ],
  entryComponents: [
    MenuDialogComponent,
    FinishDialogComponent,
    BuilderDialogComponent,
  ]
})
export class HomeModule { }
