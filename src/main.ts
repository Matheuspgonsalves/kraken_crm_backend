import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as functions from 'firebase-functions';
import { Express } from 'express';
import { INestApplication } from '@nestjs/common';

let cachedApp: INestApplication<any>;

async function bootstrap() {
  if (!cachedApp) {
    const app = await NestFactory.create(AppModule);
    await app.init();
    cachedApp = app;
  }

  return cachedApp;
}

export const serverless = functions.https.onRequest(async (req, res) => {
  const app = await bootstrap();
  const instance = app.getHttpAdapter().getInstance() as Express;
  instance(req, res);
});
