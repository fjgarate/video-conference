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
var environment_1 = require("./../../../environments/environment");
var core_1 = require("@angular/core");
var http_1 = require("@angular/common/http");
var UserService = /** @class */ (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getAll = function (token) {
        //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
        console.log('token');
        console.log(token);
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            })
        };
        return this.http.get(environment_1.environment.api_url + '/users', options);
    };
    UserService.prototype.getPatients = function (user) {
        //return this.http.get<User[]>(`https://login-videocall.herokuapp.com/users`);
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: 'Bearer ' + user.token,
                'Content-Type': 'application/json'
            })
        };
        return this.http.get(environment_1.environment.api_url + ("/users/patients/" + user.id), options);
    };
    UserService.prototype.getById = function (token, id) {
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: 'Bearer ' + token,
                'Content-Type': 'application/json'
            })
        };
        return this.http.get(environment_1.environment.api_url + '/users/' + id, options);
    };
    UserService.prototype.register = function (user) {
        console.log('register');
        var options = {
            headers: new http_1.HttpHeaders({
                'Content-Type': 'application/json',
                'cache-control': 'no-cache',
            })
        };
        return this.http.post(environment_1.environment.api_url + '/users/register', user, options);
    };
    //Estas no sirven
    /*getById(id: number) {
      return this.http.get(`http://localhost:4200/users/${id}`);
    }
  
    register(user: User) {
      return this.http.post(`http://localhost:4200/users/register`, user);
    }
  
    update(user: User) {
      return this.http.put(`http://localhost:4200/users/${user.id}`, user);
    }*/
    UserService.prototype.delete = function (id) {
        return this.http.delete("http://localhost:4200/users/" + id);
    };
    UserService = __decorate([
        core_1.Injectable({ providedIn: 'root' }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map