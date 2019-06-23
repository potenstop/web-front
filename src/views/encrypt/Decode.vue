<template>
  <div class="split">
    <Split v-model="split">
      <div slot="left" class="split-pane no-padding">
        <Split v-model="split1" mode="vertical">
          <div slot="top" class="split-pane-left">
            <Input v-model="inputData" type="textarea" :rows="4"  style="resize: none;" placeholder="Enter something..." />
          </div>
          <div slot="bottom" class="split-pane">
            <div style="border-bottom: 1px solid #e9e9e9;padding-bottom:6px;margin-bottom:6px;">
              <Checkbox
                :indeterminate="indeterminate"
                :value="checkAll"
                @click.prevent.native="handleCheckAll">全选</Checkbox>
            </div>
            <CheckboxGroup v-model="chooseEncryptTypes" @on-change="checkAllGroupChange">
              <Checkbox :label="item.name" v-for="item in encryptTypes" :key="item.name">
                <span>{{item.desc}}</span>
              </Checkbox>
            </CheckboxGroup>
            <div v-if="hasSalt">
              <Input v-model="salt" size="small" placeholder="秘钥"/>
            </div>
            <Button type="primary" @click="transform" style="margin-top: 3px">转换</Button>
          </div>
        </Split>
      </div>
      <div slot="right" class="split-pane">
        <div v-for="item in this.transformResults" :key="item.name">
          <span style="color: #2db7f5">{{item.name}}:</span>
          <span>{{item.data}}</span>
          &nbsp;&nbsp;
          <Button type="primary" class="copyOrderSn" data-clipboard-action="copy" :data-clipboard-text="item.data" @click="copyLink" size="small">复制</Button>
        </div>
      </div>
    </Split>
  </div>
</template>

<script lang="ts">
// 加密
import { Component, Vue, Watch } from 'vue-property-decorator'
import { EncryptType } from '@/bmo/EncryptType'
import { EncryptResult } from '@/bmo/EncryptResult'
import { EncryptUtil } from '@/common/util/EncryptUtil'
import Clipboard from 'clipboard'

@Component
export default class App extends Vue {
  private split: number = 0.5
  private split1: number = 0.3
  private inputData: string = ''
  private outputData: string[] = []
  private encryptTypes = EncryptUtil.getDecodeTypeList()
  private chooseEncryptTypes: string[] = []
  private indeterminate = true
  private checkAll = true
  private transformResults: EncryptResult[] = []
  private hasSalt: boolean = false
  private salt: string = ''

  handleCheckAll () {
    if (this.indeterminate) {
      this.checkAll = false
    } else {
      this.checkAll = !this.checkAll
    }
    this.indeterminate = false
    if (this.checkAll) {
      this.chooseEncryptTypes = this.encryptTypes.map(v => v.name)
    } else {
      this.chooseEncryptTypes = []
    }
    this.hasSetSlat()
  }
  checkAllGroupChange (data: string[]) {
    if (data.length === this.encryptTypes.length) {
      this.indeterminate = false
      this.checkAll = true
    } else if (data.length > 0) {
      this.indeterminate = true
      this.checkAll = false
    } else {
      this.indeterminate = false
      this.checkAll = false
    }
    this.hasSetSlat()
  }
  hasSetSlat () {
    this.chooseEncryptTypes.forEach(v => {
      this.encryptTypes.forEach(item => {
        if (item.name === v && item.hasSalt) {
          this.hasSalt = true
        }
      })
    })
  }
  transform () {
    this.transformResults = []
    for (const item of this.chooseEncryptTypes) {
      this.transformResults.push(EncryptUtil.decode(item, this.inputData, this.salt))
    }
  }
  copyLink (data: string) {
    if (!data) {
      this.$Message.warning('文本为空')
      return
    }
    let clipboard = new Clipboard('.copyOrderSn')
    clipboard.on('success', (e) => {
      e.clearSelection()
      clipboard.destroy()
      this.$Message.success('复制成功')
    })
    clipboard.on('error', (e) => {
      e.clearSelection()
      clipboard.destroy()
      this.$Message.error('失败')
    })
  }
}
</script>
<style scoped>
  .split{
    height: 300px;
    border: 1px solid #dcdee2;
  }
  .split-pane{
    padding: 10px;
  }
  .split-pane-left{
    padding: 0;
  }
  .split-pane.no-padding{
    height: 300px;
    padding: 0;
  }
</style>
