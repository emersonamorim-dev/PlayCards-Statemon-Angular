import { Injectable } from '@angular/core';
import { Card } from '../model/Game';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class GameService {
  deck: Card[] = [];
  playerHand: Card[] = [];
  computerHand: Card[] = [];
  discardPile: Card[] = [];
  cards: Card[] = [];
  humanHand: Card[] = [];
  currentPlayer: 'human' | 'computer' = 'human';
  currentCard: Card;
  discardPileChanged = new Subject<void>();

  public playerScore: number;
  public computerScore: number;
  initialHandSize: number = 1;

  constructor(private http: HttpClient) {
    this.initializeDeck();
    this.shuffleDeck();
    this.dealCards();

    this.playerScore = this.getPlayerPoints();
    this.computerScore = this.getComputerPoints();

    this.loadCardsFromAPI().subscribe(cards => {
      this.deck = cards;
      this.shuffleDeck();
      this.dealCards();
    });
  }

  initializeDeck() {
    const colors = ['Red', 'Green', 'Blue', 'Yellow'];
    const values = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Skip', 'Reverse', 'Draw Two'];

    this.deck = colors.reduce((acc, color) => [
      ...acc,
      ...values.map(value => new Card(color, value))
    ], []);


}

loadCardsFromAPI(): Observable<Card[]> {
  return this.http.get('https://api.pokemontcg.io/v2/cards').pipe(
    map((response: any) => response.data.map(cardData => new Card(
      cardData.name,
      cardData.color,
      cardData.value,
      cardData.images.small
    )))
  );
}

computerPlayCard(): Card | null {
  for (let card of this.computerHand) {
    if (this.canPlayCard('computer', card)) {
      const index = this.computerHand.indexOf(card);
      this.computerHand.splice(index, 1);
      this.discardPile.push(card);
      console.log('Computer jogou a carta:', card);

      return card;
    }
  }

  console.log('Computer não pode jogar, passando a vez.');
  return null;
}


  shuffleDeck() {
    for (let i = this.deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
    }
  }

  dealCards(): void {
    this.playerHand = [];
    this.computerHand = [];

    for (let i = 0; i < 7; i++) {
      this.playerHand.push(this.deck.pop());
      this.computerHand.push(this.deck.pop());
    }

    this.discardPile.push(this.deck.pop());

    this.humanHand = this.playerHand;
    this.computerHand = this.computerHand;
  }

  playCard(player: 'human' | 'computer', card: Card) {
    if (this.canPlayCard(player, card)) {
        this.discardPile.push(card);
        this.discardPileChanged.next();

        if (player === 'human') {
            this.playerHand = this.playerHand.filter(c => c !== card);
        } else {
            this.computerHand = this.computerHand.filter(c => c !== card);
        }

        switch (card.value) {
            case 'Skip':
                break;
            case 'Reverse':
                break;
            case 'Draw Two':
                this.drawCard(player === 'human' ? 'computer' : 'human', 2);
                break;
            case 'Wild':
                break;
            case 'Wild Draw Four':
                this.drawCard(player === 'human' ? 'computer' : 'human', 4);
                break;
        }

        this.togglePlayer();
        return true;
    }

    return false;
}

drawCard(player: 'human' | 'computer', count: number = 1): Card[] {
  const drawnCards: Card[] = [];

  for (let i = 0; i < count; i++) {
      if (this.deck.length > 0) {
          const drawnCard = this.deck.pop();
          drawnCards.push(drawnCard);

          if (player === 'human') {
              this.playerHand.push(drawnCard);
          } else {
              this.computerHand.push(drawnCard);
          }
      } else {
          break;
      }
  }

  return drawnCards.length > 0 ? drawnCards : null;
}

canPlayCard(player: 'human' | 'computer', card: Card): boolean {
  if (!card) {
      console.error('Card is undefined:', card);
      return false;
  }

  if (card.name && !card.color && !card.value) {
      return true;
  }

  const topCard = this.discardPile[this.discardPile.length - 1];

  if (!topCard) {
      console.error('Top card is undefined:', topCard);
      return false;
  }

  const canPlayByColorOrValue = card.color === topCard.color || card.value === topCard.value;
  const canPlaySpecialCard = card.value === 'Wild' || card.value === 'Wild Draw Four';

  return canPlayByColorOrValue || canPlaySpecialCard;
}

addPlayerPoints(points: number) {
  this.playerScore += points;
  localStorage.setItem('playerScore', this.playerScore.toString());
}

addComputerPoints(points: number) {
  this.computerScore += points;
  localStorage.setItem('computerScore', this.computerScore.toString());
}

getPlayerPoints(): number {
  const storedScore = localStorage.getItem('playerScore');
  return storedScore ? parseInt(storedScore, 10) : 0;
}

getComputerPoints(): number {
  const storedScore = localStorage.getItem('computerScore');
  return storedScore ? parseInt(storedScore, 10) : 0;
}

resetGame(): void {
  this.playerHand = [];
  this.computerHand = [];
  this.discardPile = [];

  this.initializeDeck();
  this.shuffleDeck();
  this.dealCards();
}

togglePlayer() {
    this.currentPlayer = this.currentPlayer === 'human' ? 'computer' : 'human';
}
}

