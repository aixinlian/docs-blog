# 前端导航

<ToolList v-for="{ title, items } in DATA" :title="title" :items="items"/>

<!-- <div class="tip"></div> -->

<script setup>
import { DATA } from './data'
import ToolList from '../components/ToolList.vue'
</script>
<style lang="scss" scoped>
.tip{
  width: 100%;
  height: 50px;
  margin: 100px 0 0;
  border: 1px solid #25aff3;
  border-radius: 8px;
}
</style>
