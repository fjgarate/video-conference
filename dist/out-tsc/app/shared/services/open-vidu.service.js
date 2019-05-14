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
var http_1 = require("@angular/common/http");
var core_1 = require("@angular/core");
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var environment_1 = require("../../../environments/environment");
var OpenViduService = /** @class */ (function () {
    function OpenViduService(http) {
        this.http = http;
        this.URL_OV = 'https://138.4.10.65:4443';
        this.prueba = [];
        this.MY_SECRET = 'gbttel';
        this.SETTINGS_FILE_NAME = 'ov-settings.json';
        this.ovSettings = {
            chat: true,
            autopublish: false,
            toolbarButtons: {
                video: true,
                audio: true,
                fullscreen: true,
                exit: true,
            },
        };
    }
    OpenViduService.prototype.getToken = function (mySessionId, openviduServerUrl, openviduSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var ov_url = openviduServerUrl !== undefined ? openviduServerUrl : _this.URL_OV;
            var ov_secret = openviduSecret !== undefined ? openviduSecret : _this.MY_SECRET;
            _this.createSession(mySessionId, ov_url, ov_secret)
                .then(function (sessionId) {
                _this.createToken(sessionId, ov_url, ov_secret)
                    .then(function (token) { return resolve(token); })
                    .catch(function (error) { return reject(error); });
            })
                .catch(function (error) { return reject(error); });
        });
    };
    OpenViduService.prototype.createSession = function (sessionId, openviduServerUrl, openviduSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var body = JSON.stringify({ customSessionId: sessionId });
            var options = {
                headers: new http_1.HttpHeaders({
                    Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
                    'Content-Type': 'application/json',
                }),
            };
            return _this.http
                .post(openviduServerUrl + '/api/sessions', body, options)
                .pipe(operators_1.catchError(function (error) {
                error.status === 409 ? resolve(sessionId) : reject(error);
                return rxjs_1.throwError(error);
            }))
                .subscribe(function (response) {
                console.log(response);
                resolve(response.id);
            });
        });
    };
    OpenViduService.prototype.createToken = function (sessionId, openviduServerUrl, openviduSecret) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var body = JSON.stringify({ session: sessionId });
            var options = {
                headers: new http_1.HttpHeaders({
                    Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
                    'Content-Type': 'application/json',
                }),
            };
            return _this.http
                .post(openviduServerUrl + '/api/tokens', body, options)
                .pipe(operators_1.catchError(function (error) {
                reject(error);
                return rxjs_1.throwError(error);
            }))
                .subscribe(function (response) {
                console.log(response);
                resolve(response.token);
            });
        });
    };
    /*Devuelve sesiones activas*/
    /*getSessions(openviduServerUrl: string, openviduSecret: string): Promise<string> {
      return new Promise((resolve, reject) => {
        const options = {
          headers: new HttpHeaders({
            Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
            'Content-Type': 'application/json',
          }),
        };
        return this.http
          .get<any>(openviduServerUrl + '/api/sessions', options)
          .pipe(
            catchError(error => {
              reject(error);
              return observableThrowError(error);
            })
          )
          .subscribe(response => {
            console.log('sessiones:');
            console.log(response);
            resolve(response.token);
            this.prueba = response;
          });
      });
    }*/
    OpenViduService.prototype.getSessionsPrueba = function (openviduServerUrl, openviduSecret) {
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
                'Content-Type': 'application/json',
            }),
        };
        return this.http
            .get(openviduServerUrl + '/api/sessions/', options);
    };
    OpenViduService.prototype.getSessionsId = function (openviduServerUrl, openviduSecret, sessionId) {
        var options = {
            headers: new http_1.HttpHeaders({
                Authorization: 'Basic ' + btoa('OPENVIDUAPP:' + openviduSecret),
                'Content-Type': 'application/json',
            }),
        };
        return this.http
            .get(openviduServerUrl + '/api/sessions/' + sessionId, options);
    };
    OpenViduService.prototype.getOvSettingsData = function () {
        var _this = this;
        return new Promise(function (resolve) {
            _this.http.get(_this.SETTINGS_FILE_NAME).subscribe(function (data) {
                console.log('FILE', data);
                console.log(data.openviduSettings);
                _this.ovSettings = data.openviduSettings ? data.openviduSettings : _this.ovSettings;
                if (data.openviduCredentials) {
                    _this.URL_OV = data.openviduCredentials.openvidu_url ? data.openviduCredentials.openvidu_url : _this.URL_OV;
                    _this.MY_SECRET = data.openviduCredentials.openvidu_secret ? data.openviduCredentials.openvidu_secret : _this.MY_SECRET;
                }
                console.log('URL Environment', _this.URL_OV);
                resolve(data.openviduSettings);
            }, function (error) {
                console.warn('Credentials file not found ');
                if (environment_1.environment.openvidu_url) {
                    console.warn('Getting from environment ');
                    _this.URL_OV = environment_1.environment.openvidu_url;
                    _this.MY_SECRET = environment_1.environment.openvidu_secret;
                }
                console.log('URL Environment', _this.URL_OV);
                resolve(_this.ovSettings);
            });
        });
    };
    OpenViduService = __decorate([
        core_1.Injectable({
            providedIn: 'root',
        }),
        __metadata("design:paramtypes", [http_1.HttpClient])
    ], OpenViduService);
    return OpenViduService;
}());
exports.OpenViduService = OpenViduService;
//# sourceMappingURL=open-vidu.service.js.map