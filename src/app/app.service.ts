import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, limit, query } from 'firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  item$: Observable<any[]>;

  constructor(private firestore: Firestore) {}

  getItems() {
    const c = collection(this.firestore, 'bills');
    const q = query(c, limit(2));
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
    if (data.type === 'date') {
      payload.date = data.date;
      payload.type = data.type;
    } else if (data.type === 'amount') {
      payload.amount = data.amount;
      payload.currency = data.currency;
      payload.type = data.type;
    }
    return addDoc(collection(this.firestore, 'bills'), payload);
  }
}



// import {
//   collection,
//   query,
//   orderBy,
//   startAfter,
//   limit,
//   getDocs,
// } from 'firebase/firestore';

// // Query the first page of docs
// const first = query(collection(db, 'cities'), orderBy('population'), limit(25));
// const documentSnapshots = await getDocs(first);

// // Get the last visible document
// const lastVisible = documentSnapshots.docs[documentSnapshots.docs.length - 1];
// console.log('last', lastVisible);

// // Construct a new query starting at this document,
// // get the next 25 cities.
// const next = query(
//   collection(db, 'cities'),
//   orderBy('population'),
//   startAfter(lastVisible),
//   limit(25)
// );
