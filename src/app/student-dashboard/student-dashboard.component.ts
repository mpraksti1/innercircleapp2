import {Component, OnInit, ViewChild} from '@angular/core';

import {StudentsService} from '../services/students.service';
import {ClassesService} from '../services/classes.service';

import {Student} from '../models/student.model';
import {KarateClass} from '../models/karateClass.model';
import {CheckinService} from '../services/checkin.service';
import {
    trigger,
    state,
    style,
    transition,
    animate,
    keyframes
} from '@angular/animations';

const SUCCESS_MESSAGE_TIMER = 2000;

@Component({
  selector: 'app-student-dashboard',
  templateUrl: './student-dashboard.component.html',
  styleUrls: ['./student-dashboard.components.scss'],
  animations: [
    trigger('flyInOut', [
      state('in', style({
        position: 'relative',
        left: '50%',
        opacity: 1
      })),
      transition('void => *', [
        animate(1000, keyframes([
          style({
            left: '45%',
            opacity: 0,
          }),
          style({
            left: '45%',
            opacity: 0,
          }),
          style({
            left: '45%',
            opacity: 0,
          }),
          style({
            left: '50%',
            opacity: 1,
          })
        ]))
      ]),
      transition('* => void', [
        animate(1000, keyframes([
          style({
            left: '50%',
            opacity: 1,
          }),
          style({
            left: '60%',
            opacity: 0,
          }),
          style({
            left: '60%',
            opacity: 0,
          }),
          style({
            left: '60%',
            opacity: 0,
          })
        ]))
      ]),
    ])
  ]
})

export class StudentDashboardComponent implements OnInit {
  @ViewChild('studentNameInput') studentNameInput;

  currAppState = 0;
  students: any[];
  karateClasses: any[];

  filterString = '';
  classSelected: KarateClass = null;
  studentSelected: Student = null;
  checkInSuccess = false;

  appState = [
    true,
    false,
    false
  ];

  setAppState(val) {
    this.appState = [
      false,
      false,
      false
    ];

    this.currAppState = val;
    this.appState[val] = true;
  };

  goBack() {
    const backOne = this.currAppState - 1;
    this.setAppState(backOne);
  }

  constructor(
    private studentsService: StudentsService,
    private classesService: ClassesService,
    private checkinService: CheckinService) { }

  ngOnInit() {
    // this.studentsService.getStudents()
    //   .subscribe(
    //     (response) => {
    //       this.students = response;
    //     }
    //   );
    // this.classesService.getClasses()
    //   .subscribe(
    //     (response) => {
    //       this.karateClasses = response;
    //     }
    //   );
    this.students = [{"_id":"596bdd206240c0426528270b","name":"angela bender","email":"m_e_praksti@yahoo.com","__v":0},{"_id":"596bdd2f6240c0426528270c","name":"mike praksti","email":"m_e_praksti@gmail.com","__v":0}];
    this.karateClasses = [{"_id":"59606612dffcf3101ba99663","name":"Krav maga","description":"A class","__v":0},{"_id":"596072bde1a43710f8559ca1","name":"kempo","description":"fun","__v":0},{"_id":"596072c2e1a43710f8559ca2","name":"jujitsu","description":"fun","__v":0},{"_id":"596072cbe1a43710f8559ca3","name":"JKD","description":"fun","__v":0}];
  }

  studentFilterInputChanged() {
    this.filterString = this.studentNameInput.nativeElement.value.toLowerCase();
  }

  clearDataSet() {
    this.classSelected = null;
    this.studentSelected = null;
  }

  onSelectClass(kclass: KarateClass) {
    console.log(kclass);
    this.classSelected = kclass;
  }

  onSelectStudent(student: Student) {
    console.log(student);
    this.studentSelected = student;
  }

  onConfirmSignIn() {

    const signin = {
      'userId': this.studentSelected.uid,
      'classId': this.classSelected.uid
    };


    this.checkinService.createSignin(signin)
      .subscribe(
        (response) => {
          this.checkInSuccess = true;
          setTimeout(() => {
            this.checkInSuccess = false;

            this.appState = [
              true,
              false,
              false
            ];

          }, SUCCESS_MESSAGE_TIMER);
        }
      );
  }
}
