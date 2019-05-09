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
var router_1 = require("@angular/router");
var VideoconfComponent = /** @class */ (function () {
    function VideoconfComponent(authenticationService, userService, openViduSrv, router) {
        var _this = this;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.openViduSrv = openViduSrv;
        this.router = router;
        this.texto = "Conectar";
        this.esta = true;
        this.num = false;
        this.buttonDisabled = true;
        this.value = true;
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    VideoconfComponent.prototype.ngOnInit = function () {
        this.loadSessionsPrueba();
        // this.loadAllPatients();
    };
    VideoconfComponent.prototype.loadAllPatients = function () {
        var _this = this;
        /* this.openViduSrv
           .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
           .subscribe(response => {
             this.sessionprueba = response.content;})*/
        this.userService
            .getPatients(this.currentUser)
            .pipe(operators_1.first())
            .subscribe(function (users) {
            _this.users = users;
            return _this.users;
            /* for (let i = 0; i < users.length ; i++ ){
               this.variable2= this.users[i];
               this.sessionId2= this.variable2["id"];
               console.log('idUser',this.sessionId2);
        
               for (let j = 0; j < this.sessionprueba.length; j++) {
                 this.variable = this.sessionprueba[j];
                 this.sessionId = this.variable["sessionId"]
                 console.log('idSession', this.sessionId)
               {
              if (this.sessionId2=== this.sessionId){
                console.log('A work')
                this.buttonDisabled=false;
              }
            }
          }
          }*/
        });
        console.log('Prueba', this.users);
    };
    VideoconfComponent.prototype.loadSessionsPrueba = function () {
        var _this = this;
        this.openViduSrv
            .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
            .subscribe(function (response) {
            _this.sessionprueba = response.content;
            console.log('Funciona', _this.sessionprueba);
            if (response.numberOfElements === 0) {
                _this.num = true;
            }
            /*for (let i=0; i< this.sessionprueba.length; i++){
              console.log('Array',this.sessionprueba[i])
              this.variable= this.sessionprueba[i];
                this.sessionId =  this.variable["sessionId"]
                console.log('Pureba', this.sessionId)
            }*/
            _this.loadAllPatients();
        });
    };
    VideoconfComponent.prototype.selectUser = function (user) {
        console.log(user);
        this.router.navigate(['videoconf'], {
            queryParams: { user_p: user }
        });
        this.sessionName = user;
    };
    VideoconfComponent.prototype.isActive = function (id) {
        if (id === '5cbee5fbb2f4c93fd0111886') {
            console.log('id', id);
            console.log('Prueba', this.sessionprueba);
            return true;
        }
        if (id != '5cbee5fbb2f4c93fd0111886') {
            console.log('id', id);
            return false;
        }
        /*for (let j = 0; j < this.sessionprueba.length; j++) {
          this.variable = this.sessionprueba[j];
          this.sessionId = this.variable["sessionId"]
          console.log('id prueba', this.sessionId)
          if (id === this.sessionId) {
            this.value = false;
            return tfrue
            break
          }
          if (id != this.sessionId) {
            this.value = false;
                return false
      }*/
        /* this.openViduSrv
           .getSessionsPrueba('https://138.4.10.65:4443', 'gbttel')
           .subscribe(response => {
             this.sessionprueba = response.content;})
     
         for (let j = 0; j < this.sessionprueba.length; j++) {
     
           this.variable = this.sessionprueba[j];
           this.sessionId = this.variable["sessionId"]
           console.log('id prueba', this.sessionId)
           console.log(j)
            if (id === this.sessionId) {
             
             return true
             break
             }
             return false;
         }*/
    };
    VideoconfComponent = __decorate([
        core_1.Component({
            selector: "app-videoconf",
            templateUrl: "./videoconf.component.html"
        }),
        __metadata("design:paramtypes", [services_1.AuthenticationService,
            services_1.UserService,
            open_vidu_service_1.OpenViduService,
            router_1.Router])
    ], VideoconfComponent);
    return VideoconfComponent;
}());
exports.VideoconfComponent = VideoconfComponent;
//# sourceMappingURL=videoconf.component.js.map