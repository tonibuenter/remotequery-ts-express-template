// noinspection SqlResolve

import express, {Request, Response} from 'express';
import path from 'path';
import {isExceptionResult, RemoteQuery, Request as RqRequest, Result as RqResult} from 'remotequery-ts';
import {init} from "./init";
import {initServices} from "./init-services";


// -------------------firing express app
const app = express();
run().then(() => console.log('STARTED'));
let rq: RemoteQuery;

async function run() {

  rq = await init();
  await initServices(rq)
  const driver = rq.driver;
  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(express.static(path.join(__dirname, 'client/build')));


  const res: RqResult = await driver.processSql('select * from T_APP_PROPERTIES', {});

  if (isExceptionResult(res)) {
    console.log(`Exception: ${res.exception}`)
  } else {
    console.log('res', res.hasMore)
    console.log('header', res.header?.toString());
  }


  //
  // INIT REMOTEQUERY
  //


  const request: RqRequest = {serviceId: 'appProperties.select', parameters: {}, userId: 'toni', roles: ['ADMIN']}
  const result = (await rq.run(request)).list()

  console.log(result)


// -------------------routes
  app.get('/home', (_request: Request, response: Response) => {
    console.log(_request.url)
    response.json({message: `Welcome to the home page!`})
  });


// --------------------Listen
  const PORT = process.env.PORT || 5051;
  app.listen(5051, () => {
    console.log(`Server running on PORT ${PORT}`);
  })

}
