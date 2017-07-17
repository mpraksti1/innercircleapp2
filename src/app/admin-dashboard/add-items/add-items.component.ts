import { Component, OnInit } from '@angular/core';
import { KarateClass } from '../../models/karateClass.model';
import { Student } from '../../models/student.model';
import { StudentsService } from '../../services/students.service';
import { ClassesService } from '../../services/classes.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-add-items',
  templateUrl: './add-items.component.html',
  styleUrls: ['./add-items.component.scss']
})
export class AddItemsComponent implements OnInit {

  constructor(private studentService: StudentsService,
              private  classesService: ClassesService) { }

  ngOnInit() {}

  onSubmitStudent(form: NgForm) {
    console.log(form.value);
    const student = new Student(
      form.value.name.toLowerCase(),
      form.value.email.toLowerCase()
    );

    this.studentService.createStudent(student)
      .subscribe(
        (response) => {
          console.log(response);
        }
      );
  }

  onSubmitClass(form: NgForm) {
    console.log(form.value);
    const kclass = new KarateClass(
      form.value.name.toLowerCase(),
      form.value.description.toLowerCase()
    );

    this.classesService.createClass(kclass)
      .subscribe(
        (response) => {
          console.log(response);
        }
      );
  }
}
