import {Component, OnInit, OnChanges, ViewChild} from '@angular/core';
import {StudentsService} from '../../services/students.service';
import {ClassesService} from '../../services/classes.service';
import {Student} from '../../models/student.model';
import {KarateClass} from '../../models/karateClass.model';
import SharedConstants from '../../shared/shared.constants';
import { BaseChartDirective } from 'ng2-charts';

import * as $ from 'jquery';
import * as _ from 'lodash';
import * as moment from 'moment';
import {CheckinService} from '../../services/checkin.service';

@Component({
  selector: 'app-data-visualization',
  templateUrl: './data-visualization.component.html',
  styleUrls: ['./data-visualization.component.scss']
})

export class DataVisualizationComponent implements OnInit {
  @ViewChild('studentNameInput') studentNameInput;
  @ViewChild(BaseChartDirective) chart: BaseChartDirective;

  d = new Date();
  filterString = '';
  toggleVal = 'students';
  currTarget: any;
  bardata: any[];
  loaded = false;
  modalData = null;
  modalIsActive = false;
  modalMonth = '';

  months = SharedConstants.DROPDOWN_MONTHS;
  years = SharedConstants.DROPDOWN_YEARS;
  startDateString: string;
  endDateString: string;
  classesData: any[];

  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  xAxisLabel = 'Month(s)';
  showYAxisLabel = true;
  yAxisLabel = 'Classes Attended';

  // INIT SELECTED VALUES
  selectedStartMonth: number;
  selectedStartYear: number;
  selectedEndMonth: number;
  selectedEndYear: number;
  startDay: number;
  endDay: number;

  students: Student[];
  karateClasses: KarateClass[];

  constructor(
    private studentsService: StudentsService,
    private classesService: ClassesService,
    private  checkinService: CheckinService) { }

  ngOnInit() {
    // SET CURRENT DATE FOR DROPDOWNS
    this.setCurrentDate();
    this.onInputChanged();

    // FETCH USERS AND CLASS LIST
    this.studentsService.getStudents()
      .subscribe(
        (response) => {
          this.students = response;
          this.currTarget = this.students[0];
          this.onSubmitChartsQuery();
        }
      );

    this.classesService.getClasses()
      .subscribe(
        (response) => {
          this.karateClasses = response;
        }
      );
  }




  // CLASS METHODS

  // CHART DATA POPULATION VIA USER INPUT

  onSubmitChartsQuery() {
    this.loaded = false;

    const qobj = this.constructQueryObject(this.currTarget, 'student');

    this.checkinService.getSignIns(qobj)
      .subscribe(
        (response) => {
          this.classesData = response;

          const monthsInSpan = this.populateChartWithLabels();
          const sortedArray = this.groupClassesByDateAndSort(this.classesData);

          this.mapArrayToChartValues(sortedArray, monthsInSpan);
        }
      );
  }

  onInputChanged() {
    const endDayFormated = (this.selectedEndMonth).toString();
    this.endDay = moment(endDayFormated).daysInMonth();

    this.startDateString = (this.selectedStartMonth + '-' + this.startDay + '-' +  this.selectedStartYear );
    this.endDateString = (this.selectedEndMonth + '-' + this.endDay + '-' +  this.selectedEndYear );
  }

  onSelectStudent(student) {

    if (this.currTarget !== student) {
      this.currTarget = student;
    }
  }

  onSelectClass(karateClass) {

    if (this.currTarget !== karateClass.uid) {
      this.currTarget = karateClass.uid;
    }

    this.checkinService.getSignIns(
      this.constructQueryObject(karateClass, 'class')
    )
      .subscribe(
        (response) => {
        }
      );
  }



  // CREATE QUERY OBJ SENT TO MONGO

  constructQueryObject(target, type) {
    const startDateObj = new Date(this.startDateString);
    const endDateObj = new Date(this.endDateString);

    const qobj = {
      userId: null,
      classId: null,
      dateLogged: null
    };

    if (type === 'student') {
      qobj.userId = target.uid;
    }

    if (type === 'class') {
      qobj.classId = target.uid;
    }

    qobj.dateLogged = {
      $gte: startDateObj.toISOString(),
      $lte: endDateObj.toISOString()
    };

    return qobj;
  }



  // UTIL AND DATA TRANSFORMATION METHODS


  // UTIL
  setCurrentDate() {
    const currMonth: number = this.d.getMonth();
    const currYear: number = this.d.getFullYear();

    this.selectedStartMonth = currMonth;
    this.selectedStartYear = currYear;
    this.selectedEndMonth = currMonth == 11 ? 0 : currMonth + 1;
    this.selectedEndYear = this.selectedEndMonth == 0 ? this.selectedStartYear + 1 : this.selectedStartYear;
    this.startDay = 1;
    this.endDay = moment((this.selectedEndMonth.toString())).daysInMonth();
  }

  studentFilterInputChanged() {
    this.filterString = this.studentNameInput.nativeElement.value.toLowerCase();
  }

  setToggleTo(val) {
    this.toggleVal = val;
  }


  // DATA TRANSFORMATION

  populateChartWithLabels() {
    let sd = moment(this.startDateString, 'MM-DD-YYYY');
    const ed = moment(this.endDateString, 'MM-DD-YYYY');

    const monthsInSpan = [];

    while ( sd < ed) {
      const fullName = sd.format('MMMM');
      const numbered = sd.format('MM');

      monthsInSpan.push({ fullName, numbered, count: 0 });
      sd = sd.add(1, 'month');
    }

    return monthsInSpan;
  }

  groupClassesByDateAndSort(classes) {
    let groupedByMonth;
    let groupedByYear;
    const formattedArray = [];

    groupedByYear = _.groupBy(classes, function(item: any) {
      return item.dateLogged.substring(0, 4);
    });

    _.each(groupedByYear, (group) => {
      groupedByMonth = _.groupBy(group, function(item: any) {
        return item.dateLogged.substring(0, 7);
      });

      _.forIn(groupedByMonth, month => {
        formattedArray.push(month);
      });
    });

    const sortedArray = formattedArray.sort((n1, n2) => {
      if (n1[0].dateLogged > n2[0].dateLogged) {
        return 1;
      }

      if (n1[0].dateLogged < n2[0].dateLogged) {
        return -1;
      }

      return 0;
    });

    return sortedArray;
  }

  mapArrayToChartValues(sortedArray, monthsInSpan) {
    let counterInt = 0;

    _.each(monthsInSpan, monthItem => {
      if (!sortedArray[counterInt]) {
        return false
      }

      const firstItemMonthCreated = sortedArray[counterInt][0].dateLogged.slice(5, 7);
      const arrLength = sortedArray[counterInt].length;
      const signInDetails = sortedArray[counterInt];

      if (monthItem.numbered == firstItemMonthCreated) {
        monthItem.count = arrLength;
        monthItem.details = signInDetails;
        counterInt++;
      }
    });

    const mappedData = monthsInSpan.map(({fullName, count, details}) => {
      return { details, name: fullName, value: count };
    });

    console.log(mappedData);

    this.bardata = mappedData.slice();
    this.loaded = true;
  }

  split (obj, opts?) {
    opts = opts || {};
    const keyName = opts.key || 'key'
    const valueName = opts.value || 'value'
    const items = [];
    for (const key in obj) {
      if (!Object.prototype.hasOwnProperty.call(obj, key)) { continue }
      const kv = {};
      kv[keyName] = key;
      kv[valueName] = obj[key];
      items.push(kv)
    }
    return items
  }

  resetAll() {
    this.currTarget = {};
    this.bardata = [];
  }

  onSelect(event) {
    console.log(event);
    this.modalMonth = event.name;
  }

  toggleModal() {
    this.modalIsActive = !this.modalIsActive;
  }

  onSelectClick(event) {
    const currTargetIndex = $(event.target.parentElement).index();

    const modalObj = this.bardata[currTargetIndex].details.reduce((collection, item) => {
      console.log(item);
      if (collection[item.name]) {
        collection[item.name]++
      } else {
        collection[item.name] = 1;
      }

      return collection
    }, {});

    this.modalData = this.split(modalObj);

    this.toggleModal();

    console.log(this.modalData);
  }
}
