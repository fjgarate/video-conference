"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Packs all the information about the user
 */
var UserModel = /** @class */ (function () {
    /**
     * @hidden
     */
    function UserModel() {
        this.connectionId = '';
        this.audioActive = true;
        this.videoActive = true;
        this.screenShareActive = false;
        this.nickname = '';
        this.streamManager = null;
        this.type = 'local';
    }
    /**
     * Return `true` if audio track is active and `false` if audio track is muted
     */
    UserModel.prototype.isAudioActive = function () {
        return this.audioActive;
    };
    /**
     * Return `true` if video track is active and `false` if video track is muted
     */
    UserModel.prototype.isVideoActive = function () {
        return this.videoActive;
    };
    /**
     * Return `true` if user is sharing the screen and `false` if not
     */
    UserModel.prototype.isScreenShareActive = function () {
        return this.screenShareActive;
    };
    /**
     * Return the connection ID
     */
    UserModel.prototype.getConnectionId = function () {
        return this.connectionId;
    };
    /**
     * Return the user nickname
     */
    UserModel.prototype.getNickname = function () {
        return this.nickname;
    };
    /**
     * Return the [[streamManger]] object
     */
    UserModel.prototype.getStreamManager = function () {
        return this.streamManager;
    };
    /**
     */

    /**
     * Return `true` if user has a local role and `false` if not
     */
    UserModel.prototype.isLocal = function () {
        return this.type === 'local';
    };
    /**
     * Return `true` if user has a remote role and `false` if not
     */
    UserModel.prototype.isRemote = function () {
        return !this.isLocal();
    };
    /**
     * Set the audioActive value
     * @param isAudioActive value of audioActive
     */
    UserModel.prototype.setAudioActive = function (isAudioActive) {
        this.audioActive = isAudioActive;
    };
    /**
     * Set the videoActive value
     * @param isVideoActive value of videoActive
     */
    UserModel.prototype.setVideoActive = function (isVideoActive) {
        this.videoActive = isVideoActive;
    };
    /**
     * Set the screenShare value
     * @param isScreenShareActive value of isScreenShareActive
     */
    UserModel.prototype.setScreenShareActive = function (isScreenShareActive) {
        this.screenShareActive = isScreenShareActive;
    };
    /**
     * Set the streamManager value object
     * @param streamManager value of streamManager
     */
    UserModel.prototype.setStreamManager = function (streamManager) {
        this.streamManager = streamManager;
    };
    /**
     * Set the connectionId value
     * @param conecctionId value of connectionId
     */
    UserModel.prototype.setConnectionId = function (conecctionId) {
        this.connectionId = conecctionId;
    };
    /**
     * Set the user nickname value
     * @param nickname value of user nickname
     */
    UserModel.prototype.setNickname = function (nickname) {
        this.nickname = nickname;
    };
    /**
     * Set the user type value
     * @param type value of user type
     */
    UserModel.prototype.setType = function (type) {
        this.type = type;
    };
    /**
     * @hidden
     */
    /**
     * @hidden
     */

    return UserModel;
}());
exports.UserModel = UserModel;
//# sourceMappingURL=user-model.js.map