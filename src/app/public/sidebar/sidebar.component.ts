import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from '@angular/material/expansion';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor() { }
  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  panelOpenState = false;



  ngOnInit(): void {}


  playSound() {
    const audio = new Audio();
    audio.src = 'assets/click/side.mp3';
    audio.load();
    audio.play();
  }

}
