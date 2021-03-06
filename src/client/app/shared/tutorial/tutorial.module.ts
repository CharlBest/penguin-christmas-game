import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';
import { TutorialDirective } from './tutorial.directive';
import { TutorialComponent } from './tutorial/tutorial.component';

const materialModules = [
    MatButtonModule,
    MatIconModule
];

@NgModule({
    imports: [
        CommonModule,
        ...materialModules
    ],
    declarations: [
        TutorialComponent,
        TutorialDirective
    ],
    exports: [
        TutorialComponent,
        TutorialDirective
    ]
})
export class TutorialModule { }
