import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import { collection, Firestore, getDocs, limit, query } from 'firebase/firestore';
import { AppService } from '../app.service';

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
  billsArray: any = [];
  currentObject: any = null;

  constructor(private renderer: Renderer2, private appService: AppService) {}

  ngOnInit(): void {
    this.getItems();
  }

  async getItems() {
    const q = this.appService.getItems();
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.forEach(doc => {
      this.billsArray.push(doc.data());
    });
    console.log(this.billsArray);
    this.currentObject = this.billsArray[1];
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
}
