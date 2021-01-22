import { TestBed } from '@angular/core/testing';

import { PublicGuard } from './public.guard';

describe('MainGuard', () => {
  let guard: PublicGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PublicGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
