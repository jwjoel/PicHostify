<template>
  <div class="page-container settings-page-container">
    <el-collapse>
      <el-collapse-item title="Image Name Settings" name="1">
        <ul class="setting-list" style="margin-top: 10rem">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.defaultHash"
              @change="persistUserSettings"
              active-text="Auto Hash"
            ></el-switch>
            <span class="desc"
              >Automatically add a hash code to the image name before uploading to ensure
              uniqueness. It is highly recommended to enable this.</span
            >
          </li>
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.prefixNaming.enable"
              @change="persistUserSettings"
              active-text="Add Prefix Naming"
            ></el-switch>
            <span class="desc"
              >Automatically add a prefix to the image name before uploading, for example:
              abc-image.jpg, where "abc-" is the prefix.</span
            >
          </li>
          <li class="setting-item has-desc" v-if="userSettings.prefixNaming.enable">
            <el-input
              class="prefix-input"
              v-model="userSettings.prefixNaming.prefix"
              placeholder="Enter the prefix for naming"
              @input="persistUserSettings"
              clearable
              autofocus
            ></el-input>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="Image Watermark Settings" name="2">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.watermark.enable"
              @change="persistUserSettings"
              active-text="Add Watermark"
            ></el-switch>
            <span class="desc"
              >Enable to customize watermark text, font size, position, color, and opacity.</span
            >
          </li>
          <li class="setting-item">
            <el-card class="settings-item-card">
              <watermark-config-box
                :disabled="!userSettings.watermark.enable"
                @watermarkConfig="setWatermarkConfig"
              />
            </el-card>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="Image Compression Settings" name="3">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.compress.enable"
              @change="persistUserSettings"
              active-text="Compress Images"
            ></el-switch>
            <span class="desc"
              >Enable to automatically compress images before uploading, reducing image loading
              highly recommended to enable this.</span
            >
          </li>
          <li class="setting-item">
            <el-card class="settings-item-card">
              <compress-config-box
                ref="compressConfigBoxRef"
                :disabled="!userSettings.compress.enable"
                @encoder=";(userSettings.compress.encoder = $event), persistUserSettings()"
              />
            </el-card>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="Image Link Rule Configuration" name="4">
        <ul class="setting-list">
          <li class="setting-item cdn">
            Select an image link rule:
            <el-select
              v-model="userSettings.imageLinkType.selected"
              placeholder="Select an image link rule"
              @change="saveUserSettings"
            >
              <el-option
                v-for="item in userSettings.imageLinkType.presetList"
                :key="item.name + '-' + item.id"
                :label="item.name"
                :value="item.name"
                class="image-link-type-rule-option"
              >
                <span class="left">{{ item.name }}</span>
                <span class="right">{{ item.rule }}</span>
              </el-option>
            </el-select>
          </li>
          <li class="setting-item" style="margin-top: 20rem">
            <image-link-rule-config />
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="Image Link Format Settings" name="5">
        <ul class="setting-list">
          <li class="setting-item has-desc">
            <el-switch
              v-model="userSettings.imageLinkFormat.enable"
              @change="persistUserSettings"
              active-text="Auto Convert Image Link Format"
            ></el-switch>
            <span class="desc">
              When copying the image link after successful upload, it will be in the
              {{ userSettings.imageLinkFormat.selected }} format.
            </span>
          </li>
          <li class="setting-item">
            Select an image link format:
            <el-select
              v-model="userSettings.imageLinkFormat.selected"
              placeholder="Select an image link format"
              @change="saveUserSettings"
            >
              <el-option
                v-for="item in userSettings.imageLinkFormat.presetList"
                :key="item.name"
                :label="item.name"
                :value="item.name"
                class="image-link-type-rule-option"
              >
                <span class="left">{{ item.name }}</span>
                <span class="right">{{ item.format }}</span>
              </el-option>
            </el-select>
          </li>
        </ul>
      </el-collapse-item>

      <el-collapse-item title="Theme Settings" name="6">
        <ul class="setting-list">
          <li class="setting-item">
            Select a theme mode:
            <el-select
              v-model="userSettings.theme.mode"
              placeholder="Theme Mode"
              @change="saveUserSettings"
            >
              <el-option label="Follow System" :value="ThemeModeEnum.follow"></el-option>
              <el-option label="Light Theme" :value="ThemeModeEnum.light"></el-option>
              <el-option label="Dark Theme" :value="ThemeModeEnum.dark"></el-option>
            </el-select>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { store } from '@/store'
import { ThemeModeEnum, UserSettingsModel } from '@/common/model'

const userSettings = computed(() => store.getters.getUserSettings).value

const persistUserSettings = () => {
  store.dispatch('USER_SETTINGS_PERSIST')
}

const saveUserSettings = () => {
  store.dispatch('SET_USER_SETTINGS', {
    ...userSettings
  })
  persistUserSettings()
}

const setWatermarkConfig = (config: UserSettingsModel['watermark']) => {
  userSettings.watermark.text = config.text
  userSettings.watermark.textColor = config.textColor
  userSettings.watermark.opacity = config.opacity
  userSettings.watermark.position = config.position
  userSettings.watermark.fontSize = config.fontSize
  persistUserSettings()
}
</script>

<style scoped lang="stylus">
@import "my-settings.styl"
</style>
