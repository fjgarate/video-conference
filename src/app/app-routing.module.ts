import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VideoRoomComponent } from './video-room/video-room.component';
import {LoginComponent} from './login/login.component';
import { HomeComponent } from "./home";
import {RegisterComponent} from './register';
import { AuthGuard } from "./shared/guards";
import {DoctorComponent} from './doctor/doctor.component';
import { PatientComponent } from "./patient/patient.component";
const appRoutes: Routes = [
  // { path: '', component: DashboardComponent },
  // { path: '', component: LoginComponent },
  { path: "", component: LoginComponent },
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },

  { path: "doctor", component: DoctorComponent, canActivate: [AuthGuard] },
  { path: "patient", component: PatientComponent, canActivate: [AuthGuard] },
  { path: ":roomName", component: VideoRoomComponent, canActivate: [AuthGuard]  },
  // otherwise redirect to home
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule {}

