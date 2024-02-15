<template>
  <div class="password_container">
    <div class="top_menu">
      <span>修改密码</span>
    </div>
    <form class="change_password_wraper">
      <ul>
        <li>
          <span>原密码：</span>
          <input placeholder="原密码" v-model.trim="oldPwd" type="password" />
        </li>
        <li>
          <span>新密码：</span>
          <input placeholder="新密码（8-18位，同时包含字母与数字）" v-model.trim="newPwd" type="password" />
        </li>
        <li>
          <span>确认密码：</span>
          <input placeholder="再次确认" v-model.trim="newPwdConfirm" type="password" />
        </li>
        <li class="tips">
          <span></span>
          <div class="tips_w" v-show="tips_show">
            <img src="@/static/tips.png" />
            <span>{{ tips_text }}</span>
          </div>
        </li>
        <li>
          <span></span>
          <button @click.prevent="subbmitChangePassword">确定</button>
        </li>
      </ul>
    </form>
  </div>
</template>
<script>
import md5 from "js-md5";
import API from "@/api/index";
import { mapState } from "vuex";

export default {
  data() {
    return {
      oldPwd: "",
      newPwd: "",
      newPwdConfirm: "",
      tips_show: false,
      tips_text: ""
    };
  },
  created() {},
  computed: {
    ...mapState(["hasLogin", "userInfo", "token"]),
  },
  methods: {
    subbmitChangePassword() {
      let that = this;
      let pattern = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,18}$/;
      if (that.oldPwd == "") {
        that.tips_text = "请输入原密码";
        that.tips_show = true;
        return false;
      }
      if (that.newPwd == "") {
        that.tips_text = "请输入新密码";
        that.tips_show = true;
        return false;
      }
      if (!that.newPwd || !pattern.test(that.newPwd)) {
        that.tips_text = "新的密码长度应该在8-18位之间，同时包含数字与字母";
        that.tips_show = true;
        return false;
      }
      if (that.newPwdConfirm != that.newPwd) {
        that.tips_text = "两次密码不一致";
        that.tips_show = true;
        return false;
      }
      API.changePassword(
        {
          oldPwd: md5(that.oldPwd),
          newPwd: md5(that.newPwd),
        }
      ).then((res) => {
        if (res.code == 0) {
          that.tips_show = false;
          this.$message({
            type: "success",
            message:"修改成功"
          });
          that.oldPwd = '';
          that.newPwd = '';
          that.newPwdConfirm = '';
        } else if(res.code == 109){
          that.tips_text = '原密码错误';
          that.tips_show = true;
           this.$message({
            type: "info",
            message:'原密码错误'
          });
        }else {
          that.tips_text = res.mess;
          that.tips_show = true;
           this.$message({
            type: "info",
            message:res.mess
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
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
  .buy {
    width: 80px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #0068c1;
    color: #0068c1;
    font-size: 16px;
    cursor: pointer;
    @media screen and (max-width: 1440px) {
      width: 60px;
      height: 20px;
      font-size: 14px;
    }
  }
}
// 更换密码
.change_password_wraper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 100px;
  ul {
    margin: 65px auto 0;
    li {
      display: flex;
      align-items: center;
      margin-top: 20px;
      span {
        width: 80px;
        color: #999;
        font-size: 16px;
        text-align: right;
        margin-right: 10px;
        @media screen and (max-width: 1440px) {
          font-size: 14px;
        }
      }
      input {
        box-sizing: border-box;
        padding: 0 20px;
        height: 40px;
        width: 360px;
        border: 1px solid #999;
        outline: none;
        color: #999;
        border-radius:3px;
        @media screen and (max-width: 1440px) {
          width: 330px;
          height: 40px;
        }
      }
      button {
        height: 40px;
        background: #0068c1;
        font-size: 16px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 360px;
        border: none;
        outline: none;
        cursor: pointer;
         border-radius: 3px;
        @media screen and (max-width: 1440px) {
          width: 280px;
        }
      }
      img {
        width: 20px;
      }
    }
    li.tips {
      height: 20px;
      margin-top: 10px;
      .tips_w {
        display: flex;
        align-items: center;
        flex: 1;
        span {
          font-size: 12px;
          color: #b8b8b8;
          text-align: left;
          padding: 0 10px;
          flex: 1;
          white-space: nowrap;
        }
      }
    }
    li:last-child {
      margin-top: 8px;
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
</style>
