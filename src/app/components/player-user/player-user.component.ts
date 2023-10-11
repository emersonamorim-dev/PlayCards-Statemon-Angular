import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-player-user',
  templateUrl: './player-user.component.html',
  styleUrls: ['./player-user.component.scss']
})
export class PlayerUserComponent implements OnInit {
  hand = [];


  ngOnInit() {
    console.log('PlayerAIComponent Initialized');
  }
  constructor() { }


}
