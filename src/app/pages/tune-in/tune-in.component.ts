import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import * as RecordRTC from 'recordrtc';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ContactService } from './contact.service';

export const _filter = (opt: string[], value: string): string[] => {
  const filterValue = value.toLowerCase();
  return opt.filter(item => item.toLowerCase().indexOf(filterValue) === 0);
};


@Component({
  selector: 'app-tune-in',
  templateUrl: './tune-in.component.html',
  styleUrls: ['./tune-in.component.scss']
})
export class TuneInComponent implements AfterViewInit, OnInit {
  player;
  fileinput;
  formData: FormGroup;
  form: FormData;


  mediaRecorder: any;
  mystream: any;
  isSafari: any;
  isEdge: any;


  regions: any;
  regionGroupOptions: Observable<any[]>;

  recording: boolean = false;




  constructor(
    private _router: Router,
    private builder: FormBuilder,
    private contact: ContactService) {
  }

  ngOnInit() {
    this.form = new FormData();
    this.formData = this.builder.group({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.compose([Validators.required, Validators.email])]),
      nationality: new FormControl('', [Validators.required]),
      comment: new FormControl('')
    });

    this.regions = this.contact.getCountries();

    this.regionGroupOptions = this.formData.get('nationality')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );


    this.contact.getUserCountry().subscribe((res) => {
      let country: any
      country = res;
      console.log(country.country);
      console.log(country.region);
      console.log(country.city);
    });

    this.isEdge = navigator.userAgent.indexOf('Edge') !== -1 && (!!navigator.msSaveOrOpenBlob || !!navigator.msSaveBlob);
    this.isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
  }

  private _filterGroup(value: string): any[] {
    if (value) {
      return this.regions
        .map(region => ({ name: region.name, countries: _filter(region.countries, value) }))
        .filter(region => region.countries.length > 0);
    }

    return this.regions;
  }






  ngAfterViewInit() {
    this.player = <HTMLAudioElement>document.getElementById("player");
    this.fileinput = <HTMLInputElement>document.getElementById("fileinput");
    //    this.myaudio.nativeElement.src = "/assets/test.mp3";

  }
  onSubmit(FormData) {

    this.contact.postMessage(FormData)
      .subscribe(response => {
        // location.href = 'https://mailthis.to/confirm'
        this._router.navigate(['/about/mision']);
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      })
  }


  sendThis() {
    this.form.append("_replyto", "chriscard11@gmail.com");
    this.form.append("name", "chriscard11");
    this.onSubmit(this.form);

    this.mystream.getTracks().forEach((track) => { track.stop() });
  }

  startRecording() {
    this.recording = true;
    navigator.mediaDevices.getUserMedia({
      audio: true
    }).then(async (stream) => {

      var options = {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: this.isEdge ? 1 : 2,
        checkForInactiveTracks: true,
        bufferSize: 16384
      };

      if (this.isSafari) {
        options.bufferSize = 4096;
        options.numberOfAudioChannels = 2;
      }

      this.mystream = stream;
      this.mediaRecorder = RecordRTC(stream, options);
      this.mediaRecorder.startRecording();

    });
  }


  stopRecording() {
    this.recording = false;
    this.mediaRecorder.stopRecording(function () { });

    setTimeout(() => {
      let file = this.mediaRecorder.getBlob();
      let filereader = new FileReader();

      filereader.addEventListener("load", () => {
        this.player.src = null;
        this.player.src = filereader.result.toString();

        if (this.form.get("file")) {
          this.form.delete("file");
          this.form.append("file", this.mediaRecorder.getBlob(), "Myregards11.mp3");
        } else {
          this.form.append("file", this.mediaRecorder.getBlob(), "Myregards11.mp3");
        }

        this.mediaRecorder.reset();
      }, false)

      if (file) {
        filereader.readAsDataURL(file);
      }
    }, 1000);



    /*       console.log(file);

          this.player.load(); */
    //this.player.src = "/assets/test.mp3";
    //this.myaudio.nativeElement.src = URL.createObjectURL(recorder.getBlob())
    //this.playAudio(URL.createObjectURL(recorder.getBlob()));


  }

}
