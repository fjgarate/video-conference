import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireMessaging } from '@angular/fire/messaging';
import { mergeMapTo, map, tap } from 'rxjs/operators';
import { take } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs'
import { ToastrService } from 'ngx-toastr';
@Injectable({
  providedIn: 'root'
})
export class MessagingService {

  currentMessage = new BehaviorSubject(null);
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  constructor(
    private angularFireDB: AngularFireDatabase,
    private angularFireAuth: AngularFireAuth,
    private angularFireMessaging: AngularFireMessaging,
    private toastr: ToastrService) {
    this.angularFireMessaging.messaging.subscribe(
      (_messaging) => {
        _messaging.onMessage = _messaging.onMessage.bind(_messaging);
        _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
      }
    )
    this.itemsRef = this.angularFireDB.list('fcmTokens');
    // Use snapshotChanges().map() to store the key
    this.items = this.itemsRef.snapshotChanges().pipe(
      map(changes =>
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
/**
* update token in firebase database
*
* @param userId userId as a key
* @param token token as a value
*/
  updateToken(userId, token) {
    // we can change this function to request our backend service
    this.angularFireAuth.authState.pipe(take(1)).subscribe(
      () => {
        const data = {};
        data[userId] = token
        this.angularFireDB.object('fcmTokens/').update(data)
      })
  }
  /**
     * request permission for notification from firebase cloud messaging
     * 
     * @param userId userId
     */
  requestPermission(userId) {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        console.log(token);
        this.updateToken(userId, token);
      },
      (err) => {
        console.error('Unable to get permission to notify.', err);
      }
    );
  }
  /**
    * hook method when new notification received in foreground
    */
  receiveMessage() {
    this.angularFireMessaging.messages.subscribe(
      (payload) => {
        console.log("new message received. ", payload);
        this.currentMessage.next(payload);
        this.toastr.success('llamada entrante!', 'Toastr fun!');
      })
  }
  sendMessage(userId){
    console.log('sendMessage '+userId)
    let item = this.angularFireDB.object('fcmTokens/' + userId).valueChanges();
    console.log(item)
    let item2 = this.angularFireDB.object('fcmTokens/' + userId);
    console.log(item2)


    let user$ = this.angularFireDB.object('fcmTokens/'+userId).snapshotChanges().pipe(
      map(snap => snap.payload.val()),
      tap(v => console.log('User: ', v))

    ); 
    console.log(this.items)

   

  }
  
}
