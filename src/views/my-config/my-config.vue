<template>
  <div class="page-container config-page-container">
    <!-- GitHub Token -->
    <el-form label-width="70rem" :label-position="labelPosition">
      <el-form-item label="Token">
        <el-input
          v-model="userConfigInfo.token"
          clearable
          :autofocus="!userConfigInfo.token"
          type="password"
          show-password
          placeholder="Enter your GitHub Token"
        ></el-input>
      </el-form-item>

      <el-form-item class="operation">
        <el-tooltip placement="top" content="Choose exist Github repository">
          <el-button
            :disabled="btnDisabled"
            plain
            type="primary"
            native-type="submit"
            @click.prevent="getUserInfo()"
          >
            {{ reConfig ? 'Set Up Manually' : 'Reconfig Manually' }}
          </el-button>
        </el-tooltip>
        <el-tooltip placement="top" content="Automatically create a GitHub repository (Recommend)">
          <el-button
            plain
            :disabled="btnDisabled"
            type="primary"
            @click.prevent="oneClickAutoConfig()"
          >
            {{ reConfig ? 'Set Up Automatically' : 'Reconfig Automatically' }}
          </el-button>
        </el-tooltip>
      </el-form-item>
    </el-form>

    <!-- 基本信息 -->
    <el-form
      label-width="70rem"
      :label-position="labelPosition"
      v-if="userConfigInfo.token && userConfigInfo.owner"
      v-loading="userInfoLoading"
      element-loading-text="Loading user info..."
    >
      <el-form-item v-if="userConfigInfo.owner" label="Username">
        <el-input v-model="userConfigInfo.owner" readonly></el-input>
      </el-form-item>

      <el-form-item v-if="userConfigInfo.email" label="Email">
        <el-input v-model="userConfigInfo.email" readonly></el-input>
      </el-form-item>

      <!-- 仓库 -->
      <el-form-item v-if="userConfigInfo.repoList.length" label="Choose Repository">
        <el-select
          v-model="userConfigInfo.selectedRepo"
          :filterable="true"
          :style="{ width: 'calc(100% - ' + refreshBoxWidth + 'rem)' }"
          placeholder="Please choose repository"
          @change="selectRepo"
        >
          <el-option
            v-for="(repo, index) in userConfigInfo.repoList"
            :key="index"
            :label="repo.label"
            :value="repo.value"
          >
          </el-option>
        </el-select>
        <refresh-config :box-width="refreshBoxWidth" data-type="repo" />
      </el-form-item>
    </el-form>

    <!-- 分支 -->
    <el-form
      label-width="70rem"
      :label-position="labelPosition"
      v-if="userConfigInfo.token && userConfigInfo.selectedRepo && userConfigInfo.branchList.length"
      v-loading="branchLoading"
      element-loading-text="Loading..."
    >
      <!-- 由于 GitHub API 目前不支持创建空分支，该功能暂时无法使用 -->
      <el-form-item v-if="userConfigInfo.selectedRepo && 0" label="Branch method">
        <el-radio-group v-model="userConfigInfo.branchMode" @change="branchModeChange">
          <el-tooltip
            v-if="userConfigInfo.branchList.length"
            :content="'Choose a branch from repository ' + userConfigInfo.selectedRepo"
            placement="top"
          >
            <el-radio label="repoBranch">
              Choose {{ userConfigInfo.selectedRepo }} Repository Branch
            </el-radio>
          </el-tooltip>
          <el-tooltip content="Create a new branch manually" placement="top">
            <el-radio label="newBranch">New branch</el-radio>
          </el-tooltip>
        </el-radio-group>
      </el-form-item>

      <!-- 选择分支 -->
      <el-form-item
        v-if="
          userConfigInfo.branchList.length &&
          userConfigInfo.branchMode === BranchModeEnum.repoBranch
        "
        label="Choose branch"
      >
        <el-select
          v-model="userConfigInfo.selectedBranch"
          :filterable="true"
          :style="{ width: 'calc(100% - ' + refreshBoxWidth + 'rem)' }"
          placeholder="Please choose branch..."
          @change="selectBranch"
        >
          <el-option
            v-for="(repo, repoIndex) in userConfigInfo.branchList"
            :key="repoIndex"
            :label="repo.label"
            :value="repo.value"
          >
          </el-option>
        </el-select>
        <refresh-config :box-width="refreshBoxWidth" data-type="branch" />
      </el-form-item>

      <!-- 新建分支 -->
      <el-form-item
        v-if="userConfigInfo.branchMode === BranchModeEnum.newBranch"
        label="Create branch"
      >
        <el-input
          v-model="newBranchInputVal"
          @blur="onNewBranchInputBlur"
          clearable
          placeholder="Please create branch..."
          ref="newBranchInputRef"
        ></el-input>
      </el-form-item>
    </el-form>

    <!-- 目录 -->
    <el-form
      label-width="70rem"
      :label-position="labelPosition"
      v-if="userConfigInfo.token && userConfigInfo.selectedBranch"
      v-loading="dirLoading"
      element-loading-text="Loading..."
    >
      <el-form-item v-if="userConfigInfo.selectedBranch" label="Directory Method">
        <el-radio-group v-model="userConfigInfo.dirMode" @change="dirModeChange">
          <el-tooltip content="Enter a directory manually" placement="top" :offset="-1">
            <el-radio label="newDir">New Directory</el-radio>
          </el-tooltip>

          <el-tooltip
            :content="
              'Images are stored in the root directory of the ' +
              userConfigInfo.selectedBranch +
              ' branch'
            "
            placement="top"
            :offset="-1"
          >
            <el-radio label="rootDir">Root Directory</el-radio>
          </el-tooltip>

          <el-tooltip
            :content="`Automatically create directories with the format YYYYMMDD`"
            placement="top"
            :offset="-1"
          >
            <el-radio label="autoDir">Auto Directory</el-radio>
          </el-tooltip>

          <el-tooltip
            v-if="userConfigInfo.dirList.length && userConfigInfo.branchMode !== 'newBranch'"
            :content="`Select a directory under the ${userConfigInfo.selectedBranch} branch`"
            placement="top"
            :offset="-1"
          >
            <el-radio label="repoDir"
              >Select {{ userConfigInfo.selectedRepo }} Repository Directory</el-radio
            >
          </el-tooltip>
        </el-radio-group>
      </el-form-item>

      <el-form-item v-if="userConfigInfo.dirMode === 'autoDir'" label="Auto Directory">
        <el-input v-model="userConfigInfo.selectedDir" readonly></el-input>
      </el-form-item>

      <el-form-item v-if="userConfigInfo.dirMode === 'rootDir'" label="Root Directory">
        <el-input v-model="userConfigInfo.selectedDir" readonly></el-input>
      </el-form-item>

      <el-form-item v-if="userConfigInfo.dirMode === 'newDir'" label="New Directory">
        <el-input
          ref="newDirInputRef"
          v-model="userConfigInfo.selectedDir"
          @input="persistUserConfigInfo()"
          clearable
          placeholder="Enter the new directory name..."
        ></el-input>
      </el-form-item>


      <el-form-item
        v-if="
          userConfigInfo.dirList.length &&
          userConfigInfo.dirMode === 'repoDir' &&
          userConfigInfo.branchMode !== 'newBranch'
        "
        label="Choose dictionary"
      >
        <repo-dir-cascader :el-key="repoDirCascaderKey" :el-size="userSettings.elementPlusSize" />
      </el-form-item>
    </el-form>

    <!-- 操作（重置、确认配置） -->
    <el-form label-width="70rem" v-if="userConfigInfo.token" :label-position="labelPosition">
      <el-form-item class="operation">
        <el-button
          plain
          :disabled="btnDisabled"
          type="warning"
          @click="resetConfig()"
          v-if="userConfigInfo.owner"
        >
          Reset
        </el-button>
        <el-button
          plain
          :disabled="btnDisabled"
          type="success"
          @click="goUploadPage()"
          v-if="userConfigInfo.selectedRepo"
        >
          Confirm
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, watch } from 'vue'
import { useStore } from '@/store'
import { BranchModeEnum, BranchModel, DirModeEnum, ElementPlusSizeEnum } from '@/common/model'
import { formatDatetime } from '@/utils'
import {
  getBranchInfoList,
  getGitHubUserInfo,
  createNewBranch,
  initEmptyRepo,
  getDirInfoList,
  getAllRepoList
} from '@/common/api'
import { INIT_REPO_BARNCH } from '@/common/constant'
import {
  goUploadPage,
  persistUserConfigInfo,
  initReHandConfig,
  resetConfig,
  saveUserInfo,
  oneClickAutoConfig
} from '@/views/my-config/my-config.util'

const store = useStore()

const userInfoLoading = ref(false)
const dirLoading = ref(false)
const branchLoading = ref(false)
const refreshBoxWidth = ref(32)

const userConfigInfo = computed(() => store.getters.getUserConfigInfo).value
const logined = computed(() => store.getters.getUserLoginStatus).value
const userSettings = computed(() => store.getters.getUserSettings).value
const reConfig = computed(() => !userConfigInfo.token || !userConfigInfo.owner)
const labelPosition = computed(() => {
  return userSettings.elementPlusSize === ElementPlusSizeEnum.large ? 'right' : 'top'
})
const btnDisabled = computed(() => userInfoLoading.value || dirLoading.value || branchLoading.value)

const newDirInputRef = ref<null | HTMLElement>(null)
const newBranchInputRef = ref<null | HTMLElement>(null)
const newBranchInputVal = ref<string>('')
const repoDirCascaderKey = ref<string>('repoDirCascaderKey')

const dirModeChange = (dirMode: DirModeEnum) => {
  switch (dirMode) {
    case DirModeEnum.rootDir:
      // 根目录
      userConfigInfo.selectedDir = '/'
      break

    case DirModeEnum.autoDir:
      // 自动目录，根据当天日期自动生成
      userConfigInfo.selectedDir = formatDatetime('yyyyMMdd')
      break

    case DirModeEnum.newDir:
      // 手动输入的新建目录
      userConfigInfo.selectedDir = 'xxx'
      newDirInputRef.value?.focus()
      break

    case DirModeEnum.repoDir:
      // 仓库目录
      // eslint-disable-next-line no-case-declarations
      const { dirList } = userConfigInfo
      if (dirList.length) {
        userConfigInfo.selectedDir = dirList[0].value
        userConfigInfo.selectedDirList = [dirList[0].value]
      } else {
        userConfigInfo.selectedDir = ''
      }
      break

    default:
      userConfigInfo.selectedDir = '/'
      break
  }
  persistUserConfigInfo()
}

async function getRepoList(owner: string) {
  const repoList = await getAllRepoList(owner)
  console.log('getAllRepoList >> ', repoList)
  userInfoLoading.value = false
  if (repoList) {
    userConfigInfo.repoList = repoList
    persistUserConfigInfo()
  } else {
    ElMessage.error('仓库信息获取失败，请稍后重试')
  }
}

async function getDirList() {
  dirLoading.value = true
  const dirList = await getDirInfoList(userConfigInfo)
  console.log('getDirInfoList >> ', dirList)
  dirLoading.value = false
  if (dirList) {
    userConfigInfo.dirList = dirList
  }
  persistUserConfigInfo()
}

const branchModeChange = (mode: BranchModeEnum) => {
  const selBranch = userConfigInfo.selectedBranch
  const bv = userConfigInfo.branchList[0].value

  switch (mode) {
    case BranchModeEnum.newBranch:
      userConfigInfo.dirMode = DirModeEnum.newDir
      userConfigInfo.selectedBranch = ''
      userConfigInfo.selectedDir = ''
      newBranchInputRef.value?.focus()
      break

    case BranchModeEnum.repoBranch:
      if (selBranch !== bv) {
        userConfigInfo.selectedBranch = bv
        getDirList()
      }
      break

    default:
      userConfigInfo.selectedBranch = ''
      break
  }
  persistUserConfigInfo()
}

async function getBranchList(repo: string) {
  branchLoading.value = true
  const { owner, dirMode } = userConfigInfo
  const branchInfoList = await getBranchInfoList(owner, repo)
  console.log('getBranchInfoList >> ', branchInfoList)
  branchLoading.value = false
  if (branchInfoList) {
    if (branchInfoList.length > 0) {
      userConfigInfo.branchList = branchInfoList
      userConfigInfo.selectedBranch = userConfigInfo.branchList[0].value
      userConfigInfo.branchMode = BranchModeEnum.repoBranch
      await getDirList()
    } else {
      userConfigInfo.selectedBranch = INIT_REPO_BARNCH
      userConfigInfo.branchMode = BranchModeEnum.newBranch

      // 当分支列表为空时，判定该仓库为空仓库，需要初始化
      await initEmptyRepo(userConfigInfo)
    }
    dirModeChange(dirMode)
    persistUserConfigInfo()
  } else {
    ElMessage.error('分支信息获取失败，请稍后再试')
  }
}

async function getUserInfo() {
  if (!userConfigInfo.token) {
    ElMessage.error('GitHub Token 不能为空')
    return
  }

  if (!reConfig.value) {
    initReHandConfig()
  }

  userInfoLoading.value = true
  const userInfo = await getGitHubUserInfo(userConfigInfo.token)
  console.log('getGitHubUserInfo >> ', userInfo)

  if (!userInfo) {
    ElMessage.error('用户信息获取失败，请确认 Token 是否正确')
    return
  }

  saveUserInfo(userInfo)
  await getRepoList(userInfo.login)
}

function selectRepo(repo: string) {
  userConfigInfo.branchList = []
  userConfigInfo.dirList = []
  store.dispatch('DIR_IMAGE_LOGOUT')
  getBranchList(repo)
  persistUserConfigInfo()
}

async function selectBranch(branch: string) {
  userConfigInfo.selectedBranch = branch
  await getDirList()
  repoDirCascaderKey.value = userConfigInfo.selectedBranch
  userConfigInfo.selectedDir = userConfigInfo.dirList[0].value
  userConfigInfo.selectedDirList = [userConfigInfo.selectedDir]
  persistUserConfigInfo()
}

const onNewBranchInputBlur = () => {
  const nb = newBranchInputVal.value
  const list = userConfigInfo.branchList
  if (nb) {
    if (!list.find((x: BranchModel) => x.value === nb)) {
      createNewBranch(userConfigInfo, nb, () => {
        ElMessage.success(`新建 ${nb} 成功`)
        userConfigInfo.branchList.push({ value: nb, label: nb })
      })
    } else {
      ElMessage.warning(`${nb} 分支已存在，请在分支列表中选择`)
    }
  } else {
    ElMessage.error('新建分支不能为空')
  }
}

watch(
  () => logined,
  (_n) => {
    if (!_n) {
      userInfoLoading.value = false
      dirLoading.value = false
      branchLoading.value = false
    }
  }
)
</script>

<style scoped lang="stylus">
@import "./my-config.styl"
</style>
