<template>
  <div id="app">
    <router-view :key="key"></router-view>
  </div>
</template>

<script>
import API from '@/api/index'
import { mapState, mapMutations } from "vuex";
export default {
  name: "App",
  computed: {
    key() {
      return this.$route.path + Math.random();
    },
    ...mapState(['token']),
  },
  created(){
    this.getUserInfo()
  },
  methods:{
    getUserInfo(){
       API.getUserInfo(this.token).then((res)=>{
        if(res.code == 0){ }
      })
    }
  }
};
</script>

<style>
* {
  padding: 0;
  margin: 0;
}
body,
html {
  height: 100%;
}
li,
ul {
  list-style: none;
}
#app {
  font-family: "Micorsoft Yahei", "HYe1gj", "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
</style>
