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
var services_1 = require("../shared/services");
var conversation_service_1 = require("../shared/services/conversation.service");
var operators_1 = require("rxjs/operators");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var shared_service_1 = require("../shared/services/shared.service");
var ConversationComponent = /** @class */ (function () {
    function ConversationComponent(formBuilder, authenticationService, convesationSrv, userService, router, sharedService) {
        var _this = this;
        this.formBuilder = formBuilder;
        this.authenticationService = authenticationService;
        this.convesationSrv = convesationSrv;
        this.userService = userService;
        this.router = router;
        this.sharedService = sharedService;
        this.conversations = [];
        this.loading = false;
        this.submitted = false;
        this.isCollapsed = true;
        this.isCreated = false;
        this.participants = [];
        this.messages = [];
        this.users = [];
        this.pacientes = [];
        this.change = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    Object.defineProperty(ConversationComponent.prototype, "isDoctor", {
        get: function () {
            return this.currentUser && this.currentUser.role === 'clinical';
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ConversationComponent.prototype, "isPatient", {
        get: function () {
            return this.currentUser && this.currentUser.role === 'patient';
        },
        enumerable: true,
        configurable: true
    });
    ConversationComponent.prototype.toogleCollapse = function () {
        this.isCollapsed = !this.isCollapsed;
    };
    ConversationComponent.prototype.ngOnInit = function () {
        this.conversationForm = this.formBuilder.group({
            createUserId: this.currentUser.id,
            title: [''],
            participants: [''],
            text: ['']
        });
        this.loadAllPatients();
        this.getConversationsByUserId(this.currentUser.id);
    };
    Object.defineProperty(ConversationComponent.prototype, "f", {
        get: function () { return this.conversationForm.controls; },
        enumerable: true,
        configurable: true
    });
    ConversationComponent.prototype.loadAllPatients = function () {
        var _this = this;
        this.userService
            .getPatients(this.currentUser)
            .pipe(operators_1.first())
            .subscribe(function (users) {
            console.log(users);
            _this.users = users;
        });
    };
    ConversationComponent.prototype.getConversationsByUserId = function (id) {
        var _this = this;
        this.convesationSrv
            .getConversationsByUserId(this.currentUser.token, id)
            .pipe(operators_1.first())
            .subscribe(function (conversations) {
            console.log(conversations);
            _this.conversations = conversations;
            if (_this.conversations.length > 0) {
                _this.conversation = _this.conversations[0];
                _this.messages = _this.conversations[conversations.length - 1].messages;
                _this.participants = _this.conversation.participants;
                _this.last_message = _this.messages[_this.messages.length - 1];
            }
        });
    };
    ConversationComponent.prototype.createConver = function () {
        var _this = this;
        this.conversationForm.value.participants = [this.conversationForm.value.participants, this.currentUser.id];
        this.conversationForm.value.messages = [{
                author: this.currentUser.firstName + ' ' + this.currentUser.lastName, text: this.conversationForm.value.text
            }];
        this.convesationSrv.createConversation(this.conversationForm.value)
            .pipe(operators_1.first())
            .subscribe(function (data) {
            _this.conversations = data;
        }, function (error) {
        });
        this.getConversationsByUserId(this.currentUser.id);
    };
    ConversationComponent.prototype.getConversationsById = function (id) {
        var _this = this;
        this.convesationSrv
            .getConversationsByUserId(this.currentUser.token, id)
            .pipe(operators_1.first())
            .subscribe(function (conversations) {
            console.log('Conversaciones', conversations);
            _this.conversations = conversations;
            if (_this.conversations.length > 0) {
                _this.messages = _this.conversations[conversations.length - 1].messages;
            }
        });
        this.router.navigate(['messages'], {
            queryParams: { conver_p: this.conversations }
        });
    };
    ConversationComponent.prototype.getById = function (id) {
        var _this = this;
        this.userService
            .getById(this.currentUser.token, id)
            .pipe(operators_1.first())
            .subscribe(function (pacientes) {
            console.log('Pacientes', pacientes);
            _this.pacientes = pacientes;
        });
    };
    ConversationComponent.prototype.goMessages = function (id) {
        console.log('llega');
        //this.sharedService.changeMessages(this.conversation.messages)
        this.router.navigate(['messages'], {
            queryParams: { conver_p: id }
        });
        console.log(id, 'mensajes', this.conversation.messages);
    };
    ConversationComponent = __decorate([
        core_1.Component({
            selector: "app-conversation",
            templateUrl: "./conversation.component.html",
            styleUrls: ["./conversation.component.css"]
        }),
        __metadata("design:paramtypes", [forms_1.FormBuilder,
            services_1.AuthenticationService,
            conversation_service_1.ConversationService,
            services_1.UserService,
            router_1.Router,
            shared_service_1.SharedService])
    ], ConversationComponent);
    return ConversationComponent;
}());
exports.ConversationComponent = ConversationComponent;
//# sourceMappingURL=conversation.component.js.map