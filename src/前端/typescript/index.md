# typescript

对象用 interface，其他用 type。

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
  "extends": "./tsconfig.base.json", // 继承其他配置文件
  "compilerOptions": {
    //具体配置参见 https://www.tslang.cn/docs/handbook/compiler-options.html

    "rootDir": "./src", //入口
    "outDir": "./dist", //出口
    "noImplicitAny": true, //在表达式和声明上有隐含的 any类型时报错
    "strictNullChecks": true, //严格的空值检查
    "strictFunctionTypes": true, //函数参数类型检查
    "strictPropertyInitialization": true, //类的属性初始化检查
    "noImplicitReturns": true, //不是函数的所有返回路径都有返回值时报错
    "removeComments": true, //删除所有注释，除了以 /!* 开头的版权信息
    "noUnusedLocals": true, //有未使用的变量时报错
    "noUnusedParameters": true, //有未使用的参数时报错
    "skipLibCheck": true, //忽略所有的声明文件（*.d.ts）的类型检查
    "baseUrl": "./", //根目录
    "paths": {
      "@/*": ["src/*"] //路径映射
    }
  }
}
```

## 命名空间

### 语法格式

```ts
namespace 名称 {
  namespace 名称 {
    key: value
  }
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

### 泛型

泛型 T 可以设置默认值 `<T = string>`

### keyof any

在对象中会用到`keyof any`，他的结果是`string | number | symbol`，因为对象的键只能是这些类型

### keyof

用于获取对象中的所有键

```ts
interface Person {
  name?: string
  age?: number
  address?: string
}

type MyKeys = keyof Person // 'name' | 'age' | 'address'
```

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

### Symbol 类型

```ts
//Symbol接收三个类型的值，string | number | undefined(什么都不写)
let a1: symbol = Symbol(1) //唯一的
let a2: symbol = Symbol(1) //唯一的
console.log(a1 == a2) // false，因为他俩的内存地址不一样
//for跟Symbol区别
//Symbol，创建第一无二的，每次创建的地址都不一样
//for会在全局的symbo中有没有全局注册过这个key，如果有会直接拿来用，不会创建，如果没有会去创建
console.log(Symbol.for('aaa') === Symbol.for('aaa')) // true
```

### 枚举

```ts
enum Color3 {
  red = 1,
  blue = 5,
  green = 'green',
}
```

## 内置类型

### Readonly

将所有属性变为只读

#### 使用

```ts
interface Person {
  name?: string
  age?: number
  address?: string
}

type IPerson = Readonly<Person>

let person: IPerson = {
  name: 'John',
  age: 30,
  address: '123 Main St',
}
person.name = '1'
```

#### 原理

```ts
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

### Partial

将所有属性变为可选

#### 使用

```ts
interface Person {
  name: string
  age: number
  address: string
}

interface Company {
  name: string
  compay: Person
}

type ICompany = Partial<Company>

const person: Company = { name: 'John' }
```

#### 原理

```ts
//内置的Partial只是浅层的，不会递归
//没有递归
type Partial<T> = {
  [K in keyof T]?: T[K]
}
//递归
type Partial<T> = {
  [K in keyof T]?: T[K] extends object ? Partial<T[K]> : T[K]
}
```

### Required

将所有属性变为必选

#### 使用

```ts
interface Person {
  name?: string
  age?: number
  address?: string
}

type IPerson = Required<Person>

const person: IPerson = {
  name: 'John',
  age: 30,
  address: '123 Main St',
}
```

#### 原理

```ts
type Required<T> = {
  [K in keyof T]-?: T[K]
}
```

### Pick

从对象中挑选属性

#### 使用

```ts
interface Person {
  name: string
  age: number
  address: string
}

type MyPick = Pick<Person, 'name' | 'age'>
```

#### 原理

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P]
}
```

### Omit

从类型中排除属性

#### 使用

```ts
interface Person {
  name: string
  age: number
  address: string
}

type MyOmit = Omit<Person, 'name'> & { name: string } //修改类型

const names: MyOmit = { name: '', age: 5, address: '' }
```

#### 原理

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

### Record

限定对象类型

#### 使用

```ts
const Person: Record<string, any> = {
  a: '1',
  b: '2',
}
```

#### 原理

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T
}
```

### Exclude

排除类型，返回新的类型

#### 使用

```ts
type Person = 'name' | 'address' | 'age'

type IPerson = Exclude<Person, 'address'>

const person: IPerson = 'name'
```

#### 原理

```ts
type Exclude<T, U> = T extends U ? never : T
```

### Extract

从类型中挑选类型

#### 使用

```ts
type Person = 'name' | 'address' | 'age'

type IPerson = Extract<Person, 'address'>

const person: IPerson = 'address'
```

#### 原理

```ts
type Extract<T, U> = T extends U ? T : never
```

## 调用签名

为了满足包含属性的函数，javascript 中函数就是一类特殊的对象

```ts
type Func = {
  (s: number): boolean
  description: string
}

function doSomething(fun: Func) {
  fn(123)
  fn.description //调用签名
}
```

## 构造签名

类似函数调用签名，不过多了一个 new 前缀

```ts
type Ctor = {
  new (s: string): Date
  (n: number): Date
}

function fn(ctor: Ctor) {
  new ctor('hello')
  ctor(123)
}
```

## 函数重载

某个函数可能要支持不同（个）参数的调用形式，或者参数一样类型不一样

```ts
function makeDate(timestamp: number): Date
function makeDate(m: number, d: number, y: number): Date
function makeDate(mOrtimestamp: number, d?: number, y?: number) {
  if (d !== undefined && y !== undefined) {
    return new Date(y, mOrtimestamp, d)
  }
  return new Date(mOrtimestamp)
}

makeDate(12345)
makeDate(0, 1, 2023)
```

## 泛型函数

泛型在函数名的后面,在调用的时候才会去推导类型

```ts
function fn<T>(arr: T[]): T | undefined {
  return arr[0]
}
fn([1, 2, 3])
```

多泛型

```ts
function map<Input, Output>(arr: Input[], cb: (input: Input) => Output): Output[] {
  return arr.map(cb)
}
```

泛型约束

```ts

<T extends { length: number }> //T至少有一个属性是length

function logest<T extends { length: number }>(a: T, b: T) {
  if (a.length > b.length) {
    return a
  } else {
    return b
  }
}
```

## 获取数组类型

```ts
const arr = ['a', 100, true, 200]
type T = (typeof arr)[number] // string | number | boolean
```
