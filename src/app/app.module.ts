import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import {LowerCasePipe} from './pipes/lowercase';
import {StudentFilterPipe} from './pipes/filterPipe';

import {CheckinService} from './services/checkin.service';
import {StudentsService} from './services/students.service';
import {ClassesService} from './services/classes.service';

import { AppComponent } from './app.component';
import { SharedComponent } from './shared/shared.component';
import { StudentDashboardComponent } from './student-dashboard/student-dashboard.component';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AddItemsComponent } from './admin-dashboard/add-items/add-items.component';
import { DataVisualizationComponent } from './admin-dashboard/data-visualization/data-visualization.component';

import { ChartsModule } from 'ng2-charts';

const ROUTES = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },
  {
    path: 'admin-panel',
    component: AdminDashboardComponent
  }
];

@NgModule({
  declarations: [
    AppComponent,
    SharedComponent,
    StudentFilterPipe,
    LowerCasePipe,
    StudentDashboardComponent,
    AdminDashboardComponent,
    AddItemsComponent,
    DataVisualizationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    BrowserAnimationsModule,
    ChartsModule,
    RouterModule.forRoot(ROUTES)
  ],
  providers: [
    CheckinService,
    StudentsService,
    ClassesService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
