import https from "https";
import Koa, { Context, Next } from "koa";
import KoaRouter from "@koa/router";
import { readFileSync } from "fs";
import { groups } from "./api/groups";
import { Query } from "./api/utils/query";
import { teachers } from "./api/teachers";
import { logger } from "./utils/logger";

class Main {
  private SERVER_PORT = 443; // default HTTPS port
  private SERVER_API_PATH = "/timetable/"

  private SSL_CERTIFICATE_PATH = "ssl/client-cert.pem";
  private SSL_KEY_PATH = "ssl/client-key.pem";

  private SSL_CERTIFICATE_BUFFER = readFileSync(this.SSL_CERTIFICATE_PATH);
  private SSL_KEY_BUFFER = readFileSync(this.SSL_KEY_PATH);

  private SERVER_OPTIONS: https.ServerOptions = {
    cert: this.SSL_CERTIFICATE_BUFFER,
    key: this.SSL_KEY_BUFFER
  }

  private server: Koa;
  private router: KoaRouter;

  constructor() {
    this.server = new Koa();
    this.router = new KoaRouter({ prefix: this.SERVER_API_PATH });
  }

  public launch() {
    this.listenSearchRoutes();
    this.listenScheduleRoutes();
    this.createServer();
    
    logger.write(`HTTPS Server was succesfully created at port ${this.SERVER_PORT}!`);
  }

  // api.u2029102.info/timetable/searchGroup?text=...
  private listenSearchRoutes() {
    this.router.get("searchGroup", async (context) => {
      const query = new Query(context);
      const groupName = query.getFieldAsString("groupName");
      const searchResult = await groups.search(groupName);
      context.body = searchResult;
    });

    this.router.get("searchTeacher", async (context) => {
      const query = new Query(context);
      const teacherName = query.getFieldAsString("teacherName");
      const searchResult = await teachers.search(teacherName);
      context.body = searchResult;
    });
  }

  // api.u2029102.info/timetable/getGroup?id=...
  private listenScheduleRoutes() {
    this.router.get("getGroupSchedule", async (context) => {
      const query = new Query(context);
      const groupId = query.getFieldAsString("groupId");
      const groupSchedule = await groups.getSchedule(groupId);
      context.body = groupSchedule;
    });

    this.router.get("getTeacherSchedule", async (context) => {
      const query = new Query(context);
      const teacherId = query.getFieldAsString("teacherId");
      const teacherSchedule = await teachers.getSchedule(teacherId);
      context.body = teacherSchedule;
    });
  }

  private createServer() {
    this.server
      .use(this.log)
      .use(this.setHeaders)
      .use(this.router.routes())
      .use(this.router.allowedMethods());

    https.createServer(
      this.SERVER_OPTIONS,
      this.server.callback()
    ).listen(this.SERVER_PORT);
  }

  private async log(context: Context, next: Next) {
    const request = context.request;
    const requestIp = request.ip;
    const requestPath = request.path;
    const requestQueryString = request.querystring;

    const logMessage = `Ip "${requestIp}" just requested "${requestPath}" query: "${requestQueryString}"`;
    logger.write(logMessage);

    await next();
  }

  private async setHeaders(context: Context, next: Next) {
    context.set("Content-Type", "application/json");
    context.set("Access-Control-Allow-Origin", "*");
    await next();
  }
}

const main = new Main();
main.launch();