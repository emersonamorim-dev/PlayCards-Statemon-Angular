import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, AfterViewInit,ChangeDetectorRef, ViewChild} from '@angular/core';
import { Card } from 'src/app/model/Game';

@Component({
  selector: 'app-play-game',
  templateUrl: './play-game.component.html',
  styleUrls: ['./play-game.component.scss'],
  animations: [
    trigger('reciveCardFromDeck', [
      state('vertical',
        style({ transform: 'translateX(0px) translateY(0px)' })
      ),
      state('horizontal',
        style({ transform: 'translateX(0px) translateY(0px) rotate(90deg)' })
      ),
      transition('void => vertical', [animate('240ms')]),
      transition('void => horizontal', [animate('240ms')])
    ]),
  ]
})

export class PlayGameComponent{
  @Input() card: Card;

}




