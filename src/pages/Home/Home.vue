<template>
  <div class="container">
    <div class="header_w">
      <!-- 顶部 -->
      <m-header @loginClick="login" @registerClick="register"></m-header>
    </div>
    <!--  -->
    <div class="banner_wraper" v-if="bannerList.length > 0">
      <swiper ref="mySwiper" :options="swiperOptions" class="swiper_w">
        <swiper-slide
          class="swiperSlider"
          v-for="item in bannerList"
          :key="item.id"
        >
          <div
            class="slider_item"
            :style="{
              'background-image': 'url(' + $url + item.bannerPath + ')',
            }"
          >
          </div>
        </swiper-slide>
      </swiper>
    </div>
    <!-- 搜索框 -->
    <div class="main-content" ref="content">
      <div class="search_wraper">
        <div class="search_Input_wraper">
          <div class="search_input">
            <div class="choose_search_type" @mouseenter="enter" @mouseleave="leave">
              <span>{{ currentIndex === 0 ? '标题' : '全文' }}</span>
              <i class="arrow-down"></i>
              <span class="line"></span>
              <div class="type_list" v-if="show">
                <span @click="setSearchField(0)">标题</span>
                <span @click="setSearchField(1)">全文</span>

              </div>
            </div>
            <!--            <input v-model.trim="searchText" type="text" placeholder="请输入查询内容" @keyup.enter="search" @input="setsearchText"/>-->
            <!--            <div class="search_btn_w" @click="search">-->
            <input v-model.trim="searchText" type="text" placeholder="请输入查询内容" @keyup.enter="clickSearch"
                   @input="setsearchText"/>
            <div class="search_btn_w" @click="clickSearch">

              <i class="iconfont icon-search"></i>
              <span>搜索</span>
            </div>
          </div>
          <div class="search_hot">
            <div class="hot_title">热门搜索：</div>
            <ul>
              <li
                @click="hotSearch(item.keywordName)"
                v-for="item in searchKeyWords"
                :key="item.keywordId"
              >
                <a>{{ item.keywordName }}</a>
              </li>
            </ul>
          </div>
          <!--  -->

          <!-- 分页 -->
          <div class="paga_wraper" v-if="bannerList.length > 1">
            <div class="paga_list">
              <div
                class="paga_item"
                v-for="(item, index) in bannerList"
                :key="item.id"
                @click="changeSlider(index)"
              >
                <span :class="{ active: activeIndex == index }"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--  -->
      <div class="new-list">
        <div class="list">
          <div class="title-w">
            <img src="@/static/left.png">
            <span>最新颁布</span>
          </div>
          <ul>
            <li v-for="(item,index) in leftListSelect" :key="index" @click="goDetail(item)">
              <div>
                <span class="icon"></span>
                <span class="text">{{ item.articleTitle }}</span>
              </div>
              <div>
                <span class="no-icon icon"></span>
                <span class="desc">{{ item.publishDateTime }}发布 / {{ item.implementDate }}实施</span>
              </div>
            </li>
          </ul>
          <div class="page_w">
            <span @click="leftClick" :class="{'none':leftIndex==0}"><i class="iconfont icon-arrowleft"></i></span>
            <span class="middle">｜</span>
            <span @click="rightClick" :class="{'none':leftIndex == (Math.ceil(leftList.length/5)-1)}"><i
              class="iconfont icon-arrowright"></i></span>
          </div>
        </div>
        <div class="list">
          <div class="title-w">
            <img src="@/static/right.png">
            <span>近期生效</span>
          </div>
          <ul>
            <li v-for="(item,ind) in rightListSelect" :key="ind" @click="goDetail(item)">
              <div>
                <span class="icon"></span>
                <span class="text">{{ item.articleTitle }}</span>
              </div>
              <div>
                <span class="no-icon icon"></span>
                <span class="desc">{{ item.publishDateTime }}发布 / {{ item.implementDate }}实施</span>
              </div>
            </li>
          </ul>
          <div class="page_w">
            <span @click="leftClick1" :class="{'none':rightIndex==0}"><i class="iconfont icon-arrowleft"></i></span>
            <span class="middle">｜</span>
            <span @click="rightClick1" :class="{'none':rightIndex == (Math.ceil(rightList.length/5)-1)}"><i
              class="iconfont icon-arrowright"></i></span>
          </div>
        </div>
      </div>
      <!-- 底部 -->
      <div class="footer_wraper" ref="footer" :class="{position:footerPosition}">
        <m-footer></m-footer>
      </div>
    </div>

    <!-- 登陆框 -->
    <div class="login_wraper">
      <transition name="slideUp">
        <common-login
          v-if="loginIsShow"
          @handleLoginClose="login"
          @registerClick="register"
          @forgetPassword="forgetPassword"
        ></common-login>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="loginIsShow" @click="login"></div>
      </transition>
    </div>
    <!-- 注册框 -->
    <div class="regiser_wraper">
      <transition name="slideUp">
        <common-register
          v-if="registerisShow"
          @handleRegisterClose="register"
          @registerSuccess="registerSuccess"
        ></common-register>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="registerisShow" @click="register"></div>
      </transition>
    </div>
    <!-- 注册成功 -->
    <div class="success_wraper">
      <transition name="slideUp">
        <register-success v-if="successTip"></register-success>
      </transition>
      <transition name="fade">
        <div class="commonBg" v-if="successTip"></div>
      </transition>
    </div>
  </div>
</template>
<script>
import {mapState, mapMutations} from "vuex";

import MHeader from "@/common/header/header";
import MFooter from "@/common/footer/footer";
import commonLogin from "@/common/login/login";
import commonRegister from "@/common/register/register";
import registerSuccess from "@/common/success/success";
import API from "@/api";



export default {
  data() {
    let self = this;
    return {
      bannerList: [],
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination",
        },
        allowTouchMove: false,
      },
      currentIndex: 0, //当前筛选项
      loginIsShow: false,
      registerisShow: false,
      successTip: false,
      activeIndex: 0,
      searchText: "",
      searchKeyWords: [],
      leftList: [],
      leftListSelect: [],
      leftIndex: 0,
      rightList: [],
      rightListSelect: [],
      rightIndex: 0,
      show: false,
      footerPosition: false,
    };
  },
  beforeMount() {
    this.getBannerList();
    this.getSearchKeyWords();
    this.setresultKeyWords("");
    this.setresultTypes(0);
    this.setKeyWord([]);
    this.clearAllKeyWord("");
    this.getLeft()
    this.getRight()


    // vuex存入主域名
    let href = window.location.href;
    localStorage.setItem('href', href)

  },
  mounted() {
    console.log('mounted')
    let h = document.documentElement.clientHeight;
    if (h > this.$refs.content.offsetHeight) {
      this.footerPosition = true
    }
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper.swiper;
    },
    ...mapState([
      "resultKeyWords",
      "token",
      "resultTypes",
      // "search_fw_current",
      "userInfo",
      "homeSearchParam"]),
  },
  methods: {
    ...mapMutations([
      "setresultKeyWords",
      "setresultTypes",
      // "setsearch_fw_current",
      "setKeyWord",
      "clearAllKeyWord",
      "setUrl",

    ]),
    clickSearch() {
      //如果没有登录则弹出登录框
      //如果没有空检索权限，且关键词为空，则提示输入关键词
      // if (!this.userInfo.noDataSearch && this.searchText === '') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }

      //通过vuex中的参数来向结果页中传搜索参数
      this.homeSearchParam.search_field = this.currentIndex;
      this.homeSearchParam.keyword = this.searchText;
      this.homeSearchParam.search_resource = 0; //默认搜索法律法规

      this.$router.push({path: "/result"});
    },
    hotSearch(keyword) {

      //通过vuex中的参数来向结果页中传搜索参数
      this.homeSearchParam.search_field = 0;
      this.homeSearchParam.keyword = keyword;

      this.$router.push({path: "/result"});
    },
    setSearchField(index) {
      this.currentIndex = index;
      this.homeSearchParam.current_search_field = index;
    },

    ///////////////////////////////////////////////////
    enter() {
      this.show = true
    },
    leave() {
      this.show = false
    },
    goDetail(item) {
      window.open(location.origin + `/detail/${item.articleId}`);
    },
    setsearchText() {
      let that = this;
      that.setresultKeyWords(this.searchText);
    },
    // hotSearch(e) {
    //   //热词搜索
    //   if (!this.token) {
    //     this.loginIsShow = true;
    //     return false;
    //   }
    //
    //   this.setresultKeyWords(e.keywordName);
    //   this.setHomeSearchParam(e.keywordName,"")
    //   this.$router.push("/result");
    // },
    login() {
      console.log('登录');
      //登陆按钮点击弹出登陆框
      this.loginIsShow = !this.loginIsShow;
      this.registerisShow = false;
    },
    register() {
      console.log('注册');
      //注册按钮点击弹出注册框
      this.registerisShow = !this.registerisShow;
      this.loginIsShow = false;
    },
    search(type) {
      //搜索 允许空检索
      // if (!this.searchText) {
      //   return false;
      // }

      // if (!this.userInfo.noDataSearch && this.resultKeyWords == ' ') {
      //   this.$message({
      //     message: "请输入关键词进行检索！",
      //   });
      //   return false
      // }
      this.$router.push({path: "/result"});
    },
    registerSuccess() {
      //注册成功
      let that = this;
      that.loginIsShow = false;
      that.registerisShow = false;
      that.successTip = true;
      setTimeout(function () {
        that.successTip = false;
        that.loginIsShow = true;
      }, 2000);
    },
    forgetPassword() {
      //忘记密码
      this.$router.push("/forgetPassword");
    },
    async getLeft() {
      let res = await API.publishDateTimeList()
      // console.log(res)
      if (res.code == 0) {
        this.leftList = res.data
        this.leftListSelect = this.leftList.slice(0, 5)
      }
    },
    async getRight() {
      let res = await API.implementDateList()
      // console.log(res)
      if (res.code == 0) {
        this.rightList = res.data
        this.rightListSelect = this.rightList.slice(0, 5)
      }
    },
    rightClick() {
      if (this.leftIndex < Math.ceil(this.leftList.length / 5) - 1) {
        this.leftIndex++;
        this.leftListSelect = this.leftList.slice(this.leftIndex * 5, (this.leftIndex + 1) * 5)
      }
    },
    leftClick() {
      if (this.leftIndex > 0) {
        this.leftIndex--;
        this.leftListSelect = this.leftList.slice(this.leftIndex * 5, (this.leftIndex + 1) * 5)
      }
    },
    rightClick1() {
      if (this.rightIndex < Math.ceil(this.rightList.length / 5) - 1) {
        this.rightIndex++;
        this.rightListSelect = this.rightList.slice(this.rightIndex * 5, (this.rightIndex + 1) * 5)
      }
    },
    leftClick1() {
      if (this.rightIndex > 0) {
        this.rightIndex--;
        this.rightListSelect = this.rightList.slice(this.rightIndex * 5, (this.rightIndex + 1) * 5)
      }
    },
    async getBannerList() {
      let res = await API.bannerRestList()
      if (res.code == 0) {
        this.bannerList = res.data;
        if (this.bannerList.length > 1) {
          this.swiperOptions = {
            pagination: {
              el: ".swiper-pagination",
            },
            loop: true,
            delay: 5000,
            allowTouchMove: false,
            autoplay: {
              disableOnInteraction: false,
              delay: 5000,
            },
          };
        }
      }
    },
    async getSearchKeyWords() {
      let res = await API.searchKeywordList()
      if (res.code == 0) {
        this.searchKeyWords = res.data;
      }
    },
    changeSlider(index) {
      this.swiper.slideToLoop(index, 300, true);
    },
  },
  components: {
    MHeader,
    MFooter,
    commonLogin,
    commonRegister,
    registerSuccess,
  }
};
</script>
<style lang="scss">
.header_w {
  .header {
    //width: 100%!important;
    //width: 1400px;
    padding: 0 40px !important;
    //margin: 0!important;
    //margin: 0 auto;
    //box-sizing: border-box !important;
  }
}
</style>
<style lang="scss" scoped>
.container {
  height: 100%;
  background-size: cover;
  position: relative;
  background: #0b1634;

  .commonBg {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: rgba(0, 0, 0, 0.5);
  }

  .banner_wraper {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1;
    background: #0b1634;

    .swiper_w {
      height: 100%;

      .slider_item {
        height: 100%;
        background-size: cover;
        background-position: center center;
        background-repeat: no-repeat;
      }
    }
  }

  .main-content {
    width: 100%;
    position: absolute;
    left: 0;
    z-index: 2;

    .search_wraper {
      margin-top: 230px;

      .search_title {
        font-size: 48px;
        color: #ffffff;
        text-align: center;
        line-height: 1;
        letter-spacing: 4px;
      }

      .search_Input_wraper {
        width: 690px;
        margin: 76px auto 0;

        .search_types {
          display: flex;
          align-items: center;
          list-style: none;
          font-size: 18px;
          color: #b6a9ac;

          li {
            margin-right: 35px;
            line-height: 1;
            position: relative;
            cursor: pointer;
          }

          li:first-child {
            margin-left: 30px;
          }

          li.active {
            color: #ffffff;

            ._trans {
              position: absolute;
              left: 50%;
              margin-left: -10px;
              bottom: -30px;
              border-top: 10px solid transparent;
              border-right: 10px solid transparent;
              border-left: 10px solid transparent;
              border-bottom: 10px solid #ffffff;
            }
          }

          li.active::after {
            width: 100%;
            content: "";
            position: absolute;
            bottom: -10px;
            left: 0;
            height: 3px;
            background: #0168c1;
          }
        }

        .search_input {
          height: 55px;
          background: #ffffff;
          margin-top: 30px;
          border-radius: 2px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .choose_search_type {
            color: rgba(153, 153, 153, 1);
            font-size: 14px;
            display: flex;
            align-items: center;
            padding-left: 24px;
            cursor: pointer;
            position: relative;
            height: 100%;

            .type_list {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              position: absolute;
              background: #fff;
              top: 56px;
              left: 0;
              width: 80px;
              line-height: 30px;
              border-radius: 1px;
              padding: 10px 0;
              font-size: 14px;
            }

            img {
              width: 10px;
              margin-left: 5px;
            }

            .line {
              height: 19px;
              border-left: 1px solid rgba(153, 153, 153, .5);
              margin: 0 12px;
            }
          }

          input {
            flex: 1;
            height: 55px;
            font-size: 14px;
            outline: none;
            border: none;
            background: none;
            padding: 0 28px 0 0;
            box-sizing: border-box;
            color: #000;
          }

          ::-webkit-input-placeholder {
            color: rgba(153, 153, 153, 1);;
          }

          .search_btn_w {
            width: 110px;
            height: 55px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #0168c1;
            cursor: pointer;
            color: #fff;
            font-size: 16px;

            img {
              width: 20px;
              margin-right: 13px;
            }
          }
        }

        .search_hot {
          margin-top: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          word-break: break-word;
          font-size: 14px;
          color: #fefefe;
          line-height: 1;
          overflow: hidden;

          .hot_title {
            flex: 0 0 80px;
            height: 20px;
            line-height: 20px;
          }

          ul {
            overflow: hidden;
            word-break: break-word;
            height: 20px;
            line-height: 20px;

            li {
              margin-right: 26px;
              white-space: nowrap;
              float: left;
              cursor: pointer;
            }

            li:hover {
              text-decoration: underline;
              color: #ffffff;
            }

            li:first-child {
              margin-left: 2px;
            }

            li:last-child {
              margin-right: 0;
            }
          }
        }

        // 分页的
        .paga_wraper {
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ffffff;
          width: 100%;
          position: absolute;
          left: 0;
          bottom: -150px;
          @media screen and (max-width: 1440px) {
            bottom: -100px;
          }

          .paga_list {
            display: flex;
            align-items: center;
            justify-content: center;

            .paga_item {
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 5px 0;
              cursor: pointer;

              span {
                background: rgba(255, 255, 255, 0.5);
                width: 110px;
                height: 3px;
                margin: 0 10px;
              }

              span.active {
                background: rgba(255, 255, 255, 1);
              }
            }
          }
        }
      }
    }

    .new-list {
      width: 1200px;
      height: 528px;
      box-sizing: border-box;
      padding: 34px 28px;
      background: linear-gradient(
          0deg,
          rgba(11, 22, 52, 0.5),
          rgba(35, 44, 70, 0.5)
      );
      margin: 70px auto 0;
      display: flex;
      justify-content: space-between;

      .list {
        width: 514px;

        .title-w {
          display: flex;
          align-items: center;
          font-size: 20px;
          color: #fff;
          font-weight: bold;

          img {
            width: 28px;
            height: 28px;
            margin-right: 6px;
            // background-color: red;
          }
        }

        ul {
          li {
            height: 80px;
            border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
            display: flex;
            justify-content: center;
            flex-direction: column;
            color: #fff;
            font-size: 14px;
            cursor: pointer;

            div {
              display: flex;
              align-items: center;

              .icon {
                width: 5px;
                height: 5px;
                flex: 0 0 5px;
                border-radius: 50%;
                background: #fff;
                margin-right: 10px;

                &.no-icon {
                  background: none;
                }
              }

              .desc {
                color: rgba(255, 255, 255, 0.6);
                font-size: 12px;
                margin-top: 5px;
              }
            }

          }
        }

        .page_w {
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255, 255, 255, 0.8);
          font-size: 16px;
          margin-top: 16px;

          .iconfont {
            font-size: 12px;

            &:hover {
              color: rgba(255, 255, 255, 1);
            }
          }

          span {
            cursor: pointer;
          }

          .none {
            color: rgba(255, 255, 255, 0.3);
            cursor: default;

            .iconfont {
              &:hover {
                color: rgba(255, 255, 255, .3);
              }
            }
          }

          .middle {
            color: rgba(255, 255, 255, 0.3);
            font-size: 14px;
            margin: 0 5px;
          }
        }
      }
    }
  }

  .footer_wraper {
    // position: absolute;
    // left: 0;
    // bottom: 0;
    width: 100%;
    margin-top: 108px;
    // z-index: 2;
    &.position {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
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

.arrow-down {
  width: 0;
  height: 0;
  border-top: 4px solid #999;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  margin-left: 2px;
}

.icon-search {
  font-size: 24px;
  margin-right: 10px;
}
</style>
