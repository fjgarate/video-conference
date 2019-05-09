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
var material_1 = require("@angular/material");
var router_1 = require("@angular/router");
var openvidu_browser_1 = require("openvidu-browser");
var dialog_error_component_1 = require("../shared/components/dialog-error/dialog-error.component");
var openvidu_layout_1 = require("../shared/layout/openvidu-layout");
var user_model_1 = require("../shared/models/user-model");
var open_vidu_service_1 = require("../shared/services/open-vidu.service");
var chat_component_1 = require("../shared/components/chat/chat.component");
var services_1 = require("../shared/services");
var VideoRoomComponent = /** @class */ (function () {
    function VideoRoomComponent(openViduSrv, router, route, dialog, authenticationService, userService) {
        var _this = this;
        this.openViduSrv = openViduSrv;
        this.router = router;
        this.route = route;
        this.dialog = dialog;
        this.authenticationService = authenticationService;
        this.userService = userService;
        this.users = [];
        this.joinSession = new core_1.EventEmitter();
        this.leaveSession = new core_1.EventEmitter();
        this.error = new core_1.EventEmitter();
        // Constants
        this.BIG_ELEMENT_CLASS = 'OV_big';
        // Variables
        this.compact = false;
        this.chatDisplay = 'none';
        this.showDialogExtension = false;
        this.showDialogChooseRoom = true;
        this.messageList = [];
        this.newMessages = 0;
        this.user_p = "";
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(function (user) {
            _this.currentUser = user;
        });
    }
    VideoRoomComponent.prototype.beforeunloadHandler = function () {
        this.exitSession();
    };
    VideoRoomComponent.prototype.sizeChange = function (event) {
        this.openviduLayout.updateLayout();
        this.checkSizeComponent();
    };
    VideoRoomComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.route.queryParams.subscribe(function (params) {
            // Defaults to 0 if no query param provided.
            _this.user_p = params["user_p"];
        });
        console.log("usuario paciente");
        console.log(this.user_p);
        this.openViduSrv.getOvSettingsData().then(function (data) {
            _this.ovSettings = _this.ovSettings ? _this.ovSettings : data;
        }).catch(function (error) { return console.error(error); });
    };
    VideoRoomComponent.prototype.ngOnDestroy = function () {
        this.currentUserSubscription.unsubscribe();
        this.exitSession();
    };
    VideoRoomComponent.prototype.initApp = function () {
        var _this = this;
        this.remoteUsers = [];
        this.checkTheme();
        setTimeout(function () {
            _this.openviduLayout = new openvidu_layout_1.OpenViduLayout();
            _this.openviduLayoutOptions = {
                maxRatio: 3 / 2,
                minRatio: 9 / 16,
                fixedRatio: false /* If this is true then the aspect ratio of the video is maintained
                and minRatio and maxRatio are ignored (default false) */,
                bigClass: _this.BIG_ELEMENT_CLASS,
                bigPercentage: 0.8,
                bigFixedRatio: false,
                bigMaxRatio: 3 / 2,
                bigMinRatio: 9 / 16,
                bigFirst: true,
                animate: true,
            };
            _this.openviduLayout.initLayoutContainer(document.getElementById('layout'), _this.openviduLayoutOptions);
            _this.joinToSession();
        }, 50);
    };
    VideoRoomComponent.prototype.toggleChat = function (property) {
        if (property) {
            this.chatDisplay = property;
        }
        else {
            this.chatDisplay = this.chatDisplay === 'none' ? 'block' : 'none';
        }
        if (this.chatDisplay === 'block') {
            this.newMessages = 0;
        }
        this.openviduLayout.updateLayout();
    };
    VideoRoomComponent.prototype.checkNotification = function () {
        if (this.chatDisplay === 'none') {
            this.newMessages++;
        }
        else {
            this.newMessages = 0;
        }
    };
    VideoRoomComponent.prototype.joinToSession = function () {
        this.OV = new openvidu_browser_1.OpenVidu();
        this.session = this.OV.initSession();
        this.subscribeToUserChanged();
        this.subscribeToStreamCreated();
        this.subscribedToStreamDestroyed();
        this.subscribedToChat();
        this.connectToSession();
    };
    VideoRoomComponent.prototype.exitSession = function () {
        if (this.session) {
            this.session.disconnect();
        }
        this.remoteUsers = [];
        this.session = null;
        this.localUser = null;
        this.OV = null;
        this.openviduLayout = null;
        if (this.currentUser.role === 'doctor') {
            this.router.navigate(['doctor']);
        }
        if (this.currentUser.role === 'patient') {
            this.router.navigate(['patient']);
        }
        this.leaveSession.emit();
    };
    VideoRoomComponent.prototype.micStatusChanged = function () {
        this.localUser.setAudioActive(!this.localUser.isAudioActive());
        this.localUser.getStreamManager().publishAudio(this.localUser.isAudioActive());
        this.sendSignalUserChanged({ isAudioActive: this.localUser.isAudioActive() });
    };
    VideoRoomComponent.prototype.camStatusChanged = function () {
        this.localUser.setVideoActive(!this.localUser.isVideoActive());
        this.localUser.getStreamManager().publishVideo(this.localUser.isVideoActive());
        this.sendSignalUserChanged({ isVideoActive: this.localUser.isVideoActive() });
    };
    VideoRoomComponent.prototype.nicknameChanged = function (nickname) {
        this.localUser.setNickname(nickname);
        this.sendSignalUserChanged({ nickname: this.localUser.getNickname() });
    };
    VideoRoomComponent.prototype.screenShareDisabled = function () {
        this.session.unpublish(this.localUser.getStreamManager());
        this.localUser.setStreamManager(this.OV.initPublisher(undefined, {
            audioSource: undefined,
            videoSource: undefined,
            publishAudio: this.localUser.isAudioActive(),
            publishVideo: this.localUser.isVideoActive(),
            resolution: '640x480',
            frameRate: 30,
            insertMode: 'APPEND',
        }));
        this.connectWebCam();
    };
    VideoRoomComponent.prototype.toggleDialogExtension = function () {
        this.showDialogExtension = !this.showDialogExtension;
    };
    VideoRoomComponent.prototype.toggleDialogChooseRoom = function (data) {
        this.showDialogChooseRoom = false;
        this.localUser = data.user;
        //this.mySessionId = data.sessionId;
        /*if (this.currentUser.role === 'patient') {
          this.mySessionId = this.currentUser.username;
        } else {
          this.mySessionId = this
        }*/
        //this.mySessionId = this.currentUser.username;
        this.initApp();
        if (this.currentUser.role === 'doctor') {
            this.mySessionId = this.user_p;
        }
        if (this.currentUser.role === 'patient') {
            this.mySessionId = this.currentUser.id;
        }
    };
    VideoRoomComponent.prototype.screenShare = function () {
        var _this = this;
        var videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
        var publisher = this.OV.initPublisher(undefined, {
            videoSource: videoSource,
            publishAudio: this.localUser.isAudioActive(),
            publishVideo: this.localUser.isVideoActive(),
            mirror: false,
        }, function (error) {
            if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
                _this.toggleDialogExtension();
            }
            else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
                alert('Your browser does not support screen sharing');
            }
            else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
                alert('You need to enable screen sharing extension');
            }
            else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
                alert('You need to choose a window or application to share');
            }
        });
        publisher.once('accessAllowed', function () {
            _this.session.unpublish(_this.localUser.getStreamManager());
            _this.localUser.setStreamManager(publisher);
            _this.session.publish(_this.localUser.getStreamManager()).then(function () {
                _this.localUser.setScreenShareActive(true);
                _this.sendSignalUserChanged({ isScreenShareActive: _this.localUser.isScreenShareActive() });
            }).catch(function (error) { return console.error(error); });
        });
        publisher.on('streamPlaying', function () {
            _this.openviduLayout.updateLayout();
            publisher.videos[0].video.parentElement.classList.remove('custom-class');
        });
    };
    VideoRoomComponent.prototype.checkSizeComponent = function () {
        if (document.getElementById('layout').offsetWidth <= 700) {
            this.compact = true;
            this.toggleChat('none');
        }
        else {
            this.compact = false;
        }
    };
    VideoRoomComponent.prototype.enlargeElement = function (event) {
        var element = event.path.filter(function (e) { return e.className && e.className.includes('OT_root'); })[0];
        if (this.bigElement) {
            this.bigElement.classList.remove(this.BIG_ELEMENT_CLASS);
        }
        if (this.bigElement !== element) {
            element.classList.add(this.BIG_ELEMENT_CLASS);
            this.bigElement = element;
        }
        else {
            this.bigElement = undefined;
        }
        this.openviduLayout.updateLayout();
    };
    VideoRoomComponent.prototype.deleteRemoteStream = function (stream) {
        var userStream = this.remoteUsers.filter(function (user) { return user.getStreamManager().stream === stream; })[0];
        var index = this.remoteUsers.indexOf(userStream, 0);
        if (index > -1) {
            this.remoteUsers.splice(index, 1);
        }
    };
    VideoRoomComponent.prototype.subscribeToUserChanged = function () {
        var _this = this;
        this.session.on('signal:userChanged', function (event) {
            var data = JSON.parse(event.data);
            _this.remoteUsers.forEach(function (user) {
                if (user.getConnectionId() === event.from.connectionId) {
                    if (data.isAudioActive !== undefined) {
                        user.setAudioActive(data.isAudioActive);
                    }
                    if (data.isVideoActive !== undefined) {
                        user.setVideoActive(data.isVideoActive);
                    }
                    if (data.nickname !== undefined) {
                        user.setNickname(data.nickname);
                    }
                    if (data.isScreenShareActive !== undefined) {
                        user.setScreenShareActive(data.isScreenShareActive);
                    }
                    if (data.avatar !== undefined) {
                        user.setUserAvatar(data.avatar);
                    }
                }
            });
            _this.checkSomeoneShareScreen();
        });
    };
    VideoRoomComponent.prototype.subscribeToStreamCreated = function () {
        var _this = this;
        this.session.on('streamCreated', function (event) {
            var subscriber = _this.session.subscribe(event.stream, undefined);
            subscriber.on('streamPlaying', function (e) {
                _this.checkSomeoneShareScreen();
                subscriber.videos[0].video.parentElement.classList.remove('custom-class');
            });
            var newUser = new user_model_1.UserModel();
            newUser.setStreamManager(subscriber);
            newUser.setConnectionId(event.stream.connection.connectionId);
            var nickname = (event.stream.connection.data).split('%')[0];
            newUser.setNickname(JSON.parse(nickname).clientData);
            newUser.setType('remote');
            _this.remoteUsers.push(newUser);
            _this.sendSignalUserChanged({
                isAudioActive: _this.localUser.isAudioActive(),
                isVideoActive: _this.localUser.isVideoActive(),
                isScreenShareActive: _this.localUser.isScreenShareActive(),
                nickname: _this.localUser.getNickname(),
                avatar: _this.localUser.getAvatar()
            });
        });
    };
    VideoRoomComponent.prototype.subscribedToStreamDestroyed = function () {
        var _this = this;
        this.session.on('streamDestroyed', function (event) {
            _this.deleteRemoteStream(event.stream);
            _this.checkSomeoneShareScreen();
            event.preventDefault();
        });
    };
    VideoRoomComponent.prototype.subscribedToChat = function () {
        var _this = this;
        this.session.on('signal:chat', function (event) {
            var data = JSON.parse(event.data);
            var messageOwner = _this.localUser.getConnectionId() === data.connectionId
                ? _this.localUser
                : _this.remoteUsers.filter(function (user) { return user.getConnectionId() === data.connectionId; })[0];
            _this.messageList.push({
                connectionId: event.from.connectionId,
                nickname: data.nickname,
                message: data.message,
                userAvatar: messageOwner.getAvatar()
            });
            _this.checkNotification();
            _this.chatComponent.scrollToBottom();
        });
    };
    VideoRoomComponent.prototype.connectToSession = function () {
        var _this = this;
        if (this.token) {
            this.connect(this.token);
        }
        else {
            this.openViduSrv.getToken(this.mySessionId, this.openviduServerUrl, this.openviduSecret)
                .then(function (token) {
                _this.connect(token);
            })
                .catch(function (error) {
                _this.error.emit({ error: error.error, messgae: error.message, code: error.code, status: error.status });
                console.log('There was an error getting the token:', error.code, error.message);
                _this.openDialogError('There was an error getting the token:', error.message);
            });
        }
    };
    VideoRoomComponent.prototype.connect = function (token) {
        var _this = this;
        this.session.connect(token, { clientData: this.localUser.getNickname() })
            .then(function () {
            _this.connectWebCam();
        })
            .catch(function (error) {
            _this.error.emit({ error: error.error, messgae: error.message, code: error.code, status: error.status });
            console.log('There was an error connecting to the session:', error.code, error.message);
            _this.openDialogError('There was an error connecting to the session:', error.message);
        });
    };
    VideoRoomComponent.prototype.connectWebCam = function () {
        var _this = this;
        this.localUser.setConnectionId(this.session.connection.connectionId);
        if (this.session.capabilities.publish) {
            this.session.publish(this.localUser.getStreamManager()).then(function () {
                _this.localUser.setScreenShareActive(false);
                _this.sendSignalUserChanged({
                    isAudioActive: _this.localUser.isAudioActive(),
                    isVideoActive: _this.localUser.isVideoActive(),
                    isScreenShareActive: _this.localUser.isScreenShareActive(),
                    nickname: _this.localUser.getNickname(),
                    avatar: _this.localUser.getAvatar()
                });
                _this.joinSession.emit();
            }).catch(function (error) { return console.error(error); });
            this.localUser.getStreamManager().on('streamPlaying', function () {
                _this.openviduLayout.updateLayout();
                _this.localUser.getStreamManager().videos[0].video.parentElement.classList.remove('custom-class');
            });
        }
    };
    VideoRoomComponent.prototype.sendSignalUserChanged = function (data) {
        var signalOptions = {
            data: JSON.stringify(data),
            type: 'userChanged',
        };
        this.session.signal(signalOptions);
    };
    VideoRoomComponent.prototype.openDialogError = function (message, messageError) {
        this.dialog.open(dialog_error_component_1.DialogErrorComponent, {
            width: '450px',
            data: { message: message, messageError: messageError },
        });
    };
    VideoRoomComponent.prototype.checkSomeoneShareScreen = function () {
        var isScreenShared;
        // return true if at least one passes the test
        isScreenShared = this.remoteUsers.some(function (user) { return user.isScreenShareActive(); }) || this.localUser.isScreenShareActive();
        this.openviduLayoutOptions.fixedRatio = isScreenShared;
        this.openviduLayout.setLayoutOptions(this.openviduLayoutOptions);
        this.openviduLayout.updateLayout();
    };
    VideoRoomComponent.prototype.checkTheme = function () {
        this.lightTheme = this.theme === 'light';
    };
    __decorate([
        core_1.Input(),
        __metadata("design:type", Object)
    ], VideoRoomComponent.prototype, "ovSettings", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "sessionName", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "user", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "openviduServerUrl", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "openviduSecret", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "token", void 0);
    __decorate([
        core_1.Input(),
        __metadata("design:type", String)
    ], VideoRoomComponent.prototype, "theme", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], VideoRoomComponent.prototype, "joinSession", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], VideoRoomComponent.prototype, "leaveSession", void 0);
    __decorate([
        core_1.Output(),
        __metadata("design:type", Object)
    ], VideoRoomComponent.prototype, "error", void 0);
    __decorate([
        core_1.ViewChild('chatComponent'),
        __metadata("design:type", chat_component_1.ChatComponent)
    ], VideoRoomComponent.prototype, "chatComponent", void 0);
    __decorate([
        core_1.HostListener('window:beforeunload'),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", []),
        __metadata("design:returntype", void 0)
    ], VideoRoomComponent.prototype, "beforeunloadHandler", null);
    __decorate([
        core_1.HostListener('window:resize', ['$event']),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", void 0)
    ], VideoRoomComponent.prototype, "sizeChange", null);
    VideoRoomComponent = __decorate([
        core_1.Component({
            selector: 'app-video-room',
            templateUrl: './video-room.component.html',
            styleUrls: ['./video-room.component.css'],
        }),
        __metadata("design:paramtypes", [open_vidu_service_1.OpenViduService,
            router_1.Router,
            router_1.ActivatedRoute,
            material_1.MatDialog,
            services_1.AuthenticationService,
            services_1.UserService])
    ], VideoRoomComponent);
    return VideoRoomComponent;
}());
exports.VideoRoomComponent = VideoRoomComponent;
//# sourceMappingURL=video-room.component.js.map