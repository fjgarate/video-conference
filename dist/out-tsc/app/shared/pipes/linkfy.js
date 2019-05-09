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
var ngx_linkifyjs_1 = require("ngx-linkifyjs");
var LinkifyPipe = /** @class */ (function () {
    function LinkifyPipe(linkifyService) {
        this.linkifyService = linkifyService;
    }
    LinkifyPipe.prototype.transform = function (str) {
        return str ? this.linkifyService.linkify(str) : str;
    };
    LinkifyPipe = __decorate([
        core_1.Pipe({ name: 'linkify' }),
        __metadata("design:paramtypes", [ngx_linkifyjs_1.NgxLinkifyjsService])
    ], LinkifyPipe);
    return LinkifyPipe;
}());
exports.LinkifyPipe = LinkifyPipe;
//# sourceMappingURL=linkfy.js.map