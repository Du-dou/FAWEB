<template>
  <div class="myauth_container">
    <div class="top_menu">
      <span>我的权限</span>
      <!-- <span class="buy" @click="buyAll">购买</span> -->
    </div>
    <div>
      <div class="user_auth">
        <div class="user_auth_title">
          <span>权限类型</span>
          <span>上次购买时间</span>
          <span>会员到期时间</span>
        </div>
        <div class="user_content" v-show="ishow">
          <div class="user_content_left">
            <!-- <img src="@/static/diamond.png" /> -->
            <!-- <span>{{memberInfo.buyName==0?'试用期':memberInfo.buyName==1?'付费用户/年':memberInfo.buyName==2?'付费用户/半年':memberInfo.buyName==3?'付费用户/季':memberInfo.buyName==4?'付费用户/月':'普通用户'}}</span> -->
            <span>{{ memberInfo.buyName == 0 ? '试用期' : memberInfo.buyName == 1 || memberInfo.buyName == 2 || memberInfo.buyName == 3 ? 'VIP用户' : memberInfo.buyName == 4 ? 'VIP用户' : '普通用户' }}</span>
<!--            <router-link to="/pay" tag="a" target='self' style="text-decoration:none">-->
              <div class="btn" @click="toPay">{{ memberInfo.buyName ? '立即续费' : '立即购买' }}</div>
<!--            </router-link>-->
          </div>
          <div class="user_content_right">
            <div class="yes_auth_wraper">
              <div class="ckeck_fan">{{ memberInfo.buyDate ? memberInfo.buyDate : '--:--:--' }}</div>
            </div>
          </div>
          <div class="user_content_right" style="border:none">
            <div class="yes_auth_wraper">
              <div class="ckeck_fan">{{ memberInfo.lastTime ? memberInfo.lastTime : '--:--:--' }}</div>
            </div>
          </div>
        </div>
      </div>
<!--      &lt;!&ndash; <div class="buy_list_title">购买单篇记录</div>-->
<!--      <div class="record_list_title">-->
<!--        <span>文章标题</span>-->
<!--        <span>有效时间</span>-->
<!--      </div>-->
<!--      <ul-->
<!--        class="record_list"-->
<!--        v-if="recordList.content && recordList.content.length > 0"-->
<!--      >-->
<!--        <li-->
<!--          class="record_item"-->
<!--          v-for="item in recordList.content"-->
<!--          :key="item.id"-->
<!--          @click="goToDetail(item)"-->
<!--        >-->
<!--          <div class="record_item_text">-->
<!--            <span class="icon"></span>-->
<!--            <span>{{ item.articleTitle }}</span>-->
<!--          </div>-->
<!--          <div class="record_item_time">{{ item.createTime }}</div>-->
<!--        </li>-->
<!--      </ul>-->
<!--      <div class="no_result" v-else>暂无数据</div> &ndash;&gt;-->
<!--      <div-->
<!--        class="pagination_wraper"-->
<!--        v-if="recordList.content && recordList.content.length > 0"-->
<!--      >-->
<!--        <el-pagination-->
<!--          background-->
<!--          layout="prev, pager, next"-->
<!--          :page-size="pagesize"-->
<!--          :current-page="page"-->
<!--          @current-change="currentChange"-->
<!--          :total="recordList.totalElements"-->
<!--        >-->
<!--        </el-pagination>-->
<!--      </div>-->
    </div>
  </div>
</template>
<script>
import {httpGet} from "@/api/index";
import {mapState} from "vuex";

export default {
  name:"MyAuth",
  data() {
    return {
      page: 1,
      size: 10,
      pagesize: 10,
      recordList: [],
      memberInfo: "",
      ishow: false,
    };
  },
  computed: {
    ...mapState(["token"]),
  },
  beforeMount() {
    this.getMemberInfo();
    this.getBuyList();
  },
  methods: {
    toPay(){
      this.$router.push('/pay')
    },
    currentChange(e) {
      this.page = e;
      this.getBuyList();
    },
    getMemberInfo() {
      httpGet("/api/member", this.token, "").then((res) => {
        if (res.code == 0) {
          this.memberInfo = res.data;
          this.ishow = true;
        }
        this.ishow = true;
      });
    },
    //获取购买列表
    getBuyList() {
      let that = this;
      httpGet("/api/userArticle/pageList", this.token, {
        page: that.page,
        size: that.size,
      }).then((res) => {
        if (res.code == 0) {
          this.recordList = res.data;
        }
        console.log(res);
      });
    },
    buyAll() {
      this.$router.push("/pay");
    },
    goToDetail(item) {
      this.$router.push(`/detail/${item.articleId}`);
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
    // box-sizing: border-box;
    @media screen and (max-width: 1440px) {
      width: 60px;
      height: 24px;
      font-size: 13px;
      border-radius: 3px;
    }
  }
}

//   我的权限
.user_auth {
  border: 1px solid #e8e8e8;
  margin-top: 20px;

  .user_auth_title {
    height: 40px;
    background: #f3f6fb;
    display: flex;
    align-items: center;

    span {
      font-size: 14px;
      color: #9c9d9f;
      box-sizing: border-box;
      height: 40px;
      line-height: 40px;
    }

    span:nth-child(1) {
      width: 30%;
      padding-left: 35px;
      border-right: 1px solid #e8e8e8;
      @media screen and (max-width: 1440px) {
        padding-left: 20px;
      }
    }

    span:nth-child(2),
    span:nth-child(3) {
      width: 35%;
      padding-left: 50px;
      @media screen and (max-width: 1440px) {
        padding-left: 35px;
      }
    }

    span:nth-child(2) {
      border-right: 1px solid #e8e8e8;
    }
  }

  .user_content {
    display: flex;

    div.user_content_left {
      width: 30%;
      padding-left: 35px;
      border-right: 1px solid #e8e8e8;
      height: 80px;
      box-sizing: border-box;
      display: flex;
      align-items: center;
      @media screen and (max-width: 1440px) {
        height: 50px;
        padding-left: 20px;
      }

      img {
        width: 30px;
      }

      span {
        // margin-left: 10px;
        font-size: 20px;
        color: #333;
        @media screen and (max-width: 1440px) {
          font-size: 20px;
        }
      }

      .btn {
        width: 140px;
        height: 40px;
        line-height: 40px;
        color: #ffffff;
        text-align: center;
        background: #0068c1;
        border-radius: 2px;
        margin-left: 30px;
        cursor: pointer;
        @media screen and (max-width: 1440px) {
          width: 105px;
          height: 30px;
          line-height: 30px;
        }
      }
    }

    div.user_content_right {
      width: 35%;
      height: 80px;
      box-sizing: border-box;
      display: flex;
      border-right: 1px solid #e8e8e8;
      @media screen and (max-width: 1440px) {
        height: 50px;
      }

      .no_auth_wraper {
        display: flex;
        align-items: center;
        height: 100%;
        font-size: 16px;
        color: #666;
        @media screen and (max-width: 1440px) {
          font-size: 14px;
        }

        span:nth-child(2) {
          width: 140px;
          height: 40px;
          line-height: 40px;
          color: #ffffff;
          text-align: center;
          background: #0068c1;
          border-radius: 2px;
          margin-left: 30px;
          cursor: pointer;
          @media screen and (max-width: 1440px) {
            width: 105px;
            height: 30px;
            line-height: 30px;
          }
        }
      }

      .yes_auth_wraper {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        font-size: 14px;
        color: #adadad;
        line-height: 1.5;
        padding-left: 50px;
        @media screen and (max-width: 1440px) {
          font-size: 12px;
          padding-left: 35px;
        }

        .ckeck_fan {
          color: #333;
          @media screen and (max-width: 1440px) {
            font-size: 12px;
          }
        }
      }
    }

  }
}

.buy_list_title {
  font-size: 15px;
  color: #333;
  line-height: 1;
  padding: 36px 0 26px 30px;
  border-bottom: 1px solid #e8e8e8;
  @media screen and (max-width: 1440px) {
    padding: 20px 0 15px 20px;
    font-size: 14px;
  }
}

.record_list_title {
  height: 40px;
  background: #f3f6fb;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #9c9d9f;
  margin-top: 30px;
  padding: 0 35px;
  @media screen and (max-width: 1440px) {
    font-size: 14px;
    padding: 0 20px;
    margin-top: 20px;
  }

  span:nth-child(2) {
    width: 140px;
  }
}

.record_list {
  padding-bottom: 100px;

  .record_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 50px;
    font-size: 14px;
    padding: 0 35px;
    color: #646464;
    border-bottom: 1px dashed #dedede;
    cursor: pointer;
    @media screen and (max-width: 1440px) {
      padding: 0 20px;
      height: 45px;
      font-size: 13px;
    }

    .record_item_text {
      display: flex;
      align-items: center;

      .icon {
        width: 7px;
        height: 7px;
        background: #007dc5;
        margin-right: 15px;
      }
    }
  }

  .record_item_time {
    width: 140px;
  }

  .record_item:last-child {
    border: none;
  }
}

.no_result {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.4);
}

.pagination_wraper {
  position: absolute;
  left: 50%;
  bottom: 50px;
  z-index: 2;
  transform: translateX(-50%);
}
</style>
