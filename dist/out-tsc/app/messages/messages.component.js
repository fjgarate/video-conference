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
var shared_service_1 = require("../shared/services/shared.service");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var services_1 = require("../shared/services");
var conversation_service_1 = require("../shared/services/conversation.service");
var operators_1 = require("rxjs/operators");
var MessagesComponent = /** @class */ (function () {
    function MessagesComponent(sharedService, formBuilder, userService, authenticationService, convesationSrv, route) {
        var _this = this;
        this.sharedService = sharedService;
        this.formBuilder = formBuilder;
        this.userService = userService;
        this.authenticationService = authenticationService;
        this.convesationSrv = convesationSrv;
        this.route = route;
        this.messages = [];
        this.conversations = [];
        this.conver_p = '';
        this.participants = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    MessagesComponent.prototype.ngOnInit = function () {
        //this.sharedService.currentMessage.subscribe(message => this.messages = message);
        var _this = this;
        console.log('Han llegado', this.messages);
        this.messageForm = this.formBuilder.group({
            text: [''],
            author: this.currentUser.firstName + ' ' + this.currentUser.lastName,
            read: false
        });
        this.sub = this.route.queryParams.subscribe(function (params) {
            // Defaults to 0 if no query param provided.
            _this.conver_p = params['conver_p'];
        });
        console.log('Conver', this.conver_p);
        this.getConversationsById();
        //this.updateConver();
    };
    Object.defineProperty(MessagesComponent.prototype, "f", {
        get: function () { return this.messageForm.controls; },
        enumerable: true,
        configurable: true
    });
    MessagesComponent.prototype.getConversationsById = function () {
        var _this = this;
        this.convesationSrv
            .getById(this.currentUser.token, this.conver_p)
            .pipe(operators_1.first())
            .subscribe(function (conversation) {
            console.log('Conversaciones', conversation);
            _this.conversation = conversation;
            _this.prueba = _this.conversation;
        });
    };
    MessagesComponent.prototype.submitNewM = function () {
        var _this = this;
        this.convesationSrv.addMessage(this.currentUser.token, this.conver_p, this.messageForm.value)
            .pipe(operators_1.first())
            .subscribe(function (data) {
            _this.conversations = data;
        }, function (error) {
        });
        this.getConversationsById();
        console.log('ENviado');
    };
    MessagesComponent.prototype.updateConver = function () {
        var _this = this;
        this.convesationSrv
            .getById(this.currentUser.token, this.conver_p)
            .pipe(operators_1.first())
            .subscribe(function (conversation) {
            console.log('Conversaciones', conversation);
            _this.conversation = conversation;
            _this.messages = _this.conversation.messages.filter(function (item) { return item.read = true; });
            console.log('P', _this.messages);
            _this.convesationSrv.updateConversation(_this.currentUser.token, _this.conver_p, _this.conversation);
        });
    };
    MessagesComponent = __decorate([
        core_1.Component({
            selector: 'app-messages',
            templateUrl: './messages.component.html',
            styleUrls: ['./messages.component.css']
        }),
        __metadata("design:paramtypes", [shared_service_1.SharedService,
            forms_1.FormBuilder,
            services_1.UserService,
            services_1.AuthenticationService,
            conversation_service_1.ConversationService,
            router_1.ActivatedRoute])
    ], MessagesComponent);
    return MessagesComponent;
}());
exports.MessagesComponent = MessagesComponent;
//# sourceMappingURL=messages.component.js.map