import {LocalStorageCacheHandler} from "./local-storage-cache-handler";
import {RequestSelectorStrategy} from "@anexia/ngx-interceptor-tools";
import {HttpRequest, HttpResponse} from "@angular/common/http";
import {Subscription} from "rxjs";
import {subscribeSpyTo} from "@hirez_io/observer-spy";
import {map, switchMap} from "rxjs/operators";


describe('LocalStorageCacheHandler', () => {

  let cacheHandler: LocalStorageCacheHandler;
  let selector: RequestSelectorStrategy;
  let fakeRequest: HttpRequest<any>;
  let fakeResponse: HttpResponse<any>;
  let subscription: Subscription;

  it('should be created', () => {
    selector = (request: HttpRequest<any>) => request.url;
    cacheHandler = new LocalStorageCacheHandler(0, selector, window.localStorage);
    expect(cacheHandler).toBeTruthy();
  })


  it('should allow to store a request and retrieve', () => {
    selector = () => 'ABC';
    cacheHandler = new LocalStorageCacheHandler(0, selector);
    fakeRequest = new HttpRequest('GET', 'ABC');
    fakeResponse = new HttpResponse({body: {helloMars: true}});

    expect(subscribeSpyTo(cacheHandler.set(fakeRequest,fakeResponse).pipe(
      switchMap(_ => cacheHandler.get(fakeRequest))
    )).getFirstValue()
    ).toEqual({helloMars: true});

  })

  it('should allow to delete a stored request', () => {
    selector = () => 'CBA';
    cacheHandler = new LocalStorageCacheHandler(0, selector);
    fakeRequest = new HttpRequest('GET', 'CBA');
    fakeResponse = new HttpResponse({body: {'helloMars': true}});

    expect(subscribeSpyTo(cacheHandler.set(fakeRequest, fakeResponse).pipe(
      switchMap(_ => cacheHandler.delete(fakeRequest))
    )).getFirstValue()).toEqual('CBA');

  })

  it('should find existing entry', () => {
    selector = () => 'YWZ';
    cacheHandler = new LocalStorageCacheHandler(0, selector);
    fakeRequest = new HttpRequest('GET', 'YWZ');
    fakeResponse = new HttpResponse({body: {'helloMars': true}});

    expect(
      subscribeSpyTo(cacheHandler.set(fakeRequest, fakeResponse)
        .pipe(
          switchMap(_ => cacheHandler.has(fakeRequest))
        )).getFirstValue()
    ).toBeTruthy();

  })

  it('should detect expired entry', () => {
    selector = () => 'EDF';
    cacheHandler = new LocalStorageCacheHandler(-1000, selector);
    fakeRequest = new HttpRequest('GET', 'EDF');
    fakeResponse = new HttpResponse({body: {'helloMars': true}});

    expect(
      subscribeSpyTo(cacheHandler.set(fakeRequest, fakeResponse)
        .pipe(
          switchMap(_ => cacheHandler.isExpired(fakeRequest))
        )).getFirstValue()
    ).toBeTruthy()

  })


})
