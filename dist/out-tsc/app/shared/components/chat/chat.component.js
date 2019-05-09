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
var openvidu_browser_1 = require("openvidu-browser");
var ChatComponent = /** @class */ (function () {
    function ChatComponent() {
        this.messageList = [];
        this.closeChat = new core_1.EventEmitter();
    }
    ChatComponent.prototype.onKeydownHandler = function (event) {
        console.log(event);
        if (this._chatDisplay === 'block') {
            this.close();
        }
    };
    ChatComponent.prototype.ngOnInit = function () { };
    Object.defineProperty(ChatComponent.prototype, "isDisplayed", {
        set: function (display) {
            var _this = this;
            this._chatDisplay = display;
            if (this._chatDisplay === 'block') {
                this.scrollToBottom();
                setTimeout(function () {
                    _this.chatInput.nativeElement.focus();
                });
            }
        },
        enumerable: true,
        configurable: true
    });
    ChatComponent.prototype.eventKeyPress = function (event) {
        if (event && event.keyCode === 13) {
            // Press Enter
            this.sendMessage();
        }
    };
    ChatComponent.prototype.sendMessage = function () {
        if (this.user && this.message) {
            this.message = this.message.replace(/ +(?= )/g, '');
            if (this.message !== '' && this.message !== ' ') {
                var data = {
                    connectionId: this.session.connection.connectionId,
                    message: this.message,
                    nickname: this.user.getNickname(),
                };
                this.session.signal({
                    data: JSON.stringify(data),
                    type: 'chat',
                });
                this.message = '';
            }
        }
    };
    ChatComponent.prototype.scrollToBottom = function () {
        var _this = this;
        setTimeout(function () {
            try {
                _this.chatScroll.nativeElement.scrollTop = _this.chatScroll.nativeElement.scrollHeight;
            }
            catch (err) { }
        }, 20);
    };
    ChatComponent.prototype.close = function () {
        this.closeChat.emit();
    };
    __decorate([
        core_1.ViewChild('chatScroll'),
        __metadata("design:type", core_1.ElementRef)
    ], ChatComponent.prototype, "chatScroll", void 0);
    __decorate([
        core_1.ViewChild('chatInput'),
        __metadata("design:type", core_1.ElementRef)
    ], ChatComponent.prototype, "chatInput", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", openvidu_browser_1.Session)
    ], ChatComponent.prototype, "session", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", user_model_1.UserModel)
    ], ChatComponent.prototype, "user", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Boolean)
    ], ChatComponent.prototype, "lightTheme", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", Array)
    ], ChatComponent.prototype, "messageList", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], ChatComponent.prototype, "closeChat", void 0);
    __decorate([
        core_1.HostListener('document:keydown.escape', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [KeyboardEvent]),
        __metadata("design:returntype", void 0)
    ], ChatComponent.prototype, "onKeydownHandler", null);
    __decorate([
        core_1.Input('chatDisplay'),
        __metadata("design:type", String),
        __metadata("design:paramtypes", [String])
    ], ChatComponent.prototype, "isDisplayed", null);
    ChatComponent = __decorate([
        core_1.Component({
            selector: 'chat-component',
            templateUrl: './chat.component.html',
            styleUrls: ['./chat.component.css'],
        }),
        __metadata("design:paramtypes", [])
    ], ChatComponent);
    return ChatComponent;
}());
exports.ChatComponent = ChatComponent;
//# sourceMappingURL=chat.component.js.map