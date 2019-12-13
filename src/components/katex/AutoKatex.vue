<template>
  <div v-html="htmlData">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import katex from 'katex'
import { JSHelperUtil, StringUtil } from 'papio-h5'

@Component
export default class AutoKatex extends Vue {
  private name = 'AutoKatex'
  @Prop({ default: '' }) readonly data!: string;
  private htmlData = ''

  private created () {
    // katex.renderToString()
    this.katexRender()
  }

  @Watch('data')
  private dataChanged () {
    this.katexRender()
  }

  private katexRender () {
    const data = this.data
    const delimiters = '$$'
    const delimitersLength = delimiters.length
    if (StringUtil.isEmpty(data)) {
      return
    }
    let pos = data.indexOf(delimiters)
    const positions = []
    while (pos > -1) {
      positions.push(pos)
      pos = data.indexOf(delimiters, pos + delimitersLength)
    }
    let htmlData = ''
    if (positions.length <= 1) {
      // 没有公式
      htmlData = this.getSpanHtml(data)
    } else {
      // 存在公式
      // 处理index=1
      htmlData += this.getSpanHtml(data.substring(0, positions[0]))
      // 遍历下标数据
      for (let index = 1; index <= positions.length - 1; index++) {
        const current = positions[index]
        // 下标为奇数 则开始 偶数数为结束
        if (index % 2 !== 0) {
          const d = katex.renderToString(data.substring(positions[index - 1] + delimitersLength, current), { throwOnError: false })
          htmlData += d
        } else {
          htmlData += this.getSpanHtml(data.substring(positions[index - 1] + delimitersLength, current))
        }
      }
      htmlData += this.getSpanHtml(data.substring(positions[positions.length - 1] + delimitersLength))
    }
    this.htmlData = htmlData
  }
  private getSpanHtml (str): string {
    // 换行替换为</br>
    return `<span>${str}</span>`
  }
}
</script>

<style scoped>

</style>
