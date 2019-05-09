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
var conversation_service_1 = require("../shared/services/conversation.service");
var PatientComponent = /** @class */ (function () {
    function PatientComponent(authenticationService, userService, openViduSrv, convesationSrv) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.openViduSrv = openViduSrv;
        this.convesationSrv = convesationSrv;
        this.users = [];
        this.conversations = [];
        this.messages = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    PatientComponent.prototype.ngOnInit = function () {
        this.getConversationsByUserId(this.currentUser.id);
    };
    PatientComponent.prototype.getConversationsByUserId = function (id) {
        var _this = this;
        this.convesationSrv
            .getConversationsByUserId(this.currentUser.token, id)
            .pipe(operators_1.first())
            .subscribe(function (conversations) {
            console.log(conversations);
            _this.conversations = conversations;
            if (_this.conversations.length > 0) {
                _this.messages = _this.conversations[conversations.length - 1].messages;
            }
        });
    };
    PatientComponent = __decorate([
        core_1.Component({
            selector: 'app-patient',
            templateUrl: './patient.component.html',
            styleUrls: ['./patient.component.css']
        }),
        __metadata("design:paramtypes", [services_1.AuthenticationService,
            services_1.UserService,
            open_vidu_service_1.OpenViduService,
            conversation_service_1.ConversationService])
    ], PatientComponent);
    return PatientComponent;
}());
exports.PatientComponent = PatientComponent;
//# sourceMappingURL=patient.component.js.map