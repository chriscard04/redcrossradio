import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild } from '@angular/core';
import { ScheduleService } from './schedule.service'
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit, OnDestroy {


  loading: boolean = false;
  tempData; dataSchedule: scheduleModel[] = new Array();
  now: Date = new Date();
  selectedIndex; schedule;
  horalocal: String; zonalocal: String;
  updateTimeInterval: any;


  constructor(private _scheduleService: ScheduleService, public elRef: ElementRef) {
  }

  ngOnInit() {

    this.loading = true;
    this._scheduleService.getSchedule().subscribe(
      data => {
        data['feed']['entry'].forEach(item => {
          let newschedule = new scheduleModel();
          let temp = null, source = null;
          // Set the origin time zone
          source = moment.tz(item.gsx$hour.$t, "America/Bogota");
          // Transform to local time zone
          temp = source.clone().tz(moment.tz.guess(true));
          newschedule.program = item.gsx$program.$t;
          newschedule.title = item.gsx$title.$t;
          newschedule.hour = temp.format();

          this.dataSchedule.push(newschedule);
        });
        this.loading = false;

        this.tempData = this.dataSchedule

        this.updateTime();
      },
      (err) => {
        console.log(err.message);
      }
    );
    this.zonalocal = moment.tz.guess();

    this.now = new Date();
    this.horalocal = moment(this.now).format("HH:mm a").toString() + " (GMT" + moment.tz(this.now, moment.tz.guess()).format("Z") + ")";

    this.updateTimeInterval = setInterval(() => {
      this.now = new Date();
      this.horalocal = moment(this.now).format("HH:mm a").toString() + " (GMT" + moment.tz(this.now, moment.tz.guess()).format("Z") + ")";

      // Identify the current hour
      this.selectedIndex = this.findCurrentHour(this.tempData);

      // Scroll to item afer 1 second
      setTimeout(() => {
        this.toItem('is-active');
      }, 1000);

    }, 10000);
  }

  ngOnDestroy() {
    clearInterval(this.updateTimeInterval);
  }

  updateTime() {
    // Format the hour to show in column
    this.tempData.forEach(item => {
      item.hour = moment(item.hour).format("HH:mm");
    });

    // Order list by hour
    this.tempData.sort((a, b) => (a.hour > b.hour) ? 1 : -1);

    // Identify the current hour
    this.selectedIndex = this.findCurrentHour(this.tempData);

    // Assign data to ListView Data Source
    this.schedule = this.tempData;

    // Scroll to item afer 1 second
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
    let today = "2000-01-01 "; // placeholder
    let newData: number[] = new Array;
    let thisHour = parseInt(momenttz(this.now).format("HH") + momenttz(this.now).format("mm"));
    // Add the data into a clean array to order
    data.forEach(item => {
      newData.push(parseInt(moment(new Date(today + item.hour)).format("HH") + moment(new Date(today + item.hour)).format("mm")));
    });

    // Find the closest value
    newData.sort((a, b) => {
      return Math.abs(thisHour - a) - Math.abs(thisHour - b);
    });

    // Get the index of the closest value
    return data.findIndex(x => (parseInt(moment(new Date(today + x.hour)).format("HH") + moment(new Date(today + x.hour)).format("mm"))) === newData[0]);

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
