import { TestBed } from '@angular/core/testing';

import { WebServiceCacheInterceptor } from './web-service-cache.interceptor';
import {CACHE_STRATEGY} from "../tokens/cache-strategy";

describe('WebServiceCacheInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [WebServiceCacheInterceptor,
      {provide: CACHE_STRATEGY, useValue: {}}],
  }));

  it('should be created', () => {
    const interceptor: WebServiceCacheInterceptor = TestBed.inject(WebServiceCacheInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
