import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MagicService } from 'src/app/services/magic.service';

@Component({
  selector: 'app-player-ai',
  templateUrl: './player-ai.component.html',
  styleUrls: ['./player-ai.component.scss']
})
export class PlayerAIComponent implements OnInit {

  hand = [];
  @Input() isOpponentsTurn: boolean;
  @Input() deck: Object[];
  @Input() topCard;
  @Output() opponentDone = new EventEmitter();
  @Output() opponentWon = new EventEmitter();

  constructor(private magics: MagicService) { }

  ngOnInit() {
    console.log('PlayerAIComponent Initialized');
  }


  ngOnChanges() {
    if (this.isOpponentsTurn && this.topCard && this.hand) {
        this.magics.shuffleCards(this.hand);

        const matchingCardIndex = this.hand.findIndex(card =>
            card && (this.topCard.value === card.value || this.topCard.color === card.color)
        );

        if (matchingCardIndex !== -1) {
            setTimeout(() => {
                this.opponentDone.emit(this.hand.splice(matchingCardIndex, 1));
            }, 1000);
        } else {
            this.hand.push(this.magics.drawCard(this.deck));
        }

        if (this.hand.length === 0) {
            this.opponentWon.emit();
        }
    }
}


}

