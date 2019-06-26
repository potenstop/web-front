<template>
  <div class="demo-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-left-pane">
        <Input v-model="inputData" type="textarea" :rows="18" placeholder="输入json" style="width: 100%;height: 1000px;display: block;max-width:100%" />
      </div>
      <div slot="right" class="demo-split-right-pane">
        <ButtonGroup size="small">
          <Tooltip placement="top" content="复制">
            <Button icon="md-copy" class="copyOrderSn" style="border-width: 0;" data-clipboard-action="copy" :data-clipboard-text="copyData" @click="copyLink"></Button>
          </Tooltip>
          <Tooltip placement="top" content="json格式化">
            <Button custom-icon="iconfont icon-json" style="border-width: 0;" @click="changeCodeType('json')"></Button>
          </Tooltip>
          <Tooltip placement="top" content="json压缩">
            <Button custom-icon="iconfont icon-jsongeshihua" style="border-width: 0;" @click="changeCodeType('jsonString')"></Button>
          </Tooltip>
          <Tooltip placement="top" content="java bean">
            <Button custom-icon="iconfont icon-java" style="border-width: 0;" @click="changeCodeType('java')"></Button>
          </Tooltip>
          <Tooltip placement="top" content="ts bean">
            <icon type="ios-infinite" style="border-width: 0;" @click="changeCodeType('typescript')"/>
          </Tooltip>
        </ButtonGroup>
        <hr align="center" color="#987cb9" size="1">
        <pre><code class="nohighlight" v-html="outData"></code></pre>
      </div>

    </Split>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import Highlight from 'highlight.js'
import { SysUtil } from '@/common/util/SysUtil'
import Clipboard from 'clipboard'
import { LangBean } from '@/bmo/LangBean'
import { Autowired, Configuration } from 'papio-common'
import { MemberApi } from '@/dao/api/MemberApi'

@Component
export default class App extends Vue {
  private split: number = 0.5
  private inputData: string = '{"id":1, "name":"111", isOld: false, price: 1.222, "b":{"c":2},"times": [{"date": "2019"}]}'
  private outData: string = ''
  private codeType: string = 'json'
  private copyData: string = ''
  changeCodeType (type: string) {
    let json: any = {}
    try {
      json = SysUtil.evil('(' + this.inputData + ')')
    } catch (e) {
      this.drawResCode(e.toString())
      this.codeType = 'plaintext'
      return
    }
    if (type === 'json') {
      this.codeType = 'json'
      this.outData = JSON.stringify(json, null, 2)
    } else if (type === 'jsonString') {
      this.outData = JSON.stringify(json, null)
      this.codeType = 'plaintext'
    } else if (type === 'java') {
      const langBean = new LangBean(json)
      this.outData = langBean.toJavaString()
      this.codeType = 'java'
    } else if (type === 'typescript') {
      const langBean = new LangBean(json)
      this.outData = langBean.toTypeString()
      this.codeType = 'typescript'
    }
    this.drawResCode(this.outData)
  }
  drawResCode (content: string) {
    this.copyData = content
    const html = Highlight.highlightAuto(content, [this.codeType]).value
    const list = html.split('\n')
    this.outData = html
  }
  copyLink () {
    if (!this.copyData) {
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
  height: 100%;
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
