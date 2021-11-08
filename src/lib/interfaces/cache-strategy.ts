import {RequestMatchStrategy} from "@anexia/ngx-interceptor-tools";
import {CacheHandlerStrategy} from "./cache-handler-strategy";

export type CacheStrategies = CacheStrategy[];

export interface CacheStrategy {
  /**
   * Strategy to detect request.
   */
  matcher: RequestMatchStrategy;
  /**
   * Strategy to store request.
   */
  handler: CacheHandlerStrategy;
}
