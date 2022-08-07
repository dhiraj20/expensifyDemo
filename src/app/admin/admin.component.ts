import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AppService } from '../app.service';
import { CURRENCY_LIST } from '../currency';
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
} from 'firebase/storage';
import { getDocs } from 'firebase/firestore';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef;
  defaultWidth = 100;
  current_rotation = 180;
  month = '';
  date = '';
  year = '';
  currencyList = CURRENCY_LIST;
  fileName: any;
  payload = {
    type: 'amount',
    amount: '',
    currency: this.currencyList[0].cc,
    date: '',
    url: '',
    fileType: '',
    amountUnclear: false,
    dateUnclear: false,
  };
  fileDetail: any = {
    type: '',
    url: '',
  };
  imageFormats = ['jpg', 'jpeg', 'png', 'gif'];
  uploadedFileName = '';
  billsArray: any = [];

  constructor(private appService: AppService, private renderer: Renderer2) {}

  ngOnInit(): void {
    this.getItems();
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  async getItems() {
    const q = this.appService.getItems();
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.forEach(doc => {
      this.billsArray.push(doc.data());
    });
  }

  onChangeType(event: any) {
    this.payload.type = event.target.value;
  }

  onChangeCurrency(event: any) {
    this.payload.currency = event.target.value;
  }

  rotateLeft() {
    console.log(this.inputElement?.nativeElement.transform);
    this.current_rotation += 90;
    this.renderer.setStyle(
      this.inputElement?.nativeElement,
      'transform',
      `rotate(${this.current_rotation}deg)`
    );
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    this.appService
      .uploadFile(file)
      .then(snapshot => {
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
        console.log('File metadata:', snapshot.metadata);
        this.uploadedFileName = snapshot.metadata.fullPath;
        let type: any = snapshot.metadata?.contentType?.split('/')[1];
        this.fileDetail.type =
          this.imageFormats.indexOf(type) >= 0 ? 'image' : 'pdf';
        this.payload.fileType = this.fileDetail.type;
        getDownloadURL(snapshot.ref).then(url => {
          console.log('File available at', url);
          this.fileDetail.url = url;
          this.payload.url = url;
        });
        console.log(this.payload);
      })
      .catch(error => {
        console.error('Upload failed', error);
      });
  }

  zoomIn() {
    if (this.defaultWidth < 200) {
      this.defaultWidth = this.defaultWidth + 5;
      this.renderer.setStyle(
        this.inputElement?.nativeElement,
        'width',
        `${this.defaultWidth}%`
      );
    }
  }

  zoomOut() {
    if (this.defaultWidth > 100) {
      this.defaultWidth = this.defaultWidth - 5;
      this.renderer.setStyle(
        this.inputElement?.nativeElement,
        'width',
        `${this.defaultWidth}%`
      );
    }
  }

  async submitForm() {
    if (this.payload.type === 'date') {
      this.payload.date = this.month + '/' + this.date + '/' + this.year;
    } else {
      this.payload.date = '';
    }
    try {
      const docRef = await this.appService.saveData(this.payload);
      console.log('Document written with ID: ', docRef.id);
    } catch (error) {
      console.log('An error occured.', error);
      const storage = getStorage();
      const desertRef = ref(storage, this.uploadedFileName);
      deleteObject(desertRef)
        .then(() => {
          console.log('File deleted successfully');
        })
        .catch(error => {
          console.log('Uh-oh, an error occurred!', error);
        });
    }
  }
}
