import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import {
  addDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  startAt,
} from 'firebase/firestore';

import { getDatabase } from 'firebase/database';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  item$: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  getItems() {
    const c = collection(this.firestore, 'bills');
    const q = query(c, orderBy('createdAt'));
    return q;
  }

  uploadFile(file: File) {
    const metadata = {
      contentType: file.type,
    };
    const storage = getStorage();
    const imageRef = ref(storage, 'images/' + Date.now() + file.name);
    return uploadBytesResumable(imageRef, file, metadata);
  }

  saveData(data: any) {
    let payload: any = {};
    payload.url = data.url;
    payload.fileType = data.fileType;
    payload.createdAt = new Date().toUTCString();
    if (data.type === 'date') {
      payload.date = !data.dateUnclear ? data.date : '';
      payload.type = data.type;
      payload.dateUnclear = data.dateUnclear;
    } else if (data.type === 'amount') {
      payload.amount = !data.amountUnclear ? data.amount : '';
      payload.currency = !data.amountUnclear ? data.currency : '';
      payload.type = data.type;
      payload.amountUnclear = data.amountUnclear;
    }
    return addDoc(collection(this.firestore, 'bills'), payload);
  }
}
