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
var openvidu_browser_1 = require("openvidu-browser");
var OpenViduVideoComponent = /** @class */ (function () {
    function OpenViduVideoComponent() {
    }
    OpenViduVideoComponent.prototype.ngAfterViewInit = function () {
        if (this._streamManager) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        }
    };
    Object.defineProperty(OpenViduVideoComponent.prototype, "streamManager", {
        set: function (streamManager) {
            this._streamManager = streamManager;
            if (!!this.elementRef && this._streamManager) {
                if (this._streamManager.stream.typeOfVideo === 'SCREEN') {
                    this.elementRef.nativeElement.style.objectFit = 'contain';
                    this.elementRef.nativeElement.style.background = '#636363';
                }
                else {
                    this.elementRef.nativeElement.style.objectFit = 'cover';
                }
                this._streamManager.addVideoElement(this.elementRef.nativeElement);
            }
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.ViewChild('videoElement'),
        __metadata("design:type", core_1.ElementRef)
    ], OpenViduVideoComponent.prototype, "elementRef", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], OpenViduVideoComponent.prototype, "mutedSound", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", openvidu_browser_1.StreamManager),
        __metadata("design:paramtypes", [openvidu_browser_1.StreamManager])
    ], OpenViduVideoComponent.prototype, "streamManager", null);
    OpenViduVideoComponent = __decorate([
        core_1.Component({
            selector: 'ov-video',
            template: "\n    <video\n      #videoElement\n      [attr.id]=\"streamManager && _streamManager.stream ? 'video-' + _streamManager.stream.streamId : 'video-undefined'\"\n      [muted]=\"mutedSound\"\n    ></video>\n  ",
            styleUrls: ['./stream.component.css'],
        })
    ], OpenViduVideoComponent);
    return OpenViduVideoComponent;
}());
exports.OpenViduVideoComponent = OpenViduVideoComponent;
//# sourceMappingURL=ov-video.component.js.map