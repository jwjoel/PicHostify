<template>
  <div class="copy-image-link-box">
    <div class="left">
      <el-tooltip content="Please configure image link settings in 'My Settings'" placement="top">
        <el-icon><IEpInfoFilled /></el-icon>
      </el-tooltip>
    </div>
    <div class="btn-box right">
      <el-tooltip
        :content="'Click to copy ' + userSettings.imageLinkType.selected + ' image link'"
        placement="top"
      >
        <span class="btn-item flex-center" @click="oneClickCopy"> Copy Link </span>
      </el-tooltip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onUpdated } from 'vue'
import { UploadedImageModel } from '@/common/model'
import { store } from '@/store'
import { copyImageLink } from '@/utils'

const props = defineProps({
  imgObj: {
    type: Object,
    default: () => {}
  }
})

const userSettings = computed(() => store.getters.getUserSettings).value
const userConfigInfo = computed(() => store.getters.getUserConfigInfo).value

let img = ref(props.imgObj as UploadedImageModel).value

const oneClickCopy = () => {
  copyImageLink(img, userConfigInfo, userSettings)
}

onUpdated(() => {
  img = props.imgObj as UploadedImageModel
})
</script>

<style scoped lang="stylus">
@import "copy-image-link.styl"
</style>
