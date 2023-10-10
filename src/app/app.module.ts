import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AppComponent } from './app.component';
import { CardComponent } from './components/card/card.component';
import { AppRoutingModule } from './app-routing.module';
import { HeaderComponent } from './components/header/header.component';
import { DeckDetailsComponent } from './components/deck-details/deck-details.component';
import { DeckFormComponent } from './components/deck-form/deck-form.component';
import { DecksListComponent } from './components/decks-list/decks-list.component';
import { DeckEditComponent } from './components/deck-edit/deck-edit.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { CardSelectorComponent } from './components/card-selector/card-selector.component';
import { CardAddComponent } from './components/card-add/card-add.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { EditDeckNameDialogComponent } from './components/edit-deck-name-dialog/edit-deck-name-dialog.component';
import { PlayGameComponent } from './components/play-game/play-game.component';
import { PlayerAIComponent } from './components/player-ai/player-ai.component';
import { PlayerUserComponent } from './components/player-user/player-user.component';
import { GameBoardComponent } from './components/game-board/game-board.component';


@NgModule({
  declarations: [
    AppComponent,
    CardComponent,
    HeaderComponent,
    DeckDetailsComponent,
    DeckFormComponent,
    DecksListComponent,
    DeckEditComponent,
    CardSelectorComponent,
    CardAddComponent,
    EditDeckNameDialogComponent,
    PlayGameComponent,
    PlayerAIComponent,
    PlayerUserComponent,
    GameBoardComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    DragDropModule,


  ],

  entryComponents: [
    EditDeckNameDialogComponent
  ],


  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
