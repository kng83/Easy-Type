import { Express, RequestParamHandler, Router } from "express";
import * as bodyParser from "body-parser";
import express from "express";
import morgan, { FormatFn } from "morgan";
import { log } from "../../config/app.config";
import { ApplicationRequestHandler } from "express-serve-static-core";
import * as path from "path";


/*EXAMPLE
*   .setPort(process.env.port)
    .useBodyParser()
    .useLogger("short")
    .useStaticPage(path.join(__dirname, '../../plc-app'))
    .useErrorMiddleware()
    .useCors()
    .getDefaultRoute()
    .unmount();
* */
export class AppCreator {
  //  private router: Router; // = express.Router();
  pagePath: string;

  static mountApp(app: Express, router: Router) {
    return new AppCreator(app, router);
  }

  constructor(private app: Express, private router: Router) {
  }

  //* [1] Set port of application*/
  setPort(port?: any) {
    this.app.set("port", port || 3000);
    return this;
  }

  /* [2] Set body parser of application*/
  useBodyParser() {
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(bodyParser.json());
    return this;
  }

  /* [3] Mount morgan as default logger */
  useLogger(format?: ("tiny" | "dev" | "combined" | "short" | "common" | any)) {
    this.app.use(morgan(format || "tiny", { stream: log.superStream }));
    return this;
  }

  //
  /* [4] User static page for angular
  * //example path.join(__dirname, "../../plc-app")
  * */
  useStaticPage(pagePath: string) {
    this.pagePath = path.join(path.resolve(), pagePath);
    this.app.use(express.static(this.pagePath));
    return this;
  }


  //*****Default route and middlewares handler *****///

  /* [5] First error catch */
  useErrorMiddleware() {
    this.app.use(function (err, req, res, next) {
      if (err instanceof Error) {
        log.warn(err.message);
        res.status(400).json({ err: "err" });
        next();
      }
    });
    return this;
  }

  /* [6] Handle cors*/
  useCors(corsRes?: (ApplicationRequestHandler<RequestParamHandler> | any)) {

    this.app.use(corsRes || ((req, res, next) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      res.setHeader("Access-Control-Allow-Methods", "POST, GET, PATCH, DELETE, OPTIONS");
      next();
    }));
    return this;
  }

  /* [7] Router must go before default route*/
  useRouter() {
    this.app.use("/api", this.router);
    return this;
  }

  /* [8] Use this as default route when path not specific take from staticPath
   App is used here because router is used for query
   */
  getDefaultRoute(path?: string, filename?: string) {
    this.app.get("/**", (req, res) => {
      res.sendFile(filename || "index.html", {
        root: path || this.pagePath
      });
    });
    return this;
  }


  /* [9] */
  unmount() {
    return { app: this.app, router: this.router };
  }


}
