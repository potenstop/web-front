<template>
  <div class="split">
    <Split v-model="split">
      <div slot="left" class="split-pane no-padding">
        <Split v-model="split1" mode="vertical">
          <div slot="top" class="split-pane">
            <Select v-model="chooseLang" clearable style="width:200px" @on-change="changeLang" :clearable="false">
              <Option v-for="item in langs" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
            <Button type="primary" style="float: right" @click="runCode">提交运行</Button>

          </div>
          <div slot="bottom" class="split-pane-left">
            <pre id="editorDiv"></pre>
          </div>
        </Split>
      </div>
      <div slot="right" class="split-pane">
        <pre>{{outputData}}</pre>
      </div>
    </Split>
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script lang="ts">
// 解密
import { Component, Vue } from 'vue-property-decorator'
import Clipboard from 'clipboard'
import Ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import { CodeApi } from '@/dao/api/CodeApi'
import { CodeRunRequest } from '@/request/CodeRunRequest'
@Component
export default class App extends Vue {
  private split: number = 0.6
  private split1: number = 0.1
  private inputData: string = ''
  private outputData: string = ''
  private codeApi = new CodeApi()
  private langs = [{
    'value': 'javascript',
    'label': 'js'
  }, {
    'value': 'java',
    'label': 'java'
  }]
  private chooseLang = 'javascript'
  private editor: Ace.Ace.Editor = null
  private spinShow: boolean = false
  mounted () {
    this.changeLang()
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
  changeLang () {
    document.getElementById('editorDiv').innerHTML = ''
    if (this.editor != null) {
      this.editor.destroy()
    }
    this.editor = Ace.edit('editorDiv', {
      mode: 'ace/mode/' + this.chooseLang,
      theme: 'ace/theme/dracula',
      maxLines: 32,
      minLines: 20,
      fontSize: 18
    })
  }
  async runCode () {
    this.spinShow = true
    const request = new CodeRunRequest()
    request.setLanguage(this.chooseLang)
    request.setCode(this.editor.getValue())
    try {
      const result = await this.codeApi.codeRun(request)
      if (result.getCode() !== '0') {
        this.outputData = result.getMessage()
      } else {
        this.outputData = result.getData()
      }
    } catch (e) {
      this.$Message.warning('执行失败' + e.message)
    } finally {
      this.spinShow = false
    }
  }
}
</script>
<style scoped>
  .split{
    height: 800px;
    border: 1px solid #dcdee2;
  }
  .split-pane{
    padding: 10px;
  }
  .split-pane-left{
    padding: 0;
  }
  .split-pane.no-padding{
    height: 800px;
    padding: 10px;
  }
</style>
