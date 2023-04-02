import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { UsersService } from './users/users.service';
import { RegisterUserDto } from './users/dto/register-user.dto';

const { format } = winston;

const logsDir = process.env.LOGS_DIR || '../logs/';

const enumerateErrorFormat = format((info) => {
  if (info.message instanceof Error) {
    info.message = Object.assign(
      {
        message: info.message.message,
        stack: info.message.stack,
      },
      info.message,
    );
  }

  if (info instanceof Error) {
    return Object.assign(
      {
        message: info.message,
        stack: info.stack,
      },
      info,
    );
  }

  return info;
});

async function seed(usersService: UsersService) {
  const username = process.env.SEED_USERNAME;
  const aUser = await usersService.findOne(username);

  if (!aUser) {
    const password = process.env.SEED_PASSWORD;
    const user = {
      username,
      password,
      repeatedPassword: password,
    } as RegisterUserDto;

    await usersService.create(user);
  }
}

async function bootstrap() {
  const instance = winston.createLogger({
    exitOnError: false,
    level: 'info',
    format: format.combine(
      winston.format.timestamp(),
      enumerateErrorFormat(),
      format.json(),
    ),
    defaultMeta: { service: 'walletstash-dca-server' },
    transports: [
      new winston.transports.Console({
        handleExceptions: true,
      }),
      //
      // - Write all logs with importance level of `error` or less to `error.log`
      // - Write all logs with importance level of `info` or less to `combined.log`
      //
      new winston.transports.File({
        filename: logsDir + 'error.log',
        level: 'error',
        handleExceptions: true,
      }),
      new winston.transports.File({ filename: logsDir + 'combined.log' }),
    ],
  });

  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  });
  app.setGlobalPrefix('api');

  const usersService = app.get(UsersService);
  await seed(usersService);

  await app.listen(3000);
}

bootstrap();
