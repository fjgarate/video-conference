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
var api_service_1 = require("../../services/api.service");
var ToolbarComponent = /** @class */ (function () {
    function ToolbarComponent(apiSrv) {
        this.apiSrv = apiSrv;
        this.fullscreenIcon = 'fullscreen';
        this.micButtonClicked = new core_1.EventEmitter();
        this.camButtonClicked = new core_1.EventEmitter();
        this.exitButtonClicked = new core_1.EventEmitter();
        this.chatButtonClicked = new core_1.EventEmitter();
        this.screenShareDisabledClicked = new core_1.EventEmitter();
    }
    ToolbarComponent.prototype.sizeChange = function (event) {
        var maxHeight = window.screen.height;
        var maxWidth = window.screen.width;
        var curHeight = window.innerHeight;
        var curWidth = window.innerWidth;
        if (maxWidth !== curWidth && maxHeight !== curHeight) {
            this.fullscreenIcon = 'fullscreen';
        }
    };
    ToolbarComponent.prototype.ngOnInit = function () { };
    ToolbarComponent.prototype.micStatusChanged = function () {
        this.micButtonClicked.emit();
    };
    ToolbarComponent.prototype.camStatusChanged = function () {
        this.camButtonClicked.emit();
    };

    ToolbarComponent.prototype.exitSession = function () {
        this.exitButtonClicked.emit();
    };
    ToolbarComponent.prototype.toggleChat = function () {
        this.chatButtonClicked.emit();
    };
    ToolbarComponent.prototype.toggleFullscreen = function () {
        var state = this.apiSrv.toggleFullscreen('videoRoomNavBar');
        if (state === 'fullscreen') {
            this.fullscreenIcon = 'fullscreen_exit';
        }
        else {
            this.fullscreenIcon = 'fullscreen';
        }
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ToolbarComponent.prototype, "lightTheme", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ToolbarComponent.prototype, "mySessionId", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", user_model_1.UserModel)
    ], ToolbarComponent.prototype, "localUser", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ToolbarComponent.prototype, "compact", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ToolbarComponent.prototype, "showNotification", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Number)
    ], ToolbarComponent.prototype, "newMessagesNum", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "ovSettings", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "micButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "camButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "exitButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "chatButtonClicked", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ToolbarComponent.prototype, "sizeChange", null);
    ToolbarComponent = __decorate([
        core_1.Component({
            selector: 'app-toolbar',
            templateUrl: './toolbar.component.html',
            styleUrls: ['./toolbar.component.css'],
        }),
        __metadata("design:paramtypes", [api_service_1.ApiService])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;
//# sourceMappingURL=toolbar.component.js.map