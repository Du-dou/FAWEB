<template>
</template>

<script>
import md5 from "js-md5";
import API from "@/api/index.js";
import {mapMutations, mapState} from "vuex";
import crypto from '../../utils/crypto/ctypto.js'

export default {
  name: "login2.vue",

  data(){
    return{
      params:''
    }
  },
  created(op) {
    this.params = this.$route.query.to
  },
  beforeMount() {
    this.Jump()
  },
  methods:{
    ...mapMutations(["login","getToken"]),
    Jump(){
      // console.log(this.params)
      // console.log('加密后',crypto.set('eft0002,eft0002eft'))

      let a = crypto.get(this.params, '')
      console.log(a)
      let b = a.split(',')
      let username = b[0]
      let pwd = b[1]

      let that = this;
      API.userLogin({
        userName:username,
        pwd:md5(pwd),
        code:'',
        type:1
      }).then((res)=>{
        console.log(res.data)
        if(res.code === 0){
          console.log('登录成功')

          that.getUserInfoRequest(res.data.token)
        }else{
          console.log('登录失败')
        }
        this.$router.push('/home');
      }).catch((err)=>{
        console.log(err)
      })
    },
    getUserInfoRequest(token){
      let that = this;
      API.getUserInfo().then((res)=>{
        if(res.code == 0){
          console.log(res.data)
          that.getToken(token);
          that.login(res.data);
          // that.$emit("handleLoginClose");
          // that.$emit("loginSuccess");
        }
      })
    }
  }
}

</script>

<style scoped>

</style>
