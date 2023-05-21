import { shallowRef } from 'vue'
import { getUuid } from '@/utils'

export const navInfoList = shallowRef([
  {
    uuid: getUuid(),
    name: 'Config',
    icon: IEpEdit,
    isActive: false,
    path: '/config',
    isShow: true
  },
  {
    uuid: getUuid(),
    name: 'Upload',
    icon: IEpUpload,
    isActive: false,
    path: '/upload',
    isShow: true
  },
  {
    uuid: getUuid(),
    name: 'Management',
    icon: IEpPicture,
    isActive: false,
    path: '/management',
    isShow: true
  },
  {
    uuid: getUuid(),
    name: 'Settings',
    icon: IEpSetting,
    isActive: false,
    path: '/settings',
    isShow: true
  },
  {
    uuid: getUuid(),
    name: 'Toolbox',
    icon: IEpFiles,
    isActive: false,
    path: '/toolbox',
    isShow: true
  },
  {
    uuid: getUuid(),
    name: 'Feedback',
    icon: IEpChatDotRound,
    isActive: false,
    path: '/feedback',
    isShow: true
  }
])
