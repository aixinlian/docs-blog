#### Nest

```js
params是路径参数
query是查询参数
body是请求体
```

#### 开始

```js
// 安装脚手架
npm install -g @nestjs/cli

// 创建项目
nest new 项目名

//查看所有命令
nest --help

//新建模块
nest g resource 模块名
```

#### 常见的路由装饰器

```js
@get()
@Post()
@Get(':id')
@HttpCode()

// 参数
@Request()
@Query()
@Body()
@Param()
@Headers()
```

#### Session

```js
//nest底层都是由express实现的，所以也支持express的插件
// 安装依赖
npm install express-session --save
//安装声明依赖
npm install @types/express-session -D
//main.ts引入
import * as session from 'express-session';
  app.use(
    session({
      secret: 'xiaosong',
      rolling: true,
      name: 'xiaosong.sid',
      cookie: { maxAge: null },
    }),
  );

//配置项
//secret 生成服务端session 签名 可以理解为加盐
//name 生成客户端cookie 的名字 默认 connect.sid
//rolling	在每次请求时强行设置 cookie，这将重置 cookie 过期时间，默认:false
//cookie 设置往前端传的信息，配置项 maxAge(过期时间)，httpOnly(是否可以被修改，默认true)
```

#### 图片验证码

```js
//安装依赖
npm install svg-captcha --save
//使用时引入
import * as svgCaptcha from 'svg-captcha';

  @Get('code')
  createCode(@Req() req, @Res() res, @Session() session) {
    const Captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 100,
      background: '#cc9966',
    });
    session.code = Captcha.text;
    res.type('image/svg+xml');
    res.send(Captcha.data);
  }

  @Post('register')
  createUser(@Body() body, @Session() session) {
    if (session.code.toLocaleLowerCase() === body?.code?.toLocaleLowerCase()) {
      return {
        code: 200,
        message: '验证通过',
      };
    } else {
      return {
        code: 500,
        message: {
          session: session.code,
          body: body.code,
        },
      };
    }
  }

```

#### nestjs 模块

```js
//新建模块
nest g resource list

// app.controller.ts中引入ListService
import { ListService } from './list/list.service';
//在constructor中注入ListService
  constructor(
    private readonly appService: AppService,
    private readonly ListService: ListService,
  ) {}

//这时会报错，因为ListService不是一个共享模块，如果要使用，需要在list.module.ts中导出
@Module({
  controllers: [ListController],
  providers: [ListService],
  exports: [ListService],//导出，使ListService成为共享模块
})
```

##### 全局模块

:::info
像上面导出模块，一个一个导出，相同的，也可以直接全局导出

跟 app.vue 一样，全局注册模块
:::

```js
//新建文件 src/config/config.module.ts

import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  providers: [
    {
      provide: 'Config',
      useValue: { baseUrl: '/api' },
    },
  ],
  exports: [
    {
      provide: 'Config',
      useValue: { baseUrl: '/api' },
    },
  ],
})
export class ConfigModule {}

//app.module.ts中引入
import { ConfigModule } from './config/config.module';

@Module({
  imports: [DemoModule, UserModule, ListModule, ConfigModule],
  controllers: [AppController, DemoController],
  providers: [AppService],
})

//在app.controller.ts中使用
  constructor(
    private readonly listService: ListService,
    @Inject('Config') private readonly base: any,
  ) {}

    @Get()
  findAll() {
    return this.base;
  }
```

##### 全局模块的动态参数

```js
//config.module.ts
import { Global, Module, DynamicModule } from '@nestjs/common'

interface Options {
  path: string;
}

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: Options): DynamicModule {
    return {
      module: ConfigModule,
      providers: [
        {
          provide: 'Config',
          useValue: { baseUrl: '/api' + options.path },
        },
      ],
      exports: [
        {
          provide: 'Config',
          useValue: { baseUrl: '/api' + options.path },
        },
      ],
    }
  }
}

//app.module.ts中引入
ConfigModule.forRoot({ path: '/xiaosong' })
// 在使用时已经动态添加上了
```

#### nestjs 中间件

```js
//命令
nest g middleware logger
然后在中间件的next()上面输出日志console.log('我来了 嘿嘿嘿')

//比如说要拦截user路由
//user.module.ts中
import { Logger } from 'src/logger';

export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(Logger).forRoutes('user');
      // consumer.apply(Logger).forRoutes({ path: 'user', method: RequestMethod.GET });
      consumer.apply(Logger).forRoutes(UserController);
  }
}
```

:::info
全局注册

```js
//main.ts中
import { Request, Response, NextFunction } from 'express'

const whiteList = ['/list'] //白名单

function MiddleWareAll(req: Request, res: Response, next: NextFunction) {
  console.log(req.originalUrl)
  if (whiteList.includes(req.originalUrl)) {
    next()
  } else {
    res.send('404没有找到页面')
  }
}
app.use(MiddleWareAll)
```

:::

#### 跨域中间件处理

```js
npm install cors
npm install @types/cors -D

//main.ts
import * as cors from 'cors';

app.use(cors());
```

#### 上传文件和静态目录

```js
//安装依赖
npm install multer -S
npm install @types/multer -D

nest g resource upload

//upload.module.ts
import { Module } from '@nestjs/common';
import { UploadService } from './upload.service';
import { UploadController } from './upload.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: join(__dirname, '../images'),
        filename: (req, file, callback) => {
          const fileName = `${new Date().getTime() + extname(file.originalname)}`;
          return callback(null, fileName);
        },
      }),
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}

//upload.controller.ts
import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UploadService } from './upload.service';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  upload(@UploadedFile() file) {
    console.log('file', file);

    return {
      code: 200,
    };
  }
}

//访问静态资源
//app.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, 'images'), {
    prefix: '/images',
  });
  await app.listen(3000);
}
bootstrap();

//然后访问http://localhost:3000/images/ + 图片名 就可以访问到图片了
```

#### 下载文件和文件流

- 直接下载

```js
import type { Response } from 'express'
  @Get('export')
  download(@Res() res: Response) {
    const url = join(__dirname, '../images/1716230297383.jpg');
    res.download(url);
  }
```

- 文件流下载

```js
npm install compressing - D
import { zip } from 'compressing';

  @Get('stream')
  async down(@Res() res: Response) {
    const url = join(__dirname, '../images/1716230297383.jpg');
    const tarStream = new zip.Stream();
    await tarStream.addEntry(url);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.setHeader('Content-Disposition', `attachment; filename=xiaoman`);

    tarStream.pipe(res);
  }

//前端下载
const useFetch = async (url: string) => {
  const res = await fetch(url).then(res => res.arrayBuffer())
  console.log(res)
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([res],{
    // type:"image/png"
  }))
  a.download = 'xiaman.zip'
  a.click()
}

const download = () => {
  useFetch('http://localhost:3000/upload/stream')
}
```

#### 响应拦截器

```js
// 新建src / common / response.ts
import { Injectable, NestInterceptor, CallHandler } from '@nestjs/common'
import { map } from 'rxjs/operators'
import { Observable } from 'rxjs'

interface Data<T> {
  data: T;
}

@Injectable()
export class Response<T> implements NestInterceptor {
  intercept(context, next: CallHandler): Observable<Data<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          data,
          code: 0,
          message: '成功',
          success: true,
        }
      })
    )
  }
}

// main.ts
import { Response } from './common/response'
app.useGlobalInterceptors(new Response())
```

#### 异常拦截器

```js
// 新建src / common / filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';

import { Request, Response } from 'express';

interface Data<T> {
  data: T;
}

@Catch(HttpException)
export class HttpFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    response.status(status).json({
      success: false,
      time: new Date(),
      data: exception.message,
      status,
      path: request.url,
    });
  }
}

// main.ts
import { HttpFilter } from './common/filter';
app.useGlobalFilters(new HttpFilter());
```

#### 管道

- 1.转换，可以将前端传入的数据转成成我们需要的数据

```js
//8个内置转换api
ValidationPipe
ParseIntPipe
ParseFloatPipe
ParseBoolPipe
ParseArrayPipe
ParseUUIDPipe
ParseEnumPipe
DefaultValuePipe

//这样写，id为123，会返回400，因为id不是uuid
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.listService.findOne(+id);
  }

```

- 2.验证 类似于前端的 rules 配置验证规则

```js
//login生成管道
nest g res login
nest g pi login

npm i --save class-validator class-transformer

// 在login.controller.ts
import { LoginPipe } from './login.pipe';
  @Post()
  create(@Body(LoginPipe) createLoginDto: CreateLoginDto) {
    return this.loginService.create(createLoginDto);
  }
//login/dto/create-login.dto.ts
import { IsNotEmpty, IsString, Length, IsNumber } from 'class-validator';

export class CreateLoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(5, 10, {
    message: '长度在5-10之间',
  })
  name: string;
  @IsNumber()
  age: number;
}
//login.pipe.ts
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class LoginPipe implements PipeTransform {
  async transform(value: any, metadata: ArgumentMetadata) {
    console.log(value, metadata);

    const DTO = plainToInstance(metadata.metatype, value);
    const errors = await validate(DTO);

    if (errors.length>0) {
      throw new HttpException(errors, HttpStatus.BAD_REQUEST);
    }
    return value;
  }
}

//全局配置
import { ValidationPipe } from '@nestjs/common';
app.useGlobalPipes(new ValidationPipe());

```

#### 爬虫 写真

```js
npm install cheerio -S
npm install axios -S
```

#### nestjs 守卫

```js
nest g res guard
nest g gu role

//guard.controller.ts
import { UseGuards } from '@nestjs/common';
import { RoleGuard } from './role.guard';

@UseGuards(RoleGuard)
@Controller('guard')

//全局使用
import { RoleGuard } from './guard/role.guard';
  app.useGlobalGuards(new RoleGuard());
```

#### 自定义装饰器

#### swagger 接口文档

```js
npm install @nestjs/swagger swagger-ui-express

//main.ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
  const options = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Nestjs')
    .setDescription('这是一个文档')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/api-docs', app, document);

访问 ' http://localhost:3000/api-docs '

//api分组
controller
import {ApiTags} from '@nestjs/swagger'
@ApiTags('用户接口')

//接口描述
@ApiProperty({summary: 'get接口', description: '获取用户名'})

//描述参数
@ApiParam({name: 'id', description: '用户id', required: true,type:number})
@ApiQuery({name: 'id', description: '用户id', required: true,type:number})

//返回的自定义描述
@ApiResponse({status: 200, description: '成功', type: User})

//实体类描述 example是例子
@ApiProperty({description: '用户名', example: 'xiaosong'})

//权限 就是token，这个接口需要携带token
@ApiBearerAuth()
```

#### 连接数据库 typeOrm

```js
npm install -save @nestjs/typeorm typeorm mysql2

//app.module.ts
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[    TypeOrmModule.forRoot({
      type: 'mysql', //数据库类型
      username: 'root', //账号
      password: '123456', //密码
      host: 'localhost', //host
      port: 3306, //
      database: 'db', //库名
      // entities: [__dirname + '/**/*.entity{.ts,.js}'], //实体文件
      synchronize: true, //synchronize字段代表是否自动将实体类同步到数据库
      retryDelay: 500, //重试连接数据库间隔
      retryAttempts: 10, //重试连接数据库的次数
      autoLoadEntities: true, //如果为true,将自动加载实体 forFeature()方法注册的每个实体都将自动添加到配置对象的实体数组中
    }),]
})

//test模块中添加实体
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Test {
  @PrimaryGeneratedColumn() //自增
  id: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  gender: string;

  @Column()
  phone: number;
}

//test.module.ts
import { Test } from './entities/test.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

  imports: [TypeOrmModule.forFeature([Test])],

  会自动关联表，添加字段


```

#### nestjs 实体

#### nestjs+vue3 第一个 CURD

#### nestjs+vue3+分页+排序

#### 多表联查

#### 事务

#### 新建项目

::: info
新建文件夹 nest-admin //主目录

新建 client //前端项目

nest new server //后端项目

新建 upload 及 logs 文件夹 //上传文件及日志
:::

#### 生产/开发环境配置

::: info
src 下新建目录 config 用来配置环境

新建文件 `dev.yml` `prod.yml` `index.ts`

不能直接读取 yml 文件，需要安装包`js-yaml`

```js
npm install js-yaml
```

```js
// index.ts
import { readFileSync } from 'fs';
import * as yaml from 'js-yaml';
import { join } from 'path';

const configFileNameObj = {
  development: 'dev',
  test: 'test',
  production: 'prod',
};

const env = process.env.NODE_ENV;

export default () => {
  return yaml.load(
    readFileSync(join(__dirname, `/${configFileNameObj[env]}.yml`), 'utf8'),
  ) as Record<string, any>;
};
```

```yml
# dev.yml
# 开发环境配置
app:
  prefix: '/api' #接口前缀
  port: 8081
  logger:
    # 项目日志存储路径，相对路径（相对本项目根目录）或绝对路径
    dir: '../logs'
  # 文件相关
  file:
    # location 文件上传后存储目录，相对路径（相对本项目根目录）或绝对路径
    location: '../upload'
    # 文件服务器地址，这是开发环境的配置 生产环境请自行配置成可访问域名
    domain: 'http://localhost:8081'
    # 文件虚拟路径, 必须以 / 开头， 如 http://localhost:8081/static/****.jpg  , 如果不需要则 设置 ''
    serveRoot: '/static'
# 数据库配置
db:
  mysql:
    host: 'localhost'
    username: 'root'
    password: '123456'
    database: 'admin'
    port: 3306
    charset: 'utf8mb4'
    logger: 'advanced-console'
    logging: true
    multipleStatements: true
    dropSchema: false
    synchronize: true
    supportBigNumbers: true
    bigNumberStrings: true
# redis 配置
redis:
  host: 'localhost'
  port: 6379
  db: 0
  keyPrefix: 'nest:'
```

```js
//app.modules.ts
import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ConfigModule, ConfigService } from '@nestjs/config'

import configuration from './config/index'

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      cache: true,
      load: [configuration],
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```json
// nest-cli.json
{
  "$schema": "https://json.schemastore.org/nest-cli",
  "collection": "@nestjs/schematics",
  "sourceRoot": "src",
  "compilerOptions": {
    "assets": ["**/*.yml"],
    "watchAssets": true,
    "deleteOutDir": true
  }
}
```

```json
// package.json
 npm install --save-dev cross-env

 //修改启动命令
"start:dev": "cross-env NODE_ENV=development nest start --watch",
"start:debug": "cross-env NODE_ENV=development nest start --debug --watch",
"start:test": "cross-env NODE_ENV=test node dist/main",
"start:prod": "cross-env NODE_ENV=production node dist/main",
```

:::

