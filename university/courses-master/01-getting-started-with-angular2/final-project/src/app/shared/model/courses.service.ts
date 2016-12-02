import {Injectable} from '@angular/core';
import {AngularFire} from "angularfire2";
import {Observable} from "rxjs/Rx";
import {LessonsService} from "./lessons.service";
import {FirebasePage} from "../firebase/firebase-page";
import {Course} from "./course";
import {Lesson} from "./lesson";
const _ = require('lodash');





@Injectable()
export class CoursesService {

  courses$:Observable<Course[]>;

  constructor(private af:AngularFire, private lessonsService:LessonsService) {
    this.courses$ = af.database.list("courses")
      .map(Course.fromJsonArray);
  }


  findCourseById(courseId:string) : Observable<Course> {
    return this.courses$.flatMap(x => x).filter(course => course.$key === courseId);
  }



  findCourseByUrl(url:string) : Observable<Course> {
    return this.courses$.flatMap(x => x).filter(course => course.url === url);
  }



  loadFirstPage(courseKey:string, pageSize:number) : Observable<FirebasePage<Lesson>> {
    return this.loadPageStartingAt(courseKey, pageSize, null);
  }



  loadPageStartingAt(courseKey:string, pageSize:number, startAt:string): Observable<FirebasePage<Lesson>> {
    const queryParams:any = {
      query: {
        orderByKey: true,
        limitToFirst: pageSize
      }
    };

    if (startAt) {
      queryParams.query.startAt = startAt;
    }

    return this.loadPage(courseKey, queryParams);
  }




  loadNextPage(courseKey:string, pageSize:number, currentPage: FirebasePage<Lesson>) : Observable<FirebasePage<Lesson>> {

    const queryParams:any = {
      query: {
        orderByKey: true,
        limitToFirst: 2,
        startAt: currentPage.lastKey
      }
    };

    const nextPageStartKey$ =  this.af.database.list(`lessonsPerCourse/${courseKey}`, queryParams)
                                          .take(1)
                                          .map(lessonsRef => lessonsRef.length == 2 ? lessonsRef[1].$key : null );

    return nextPageStartKey$.switchMap(nextPageKey => this.loadPageStartingAt(courseKey, pageSize, nextPageKey) );
  }




  loadPreviousPage(courseKey:string, pageSize:number, currentPage: FirebasePage<Lesson>) : Observable<FirebasePage<Lesson>> {

    const queryParams:any = {
      query: {
        orderByKey: true,
        limitToLast: pageSize + 1,
        endAt: currentPage.firstKey
      }
    };

    const previousPageStartKey$ =  this.af.database.list(`lessonsPerCourse/${courseKey}`, queryParams)
                                      .take(1)
                                      .map(lessonsRef => lessonsRef.length > 0 ? lessonsRef[0].$key : null );


    return previousPageStartKey$.switchMap(pageKey => this.loadPageStartingAt(courseKey, pageSize, pageKey) );
  }



  loadPage(courseKey, queryParams = {}) :Observable<FirebasePage<Lesson>> {

    const lessonRefsPerCourse$ = this.af.database.list(`lessonsPerCourse/${courseKey}`, queryParams).take(1);

    const lessons$ = lessonRefsPerCourse$.map(lessonsRef => lessonsRef.map(ref => this.lessonsService.findLessonByKey(ref.$key)) )
      .switchMap( firebaseObjectObservables => Observable.combineLatest(firebaseObjectObservables) )
      .map(lessonsAsJson => lessonsAsJson.map(json => Lesson.fromJson(json)) );

    const firstLessonKey$ = lessonRefsPerCourse$.map(lessonsRef => _.first(lessonsRef).$key);

    const lastLessonKey$ = lessonRefsPerCourse$.map(lessonsRef => _.last(lessonsRef).$key);

    return Observable.combineLatest(lessons$, firstLessonKey$, lastLessonKey$).map((res:any[]) => new FirebasePage(<Lesson[]>res[0], res[1], res[2] ) );
  }




  loadAllCourseLessons(courseKey: string) : Observable<Lesson[]> {
    return this.loadPage(courseKey)
      .map(page => page.pagedData);
  }



}
