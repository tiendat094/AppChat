import { MainCallComponent } from './main-call/main-call.component';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login.component';
import { ChatComponent } from './chat.component';
import { NgModule } from '@angular/core';
import { RegisterComponent } from './register.component';
import { UserComponent } from './user.component';
import { GroupComponent } from './group.component';
import { SendMailComponent } from './mail/sendmail.component';
import { ConfirmOtpComponent } from './mail/confirm-otp.component';
import { ResetPasswordComponent } from './mail/resetPassword.component';
import { Call } from '@stream-io/video-client';
import { CallComponent } from './main-call/call/call.component';
//import { VideoCallComponent } from './videoCall.component';

export const routes: Routes = [
    {path: 'login',component: LoginComponent},
    {path: 'chat',component: ChatComponent},
    {path: 'register', component: RegisterComponent},
    {path: 'user',component : UserComponent},
    {path: 'group',component: GroupComponent},
    {path: 'sendmail',component:SendMailComponent},
    {path:'verifyOtp',component:ConfirmOtpComponent},
    {path:'resetPassword',component:ResetPasswordComponent},
    {path: 'call',component:MainCallComponent},
   // {path: 'videoCall',component: VideoCallComponent},
    {path: '**', redirectTo: '/login'},
];
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
export class RouterComponent{}