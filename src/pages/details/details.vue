<template>
  <div class="container">
    <!-- header -->
    <div class="header_wraper">
      <m-header
        @loginClick="login"
        @registerClick="register"
        searchRightShow="true"
      ></m-header>
    </div>
    <!-- 主体内容 -->
    <div class="main_content">
      <div class="main_left">
        <div class="local" v-if="baseInfo.article&&baseInfo.article.articleTitle">
          <!-- <img src="@/static/loc.png" alt=""> -->
          <i class="iconfont icon-location"></i>
          您当前所在位置：<a href="/">首页</a>>{{ baseInfo.article.articleTitle }}
        </div>
        <div class="category_list">
          <div class="category_item">
            <span class="name">发布机构：</span>
            <span class="desc"><div
              class="ellipsis">{{
                baseInfo.information && baseInfo.information.publishOfficeName ? baseInfo.information.publishOfficeName : '--'
              }}</div></span>
          </div>
          <div class="category_item">
            <span class="name">发文字号：</span>
            <span class="desc"><div
              class="ellipsis">{{
                baseInfo.information && baseInfo.information.publishNum ? baseInfo.information.publishNum : '--'
              }}</div></span>
          </div>
          <div class="category_item">
            <span class="name">效力级别：</span>
            <span
              class="desc">{{
                baseInfo.information && baseInfo.information.effectLevelName ? baseInfo.information.effectLevelName : '--'
              }}</span>
          </div>
          <div class="category_item">
            <span class="name">发布日期：</span>
            <span
              class="desc">{{
                baseInfo.information && baseInfo.information.publishDateTime ? baseInfo.information.publishDateTime : '--'
              }}</span>
          </div>
          <div class="category_item">
            <span class="name">时效性：</span>
            <span
              class="desc">{{
                baseInfo.information && baseInfo.information.timeLinessName ? baseInfo.information.timeLinessName : "--"
              }}</span>
          </div>
          <div class="category_item">
            <span class="name">实施日期：</span>
            <span
              class="desc">{{
                baseInfo.information && baseInfo.information.implementDate ? baseInfo.information.implementDate : '--'
              }}</span>
          </div>
        </div>
        <div class="article_title" v-if="baseInfo.article&&baseInfo.article.articleTitle">
          {{ baseInfo.article.articleTitle }}
        </div>
        <div class="fun_list">
          <div class="fun_left">
            <span @click="showTHandle">我要挑错</span>
            <img @click="showTHandle" src="@/static/edit.png" alt="">
            <div class="tiao_cuo" v-show="showT">
              <div class="mask" @click="hideHandle"></div>
              <div class="box">
                <textarea placeholder="请输入内容..." v-model="desc" :maxlength="maxlength"></textarea>
                <div class="button_wraper">
                  <span class="total" v-if="!desc">最多输入 {{ maxlength }} 字符</span>
                  <span class="total count" :class="desc.length == maxlength ?'red':''"
                        v-else>还可以输入 {{ maxlength - desc.length }} 字符</span>
                  <div class="button" @click="submit">提交</div>
                </div>
              </div>
            </div>
          </div>
          <div class="fun_right">
            <!--            -->
            <!--            暂时不需要点赞功能-->
            <!--            <i class="iconfont icon-favorites" @click="collect(true)" v-if="baseInfo.article&&!baseInfo.article.isPraise"></i>-->
            <!--            <i class="iconfont icon-favorites-fill" @click="collect(false)" v-if="baseInfo.article&&baseInfo.article.isPraise"></i>-->
            <span class="line"></span>

            <i class="iconfont icon-favorite" @click="collection"
               v-if="baseInfo.article&&!baseInfo.article.isCollect"></i>
            <i class="iconfont icon-favorite-fill" @click="cancleCollection"
               v-if="baseInfo.article&&baseInfo.article.isCollect"></i>
            <span class="line"></span>
            <!-- <img src="@/static/big.png" @click="big"> -->
            <i class="iconfont icon-Word-add" @click="big"></i>
            <span class="line"></span>
            <!-- <img src="@/static/little.png" @click="little"> -->
            <i class="iconfont icon-Word-minus" @click="little"></i>
          </div>
        </div>
        <!-- 令头信息 -->
        <div class="article_top" v-if="baseInfo.article&&baseInfo.article.contentTop"
             v-html="baseInfo.article.contentTop"></div>
        <!-- 详情 -->
        <div class="detail_content" v-if="baseInfo.article&&baseInfo.article.articleContent"
             :style="{fontSize:currentFont+'px'}">
          <div v-html="baseInfo.article.articleContent"></div>
          <!-- 附件 -->
          <!--          <ul class="attachment">-->
          <!--            <li v-for="(item,index) in baseInfo.article.attachmentList" :key="index">-->
          <!--              <a :href="item.filePath">{{item.fileName}}</a>-->
          <!--            </li>-->
          <!--          </ul>-->
        </div>
        <div class="attachment_wraper" v-if="attachmentList.length>0">
          <h3 class="attachment_title">附件</h3>
          <div class="attachment">
            <ul>
              <li v-for="(item,index) in attachmentList" :key="index">
                <a :href="item.filePath">{{ item.fileName }}</a>
              </li>
            </ul>
          </div>
        </div>
        <!--    历史版本-->
        <div class="history_wraper" v-if="historyList.length>0">
          <h3 class="history_title">历史版本</h3>
          <div class="history_timeline">
            <el-timeline>
              <el-timeline-item class="history_parent" v-for="(item, index) in historyList" :key="index" placement="top"
                                color="#4394f7" :timestamp="item.publishDateTime">
                <span class="history_parent_with_id" @click="goDetail(item)"
                      v-if="item.articleId !=='' & item.articleId !==articleId">{{ item.detailTitle }}</span>
                <span class="history_parent_no_id" v-if="item.articleId ===''">{{ item.detailTitle }}</span>
                <span class="history_parent_is_self" v-if="item.articleId ===articleId">{{ item.detailTitle }}</span>

                <ul v-if="item.childrenList">
                  <li class="history_children" v-for="(child,index) in item.childrenList" :key="index">
                    <span class="history_children_with_id" @click="goDetail(child)"
                          v-if="child.articleId !=='' & child.articleId !==articleId">{{ child.detailTitle }}</span>
                    <span class="history_children_no_id" v-if="child.articleId ===''">{{ child.detailTitle }}</span>
                  </li>
                </ul>
              </el-timeline-item>
            </el-timeline>
          </div>
        </div>

        <!-- 无权限 -->
        <div class="no_access" v-if="baseInfo.article&&!baseInfo.article.authority">
          文章内容未完全展示，请<span @click="buyall">登录或注册</span>。
        </div>

        <!-- <div class="left">
          <div
            class="title"
            v-if="baseInfo.article && baseInfo.article.articleTitle"
          >
            {{ baseInfo.article.articleTitle }}
          </div>
          <div class="content">
            <div class="content_left">
              <div class="lines">
                <span class="lines_left"></span>
                <span class="lines_center">工具</span>
                <span class="lines_right"></span>
              </div>
              <ul class="too_list">
                <li>
                  <a href="javascript:;" @click="downFile">
                    <img src="@/static/down.png" />
                    <span>下载</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;" @click="collect">
                    <img src="@/static/coll.png" />
                    <span>收藏</span>
                  </a>
                </li>
                <li>
                  <a href="javascript:;" @click="share">
                    <img src="@/static/share.png" />
                    <span>挑错</span>
                  </a>
                </li>
              </ul>
            </div>
            <div class="content_right" v-if="baseInfo.article">
              <div
                class="content_detail_text"
                v-if="baseInfo.article.articleContent"
                v-html="baseInfo.article.articleContent"
              ></div>
              <div class="buy_wraper" v-if="!baseInfo.article.authority">
                <span @click="buySingle(baseInfo.article)">购买单篇</span>
                <span @click="buyall">购买会员</span>
              </div>
            </div>
          </div>
        </div>
        <div class="right">
          <div class="slider_wraper" v-if="adverList.length > 0">
            <swiper ref="mySwiper" :options="swiperOptions" class="swiper_w">
              <swiper-slide v-for="(item, index) in adverList" :key="index">
                <a :href="item.adverLink" target="_blank">
                  <div class="img_wraper">
                    <img :src="$url + item.adverPath" />
                  </div>
                </a>
              </swiper-slide>
            </swiper>
            <div class="pagation_swiper">
              <span
                :class="{ activeSwiper: currnetIndex == index }"
                v-for="(item, index) in adverList"
                @click="changeSlider(index)"
                :key="item.adverId"
              ></span>
            </div>
          </div>
          <div class="base_info">
            <div class="title">
              <span></span>
              <span>基本信息</span>
            </div>
            <ul v-if="baseInfo.information && baseInfo.article.articleType == 1">
              <li>
                <span>效力级别：</span>
                <span class="blueColor">{{
                  baseInfo.information.effectLevelName?baseInfo.information.effectLevelName:''
                }}</span>
              </li>
               <li>
                <span>时 效 性：</span>
                <span>{{
                  baseInfo.information.timeLiness == 1
                    ? "现行有效"
                    : baseInfo.information.timeLiness == 2
                    ? "部分失效"
                    : baseInfo.information.timeLiness == 3
                    ? "失效"
                    : baseInfo.information.timeLiness == 4
                    ? "尚未生效"
                    : baseInfo.information.timeLiness == 4
                    ? "已被修订"
                    : ""
                }}</span>
              </li>
              <li>
                <span>发布机关：</span>
                <span class="blueColor">{{
                  baseInfo.information.publishOfficeName?baseInfo.information.publishOfficeName:''
                }}</span>
              </li>
              <li>
                <span>发文字号：</span>
                <span>{{
                  baseInfo.information.publishNum?baseInfo.information.publishNum:''
                  }}</span>
              </li>
              <li>
                <span>发布日期：</span>
                <span>{{
                  baseInfo.information.publishDateName?baseInfo.information.publishDateName:''
                   }}</span>
              </li>
              <li>
                <span>实施日期：</span>
                <span>{{
                  baseInfo.information.implementDate?baseInfo.information.implementDate
                    .split(" ")[0]
                    .replace(/-/gi, "."):''
                }}</span>
              </li>
            </ul>
            <ul v-if="baseInfo.information && baseInfo.article.articleType == 2">
              <li>
                <span>案由：</span>
                <span class="blueColor">{{
                  baseInfo.information.causeActionId?baseInfo.information.causeActionId:''
                }}</span>
              </li>
              <li>
                <span>审理法院：</span>
                <span class="blueColor">{{
                  baseInfo.information.trialCourtName?baseInfo.information.trialCourtName:''
                }}</span>
              </li>
              <li>
                <span>案件字号：</span>
                <span>{{
                  baseInfo.information.causeCode?baseInfo.information.causeCode:''
                  }}</span>
              </li>
               <li>
                <span>文书类型：</span>
                <span>{{
                  baseInfo.information.textType?baseInfo.information.textType:''
                   }}</span>
              </li>
               <li>
                <span>审结日期：</span>
                <span class="blueColor">{{
                  baseInfo.information.yearConclusionName?baseInfo.information.yearConclusionName:''
                }}</span>
              </li>
            </ul>
            <ul v-if="baseInfo.information && baseInfo.article.articleType == 3">
              <li>
                <span>领域：</span>
                <span>{{
                  baseInfo.information.fieldName?baseInfo.information.fieldName:''
                   }}</span>
              </li>
              <li >
                <span>签署地点：</span>
                <span class="blueColor">{{
                  baseInfo.information.signingPlace?baseInfo.information.signingPlace:''
                }}</span>
              </li>
              <li>
                <span>签订日期：</span>
                <span>{{
                  baseInfo.information.countrySigningTime?baseInfo.information.countrySigningTime
                    .split(" ")[0]
                    .replace(/-/gi, "."):''
                }}</span>
              </li>
              <li>
                <span>生效时间：</span>
                <span>{{
                  baseInfo.information.treatyValidTime?baseInfo.information.treatyValidTime
                    .split(" ")[0]
                    .replace(/-/gi, "."):''
                }}</span>
              </li>
            </ul>
            <ul v-if="baseInfo.information && baseInfo.article.articleType == 4">
              <li>
                <span>Level of Authority：</span>
                <span class="blueColor">{{
                  baseInfo.information.effectLevelEnglishName?baseInfo.information.effectLevelEnglishName:''
                }}</span>
              </li>
              <li>
                <span>Status：</span>
                <span>{{
                  baseInfo.information.timeLinessEnglish == 1
                    ? "现行有效"
                    : baseInfo.information.timeLinessEnglish == 2
                    ? "部分失效"
                    : baseInfo.information.timeLinessEnglish == 3
                    ? "失效"
                    : baseInfo.information.timeLinessEnglish == 4
                    ? "尚未生效"
                    : baseInfo.information.timeLinessEnglish == 4
                    ? "已被修订"
                    : ""
                }}</span>
              </li>
               <li>
                <span>Issuing Authority：</span>
                <span class="blueColor">{{
                  baseInfo.information.publishOfficeEnglishName?baseInfo.information.publishOfficeEnglishName:""
                }}</span>
              </li>
               <li>
                <span>Date Issued：</span>
                <span>{{
                  baseInfo.information.publishDateEnglishName?baseInfo.information.publishDateEnglishName:''
                   }}</span>
              </li>
               <li>
                <span>Effective Date：</span>
                <span>{{
                  baseInfo.information.implementDateEnglish?baseInfo.information.implementDateEnglish
                    .split(" ")[0]
                    .replace("/-/ig", "."):''
                }}</span>
              </li>
            </ul>
          </div>
        </div> -->
      </div>
      <div class="main_right">
        <div class="slider_wraper" v-if="adverList.length > 0">
          <swiper ref="mySwiper" :options="swiperOptions" class="swiper_w">
            <swiper-slide v-for="(item, index) in adverList" :key="index">
              <a :href="item.adverLink" target="_blank">
                <div class="img_wraper">
                  <img class="advertise_img" :src="$url + item.adverPath"/>
                </div>
              </a>
            </swiper-slide>
          </swiper>
        </div>
        <div class="sticky_wraper">
          <div class="catalog_wraper">
            <div class="catalog" v-if="catalogList.length>0">
              <div class="catalog_title"><h3>文章目录</h3></div>
              <div class="catalog_tree">
                <el-tree class="tree_item" :data="catalogList" :props="defaultProps"
                         @node-click="handleNodeClick"></el-tree>
              </div>

            </div>
          </div>
          <div class="latest_wraper">
            <div class="latest_title"><h3>最新发布</h3></div>
            <div class="latest">
              <ul>
                <li v-for="(item,index) in latestListSelect" :key="index" @click="goDetail(item)">
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
            </div>
            <!--          这里是分页按钮，目前不需要不显示-->
            <!--          <div class="page_w">-->
            <!--            <span @click="leftClick" :class="{'none':leftIndex==0}"><i class="iconfont icon-arrowleft"></i></span>-->
            <!--            <span class="middle">｜</span>-->
            <!--            <span @click="rightClick" :class="{'none':leftIndex == (Math.ceil(latestList.length/8)-1)}"><i class="iconfont icon-arrowright"></i></span>-->
            <!--          </div>-->
          </div>
          <div class="effective_wraper">
            <div class="effective_title"><h3>近期生效</h3></div>
            <div class="effective">
              <ul>
                <li v-for="(item,index) in effectiveListSelect" :key="index" @click="goDetail(item)">
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
            </div>
          </div>
        </div>
      </div>

    </div>
    <!-- 底部 -->
    <div class="footer_w">
      <m-footer></m-footer>
    </div>
    <!-- 登陆框 -->
    <div class="login_wraper">
      <transition name="slideUp">
        <common-login
          v-if="loginIsShow"
          @handleLoginClose="login"
          @registerClick="register"
          @forgetPassword="forgetPassword"
          @loginSuccess="loginSuccess"
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
import MHeader from "@/common/header/header";
import commonLogin from "@/common/login/login";
import MFooter from "@/common/footer/footer";
import commonRegister from "@/common/register/register";
import registerSuccess from "@/common/success/success";
import API from "@/api/index";
import {httpGet, httpPost} from "@/api/index";
import {mapState} from "vuex";

export default {
  data() {
    return {
      str_test: "test",
      loginIsShow: false,
      registerisShow: false,
      successTip: false,
      articleId: "",
      adverList: [],
      currnetIndex: 0,
      swiperOptions: {
        loop: false,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: ".swiper-pagination",
        },
        observer: true, // 动态检查器,自动初始化swiper,默认为false
        observerParents: true,
        preventClicks: false,
        allowTouchMove: false,

      },
      baseInfo: "",
      currentFont: 16,
      desc: '',
      showT: false,
      maxlength: 300,
      latestList: [],
      latestListSelect: [],
      effectiveList: [],
      effectiveListSelect: [],
      latestIndex: 0,
      effectiveIndex: 0,
      catalogList: [],
      attachmentList: [],
      historyList: [],

      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'item'
      }
    };
  },
  async asyncData(data) {
    console.log(111)
    let content = {};
    if (data.params.id) {
      console.log(222)

      let res = await httpGet(`/api/article/rest/detail/${data.params.id}`)
      console.log(33)
      console.log(res)
      if (res.code == 0) {
        content = {
          baseInfo: res.data,
          catalogList: res.data.article.mlList,
          attachmentList: res.data.article.attachmentList,
          historyList: res.data.groupInfo,
        }
        console.log(content)
      }
    }
    return {
      ...content
    }
  }
  ,
  mounted() {
    if (this.$route.params.id) {
      this.articleId = this.$route.params.id;
      this.getContent();
    }
    this.getAdList()
    this.getLatest()
    this.getEffective()
  }
  ,
  computed: {
    ...
      mapState(["hasLogin", "userInfo", "token"]),
    swiper() {
      return this.$refs.mySwiper.swiper;
    }
    ,
  }
  ,
  methods: {
    goHome() {
    }
    ,
    handleNodeClick(data) {
      this.goJump(data.code)
    }
    ,
    goJump(id) {
      document.getElementById(id).scrollIntoView({
        behavior: "smooth", // 平滑过渡
        block: "center"
      });

    }
    ,
    goDetail(item) {
      if (!this.userInfo) {
        this.login()
        return false
      }
      if (item.articleId !== '')
        window.open(location.origin + `/detail/${item.articleId}`);
    }
    ,
    goHistory(item) {
      if (!this.userInfo) {
        this.login()
        return false
      }
      window.open(location.origin + `/detail/${item.groupDetailId}`);
    }
    ,
    getLatest() {
      httpGet('/api/article/rest/publishDateTimeList').then((res) => {
        if (res.code == 0) {
          this.latestList = res.data
          this.latestListSelect = this.latestList.slice(0, 8)
        }
      })
    }
    ,
    getEffective() {
      httpGet('/api/article/rest/implementDateList').then((res) => {
        if (res.code == 0) {
          this.effectiveList = res.data
          this.effectiveListSelect = this.effectiveList.slice(0, 8)
        }
      })
    }
    ,
    // 最新发布的右击翻页
    rightClick() {
      if (this.latestIndex < Math.ceil(this.latestList.length / 8) - 1) {
        this.latestIndex++;
        this.latestListSelect = this.latestList.slice(this.latestIndex * 8, (this.latestIndex + 1) * 8)
      }
    }
    ,
    leftClick() {
      if (this.latestIndex > 0) {
        this.latestIndex--;
        this.latestListSelect = this.latestList.slice(this.latestIndex * 8, (this.latestIndex + 1) * 8)
      }
    }
    ,
    // rightClick1(){
    //   if(this.rightIndex<Math.ceil(this.rightList.length/5)-1){
    //     this.rightIndex++;
    //     this.rightListSelect = this.rightList.slice(this.rightIndex*5,(this.rightIndex+1)*5)
    //   }
    // },
    // leftClick1(){
    //   if(this.rightIndex>0){
    //     this.rightIndex--;
    //     this.rightListSelect = this.rightList.slice(this.rightIndex*5,(this.rightIndex+1)*5)
    //   }
    // },
    showTHandle() {
      this.showT = !this.showT
    }
    ,
    hideHandle() {
      this.showT = !this.showT
    }
    ,
    submit() {
      if (!this.desc) {
        this.$message({
          type: 'info',
          message: '输入内容不能为空'
        });
        return false
      }
      this.submitAjax(this.desc)
    }
    ,
    big() {
      if (this.currentFont > 32) {
        return false
      }
      this.currentFont++
      console.log('this.currentFont', this.currentFont);
    }
    ,
    little() {
      if (this.currentFont <= 10) {
        return false
      }
      this.currentFont--
    }
    ,
    downFile() {
      if (!this.token) {
        this.loginIsShow = true;
        return false;
      }
      if (this.baseInfo) {
        if (!this.baseInfo.article.authority) {
          this.$message.error("请购买后下载");
          return false;
        } //location.href = `${this.$downUrl}article/exportWord/${this.baseInfo.article.articleId}?token=${this.token}`
        API.downFile(
          `/api/article/exportWord/${this.baseInfo.article.articleId}`
        ).then((res) => {
          if (!res) {
            this.$message.error("下载模板文件失败");
            return false;
          }
          const blob = new Blob([res], {
            type: "application/msword;charset=GB2312",
          });
          let objectUrl = URL.createObjectURL(blob);
          console.log(objectUrl);
          location.href = objectUrl;
        });
      }
      console.log(this.baseInfo.article.articleId);
    }
    ,
    share() {
      let that = this;
      this.$prompt('请输入问题', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /\S/,
        inputErrorMessage: '不能为空',
        beforeClose: (action, instance, done) => {
          if (action == "confirm") {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '提交中...';
            that.submitAjax(instance.inputValue, function () {
              instance.confirmButtonLoading = false;
              done()
            })
            console.log(instance)
          }
        }
      }).then(({value}) => {
        this.$message({
          type: 'success',
          message: '提交成功'
        });
      })
    }
    ,
    submitAjax(desc) {
      //获取详情

      var baseUrl = `/api/articleQuestion`;

      httpPost(baseUrl, {
        articleId: this.articleId,
        desc: desc
      }, this.token).then((res) => {
        if (res.code == 0) {
          this.$message({
            type: 'success',
            message: '提交成功'
          });
          this.showT = false
        } else {
          this.$message({
            type: 'info',
            message: res.mess
          });
        }
      });
    }
    ,
    buyall() {
      if (this.token) {
        this.$router.push("/pay");
        this.$router.push({path: '/pay', query: {id: this.articleId}})
      } else {
        this.loginIsShow = true;
      }
    }
    ,
    buySingle(item) {
      if (this.token) {
        this.$router.push(`/singlePay/${item.articleId}`);
        //window.open(`/singlePay/${item.articleId}/${item.articlePrice}`,'target')
      } else {
        this.loginIsShow = true;
      }
    }
    ,
    loginSuccess() {
      this.getContent();
    }
    ,
    changeSlider(index) {
      this.swiper.slideTo(index, 300, true);
      this.currnetIndex = index;
    }
    ,
    login() {
      //登陆按钮点击弹出登陆框
      this.loginIsShow = !this.loginIsShow;
      this.registerisShow = false;
    }
    ,
    register() {
      //注册按钮点击弹出注册框
      this.registerisShow = !this.registerisShow;
      this.loginIsShow = false;
    }
    ,
    forgetPassword() {
      //忘记密码
      this.$router.push("/forgetPassword");
    }
    ,
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
    }
    ,
    getContent(ssr = false) {
      return new Promise(resolve => {
        if (ssr) {
          var baseUrl = `/api/article/rest/detail/${this.articleId}`;
        } else {
          //获取详情
          if (this.token) {
            var baseUrl = `/api/article/detail/${this.articleId}`;
          } else {
            var baseUrl = `/api/article/rest/detail/${this.articleId}`;
          }
        }

        httpGet(baseUrl, this.token, {}).then((res) => {
          if (res.code == 0) {
            this.baseInfo = res.data;
            console.log(this.baseInfo)
            // this.gid = res.data.information.effectLevelId;
            document.title = res.data.article.articleTitle;
            this.catalogList = res.data.article.mlList;
            this.attachmentList = res.data.article.attachmentList;
            this.historyList = res.data.groupInfo;
            resolve({
              baseInfo: res.data,
              catalogList: res.data.article.mlList,
              attachmentList: res.data.article.attachmentList,
              historyList: res.data.groupInfo,
            })
          } else {
            resolve({})
          }
        });

      })
    }
    ,
    collection(item) {
      httpPost(`/api/userCollection/${this.articleId}`, "", this.token).then(
        (res) => {
          if (res.code == 0 || res.code == 120) {
            this.$message({
              type: "success",
              message: "收藏成功",
            });
            this.baseInfo.article.isCollect = true;
          } else {
            this.$message({
              type: "info",
              message: res.mess,
            });
          }
        }
      );
    }
    ,
    //取消收藏
    cancleCollection(item) {
      API.deleteAllCollectCancel(this.articleId).then((res) => {
        console.log(res);
        if (res.code == 0) {
          this.$message({
            type: "success",
            message: "取消收藏成功",
          });
          this.baseInfo.article.isCollect = false;
        } else {
          this.$message({
            type: "info",
            message: res.mess,
          });
        }
      });
    }
    ,
    collect(flag) {
      if (!this.token) {
        this.loginIsShow = true;
        return false;
      }
      httpPost(`/api/praiseArticle/${this.articleId}/${flag}`, "", this.token).then(
        (res) => {
          if (res.code == 0 || res.code == 120) {
            if (flag) {
              this.$message({
                type: "success",
                message: "点赞成功",
              });
              this.baseInfo.article.isPraise = true
            } else {
              this.$message({
                type: "success",
                message: "取消点赞成功",
              });
              this.baseInfo.article.isPraise = false
            }

          } else {
            this.$message({
              type: "info",
              message: res.mess,
            });
          }
        }
      );
    }
    ,
    getAdList() {
      //获取广告
      let that = this;
      httpGet("/api/adver/rest/list/2", that.token, {}).then((res) => {
        if (res.code == 0) {
          this.adverList = res.data;
        }
      });
    }
    ,
  }
  ,
  components: {
    MHeader,
    commonLogin,
    MFooter,
    commonRegister,
    registerSuccess,
  }
  ,
};
</script>

<style scoped lang="scss">
.container {
  background-color: #f5f5f5;

  .main_content {
    background-color: #f5f5f5;
    display: flex;
    flex-direction: row;
    width: 1400px;
    //border: solid 1px black;

    // padding: 0 17.7%;
    // width: 1245px;
    min-height: calc(100vh - 70px);
    margin: 70px auto 0px auto;
    box-sizing: border-box;

    .local {
      font-size: 14px;
      color: rgba(96, 98, 102, 1);
      margin-top: 18px;
      margin-left: 18px;
      display: flex;
      align-items: center;

      img {
        width: 16px;
        margin-right: 4px;
      }

      a {
        cursor: pointer;
        color: rgba(96, 98, 102, 1);
        text-decoration: none;
      }
    }

    .category_list {
      display: flex;
      flex-wrap: wrap;
      //width: 100%;
      border-top: 1px solid rgba(226, 232, 235, 1);
      border-right: 1px solid rgba(226, 232, 235, 1);
      margin-top: 18px;
      margin-left: 20px;
      margin-right: 20px;

      .category_item {
        width: 50%;
        display: flex;
        align-items: center;
        height: 37px;

        .ellipsis {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          height: 100%;
          display: flex;
          align-items: center;
          border-left: 1px solid rgba(226, 232, 235, 1);
          border-bottom: 1px solid rgba(226, 232, 235, 1);
          box-sizing: border-box;

        }

        .name {
          background: rgba(241, 245, 255, 1);
          font-size: 14px;
          color: rgba(48, 49, 51, 1);
          width: 110px;
          justify-content: center;
        }

        .desc {
          flex: 1;
          font-size: 14px;
          color: rgba(96, 98, 102, 1);
          padding-left: 14px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 100px;
        }
      }
    }

    .article_title {
      font-size: 30px;
      text-align: center;
      color: #106abe;
      font-weight: 500;
      margin-top: 30px;
      margin-left: 30px;
      margin-right: 30px;
    }

    .fun_list {
      border-bottom: 1px solid rgba(226, 232, 235, 1);
      padding: 15px 0;
      padding-left: 25px;
      padding-right: 25px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      cursor: pointer;

      .fun_left {
        color: rgba(144, 147, 153, 1);
        font-size: 14px;
        display: flex;
        align-items: center;
        position: relative;

        img {
          width: 15px;
          margin-left: 9px;
        }

        .tiao_cuo {
          position: absolute;
          left: 30px;
          top: 25px;
          background: #fff;
          height: 145px;
          width: 850px;
          border: 1px solid rgba(227, 232, 235, 1);
          background: #fff;

          .box {
            position: relative;
            z-index: 2;

            .total {
              position: absolute;
              bottom: 45px;
              right: 5px;
              color: #ccc;

              &.count {
                bottom: 10px;
                right: 96px;
              }

              &.red {
                color: #fd5320;
              }
            }
          }

          .mask {
            background: rgba(0, 0, 0, 0);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 0;
            cursor: default;
          }

          textarea {
            width: 100%;
            resize: none;
            border: none;
            box-sizing: border-box;
            font-size: 14px;
            padding: 12px;
            outline: none;
            height: 103px;
          }

          .button_wraper {
            height: 40px;
            background: #f7f7f7;
            display: flex;
            align-items: center;
            justify-content: flex-end;

            .button {
              width: 80px;
              height: 30px;
              color: #fff;
              background: rgba(1, 104, 193, 1);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 6px;
              font-size: 14px;
            }
          }
        }
      }

      .fun_right {
        display: flex;
        align-items: center;

        .iconfont {
          font-size: 18px;
          color: #909399;

          &:hover {
            color: #0168c1;
          }

          &.icon-favorites-fill {
            color: #0168c1;
          }

          &.icon-favorite {
            font-size: 16px;
          }

          &.icon-favorite-fill {
            font-size: 16px;
            color: #0168c1;
          }
        }

        .line {
          margin: 0 10px;
          height: 14px;
          border-left: 1px solid rgba(226, 232, 235, 1);
        }

        img {
          width: 18px;
        }
      }
    }

    .article_top {
      // background: rgba(1,104,193,0.035);
      //border: 1px solid #e2e8eb;
      margin-left: 75px;
      margin-right: 75px;
      margin-top: 15px;
      padding: 15px;
      //margin-top: 10px;
      //margin-left: 50px;
      //margin-right: 50px;
      font-size: 14px;
      background: #f5f5f5;
      color: #606266;
      line-height: 1.6;
    }

    .detail_content {
      padding-left: 85px;
      padding-right: 85px;
      padding-top: 20px;
      margin-top: 20px;

      line-height: 1.6;
      color: #080808;
      margin-bottom: 40px;

      > > > p {
        //font-size : 16px;
        margin-bottom: 20px;
      }
    }

    //p{
    //  margin-bottom: 50px;
    //}
    .no_access {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      color: rgba(48, 49, 51, 1);
      height: 50px;
      background: #f7f7f7;
      margin-top: 30px;
      margin-bottom: 30px;

      span {
        color: #63a1d7;
        font-weight: bold;
        cursor: pointer;

        &:hover {
          color: #0168c1;
        }
      }
    }

  }

  .commonBg {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 3;
    background: rgba(0, 0, 0, 0.5);
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

  .main_left {
    box-shadow: 0 0 2px rgba(0, 0, 0, .1);
    flex: 1;
    margin-right: 20px;
    background-color: #ffffff;
    margin-top: 10px;
    margin-bottom: 10px;
    //border-right: 1px solid rgba(226, 232, 235, 1);
    //border-left: 1px solid rgba(226, 232, 235, 1);
    //border-top: 1px solid rgba(226, 232, 235, 1);
    //border-bottom: 1px solid rgba(226, 232, 235, 1);
  }


  .main_right {
    margin-top: 10px;
    margin-bottom: 10px;
    flex: 0 0 380px;
    font-size: 14px;

    .slider_wraper {
      .advertise_img {
        background-color: #55a532;
        width: 380px;
        height: 170px;
      }
    }

    .sticky_wraper {
      position: sticky;
      top: 85px;

      .catalog_wraper {
        box-shadow: 0 0 2px rgba(0, 0, 0, .1);
        margin-top: 20px;
        background-color: #ffffff;

        .catalog_title {
          padding: 15px;
        }

        .catalog_tree {
          padding-bottom: 15px;
          padding-left: 10px;
          padding-right: 20px;

          > > > .el-tree-node {
            white-space: normal;
            margin-top: 5px;
            margin-bottom: 5px;

            .el-tree-node__content {
              height: 100%;
              align-items: start;
            }
          }

          .tree_item {
            color: #080808;
          }
        }
      }

      .latest_wraper {
        box-shadow: 0 0 2px rgba(0, 0, 0, .1);
        margin-top: 20px;
        background-color: #ffffff;

        .latest_title {
          padding: 15px;
        }

        .latest {
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: 15px;

          ul {
            li {
              display: flex;
              justify-content: center;
              flex-direction: column;
              font-size: 14px;
              padding-bottom: 12px;

              div {
                display: flex;
                align-items: center;

                .icon {
                  width: 5px;
                  height: 5px;
                  flex: 0 0 5px;
                  border-radius: 50%;
                  background-color: #4394f7;
                  margin-right: 10px;

                  &.no-icon {
                    background: none;
                  }
                }

                .text {
                  cursor: pointer;
                  //font-weight: bold;
                  color: #080808;

                  &:hover {
                    color: #175eb3;
                  }
                }

                .desc {
                  color: #909399;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }
          }

        }
      }

      .effective_wraper {
        box-shadow: 0 0 2px rgba(0, 0, 0, .1);
        margin-top: 20px;
        background-color: #ffffff;

        .effective_title {
          padding: 15px;
        }

        .effective {
          padding-left: 20px;
          padding-right: 20px;
          padding-bottom: 15px;

          ul {
            li {
              //height: 60px;
              //border-bottom: 1px dashed rgba(255, 255, 255, 0.2);
              display: flex;
              justify-content: center;
              flex-direction: column;
              font-size: 14px;
              padding-bottom: 12px;

              div {
                display: flex;
                align-items: center;

                .icon {
                  width: 5px;
                  height: 5px;
                  flex: 0 0 5px;
                  border-radius: 50%;
                  background-color: #4394f7;
                  margin-right: 10px;

                  &.no-icon {
                    background: none;
                  }
                }

                .text {
                  cursor: pointer;
                  //font-weight: bold;
                  color: #080808;

                  &:hover {
                    color: #0168c1;
                  }
                }

                .desc {
                  color: #909399;
                  font-size: 12px;
                  margin-top: 4px;
                }
              }
            }
          }
        }
      }
    }
  }

  .attachment_wraper {
    border-top: 1px solid rgba(226, 232, 235, 1);
    font-size: 14px;
    margin-bottom: 50px;

    .attachment_title {
      margin-top: 20px;
      margin-bottom: 15px;
      padding-left: 75px;
    }

    .attachment {
      cursor: pointer;

      li {
        padding-bottom: 10px;
        padding-left: 75px;
      }

      a {
        text-decoration: none;
        font-size: 14px;
        color: #131313;

        &:hover {
          color: #0168c1;
        }
      }
    }
  }

  .history_wraper {
    border-top: 1px solid rgba(226, 232, 235, 1);
    font-size: 14px;
    margin-bottom: 50px;

    .history_title {
      padding-top: 15px;
      padding-bottom: 20px;
      padding-left: 75px;
    }

    .history_timeline {
      font-weight: bold;
      padding-left: 75px;
      padding-right: 75px;

      .history_parent {
        margin-bottom: 15px;
      }

      .history_parent_with_id {
        cursor: pointer;

        &:hover {
          color: #0168c1;
        }
      }

      .history_parent_no_id {
        cursor: text;
      }

      .history_parent_is_self {
        cursor: text;
        color: #0168c1;
      }

      .history_children {
        padding-top: 5px;
        padding-bottom: 5px;
      }

      .history_children_with_id {
        cursor: pointer;
        font-weight: normal;
        padding-left: 15px;

        &:hover {
          color: #0168c1;
        }
      }

      .history_children_no_id {
        cursor: text;
        padding-left: 15px;
        font-weight: normal;
      }
    }
  }


  //.advertise_img{
  //  width: 20px;
  //  height: 20px;
  //}
  //这一段是翻页的样式，目前暂时不需要
  //.page_w{
  //  display: flex;
  //  align-items: center;
  //  justify-content: center;
  //  color: #565656;
  //  font-size: 16px;
  //  margin-top: 16px;
  //  .iconfont{
  //    font-size: 12px;
  //    font-weight: bold;
  //    &:hover{
  //      color: #175eb3;
  //    }
  //  }
  //  span{
  //    cursor: pointer;
  //  }
  //  .none{
  //    color: #565656;
  //    cursor: default;
  //    .iconfont{
  //      &:hover{
  //        color: #565656;
  //      }
  //    }
  //  }
  //  .middle{
  //    color: #565656;
  //    font-size: 14px;
  //    font-weight: bold;
  //    margin: 0 5px;
  //  }
  //}
}
</style>

<style lang="scss">
.container {
  .main_content {
    //background: #fff;
    //padding: 0 10px;
    .detail_content {
      // width: 1000px;
      //margin: 0 auto;
      //padding-bottom: 60px;
      //font-size: 18px;
      //p{
      //  margin-bottom: 20px;
      //
      //  //color: #222;
      //  img{
      //    max-width: 100%;
      //  }
      //}
      table {
        //width: 90%;
        margin: 18px auto;
        box-sizing: border-box;
        border-collapse: collapse;
        border-spacing: 0;
        border-top: 1px solid rgba(0, 0, 0, 0.3);
        border-left: 1px solid rgba(0, 0, 0, 0.3);

        th {
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(0, 0, 0, 0.3);
          padding: 5px 10px;
        }

        td {
          border-bottom: 1px solid rgba(0, 0, 0, 0.3);
          border-right: 1px solid rgba(0, 0, 0, 0.3);
          padding: 5px 10px;
        }

        tr:nth-child(2n) {
          // background: rgba(0, 0, 0, 0.01);
        }
      }
    }

    //.attachment{
    //  li{
    //    text-indent: 2em;
    //    a{
    //      color: #106abe;
    //      text-decoration: none;
    //      &:hover{
    //        text-decoration: underline;
    //      }
    //    }
    //  }
    //}
  }
}
</style>
