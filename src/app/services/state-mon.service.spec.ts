import { TestBed } from '@angular/core/testing';

import { StateMonService } from './state-mon.service';

describe('StateMonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StateMonService = TestBed.get(StateMonService);
    expect(service).toBeTruthy();
  });
});
