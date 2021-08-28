// noinspection SqlResolve

import express, {Request, Response} from 'express';
import path from 'path';
import pino, {Logger} from 'pino';

import * as rq_mysql from 'remotequery-ts-mysql'
import {Config as RqConfig, Dataservice, Request as RqRequest, run as rqRun} from 'remotequery-ts'


// -------------------firing express app
const app = express();
run().then(() => console.log('STARTED'));

async function run() {

  app.use(express.json());
  app.use(express.urlencoded({extended: false}));
  app.use(express.static(path.join(__dirname, 'client/build')));

  rq_mysql.init({user: 'foo', password: 'bar', host: 'localhost', database: 'eventdb'})
  //console.log(dbpool)

  const res: any = await rq_mysql.processSql('select * from T_APP_PROPERTIES', {}, 100)

  console.log('res', res.hasMore)
  console.log('header', res.header.toString());


  //
  // INIT REMOTEQUERY
  //

  let rqLogger: Logger = pino({
    level: 'info',
    prettyPrint: {
      colorize: true
    }
  });
  Dataservice.processSql = rq_mysql.processSql;
  RqConfig.getServiceEntrySql = 'select * from T_SERVICE where SERVICE_ID = :serviceId';
  RqConfig.saveServiceEntry = 'saveService';
  RqConfig.logger = rqLogger;

  const request: RqRequest = {serviceId: 'appProperties.select', parameters: {}, userId: 'toni', roles: ['ADMIN']}
  const result = await rqRun(request)

  console.log(result)


// -------------------routes
  app.get('/home', (request: Request, response: Response) => {
    console.log(request.url)
    response.json({message: `Welcome to the home page!`})
  });


// --------------------Listen
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on PORT ${PORT}`);
  })

}
