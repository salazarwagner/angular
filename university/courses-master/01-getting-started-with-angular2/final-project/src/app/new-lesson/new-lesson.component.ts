import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {LessonsService} from "../shared/model/lessons.service";

@Component({
  selector: 'app-new-lesson',
  templateUrl: './new-lesson.component.html',
  styleUrls: ['./new-lesson.component.css']
})
export class NewLessonComponent implements OnInit {

  courseId:string;

  constructor(private lessonsService: LessonsService,  route: ActivatedRoute) {

    this.courseId = route.snapshot.queryParams['courseId'];

  }

  ngOnInit() {

  }

  save(form) {
    this.lessonsService.createNewLesson(this.courseId, form.value)
      .subscribe(
        () => {
          alert("lesson created succesfully. Create another lesson ?");
          form.reset();
        },
        err => alert(`error creating lesson ${err}`)
      );

  }

}
