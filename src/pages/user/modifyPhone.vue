<template>
  <div class="modify_container">
    <div class="top_menu">
      <span>修改手机号</span>
    </div>
    <div class="first_step" v-if="step == 1">
      手机账号：您的登录手机号为<span>{{ userInfo.userTel | setPhone }}</span
      ><button @click.prevent="nextStep">去修改</button>
    </div>
    <div class="second_step" v-if="step == 2">
      <ul>
        <li>
          <span class="text">新手机：</span>
          <input class="long_input" placeholder="请输入新手机号" v-model.trim="phone" type="number" />
        </li>
        <li>
          <span class="text">图形码：</span>
          <div class="get_code">
            <input type="text" v-model.trim="verificationCode" placeholder="请输入图形码" />
            <div class="captchaCode">
               <img :src="'data:image/png;base64,'+captcha" @click="getCodeCaptcha">
            </div>
          </div>
        </li>
        <li>
          <span class="text">验证码：</span>
          <div class="get_code">
            <input type="number" placeholder="请输入手机验证码" v-model.trim="code" />
            <button @click.prevent="getCode" :disabled="disabled">
              {{ btnText }}
            </button>
          </div>
        </li>
        <li class="mr hei25">
          <span class="text"></span>
          <div class="tips" v-if="tipsShow">
            <img src="@/static/tips.png" />
            <span>{{ tips }}</span>
          </div>
        </li>
        <li class="mr">
          <span class="text"></span>
          <div class="confirm">
            <button :disabled="confirmDisabled" @click="changePhone">
              确定
            </button>
            <span @click="cancle">取消</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
import API from "@/api/index";
import {httpPost } from "@/api/index";

export default {
  data() {
    return {
      step: 1, //步数
      tips: "", //提示字段
      tipsShow: false, //提示显示
      timer: null, //倒计时
      btnText: "获取验证码",
      disabled: false, //发送可点击
      confirmDisabled: false,
      captcha:'',
      verificationCode:''
    };
  },
  created(){
    this.getCodeCaptcha()
  },
  filters: {
    setPhone(phone) {
      var reg = /(\d{3})\d{4}(\d{4})/;
      var tel1 = phone.replace(reg, "$1****$2");
      return tel1;
    },
  },
  computed: {
    ...mapState(["hasLogin", "userInfo", "token"]),
  },
  methods: {
    ...mapMutations(["login", "getToken"]),
    nextStep() {
      //下一步
      this.step = 2;
    },
    cancle() {
      //取消
      this.step = 1;
    },
    getCodeCaptcha(){//获取图形验证码
      httpPost('/api/rest/captcha','','').then((res)=>{
        // console.log(res)
        if(res.code == 0){
          this.captcha = res.data
        }
      })
    },
    getCode() {
      //获取验证码
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        this.tipsShow = true;
        this.tips = "请输入正确的手机号";
        return false;
      }
      this.disabled = true;
      API.sendCode({
        action: 3,
        to: this.phone,
      }).then((res) => {
          if (res.code == 0) {
            this.tipsShow = false;
            this.countTime();
          } else {
            this.tipsShow = true;
            this.disabled = false;
            this.tips = res.mess;
          }
        })
        .catch((err) => {
          this.disabled = false;
        });
    },
    countTime() {
      //验证码倒计时
      let time = 60;
      let that = this;
      that.timer = setInterval(function () {
        that.btnText = time + "s";
        time--;
        if (time < 0) {
          clearInterval(that.timer);
          that.btnText = "获取验证码";
          that.disabled = false;
        }
      }, 1000);
    },
    changePhone() {
      let that = this;
      let reg = /^1[3|4|5|7|8][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        this.tipsShow = true;
        this.tips = "请输入正确的手机号";
        return false;
      }
      if(!this.verificationCode){
        this.tipsShow = true;
        this.tips = "请输入图形码";
        return false;
      }
      if (!this.code) {
        this.tipsShow = true;
        this.tips = "请输入手机验证码";
        return false;
      }
      that.confirmDisabled = true;
      API.changePhone(
        {
          tel: that.phone,
          code: that.code,
          verificationCode:that.verificationCode
        }
      )
        .then((res) => {
          if (res.code == 0) {
            this.tipsShow = false;
            this.confirmDisabled = false;
            that.getUserInfoRequest(that.token);
          } else {
            this.tips = res.mess;
            this.tipsShow = true;
            this.confirmDisabled = false;
          }
        })
        .catch((err) => {
          this.confirmDisabled = false;
        });
    },
    getUserInfoRequest(token) {
      //获取用户信息
      let that = this;
      API.getUserInfo().then((res) => {
        if (res.code == 0) {
          that.login(res.data);
          that.$message({
            type: "success",
            message: "修改成功",
          });
          that.step = 1;
        }else{
          that.$message({
            type: "info",
            message: res.mess,
          });

        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.modify_container {
  .top_menu {
    border-bottom: 1px solid #e7e7e7;
    font-size: 16px;
    color: #666;
    line-height: 1;
    height: 60px;
    padding: 0 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    @media screen and (max-width: 1440px) {
      height: 40px;
      font-size: 14px;
    }
  }
  .first_step {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    color: #666;
    margin-top: 90px;
    margin-left: -100px;
    button {
      border: none;
      outline: none;
      background: #0068c1;
      width: 130px;
      height: 40px;
      border-radius: 3px;
      color: #ffffff;
      margin-left: 55px;
      cursor: pointer;
      @media screen and (max-width: 1440px) {
        width: 100px;
        height: 40px;
        margin-left: 35px;
      }
    }
  }
  .second_step {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: -100px;
    margin-top: 70px;
    ul {
      li {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .text {
          width: 90px;
          font-size: 14px;
          color: #999;
          text-align: right;
          padding-right: 10px;
        }
        .long_input {
          width: 360px;
          height: 40px;
          border: 1px solid #999;
          box-sizing: border-box;
          outline: none;
          padding: 0 20px;
          border-radius: 3px;
          @media screen and (max-width: 1440px) {
            width: 320px;
          }
        }
        .get_code {
          flex: 1;
          display: flex;
          align-items: center;
          width: 300px;
          @media screen and (max-width: 1440px) {
            width: 280px;
          }
          input {
            height: 40px;
            border: 1px solid #999;
            flex: 1;
            box-sizing: border-box;
            outline: none;
            padding: 0 20px;
            border-radius: 3px;
          }
          button {
            font-size: 14px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 130px;
            background: #0068c1;
            color: #ffffff;
            margin-left: 10px;
            cursor: pointer;
            border: none;
            outline: none;
            border-radius: 3px;
            @media screen and (max-width: 1440px) {
              width: 100px;
            }
          }
          .captchaCode{
            padding-left: 10px;
            img{
              width: 130px;
              height: 40px;
              display: block;
              cursor: pointer;
               @media screen and (max-width: 1440px) {
                width: 100px;
              }
            }
          }
        }
        .confirm {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #ffffff;
          height: 40px;
          font-size: 14px;
          width: 300px;
          @media screen and (max-width: 1440px) {
            width: 280px;
          }
          flex: 1;
          span {
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 47%;
            cursor: pointer;
          }
          button {
            width: 47%;
            height: 40px;
            background: #0068c1;
            border: none;
            outline: none;
            color: #ffffff;
            cursor: pointer;
            border-radius: 3px;
          }
          span:nth-child(2) {
            background: #dcdcdc;
            border-radius: 3px;
          }
        }
      }
      li.mr {
        margin-top: 5px;
      }
      li.hei25 {
        height: 25px;
        .tips {
          display: flex;
          align-items: center;

          img {
            width: 15px;
            margin-right: 10px;
          }
          span {
            font-size: 12px;
            color: #b8b8b8;
          }
        }
      }
    }
  }
  .slideUp-enter,
  .slideUp-leave-to {
    opacity: 0;
    transform: translateY(-20px);
  }
  .slideUp-enter-active,
  .slideUp-leave-active {
    transition: all 0.3s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: all 0.2s;
  }
}
</style>
