<template>
  <span class="site-count" ref="siteCountDom" v-show="isShow && isProd"> 1次 </span>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, Ref } from 'vue'

const props = defineProps({
  isuv: {
    type: Boolean,
    default: false
  }
})

const siteCountDom: Ref = ref<null | HTMLElement>(null)
const isShow: Ref<boolean> = ref(false)

const isProd = computed(() => import.meta.env.MODE === 'production')
</script>
<style lang="stylus">
.site-count {
  transition all 0.2s ease-in
}
</style>
