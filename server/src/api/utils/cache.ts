import { logger } from "../../utils/logger";
import { Request } from "./request";

type CacheType = { [id: string]: any };

const MAX_CACHE_AGE = 8 * 60 * 60 * 1000; // 8 hours
const cache: CacheType = {};

export class Cache {
  private fullUri: string;

  constructor(request: Request) {
    this.fullUri = request.getFullUri().toLowerCase();
  }

  public set(data: any) {
    cache[this.fullUri] = data;
    logger.write(`Cache for "${this.fullUri}" was set!`);

    setTimeout(() => {
      cache[this.fullUri] = null;
      logger.write(`Cache for "${this.fullUri}" was cleared!`);
    }, MAX_CACHE_AGE);
  }

  public isExists() {
    return !!cache[this.fullUri];
  }

  public getData<Data extends {}>(): Data {
    return cache[this.fullUri];
  }
}