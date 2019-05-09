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
var http_1 = require("@angular/common/http");
var environment_1 = require("./../../../environments/environment");
var AppointmentService = /** @class */ (function () {
    function AppointmentService(http) {
        this.http = http;
    }
    AppointmentService.prototype.getAll = function (token) {
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: "Bearer " + token,
                "Content-Type": "application/json"
            })
        };
        return this.http.get(environment_1.environment.api_url + "/appointments", options);
    };
    AppointmentService.prototype.createEvent = function (newEvent) {
        console.log('Evento creado');
        var options = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            })
        };
        return this.http.post(environment_1.environment.api_url + '/appointments/register', newEvent, options);
    };
    AppointmentService = __decorate([
        core_1.Injectable({
            providedIn: "root"
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], AppointmentService);
    return AppointmentService;
}());
exports.AppointmentService = AppointmentService;
//# sourceMappingURL=appointment.service.js.map