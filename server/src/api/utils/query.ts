import { Context } from "koa";
import { ParsedUrlQuery } from "querystring";

export class Query {
  private context: Context;

  constructor(context: Context) {
    this.context = context;
  }
 
  public getFieldAsString(fieldName: string): string {
    const parsedQuery = this.getParsedQuery();
    const fieldValue = parsedQuery[fieldName];

    if (fieldValue !== undefined) {
      if (fieldValue instanceof Array) return fieldValue.join("");
      return fieldValue;
    }

    return "";
  }

  private getParsedQuery(): ParsedUrlQuery {
    return this.context.query;
  }
}