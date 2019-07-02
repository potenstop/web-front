<template>
  <Split v-model="split">
    <Spin></Spin>
    <div slot="left" class="split-pane no-padding">
      <Split v-model="split1" mode="vertical">
        <div slot="top" class="split-pane">
          <pre id="editDDL"></pre>
        </div>
        <div slot="bottom" class="split-pane">
          <p>
            <Input v-model="prefixName" size="large" placeholder="前缀名称 order-item" style="width: 200px; margin-right: 10px"/>
            <Input v-model="returnType" size="large" placeholder="返回类型名称 Result" style="width: 200px"/>
          </p>
          <br>
          <CheckboxGroup v-model="chooseOptions">
            <Checkbox label="requestHump">
              <span>request驼峰</span>
            </Checkbox>
            <Checkbox label="responseHump">
              <span>response驼峰</span>
            </Checkbox>
          </CheckboxGroup>
          <Select v-model="chooseJsonParse" style="width:200px; margin-top: 10px">
            <Option value="jackson">jackson</Option>
            <Option value="fastjson">fastjson</Option>
          </Select>
          <br>
          <Button type="primary" style="margin-top: 10px" @click="runGenerate">提交运行</Button>
        </div>
      </Split>
    </div>
    <div slot="right" class="split-pane">
      <Tabs v-model="classFileName" @on-click="onClassFileName" style="padding: 0;margin: 0">
        <TabPane v-for="item in fileNames" :label="item + '.java'" :name="item" :key="item" >
        </TabPane>
      </Tabs>
      <pre id="outCode"></pre>
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
  private outCodeAceEdit: Ace.Ace.Editor = null
  private prefixName: string = null
  private returnType: string = null
  private fileNames: string[] = []
  private classFileName: string = ''
  private sqlAnalysis: SqlAnalysis = null
  private chooseOptions: string[] = ['requestHump', 'responseHump']
  private chooseJsonParse: 'fastjson' | 'jackson' = 'fastjson'
  private spin: boolean = false
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
    if (!this.returnType) {
      this.$Message.warning('返回类型必填')
      return
    }
    this.ddl = this.aceEdit.getValue()
    this.spin = true
    this.sqlAnalysis = new SqlAnalysis(this.ddl, {
      prefixName: this.prefixName,
      logInfo: 'LogUtil.logApplicationInfo',
      returnType: this.returnType,
      requestHump: this.chooseOptions.indexOf('requestHump') !== -1,
      responseHump: this.chooseOptions.indexOf('responseHump') !== -1,
      jsonParse: this.chooseJsonParse
    })
    this.spin = false
    if (this.sqlAnalysis.getErrorMessage()) {
      this.$Message.error(this.sqlAnalysis.getErrorMessage())
      return
    }
    this.fileNames = this.sqlAnalysis.getAllFileNames()
    if (this.fileNames.length > 0) {
      this.classFileName = this.fileNames[0]
      this.onClassFileName()
    }
  }
  onClassFileName () {
    const value = this.sqlAnalysis.getCodeByClassFiles(this.classFileName)
    if (this.outCodeAceEdit) {
      this.outCodeAceEdit.session.setValue(value)
      return
    }
    this.outCodeAceEdit = Ace.edit('outCode', {
      mode: 'ace/mode/java',
      theme: 'ace/theme/dracula',
      maxLines: 50,
      minLines: 18,
      fontSize: 18,
      value: this.sqlAnalysis.getCodeByClassFiles(this.classFileName)
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
