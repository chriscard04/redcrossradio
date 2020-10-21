import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { DailyService } from './daily.service'
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';


@Component({
  selector: 'app-daily',
  templateUrl: './daily.component.html',
  styleUrls: ['./daily.component.scss']
})
export class DailyComponent implements AfterViewInit {
  @ViewChild("scheduleItem") itemProp: QueryList<ElementRef>;

  tempData;
  dataSchedule: scheduleModel[] = new Array();
  now: Date = new Date();
  selectedIndex;
  schedule;
  hour;

  constructor(private _dailyService: DailyService, public elRef: ElementRef) {
  }

  ngOnInit() {
    this._dailyService.getSchedule().subscribe(
      data => {
        data['feed']['entry'].forEach(item => {
          let newschedule = new scheduleModel();
          let temp = null;

          temp = momenttz.tz(item.gsx$hour.$t, "America/Panama");
          newschedule.program = item.gsx$program.$t;
          newschedule.title = item.gsx$title.$t;
          newschedule.hour = temp.format();

          this.dataSchedule.push(newschedule);
        });

        this.tempData = this.dataSchedule

        this.selectedIndex = this.findCurrentHour(this.dataSchedule);

        this.tempData.forEach(item => {
          item.hour = moment(item.hour).format("HH:mm");
        });

        this.schedule = this.tempData;

        setTimeout(() => {
          this.toItem('is-active');
        }, 1000);
      },
      (err) => {
        console.log(err.message);
      }
    );

    this.hour = moment(this.now).format("HH:mm");
  }

  ngAfterViewInit() {

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
