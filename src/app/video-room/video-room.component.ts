import { Component, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute,Router } from "@angular/router";
import { OpenVidu, Publisher, Session, SignalOptions, Stream, StreamEvent, StreamManagerEvent } from 'openvidu-browser';
import { DialogErrorComponent } from '../shared/components/dialog-error/dialog-error.component';
import { OpenViduLayout, OpenViduLayoutOptions } from '../shared/layout/openvidu-layout';
import { UserModel } from '../shared/models/user-model';
import { OpenViduService } from '../shared/services/open-vidu.service';
import { ChatComponent } from '../shared/components/chat/chat.component';
import { OvSettings } from '../shared/models/ov-settings';
import { SessionEvent } from '../shared/models/sessionEvent';
import { User } from "../shared/models";
import { Subscription } from "rxjs";
import { UserService, AuthenticationService } from "../shared/services";
import { first } from "rxjs/operators";
import { SessionEventService } from '../shared/services/sessionEvent.service';
import { HttpParams } from "@angular/common/http";
import { VirtualAppointment } from '../shared/models/virtualAppointment';
import { SessionService } from '../shared/services/session.service';

@Component({
  selector: 'app-video-room',
  templateUrl: './video-room.component.html',
  styleUrls: ['./video-room.component.css'],
})
export class VideoRoomComponent implements OnInit, OnDestroy {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  // webComponent's inputs and outputs
  @Input() ovSettings: OvSettings;
  @Input() sessionName: string;
  @Input() user: string;
  @Input() openviduServerUrl: string;
  @Input() openviduSecret: string;
  @Input() token: string;
  @Input() theme: string;
  @Output() joinSession = new EventEmitter<any>();
  @Output() leaveSession = new EventEmitter<any>();
  @Output() error = new EventEmitter<any>();

  @ViewChild('chatComponent') chatComponent: ChatComponent;

  // Constants
  BIG_ELEMENT_CLASS = 'OV_big';

  // Variables
  compact = false;
  lightTheme: boolean;
  chatDisplay: 'none' | 'block' = 'none';
  showDialogExtension = false;
  showDialogChooseRoom = true;
  session: Session;
  sessionEvent: SessionEvent;
  openviduLayout: OpenViduLayout;
  openviduLayoutOptions: OpenViduLayoutOptions;
  mySessionId: string;
  myUserName: string;
  localUser: UserModel;
  remoteUsers: UserModel[];
  messageList: { connectionId: string; nickname: string; message: string}[] = [];
  newMessages = 0;
  user_p = "";
  startAt:Date;
  endAt:Date;
  private sub: any;
  private OV: OpenVidu;
  private bigElement: HTMLElement;
  sus;

  constructor(
    private openViduSrv: OpenViduService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private sessionEventService: SessionEventService,
    private sessionService : SessionService

 
  ) {
  
  }
  @HostListener('window:beforeunload')
  beforeunloadHandler() {
    this.exitSession();
  }

  @HostListener('window:resize', ['$event'])
  sizeChange(event) {
    this.openviduLayout.updateLayout();
    this.checkSizeComponent();
  }

  ngOnInit() {
    this.sessionEvent = new SessionEvent();
    console.log('pasa')
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
      console.warn(this.currentUser)
    });


    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.user_p = params["user_p"];
    });
    console.log("usuario paciente")
    console.log(this.user_p)
    this.openViduSrv.getOvSettingsData().then((data: OvSettings) => {
      this.ovSettings = this.ovSettings ? this.ovSettings : data;
    }).catch((error) => console.error(error));
  }

  ngOnDestroy() {
    this.currentUserSubscription.unsubscribe();
    console.warn("ondestroy")
    this.exitSession();
  }

  initApp() {
    this.remoteUsers = [];
    this.checkTheme();
    setTimeout(() => {
      this.openviduLayout = new OpenViduLayout();
      this.openviduLayoutOptions = {
        maxRatio: 3 / 2, // The narrowest ratio that will be used (default 2x3)
        minRatio: 9 / 16, // The widest ratio that will be used (default 16x9)
        fixedRatio: false /* If this is true then the aspect ratio of the video is maintained
        and minRatio and maxRatio are ignored (default false) */,
        bigClass: this.BIG_ELEMENT_CLASS, // The class to add to elements that should be sized bigger
        bigPercentage: 0.8, // The maximum percentage of space the big ones should take up
        bigFixedRatio: false, // fixedRatio for the big ones
        bigMaxRatio: 3 / 2, // The narrowest ratio to use for the big elements (default 2x3)
        bigMinRatio: 9 / 16, // The widest ratio to use for the big elements (default 16x9)
        bigFirst: true, // Whether to place the big one in the top left (true) or bottom right
        animate: true, // Whether you want to animate the transitions
      };
      this.openviduLayout.initLayoutContainer(document.getElementById('layout'), this.openviduLayoutOptions);
      this.joinToSession();
    }, 50);
  }

  toggleChat(property: 'none' | 'block') {
    if (property) {
      this.chatDisplay = property;
    } else {
      this.chatDisplay = this.chatDisplay === 'none' ? 'block' : 'none';
    }
    if (this.chatDisplay === 'block') {
      this.newMessages = 0;
    }
    this.openviduLayout.updateLayout();
  }

  checkNotification() {
    if (this.chatDisplay === 'none') {
      this.newMessages++;
    } else {
      this.newMessages = 0;
    }
  }

  joinToSession() {
    this.OV = new OpenVidu();
    this.session = this.OV.initSession();
    this.subscribeToUserChanged();
    this.subscribeToStreamCreated();
    this.subscribedToStreamDestroyed();
    this.subscribedToChat();
    this.connectToSession();
  }

  exitSession() {
    let save=true;
    if (this.session) {
      this.session.disconnect();
      if (this.session.streamManagers != null && this.session.streamManagers.length > 0) {
        console.log(' streamManagers: ' + this.session.streamManagers[0])
        save=false;
       // this.saveSession(this.sessionEvent)
      }
      console.log('-------------------------------------------------------------------');
      console.log('disconnect -------------------------------------------------------------------');
      console.log('sessionId: ' + this.mySessionId);
      console.log('userId: ' + this.currentUser.username);
      console.log('connectionId: ' + this.session.connection.connectionId)
      console.log('sus connectionId: ' + this.sus);
    
     
      console.log('-------------------------------------------------------------------');

      this.sessionEvent.userId = this.currentUser.id;
      this.sessionEvent.connectionId = this.session.connection.connectionId;
      this.sessionEvent.susConnectionId = this.sus
      this.sessionEvent.time = new Date();
      this.sessionEvent.comments = ''
      this.sessionEvent.event = 'disconnect'
      this.sessionEvent.sessionId = this.mySessionId;
      this.sessionEventService.register(this.sessionEvent)
        .pipe(first())
        .subscribe(
          data => {
            console.log('EVENTO DISCOCONNECT  ALMACENADO');
            //se salava la session cuando el primero cuelga
            if(save){
              this.saveSession(this.sessionEvent)
            }
          },
          error => {
            console.log('ERROR AL ALMACENAR EL EVENTO DISCONNET');
          });
     
    }
    this.remoteUsers = [];
    this.session = null;
    this.localUser = null;
    this.OV = null;
    this.openviduLayout = null;
   /* console.warn(this.currentUser)
    if (this.currentUser.role === 'clinical') {
    this.router.navigate(['clinical']) } 
    if (this.currentUser.role === 'patient') {
    this.router.navigate(['patient'] )
    }*/
    this.leaveSession.emit();
  }

  micStatusChanged(): void {
    this.localUser.setAudioActive(!this.localUser.isAudioActive());
    (<Publisher>this.localUser.getStreamManager()).publishAudio(this.localUser.isAudioActive());
    this.sendSignalUserChanged({ isAudioActive: this.localUser.isAudioActive() });
  }

  camStatusChanged(): void {
    this.localUser.setVideoActive(!this.localUser.isVideoActive());
    (<Publisher>this.localUser.getStreamManager()).publishVideo(this.localUser.isVideoActive());
    this.sendSignalUserChanged({ isVideoActive: this.localUser.isVideoActive() });
  }

  nicknameChanged(nickname: string): void {
    this.localUser.setNickname(nickname);
    this.sendSignalUserChanged({ nickname: this.localUser.getNickname() });
  }

  screenShareDisabled(): void {
    this.session.unpublish(<Publisher>this.localUser.getStreamManager());
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
  }

  toggleDialogExtension() {
    this.showDialogExtension = !this.showDialogExtension;
  }

  toggleDialogChooseRoom(data: {user: UserModel, sessionId: string}) {
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
    if (this.currentUser.role === 'clinical') {
      this.mySessionId = this.user_p;
    }
    if (this.currentUser.role === 'patient') {
    this.mySessionId = this.currentUser.id; }
  }

  screenShare() {
    const videoSource = navigator.userAgent.indexOf('Firefox') !== -1 ? 'window' : 'screen';
    const publisher = this.OV.initPublisher(undefined, {
        videoSource: videoSource,
        publishAudio: this.localUser.isAudioActive(),
        publishVideo: this.localUser.isVideoActive(),
        mirror: false,
      },
      (error) => {
        if (error && error.name === 'SCREEN_EXTENSION_NOT_INSTALLED') {
          this.toggleDialogExtension();
        } else if (error && error.name === 'SCREEN_SHARING_NOT_SUPPORTED') {
          alert('Your browser does not support screen sharing');
        } else if (error && error.name === 'SCREEN_EXTENSION_DISABLED') {
          alert('You need to enable screen sharing extension');
        } else if (error && error.name === 'SCREEN_CAPTURE_DENIED') {
          alert('You need to choose a window or application to share');
        }
      }
    );

    publisher.once('accessAllowed', () => {
      this.session.unpublish(<Publisher>this.localUser.getStreamManager());
      this.localUser.setStreamManager(publisher);
      this.session.publish(<Publisher>this.localUser.getStreamManager()).then(() => {
        this.localUser.setScreenShareActive(true);
        this.sendSignalUserChanged({ isScreenShareActive: this.localUser.isScreenShareActive() });
      }).catch((error) => console.error(error));
    });

    publisher.on('streamPlaying', () => {
      this.openviduLayout.updateLayout();
      (<HTMLElement>publisher.videos[0].video).parentElement.classList.remove('custom-class');
    });
  }

  checkSizeComponent() {
    if (document.getElementById('layout').offsetWidth <= 700) {
      this.compact = true;
      this.toggleChat('none');
    } else {
      this.compact = false;
    }
  }

  enlargeElement(event) {
    const element: HTMLElement = event.path.filter((e: HTMLElement) => e.className && e.className.includes('OT_root'))[0];
    if (this.bigElement) {
      this.bigElement.classList.remove(this.BIG_ELEMENT_CLASS);
    }
    if (this.bigElement !== element) {
      element.classList.add(this.BIG_ELEMENT_CLASS);
      this.bigElement = element;
    } else {
      this.bigElement = undefined;
    }
    this.openviduLayout.updateLayout();
  }

  private deleteRemoteStream(stream: Stream): void {
    const userStream = this.remoteUsers.filter((user: UserModel) => user.getStreamManager().stream === stream)[0];
    const index = this.remoteUsers.indexOf(userStream, 0);
    if (index > -1) {
      this.remoteUsers.splice(index, 1);
    }
  }

  private subscribeToUserChanged() {
    this.session.on('signal:userChanged', (event: any) => {
      const data = JSON.parse(event.data);
      this.remoteUsers.forEach((user: UserModel) => {
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
        }
      });
      this.checkSomeoneShareScreen();
    });
  }

  private subscribeToStreamCreated() {
    this.session.on('streamCreated', (event: StreamEvent) => {
      const subscriber = this.session.subscribe(event.stream, undefined);
      subscriber.on('streamPlaying', (e: StreamManagerEvent) => {
        this.checkSomeoneShareScreen();
        (<HTMLElement>subscriber.videos[0].video).parentElement.classList.remove('custom-class');
      });
      const newUser = new UserModel();


      newUser.setStreamManager(subscriber);
      newUser.setConnectionId(event.stream.connection.connectionId);
      console.log('-------------------------------------------------------------------');
      console.log('subscriber: ' + event.stream.connection.connectionId)
      this.sus = event.stream.connection.connectionId;
      const nickname = (event.stream.connection.data).split('%')[0];
      console.log('nickname: ' + nickname)
      console.log('-------------------------------------------------------------------');
   
      newUser.setNickname(JSON.parse(nickname).clientData);
      newUser.setType('remote');
      this.remoteUsers.push(newUser);
      this.sendSignalUserChanged({
        isAudioActive: this.localUser.isAudioActive(),
        isVideoActive: this.localUser.isVideoActive(),
        isScreenShareActive: this.localUser.isScreenShareActive(),
        nickname: this.localUser.getNickname(),
      });
    });
  }

  private subscribedToStreamDestroyed() {
    this.session.on('streamDestroyed', (event: StreamEvent) => {
        this.deleteRemoteStream(event.stream);
        this.checkSomeoneShareScreen();
        event.preventDefault();
    });
  }

  private subscribedToChat() {
    this.session.on('signal:chat', (event: any) => {
        const data = JSON.parse(event.data);
        const messageOwner =
            this.localUser.getConnectionId() === data.connectionId
                ? this.localUser
                : this.remoteUsers.filter((user) => user.getConnectionId() === data.connectionId)[0];

        this.messageList.push({
            connectionId: event.from.connectionId,
            nickname: data.nickname,
            message: data.message,
        });

        this.checkNotification();
        this.chatComponent.scrollToBottom();
    });
}

  private connectToSession(): void {
    if (this.token) {
      this.connect(this.token);
    } else {
      this.openViduSrv.getToken(this.mySessionId, this.openviduServerUrl, this.openviduSecret)
        .then((token) => {
          this.connect(token);
        })
        .catch((error) => {
          this.error.emit({ error: error.error, messgae: error.message, code: error.code, status: error.status });
          console.log('There was an error getting the token:', error.code, error.message);
          this.openDialogError('There was an error getting the token:', error.message);
        });
    }
  }

  private connect(token: string): void {
    this.session.connect(token, { clientData: this.localUser.getNickname() })
      .then(() => {
        this.connectWebCam();
        console.log('-------------------------------------------------------------------');
        console.log('connect -------------------------------------------------------------------');
        console.log('token: ' + token);
        console.log('sessionId: '+this.mySessionId);
        console.log('userId: ' + this.currentUser.username);
        console.log('connectionId: ' + this.session.connection.connectionId)
        console.log('sus connectionId: ' +this.sus);
        console.log('-------------------------------------------------------------------');
      //  this.sessionTelehealth = new SessionTelehealth();
     
        this.sessionEvent.userId = this.currentUser.id;
        this.sessionEvent.connectionId = this.session.connection.connectionId;
        this.sessionEvent.susConnectionId = this.sus
        this.sessionEvent.time = new Date();
        this.sessionEvent.comments = ''
        this.sessionEvent.event = 'connect'
        this.sessionEvent.sessionId = this.mySessionId;
        this.sessionEventService.register(this.sessionEvent)
          .pipe(first())
          .subscribe(
            data => {
              console.log('EVENTO CONNECT  ALMACENADO');
              //this.saveVirtualAppintment(this.sessionTelehealth)
            },
            error => {
              console.log('ERROR  AL ALMACENAR EL EVENTO CONNECT');
            });

      })
      .catch((error) => {
        this.error.emit({ error: error.error, messgae: error.message, code: error.code, status: error.status });
        console.log('There was an error connecting to the session:', error.code, error.message);
        this.openDialogError('There was an error connecting to the session:', error.message);
      });
  }

  private connectWebCam(): void {
    this.localUser.setConnectionId(this.session.connection.connectionId);
    console.log('session: ' + this.session);
    console.log('connectionId: ' + this.session.connection.connectionId);
    if (this.session.capabilities.publish) {
      this.session.publish(<Publisher>this.localUser.getStreamManager()).then(() => {
        this.localUser.setScreenShareActive(false);
        this.sendSignalUserChanged({
          isAudioActive: this.localUser.isAudioActive(),
          isVideoActive: this.localUser.isVideoActive(),
          isScreenShareActive: this.localUser.isScreenShareActive(),
          nickname: this.localUser.getNickname(),
        });
        this.joinSession.emit();
      }).catch((error) => console.error(error));

      this.localUser.getStreamManager().on('streamPlaying', () => {
        this.openviduLayout.updateLayout();
        (<HTMLElement>this.localUser.getStreamManager().videos[0].video).parentElement.classList.remove('custom-class');
      });
    }
  }

  private sendSignalUserChanged(data: any): void {
    const signalOptions: SignalOptions = {
      data: JSON.stringify(data),
      type: 'userChanged',
    };
    this.session.signal(signalOptions);
  }

  private openDialogError(message, messageError: string) {
    this.dialog.open(DialogErrorComponent, {
      width: '450px',
      data: { message: message, messageError: messageError },
    });
  }

  private checkSomeoneShareScreen() {
    let isScreenShared: boolean;
    // return true if at least one passes the test
    isScreenShared = this.remoteUsers.some((user) => user.isScreenShareActive()) || this.localUser.isScreenShareActive();
    this.openviduLayoutOptions.fixedRatio = isScreenShared;
    this.openviduLayout.setLayoutOptions(this.openviduLayoutOptions);
    this.openviduLayout.updateLayout();
  }

  private checkTheme() {
    this.lightTheme = this.theme === 'light';
  }
  private saveSession(sessionEvent: SessionEvent){
   
    this.endAt = sessionEvent.time;
    let filter = new HttpParams().set('susConnectionId', sessionEvent.connectionId).set('connectionId', sessionEvent.susConnectionId).set('event', "connect")
    let doctorId;
    let patientId;
    this.sessionEventService
      .getByFilter(this.currentUser.token, filter)
      .pipe(first())
      .subscribe(sessionEvens => {
        if (sessionEvens.length>0){
          let event = sessionEvens[0];
          this.startAt = event.time;
          console.log('ROL: ' + this.currentUser.role)
          console.log('sessionEvent' + sessionEvent.userId)
          console.log('event' + event.userId)
          if(this.currentUser.role == 'clinical'){
             doctorId = sessionEvent.userId;
             patientId = event.userId;
          }else{
             doctorId = event.userId; 
             patientId = sessionEvent.userId;
          }
          let session = new VirtualAppointment();
          session.doctorId = doctorId;
          session.patientId = patientId;
          session.startAt = this.startAt;
          session.endAt = this.endAt;
          console.log("session: "+session )
          let duration = ''
          var time = ((new Date(this.endAt)).valueOf() - (new Date(this.startAt)).valueOf()) / 1000 //seg
          console.log('time: ' + time)
          if (time < 60) {
            duration = Math.round(time) + 'sec'
          } else {
            var minutes = Math.floor(time / 60);
            var seconds = time - minutes * 60;
            duration = Math.round(minutes) + ' min ' + Math.round(seconds) + ' sec'
          }
          session.duration = duration;
          console.log('duration: ' + duration)
          this.sessionService.register(session)
            .pipe(first())
            .subscribe(
              data => {
                console.log('SESSION ALMACENADA');
                //this.saveVirtualAppintment(this.sessionTelehealth)
              },
              error => {
                console.log('ERROR  AL ALMACENAR LA SESSION');
              });
        }else{
          let filter = new HttpParams().set('connectionId', sessionEvent.connectionId).set('susConnectionId', sessionEvent.susConnectionId).set('event', "connect")

          this.sessionEventService
            .getByFilter(this.currentUser.token, filter)
            .pipe(first())
            .subscribe(sessionEvens => {
              if (sessionEvens.length > 0) {
                let event = sessionEvens[0];
                this.startAt = event.time;
                //console.log('ROL: '+this.currentUser.role)
                console.log('sessionEvent' + sessionEvent.userId)
                console.log('event' + event.userId)


                if (this.currentUser.role == 'clinical') {
                  doctorId = sessionEvent.userId;
                  patientId = event.userId;
                } else {
                  doctorId = event.userId;
                  patientId = sessionEvent.userId;
                }
                let session = new VirtualAppointment();
                session.doctorId = doctorId;
                session.patientId = sessionEvent.sessionId;
                session.startAt = this.startAt;
                session.endAt = this.endAt;
                console.log("session2: " + session)
                let duration=''
                var time = ((new Date(this.endAt)).valueOf() - (new Date(this.startAt)).valueOf())/1000 //seg
                console.log('time: ' + time)
                if(time<60){
                  duration = Math.round(time) + 'sec'
                }else{
                  var minutes = Math.floor(time / 60);
                  var seconds = time - minutes * 60;
                  duration = Math.round(minutes) + ' min ' + Math.round(seconds) + ' sec'
                }
                session.duration=duration;
                console.log('duration: ' + duration)
                this.sessionService.register(session)
                  .pipe(first())
                  .subscribe(
                    data => {
                      console.log('SESSION ALMACENADA');
                      //this.saveVirtualAppintment(this.sessionTelehealth)
                    },
                    error => {
                      console.log('ERROR  AL ALMACENAR LA SESSION ' +error);
                    });
              }


            });

        }
      });
  }
}
