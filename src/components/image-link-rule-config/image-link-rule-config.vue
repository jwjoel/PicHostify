<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <span>Customize Image Link Rules</span>
      </div>
    </template>
    <el-table :data="userSettings.imageLinkType.presetList" style="width: 100%">
      <el-table-column prop="name" label="Type" width="120" />
      <el-table-column label="CDN Rules">
        <template #default="scope">
          <div
            :contenteditable="scope.row.editable"
            @focusout="editImageLinkRule($event.target.innerHTML, scope.row.id)"
          >
            {{ scope.row.rule }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80" align="center">
        <template #default="scope">
          <el-button
            link
            type="danger"
            size="small"
            :disabled="!scope.row.editable"
            @click="removeImageLinkRule(scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-divider />
    <div style="margin-top: 20px">
      <el-form
        ref="formRef"
        label-position="left"
        :model="imageLinkRuleForm"
        label-width="120px"
        size="default"
      >
        <el-form-item
          label="Link Type"
          prop="name"
          :rules="[{ required: true, message: 'Type cannot be empty' }]"
        >
          <el-input v-model="imageLinkRuleForm.name" type="text" />
        </el-form-item>
        <el-form-item
          label="Link Rule"
          prop="rule"
          :rules="[{ required: true, message: 'Rule cannot be empty' }]"
        >
          <el-input v-model="imageLinkRuleForm.rule" type="text" />
        </el-form-item>
        <el-form-item>
          <el-button
            type="primary"
            :disabled="!imageLinkRuleForm.name || !imageLinkRuleForm.rule"
            @click="addImageLinkRule(formRef)"
          >
            Add Rule
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { FormInstance } from 'element-plus'
import { store } from '@/store'
import { getUuid } from '@/utils/common-utils'
import { ImageLinkRuleModel } from '@/common/model'

const userSettings = computed(() => store.getters.getUserSettings).value

const formRef = ref<FormInstance>()

const imageLinkRuleForm: ImageLinkRuleModel = reactive({
  id: '',
  name: '',
  rule: '',
  editable: true
})

const editImageLinkRule = (rule: string, id: string) => {
  store.dispatch('UPDATE_IMAGE_LINK_TYPE_RULE', { rule, id })
}

const removeImageLinkRule = (obj: ImageLinkRuleModel) => {
  ElMessageBox.confirm(
    `<span>This action will permanently delete the image link rule: </span><strong>${obj.name}</strong>`,
    `Notice`,
    {
      dangerouslyUseHTMLString: true,
      type: 'warning',
      confirmButtonText: 'Confirm',
      cancelButtonText: 'Cancel'
    }
  )
    .then(() => {
      store.dispatch('DEL_IMAGE_LINK_TYPE_RULE', obj.id)
    })
    .catch(() => {
      console.log('Deletion canceled')
    })
}

const addImageLinkRule = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      imageLinkRuleForm.id = getUuid()
      store.dispatch('ADD_IMAGE_LINK_TYPE_RULE', JSON.parse(JSON.stringify(imageLinkRuleForm)))
    }
  })
}
</script>

<style scoped lang="stylus">
@import "./image-link-rule-config.styl"
</style>
