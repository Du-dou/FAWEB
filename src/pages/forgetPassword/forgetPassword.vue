<template>
  <div class="content">
    <div class="modify_container">
      <div class="header_wraper">
        <m-header :allShow="userInfo_show"></m-header>
      </div>
      <div class="main_title">忘记密码</div>
      <div class="second_step" v-if="step == 1">
        <ul>
          <li>
            <input
              class="long_input"
              v-model.trim="phone"
              type="number"
              placeholder="请输入电话"
            />
          </li>
          <li>
            <div class="get_code">
              <input
                type="text"
                v-model.trim="verificationCode"
                placeholder="请输入图形码"
              />
              <div class="captchaCode">
                <img
                  :src="'data:image/png;base64,' + captcha"
                  @click="getCodeCaptcha"
                />
              </div>
            </div>
          </li>
          <li>
            <div class="get_code">
              <input type="number" v-model.trim="code" placeholder="请输入手机验证码"/>
              <button @click.prevent="getCode" :disabled="disabled">
                {{ btnText }}
              </button>
            </div>
          </li>
          <li class="mr hei25">
            <div class="tips" v-if="tipsShow">
              <img src="@/static/tips.png"/>
              <span>{{ tips }}</span>
            </div>
          </li>
          <li class="mr">
            <div class="confirm">
              <button :disabled="confirmDisabled" @click="next">下一步</button>
            </div>
          </li>
        </ul>
      </div>
      <div class="second_step" v-if="step == 2">
        <ul>
          <li>
            <input
              class="long_input"
              v-model.trim="newPassword"
              type="password"
              placeholder="输入新密码（8-18位，同时包含字母与数字）"
            />
          </li>
          <li>
            <div class="get_code">
              <input
                class="long_input"
                type="password"
                v-model.trim="newPasswordConfirm"
                placeholder="确认密码"
              />
            </div>
          </li>
          <li class="mr hei25">
            <div class="tips" v-if="tipsShow">
              <img src="@/static/tips.png"/>
              <span>{{ tips }}</span>
            </div>
          </li>
          <li class="mr">
            <div class="confirm">
              <button :disabled="confirmDisabled" @click="nextChange">
                下一步
              </button>
            </div>
          </li>
        </ul>
      </div>
      <div class="" v-if="step == 3">
        <div class="complete_text">您已成功设置密码，请使用新密码登陆</div>
        <div class="complete_btn" @click="loginNow">马上登陆</div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer_wraper">
      <m-footer></m-footer>
    </div>
  </div>
</template>
<script>
import md5 from "js-md5";
import API from "@/api/index";
import {sendCode, httpPost, httpPut} from "@/api/index";
import MHeader from "@/common/header/header";
import MFooter from "@/common/footer/footer";

export default {
  data() {
    return {
      userInfo_show: false,
      step: 1, //步数
      tips: "", //提示字段
      tipsShow: false, //提示显示
      timer: null, //倒计时
      btnText: "获取验证码",
      disabled: false, //发送可点击
      confirmDisabled: false,
      token: "",
      newPassword: "",
      newPasswordConfirm: "",
      verificationCode: "",
      captcha: "",
    };
  },
  filters: {
    setPhone(phone) {
      var reg = /(\d{3})\d{4}(\d{4})/;
      var tel1 = phone.replace(reg, "$1****$2");
      return tel1;
    },
  },
  components: {
    MHeader,
    MFooter,
  },
  created() {
    this.getCodeCaptcha();
  },
  methods: {
    getCodeCaptcha() {
      //获取图形验证码
      httpPost("/api/rest/captcha", "", "").then((res) => {
        // console.log(res);
        if (res.code == 0) {
          this.captcha = res.data;
        }
      });
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
        action: 1,
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
    next() {
      let that = this;
      let reg = /^1[3|4|5|6|7|8|9][0-9]{9}$/;
      if (!reg.test(this.phone)) {
        this.tipsShow = true;
        this.tips = "请输入正确的手机号";
        return false;
      }
      if (!this.verificationCode) {
        this.tipsShow = true;
        this.tips = "请输入图形码";
        return false;
      }
      if (!this.code) {
        this.tipsShow = true;
        this.tips = "请输入手机验证码";
        return false;
      }

      that.verifyCode();
    },
    verifyCode() {
      this.confirmDisabled = true;
      httpPost("/api/rest/verifyCode", {
        action: 1,
        tel: this.phone,
        code: this.code,
        verificationCode: this.verificationCode

      })
        .then((res) => {
          if (res.code == 0) {
            this.token = res.data.token;
            this.confirmDisabled = false;
            this.tipsShow = false;
            this.step = 2;
          } else {
            this.tipsShow = true;
            this.tips = res.mess;
            this.confirmDisabled = false;
          }
        })
        .catch((err) => {
          this.confirmDisabled = false;
        });
    },
    nextChange() {
      let that = this;
      let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if (that.newPassword == "") {
        that.tips = "请输入新密码";
        that.tipsShow = true;
        return false;
      }
      if (!pattern.test(that.newPassword)) {
        that.tips = "密码中应该同时含有数字跟字母，最少8位，最长18位";
        that.tipsShow = true;
        return false;
      }
      if (that.newPasswordConfirm == "") {
        that.tips = "请输入确认密码";
        that.tipsShow = true;
        return false;
      }

      if (!pattern.test(that.newPasswordConfirm)) {
        that.tips = "密码中应该同时含有数字跟字母，最少8位，最长18位";
        that.tipsShow = true;
        return false;
      }
      if (that.newPasswordConfirm != that.newPassword) {
        that.tips = "两次密码不一致";
        that.tipsShow = true;
        return false;
      }
      that.confirmDisabled = true;
      httpPut("/api/userInfo/rest/getBackPwd", {
        codeToken: that.token,
        pwd: md5(that.newPassword),
        verificationCode: that.verificationCode
      })
        .then((res) => {
          if (res.code == 0) {
            this.step = 3;
            that.confirmDisabled = false;
            this.tipsShow = false;
          } else {
            this.tipsShow = true;
            this.tips = res.mess;
            that.confirmDisabled = false;
          }
        })
        .catch((err) => {
          that.confirmDisabled = false;
        });
    },
    loginNow() {
      this.$router.replace("/home");
    },
  },
};
</script>
<style lang="scss" scoped>
.modify_container {
  min-height: calc(100vh - 70px);
  overflow: hidden;

  .main_title {
    text-align: center;
    font-size: 26px;
    margin-top: 130px;
  }

  .second_step {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 50px;

    ul {
      li {
        display: flex;
        align-items: center;
        margin-top: 20px;

        .long_input {
          width: 360px;
          height: 40px;
          border: 1px solid #999;
          box-sizing: border-box;
          outline: none;
          padding: 0 20px;
          border-radius: 3px;
          @media screen and (max-width: 1440px) {
            width: 360px;
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

          .captchaCode {
            margin-left: 10px;

            img {
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

          button {
            width: 100%;
            height: 40px;
            background: #0068c1;
            border: none;
            outline: none;
            color: #ffffff;
            cursor: pointer;
            border-radius: 3px;
          }
        }
      }

      li.mr {
        margin-top: 5px;
      }

      li.hei25 {
        min-height: 25px;

        .tips {
          display: flex;
          align-items: center;
          max-width: 360px;
          padding: 5px 0;

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

  .complete_btn {
    height: 50px;
    border-radius: 3px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    background: #0068c1;
    margin: 60px auto 0;
    width: 360px;
    cursor: pointer;
    @media screen and (max-width: 1440px) {
      width: 300px;
    }
  }

  .complete_text {
    font-size: 16px;
    color: #333;
    text-align: center;
    margin-top: 100px;
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
