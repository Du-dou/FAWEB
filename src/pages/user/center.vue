<template>
  <div class="container">
    <div class="header_wraper">
      <m-header :userInfo_show="userInfo_show" :searchRightShow='searchRightShow'></m-header>
    </div>
    <div class="main_content">
      <div class="left_menu">
        <div class="user_avatar">
          <div class="user_avatar_img" v-if="userInfo.avatarImg">
            <img :src="$url + userInfo.avatarImg" />
          </div>

          <span>{{ userInfo.nikeName ? userInfo.nikeName : "初始用户" }}</span>
        </div>
        <ul>
          <li>
            <img src="@/static/userCenter.jpg" />
            <span>个人中心</span>
          </li>
          <li
            class="mr5 canhover"
            :class="{ active: current == 0 }"
            @click="changeMenu(0)"
          >
            我的消息{{ type }}
          </li>
          <li
            class="canhover"
            :class="{ active: current == 1 }"
            @click="changeMenu(1)"
          >
            我的收藏
          </li>
          <li
            class="canhover"
            :class="{ active: current == 2 }"
            @click="changeMenu(2)"
          >
            我的权限
          </li>
          <li class="mr20">
            <img src="@/static/userInfo.png" />
            <span>个人信息</span>
          </li>
          <li
            class="mr5 canhover"
            :class="{ active: current == 3 }"
            @click="changeMenu(3)"
          >
            基本信息
          </li>
          <li
            class="canhover padding"
            :class="{ active: current == 4 }"
            @click="changeMenu(4)"
          >
            修改手机号
          </li>
          <li
            class="canhover"
            :class="{ active: current == 5 }"
            @click="changeMenu(5)"
          >
            修改密码
          </li>
        </ul>
      </div>
      <div class="right_content">
        <router-view></router-view>
      </div>
    </div>
    <div class="footer_wraper">
      <m-footer></m-footer>
    </div>
  </div>
</template>
<script>
import MHeader from "@/common/header/header";
import MFooter from "@/common/footer/footer";
import { mapState } from "vuex";
export default {
  data() {
    return {
      current: "",
      oldPwd: "",
      newPwd: "",
      newPwdConfirm: "",
      tips_text: "",
      tips_show: false,
      userInfo_show: true,
      searchRightShow:false
    };
  },
  created() {
    this.currentSet();
  },
  computed: {
    ...mapState(["hasLogin", "userInfo", "token"]),
  },
  methods: {
    currentSet() {
      if (this.$router.currentRoute.fullPath == "/user/center/message") {
        this.current = 0;
      }
      if (this.$router.currentRoute.fullPath == "/user/center/collection") {
        this.current = 1;
      }
      if (this.$router.currentRoute.fullPath == "/user/center/myAuth") {
        this.current = 2;
      }
      if (this.$router.currentRoute.fullPath == "/user/center/info") {
        this.current = 3;
      }
      if (this.$router.currentRoute.fullPath == "/user/center/modifyPhone") {
        this.current = 4;
      }
      if (this.$router.currentRoute.fullPath == "/user/center/changepassword") {
        this.current = 5;
      }
    },
    changeMenu(type) {
      if (this.current == type) {
        return false;
      }
      this.current = type;
      if (type == 0) {
        this.$router.replace("/user/center/message");
      }
      if (type == 1) {
        this.$router.replace("/user/center/collection");
      }
      if (type == 2) {
        this.$router.replace("/user/center/myAuth");
      }
      if (type == 3) {
        this.$router.replace("/user/center/info");
      }
      if (type == 4) {
        this.$router.replace("/user/center/modifyPhone");
      }
      if (type == 5) {
        this.$router.replace("/user/center/changepassword");
      }
    },
  },
  components: {
    MHeader,
    MFooter,
  },
};
</script>
<style scoped lang="scss">
.container {
  min-width: 1280px;
  background-color: #f5f5f5;
  .header_wraper {
    height: 70px;
  }
  .main_content {
    background-color: #ffffff;
    display: flex;
    margin-left: auto;
    margin-right: auto;
    width: 1400px;
    @media screen and (max-width: 1740px) {
      width: 1400px;
    }
    @media screen and (max-width: 1440px) {
      width: 95%;
      margin-left: auto;
      margin-right: auto;
    }
    .left_menu {
      width: 290px;
      border-right: 1px solid #e2e8eb;
      box-sizing: border-box;
      max-height: 700px;
      @media screen and (max-width: 1440px) {
        width: 250px;
        max-height: 520px;
      }
      .user_avatar {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-top: 25px;
        .user_avatar_img {
          width: 80px;
          height: 80px;
          border-radius: 5px;
          background-color: #ccc;
          overflow: hidden;
          position: relative;
          img {
            width: 80px;
            height: 80px;
            background-color: #ccc;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate3d(-50%, -50%, 0);
            border-radius: 5px;
          }
        }

        span {
          color: #333;
          font-size: 22px;
          line-height: 1;
          margin-top: 15px;
          @media screen and (max-width: 1440px) {
            font-size: 18px;
          }
        }
      }
      ul {
        font-size: 16px;
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 55px;
        @media screen and (max-width: 1440px) {
          margin-top: 20px;
        }
        img {
          width: 20px;
          position: absolute;
          left: 60px;
          @media screen and (max-width: 1440px) {
            left: 40px;
          }
        }
        li {
          position: relative;
          width: 240px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          color: #333;
          cursor: pointer;
          box-sizing: border-box;
          @media screen and (max-width: 1440px) {
            width: 200px;
            font-size: 14px;
          }
        }
        li.canhover:hover {
          background: #0168c1;
          color: #ffffff;
        }
        li.mr10 {
          margin-top: 5px;
        }
        li.mr20 {
          margin-top: 20px;
          @media screen and (max-width: 1440px) {
            margin-top: 10px;
          }
        }

        li.active {
          background: #0168c1;
          color: #ffffff;
        }
        li.padding {
          padding-left: 15px;
        }
      }
    }
    .right_content {
      margin-top: 15px;
      position: relative;
      flex: 1;
      box-sizing: border-box;
      padding: 0 20px 30px 40px;
      min-height: calc(100vh - 155px);
      @media screen and (max-width: 1440px) {
        padding: 0 15px 30px 30px;
      }
    }
  }
}
</style>
