import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import {TimesheetComponent} from "./timesheet/timesheet.component";

export const routes: Routes = [
  // { path: 'login', component: LoginComponent },
  // { path: '', redirectTo: '/login', pathMatch: 'full' },
  // { path: 'home', component: HomeComponent },
  { path: 'timesheet', component: TimesheetComponent },
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: []
  })

  export class AppRoutingModule{

  }
