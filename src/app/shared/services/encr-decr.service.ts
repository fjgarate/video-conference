import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from "../../../environments/environment";
@Injectable({
  providedIn: 'root'
})
export class EncrDecrService {
 
  constructor() {
  
   }

  //The set method is use for encrypt the value.
  set(value) {
    let key = environment.key;
    let iv = environment.iv;
    console.log(value)
    if(value==null) return null;
    let encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(value.toString()), key,
      {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });

    return encrypted.toString();
  }
  //The get method is use for decrypt the value.
  get(value) {
    let key = environment.key;
    let iv = environment.iv;
    console.log(value)
    if (value == null) return null;
    let decrypted = CryptoJS.AES.decrypt(value,key, {
      keySize: 128 / 8,
      iv:iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    return decrypted.toString(CryptoJS.enc.Utf8);
  }

}
