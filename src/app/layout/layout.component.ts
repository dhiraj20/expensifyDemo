import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { interval, Observable, Observer } from 'rxjs';
import { getDocs } from 'firebase/firestore';
import { AppService } from '../app.service';
import { CURRENCY_LIST } from '../currency';

const PROGRESS_COUNT = 25;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef;
  current_rotation = 180;
  defaultWidth = 100;
  myDecimal = 0.0;
  billsArrayList: any = [];
  currentObject: any = null;
  currencyList = CURRENCY_LIST;
  currency = '';
  month = '';
  date = '';
  year = '';
  amount = '';
  currentIndex = 0;
  page = 0;
  currentArray: any = [];
  progressValue = 25;
  minutes = 0;
  seconds = 0;

  taskGroup = 4;
  taskIndex = 1;

  formError = {
    amount: false,
    currency: false,
    month: false,
    day: false,
    year: false,
  };
  time: Observable<string> | null = null;

  constructor(private renderer: Renderer2, private appService: AppService) {}

  ngOnInit(): void {
    this.getItems();
    this.showTimer();
  }

  async getItems() {
    const q = this.appService.getItems();
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.forEach(doc => {
      this.billsArrayList.push({ id: doc.id, ...doc.data() });
    });
    console.log(this.billsArrayList);
    this.currentObject = this.billsArrayList[this.currentIndex];
    // this.currentArray = this.billsArrayList.slice(this.page * 4, 4);
    // console.log(this.currentArray);
    const x = this.billsArrayList.slice(0, 1);
    console.log(x);
  }

  onChangeCurrency(event: any) {
    this.currency = event.target.value;
  }

  keyPress(event: KeyboardEvent) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  rotateLeft() {
    this.current_rotation += 90;
    this.renderer.setStyle(
      this.inputElement?.nativeElement,
      'transform',
      `rotate(${this.current_rotation}deg)`
    );
  }

  rotateRight() {}

  zoomIn() {
    if (this.defaultWidth < 200) {
      this.defaultWidth = this.defaultWidth + 5;
      this.renderer.setStyle(this.inputElement?.nativeElement, 'width', `${this.defaultWidth}%`);
    }
  }

  zoomOut() {
    if (this.defaultWidth > 100) {
      this.defaultWidth = this.defaultWidth - 5;
      this.renderer.setStyle(this.inputElement?.nativeElement, 'width', `${this.defaultWidth}%`);
    }
  }

  showTimer() {
    this.time = new Observable<string>((observer: Observer<string>) => {
      var fiveMinutes = 60 * 5;
      let timer = fiveMinutes,
        minutes,
        seconds;
      setInterval(function () {
        minutes = parseInt((timer / 60).toString(), 10);
        seconds = parseInt((timer % 60).toString(), 10);

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        if (--timer < 0) {
          timer = fiveMinutes;
        }
        return observer.next(`${minutes.toString()}:${seconds.toString()}`);
      }, 1000);
    });
  }

  nextTask() {
    this.taskIndex++;
    this.currentObject = this.billsArrayList[this.currentIndex++];
    this.progressValue = PROGRESS_COUNT * this.taskIndex;
    this.currentObject = this.billsArrayList[++this.currentIndex];
  }

  validateData() {
    if (this.taskIndex === this.taskGroup) {
      this.taskIndex = 1;
      this.progressValue = 25;
      this.showTimer();
    }
    if (this.currentObject.type === 'amount') {
      this.formError.amount = this.amount === '' ? true : false;
      this.formError.currency = this.currency === '' ? true : false;
      if (
        this.currentObject.amount === this.amount &&
        this.currentObject.currency === this.currency
      ) {
        this.nextTask();
      }
    } else if (this.currentObject.type === 'date') {
      const date = this.month + '/' + this.date + '/' + this.year;
      if (this.currentObject.date === date) {
        this.nextTask();
      }
    }
  }
}
