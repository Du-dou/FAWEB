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
</style>
