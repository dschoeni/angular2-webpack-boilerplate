import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { routing } from './app.routing';

import { ExampleModule } from './example/example.module';

import '../style/app.scss';

@NgModule({
 imports: [
   BrowserModule,
   ExampleModule,
   routing
 ],
 declarations: [
   AppComponent,
   WelcomeComponent
 ],
 bootstrap: [
   AppComponent
 ]
})

export class AppModule { }
