import {Component} from "@angular/core";
import {NgModule} from "@angular/core";
import {platformBrowserDynamic} from "@angular/platform-browser-dynamic";
import {BrowserModule} from "@angular/platform-browser";




@Component({
    selector:'app',
    template: `<h1>Hello Ng2 World !</h1>`
})
export class App {
}

 
@NgModule({
    declarations: [HelloWorld],
    imports: [BrowserModule],
    bootstrap: [HelloWorld]
})
export class AppModule {

}

platformBrowserDynamic().bootstrapModule(AppModule);


