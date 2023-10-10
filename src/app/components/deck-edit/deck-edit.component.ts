import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DeckService } from 'src/app/services/deck.service';
import { Deck } from 'src/app/model/Deck';
import {  FormBuilder, FormGroup } from '@angular/forms';
import { cardCountValidator, duplicateCardValidator } from 'src/app/model/validators';
import { MatDialog } from '@angular/material/dialog';
import { EditDeckNameDialogComponent } from '../edit-deck-name-dialog/edit-deck-name-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { DeckFormComponent } from '../deck-form/deck-form.component';
import { CardAddComponent } from '../card-add/card-add.component';
import { GameBoardComponent } from '../game-board/game-board.component';


@Component({
  selector: 'app-deck-edit',
  templateUrl: './deck-edit.component.html',
  styleUrls: ['./deck-edit.component.scss']
})
export class DeckEditComponent implements OnInit {
  deck: Deck;
  decks: Deck[] = [];
  deckForm: FormGroup;
  form: FormGroup;


  displayedColumns: string[] = ['name', 'edit', 'delete'];
  isLoading = false;

  public itemsPerPage = 18;
  public currentPage = 1;
  public totalItems: number;
  public totalPages: number;


  @ViewChild(MatPaginator, {static: false}) paginator!: MatPaginator;
  public dataSource = new MatTableDataSource();

  constructor(
    private router: Router,
    private deckService: DeckService,
    private fb: FormBuilder,
    public dialog: MatDialog,
    private cdr: ChangeDetectorRef,

  ) {
    this.deckForm = this.fb.group({
      name: [''],
      cards: this.fb.array([])
    });

    this.deckForm.setValidators([
      cardCountValidator(24, 60),
      duplicateCardValidator()
    ]);

  }

public ngOnInit() {
    this.loadDecks();
    this.cdr.detectChanges();
    this.dataSource.data = this.decks;


  }

public ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

public loadDecks(): void {
    const storedDecks = localStorage.getItem('decks');
    if (storedDecks) {
      this.decks = JSON.parse(storedDecks);
    }
  }


public onSave(): void {
  const updatedDeck = { ...this.deck, ...this.deckForm.value };
  this.deckService.addDeck(updatedDeck);
  this.router.navigate(['/decks']);
}

public onEdit(deck: Deck): void {
    console.log('Editando o baralho:', deck);

    const dialogRef = this.dialog.open(EditDeckNameDialogComponent, {
      width: '350px',
      data: { name: deck.name }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        deck.name = result;

        this.deckService.updateDeck(deck).subscribe(updatedDeck => {
          if (updatedDeck) {
            Swal.fire({
              title: 'Sucesso!',
              text: 'Nome do baralho atualizado com sucesso!',
              icon: 'success',
              confirmButtonText: 'OK'
            });
          } else {
            Swal.fire({
              title: 'Erro!',
              text: 'Erro ao atualizar o nome do baralho: nome já existente',
              icon: 'error',
              confirmButtonText: 'OK'
            });
          }
        });
      }
    });
  }


public onAddDeck(deck: Deck): void {
  console.log('Criando Baralho:');

  const dialogRef = this.dialog.open(DeckFormComponent, {
    width: '350px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      deck.name = result;

      this.deckService.updateDeck(deck).subscribe(updatedDeck => {
        if (updatedDeck) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Nome do baralho atualizado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Erro ao atualizar o nome do baralho: nome já existente',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
}


public onAddCard(deck: Deck): void {
  console.log('Adicionando Carta:');

  const dialogRef = this.dialog.open(CardAddComponent, {
    width: '350px',
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      deck.name = result;

      this.deckService.updateDeck(deck).subscribe(updatedDeck => {
        if (updatedDeck) {
          Swal.fire({
            title: 'Sucesso!',
            text: 'Carta adicionada ao baralho com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            title: 'Erro!',
            text: 'Erro ao adicionar a carta ao baralho: nome já existente',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });
    }
  });
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


public onDelete(deck: Deck): void {
  Swal.fire({
    title: 'Você tem certeza?',
    text: `Você quer deletar o baralho ${deck.name} com ID: ${deck.id}?`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sim, deletar!',
    cancelButtonText: 'Não, cancelar!'
  }).then((result) => {
    if (result.isConfirmed) {
      this.isLoading = true;

      // Simulando uma chamada ao serviço para deletar o baralho
      setTimeout(() => {
        this.deckService.deleteDeck(deck.id);

        const index = this.decks.indexOf(deck);
        if (index > -1) {
          this.decks.splice(index, 1);
        }

        this.isLoading = false;
        Swal.fire(
          'Deletado!',
          `Baralho ${deck.name} com ID: ${deck.id} deletado com sucesso!`,
          'success'
        );
      }, 500);
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Cancelado',
        'O baralho está seguro :)',
        'error'
      );
    }
  });
}


public onPreviousPage(): void {
  if (this.paginator.hasPreviousPage()) {
    this.paginator.previousPage();
    console.log('Página anterior');
  } else {
    console.log('Você está na primeira página');
  }
}

public onNextPage(): void {
  if (this.paginator.hasNextPage()) {
    this.paginator.nextPage();
    console.log('Próxima página');
  } else {
    console.log('Você está na última página');
  }
 }
}

