import { Component, Inject } from '@angular/core';
import Swal from 'sweetalert2';
import { Card } from 'src/app/model/Game';
import { GameService } from 'src/app/services/game.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.scss']
})
export class GameBoardComponent {
  selectedCard: Card = null;
  data: any = {};

  currentPlayer: 'human' | 'computer' = 'human';

  constructor(public gameService: GameService,
    public dialogRef: MatDialogRef<GameBoardComponent>,
    @Inject(MAT_DIALOG_DATA) public incomingData: any
    ) {
      this.data = incomingData || {};
    }


  ngOnInit() {
    this.playCard();
    this.computerPlayCard();
    this.startGame();

    this.gameService.discardPileChanged.subscribe(() => {
        this.currentPlayer = this.currentPlayer === 'human' ? 'computer' : 'human';
        if (this.currentPlayer === 'computer') {
            this.computerPlayCard();
        }
    });
  }

  selectCard(card: Card) {
    this.selectedCard = card;
  }

  isStartOfGame(): boolean {
    const isStart = this.gameService.discardPile.length === 0;
    console.log('É o início do jogo?', isStart);
    return isStart;
}

checkForWinner(player: 'human' | 'computer') {
  const playerHand = this.gameService.playerHand;
  const computerHand = this.gameService.computerHand;

  if (playerHand.length === 0) {
    console.log('O jogador humano é o vencedor!');
    this.gameService.addPlayerPoints(1);
    this.announceWinner('human');
    return;
  }

  if (computerHand.length === 0) {
    console.log('O computador é o vencedor!');
    this.gameService.addComputerPoints(1);
    this.announceWinner('computer');
    return;
  }

  console.log('Nenhum vencedor detectado ainda. Mão do jogador humano:', playerHand.length, 'Mão do computador:', computerHand.length);
}

announceWinner(winner: 'human' | 'computer') {
  const title = winner === 'human' ? 'Parabéns! Você venceu!' : 'Que pena! O computador venceu.';
  Swal.fire({
    title: title,
    text: `Pontuação: ${winner === 'human' ? this.gameService.getPlayerPoints() : this.gameService.getComputerPoints()}`,
    icon: 'success',
  });
}


calculateScore(hand: Card[]): number {
  let score = 0;
  hand.forEach(card => {
    score += this.getCardPoints(card);
  });
  return score;
}

getCardPoints(card: Card): number {
  if (!card.value) {
    console.log('Erro: O valor da carta é indefinido. Não é possível calcular os pontos.');
    return 0;
  }

  if (isNaN(Number(card.value))) {
    return 20;
  }

  return parseInt(card.value);
}

playCard() {
  if (this.selectedCard) {
    const canPlay = this.gameService.canPlayCard('human', this.selectedCard);

    if (canPlay) {
      this.gameService.playCard('human', this.selectedCard);
      this.selectedCard = null;
      this.computerPlayCard();
    } else {
      alert('Você não pode jogar esta carta agora. Passando a vez.');
      this.computerPlayCard();
    }
    this.checkForWinner('human');
  }
}

computerPlayCard() {
  setTimeout(() => {
    const card = this.gameService.computerPlayCard();
    console.log('Computer is making a move.');
    if (card) {
      console.log('Selected card to play:', card);
    } else {
      console.log('Computer não pode jogar uma carta, passando a vez.');
    }
    this.checkForWinner('computer');
  }, 1000);
}

startGame() {
  this.gameService.dealCards();
  if (this.isComputersTurn()) {
      this.computerPlayCard();
  }
}

isComputersTurn(): boolean {
  return this.gameService.discardPile.length === 0;
}

shouldComputerDrawCard(): boolean {
  const topCard = this.gameService.discardPile[this.gameService.discardPile.length - 1];
  const hasPlayableCards = this.gameService.computerHand.some(card =>
      card.color === topCard.color || card.value === topCard.value ||
      card.value === 'Wild' || card.value === 'Wild Draw Four'
  );

  if (hasPlayableCards) return false;
  return true;
}

selectCardToPlay(playableCards: Card[]): Card {

  if (this.gameService.playerHand.length === 1) {
      const actionCard = playableCards.find(card =>
          ['Skip', 'Reverse', 'Draw Two', 'Wild Draw Four'].includes(card.value)
      );
      if (actionCard) return actionCard;
  }

  playableCards.sort((a, b) => {
      const aValue = ['Skip', 'Reverse', 'Draw Two', 'Wild', 'Wild Draw Four'].includes(a.value) ? 10 : parseInt(a.value, 10);
      const bValue = ['Skip', 'Reverse', 'Draw Two', 'Wild', 'Wild Draw Four'].includes(b.value) ? 10 : parseInt(b.value, 10);
      return bValue - aValue;
  });

  return playableCards[0];
}

selectBestActionCard(actionCards: Card[]): Card {
  if (this.gameService.playerHand.length === 1) {
      const drawCard = actionCards.find(card =>
          card.value === 'Draw Two' || card.value === 'Wild Draw Four'
      );
      if (drawCard) return drawCard;
  }

  const priorityOrder = ['Wild Draw Four', 'Draw Two', 'Skip', 'Reverse', 'Wild'];
  actionCards.sort((a, b) =>
      priorityOrder.indexOf(a.value) - priorityOrder.indexOf(b.value)
  );

  return actionCards[0];
}

getMostCommonColor(hand: Card[]): string {
  const colorCounts = { Red: 0, Yellow: 0, Green: 0, Blue: 0 };
  hand.forEach(card => {
      if (card.color) {
          colorCounts[card.color]++;
      }
  });

  return Object.keys(colorCounts).reduce((a, b) => colorCounts[a] > colorCounts[b] ? a : b);
}


  getCardImage(card: Card): string {
    if (card && card.image) {
        if (card.image.startsWith('http') || card.image.startsWith('https')) {
            return card.image;
        }
    }

    return null;
}

drawCard() {
    if (this.gameService.deck.length > 0) {
        this.gameService.drawCard('human');
        console.log('O jogador humano comprou uma carta.');
        this.computerPlayCard();
    } else {
        console.log('O baralho está vazio.');
    }
}

getCardDetails(card: Card) {
  if (card && card.image) {
    return {
      image: card.image,
      text: card.name
    };
  }

  return null;
}

getCardText(card: Card): string {
  if (card && card.name) {
    return card.name;
  }
  return '';
}

  scrollLeft(hand: 'computer' | 'player') {
    const container = document.querySelector(`.${hand}-hand .cards`);
    container.scrollBy({ left: -100, behavior: 'smooth' });
  }

  scrollRight(hand: 'computer' | 'player') {
    const container = document.querySelector(`.${hand}-hand .cards`);
    container.scrollBy({ left: 100, behavior: 'smooth' });
  }

  public onClose(): void {
    this.dialogRef.close();
}
}





