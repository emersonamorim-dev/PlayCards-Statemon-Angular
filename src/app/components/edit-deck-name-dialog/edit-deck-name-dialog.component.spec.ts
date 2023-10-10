import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditDeckNameDialogComponent } from './edit-deck-name-dialog.component';

describe('EditDeckNameDialogComponent', () => {
  let component: EditDeckNameDialogComponent;
  let fixture: ComponentFixture<EditDeckNameDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditDeckNameDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeckNameDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
