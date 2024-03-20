<template>
  <div
    class="container"
    v-loading.fullscreen="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.1)"
  >
    <div class="header_w">
      <!-- 顶部 -->
      <m-header></m-header>
    </div>
    <div class="content_wraper">
      <div class="img_wraper">
        <img src="@/static/pay_bg.png" @click="goToBuyAll" />
      </div>
      <div class="pay_list">
        <div class="title">单篇购买</div>
        <ul class="list_wraper">
          <li>
            <div class="top">
              <span>{{ price }}</span>
              <span>元/篇</span>
            </div>
            <img src="@/static/choose.png" class="choose_img" />
          </li>
        </ul>
        <div class="title1">扫码支付</div>
        <div class="pay_type">
          <span @click="vxPay">微信支付</span>
          <span @click="aLiPay">支付宝支付</span>
        </div>
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer_wraper">
      <m-footer></m-footer>
    </div>
    <!-- 微信二维码 -->
    <div class="dialog_w" v-if="vxCodeShow" @click="vxCodeShow = false">
      <div class="dialog_img_w">
        <span>待支付金额{{ price }}元</span>
        <vue-qr :text="qrcode" :margin="10" :size="180"></vue-qr>
        <span>微信支付</span>
      </div>
    </div>
    <!-- aLi支付 -->
    <div v-html="alipayWap" ref="alipayWap"></div>
  </div>
</template>
<script>
import MHeader from "@/common/header/header";
import MFooter from "@/common/footer/footer";
import { mapState } from "vuex";
import API from "@/api";
export default {
  data() {
    return {
      payList: [],
      currentSelected: 0,
      qrcode: "",
      vxCodeShow: false,
      current: "",
      loading: false,
      alipayWap: "",
      price: "",
      articleId: "",
      timer: null,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  beforeMount() {
    this.price = this.$route.params.de;
    this.articleId = this.$route.params.id;
    this.getPrice();
  },
  components: {
    MHeader,
    MFooter,
  },
  beforeRouteLeave(to, from, next) {
    clearInterval(this.timer);
    next();
  },
  methods: {
    checkVxResult(outTradeNo) {
      let that = this;
      API.getWxPayResult(outTradeNo).then((res) => {
        if (res.code == 0) {
          clearInterval(that.timer);
          that.$message({
            type: "success",
            message: "购买单篇成功",
          });
          that.$router.go(-1);
        }
      });
    },
    getPrice() {
      API.getArticleDetail(this.articleId).then(
        (res) => {
          if (res.code == 0) {
            this.price = res.data.article.articlePrice;
          }
        }
      );
    },
    pay(tradeType, operateId) {
      let that = this;
      that.loading = true;
      API.accountFlow(
        {
          tradeType: tradeType,
          operateId: operateId,
          passbackParams: that.articleId,
        },
        this.token
      )
        .then((res) => {
          if (res.code == 0) {
            if (tradeType == 1) {
              that.qrcode = res.data.info;
              that.$nextTick(() => {
                that.vxCodeShow = true;
                that.loading = false;
              });
              clearInterval(that.timer);
              that.timer = setInterval(function () {
                that.checkVxResult(res.data.outTradeNo);
              }, 2000);
            }
            if (tradeType == 2) {
              that.alipayWap = res.data.info;
              that.$nextTick(() => {
                that.$refs.alipayWap.children[0].submit();
                that.loading = false;
              });
            }
          } else {
            that.$message({
              type: "info",
              message: res.mess,
            });
            that.loading = false;
          }
        })
        .catch((err) => {
          that.loading = false;
        });
    },
    vxPay() {
      if (this.qrcode) {
        this.vxCodeShow = true;
        return false;
      }
      this.pay(1, this.articleId);
    },
    aLiPay() {
      this.pay(2, this.articleId);
    },
    goToBuyAll() {
      this.$router.push("/pay");
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  padding-top: 100px;
  .content_wraper {
    min-height: calc(100vh - 170px);
  }
  .img_wraper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      height: 120px;
      cursor: pointer;
      @media screen and (max-width:1440px) {
        height: 100px;
      }
    }
  }
  .pay_list {
    width: 1200px;
    margin: 0 auto;
    padding-bottom: 50px;
    @media screen and (max-width:1440px) {
      width: 1000px;
    }
    .title {
      font-size: 18px;
      line-height: 1;
      padding: 40px 0 20px 0;
    }
    .list_wraper {
      display: flex;
      align-content: center;
      justify-content: space-between;
      li {
        width: 280px;
        height: 135px;
        border: 1px solid #dfdfdf;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
        cursor: pointer;
        @media screen and (max-width:1440px) {
          width: 220px;
          height: 120px;
        }
        &.active {
          border: 1px solid #fd5320;
          .choose {
            color: #fd5320;
          }
        }
        .top {
          color: #565656;
          font-size: 16px;
          span:first-child {
            font-size: 30px;
          }
        }
        .bottom {
          color: #c8c8c8;
          font-size: 16px;
          display: flex;
          align-items: center;
        }
        .line {
          padding: 10px 0;
          display: flex;
          align-items: center;
          justify-content: center;
          span {
            width: 173px;
            border-top: 1px solid #dfdfdf;
          }
        }
        .recommend {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 2;
          width: 60px;
        }
        .choose_img {
          position: absolute;
          right: 0;
          bottom: 0;
          z-index: 2;
          width: 30px;
        }
      }
    }
    .title1 {
      font-size: 18px;
      line-height: 1;
      padding: 80px 0 15px 0;
      @media screen and (max-width: 1440px) {
        padding: 60px 0 15px 0;
      }
    }
    .pay_type {
      border: 1px dashed #c8c8c8;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 250px;
      @media screen and (max-width: 1440px) {
        height: 200px;
      }
      span {
        font-size: 16px;
        background: #409eff;
        color: #fff;
        width: 120px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 50px;
        border-radius: 3px;
        cursor: pointer;
      }
    }
  }
  //
  .dialog_w {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    .dialog_img_w {
      color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      img {
        background: rgba(255, 255, 255, 0.5);
        width: 200px;
        height: 200px;
      }
      span {
        padding: 20px 0;
      }
    }
  }
}
</style>
