import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { Card } from 'src/app/model/Card';
import { Deck } from 'src/app/model/Deck';
import { CardService } from 'src/app/services/card.service';
import { DeckService } from 'src/app/services/deck.service';
import { CardSelectorComponent } from '../card-selector/card-selector.component';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { cardCountValidator, duplicateCardValidator } from 'src/app/model/validators';
import { GameBoardComponent } from '../game-board/game-board.component';


@Component({
  selector: 'app-card-add',
  templateUrl: './card-add.component.html',
  styleUrls: ['./card-add.component.scss']
})
export class CardAddComponent implements OnInit {
  cards: Card[] = [];
  decks: Deck[] = [];
  selectedCard: string = '';
  selectedDeck: string = '';

  availableCards: Card[] = [];
  deckForm: FormGroup;
  deck: Deck = {
    name: '',
    id: '',
    cards: []
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<CardAddComponent>,
    private deckService: DeckService,
    private cardService: CardService) {

  // Adiciona um FormArray para gerenciar as cartas
      this.deckForm = this.fb.group({
        name: [''],
        cards: this.fb.array([])
      });

      this.deckForm.setValidators([
        cardCountValidator(24, 60),
        duplicateCardValidator()
      ]);

    }

  ngOnInit() {
    this.subscription.add(
      this.cardService.getCards().subscribe(cards => {
        this.cards = cards;

        this.deck = {
          name: '',
          id: '',
          cards: []
        };

        this.deck[0] = null;
        delete this.deck[0];
      })
    );

    this.decks = this.deckService.getDecks();

    this.deck = {...this.deck, ...this.deckService.getDeckFromLocalStorage()};
    if (!this.deck.cards) {
      this.deck.cards = [];
    }
    this.deck.id = Math.random().toString(36).substring(2, 11);
    this.deck.cards = [];
    this.loadDecks();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }


  public addCardToDeck() {
    if (this.selectedCard && this.selectedDeck) {
        this.cardService.addCardToDeck(this.selectedDeck, this.selectedCard);

        Swal.fire({
            title: 'Sucesso!',
            text: 'Carta adicionada ao baralho com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
    } else {
        Swal.fire({
            title: 'Erro!',
            text: 'Selecione tanto a carta quanto o baralho para continuar.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

  public openCardSelector(): void {
    const dialogRef = this.dialog.open(CardSelectorComponent, {
      width: '250px',
      data: this.availableCards
    });

    dialogRef.afterClosed().subscribe((selectedCard: Card) => {
      if (selectedCard) {
        this.addCard(selectedCard);
      }
    });
  }


  public addCard(card: Card): void {
    (this.deckForm.get('cards') as FormArray).push(this.fb.control(card));
  }



  public loadDecks(): void {
    const storedDecks = JSON.parse(localStorage.getItem('decks'));
    if (storedDecks) {
      this.decks = storedDecks;
    }
  }

  public onSubmit(): void {
    if (this.selectedDeck && this.selectedDeck.trim() !== '' &&
        this.selectedCard && this.selectedCard.trim() !== '') {

        if (this.deck.id) {
            this.deckService.updateDeck(this.deck);
        } else {
            this.deck.id = Math.random().toString(36).substring(2, 11);
            this.deckService.addDeck(this.deck);
        }

        Swal.fire({
            title: 'Sucesso!',
            text: 'Carta adicionada ao Baralho com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
        });

        this.onClose();
    } else {
        Swal.fire({
            title: 'Erro!',
            text: 'Nome do Baralho e Carta são requeridos!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}

public playNow(deck: Deck): void {
  console.log('Play Again:');

  const dialogRef = this.dialog.open(GameBoardComponent, {
    width: '1900px',
    height: '700px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      deck.name = result;

      this.deckService.updateDeck(deck).subscribe(updatedDeck => {
        if (updatedDeck) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Jogo iniciado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Game Over. Janela Fechada!',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
}



public onClose(): void {
    this.dialogRef.close();
  }
}


