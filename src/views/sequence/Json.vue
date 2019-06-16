<template>
  <div>
    <!--<Input v-model="inputData" placeholder="Enter something..." style="width: 300px" />-->
      <div class="editor-w clearfix">
        <div class="w-2">
          <div class="editor">
            <JsonEditor
              :options="{confirmText: 'confirm',cancelText: 'cancel'}"
              :objData="jsonData"
              v-model="jsonData" ></JsonEditor>
          </div>
        </div>
        <div class="w-2">
          <div class="code-pre">
            <div slot="content">
              <pre>
                <code class="json" id="res_code"></code>
              </pre>
            </div>
          </div>
        </div>
    </div>

  </div>
</template>
<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import hljs from 'highlight.js'
@Component
export default class Json extends Vue {
    private inputData!: string;
    private jsonData = {
      name: 'mike',
      age: 23,
      phone: '18552129932',
      address: ['AAA C1', 'BBB C2']
    };
    @Watch('jsonData')
    onJsonData (old: any, n: any) {
      let c = this.formatJson(JSON.stringify(this.jsonData), false)
      this.drawResCode(c)
    }
    formatJson (txt: string, compress: boolean) {
      /* 格式化JSON源码(对象转换为JSON文本) */
      var indentChar = '  '
      if (/^\s*$/.test(txt)) {
        console.error('数据为空,无法格式化! ')
        return
      }
      try {
        var data = eval('(' + txt + ')')
      } catch (e) {
        throw ('数据源语法错误,格式化失败! 错误信息: ' + e.description, 'err')
      }
      var draw = []
      var last = false
      var This = this
      var line = compress ? '' : '\n'
      var nodeCount = 0
      var maxDepth = 0
      var notify = function (name, value, isLast, indent /* 缩进 */, formObj) {
        nodeCount++ /* 节点计数 */
        for (var i = 0, tab = ''; i < indent; i++) tab += indentChar /* 缩进HTML */
        tab = compress ? '' : tab /* 压缩模式忽略缩进 */
        maxDepth = ++indent /* 缩进递增并记录 */
        if (value && value.constructor == Array) {
          /* 处理数组 */
          draw.push(
            tab + (formObj ? '"' + name + '":' : '') + '[' + line
          ) /* 缩进'[' 然后换行 */
          for (var i = 0; i < value.length; i++) { notify(i, value[i], i == value.length - 1, indent, false) }
          draw.push(
            tab + ']' + (isLast ? line : ',' + line)
          ) /* 缩进']'换行,若非尾元素则添加逗号 */
        } else if (value && typeof value === 'object') {
          /* 处理对象 */
          draw.push(
            tab + (formObj ? '"' + name + '":' : '') + '{' + line
          ) /* 缩进'{' 然后换行 */
          var len = 0
          var i = 0
          for (var key in value) len++
          for (var key in value) notify(key, value[key], ++i == len, indent, true)
          draw.push(
            tab + '}' + (isLast ? line : ',' + line)
          ) /* 缩进'}'换行,若非尾元素则添加逗号 */
        } else {
          if (typeof value === 'string') value = '"' + value + '"'
          draw.push(
            tab +
            (formObj ? '"' + name + '":' : '') +
            value +
            (isLast ? '' : ',') +
            line
          )
        }
      }
      var isLast = true
      var indent = 0
      notify('', data, isLast, indent, false)
      return draw.join('')
    }
    drawResCode (content) {
      const target = document.getElementById('res_code')
      target.textContent = content
      hljs.highlightBlock(target)
    }
    mounted () {
      let c = this.formatJson(JSON.stringify(this.jsonData), false)
      this.drawResCode(c)
    }
}
</script>

<!--<script>
export default {
  name: 'app',
  data: function () {
    return {
      jsonData: {
        name: 'may',
        age: 23,
        address: ['Panyu Shiqiao on Canton', 'Tianhe', {
          city: 'forida meta 11'
        }],
        ohters: {
          id: 1246,
          joinTime: '2017-08-20. 10:20',
          description: 'another'
        }
      }
    }
  },
  watch: {
    'jsonData': function () {
      console.log("==================")
    }
  }
}
</script>-->
<style scoped>

</style>
