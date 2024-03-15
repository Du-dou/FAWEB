<template>
  <div class="login_ouer">
    <h5>登录</h5>
    <form>
      <div class="user_name_wraper">
        <img src="@/static/userName.png">
        <input type="text" v-model="userTel" placeholder="手机号或用户名">
      </div>
      <div class="user_password_wraper">
        <img src="@/static/password.png">
        <input type="password" v-model.trim="pwd" placeholder="登录密码">
      </div>
      <div class="tips">
        <div class="warn_w" v-show="tipsShow">
          <img src="@/static/tips.png"/>
          <span class="warn_text"
          >{{ tips }}</span
          >
        </div>
      </div>

      <button class="login_btn" @click.prevent="toLogin" :disabled="disabled">登录</button>
      <div class="login_bottom">
        <div class="left">
          <img :src="isRemember?CheckboxChecked:CheckboxUnchecked" @click="remember">
          <span>记住密码</span>
        </div>
        <div class="right">
          <span class="register" @click="toRegister">注册</span>
          <span class="forget" @click="forgetPassword">忘记密码</span>
        </div>
      </div>
    </form>
    <div class="close_wraper" @click="handleClose">
      <img src="@/static/close.png"/>
    </div>
  </div>
</template>
<script>
import CheckboxChecked from "@/static/CheckboxChecked.png";
import CheckboxUnchecked from "@/static/CheckboxUnchecked.png";
import md5 from 'js-md5'
import {mapState, mapMutations} from 'vuex'
import API from '@/api/index'

export default {
  data() {
    return {
      tipsShow: false,
      userTel: "",
      pwd: "",
      code: "",
      type: 1,
      tips: "",
      disabled: false,
      CheckboxChecked,
      CheckboxUnchecked
    }
  },
  computed: {
    ...mapState(['isRemember'])
  },
  created() {
    if (this.isRemember) {
      if (localStorage.getItem('user')) {
        let user = JSON.parse(localStorage.getItem('user'));
        this.userTel = user.phone;
        this.pwd = user.ps
      }
    }
  },
  methods: {
    ...mapMutations(["login", "setToken", "isRememberChange"]),
    handleClose() {
      this.$emit("handleLoginClose");
    },
    remember() {//记住密码
      if (this.isRemember) {
        this.isRememberChange(false)
      } else {
        this.isRememberChange(true)
      }


    },
    toLogin() {//登录
      // let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      // if(!reg.test(this.userTel)){
      //   this.tipsShow = true;
      //   this.tips = '请输入正确的手机号';
      //   return false;
      // }

      if (!this.userTel) {
        this.tipsShow = true;
        this.tips = '请输入手机号或用户名';
        return false;
      }

      if (!this.pwd) {
        this.tipsShow = true;
        this.tips = '请输入登录密码';
        return false;
      }
      if ((!this.code || this.code == ' ') && this.type == 2) {
        this.tipsShow = true;
        this.tips = '请输入验证码';
        return false;
      }
      this.disabled = true
      this.requestLogin(this.userTel, this.pwd, '', this.type)
    },
    requestLogin(userTel, pwd, code, type) {
      let that = this;

      console.log('here', md5(pwd))
      API.userLogin({
        userName: userTel,
        pwd: md5(pwd),
        code: code,
        type: type
      }).then((res) => {
        // console.log(res.data)
        if (res.code === 0) {
          this.setToken(res.data.token);
          that.getUserInfoRequest(res.data.token)
          if (that.isRemember) {
            localStorage.setItem('user', JSON.stringify({
              phone: userTel,
              ps: pwd
            }))
          } else {
            localStorage.removeItem('user')
          }
        } else {
          console.log(res.mess)
          that.disabled = false;
          that.tipsShow = true;
          that.tips = res.mess;

        }
      }).catch((err) => {
        that.disabled = false
      });
    },
    getUserInfoRequest(token) {
      let that = this;
      API.getUserInfo().then((res) => {
        if (res.code == 0) {
          that.login(res.data);
          that.$emit("handleLoginClose");
          that.$emit("loginSuccess");
        }
      })
    },
    toRegister() {//去注册
      this.$emit("registerClick");
    },
    forgetPassword() {
      this.$emit("forgetPassword");
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
  margin-top: -205px;
  width: 440px;
  height: 410px;
  background: #ffffff;
  border-radius: 3px;

  h5 {
    font-size: 30px;
    color: #000;
    font-weight: normal;
    line-height: 1;
    text-align: center;
    padding: 40px 0;
  }

  form {
    padding: 0 40px;

    .user_name_wraper,
    .user_password_wraper {
      border: 1px solid #cecece;
      height: 50px;
      box-sizing: border-box;
      margin-top: 30px;
      border-radius: 3px;
      padding: 0 10px;
      display: flex;
      align-items: center;

      img {
        height: 25px;
      }

      input {
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

        img {
          width: 20px;
          margin-right: 8px;
          cursor: pointer;
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
