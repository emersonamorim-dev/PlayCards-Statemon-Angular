import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MagicService } from 'src/app/services/magic.service';

@Component({
  selector: 'app-player-ai',
  templateUrl: './player-ai.component.html',
  styleUrls: ['./player-ai.component.scss']
})
export class PlayerAIComponent implements OnInit {

  hand = [];


  constructor(private magics: MagicService) { }

  ngOnInit() {
    console.log('PlayerAIComponent Initialized');
  }

}

