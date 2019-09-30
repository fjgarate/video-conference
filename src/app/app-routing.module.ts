import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VideoRoomComponent } from './video-room/video-room.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register';
import { AuthGuard } from './shared/guards';
import {DoctorComponent} from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { VideoconfComponent} from './videoconf/videoconf.component';
import { ConversationComponent } from './conversation/conversation.component';
import { MessagesComponent} from './messages/messages.component';
import { AppointmentComponent} from './appointment/appointment.component';
import { SessionComponent } from './session/session.component';
import { UserComponent } from './user/user.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent, canActivate: [AuthGuard] },
  { path: 'video', component: VideoconfComponent },
  { path: 'doctor', component: DoctorComponent, canActivate: [AuthGuard] },
  { path: 'patient', component: PatientComponent, canActivate: [AuthGuard] },
  { path: 'conversations', component: ConversationComponent, canActivate: [AuthGuard] },
  { path: 'messages', component: MessagesComponent, canActivate: [AuthGuard] },
  { path: 'appointment', component: AppointmentComponent, canActivate: [AuthGuard] },
  { path: 'sessions', component: SessionComponent, canActivate: [AuthGuard] },
  { path: 'videoconf', component: VideoRoomComponent, canActivate: [AuthGuard] },
  { path: 'users', component: UserComponent, canActivate: [AuthGuard] },
  { path: ':roomName', component: VideoRoomComponent, canActivate: [AuthGuard]  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

