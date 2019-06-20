<template>
  <div class="demo-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-left-pane">
        <Input v-model="inputData" type="textarea" :rows="18" placeholder="输入json" style="width: 100%;height: 1000px;display: block;max-width:100%" />
      </div>
      <div slot="right" class="demo-split-right-pane">
        <ButtonGroup size="small">
          <Button icon="md-copy" class="copyOrderSn" style="border-width: 0;" data-clipboard-action="copy" :data-clipboard-text="outData" @click="copyLink">copy</Button>
          <Button icon="md-plane" style="border-width: 0;" @click="changeCodeType('json')">json</Button>
          <Button icon="logo-nodejs format" style="border-width: 0;" @click="changeCodeType('JavaScript')">js</Button>
        </ButtonGroup>
        <hr align="center" color="#987cb9" size="1">
        <pre id="code" :class="codeType" ></pre>
      </div>

    </Split>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Highlight from 'highlight.js'
import { SysUtil } from '@/common/util/SysUtil'
import Clipboard from 'clipboard'

@Component
export default class App extends Vue {
  private split: number = 0.5
  private inputData: string = ''
  private outData: string = ''
  private codeType: string = 'json'
  changeCodeType (type: string) {
    if (type === 'json') {
      this.codeType = 'json'
      try {
        this.outData = JSON.stringify(SysUtil.evil('(' + this.inputData + ')'), null, 2)
      } catch (e) {
        this.outData = 'error format: ' + e.message
      }
    }
    console.log('start draw ', this.outData)
    this.drawResCode(this.outData)
  }
  drawResCode (content: string) {
    const target = document.getElementById('code')
    if (target) {
      target.textContent = content
      Highlight.highlightBlock(target)
    }
  }
  copyLink () {
    if (!this.outData) {
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

<style lang="less" scoped>
@import "../../assets/icons/iconfont.css";
.demo-split{
  height: 400px;
  border: 1px solid #dcdee2;
}
.demo-split-left-pane{
  overflow:hidden;
  padding-right: 3px;
}
.demo-split-right-pane{
  padding-left: 5px;
}
</style>
