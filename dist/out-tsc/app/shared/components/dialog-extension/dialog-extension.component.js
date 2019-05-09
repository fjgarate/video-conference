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
var DialogExtensionComponent = /** @class */ (function () {
    function DialogExtensionComponent() {
        this.nickname = '';
        this.cancel = new core_1.EventEmitter();
        this.openviduExtensionUrl = 'https://chrome.google.com/webstore/detail/openvidu-screensharing/lfcgfepafnobdloecchnfaclibenjold';
    }
    DialogExtensionComponent.prototype.ngOnInit = function () { };
    DialogExtensionComponent.prototype.onNoClick = function () {
        this.cancel.emit();
    };
    DialogExtensionComponent.prototype.goToChromePage = function () {
        window.open(this.openviduExtensionUrl);
        this.isInstalled = true;
    };
    DialogExtensionComponent.prototype.refreshBrowser = function () {
        window.location.reload();
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], DialogExtensionComponent.prototype, "nickname", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], DialogExtensionComponent.prototype, "cancel", void 0);
    DialogExtensionComponent = __decorate([
        core_1.Component({
            selector: 'app-dialog-extension',
            templateUrl: './dialog-extension.component.html',
            styleUrls: ['./dialog-extension.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], DialogExtensionComponent);
    return DialogExtensionComponent;
}());
exports.DialogExtensionComponent = DialogExtensionComponent;
//# sourceMappingURL=dialog-extension.component.js.map