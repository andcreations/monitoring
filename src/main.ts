import * as fs from 'fs';
import * as path from 'path';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { MainModule } from './MainModule';

/** */
function getHTTPSOptions(): any {
  const certFile = process.env.MONITORING_DISPATCHER_HTTPS_CERT_FILE;
  const keyFile = process.env.MONITORING_DISPATCHER_HTTPS_KEY_FILE;

  if (certFile && keyFile) {
    if (!fs.existsSync(certFile)) {
      throw new Error(`HTTPS certificate file ${certFile} not found`);
    }
    if (!fs.existsSync(keyFile)) {
      throw new Error(`HTTPS key file ${keyFile} not found`);
    }
    console.log(`Reading certificate from ${path.resolve(certFile)}`);
    console.log(`Reading key from ${path.resolve(keyFile)}`);

    return {
      cert: fs.readFileSync(certFile),
      key: fs.readFileSync(keyFile),
    }
  }
}

/** */
async function bootstrap() {
  const app: NestExpressApplication = await NestFactory
    .create<NestExpressApplication>(
      MainModule,
      { httpsOptions: getHTTPSOptions() },
    );

// configure
  app.enableShutdownHooks();

// listen
  const port = +process.env.MONITORING_DISPATCHER_HTTP_PORT || 8080;
  console.log(`Starting HTTP(s) server on port ${port}`);
  await app.listen(port);
}

bootstrap()
  .catch((error) => {
    console.error('Failed to bootstrap', error);
  });