<template>
  <Split v-model="split">
    <div slot="left" class="split-pane no-padding">
      <Split v-model="split1" mode="vertical">
        <div slot="top" class="split-pane">
          <pre id="editDDL"></pre>
        </div>
        <div slot="bottom" class="split-pane">
          <Input v-model="prefixName" size="large" placeholder="前缀名称" style="width: 300px"/>
          <br>
          <Button type="primary" style="margin-top: 10px" @click="runGenerate">提交运行</Button>
        </div>
      </Split>
    </div>
    <div slot="right" class="split-pane">
      <pre id="outController"></pre>
      <pre id="outService"></pre>
      <pre id="outServiceImpl"></pre>
      <pre id="outRequest"></pre>
      <pre id="outResponse"></pre>
    </div>
  </Split>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Ace from 'ace-builds'
import 'ace-builds/webpack-resolver'
import { SqlAnalysis } from '@/bmo/SqlAnalysis'

@Component
export default class App extends Vue {
  private split: number = 0.4
  private split1: number = 0.6
  private ddl: string = ''
  private aceEdit: Ace.Ace.Editor = null
  private controllerAceEdit: Ace.Ace.Editor = null
  private prefixName: string = null
  mounted () {
    this.aceEdit = Ace.edit('editDDL', {
      mode: 'ace/mode/sql',
      theme: 'ace/theme/dracula',
      maxLines: 19,
      minLines: 19,
      fontSize: 18,
      value: ''
    })
  }
  runGenerate () {
    document.getElementById('outController').innerHTML = ''
    if (this.controllerAceEdit) {
      this.controllerAceEdit.destroy()
    }
    this.ddl = this.aceEdit.getValue()
    const sqlAnalysis = new SqlAnalysis(this.ddl, {
      prefixName: this.prefixName,
      logInfo: 'LogUtil.logApplicationInfo',
      returnType: 'AjaxResult'
    })
    this.controllerAceEdit = Ace.edit('outController', {
      mode: 'ace/mode/java',
      theme: 'ace/theme/dracula',
      maxLines: 18,
      minLines: 18,
      fontSize: 18,
      value: sqlAnalysis.toController()
    })
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
.split-pane.no-padding{
  height: 800px;
  padding: 10px;
}
</style>
