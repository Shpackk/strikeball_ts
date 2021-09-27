import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './middleware/excepionHanlder';
import { resolve } from 'path'
import { NestExpressApplication } from '@nestjs/platform-express';


async function bootstrap() {
  const PORT = process.env.PORT || 3000
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(resolve('./src/static'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(PORT, () => {
    console.log(`OMG WE ARE LIVE ON ${PORT}`)
  });
}
bootstrap();
