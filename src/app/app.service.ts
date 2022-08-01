import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  item$: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  getItems() {
    const c = collection(this.firestore, 'items');
    this.item$ = collectionData(c);
    return this.item$;
  }

  uploadFile(file: File) {
    const metadata = {
      contentType: file.type,
    };
    const storage = getStorage();
    const imageRef = ref(storage, 'images/' + Date.now() + file.name);
    return uploadBytesResumable(imageRef, file, metadata);
  }
}
