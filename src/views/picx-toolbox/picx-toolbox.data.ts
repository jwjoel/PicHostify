import { shallowRef } from 'vue'
import { ToolItemModel } from '@/common/model'
import { getUuid } from '@/utils'

export const toolboxList = shallowRef<ToolItemModel[]>([
  {
    name: 'Image Compression',
    desc: 'Ultimate offline compression without limitations on image size and quantity',
    icon: IEpMagicStick,
    uuid: getUuid(),
    path: '/compress'
  },
  {
    name: 'Image to Base64',
    desc: 'Convert images to Base64 encoding online without limitations on size and quantity',
    icon: IEpPaperclip,
    uuid: getUuid(),
    path: '/base64'
  },
  {
    name: 'Image Watermark',
    desc: 'Customize watermark text, font size, position, color, and opacity',
    icon: IEpPostcard,
    uuid: getUuid(),
    path: '/watermark'
  }
])
