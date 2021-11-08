import { TestBed } from '@angular/core/testing';

import { WebServiceCacheInterceptor } from './web-service-cache.interceptor';

describe('WebServiceCacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WebServiceCacheInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: WebServiceCacheInterceptor = TestBed.inject(WebServiceCacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
