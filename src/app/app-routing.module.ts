import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoRoomComponent } from './video-room/video-room.component';
import {LoginComponent} from './login/login.component';
import { HomeComponent } from "./home";
import {RegisterComponent} from './register';
import { AuthGuard } from "./shared/guards";
const appRoutes: Routes = [
  // { path: '', component: DashboardComponent },
 // { path: '', component: LoginComponent },
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: ":roomName", component: VideoRoomComponent },
  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

