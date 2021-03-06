import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { FormErrorsModule } from '../shared/form-errors/form-errors.module';
import { TutorialModule } from '../shared/tutorial/tutorial.module';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login/login.component';

const materialModules = [
  MatButtonModule,
  MatCardModule,
  MatInputModule,
  MatProgressSpinnerModule,
];

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ReactiveFormsModule,
    TutorialModule,
    FormErrorsModule,
    ...materialModules,
  ],
  declarations: [
    LoginComponent
  ]
})
export class LoginModule { }
