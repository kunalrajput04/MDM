import { TestBed } from '@angular/core/testing';

import { CommunicationmeterService } from './communicationmeter.service';

describe('CommunicationmeterService', () => {
  let service: CommunicationmeterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationmeterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
