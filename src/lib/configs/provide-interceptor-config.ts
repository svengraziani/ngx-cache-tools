import {Provider} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";
import {WebServiceCacheInterceptor} from "../interceptors/web-service-cache.interceptor";


export function provideInterceptorConfig(): Provider {
  return {provide: HTTP_INTERCEPTORS, useExisting: WebServiceCacheInterceptor, multi: true}
}
