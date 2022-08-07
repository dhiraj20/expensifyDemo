import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxCurrencyModule } from "ngx-currency";

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutComponent } from './layout/layout.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { environment } from 'src/environments/environment';
import { SafePipe } from './safe.pipe';
import { ListComponent } from './list/list.component';
import { AddBillsComponent } from './add-bills/add-bills.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    AdminComponent,
    SafePipe,
    ListComponent,
    AddBillsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxCurrencyModule,
    FormsModule,
    ReactiveFormsModule,
     provideFirebaseApp(() => initializeApp(environment.firebaseConfig)),
    provideFirestore(() => getFirestore()),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
