import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { UserModel } from '../../models/user-model';
import { ApiService } from '../../services/api.service';
import { OpenVidu, Publisher } from 'openvidu-browser';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { User } from '../../models/user';
import { Subscription } from 'rxjs';
import { UserService, AuthenticationService } from '../../services';
import { DoctorComponent } from '../../../doctor/doctor.component';
import { first } from 'rxjs/operators';


interface IDevices {
  label: string;
  device: string;
}

@Component({
  selector: 'app-dialog-choose-room',
  templateUrl: './dialog-choose-room.component.html',
  styleUrls: ['./dialog-choose-room.component.css'],
})
export class DialogChooseRoomComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  users: User[] = [];
  user_p = '';
  private sub: any;
  pacientes: User[]=[];

  @Input() userNickname: string;
  @Input() sessionName: string;
  @Input() autopublish: boolean;
  @Output() join = new EventEmitter<any>();
  hover1: boolean;
  hover2: boolean;
  mySessionId: string;
  cameras: IDevices[] = [{ label: 'None', device: null }];
  microphones: IDevices[] = [{ label: 'None', device: null }];
  camValue: IDevices;
  micValue: IDevices;
  isVideoActive = true;
  isAudioActive = true;
  volumeValue = 100;

  user: UserModel = new UserModel();
  columns: number;
  private OV: OpenVidu;

  nicknameFormControl = new FormControl('', [Validators.maxLength(25), Validators.required]);

  constructor(private route: ActivatedRoute, private apiSrv: ApiService, private authenticationService: AuthenticationService,
    private userService: UserService, private router: Router) {
    this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
      this.currentUser = user;
    });
    }

   get isDoctor() {
     return this.currentUser && this.currentUser.role === 'clinical';
   }

  ngOnInit() {
    this.OV = new OpenVidu();
    this.generateNickname();
    this.setSessionName();
    this.setDevicesValue();
    this.columns = (window.innerWidth > 900) ? 2 : 1;
    this.sub = this.route.queryParams.subscribe(params => {
      // Defaults to 0 if no query param provided.
      this.user_p = params['user_p'];
    });
    console.log('usuario paciente');
    console.log(this.user_p);
    this.getById();
  }

  toggleCam() {
    this.isVideoActive = !this.isVideoActive;
    this.user.setVideoActive(this.isVideoActive);
    (<Publisher>this.user.getStreamManager()).publishVideo(this.isVideoActive);
  }

  camChanged(label: string) {
    const initPublisherRequired = this.camValue.label !== 'None' && label !== 'None';
    const option = this.cameras.filter((opt: IDevices) => opt.label === label)[0];
    this.camValue = option;
    this.isVideoActive = this.camValue.label === 'None' ? false : true;
    this.user.setVideoActive(this.isVideoActive);
    (<Publisher>this.user.getStreamManager()).publishVideo(this.isVideoActive);
    if (initPublisherRequired) {
      this.launchNewPublisher();
    }
  }

  toggleMic() {
    this.isAudioActive = !this.isAudioActive;
    this.user.setAudioActive(this.isAudioActive);
    (<Publisher>this.user.getStreamManager()).publishAudio(this.isAudioActive);
  }

  micChanged(label: string) {
    const initPublisherRequired = this.micValue.label !== 'None' && label !== 'None';
    const option = this.microphones.filter((opt: IDevices) => opt.label === label)[0];
    this.micValue = option;
    this.isAudioActive = this.micValue.label === 'None' ? false : true;
    this.user.setAudioActive(this.isAudioActive);
    (<Publisher>this.user.getStreamManager()).publishAudio(this.isAudioActive);
    if (initPublisherRequired) {
      this.launchNewPublisher();
    }
  }

  subscribeToVolumeChange(publisher: Publisher) {
    publisher.on('streamAudioVolumeChange', (event: any) => {
      this.volumeValue = Math.round(Math.abs(event.value.newValue));
    });
  }


  generateNickname() {
    const nickname = this.userNickname ? this.userNickname : this.currentUser.firstName +' '+ this.currentUser.lastName;
    this.nicknameFormControl.setValue(nickname);
  }

  eventKeyPress(event) {
    if (event && event.keyCode === 13 && this.nicknameFormControl.valid) {
      this.accept();
    }
  }

  onResize(event) {
    this.columns = (event.target.innerWidth > 900) ? 2 : 1;
  }

  updateVolumeColor(): string {
    // max = 0 / min = 100
    if (this.volumeValue <= 20) {
      return 'warn';
    } else if (this.volumeValue > 20 && this.volumeValue <= 35) {
      return 'accent';
    } else if (this.volumeValue > 35) {
      return 'primary';
    }
  }

  accept() {
    if (this.nicknameFormControl.valid) {
      this.user.getStreamManager().off('streamAudioVolumeChange');
      this.user.setNickname(this.nicknameFormControl.value);
      this.join.emit({ user: this.user, sessionId: this.mySessionId });
    }
  }

  private setDevicesValue() {
    this.OV.getDevices().then((devices: any) => {
      console.log('Devices: ', devices);
      devices.forEach((device: any) => {
        if (device.kind === 'audioinput') {
          this.microphones.push({ label: device.label, device: device.deviceId });
        } else {
          this.cameras.push({ label: device.label, device: device.deviceId });
        }
      });
      this.camValue = this.cameras[1] ? this.cameras[1] : this.cameras[0];
      this.micValue = this.microphones[1] ? this.microphones[1] : this.microphones[0];
      this.initPublisher();
    }).catch((error) => console.error(error));
  }
  private setSessionName() {
    this.route.params.subscribe((params: Params) => {
      this.mySessionId = this.sessionName ? this.sessionName : params.roomName;
    });
  }



  private initPublisher() {
    this.OV.initPublisherAsync(undefined, {
      audioSource: this.micValue.device,
      videoSource: this.camValue.device,
      publishAudio: this.isAudioActive,
      publishVideo: this.isVideoActive,
      resolution: '640x480',
      frameRate: 30,
      insertMode: 'APPEND',
    }).then(publisher => {
      this.subscribeToVolumeChange(publisher);
      this.user.setStreamManager(publisher);
      if (this.autopublish) {
        this.accept();
      }
    }).catch((error) => console.error(error));
  }

  private launchNewPublisher() {
    this.destroyPublisher();
    this.initPublisher();
  }

  private destroyPublisher() {
    (<Publisher>this.user.getStreamManager()).off('streamAudioVolumeChange');
    this.user.getStreamManager().stream.disposeWebRtcPeer();
    this.user.getStreamManager().stream.disposeMediaStream();
  }

  private getById() {
    this.userService
      .getById(this.currentUser.token, this.user_p)
      .pipe(first())
      .subscribe(pacientes => {
        console.log('Pacientes', pacientes);
        this.pacientes = pacientes;
        });
  }
}
