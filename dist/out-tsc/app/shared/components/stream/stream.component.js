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
var user_model_1 = require("../../models/user-model");
var forms_1 = require("@angular/forms");
var nickname_1 = require("../../forms-matchers/nickname");
var api_service_1 = require("../../services/api.service");
var StreamComponent = /** @class */ (function () {
    function StreamComponent(apiSrv) {
        this.apiSrv = apiSrv;
        this.fullscreenIcon = 'fullscreen';
        this.nicknameFormControl = new forms_1.FormControl('', [forms_1.Validators.maxLength(25), forms_1.Validators.required]);
        this.matcher = new nickname_1.NicknameMatcher();
        this.nicknameClicked = new core_1.EventEmitter();
        this.micButtonClicked = new core_1.EventEmitter();
        this.camButtonClicked = new core_1.EventEmitter();
        this.exitButtonClicked = new core_1.EventEmitter();
        this.chatButtonClicked = new core_1.EventEmitter();
    }
    StreamComponent.prototype.sizeChange = function (event) {
        var maxHeight = window.screen.height;
        var maxWidth = window.screen.width;
        var curHeight = window.innerHeight;
        var curWidth = window.innerWidth;
        if (maxWidth !== curWidth && maxHeight !== curHeight) {
            this.isFullscreen = false;
            this.fullscreenIcon = 'fullscreen';
        }
    };
    StreamComponent.prototype.ngOnInit = function () { };
    StreamComponent.prototype.toggleFullscreen = function () {
        var state = this.apiSrv.toggleFullscreen('container-' + this.user.getStreamManager().stream.streamId);
        if (state === 'fullscreen') {
            this.isFullscreen = true;
            this.fullscreenIcon = 'fullscreen_exit';
            this.chatButtonClicked.emit('none');
        }
        else {
            this.isFullscreen = false;
            this.fullscreenIcon = 'fullscreen';
        }
    };
    StreamComponent.prototype.toggleSound = function () {
        this.mutedSound = !this.mutedSound;
    };
    StreamComponent.prototype.toggleNicknameForm = function () {
        if (this.user.isLocal()) {
            this.editNickname = !this.editNickname;
        }
    };
    StreamComponent.prototype.eventKeyPress = function (event) {
        if (event && event.keyCode === 13 && this.nicknameFormControl.valid) {
            this.nicknameClicked.emit(this.nicknameFormControl.value);
            this.toggleNicknameForm();
            this.nicknameFormControl.reset();
        }
    };
    StreamComponent.prototype.micStatusChanged = function () {
        this.micButtonClicked.emit();
    };
    StreamComponent.prototype.camStatusChanged = function () {
        this.camButtonClicked.emit();
    };

    StreamComponent.prototype.exitSession = function () {
        this.exitButtonClicked.emit();
    };
    StreamComponent.prototype.toggleChat = function () {
        this.toggleFullscreen();
        this.chatButtonClicked.emit('block');
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", user_model_1.UserModel)
    ], StreamComponent.prototype, "user", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", user_model_1.UserModel)
    ], StreamComponent.prototype, "localUser", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], StreamComponent.prototype, "lightTheme", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], StreamComponent.prototype, "compact", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], StreamComponent.prototype, "newMessagesNum", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StreamComponent.prototype, "nicknameClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StreamComponent.prototype, "micButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StreamComponent.prototype, "camButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StreamComponent.prototype, "exitButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], StreamComponent.prototype, "chatButtonClicked", void 0);
    __decorate([
        core_1.ViewChild('videoReference'),
        __metadata("design:type", core_1.ElementRef)
    ], StreamComponent.prototype, "htmlVideoElement", void 0);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], StreamComponent.prototype, "sizeChange", null);
    StreamComponent = __decorate([
        core_1.Component({
            selector: 'stream-component',
            styleUrls: ['./stream.component.css'],
            templateUrl: './stream.component.html',
        }),
        __metadata("design:paramtypes", [api_service_1.ApiService])
    ], StreamComponent);
    return StreamComponent;
}());
exports.StreamComponent = StreamComponent;
//# sourceMappingURL=stream.component.js.map