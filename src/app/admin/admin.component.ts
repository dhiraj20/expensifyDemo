import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { AppService } from '../app.service';
import { CURRENCY_LIST } from '../currency';
import { getDownloadURL } from 'firebase/storage';

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
  };
  fileDetail: any = {
    type: '',
    url: '',
  };
  imageFormats = ['jpg', 'jpeg', 'png', 'gif'];

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

  getItems() {
    this.appService.getItems().subscribe(res => {
      console.log(res);
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
        let type: any = snapshot.metadata?.contentType?.split('/')[1];
        this.fileDetail.type =
          this.imageFormats.indexOf(type) >= 0 ? 'image' : 'pdf';
        getDownloadURL(snapshot.ref).then(url => {
          console.log('File available at', url);
          this.fileDetail.url = url;
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

  submitForm() {
    console.log(this.payload);
  }
}
