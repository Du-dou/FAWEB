<template>
  <div class="login_ouer">
    <h5>注册</h5>
    <form>
      <div class="user_name_wraper">
        <!-- <img src="@/static/userName.png"> -->
        <input type="number" v-model="registerPhone" placeholder="请输入手机号" >
      </div>
      <div class="user_password_wraper">
        <!-- <img src="@/static/password.png"> -->
        <input type="password" v-model="userPassword" placeholder="请输入密码（8-18位，同时包含字母与数字）">
      </div>
      <div class="code_wraper">
        <div class="password_wraper">
           <input type="text" v-model.trim="verificationCode"  placeholder="请输入图形码">
        </div>
        <div class="captchaCode">
          <img :src="'data:image/png;base64,'+captcha" @click="getCodeCaptcha">
        </div>
      </div>
      <div class="code_wraper">
        <div class="password_wraper">
           <input type="text" v-model.trim="code" placeholder="请输入手机验证码">
        </div>
        <button class="code_btn" @click.prevent="sendCode" :disabled="disabled">{{btnText}}</button>
      </div>
      <div class="tips">
        <div class="warn_w" v-show="tipsShow">
          <img src="@/static/tips.png" />
          <span class="warn_text"
            >{{tips}}</span
          >
        </div>
      </div>

      <button class="login_btn" :disabled="registerDisabled" @click.prevent="handelRegister">注册</button>
      <div class="login_bottom">
        <div class="left">
          <img :src="isRemember?CheckboxChecked:CheckboxUnchecked" @click="remember">
          <span>我已阅读并同意</span>
          <span class="active">《易知服务条款》</span>
        </div>
      </div>
    </form>
    <div class="close_wraper" @click="handleClose">
      <img src="@/static/close.png" />
    </div>
  </div>
</template>
<script>
import md5 from 'js-md5'
import API from '@/api/index'
import CheckboxChecked from "@/static/CheckboxChecked.png";
import CheckboxUnchecked from "@/static/CheckboxUnchecked.png";
export default {
  data(){
    return {
      CheckboxChecked,
      CheckboxUnchecked,
      tipsShow:false,
      isRemember:false,
      registerPhone:'',//注册手机号
      tips:'',//6-16位字符（字母、数字、符号)，区分大小写
      disabled:false,
      registerDisabled:false,
      timer:null,
      btnText:'获取验证码',
      userPassword:'',
      code:'',
      captcha:'',
      verificationCode:''
    }
  },
  created(){
    this.getCodeCaptcha()
  },
  methods: {
    handleClose() {
      this.$emit("handleRegisterClose");
    },
    remember(){//记住密码
      this.isRemember = !this.isRemember
    },
    getCodeCaptcha(){//获取图形验证码
      API.getCodeCaptcha().then((res)=>{
        // console.log(res)
        if(res.code == 0){
          this.captcha = res.data
        }
      })
    },
    sendCode(){//发送验证码

      let reg = /^1[2|3|4|5|6|7|8|9][0-9]{9}$/;
      if(!reg.test(this.registerPhone)){
        this.tipsShow = true;
        this.tips = '请输入正确的手机号';
        return false;
      }else{
        this.tipsShow = false;
        this.disabled = true;
        this.getCode(this.registerPhone)
      }
    },
    getCode(phone){//获取验证码
      API.sendCode({
        action:0,
        to:phone
      }).then((res)=>{
        if(res.code == 0){
          this.countTime()
        }else{
          this.tipsShow = true;
          this.disabled = false
          this.tips = res.mess;
        }
      }).catch((err)=>{
        this.disabled = false
      })
    },
    countTime(){//验证码倒计时
      let time = 60;
      let that = this;
      that.timer = setInterval(function(){
        that.btnText = time+'s';
        time--;
        if(time<0){
          console.log(time)
          clearInterval(that.timer);
          that.btnText = '获取验证码';
          that.disabled = false
        }
      },1000)
    },
    handelRegister(){//注册按钮点击
      let reg =  /^1[2|3|4|5|6|7|8|9][0-9]{9}$/;
      let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if(!reg.test(this.registerPhone)){
        this.tipsShow = true;
        this.tips = '请输入正确的手机号';
        return false;
      }

      if(!this.userPassword||!pattern.test(this.userPassword)){
        this.tipsShow = true;
        this.tips = '密码中应该同时含有数字跟字母，最少8位，最长18位';
        return false;
      }
      if(!this.verificationCode||this.verificationCode == " "){
         this.tipsShow = true;
        this.tips = '请输入图形码';
        return false;
      }
      if(!this.code||this.code == ' '){
         this.tipsShow = true;
        this.tips = '请输入手机验证码';
        return false;
      }
      if(!this.isRemember){
        this.tipsShow = true;
        this.tips = '请仔细阅读《易知服务条款》';
        return false;
      }
      this.registerDisabled = true
      this.toRegister()

    },
    toRegister(){
      API.register({
        userTel:this.registerPhone,
        userPassword:md5(this.userPassword),
        code:this.code,
        verificationCode:this.verificationCode
      }).then((res)=>{
        if(res.code==0){
           this.$emit('registerSuccess')
        }else{
          this.tipsShow = true;
          this.tips = res.mess;
          this.registerDisabled = false
          return false;
        }
      }).catch((err)=>{
        this.registerDisabled = false
      })
    }
  },
};
</script>
<style scoped lang="scss">
.login_ouer {
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 5;
  margin-left: -220px;
  margin-top: -260px;
  width: 440px;
  height: 520px;
  background: #ffffff;
  border-radius: 3px;
  h5 {
    font-size: 30px;
    color: #000;
    font-weight: normal;
    line-height: 1;
    text-align: center;
    padding: 35px 0;
  }
  form {
    padding: 0 40px;
    .user_name_wraper,
    .user_password_wraper,
    .code_wraper {
      border: 1px solid #cecece;
      height: 50px;
      box-sizing: border-box;
      margin-top: 20px;
      border-radius: 3px;
      padding: 0 10px;
      display: flex;
      align-items: center;
      img{
        height: 25px;
      }
      .captchaCode{
        height: 50px;
        cursor: pointer;
        padding-left:10px ;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        img{
          display: block;
          width: 100px;
          height: 50px;
        }
      }
      input{
        flex: 1;
        padding: 0 10px;
        box-sizing: border-box;
        font-size: 14px;
        height: 40px;
        border: none;
        background: none;
        outline: none;
      }
    }
    .user_name_wraper {
      margin-top: 0px;
    }
    .code_wraper{
      border: none;
      padding: 0;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .code_btn{
        width: 100px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #0068c1;
        font-size: 14px;
        color: #ffffff;
        margin-left: 10px;
        border-radius: 3px;
        border: none;
        outline: none;
        cursor: pointer;
      }
      .password_wraper{
        flex: 1;
        height: 50px;
        border: 1px solid #cecece;
        box-sizing: border-box;
        border-radius: 3px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0 10px;
      }

    }
    .tips {
      height: 35px;

      .warn_w {
        display: flex;
        align-items: center;
        height: 30px;
        padding-top: 5px;
        img {
          width: 15px;
          display: block;
          // margin-left: 10px;
        }
        .warn_text {
          font-size: 12px;
          color: #b8b8b8;
          padding: 0 0 0 12px;
          // white-space: nowrap;
        }
      }
    }
    .login_btn {
      width: 100%;
      height: 50px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      color: #ffffff;
      background: #0068c1;
      margin-top: 12px;
      cursor: pointer;
      border: none;
      outline: none;
    }
    .login_bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 14px;
      color: #666;
      margin-top: 20px;
      .left {
        display: flex;
        align-items: center;
        img{
          width: 20px;
          margin-right: 8px;
          cursor: pointer;
        }
        .active{
          color: #0068c1;
        }
      }
      .right {
        display: flex;
        align-items: center;
        cursor: pointer;
        .forget {
          color: #0068c1;
          margin-left: 15px;
        }
      }
    }
  }
  .close_wraper {
    position: absolute;
    right: -13px;
    top: -13px;
    z-index: 10;
    cursor: pointer;
    img {
      width: 26px;
      height: 26px;
    }
  }
}
</style>
