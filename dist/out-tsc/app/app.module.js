"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var animations_1 = require("@angular/platform-browser/animations");
var material_1 = require("@angular/material");
var scrolling_1 = require("@angular/cdk/scrolling");
var angular_1 = require("@fullcalendar/angular"); // for FullCalendar!
var app_component_1 = require("./app.component");
var app_routing_module_1 = require(".//app-routing.module");
var video_room_component_1 = require("./video-room/video-room.component");
var dashboard_component_1 = require("./dashboard/dashboard.component");
var open_vidu_service_1 = require("./shared/services/open-vidu.service");
var stream_component_1 = require("./shared/components/stream/stream.component");
var http_1 = require("@angular/common/http");
var chat_component_1 = require("./shared/components/chat/chat.component");
var dialog_extension_component_1 = require("./shared/components/dialog-extension/dialog-extension.component");
var ov_video_component_1 = require("./shared/components/stream/ov-video.component");
var elements_1 = require("@angular/elements");
var dialog_error_component_1 = require("./shared/components/dialog-error/dialog-error.component");
var web_component_component_1 = require("./web-component/web-component.component");
var elements_zone_strategy_1 = require("elements-zone-strategy");
var toolbar_component_1 = require("./shared/components/toolbar/toolbar.component");
var dialog_choose_room_component_1 = require("./shared/components/dialog-choose-room/dialog-choose-room.component");
var api_service_1 = require("./shared/services/api.service");
var linkfy_1 = require("./shared/pipes/linkfy");
var ngx_linkifyjs_1 = require("ngx-linkifyjs");
var flex_layout_1 = require("@angular/flex-layout");
var home_1 = require("./home");
var login_1 = require("./login");
var register_1 = require("./register");
var alert_1 = require("./shared/components/alert");
var doctor_component_1 = require("./doctor/doctor.component");
var patient_component_1 = require("./patient/patient.component");
var videoconf_component_1 = require("./videoconf/videoconf.component");
var conversation_component_1 = require("./conversation/conversation.component");
var is_present_pipe_1 = require("./is-present.pipe");
var is_read_pipe_1 = require("./is-read.pipe");
var is_doc_pipe_1 = require("./is-doc.pipe");
var messages_component_1 = require("./messages/messages.component");
var appointment_component_1 = require("./appointment/appointment.component");
var AppModule = /** @class */ (function () {
    function AppModule(injector) {
        this.injector = injector;
        var strategyFactory = new elements_zone_strategy_1.ElementZoneStrategyFactory(web_component_component_1.WebComponentComponent, this.injector);
        var element = elements_1.createCustomElement(web_component_component_1.WebComponentComponent, {
            injector: this.injector,
            strategyFactory: strategyFactory
        });
        customElements.define('openvidu-webcomponent', element);
    }
    AppModule.prototype.ngDoBootstrap = function () { };
    AppModule = __decorate([
        core_1.NgModule({
            declarations: [
                app_component_1.AppComponent,
                video_room_component_1.VideoRoomComponent,
                dashboard_component_1.DashboardComponent,
                stream_component_1.StreamComponent,
                chat_component_1.ChatComponent,
                dialog_extension_component_1.DialogExtensionComponent,
                ov_video_component_1.OpenViduVideoComponent,
                dialog_error_component_1.DialogErrorComponent,
                dialog_choose_room_component_1.DialogChooseRoomComponent,
                web_component_component_1.WebComponentComponent,
                toolbar_component_1.ToolbarComponent,
                linkfy_1.LinkifyPipe,
                alert_1.AlertComponent,
                home_1.HomeComponent,
                login_1.LoginComponent,
                register_1.RegisterComponent,
                doctor_component_1.DoctorComponent,
                patient_component_1.PatientComponent,
                videoconf_component_1.VideoconfComponent,
                conversation_component_1.ConversationComponent,
                is_present_pipe_1.IsPresentPipe,
                is_read_pipe_1.IsReadPipe,
                is_doc_pipe_1.IsDocPipe,
                messages_component_1.MessagesComponent,
                appointment_component_1.AppointmentComponent
            ],
            imports: [
                forms_1.FormsModule,
                forms_1.ReactiveFormsModule,
                platform_browser_1.BrowserModule,
                animations_1.BrowserAnimationsModule,
                material_1.MatButtonModule,
                material_1.MatCardModule,
                material_1.MatToolbarModule,
                material_1.MatIconModule,
                material_1.MatInputModule,
                material_1.MatFormFieldModule,
                material_1.MatDialogModule,
                material_1.MatTooltipModule,
                material_1.MatBadgeModule,
                material_1.MatGridListModule,
                material_1.MatCheckboxModule,
                material_1.MatSelectModule,
                material_1.MatOptionModule,
                material_1.MatProgressSpinnerModule,
                material_1.MatSliderModule,
                app_routing_module_1.AppRoutingModule,
                http_1.HttpClientModule,
                flex_layout_1.FlexLayoutModule,
                scrolling_1.ScrollingModule,
                angular_1.FullCalendarModule,
                ngx_linkifyjs_1.NgxLinkifyjsModule.forRoot(),
            ],
            entryComponents: [dialog_error_component_1.DialogErrorComponent, web_component_component_1.WebComponentComponent],
            providers: [
                open_vidu_service_1.OpenViduService,
                api_service_1.ApiService,
            ],
            bootstrap: [app_component_1.AppComponent],
            schemas: [
                core_1.CUSTOM_ELEMENTS_SCHEMA,
            ]
        }),
        __metadata("design:paramtypes", [core_1.Injector])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map