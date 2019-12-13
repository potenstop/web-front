<template>
  <div class="demo-split">
    <Split v-model="split">
      <div slot="left" class="demo-split-left-pane">
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
        <Input v-model="inputData" type="textarea" :rows="18" placeholder="输入json" style="width: 100%;height: 1000px;display: block;max-width:100%" />
      </div>
      <div slot="right" class="demo-split-right-pane">
      </div>
    </Split>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class MathFormulaEditor extends Vue {
  private name = 'MathFormulaEditor'
  private split: number = 0.5
  private inputData: string = ''

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
