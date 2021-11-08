import {CacheHandlerStrategy} from "../interfaces/cache-handler-strategy";
import {HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {RequestSelectorStrategy} from "@anexia/ngx-interceptor-tools";
import {map, switchMap, tap} from "rxjs/operators";
import {StorageRecordDto} from "../interfaces/storage-record-dto";

export class LocalStorageCacheHandler implements CacheHandlerStrategy {

  public constructor(
    public expiresInMillis: number = 0,
    public selector: RequestSelectorStrategy,
    private storage: Storage = window.localStorage
  ) {
  }

  public delete(request: HttpRequest<any>): Observable<string> {
    return of(this.selector(request)).pipe(tap(selector => this.storage.removeItem(selector)));
  }

  public get(request: HttpRequest<any>): Observable<any> {
    return this._get(request).pipe(map(record => {
      if(typeof record === 'boolean') {
        return [];
      }
      return record.payload;
    }))
  }

  public has(request: HttpRequest<any>): Observable<boolean> {
    return this.get(request).pipe(map(result => Boolean(result)));
  }

  public isExpired(request: HttpRequest<any>): Observable<boolean> {
    return this._get(request).pipe(
      map(record => {
        if(typeof  record === 'boolean') {
          return false;
        }

        if(this.expiresInMillis === 0) {
          return false;
        }

        const now = new Date().getTime();
        return now > record.ttl;
      })
    )
  }

  public set(request: HttpRequest<any>, response: HttpResponse<any>): Observable<any> {
    return of(this.selector(request)).pipe(
      tap (selector => {
        const ttl = new Date().getTime() + this.expiresInMillis;
        const recordDto: StorageRecordDto = {
          ttl,
          payload: response.body
        };
        const serializedDto = JSON.stringify(recordDto);
        this.storage.setItem(selector, serializedDto);
      })
    )
  }

  private _get(request: HttpRequest<any>): Observable<StorageRecordDto | boolean> {
    return of(this.storage.getItem(this.selector(request))).pipe(
      switchMap(result => {
        if(!result) {
          return of(false);
        }
        return of(JSON.parse(result) as StorageRecordDto);
      })
    );
  }


}
