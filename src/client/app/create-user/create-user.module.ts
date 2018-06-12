import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatInputModule, MatProgressSpinnerModule } from '@angular/material';
import { CreateUserService } from '../../app/create-user/create-user.service';
import { LoginService } from '../login/login.service';
import { ShowErrorsModule } from '../shared/show-errors/show-errors.module';
import { CreateUserRoutingModule } from './create-user-routing.module';
import { CreateUserComponent } from './create-user/create-user.component';

const materialModules = [
  MatButtonModule,
  MatInputModule,
  MatProgressSpinnerModule,
  MatCardModule,
];

@NgModule({
  imports: [
    CommonModule,
    CreateUserRoutingModule,
    ReactiveFormsModule,
    ShowErrorsModule,
    ...materialModules
  ],
  declarations: [
    CreateUserComponent
  ],
  providers: [
    CreateUserService,
    LoginService
  ]
})
export class CreateUserModule { }
