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
var video_room_component_1 = require("../video-room/video-room.component");
var WebComponentComponent = /** @class */ (function () {
    function WebComponentComponent() {
        this.joinSession = new core_1.EventEmitter();
        this.leaveSession = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        this.display = false;
    }
    Object.defineProperty(WebComponentComponent.prototype, "sessionConfig", {
        set: function (config) {
            var sessionConfig;
            console.log('Session config input ', config);
            sessionConfig = config;
            if (typeof config === 'string') {
                sessionConfig = JSON.parse(config);
            }
            if (sessionConfig) {
                this._sessionName = sessionConfig.sessionName;
                this._user = sessionConfig.user;
                this._token = sessionConfig.token;
                if (sessionConfig.ovSettings && this.isOvSettingsType(sessionConfig.ovSettings)) {
                    this.ovSettings = sessionConfig.ovSettings;
                }
                if (this.validateParameters()) {
                    this.display = true;
                }
            }
            else {
                this.videoRoom.exitSession();
            }
        },
        enumerable: true,
        configurable: true
    });
    WebComponentComponent.prototype.ngOnInit = function () { };
    WebComponentComponent.prototype.validateParameters = function () {
        if ((this._sessionName && this.openviduServerUrl && this.openviduSecret && this._user) || (this._token && this._user)) {
            return true;
        }
        return false;
    };
    WebComponentComponent.prototype.emitJoinSessionEvent = function (event) {
        this.joinSession.emit(event);
        this.videoRoom.checkSizeComponent();
    };
    WebComponentComponent.prototype.emitLeaveSessionEvent = function (event) {
        this.leaveSession.emit(event);
        this.display = false;
    };
    WebComponentComponent.prototype.emitErrorEvent = function (event) {
        var _this = this;
        setTimeout(function () { return _this.error.emit(event); }, 20);
    };
    WebComponentComponent.prototype.isOvSettingsType = function (obj) {
        return 'chat' in obj && typeof obj['chat'] === 'boolean' &&
            'autopublish' in obj && typeof obj['autopublish'] === 'boolean' &&
            'toolbarButtons' in obj && typeof obj['toolbarButtons'] === 'object' &&
            'audio' in obj.toolbarButtons && typeof obj.toolbarButtons['audio'] === 'boolean' &&
            'audio' in obj.toolbarButtons && typeof obj.toolbarButtons['audio'] === 'boolean' &&
            'video' in obj.toolbarButtons && typeof obj.toolbarButtons['video'] === 'boolean' &&
            'screenShare' in obj.toolbarButtons && typeof obj.toolbarButtons['screenShare'] === 'boolean' &&
            'fullscreen' in obj.toolbarButtons && typeof obj.toolbarButtons['fullscreen'] === 'boolean' &&
            'exit' in obj.toolbarButtons && typeof obj.toolbarButtons['exit'] === 'boolean';
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], WebComponentComponent.prototype, "openviduServerUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], WebComponentComponent.prototype, "openviduSecret", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], WebComponentComponent.prototype, "theme", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], WebComponentComponent.prototype, "ovSettings", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], WebComponentComponent.prototype, "joinSession", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], WebComponentComponent.prototype, "leaveSession", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], WebComponentComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild('videoRoom'),
        __metadata("design:type", video_room_component_1.VideoRoomComponent)
    ], WebComponentComponent.prototype, "videoRoom", void 0);
    __decorate([
        core_1.Input('sessionConfig'),
        __metadata("design:type", Object),
        __metadata("design:paramtypes", [Object])
    ], WebComponentComponent.prototype, "sessionConfig", null);
    WebComponentComponent = __decorate([
        core_1.Component({
            selector: 'app-web-component',
            template: "\n    <app-video-room\n      #videoRoom\n      *ngIf=\"display\"\n      [theme]=\"theme\"\n      [sessionName]=\"_sessionName\"\n      [user]=\"_user\"\n      [openviduServerUrl]=\"openviduServerUrl\"\n      [openviduSecret]=\"openviduSecret\"\n      [token]=\"_token\"\n      [ovSettings]=\"ovSettings\"\n      (leaveSession)=\"emitLeaveSessionEvent($event)\"\n      (joinSession)=\"emitJoinSessionEvent($event)\"\n      (error)=\"emitErrorEvent($event)\"\n    >\n    </app-video-room>\n  ",
            styleUrls: ['./web-component.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], WebComponentComponent);
    return WebComponentComponent;
}());
exports.WebComponentComponent = WebComponentComponent;
//# sourceMappingURL=web-component.component.js.map