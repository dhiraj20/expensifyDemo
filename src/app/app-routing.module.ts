import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBillsComponent } from './add-bills/add-bills.component';
import { AdminComponent } from './admin/admin.component';
import { LayoutComponent } from './layout/layout.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: 'home', component: LayoutComponent },
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: 'add', component: AddBillsComponent },
      { path: 'list', component: ListComponent },
      { path: '', redirectTo: 'add', pathMatch: 'full' },
    ],
  },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
