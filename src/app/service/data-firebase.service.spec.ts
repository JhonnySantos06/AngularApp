import { TestBed } from '@angular/core/testing';

import { DataFirebaseService } from './data-firebase.service';

describe('DataFirebaseService', () => {
  let service: DataFirebaseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataFirebaseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
