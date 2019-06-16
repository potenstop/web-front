<template>
  <div class="about">
    <h1>This is an about page{{value}}</h1>
    <Input v-model="value" placeholder="Enter something..." style="width: 300px" />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class About extends Vue {
  private value!: string;
}
</script>
