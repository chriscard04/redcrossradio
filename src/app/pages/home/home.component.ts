import { Component, OnInit } from '@angular/core';
import { PagesService } from '../pages.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit{
  loader: boolean;

  constructor(pages: PagesService) {
    this.loader = pages.getLoader();
  }

  ngOnInit(){
  }

}
