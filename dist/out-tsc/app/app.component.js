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
var router_1 = require("@angular/router");
var services_1 = require("./shared/services");
var AppComponent = /** @class */ (function () {
    function AppComponent(router, authenticationService) {
        var _this = this;
        this.router = router;
        this.authenticationService = authenticationService;
        this.title = "video-conference";
        this.authenticationService.currentUser.subscribe(function (x) { return (_this.currentUser = x); });
    }
    Object.defineProperty(AppComponent.prototype, "isDoctor", {
        get: function () {
            return this.currentUser && this.currentUser.role === 'clinical';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "isPatient", {
        get: function () {
            return this.currentUser && this.currentUser.role === 'patient';
        },
        enumerable: true,
        configurable: true
    });
    AppComponent.prototype.logout = function () {
        this.authenticationService.logout();
        this.router.navigate(['']);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: "app-root",
            templateUrl: "./app.component.html",
            styleUrls: ["./app.component.css"]
        }),
        __metadata("design:paramtypes", [router_1.Router,
            services_1.AuthenticationService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map