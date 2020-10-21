import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';

@Component({
  selector: 'app-downloads',
  templateUrl: './downloads.component.html',
  styleUrls: ['./downloads.component.scss']
})
export class DownloadsComponent implements AfterViewInit {
  @ViewChild("scheduleItem") itemProp: QueryList<ElementRef>;

  tempData;
  dataSchedule: scheduleModel[] = new Array();
  now: Date = new Date();
  selectedIndex;
  schedule;
  hour;


  constructor() {
  }

  ngOnInit() {
    this.hour = moment(this.now).format("HH:mm");
  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.toItem('is-active');
    }, 1000);
  }

  toItem(className: string) {
    const elementList = document.querySelectorAll('.' + className);
    const element = elementList[0] as HTMLElement;
    element.scrollIntoView({ behavior: 'smooth' });

  }

  findCurrentHour(data): number {
    let newData: number[] = new Array;
    let thisHour = parseInt(momenttz(this.now).format("H").toString());

    // Add the data into a clean array
    data.forEach(item => {
      newData.push(parseInt(momenttz(item.hour).format("H")));
    });

    // Find the closest value
    newData.sort((a, b) => {
      return Math.abs(thisHour - a) - Math.abs(thisHour - b);
    });

    // Get the index of the closest value
    return data.findIndex(x => parseInt(momenttz(x.hour).format("H")) === newData[0]);

  }

}

export class scheduleModel {
  hour: string
  program: string
  title: string

  constructor() {
    this.hour = ""
    this.program = ""
    this.title = ""
  }
}
