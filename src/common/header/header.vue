<template>
  <div class="header-bg">
    <div class="header">
      <div class="left">
      <div class="logo_wraper">
        <a href="/">
          <img src="@/static/logo_w.png" alt="易知">
        </a>
      </div>
      <div class="search_input" v-show="isShow">
        <input
          type="text"
          placeholder="请输入查询内容"
          @input="input"
          @keyup.enter="searchClick"
          v-model.trim="searchContent"
        />
        <div class="search_btn">
          <img src="@/static/search.png" @click="searchClick" />
        </div>
      </div>
    </div>
      <div class="right" v-show="allShow">
      <div class="userInfo" v-show="token" >
<!--        <div class="avatar_w" v-show="userInfo.userType===2">-->
<!--          <div class="avatar_img_w">-->
<!--              <img :src="$url + userInfo.avatarImg" class="avatar" />-->
<!--            </div>-->
<!--          <span class="user_name">{{-->
<!--              userInfo.nikeName ? userInfo.nikeName : "初始用户"-->
<!--            }}</span>-->
<!--        </div>-->
        <div class="avatar_w" @click="goToCenter">
          <div class="avatar_img_w">
            <img :src="$url + userInfo.avatarImg" class="avatar" />
          </div>
          <span class="user_name">{{
              userInfo.nikeName ? userInfo.nikeName : "初始用户"
            }}</span>
        </div>

        <div class="login_out" @click="handleLoginOut">
          <i class="iconfont icon-Exit"></i>
          <span>退出</span>
        </div>
      </div>
      <div class="login_raper" v-show="!token">
        <div class="register" @click="registerHandle">注册</div>
        <div class="login" @click="loginHandle">登录</div>
      </div>
    </div>
  </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  props: {
    isShow: {
      type: Boolean,
      default: false,
    },
    userInfo_show: {
      type: Boolean,
      default: true,
    },
    allShow: {
      type: Boolean,
      default: true,
    },
    searchContent: {
      type: String,
      default: "",
    },
    searchRightShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentSelect: "资源类别",
      select_list_show: false,
      searchText:''
    };
  },
  computed: {
    ...mapState([
      "token",
      "userInfo"]),
  },
  methods: {
    ...mapMutations(["login", "logout", "setresultTypes", "setresultKeyWords"]),
    setsearchText(){
      let that = this;
      that.setresultKeyWords(this.searchText)
    },
    search() {
      //搜索
      if(!this.searchText){
        return false
      }
      this.$router.push({path:'/result.html'});
    },
    loginHandle() {
      this.$emit("loginClick");
    },
    changeTypes(item, index) {
      this.currentSelect = item.text;
      this.select_list_show = false;
      this.setresultTypes(index);
    },
    registerHandle() {
      this.$emit("registerClick");
    },
    handleLoginOut() {
      this.logout();
      this.$router.push("/");
    },
    goToCenter() {
      if (this.$router.currentRoute.fullPath == "/user/message.html") {
        return false;
      }
      window.open('/user/message.html','_blank')
      // this.$router.push("/user/message.html");
    },
    searchClick() {
      // if(!this.searchContent){
      //   return
      // }
      this.$emit("searchHandle", this.searchContent);
    },
    input() {
      this.$emit("searchOnInput", this.searchContent);
    },
  },
};
</script>
<style lang="scss" scoped>
.header-bg{
  width: 100%;
  height: 70px;
  background: #0b1634;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9;
}
.header {
  height: 70px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  z-index: 3;
  width: 1400px;
  @media screen and (max-width: 1440px) {
    width: 95%;
    margin-left: auto;
    margin-right: auto;
  }
  .left {
    display: flex;
    .logo_wraper{
      margin-right: 40px;
      img{
        width: 95px;
        height: auto;
        display:block
      }
    }
    .search_input {
      width: 630px;
      height: 40px;
      background: #ffffff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      @media screen and (max-width: 1440px) {
        width: 530px;
        height: 36px;
      }
      input {
        box-sizing: border-box;
        padding: 0 15px;
        height: 40px;
        flex: 1;
        border: none;
        outline: none;
        font-size: 14px;
        color: #333;
        @media screen and (max-width: 1440px) {
          height: 36px;
        }
      }
      .search_btn {
        width: 60px;
        height: 40px;
        background: #0168c1;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        @media screen and (max-width: 1440px) {
          height: 36px;
        }
        img {
          width: 24px;
        }
      }
    }
  }
  .right {
    display: flex;
    align-items: center;
    .right_search {
      margin-right: 20px;
      border-radius: 3px;
      display: flex;
      align-items: center;
      .select_w {
        margin-right: 20px;
        padding: 0 10px;
        cursor: pointer;
        position: relative;
        .select_w_s {
          height: 70px;
          display: flex;
          align-items: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 14px;
          img {
            width: 18px;
            margin-left: 10px;
          }
        }
        .select_list {
          background: rgba(4, 15, 43, 0.9);
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          color: rgba(255, 255, 255, 1);
          font-size: 14px;
          width: 140px;
          text-align: center;
          top: 70px;
          padding: 8px 0;
          li {
            line-height: 28px;
          }
        }
      }
      .input_wraper {
        width: 200px;
        height: 30px;
        padding: 0 0 0 10px;
        background: rgba(56, 63, 87, 1);
        display: flex;
        align-items: center;
        justify-content: space-between;
        input {
          width: 150px;
          height: 30px;
          background: rgba(56, 63, 87, 1);
          color: rgba(255, 255, 255, 1);
          border: none;
          outline: none;
        }
        .img_w {
          display: flex;
          align-items: center;
          border-left: 1px solid rgba(255, 255, 255, 0.5);
          padding: 0 10px;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .userInfo {
      display: flex;
      align-items: center;
      .avatar_w {
        display: flex;
        align-items: center;
        cursor: pointer;
        margin-right: 20px;
        .avatar_img_w {
          width: 40px;
          height: 40px;
          // border-radius: 20px;
          margin-right: 12px;
          overflow: hidden;
          position: relative;
          .avatar {
            height: 40px;
            width: 40px;
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 1;
            transform: translate3d(-50%, -50%, 0);
            border-radius: 5px;
          }
        }
        .user_name {
          font-size: 14px;
          color: #ffffff;
        }
      }
      .login_out {
        display: flex;
        align-items: center;
        // margin-left: 35px;
        cursor: pointer;
        .icon-Exit{
          font-size: 16px;
          color: #fff;
          margin-right: 5px;
        }
        img {
          width: 15px;
          margin-right: 10px;
        }
        span {
          font-size: 14px;
          color: #ffffff;
        }
      }
    }
    .login_raper {
      display: flex;
      align-items: center;

      .login {
        width: 54px;
        height: 26px;
        background: #0168c1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ffffff;
        font-size: 14px;
        cursor: pointer;
      }
      .register {
        width: 54px;
        height: 26px;
        color: #ffffff;
        border: 1px solid #ffffff;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-sizing: border-box;
        margin-right: 10px;
        cursor: pointer;
      }
    }
  }
}
</style>
