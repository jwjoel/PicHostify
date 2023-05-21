import { loadEnv } from 'vite'
import type { UserConfig, ConfigEnv } from 'vite'
import * as path from 'path'
import createVitePlugins from './src/plugins/vite'
import wrapperEnv from './src/utils/env'

export default ({ command, mode }: ConfigEnv): UserConfig => {
  const root = process.cwd()
  const env = loadEnv(mode, root)
  const isBuild = command === 'build'
  const viteEnv = wrapperEnv(env)

  return {
    plugins: createVitePlugins(viteEnv, isBuild),
    resolve: {
      alias: [
        {
          find: '@',
          replacement: '/src'
        }
      ]
    },
    css: {
      preprocessorOptions: {
        stylus: {
          imports: [path.resolve(__dirname, 'src/styles/variables.styl')],
          additionalData: `
            $picx-primary-color = #4975c6
          `
        }
      }
    },
    base: './',
    optimizeDeps: {
      exclude: ['@yireen/squoosh-browser']
    },
    server: {
      port: 4000,
      open: true,
      cors: true
    }
  }
}
