import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Message } from '../models/message';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private messageSource = new BehaviorSubject<Message[]>([]);
  currentMessage = this.messageSource.asObservable();

  constructor() { }
  changeMessages(messages: Message[]) {
    this.messageSource.next(messages)
  }
}
