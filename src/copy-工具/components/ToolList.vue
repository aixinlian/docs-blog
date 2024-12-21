<template>
  <hr />
  <h2 v-if="title" :id="formatTitle" tabindex="-1">
    {{ title }}
    <a class="header-anchor" :href="`#${formatTitle}`" aria-hidden="true"></a>
  </h2>
  <div class="xs-tool-list">
    <div class="xs-list-item" v-for="item in items" :key="item.name">
      <a :href="item.link" target="_blank" rel="noreferrer">
        <div class="box">
          <div class="box-header">
            <div v-if="item.svg" class="icon" v-html="item.svg"></div>
            <div
              v-else-if="item.icon && typeof item.icon === 'string'"
              class="icon"
            >
              <img
                :src="withBase(item.icon)"
                :alt="title"
                onerror="this.parentElement.style.display='none'"
              />
            </div>
            <h5 class="title">{{ item.title }}</h5>
          </div>
          <p class="desc" v-if="item.desc">{{ item.desc }}</p>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup>
import { withBase } from 'vitepress'
import { slugify } from '@mdit-vue/shared'
import { computed } from 'vue'

const formatTitle = computed(() => {
  return slugify(props.title)
})

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  items: {
    type: Array,
    required: true,
  },
})
</script>

<style lang="scss" scoped>
.xs-tool-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
  margin-bottom: 30px;
  .xs-list-item {
    width: 250px;
    height: 100%;
    padding: 12px;
    border-radius: 8px;
    display: block;
    border: 1px solid var(--xs-tools-border-color);
    background-color: var(--xs-tools-bg-color);
    &:hover {
      background-color: var(--xs-tools-hover-bg-color);
      border: 1px solid var(--xs-tools-hover-border-color);
    }
    a {
      color: var(--xs-tools-color);
      border-radius: 8px;
      .box {
        .box-header {
          display: flex;
          align-items: center;
          .icon {
            width: 40px;
            height: 40px;
            border-radius: 6px;
            background-color: var(--xs-tools-item-bg-color);
            margin-right: 8px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          img {
            width: 24px;
            height: 24px;
            border-radius: 4px;
          }
          svg {
            width: 24px;
            height: 24px;
            border-radius: 4px;
          }
          .title {
            overflow: hidden;
            flex-grow: 1;
          }
        }
        p {
          // flex-grow: 1;
          font-size: 12px;
          overflow: hidden;
          line-height: 1.5;
          color: var(--xs-tools-item-color);
          // margin-top: 10px;
          -webkit-line-clamp: 2; /* 设置最大显示行数 */
          margin: 12px 0 0;
        }
      }
    }
  }
}
</style>
