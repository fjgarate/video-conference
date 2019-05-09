"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var video_room_component_1 = require("./video-room/video-room.component");
var login_component_1 = require("./login/login.component");
var register_1 = require("./register");
var guards_1 = require("./shared/guards");
var doctor_component_1 = require("./doctor/doctor.component");
var patient_component_1 = require("./patient/patient.component");
var videoconf_component_1 = require("./videoconf/videoconf.component");
var conversation_component_1 = require("./conversation/conversation.component");
var messages_component_1 = require("./messages/messages.component");
var appointment_component_1 = require("./appointment/appointment.component");
var appRoutes = [
    // { path: '', component: DashboardComponent },
    // { path: '', component: LoginComponent },
    { path: '', component: login_component_1.LoginComponent },
    { path: 'login', component: login_component_1.LoginComponent },
    { path: 'register', component: register_1.RegisterComponent },
    { path: 'video', component: videoconf_component_1.VideoconfComponent },
    { path: 'doctor', component: doctor_component_1.DoctorComponent, canActivate: [guards_1.AuthGuard] },
    { path: 'patient', component: patient_component_1.PatientComponent, canActivate: [guards_1.AuthGuard] },
    { path: 'conversations', component: conversation_component_1.ConversationComponent, canActivate: [guards_1.AuthGuard] },
    { path: 'messages', component: messages_component_1.MessagesComponent, canActivate: [guards_1.AuthGuard] },
    { path: 'appointment', component: appointment_component_1.AppointmentComponent, canActivate: [guards_1.AuthGuard] },
    { path: 'videoconf', component: video_room_component_1.VideoRoomComponent, canActivate: [guards_1.AuthGuard] },
    { path: ':roomName', component: video_room_component_1.VideoRoomComponent, canActivate: [guards_1.AuthGuard] },
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];
var AppRoutingModule = /** @class */ (function () {
    function AppRoutingModule() {
    }
    AppRoutingModule = __decorate([
        core_1.NgModule({
            imports: [router_1.RouterModule.forRoot(appRoutes, { useHash: true })],
            exports: [router_1.RouterModule]
        })
    ], AppRoutingModule);
    return AppRoutingModule;
}());
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map