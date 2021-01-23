import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChild,
} from '@angular/core';
import { ScheduleService } from './schedule.service';
import * as momenttz from 'moment-timezone';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
})
export class ScheduleComponent implements OnInit, OnDestroy {
  loading: boolean = false;
  tempData;

  dataScheduleObj: { [days: string]: scheduleModel[] } = {};

  now: Date = new Date();
  selectedItemIndex;
  schedule = {};
  horalocal: String;
  zonalocal: String;
  updateTimeInterval: any;

  matTabGroup;

  tabs = [
    'LUNES',
    'MARTES',
    'MIERCOLES',
    'JUEVES',
    'VIERNES',
    'SABADO',
    'DOMINGO',
  ];
  selectedTab = new FormControl(0);
  currentDay = 'LUNES';
  constructor(
    private _scheduleService: ScheduleService,
    public elRef: ElementRef
  ) {}

  ngOnInit() {
    this.loading = true;
    let _currentDay = null;

    this.setCurrentDay();
    this._scheduleService.getSchedule().subscribe(
      (data) => {
        data['feed']['entry'].forEach((item) => {
          let newschedule = new scheduleModel();
          let temp = null,
            source = null;
          // Set the origin time zone
          source = moment.tz(item.gsx$hour.$t, 'America/Bogota');
          // Transform to local time zone
          temp = source.clone().tz(moment.tz.guess(true));

          newschedule.program = item.gsx$program.$t;
          newschedule.title = item.gsx$title.$t;
          newschedule.hour = temp.format();
          newschedule.length = item.gsx$length$t;
          newschedule.badge = item.gsx$badge.$t;

          // Group by tab - day
          if (_currentDay == null) {
            _currentDay = item.gsx$day.$t;
            this.dataScheduleObj[_currentDay] = new Array();
          } else {
            if (_currentDay !== item.gsx$day.$t) {
              _currentDay = item.gsx$day.$t;
              this.dataScheduleObj[_currentDay] = new Array();
            }
          }
          this.dataScheduleObj[item.gsx$day.$t].push(newschedule);
        });
        this.loading = false;

        this.tempData = this.dataScheduleObj;

        this.updateTime();
      },
      (err) => {
        console.log(err.message);
      }
    );

    this.zonalocal = moment.tz.guess();

    this.now = new Date();
    this.horalocal =
      moment(this.now).format('HH:mm a').toString() +
      ' (GMT' +
      moment.tz(this.now, moment.tz.guess()).format('Z') +
      ')';

    // Check if there is a new program/hour to move the "highlight"
    let currentItem = null;
    this.updateTimeInterval = setInterval(() => {
      this.now = new Date();
      this.horalocal =
        moment(this.now).format('HH:mm a').toString() +
        ' (GMT' +
        moment.tz(this.now, moment.tz.guess()).format('Z') +
        ')';

      // Identify the current hour
      if (currentItem == null) {
        this.selectedItemIndex = this.findCurrentHour(
          this.tempData[this.currentDay]
        );
        currentItem = this.selectedItemIndex;
      } else {
        let newItem = this.findCurrentHour(this.tempData[this.currentDay]);
        //console.log("new:", newItem, "curr:",currentItem)
        if (newItem !== currentItem) {
          // IF there's a different hour to go, then
          // Scroll to item afer 1 second
          setTimeout(() => {
            this.toItem('is-active');
          }, 1000);
        }
      }
    }, 10000);
  }

  ngOnDestroy() {
    clearInterval(this.updateTimeInterval);
  }

  setCurrentDay() {
    let dayNumber = moment(this.now).day();
    this.currentDay = this.tabs[dayNumber];
    dayNumber == 0
      ? this.selectedTab.setValue(7)
      : this.selectedTab.setValue(dayNumber - 1);
  }

  updateTime() {
    // Format the hour to show in column

    // Order list by hour
    this.tabs.forEach((tab) => {
      this.tempData[tab].sort((a, b) => (a.hour > b.hour ? 1 : -1));
    });

    this.tabs.forEach((tab) => {
      this.tempData[tab].forEach((item) => {
        item.hour = moment(item.hour).format('hh:mm a');
      });
    });

    // Identify the current hour
    this.selectedItemIndex = this.findCurrentHour(
      this.tempData[this.currentDay]
    );

    // Assign data to ListView Data Source
    this.schedule = this.dataScheduleObj; //this.tempData;

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
    let today = '2000-01-01 '; // placeholder
    let newData: number[] = new Array();
    let thisHour = parseInt(
      momenttz(this.now).format('HH') + momenttz(this.now).format('mm')
    );
    // Add the data into a clean array to order
    data.forEach((item) => {
      newData.push(
        parseInt(
          moment(new Date(today + item.hour)).format('HH') +
            moment(new Date(today + item.hour)).format('mm')
        )
      );
    });

    // Find the closest value
    newData.sort((a, b) => {
      return Math.abs(thisHour - a) - Math.abs(thisHour - b);
    });

    // Get the index of the closest value
    return data.findIndex(
      (x) =>
        parseInt(
          moment(new Date(today + x.hour)).format('HH') +
            moment(new Date(today + x.hour)).format('mm')
        ) === newData[0]
    );
  }
}

export class scheduleModel {
  hour: string;
  program: string;
  title: string;
  badge: string;
  length: string;

  constructor() {
    this.hour = '';
    this.program = '';
    this.title = '';
    this.length = '';
    this.badge = '';
  }
}
