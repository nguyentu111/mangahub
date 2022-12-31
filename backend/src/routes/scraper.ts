const puppeteer = require("puppeteer-extra");
const { executablePath } = require("puppeteer");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
// const Koa = require("koa");
// const bodyParser = require("koa-bodyparser");
// const app = new Koa();
// app.use(bodyParser());
// const jsesc = require("jsesc");
import { Express } from "express";
const headersToRemove = [
  "host",
  "user-agent",
  "accept",
  "accept-encoding",
  "content-length",
  "forwarded",
  "x-forwarded-proto",
  "x-forwarded-for",
  "x-cloud-trace-context",
];
const responseHeadersToRemove = [
  "Accept-Ranges",
  "Content-Length",
  "Keep-Alive",
  "Connection",
  "content-encoding",
  "set-cookie",
];
let appCache: Express;
const scraper = async (app: Express) => {
  let options = {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    executablePath: executablePath(),
  };
  if (!appCache?.use) appCache = app;
  // if (process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD)
  //   options.executablePath = "/usr/bin/chromium-browser";
  // if (process.env.PUPPETEER_HEADFUL) options.headless = false;
  // if (process.env.PUPPETEER_USERDATADIR)
  //   options.userDataDir = process.env.PUPPETEER_USERDATADIR;
  // if (process.env.PUPPETEER_PROXY)
  //   options.args.push(`--proxy-server=${process.env.PUPPETEER_PROXY}`);
  console.log(app.use);
  const browser = await puppeteer.launch(options);
  appCache.use("scraper", async (req, res) => {
    console.log("scrapping ...");
    if (req.query.url) {
      const url: string = (req.query.url as string).replace("/?url=", "");
      let responseBody;
      let responseData;
      let responseHeaders: any;
      const page = await browser.newPage();
      if (req.method == "POST") {
        await page.removeAllListeners("request");
        await page.setRequestInterception(true);
        page.on("request", (interceptedRequest: any) => {
          var data = {
            method: "POST",
            // postData: ctx.request.rawBody,
            postData: req.body,
          };
          interceptedRequest.continue(data);
        });
      }
      const client = await page.target().createCDPSession();
      await client.send("Network.setRequestInterception", {
        patterns: [
          {
            urlPattern: "*",
            resourceType: "Document",
            interceptionStage: "HeadersReceived",
          },
        ],
      });

      await client.on(
        "Network.requestIntercepted",
        async (e: {
          interceptionId: any;
          isDownload: any;
          responseHeaders: any;
        }) => {
          let obj = { interceptionId: e.interceptionId };
          if (e.isDownload) {
            await client
              .send("Network.getResponseBodyForInterception", {
                interceptionId: e.interceptionId,
              })
              .then(
                (result: {
                  base64Encoded: any;
                  body:
                    | WithImplicitCoercion<string>
                    | { [Symbol.toPrimitive](hint: "string"): string };
                }) => {
                  if (result.base64Encoded) {
                    responseData = Buffer.from(result.body, "base64");
                  }
                }
              );
            //@ts-ignore
            obj["errorReason"] = "BlockedByClient";
            responseHeaders = e.responseHeaders;
          }
          await client.send("Network.continueInterceptedRequest", obj);
          if (e.isDownload) await page.close();
        }
      );
      let headers = req.headers;
      headersToRemove.forEach((header) => {
        delete headers[header];
      });
      await page.setExtraHTTPHeaders(headers);
      try {
        let response;
        let tryCount = 0;
        response = await page.goto(url, {
          timeout: 30000,
          waitUntil: "domcontentloaded",
        });
        responseBody = await response.text();
        responseData = await response.buffer();
        while (responseBody.includes("challenge-running") && tryCount <= 10) {
          const newResponse = await page.waitForNavigation({
            timeout: 30000,
            waitUntil: "domcontentloaded",
          });
          if (newResponse) response = newResponse;
          responseBody = await response.text();
          responseData = await response.buffer();
          tryCount++;
        }
        responseHeaders = await response.headers();
        const cookies = await page.cookies();
        if (cookies)
          cookies.forEach(
            (cookie: {
              [x: string]: any;
              name: any;
              value: any;
              secure?: any;
              expires?: any;
              domain?: any;
            }) => {
              const { name, value, secure, expires, domain, ...options } =
                cookie;
              req.cookies.set(cookie.name, cookie.value, options);
            }
          );
      } catch (error) {
        //@ts-ignore
        if (!error.toString().includes("ERR_BLOCKED_BY_CLIENT")) {
          // ctx.status = 500;
          // ctx.body = error;
          console.log("ERR_BLOCKED_BY_CLIENT");
        }
      }

      await page.close();
      responseHeadersToRemove.forEach(
        (header) => delete responseHeaders[header]
      );
      Object.keys(responseHeaders).forEach((header) => {
        // ctx.set(header, jsesc(responseHeaders[header]))
      });
      // ctx.body = responseData;
      return res.json({ data: responseData });
    } else {
      return res.json({
        error: "Please specify the URL in the 'url' query string.",
      });
      // ctx.body = "Please specify the URL in the 'url' query string.";
    }
  });
  // app.listen(process.env.PORT || 3000);
};
export default scraper;
