import {Inject, Injectable} from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpInterceptor, HttpResponse, HttpHeaders
} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {CacheStrategies, CacheStrategy} from "../interfaces/cache-strategy";
import {CACHE_STRATEGY} from "../tokens/cache-strategy";
import {map, shareReplay, switchMap} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class WebServiceCacheInterceptor implements HttpInterceptor {
  public constructor(@Inject(CACHE_STRATEGY) private readonly strategies: CacheStrategies) {}

  public intercept(request: HttpRequest<unknown>, delegate: HttpHandler): Observable<any> {

    if (!this.strategies) {
      return delegate.handle(request);
    }
    // run cache strategy matcher against request
    const matchingStrategies = this.strategies.filter(matchStrategy => matchStrategy.matcher.match(request));

    // if no cache strategy matches
    if (matchingStrategies.length === 0) {
      return delegate.handle(request);
    }

    if (matchingStrategies.length > 1) {
      console.error('more than one Caching Strategy is matching the request.', request, matchingStrategies);
      throw new Error('CACHE_CONFIGURATION_ERROR');
    }

    const strategy = matchingStrategies.pop() as CacheStrategy;
    const handler = strategy.handler;
    return handler.has(request).pipe(
      switchMap(isStored => {
        if (isStored) {
          return handler.isExpired(request).pipe(map(isExpired => !isExpired));
        }
        return of(false);
      }),
      shareReplay(1),
      switchMap(isValid => {
        if (isValid) {
          return handler.get(request).pipe(
            map(responseBody => {
              return new HttpResponse({
                headers: new HttpHeaders(),
                status: 304,
                url: request.url,
                body: responseBody
              });
            })
          );
        } else {
          return delegate.handle(request).pipe(
            switchMap(event => {
              if (event instanceof HttpResponse) {
                return handler.set(request, event).pipe(switchMap(() => of(event)));
              }
              return of(event);
            })
          );
        }
      })
    );
  }
}
