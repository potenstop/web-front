<template>
  <div>
    <Menu mode="horizontal" :theme="theme1" active-name="1" @on-select="navigateTo">
      <Submenu name="/sequence">
        <template slot="title">
          <Icon type="ios-stats" />
          序列化
        </template>
        <MenuItem name="/sequence/json">json</MenuItem>
      </Submenu>
      <Submenu name="/encrypt">
        <template slot="title">
          <Icon type="ios-analytics" />
          加解密
        </template>
        <MenuItem name="/encrypt/decode">加密</MenuItem>
        <MenuItem name="/encrypt/encode">解密</MenuItem>
      </Submenu>
      <MenuItem name="/code"><Icon type="ios-easel-outline" />代码执行</MenuItem>
      <!--<Submenu name="/office">-->
        <!--<template slot="title">-->
          <!--<Icon type="ios-stats" />-->
          <!--在线办公-->
        <!--</template>-->
        <!--<MenuItem name="/office/execl">execl</MenuItem>-->
      <!--</Submenu>-->
      <Submenu name="/generate">
        <template slot="title">
          <Icon type="ios-stats" />
          代码生成
        </template>
        <MenuItem name="/generate/spring-boot">spring-boot 接口生成</MenuItem>
      </Submenu>
      <Submenu name="/editor">
        <template slot="title">
          <Icon type="ios-cash" />
          编辑器
        </template>
        <MenuItem name="/editor/math-formula">数学公式</MenuItem>
      </Submenu>
    </Menu>
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Setting } from 'papio-h5'
import '@/config/HttpApiConfiguration'
Setting.setDebug(true)
@Component
export default class App extends Vue {
  private theme1: string = 'light';
  navigateTo (name: string) {
    this.$router.push(name)
  }
}
</script>

<style lang="less">

</style>
