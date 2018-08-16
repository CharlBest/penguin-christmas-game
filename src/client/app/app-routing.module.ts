import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from './shared/auth.service';
import { CustomPreloading } from './shared/custom-preloading';

@NgModule({
  imports: [
    RouterModule.forRoot([
      { path: '', loadChildren: './home/home.module#HomeModule', pathMatch: 'full' },
      // Chrome extension routing workaround
      { path: 'index.extension.html', pathMatch: 'full', redirectTo: '', data: { preload: true } },
      // TODO: add updates consumtion page back in
      { path: 'create-user', loadChildren: './create-user/create-user.module#CreateUserModule' },
      { path: 'login', loadChildren: './login/login.module#LoginModule', data: { preload: true } },
      { path: 'forgot-password', loadChildren: './forgot-password/forgot-password.module#ForgotPasswordModule' },
      { path: 'settings', loadChildren: './settings/settings.module#SettingsModule' },
      { path: 'profile', loadChildren: './profile/profile.module#ProfileModule', data: { preload: true }, canActivate: [AuthService] },
      { path: 'feedback', loadChildren: './feedback/feedback.module#FeedbackModule' },
      { path: 'legal', loadChildren: './legal/legal.module#LegalModule' },
      { path: 'newsletter', loadChildren: './newsletter/newsletter.module#NewsletterModule' },
      { path: 'user', loadChildren: './user/user.module#UserModule' },
      { path: 'item', loadChildren: './item/item.module#ItemModule' },
      { path: 'verify', loadChildren: './verify/verify.module#VerifyModule', canActivate: [AuthService] },
      { path: '**', redirectTo: '' }
    ], { preloadingStrategy: CustomPreloading })
  ],
  exports: [
    RouterModule
  ],
  providers: [
    CustomPreloading
  ]
})
export class AppRoutingModule { }
