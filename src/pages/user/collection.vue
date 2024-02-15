<template>
  <div class="myauth_container">
    <div class="top_menu">
      <div class="checkbox_wraper">
        <img
          :src="
            allChecked
              ? CheckboxChecked
              : CheckboxUnchecked
          "
          @click="chooseAll"
        />
        <span>我的收藏</span>
        <span
        >（<i>{{ recordList.totalElements || 0 }}</i
        >）</span
        >
      </div>
      <div class="dele_wraper">
        <span class="dele" @click="deleteAllCollect">删除</span>
        <!-- <div class="types" @mouseenter="showTypes" @mouseleave="hideTypes">
          <span>{{ text }}</span>
          <span class="pull"></span>
          <ul v-show="tyesShow">
            <li v-for="item in type" :key="item.id" @click="changeTypes(item)">
              {{ item.text }}
            </li>
          </ul>
        </div> -->
      </div>
    </div>
    <div>
      <div class="record_list_title">
        <span>收藏记录</span>
        <span>时间</span>
      </div>

      <ul
        class="record_list"
        v-if="recordList.content && recordList.content.length > 0"
      >
        <li
          class="record_item"
          v-for="item in recordList.content"
          :key="item.collectId"
          @click="checkDetail(item)"
        >
          <div class="record_item_text">
            <img
              class="icon"
              :src="
                item.checked
                  ? CheckboxChecked
                  : CheckboxUnchecked
              "
              @click.stop="chooseItem(item)"
            />
            <span>{{ item.articleTitle }}</span>
          </div>
          <div class="record_item_time">{{ item.createTime }}</div>
        </li>
      </ul>
      <div class="no_result" v-else>暂无数据</div>
    </div>
    <div
      class="pagination_wraper"
      v-if="recordList.content && recordList.content.length > 0"
    >
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="pagesize"
        :current-page="page"
        @current-change="currentChange"
        :total="recordList.totalElements"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import CheckboxChecked from "@/static/CheckboxChecked.png";
import CheckboxUnchecked from "@/static/CheckboxUnchecked.png";
import API from "@/api/index";
import {httpGet} from "@/api/index";
import {mapState} from "vuex";
import types from "@/api/common";

types.unshift({text: '全部分类', type: -1})
export default {
  data() {
    return {
      text: "全部分类",
      tyesShow: false,
      type: types,
      recordList: [],
      allChecked: false,
      articleType: "",
      page: 1,
      size: 10,
      pagesize: 10,
      collectIds: [],
      href: '',
      CheckboxChecked,
      CheckboxUnchecked
    };
  },
  beforeMount() {
    this.href = localStorage.getItem('href')
    this.getList();
  },
  computed: {
    ...mapState(["hasLogin", "userInfo", "token"]),
  },
  methods: {
    showTypes() {
      this.tyesShow = true;
    },
    hideTypes() {
      this.tyesShow = false;
    },
    changeTypes(item) {
      this.text = item.text;
      this.tyesShow = false;
      this.articleType = item.type < 0 ? '' : item.type * 1 + 1;
      this.getList(1);
    },
    getList(type) {
      //获取收藏列表
      let that = this;
      if (type == 1) {
        that.page = 1;
      }
      httpGet("/api/userCollection/pageList", that.token, {
        page: that.page,
        size: that.size,
        articleType: that.articleType,
      }).then((res) => {
        if (res.code == 0) {
          that.recordList = res.data;
          that.recordList.content.forEach((item, index) => {
            that.$set(item, "checked", false);
          });
          that.allChecked = false;
          that.collectIds = [];
        }
      });
    },
    deleteAllCollect() {
      //删除文章
      if (this.collectIds.length <= 0) {
        this.$message({
          type: "info",
          message: "请选择要删除的文章",
        });
        return false;
      }
      this.$msgbox
        .confirm("此操作将删除该收藏记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          API.deleteAllCollect(this.collectIds).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList(1);
            } else {
              this.$message({
                type: "info",
                message: res.mess,
              });
            }
          });
        })
        .catch(() => {
        });
    },
    checkDetail(item) {
      let id = item.articleId;
      console.log(this.href);
      console.log(`${this.href}detail/${id}`);
      // return false
      //进入文章详情
      window.open(`${this.href}detail/${id}`)

    },
    chooseAll() {
      let that = this;
      if (that.allChecked) {
        that.collectIds = [];
        that.recordList.content.forEach((item, index) => {
          item.checked = false;
        });
        that.allChecked = false;
      } else {
        that.collectIds = [];
        that.recordList.content.forEach((item, index) => {
          that.collectIds.push(item.collectId);
          item.checked = true;
        });
        that.allChecked = true;
      }
    },
    chooseItem(item) {
      //选中
      if (this.collectIds.indexOf(item.collectId) > -1) {
        item.checked = false;
        this.collectIds.splice(this.collectIds.indexOf(item.collectId), 1);
      } else {
        this.collectIds.push(item.collectId);
        item.checked = true;
      }
      if (this.recordList.content.length == this.collectIds.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    currentChange(e) {
      this.page = e;
      this.getList();
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

  .checkbox_wraper {
    display: flex;
    align-items: center;

    img {
      height: 18px;
      display: block;
      margin-right: 5px;
    }

    i {
      font-style: normal;
      color: #dd6950;
    }
  }

  .dele_wraper {
    display: flex;
    align-items: center;

    .dele {
      width: 80px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0068c1;
      font-size: 16px;
      background: #ffffff;
      border: 1px solid #0068c1;
      cursor: pointer;
      border-radius: 3px;
      @media screen and (max-width: 1440px) {
        width: 60px;
        height: 24px;
        font-size: 13px;
      }
    }

    .types {
      width: 180px;
      height: 28px;
      border: 1px solid #0068c1;
      cursor: pointer;
      border-radius: 3px;
      color: #0068c1;
      margin-left: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      position: relative;
      @media screen and (max-width: 1440px) {
        width: 135px;
        height: 24px;
        font-size: 13px;
      }

      .pull {
        border-left: 5px solid transparent;
        border-right: 5px solid transparent;
        border-bottom: 5px solid transparent;
        border-top: 5px solid #0068c1;
        margin-top: 3px;
        margin-left: 6px;
      }

      ul {
        position: absolute;
        left: 50%;
        top: 28px;
        background: #fff;
        border: 1px solid #0068c1;
        // padding: 10px 0;
        width: 180px;
        transform: translateX(-50%);
        border-radius: 3px;
        @media screen and (max-width: 1440px) {
          top: 24px;
          width: 135px;
        }

        li {
          height: 28px;
          line-height: 28px;
          text-align: center;
          padding: 0 10px;
          cursor: pointer;
          @media screen and (max-width: 1440px) {
            height: 24px;
            line-height: 24px;
          }
        }

        li:hover {
          background: #0068c1;
          color: #fff;
        }
      }
    }
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
  padding-bottom: 80px;

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
        width: 16px;
        height: 16px;
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
