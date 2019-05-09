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
var operators_1 = require("rxjs/operators");
var services_1 = require("../shared/services");
var open_vidu_service_1 = require("../shared/services/open-vidu.service");
var HomeComponent = /** @class */ (function () {
    function HomeComponent(authenticationService, userService, openViduSrv) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.openViduSrv = openViduSrv;
        this.users = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    HomeComponent.prototype.ngOnInit = function () {
        this.loadAllUsers();
    };
    HomeComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    };
    HomeComponent.prototype.deleteUser = function (id) {
        var _this = this;
        this.userService.delete(id).pipe(operators_1.first()).subscribe(function () {
            _this.loadAllUsers();
        });
    };
    HomeComponent.prototype.loadAllUsers = function () {
        /*this.userService.getAll().pipe(first()).subscribe(users => {
            this.users = users;
        });*/
        //this.openViduSrv.getSessions("https://138.4.10.65:4443", "gbttel");
    };
    HomeComponent = __decorate([
        core_1.Component({ templateUrl: 'home.component.html' }),
        __metadata("design:paramtypes", [services_1.AuthenticationService,
            services_1.UserService,
            open_vidu_service_1.OpenViduService])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=home.component.js.map