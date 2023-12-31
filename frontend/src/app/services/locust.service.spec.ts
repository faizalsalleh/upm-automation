import { TestBed } from '@angular/core/testing';
import { LocustService } from './locust.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('LocustService', () => {
  let service: LocustService;
  let httpMock: HttpTestingController;
  const testBaseUrl = '/api'; // Updated to use the '/api' prefix

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LocustService]
    });
    service = TestBed.inject(LocustService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isTestRunning should return true if the test is running', () => {
    service.isTestRunning().subscribe(running => {
      expect(running).toBeTrue();
    });

    const req = httpMock.expectOne(`${testBaseUrl}/test_status`);
    expect(req.request.method).toBe('GET');
    req.flush({ running: true });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
