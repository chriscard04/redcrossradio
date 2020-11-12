import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { ScheduleService } from './schedule.service'
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';


@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements AfterViewInit {
  @ViewChild("scheduleItem") itemProp: QueryList<ElementRef>;
  loading: boolean = false;

  tempData;
  dataSchedule: scheduleModel[] = new Array();
  now: Date = new Date();
  selectedIndex;
  schedule;
  horalocal: String;
  zonalocal: String;

  constructor(private _scheduleService: ScheduleService, public elRef: ElementRef) {
  }

  ngOnInit() {
    this.loading = true;
    this._scheduleService.getSchedule().subscribe(
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
        this.loading = false;
        this.tempData = this.dataSchedule



        this.selectedIndex = this.findCurrentHour(this.dataSchedule);

        this.tempData.forEach(item => {
          item.hour = moment(item.hour).format("HH:mm");
        });

        // Analizar el ordenamiento
        // this.tempData.sort((a, b) => (a.hour > b.hour) ? 1 : -1);
        this.schedule = this.tempData;

        setTimeout(() => {
          this.toItem('is-active');
        }, 1000);
      },
      (err) => {
        console.log(err.message);
      }
    );

    this.horalocal = moment(this.now).format("HH:mm a").toString() + " (" + moment.tz.zone(moment.tz.guess()).abbr(360) + ")";
    this.zonalocal = moment.tz.guess();
  }

  ngAfterViewInit() {
    console.log(moment.tz.guess())
    console.log(moment.tz.zone(moment.tz.guess()).abbr(360))
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
