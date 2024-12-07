# typescript

## tsconfig.json

### 初始化 tsconfig.json

```bash
tsc --init
```

直接执行`tsc`，会根据根目录下的`tsconfig.json`文件，将 ts 文件编译成 js 文件。

### 编译选项

```json
{
  "files": ["./src/demo1.ts"], // 指定具体编译的文件
  "include": ["./src"], // 指定编译目录或文件
  "exclude": ["node_modules", "**/*.spec.ts", "dist"], // 排除编译目录或文件
  "compilerOptions": {
    //具体配置参见 https://www.tslang.cn/docs/handbook/compiler-options.html
  }
}
```

## 命名空间

### 语法格式

```ts
namespace 名称 {
  namespace 名称 {}
}
```

```ts
namespace UserForm {
  export class Name {}

  export class Tel {}
}

class Init {
  constructor() {
    new UserForm.Name()
    new UserForm.Tel()
  }
}
```

也可以将整体作为一个命名空间

```ts
namespace InitForm {
  namespace UserForm {
    export class Name {} //namespace中的内容需要导出

    export class Tel {}
  }

  class Init {
    constructor() {
      new UserForm.Name()
      new UserForm.Tel()
    }
  }
}
```

### 限定路径

相当于在命名空间中引用其他命名空间

虽然命名空间可以在文件中直接引用，但为了防止冲突和打包后报错，使用其他命名空间时需要引入

在命名空间最顶部加

```ts
///<reference path="xxx.ts" />
```

## d.ts 声明文件

一般第三库的声明文件以`@types/`开头,比如 jquery 的声明文件为`@types/jquery`

### declare

declare 关键字用来声明全局变量或函数，这个声明只是为了避免报错

这个文件没有`import` 和 `export`，就是全局的，否则就是一个模块

```ts
declare let a: string
declare function fn(): void
declare class Person {
  constructor(name: string)
}
declare interface tomato {}
declare enum season {
  spring,
  summer,
}
declare namespace A {
  const x: number //declare中的内容不需要默认导出（导不导出都行），也不需要declare
}
declare module '*.vue' //声明所有以.vue结尾的文件

let tomato: tomato
```

### declare global

如果声明文件中有`导入`或`导出`，那他就是一个模块，不是全局的

这时如果这个文件需要有全局的声明，可以使用`declare global`

```ts
declare global {
  interface String {
    double(): string
  }
}

String.prototype.double = function () {
  return 'abc'
}

export {} //将文件作为一个模块，而不是全局
```

### declare 命名冲突

declare 名字可能会冲突

接口同名默认会合并 命名空间也能合并 函数和命名空间能合并

### tsconfig.json 配置

```ts
{
  "compilerOptions":{
    "paths":{
      "*":["types/*"] //表示找不到声明文件时，从types目录下查找，types在根目录
    }
  }
}
```

### jquery.d.ts

```ts
declare function $(selector: string): {
  css(val: object): void
  height(val: number): void
}

declare namespace $ {
  namespace fn {
    function extend(): void
  }
}

declare namespace $ {
  const a = 1
}

//命名空间与函数同时存在，会合并
export default $
```

使用

```ts
import jquery from 'jquery'
jquery.fn.extend()
jquery.a
```

## ts 类型

### unknown

unknown 是 any 的安全类型

```ts
let a: unknown = 1
q.a //unknown类型报错，any类型无任何反应，unknown不能通过属性变量取值
```

unknown 和其他类型在`联合类型`都是 `unknown` 类型

unknown 和其他类型在`交叉类型`都是 `其他` 类型

```ts
type string | unknown //unknown类型
type string & unknown //string类型
```

## 内置类型

###
