import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Card } from 'src/app/model/Card';
import { CardService } from 'src/app/services/card.service';
import { MatDialog } from '@angular/material/dialog';
import { DeckFormComponent } from '../deck-form/deck-form.component';;
import { CardAddComponent } from '../card-add/card-add.component';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],

  animations: [
    trigger('flipState', [
      state('active', style({
        transform: 'rotateY(179deg)'
      })),
      state('inactive', style({
        transform: 'rotateY(0)'
      })),
      transition('active => inactive', animate('500ms ease-out')),
      transition('inactive => active', animate('500ms ease-in'))
    ])
  ]
})

export class CardComponent implements OnInit {
  public cards: Card[] = [];
  public displayedCards: Card[] = [];
  public itemsPerPage = 16;
  public currentPage = 1;
  public totalItems: number;
  public totalPages: number;

  public isLoading = true;

  constructor(public dialog: MatDialog, private cardService: CardService) { }

  public ngOnInit(): void {
    this.isLoading = true;

    this.cardService.getCards().subscribe(cards => {
      this.cards = cards;
      this.totalItems = cards.length;
      this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
      this.updateDisplayedCards();
      this.isLoading = false;
    }, error => {
      console.error('Erro ao carregar os cards:', error);
      this.isLoading = false;
    });
  }


public createDeck(card: Card): void {
    console.log('Criar Baralho', card);

    const dialogRef = this.dialog.open(DeckFormComponent, {
      width: '480px',
      height: '280px',
      data: {name: card.name, id: card.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado');
    });
  }

public addCards(card: Card): void {
    console.log('Adicionar Carta', card);

    const dialogRef = this.dialog.open(CardAddComponent, {
      width: '480px',
      height: '280px',
      data: {name: card.name, id: card.id}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado');
    });
  }

public nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateDisplayedCards();
    }
  }

public previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedCards();
    }
  }

public updateDisplayedCards(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCards = this.cards.slice(start, end);
  }

public loadCards(): void {
    this.isLoading = true;

    // Calcula o offset com base na página atual e nos itens por página
    const offset = (this.currentPage - 1) * this.itemsPerPage;

    // Carrega os cards da API com base no offset e limit
    this.cardService.getCardsWithOffsetAndLimit(offset, this.itemsPerPage).subscribe(cards => {
      this.displayedCards = cards;
      this.isLoading = false;
    }, error => {
      console.error('Erro ao carregar os cards:', error);
      this.isLoading = false;
    });
}


flip: string = 'inactive';

public toggleFlip(card: Card): void {
  card.isFlipped = !card.isFlipped;
  console.log('Card Flipped:', card.isFlipped);
}


public getVisiblePageNumbers(): number[] {
  const totalNumbersToShow = 8;
  let startPage = this.currentPage - Math.floor(totalNumbersToShow / 2);
  startPage = Math.max(startPage, 1);
  let endPage = startPage + totalNumbersToShow - 1;
  endPage = Math.min(endPage, this.totalPages);

  if (endPage - startPage < totalNumbersToShow - 1) {
    startPage = Math.max(endPage - totalNumbersToShow + 1, 1);
  }

  const pageNumbers = [];
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }
  return pageNumbers;
}

public goToPage(page: number): void {
  this.currentPage = page;
  this.updateDisplayedCards();
 }

}
