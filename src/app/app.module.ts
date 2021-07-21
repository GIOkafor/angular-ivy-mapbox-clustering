import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { DynamicComponentService } from './dynamic-component.service';
import { CustomPopupComponent } from './custom-popup/custom-popup.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule ],
  declarations: [ AppComponent, HelloComponent, CustomPopupComponent ],
  bootstrap:    [ AppComponent ],
  providers: [DynamicComponentService]
})
export class AppModule { }
