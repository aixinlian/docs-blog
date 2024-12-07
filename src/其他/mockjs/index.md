# mockjs

http://mockjs.com/

## 安装

```shell
npm i mockjs
```

## 使用

```vue
<template>
  <div class="container">
    {{ city }}
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Mock from 'mockjs'

const city = ref('')
city.value = Mock.mock('@city')
</script>

<style scoped></style>
```
