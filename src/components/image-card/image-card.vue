<template>
  <div
    class="image-card"
    :class="{ checked: imageObj.checked }"
    v-loading="imageObj.deleting"
    element-loading-text="Deleting..."
    @mouseenter="isShowOperateBtn = true"
    @mouseleave="isShowOperateBtn = false"
  >
    <div class="image-box">
      <el-image :src="imgUrl" fit="cover" loading="lazy" lazy data-fancybox="gallery" />
    </div>

    <div class="info-box">
      <div class="image-info">
        <!-- 重命名操作 -->
        <div class="rename-operate" v-if="isRenameImg">
          <el-input
            size="small"
            class="rename-input"
            v-model="renameInputValue"
            clearable
            ref="renameInputRef"
            :maxlength="RENAME_MAX_LENGTH"
          ></el-input>
          <el-button-group size="small">
            <el-button :icon="Close" @click="isRenameImg = false" />
            <el-button :icon="Check" @click.prevent="updateRename" />
          </el-button-group>
        </div>
        <!-- 文件名 -->
        <div class="filename" v-else>{{ imageObj.name }}</div>
      </div>
    </div>

    <!-- 图片链接操作 -->
    <div class="copy-link-box">
      <copy-image-link :img-obj="imageObj" />
    </div>

    <div class="operation-box" v-show="isShowOperateBtn || dropdownVisible || imageObj.checked">
      <div class="operation-left">
        <div
          v-if="isManagementPage"
          :class="[imageObj.checked ? 'picked-btn' : 'pick-btn', 'operation-btn']"
          @click="togglePick(imageObj)"
        >
          <el-icon v-if="imageObj.checked"><IEpCheck /></el-icon>
        </div>
      </div>
      <div class="operation-right">
        <el-dropdown size="default" trigger="click" @visible-change="visibleChange">
          <div class="operation-btn">
            <el-icon><IEpMoreFilled /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="deleteImageTips(imageObj)"> Delete </el-dropdown-item>
              <el-dropdown-item @click.self="showRenameInput(imageObj)"> Rename </el-dropdown-item>
              <el-dropdown-item @click="viewImageProperties(imageObj)">
                Attribute
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { ElInput } from 'element-plus'
import { useRoute } from 'vue-router'
import { Check, Close } from '@element-plus/icons-vue'
import { useStore } from '@/store'
import { UploadedImageModel, UploadImageModel } from '@/common/model'
import {
  getBase64ByImageUrl,
  getFilename,
  getFileSize,
  generateImageLinks,
  getUuid,
  createUploadImageObject,
  getFileSuffix,
  blobToBase64ByImageUrl
} from '@/utils'
import { uploadImageToGitHub } from '@/utils/upload-utils'
import { deleteSingleImage } from '@/common/api'
import { RENAME_MAX_LENGTH } from '@/common/constant'

const props = defineProps({
  imageObj: {
    type: Object as () => UploadedImageModel,
    default: () => ({})
  },
  isUploaded: {
    type: Boolean,
    default: false
  }
})

const store = useStore()
const router = useRoute()
const userConfigInfo = computed(() => store.getters.getUserConfigInfo).value
const userSettings = computed(() => store.getters.getUserSettings).value
const isManagementPage = computed(() => {
  return router.path === '/management'
})

const imgUrl = computed(() => generateImageLinks(props.imageObj, userConfigInfo, userSettings))

const renameInputRef = ref<InstanceType<typeof ElInput>>()
const renameInputValue = ref<string>('')
const isRenameImg = ref<boolean>(false)

const isShowOperateBtn = ref<boolean>(false)
const dropdownVisible = ref<boolean>(false)

const deleteOriginImage = (
  imageObj: UploadedImageModel,
  isRename: boolean = false
): Promise<boolean> => {
  if (!isRename) {
    imageObj.deleting = true
  }
  const { owner, selectedRepo: repo } = userConfigInfo
  const { path, sha } = imageObj

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve) => {
    const res = await deleteSingleImage(owner, repo, path, sha)
    if (res) {
      if (isRename) {
        isRenameImg.value = false
        ElMessage.success('Update Successful')
      } else {
        ElMessage.success('Delete Successful')
      }
      await store.dispatch('DIR_IMAGE_LIST_REMOVE', imageObj)
      await store.dispatch('UPLOAD_IMG_LIST_REMOVE', imageObj.uuid)
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

const deleteImageTips = (imageObj: UploadedImageModel) => {
  ElMessageBox.confirm(
    `
    <div>This operation will delete image permanently</div>
    <strong>${imageObj.name}</strong>
    `,
    `Notice`,
    {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  )
    .then(() => {
      deleteOriginImage(imageObj)
    })
    .catch(() => {
      console.log('Cancel')
    })
}

const togglePick = (imageObj: UploadedImageModel) => {
  imageObj.checked = !imageObj.checked
  store.commit('IMAGE_CARD', { imageObj })
}

/**
 * 显示重命名输入框和确定按钮
 * @param imgObj
 */
const showRenameInput = async (imgObj: UploadedImageModel) => {
  isRenameImg.value = true
  renameInputValue.value = getFilename(imgObj.name)
  setTimeout(() => {
    renameInputRef.value?.focus()
  }, 100)
}

const updateRename = async () => {
  const { imageObj } = props

  if (!renameInputValue.value) {
    ElMessage.error('Name can not be empty')
    renameInputRef.value?.focus()
    return
  }

  if (renameInputValue.value === getFilename(imageObj.name)) {
    ElMessage.error('Please enter a new name')
    isRenameImg.value = false
    return
  }

  const renameImg = async () => {
    const loading = ElLoading.service({
      lock: true,
      text: 'Renameing...'
    })

    // 重命名的逻辑是先上传一张新名称的图片，再删除旧图片

    const suffix = getFileSuffix(imageObj.name)
    const newUuid = getUuid()
    const newFilename = `${renameInputValue.value}${
      userSettings.defaultHash ? `.${newUuid}` : ''
    }.${suffix}`

    let base64

    if (!suffix.includes('svg')) {
      base64 = await getBase64ByImageUrl(imgUrl.value || '', suffix)
    } else {
      base64 = await blobToBase64ByImageUrl(imgUrl.value || '')
    }

    if (base64) {
      const tmpImgObj: UploadImageModel = createUploadImageObject()
      tmpImgObj.uuid = newUuid
      tmpImgObj.base64.originalBase64 = base64
      tmpImgObj.filename.final = newFilename
      tmpImgObj.reUploadInfo!.isReUpload = true
      tmpImgObj.reUploadInfo!.dir = imageObj.dir
      let path = newFilename
      if (imageObj.dir !== '/') {
        path = `${imageObj.dir}/${newFilename}`
      }
      tmpImgObj.reUploadInfo!.path = path

      // 重新上传重命名后的图片
      const isUploadSuccess = await uploadImageToGitHub(userConfigInfo, tmpImgObj)

      if (isUploadSuccess) {
        renameInputValue.value = ''
        await deleteOriginImage(imageObj, true)
        await store.dispatch('UPLOAD_IMG_LIST_REMOVE', imageObj.uuid)
      } else {
        ElMessage.error('Rename failed')
      }
    } else {
      ElMessage.error('Rename failed')
    }
    loading.close()
    isRenameImg.value = false
  }

  ElMessageBox.confirm(`Rename to ${renameInputValue.value} ？`, `Notice`, {
    type: 'info',
    confirmButtonText: 'Confirm',
    cancelButtonText: 'Cancel'
  })
    .then(() => {
      renameImg()
    })
    .catch(() => {
      console.log('Cancel')
      isRenameImg.value = false
    })
}

const visibleChange = (e: boolean) => {
  dropdownVisible.value = e
}

const viewImageProperties = (imgObj: UploadedImageModel) => {
  ElMessageBox.confirm(
    `
    <div>Image name: <strong>${imgObj.name}</strong></div>
    <div>Image size: <strong>${getFileSize(imgObj.size)} KB</strong></div>
    `,
    `Arrribute`,
    {
      showCancelButton: false,
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
      showConfirmButton: false,
      dangerouslyUseHTMLString: true,
      type: 'info'
    }
  )
}
</script>

<style scoped lang="stylus">
@import 'image-card.styl'
</style>
