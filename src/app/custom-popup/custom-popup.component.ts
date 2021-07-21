import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-custom-popup',
  templateUrl: './custom-popup.component.html',
  styleUrls: ['./custom-popup.component.css']
})
export class CustomPopupComponent implements OnInit {
  constructor() {}

  ngOnInit() {}

  public model: PopupData;
}

export class PopupData {
  magnitude: any;
  tsunami: string;
  data: any;

  constructor(data: any) {
    this.data = data;
  }
}
