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
var DoctorComponent = /** @class */ (function () {
    function DoctorComponent(authenticationService, userService, openViduSrv, convesationSrv) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.openViduSrv = openViduSrv;
        this.convesationSrv = convesationSrv;
        this.users = [];
        this.conversations = [];
        this.messages = [];
        this.noread = [];
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    DoctorComponent.prototype.ngOnInit = function () {
        this.loadAllPatients();
        //this.loadAllConnectedP();
        // this.loadSessionsId();
        this.loadSessionsPrueba();
        this.getConversationsByUserId(this.currentUser.id);
    };
    DoctorComponent.prototype.ngOnDestroy = function () {
        // unsubscribe to ensure no memory leaks
        this.currentUserSubscription.unsubscribe();
    };
    /*deleteUser(id: number) {
      this.userService
        .delete(id)
        .pipe(first())
        .subscribe(() => {
          this.loadAllUsers();
        });
    }
  
    private loadAllUsers() {
  
      this.userService
        .getAll(this.currentUser.token)
        .pipe(first())
        .subscribe(users => {
          console.log(users)
          this.users = users;
        });
      //this.openViduSrv.getSessions("https://138.4.10.65:4443", "gbttel");
    }*/
    DoctorComponent.prototype.selectUser = function (user) {
        console.log(user);
        this.sessionName = user;
    };
    DoctorComponent.prototype.loadAllPatients = function () {
        var _this = this;
        this.userService
            .getPatients(this.currentUser)
            .pipe(operators_1.first())
            .subscribe(function (users) {
            console.log(users);
            _this.users = users;
        });
    };
    /* private loadAllConnectedP() {
       this.openViduSrv
         .getSessions('https://138.4.10.65:4443', 'gbttel')
   
     }*/
    DoctorComponent.prototype.loadSessionsPrueba = function () {
        var _this = this;
        this.openViduSrv
            .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
            .subscribe(function (response) {
            console.log('Funciona', response);
            _this.sessionprueba = response;
        });
    };
    /*
    private loadSessionsId() {
      this.openViduSrv
      .getSessionsId('https://138.4.10.65:4443', 'gbttel', 'noe')
      .subscribe(response => {
        console.log('Funciona', response);
        this.prueba = response;
      });
    }*/
    DoctorComponent.prototype.getConversationsByUserId = function (id) {
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
            _this.noread = _this.messages.filter(function (item) { return item.read === false; });
            console.log('M', _this.messages);
            console.log('N', _this.noread);
        });
    };
    DoctorComponent = __decorate([
        core_1.Component({
            selector: 'app-doctor',
            templateUrl: './doctor.component.html',
            styleUrls: ['./doctor.component.css']
        }),
        __metadata("design:paramtypes", [services_1.AuthenticationService,
            services_1.UserService,
            open_vidu_service_1.OpenViduService,
            conversation_service_1.ConversationService])
    ], DoctorComponent);
    return DoctorComponent;
}());
exports.DoctorComponent = DoctorComponent;
//# sourceMappingURL=doctor.component.js.map