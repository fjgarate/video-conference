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
var core_1 = require("@angular/core");
var daygrid_1 = require("@fullcalendar/daygrid");
var angular_1 = require("@fullcalendar/angular");
var appointment_service_1 = require("../shared/services/appointment.service");
var services_1 = require("../shared/services");
var operators_1 = require("rxjs/operators");
var AppointmentComponent = /** @class */ (function () {
    function AppointmentComponent(appointmentService, authenticationService, userService) {
        var _this = this;
        this.appointmentService = appointmentService;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.calendarPlugins = [daygrid_1.default]; // important!
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    AppointmentComponent.prototype.handleDateClick = function (arg) {
        alert(arg.dateStr);
    };
    AppointmentComponent.prototype.someMethod = function () {
        var calendarApi = this.calendarComponent.getApi();
        calendarApi.next();
    };
    AppointmentComponent.prototype.ngOnInit = function () {
        this.loadAllEvents();
    };
    AppointmentComponent.prototype.loadAllEvents = function () {
        var _this = this;
        this.appointmentService
            .getAll(this.currentUser.token)
            .pipe(operators_1.first())
            .subscribe(function (event) {
            console.log(event);
            _this.event = event;
        });
    };
    __decorate([
        core_1.ViewChild('calendar'),
        __metadata("design:type", angular_1.FullCalendarComponent)
    ], AppointmentComponent.prototype, "calendarComponent", void 0);
    AppointmentComponent = __decorate([
        core_1.Component({
            selector: 'app-appointment',
            templateUrl: './appointment.component.html',
            styleUrls: ['./appointment.component.css']
        }),
        __metadata("design:paramtypes", [appointment_service_1.AppointmentService,
            services_1.AuthenticationService,
            services_1.UserService])
    ], AppointmentComponent);
    return AppointmentComponent;
}());
exports.AppointmentComponent = AppointmentComponent;
//# sourceMappingURL=appointment.component.js.map