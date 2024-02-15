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
        <img src="@/static/pay_bg.png" />
      </div>
      <div class="pay_list" v-if="payList.length > 0">
        <div class="title">选择购买时长</div>
        <ul class="list_wraper">
          <li
            v-for="(item, index) in payList"
            :key="index"
            :class="{ active: currentSelected == index  }"
            @click="choose(item, index)"
          >
            <div class="top">
              <span>{{ item.price }}</span>
              <span
                >元/{{
                  item.displayUnit == 1
                    ? "年"
                    : item.displayUnit == 2
                    ? "半年"
                    : item.displayUnit == 3
                    ? "季度"
                    : "月"
                }}</span
              >
            </div>
            <div class="line">
              <span></span>
            </div>
            <div class="bottom">
              <span
                >{{
                  item.displayUnit == 1
                    ? "年"
                    : item.displayUnit == 2
                    ? "半年"
                    : item.displayUnit == 3
                    ? "季度"
                    : "月"
                }}(</span
              >
              <span class="choose">{{ item.oneDayPrice }}元/天</span>
              <span>)</span>
            </div>
<!--            <img-->
<!--              src="@/static/recommend.png"-->
<!--              class="recommend"-->
<!--              v-if="item.isRecommended"-->
<!--            />-->
            <img
              src="@/static/choose.png"
              class="choose_img"
              v-if="index == currentSelected"
            />
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
        <span>待支付金额{{ current.price }}元</span>
        <vue-qr :text="qrcode" :margin="10" :size="180"></vue-qr>
        <span>微信支付</span>
      </div>
    </div>
    <!-- aLi支付 -->
    <div v-html="alipayWap" ref="alipayWap"></div>
  </div>
</template>
<script>
// import vueQr from "vue-qr";
import MHeader from "@/common/header/header";
import MFooter from "@/common/footer/footer";
import { mapState } from "vuex";
import { httpGet, httpPost } from "@/api/index";
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
      timer: null,
      id: "",
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  beforeMount() {
    this.id = this.$route.query.id;
    this.getpayList();
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
    getpayList() {
      httpGet("/api/memberPrice/list", this.token, "").then((res) => {
        if (res.code == 0) {

          this.payList = res.data;
          this.payList.forEach((item,index) => {
            if(item.isRecommended){
              this.currentSelected = index
            }
          });
          if (res.data.length > 0) {
            this.current = res.data[0];
          }
        }
      });
    },
    choose(item, index) {
      if (index == this.currentSelected) {
        return false;
      }
      this.currentSelected = index;
      this.current = item;
      this.qrcode = "";
    },
    checkVxResult(outTradeNo) {
      let that = this;
      httpGet(
        `/api/accountFlow/wxPayResult/${outTradeNo}`,
        this.token,
        ""
      ).then((res) => {
        if (res.code == 0) {
          clearInterval(that.timer);
          that.$message({
            type: "success",
            message: "购买会员成功",
          });
          that.$router.go(-1);
        }
      });
    },
    pay(tradeType, operateId) {
      let that = this;
      that.loading = true;
      httpPost(
        "/api/accountFlow",
        {
          tradeType: tradeType,
          operateId: operateId,
          passbackParams: this.id ? this.id : "",
        },
        this.token
      )
        .then((res) => {
          if (res.code == 0) {
            if (tradeType == 10) {
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
            if (tradeType == 11) {
              that.alipayWap = res.data.info;
              that.$nextTick(() => {
                that.$refs.alipayWap.children[0].submit();
                that.loading = false;
              });
            }
          }
          else {
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
      this.pay(10, this.current.priceId);
    },
    aLiPay() {
      this.pay(11, this.current.priceId);
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  margin-top: 70px;
  background-color: #f5f5f5;
  .content_wraper {
    min-height: calc(100vh - 20px);
    background-color: #ffffff;
    margin: 0 auto;
    width: 1400px;
  }
  .img_wraper {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      margin-top: 50px;
      height: 120px;
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
    }
    .pay_type {
      border: 1px dashed #c8c8c8;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 250px;
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
