<template>
  <div class="compress-config-box">
    <div class="img-encoder-title">Choose algorithm</div>
    <el-radio-group
      :disabled="disabled"
      class="img-encoder-group"
      v-model="compressEncoder"
      @change="onChangeEncoder"
    >
      <el-radio :label="CompressEncoderEnum.webP">
        {{ CompressEncoderEnum.webP }}
        <span class="desc"></span>
      </el-radio>
      <el-radio :label="CompressEncoderEnum.mozJPEG">
        {{ CompressEncoderEnum.mozJPEG }}
        <span class="desc"></span>
      </el-radio>
      <el-radio :label="CompressEncoderEnum.avif">
        {{ CompressEncoderEnum.avif }}
        <span class="desc"></span>
      </el-radio>
    </el-radio-group>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { CompressEncoderEnum } from '@/common/model'

const compressEncoder = ref<CompressEncoderEnum>(CompressEncoderEnum.webP)

const emit = defineEmits(['encoder'])

defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const onChangeEncoder = (encoder: CompressEncoderEnum) => {
  emit('encoder', encoder)
}

const reset = () => {
  compressEncoder.value = CompressEncoderEnum.webP
}

onMounted(() => {
  emit('encoder', compressEncoder.value)
})

defineExpose({ reset })
</script>

<style scoped lang="stylus">
@import "./compress-config-box.styl"
</style>
