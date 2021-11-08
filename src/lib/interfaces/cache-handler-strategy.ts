import {HttpRequest, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

export interface CacheHandlerStrategy {
  has(request: HttpRequest<any>): Observable<boolean>;

  set(request: HttpRequest<any>, response: HttpResponse<any>): Observable<any>;

  get(request: HttpRequest<any>): Observable<any>;

  delete(request: HttpRequest<any>): Observable<string>;

  isExpired(request: HttpRequest<any>): Observable<boolean>;

}
