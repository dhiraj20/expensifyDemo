import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  Renderer2,
} from '@angular/core';
import { interval, Observable, Observer } from 'rxjs';
import { getDocs } from 'firebase/firestore';
import { AppService } from '../app.service';
import { CURRENCY_LIST } from '../currency';
import { NgForm } from '@angular/forms';

const PROGRESS_COUNT = 25;
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit {
  @ViewChild('inputElement') inputElement: ElementRef;
  @ViewChild('aForm') aForm: ElementRef;
  current_rotation = 180;
  defaultZoomValue = 1;
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
  invalidData = false;

  constructor(private renderer: Renderer2, private appService: AppService) {}

  ngOnInit(): void {
    this.getItems();
    this.showTimer();
  }

  setFocus(name: any) {
    const ele = this.aForm.nativeElement[name];
    if (ele) {
      ele.focus();
    }
  }

  async getItems() {
    const q = this.appService.getItems();
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.forEach(doc => {
      this.billsArrayList.push({ id: doc.id, ...doc.data() });
    });
    this.currentObject = this.billsArrayList[this.currentIndex];
    console.log(this.currentObject);
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
    if (this.defaultZoomValue < 2.5) {
      this.defaultZoomValue = this.defaultZoomValue + 0.5;
      this.renderer.setStyle(
        this.inputElement?.nativeElement,
        'transform',
        `scale(${this.defaultZoomValue})`
      );
    }
  }

  zoomOut() {
    if (this.defaultZoomValue > 1) {
      this.defaultZoomValue = this.defaultZoomValue - 0.5;
      this.renderer.setStyle(
        this.inputElement?.nativeElement,
        'transform',
        `scale(${this.defaultZoomValue})`
      );
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
    this.progressValue = PROGRESS_COUNT * this.taskIndex;
    this.amount = '';
    this.currency = '';
    this.month = '';
    this.year = '';
    this.date = '';
    if (this.billsArrayList.length - 1 === this.currentIndex) {
      this.currentIndex = 0;
    }
    this.currentObject = this.billsArrayList[++this.currentIndex];
    this.setFocus('amount');
    console.log(this.currentObject);
  }

  validateData() {
    this.invalidData = false;
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
      } else {
        this.invalidData = true;
      }
    } else if (this.currentObject.type === 'date') {
      const date = this.month + '/' + this.date + '/' + this.year;
      if (this.currentObject.date === date) {
        this.nextTask();
      } else {
        this.invalidData = true;
      }
    }
  }
}
