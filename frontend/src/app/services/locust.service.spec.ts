import { TestBed } from '@angular/core/testing';

import { LocustService } from './locust.service';

describe('LocustService', () => {
  let service: LocustService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LocustService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
