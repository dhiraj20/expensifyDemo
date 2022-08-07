import { Component, OnInit } from '@angular/core';
import { getDocs } from 'firebase/firestore';
import { AppService } from '../app.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  billsArrayList: any = [];
  constructor(private appService: AppService) {}

  ngOnInit(): void {
    this.getBillsList();
  }

  async getBillsList() {
    const q = this.appService.getItems();
    const querySnapshot = await getDocs(q);
    const dataArray = querySnapshot.forEach(doc => {
      this.billsArrayList.push({ id: doc.id, ...doc.data() });
    });
    console.log(this.billsArrayList);
  }
}
