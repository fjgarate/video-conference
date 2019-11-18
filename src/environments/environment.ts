// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  openvidu_url: 'https://video.emerge-mhealth.com:4443',
  openvidu_secret: 'gbttel',
  api_url: 'https://login-videocall.herokuapp.com',
  firebase: {
    apiKey: "AIzaSyDCNdhyeZiwyc2ItfsBCK3ujhSc3MIWpRk",
    authDomain: "video-emerge-project.firebaseapp.com",
    databaseURL: "https://video-emerge-project.firebaseio.com",
    projectId: "video-emerge-project",
    storageBucket: "video-emerge-project.appspot.com",
    messagingSenderId: "999706296132",
    appId: "1:999706296132:web:6646d64ca21f14afd72111",
    measurementId: "G-PML6J5BF95"
  }
  
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
