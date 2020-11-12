import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as RecordRTC from 'recordrtc'; // Ref. https://recordrtc.org/
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { ContactService } from './contact.service';
import { PagesService } from '../pages.service'
import { environment } from '../../../environments/environment.prod'


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
  mediaRecorder: any; mystream: any; isSafari: any; isEdge: any;
  recording: boolean = false; player: any; fileinput: any;
  regions: any; regionGroupOptions: Observable<any[]>; userCountry: any;
  formGroup: FormGroup; formData: FormData = new FormData();
  formDataText = new FormData(); formDataFile = new FormData();

  constructor(
    private builder: FormBuilder,
    private http: HttpClient,
    private contact: ContactService,
    private _snackBar: MatSnackBar,
    private _drawer: PagesService) {
  }

  ngOnInit() {

    this._drawer.toggle();

    this.formGroup = this.builder.group({
      name: new FormControl('', [Validators.required]),
      message: new FormControl(''),
      nationality: new FormControl(''),
      email: new FormControl('', [Validators.email]),
      location: new FormControl(''),
    });

    this.regions = this.contact.getCountries();

    this.regionGroupOptions = this.formGroup.get('nationality')!.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filterGroup(value))
      );


    this.contact.getUserCountry().subscribe((res) => {
      let country: any
      country = res;
      this.userCountry = country.country;
      this.formGroup.get('location').setValue(country.city + ', ' + country.region + ', ' + country.country);
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
  onSubmit() {

    var reqHeader = new HttpHeaders({
      'Authorization': environment.apiJWT
    });


    const queryText =
      `mutation {
          create_item (
            board_id: 840830330,
            group_id: "topics",
            item_name: "`+ this.formGroup.get('name').value + " desde " + this.userCountry + `",
            column_values: "{`+
      `\\"` + `texto\\":\\"` + this.formGroup.get('name').value + `\\"` +
      `,\\"` + `texto3\\":\\"` + this.formGroup.get('email').value + `\\"` +
      `,\\"` + `mensaje\\":\\"` + this.formGroup.get('message').value + `\\"` +
      `,\\"` + `texto8\\":\\"` + this.formGroup.get('nationality').value + `\\"` +
      `,\\"` + `texto9\\":\\"` + this.formGroup.get('location').value + `\\"` +
      `}") { id} }`;

    this.formDataText.append("query", queryText);

    this.http.post('https://api.monday.com/v2', this.formDataText, { headers: reqHeader }).subscribe(
      (resText: any) => {
        if (this.formData.get("file") != null) {

          const queryFile =
            `mutation ($file:File!) {
  add_file_to_column(
    file: $file,
    item_id: `+ resText.data.create_item.id + `,
    column_id: archivo)
    { id } }`;

          this.formDataFile.append("query", queryFile);
          this.formDataFile.append("variables[file]", this.formData.get("file"));


          this.http.post('https://api.monday.com/v2/file', this.formDataFile, { headers: reqHeader }).subscribe(
            (resFile: any) => {
              this._drawer.toggle();
              this.snackMessage("¡Tu mensaje ha sido Enviado!");
            },
            (error) => console.log(error)
            , () => {
              this.cleanForm();
            }
          )
        } else {
          this.cleanForm();
          this._drawer.toggle();
          this.snackMessage("¡Tu mensaje ha sido Enviado!")
        }

      },
      (error) => console.log(error)
    )
  }


  snackMessage(message) {
    this._snackBar.open(message, '', {
      duration: 3000,
    });
  }

  cleanForm() {
    this.formGroup.get('name').setValue('');
    this.formGroup.get('email').setValue('');
    this.formGroup.get('message').setValue('');
    this.formGroup.get('nationality').setValue('');
    this.formData.delete("file");
    this.formDataFile.delete("query");
    this.formDataFile.delete("variables[file]");
    this.formDataText.delete("query");
    this.formDataText.delete("variables[file]");
    this.player.src = null;
  }

  startRecording() {
    this.recording = true;
    this.player.src = null;
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

        if (this.formData.get("file")) {
          this.formData.delete("file");
          this.formData.append("file", this.mediaRecorder.getBlob(), this.formGroup.get('name').value + "_" + this.userCountry + "_saludos.mp3");
        } else {
          this.formData.append("file", this.mediaRecorder.getBlob(), this.formGroup.get('name').value + "_" + this.userCountry + "_saludos.mp3");
        }

        this.mediaRecorder.reset();
        this.mystream.stop();
      }, false)

      if (file) {
        filereader.readAsDataURL(file);
      }
    }, 1000);

  }

}


////////////////////////////////// This is an alternative way to send the information.
///////////////////////////////// More information in https://mailthis.to

/*     this.contact.postMessage(FormData)
      .subscribe(response => {
        // location.href = 'https://mailthis.to/confirm'
        this._router.navigate(['/about/mision']);
      }, error => {
        console.warn(error.responseText)
        console.log({ error })
      }); */

/*   sendThis() {
    this.formData.append("_replyto", "chriscard11@gmail.com");
    this.formData.append("name", "chriscard11");
    this.onSubmit(this.formData);

    this.mystream.getTracks().forEach((track) => { track.stop() });
  } */


/*       console.log(file);

      this.player.load(); */
    //this.player.src = "/assets/test.mp3";
    //this.myaudio.nativeElement.src = URL.createObjectURL(recorder.getBlob())
    //this.playAudio(URL.createObjectURL(recorder.getBlob()));

