import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MagicService } from 'src/app/services/magic.service';

@Component({
  selector: 'app-player-user',
  templateUrl: './player-user.component.html',
  styleUrls: ['./player-user.component.scss']
})
export class PlayerUserComponent implements OnInit {
  hand = [];
  @Input() isOpponentsTurn: boolean;
  @Input() deck: Object[];
  @Input() topCard;
  @Output() playerDone = new EventEmitter();
  @Output() playerWon = new EventEmitter();

  ngOnInit() {
    console.log('PlayerAIComponent Initialized');
  }
  constructor(private magics: MagicService) { }



  placeCard(i: number) {
    if (!this.isOpponentsTurn && this.topCard && this.hand && i < this.hand.length) {
        const card = this.hand[i];
        if (card && (this.topCard.value === card.value || this.topCard.color === card.color)) {
            const selectedCard = this.hand.splice(i, 1);
            this.playerDone.emit(selectedCard);
        } else {
            console.error('A carta selecionada não corresponde à carta do topo.');
        }
    } else {
        console.error('Não é a vez do jogador ou a carta/mão do topo está indefinida.');
    }
}


}

