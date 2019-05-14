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
var forms_1 = require("@angular/forms");
var user_model_1 = require("../../models/user-model");
var nickname_1 = require("../../forms-matchers/nickname");
var api_service_1 = require("../../services/api.service");
var openvidu_browser_1 = require("openvidu-browser");
var router_1 = require("@angular/router");
var services_1 = require("../../services");
var operators_1 = require("rxjs/operators");
var DialogChooseRoomComponent = /** @class */ (function () {
    function DialogChooseRoomComponent(route, apiSrv, authenticationService, userService, router) {
        var _this = this;
        this.route = route;
        this.apiSrv = apiSrv;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.router = router;
        this.users = [];
        this.user_p = '';
        this.pacientes = [];
        this.join = new core_1.EventEmitter();
        this.cameras = [{ label: 'None', device: null }];
        this.microphones = [{ label: 'None', device: null }];
        this.isVideoActive = true;
        this.isAudioActive = true;
        this.volumeValue = 100;
        this.user = new user_model_1.UserModel();
        this.nicknameFormControl = new forms_1.FormControl('', [forms_1.Validators.maxLength(25), forms_1.Validators.required]);
        this.matcher = new nickname_1.NicknameMatcher();
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    Object.defineProperty(DialogChooseRoomComponent.prototype, "isDoctor", {
        get: function () {
            return this.currentUser && this.currentUser.role === 'doctor';
        },
        enumerable: true,
        configurable: true
    });
    DialogChooseRoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.OV = new openvidu_browser_1.OpenVidu();
        this.generateNickname();
        this.setSessionName();
        this.setDevicesValue();
        this.columns = (window.innerWidth > 900) ? 2 : 1;
        this.sub = this.route.queryParams.subscribe(function (params) {
            // Defaults to 0 if no query param provided.
            _this.user_p = params['user_p'];
        });
        console.log('usuario paciente');
        console.log(this.user_p);
        this.getById();
    };
    DialogChooseRoomComponent.prototype.toggleCam = function () {
        this.isVideoActive = !this.isVideoActive;
        this.user.setVideoActive(this.isVideoActive);
        this.user.getStreamManager().publishVideo(this.isVideoActive);
    };
    DialogChooseRoomComponent.prototype.camChanged = function (label) {
        var initPublisherRequired = this.camValue.label !== 'None' && label !== 'None';
        var option = this.cameras.filter(function (opt) { return opt.label === label; })[0];
        this.camValue = option;
        this.isVideoActive = this.camValue.label === 'None' ? false : true;
        this.user.setVideoActive(this.isVideoActive);
        this.user.getStreamManager().publishVideo(this.isVideoActive);
        if (initPublisherRequired) {
            this.launchNewPublisher();
        }
    };
    DialogChooseRoomComponent.prototype.toggleMic = function () {
        this.isAudioActive = !this.isAudioActive;
        this.user.setAudioActive(this.isAudioActive);
        this.user.getStreamManager().publishAudio(this.isAudioActive);
    };
    DialogChooseRoomComponent.prototype.micChanged = function (label) {
        var initPublisherRequired = this.micValue.label !== 'None' && label !== 'None';
        var option = this.microphones.filter(function (opt) { return opt.label === label; })[0];
        this.micValue = option;
        this.isAudioActive = this.micValue.label === 'None' ? false : true;
        this.user.setAudioActive(this.isAudioActive);
        this.user.getStreamManager().publishAudio(this.isAudioActive);
        if (initPublisherRequired) {
            this.launchNewPublisher();
        }
    };
    DialogChooseRoomComponent.prototype.subscribeToVolumeChange = function (publisher) {
        var _this = this;
        publisher.on('streamAudioVolumeChange', function (event) {
            _this.volumeValue = Math.round(Math.abs(event.value.newValue));
        });
    };
    DialogChooseRoomComponent.prototype.generateNickname = function () {
        var nickname = this.userNickname ? this.userNickname : this.currentUser.firstName + ' ' + this.currentUser.lastName;
        this.nicknameFormControl.setValue(nickname);
    };
    DialogChooseRoomComponent.prototype.eventKeyPress = function (event) {
        if (event && event.keyCode === 13 && this.nicknameFormControl.valid) {
            this.accept();
        }
    };
    DialogChooseRoomComponent.prototype.onResize = function (event) {
        this.columns = (event.target.innerWidth > 900) ? 2 : 1;
    };
    DialogChooseRoomComponent.prototype.updateVolumeColor = function () {
        // max = 0 / min = 100
        if (this.volumeValue <= 20) {
            return 'warn';
        }
        else if (this.volumeValue > 20 && this.volumeValue <= 35) {
            return 'accent';
        }
        else if (this.volumeValue > 35) {
            return 'primary';
        }
    };
    DialogChooseRoomComponent.prototype.accept = function () {
        if (this.nicknameFormControl.valid) {
            this.user.getStreamManager().off('streamAudioVolumeChange');
            this.user.setNickname(this.nicknameFormControl.value);
            this.join.emit({ user: this.user, sessionId: this.mySessionId });
        }
    };
    DialogChooseRoomComponent.prototype.setDevicesValue = function () {
        var _this = this;
        this.OV.getDevices().then(function (devices) {
            console.log('Devices: ', devices);
            devices.forEach(function (device) {
                if (device.kind === 'audioinput') {
                    _this.microphones.push({ label: device.label, device: device.deviceId });
                }
                else {
                    _this.cameras.push({ label: device.label, device: device.deviceId });
                }
            });
            _this.camValue = _this.cameras[1] ? _this.cameras[1] : _this.cameras[0];
            _this.micValue = _this.microphones[1] ? _this.microphones[1] : _this.microphones[0];
            _this.initPublisher();
        }).catch(function (error) { return console.error(error); });
    };
    DialogChooseRoomComponent.prototype.setSessionName = function () {
        var _this = this;
        this.route.params.subscribe(function (params) {
            _this.mySessionId = _this.sessionName ? _this.sessionName : params.roomName;
        });
    };
    DialogChooseRoomComponent.prototype.initPublisher = function () {
        var _this = this;
        this.OV.initPublisherAsync(undefined, {
            audioSource: this.micValue.device,
            videoSource: this.camValue.device,
            publishAudio: this.isAudioActive,
            publishVideo: this.isVideoActive,
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
        }).then(function (publisher) {
            _this.subscribeToVolumeChange(publisher);
            _this.user.setStreamManager(publisher);
            if (_this.autopublish) {
                _this.accept();
            }
        }).catch(function (error) { return console.error(error); });
    };
    DialogChooseRoomComponent.prototype.launchNewPublisher = function () {
        this.destroyPublisher();
        this.initPublisher();
    };
    DialogChooseRoomComponent.prototype.destroyPublisher = function () {
        this.user.getStreamManager().off('streamAudioVolumeChange');
        this.user.getStreamManager().stream.disposeWebRtcPeer();
        this.user.getStreamManager().stream.disposeMediaStream();
    };
    DialogChooseRoomComponent.prototype.getById = function () {
        var _this = this;
        this.userService
            .getById(this.currentUser.token, this.user_p)
            .pipe(operators_1.first())
            .subscribe(function (pacientes) {
            console.log('Pacientes', pacientes);
            _this.pacientes = pacientes;
        });
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DialogChooseRoomComponent.prototype, "userNickname", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], DialogChooseRoomComponent.prototype, "sessionName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], DialogChooseRoomComponent.prototype, "autopublish", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DialogChooseRoomComponent.prototype, "join", void 0);
    DialogChooseRoomComponent = __decorate([
        core_1.Component({
            selector: 'app-dialog-choose-room',
            templateUrl: './dialog-choose-room.component.html',
            styleUrls: ['./dialog-choose-room.component.css'],
        }),
        __metadata("design:paramtypes", [router_1.ActivatedRoute, api_service_1.ApiService, services_1.AuthenticationService,
            services_1.UserService, router_1.Router])
    ], DialogChooseRoomComponent);
    return DialogChooseRoomComponent;
}());
exports.DialogChooseRoomComponent = DialogChooseRoomComponent;
//# sourceMappingURL=dialog-choose-room.component.js.map