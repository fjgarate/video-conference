import { BrowserModule } from '@angular/platform-browser';
import { NgModule, Injector, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatDialogModule,
  MatTooltipModule,
  MatBadgeModule,
  MatGridListModule,
  MatCheckboxModule,
  MatSelectModule,
  MatOptionModule,
  MatProgressSpinnerModule,
  MatSliderModule,
  MatPaginatorModule,
  MatTableModule,
  MatSortModule,
  MatPaginatorIntl
} from '@angular/material';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular'; // for FullCalendar!
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { VideoRoomComponent } from './video-room/video-room.component';
import { OpenViduService } from './shared/services/open-vidu.service';
import { StreamComponent } from './shared/components/stream/stream.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ChatComponent } from './shared/components/chat/chat.component';
import { DialogExtensionComponent } from './shared/components/dialog-extension/dialog-extension.component';
import { OpenViduVideoComponent } from './shared/components/stream/ov-video.component';
import { createCustomElement } from '@angular/elements';
import { DialogErrorComponent } from './shared/components/dialog-error/dialog-error.component';
import { WebComponentComponent } from './web-component/web-component.component';
import { ElementZoneStrategyFactory } from 'elements-zone-strategy';
import { ToolbarComponent } from './shared/components/toolbar/toolbar.component';
import { DialogChooseRoomComponent } from './shared/components/dialog-choose-room/dialog-choose-room.component';
import { ApiService } from './shared/services/api.service';
import { LinkifyPipe } from './shared/pipes/linkfy';
import { NgxLinkifyjsModule } from 'ngx-linkifyjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { JwtInterceptor, ErrorInterceptor } from './shared/helpers';
import { LoginComponent} from './login';
import { RegisterComponent } from './register';
import { AlertComponent } from './shared/components/alert';
import { DoctorComponent } from './doctor/doctor.component';
import { PatientComponent } from './patient/patient.component';
import { VideoconfComponent } from './videoconf/videoconf.component';
import { ConversationComponent } from './conversation/conversation.component';
import { IsPresentPipe } from './is-present.pipe';
import { IsReadPipe } from './is-read.pipe';
import { IsDocPipe } from './is-doc.pipe';
import { MessagesComponent } from './messages/messages.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { HeaderComponent } from './shared/components/header/header.component';



@NgModule({
  declarations: [
    AppComponent,
    VideoRoomComponent,
    StreamComponent,
    ChatComponent,
    DialogExtensionComponent,
    OpenViduVideoComponent,
    DialogErrorComponent,
    DialogChooseRoomComponent,
    WebComponentComponent,
    ToolbarComponent,
    LinkifyPipe,
    AlertComponent,
    LoginComponent,
    RegisterComponent,
    DoctorComponent,
    PatientComponent,
    VideoconfComponent,
    ConversationComponent,
    IsPresentPipe,
    IsReadPipe,
    IsDocPipe,
    MessagesComponent,
    AppointmentComponent,
    HeaderComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule,
    MatTooltipModule,
    MatBadgeModule,
    MatGridListModule,
    MatCheckboxModule,
    MatSelectModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule, 
    AppRoutingModule,
    HttpClientModule,
    FlexLayoutModule,
    ScrollingModule,
    FullCalendarModule, // for FullCalendar!

    NgxLinkifyjsModule.forRoot(),
  ],
  entryComponents: [DialogErrorComponent, WebComponentComponent],
  providers: [
    OpenViduService,
    ApiService,
    MatPaginatorIntl


  ],
  bootstrap: [AppComponent],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
  ]
})
export class AppModule {
  constructor(private injector: Injector) {
    const strategyFactory = new ElementZoneStrategyFactory(
      WebComponentComponent,
      this.injector
    );
    const element = createCustomElement(WebComponentComponent, {
      injector: this.injector,
      strategyFactory
    });
    customElements.define('openvidu-webcomponent', element);
  }

  ngDoBootstrap() {}
}
