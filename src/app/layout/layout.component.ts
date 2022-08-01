import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  @ViewChild('inputElement') inputElement: ElementRef; 
  current_rotation = 180;
  defaultWidth = 100;
  myDecimal = 0.00;
  
  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  rotateLeft() {
    console.log(this.inputElement?.nativeElement.transform);
    this.current_rotation += 90;
   this.renderer.setStyle(
      this.inputElement?.nativeElement,
      'transform',
      `rotate(${this.current_rotation}deg)`
    )
  }

  rotateRight() {
    
  }

  zoomIn() {
    if (this.defaultWidth < 200) {
    this.defaultWidth = this.defaultWidth + 5;
    this.renderer.setStyle(
      this.inputElement?.nativeElement,
      'width',
      `${this.defaultWidth}%`
    )
    }
  }

  zoomOut() {
    if (this.defaultWidth > 100) {
    this.defaultWidth = this.defaultWidth - 5;
    this.renderer.setStyle(
      this.inputElement?.nativeElement,
      'width',
      `${this.defaultWidth}%`
    )
    }
  }

}
