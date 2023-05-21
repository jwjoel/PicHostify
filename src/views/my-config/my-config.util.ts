import { computed } from 'vue'
import { store } from '@/store'
import { BranchModeEnum, DirModeEnum } from '@/common/model'
import { createRepo, getGitHubUserInfo, initEmptyRepo } from '@/common/api'
import { INIT_REPO_BARNCH, INIT_REPO_NAME } from '@/common/constant'
import { formatDatetime } from '@/utils'
import router from '@/router'

const userConfigInfo = computed(() => store.getters.getUserConfigInfo).value

/**
 * 重置图床配置
 */
export const resetConfig = () => {
  store.dispatch('LOGOUT')
}

/**
 * 持久化用户图床配置信息
 */
export const persistUserConfigInfo = () => {
  store.dispatch('USER_CONFIG_INFO_PERSIST')
}

/**
 * 保存用户信息
 * @param userInfo
 */
export function saveUserInfo(userInfo: any) {
  userConfigInfo.logined = true
  userConfigInfo.owner = userInfo.login
  userConfigInfo.name = userInfo.name
  userConfigInfo.email = userInfo.email
  userConfigInfo.avatarUrl = userInfo.avatar_url
  persistUserConfigInfo()
}

/**
 * 重新手动配置图床，清空之前的配置信息
 */
export const initReHandConfig = () => {
  userConfigInfo.selectedRepo = ''
  userConfigInfo.repoList = []
  userConfigInfo.selectedBranch = ''
  userConfigInfo.branchMode = BranchModeEnum.repoBranch
  userConfigInfo.branchList = []
  userConfigInfo.selectedDir = ''
  userConfigInfo.dirMode = DirModeEnum.repoDir
  userConfigInfo.dirList = []
}

/**
 * 去往图片上传页面
 */
export const goUploadPage = async () => {
  const { selectedDir, dirMode } = userConfigInfo
  let warningMessage: string = 'Directory cannot be empty!'

  if (selectedDir === '') {
    switch (dirMode) {
      case DirModeEnum.newDir:
        warningMessage = 'Please enter a new directory in the input box!'
        break
      case DirModeEnum.repoDir:
        warningMessage = `Please select a directory under the ${userConfigInfo.selectedRepo} repository!`
        break
      default:
        warningMessage = 'Please enter a new directory in the input box!'
        break
    }
    ElMessage.warning(warningMessage)
  } else {
    await router.push('/upload')
  }
}

/**
 * 一键自动配置图床
 */
export const oneClickAutoConfig = async () => {
  const { token } = userConfigInfo

  if (!token) {
    ElMessage.error('GitHub Token cannot be empty')
    return
  }

  const loading = ElLoading.service({
    lock: true,
    text: 'Auto configuring...'
  })

  const userInfo = await getGitHubUserInfo(userConfigInfo.token)
  console.log('getGitHubUserInfo >> ', userInfo)

  if (!userInfo) {
    loading.close();
    ElMessage.error('Failed to retrieve user information. Please check if the Token is correct');
    return;
  }

  saveUserInfo(userInfo);

  const repoInfo = await createRepo(userConfigInfo.token)
  console.log('createRepo >> ', repoInfo)

  if (!repoInfo) {
    loading.close();
    ElMessage.error('Failed to create GitHub repository. Please try again later')
    return;
  }

  userConfigInfo.repoList = [{ value: INIT_REPO_NAME, label: INIT_REPO_NAME }]
  userConfigInfo.selectedRepo = INIT_REPO_NAME
  userConfigInfo.branchList = [{ value: INIT_REPO_BARNCH, label: INIT_REPO_BARNCH }]
  userConfigInfo.selectedBranch = INIT_REPO_BARNCH
  userConfigInfo.branchMode = BranchModeEnum.repoBranch
  userConfigInfo.selectedDir = formatDatetime('yyyyMMdd')
  userConfigInfo.dirMode = DirModeEnum.autoDir
  userConfigInfo.dirList = []
  persistUserConfigInfo()
  await initEmptyRepo(userConfigInfo, false)
  loading.close()
  ElMessage.success('Auto configuration successful')
  await router.push('/upload')
}
