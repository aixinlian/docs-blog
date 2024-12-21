# zustand 状态管理工具

https://zustand-demo.pmnd.rs/

## 安装

```bash
npm i zustand
```

//zustand 在使用时，解构出来的部分 store 对象，在其他组件修改 store 的时候，也会导致第一个组件重新渲染
//这时候需要从 zustand 中导入 useShallow 函数，进行包裹

//下面都是在 store 中的配置项，按写的顺序来进行包裹
//如果要从 devtools（浏览器插件）中查看 store，需要从 zustand 中导入 devtools

//如果要持久化存储，从 zustand 中导入 persist
//第二个参数是一个配置项，name 为浏览器存储的名字，partializ（匿名函数）返回的对象就是存储的对象，返回什么存什么
//指定存储位置 storage:createJSONStorage(()=>sessionStorage) window.sessionStorage 的简写

//比如在组件只要判断他的值是否大于 10，正常写的话，每次修改值都会重新渲染组件，现在我需要的是，值一大于 10，就渲染一次，而不是每次修改值的时候都要去判断，然后渲染组件
//这时候可以使用他的订阅模式，配合 useEffect，只订阅一次就够了
//useEffect(()=>{
// const cancelSub = useAppleStore.subscribe((state, prevState) => {
// console.log('状态改变了')
// })
// return cancelSub
// },[])

//静态方法，useAppleStore.setState() useAppleStore.getState()
