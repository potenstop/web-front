<!--<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/sequence/json">About</router-link>
    </div>
    <router-view/>
  </div>
</template>

<style lang="less">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>-->
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
      <MenuItem name="/code">代码</MenuItem>
    </Menu>
    <router-view/>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import '@/config/HttpApiConfiguration'
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
