import {InjectionToken} from "@angular/core";
import {CacheStrategy} from "../interfaces/cache-strategy";

export const CACHE_STRATEGY = new InjectionToken<CacheStrategy>('cache strategy provider');
