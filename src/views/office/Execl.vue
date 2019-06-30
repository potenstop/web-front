<template>
  <div id="x-spreadsheet"></div>
</template>

<script lang="ts">
import Spreadsheet from 'x-data-spreadsheet'
import zhCN from 'x-data-spreadsheet/dist/locale/zh-cn'
import { Component, Vue } from 'vue-property-decorator'
import { LangBean } from '@/bmo/LangBean'
@Component
export default class App extends Vue {
  mounted () {
    Spreadsheet.locale('zh-cn', zhCN)
    const s = new Spreadsheet('#x-spreadsheet')
      .loadData({}) // load data
      .change(data => {
        // save data to db
      })
    s.validate()
  }
}
</script>

<style scoped>

</style>
