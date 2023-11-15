import axios from "axios";
import { Cache } from "./cache";

export class Request {
  private uri: string;
  private params?: any;
  private fullUri: string;

  constructor(uri: string, params?: any) {
    this.uri = uri;
    this.params = params;
    this.fullUri = this.uri + JSON.stringify(this.params);
  }

  public async get<Data extends {}>(): Promise<Data> {
    const requestCache = this.getCache();

    if (requestCache.isExists()) {
      return requestCache.getData();
    }

    await this.cacheData();
    return requestCache.getData();
  }

  private async cacheData(): Promise<void> {
    const request = await axios.get(this.uri, { params: this.params });
    const requestData = request.data;
    const requestCache = this.getCache();
    requestCache.set(requestData);
  }

  private getCache(): Cache {
    return new Cache(this);
  }

  public getFullUri(): string {
    return this.fullUri;
  }
}