import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api/in-memory-web-api.module';
import { InMemoryDataService }  from './in-memory-data.service';

import './rxjs-extensions';

import { AppComponent } from './app.component'
import { HeroesComponent } from './heroes.component';
import { HeroDetailComponent } from './hero-detail.component';
import { HeroSearchComponent } from './hero-search.component';
import { DashboardComponent } from './dashboard.component';


import { HeroService } from './hero.service';

@NgModule({
  imports:      [ 
    BrowserModule, 
    FormsModule, 
    HttpModule, 
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    RouterModule.forRoot([
      {
        path: 'heroes',
        component: HeroesComponent
      },
      {
        path: 'detail/:id',
        component: HeroDetailComponent
      },      
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: '',
        redirectTo: '/dashboard',
        pathMatch: 'full'
      }
    ])
  ],
  declarations: [ 
    AppComponent, 
    HeroesComponent, 
    HeroDetailComponent, 
    DashboardComponent,
    HeroSearchComponent],
  providers: [ HeroService],
  bootstrap: [ AppComponent ]
})




export class AppModule { }
