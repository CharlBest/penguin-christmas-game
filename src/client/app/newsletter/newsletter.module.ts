import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { NewsletterRoutingModule } from './newsletter-routing.module';
import { NewsletterComponent } from './newsletter/newsletter.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    NewsletterRoutingModule,
    ReactiveFormsModule,
    FormErrorsModule,
    TutorialModule,
    ...materialModules
  ],
  declarations: [
    NewsletterComponent
  ]
})
export class NewsletterModule { }
