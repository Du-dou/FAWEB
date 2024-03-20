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
        <span>全部消息</span>
        <span>（<i>{{ recordList.totalElements || 0 }}</i>）</span>
      </div>
      <span class="dele" @click="dele">删除</span>
    </div>
    <div>
      <div class="record_list_title">
        <span>标题</span>
        <span>时间</span>
      </div>
      <ul class="record_list" v-if="recordList.content&&recordList.content.length>0">
        <li class="record_item" v-for="item in recordList.content" :key="item.noticeId">
          <div class="record_item_text">
            <img
              class="icon"
              :src="
                item.checked
                  ? CheckboxChecked
                  : CheckboxUnchecked
              "
              @click.stop="choose(item)"
            />
            <span>{{ item.noticeTitle }}</span>
          </div>
          <div class="record_item_time">{{ item.createTime }}</div>
        </li>
      </ul>
      <div class="no_result" v-else>暂无数据</div>
    </div>
    <div class="pagination_wraper" v-if="recordList.content&&recordList.content.length>0">
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
import {mapState, mapMutations} from "vuex";

export default {
  data() {
    return {
      recordList: [],
      chooseList: [],
      allChecked: false,
      page: 1,
      size: 10,
      pagesize: 10,
      CheckboxChecked,
      CheckboxUnchecked
    };
  },
  created() {
    this.getMessage();
  },
  methods: {
    choose(item) {
      if (this.chooseList.indexOf(item.noticeId) > -1) {
        item.checked = false
        this.chooseList.splice(this.chooseList.indexOf(item.noticeId), 1);
      } else {
        this.chooseList.push(item.noticeId);
        item.checked = true
      }
      if (this.chooseList.length == this.recordList.content.length) {
        this.allChecked = true;
      } else {
        this.allChecked = false;
      }
    },
    chooseAll() {
      let that = this;
      if (that.allChecked) {
        that.chooseList = [];
        that.recordList.content.forEach((item, index) => {
          item.checked = false;
        });
        that.allChecked = false
      } else {
        that.chooseList = [];
        that.recordList.content.forEach((item, index) => {
          that.chooseList.push(item.noticeId);
          item.checked = true;
        });
        that.allChecked = true
      }
    },
    dele() {
      let that = this;
      if (this.chooseList.length <= 0) {
        this.$message({
          type: "info",
          message: "请选择要删除的消息",
        });
        return false;
      }
      this.$msgbox
        .confirm("此操作将永久删除该记录, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
        .then(() => {
          API.deleteAllCollectNotice(this.chooseList).then((res) => {
            if (res.code == 0) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getMessage(1);
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
    currentChange(e) {
      this.page = e;
      this.getMessage();
    },
    getMessage(type) {
      let that = this;
      if (type == 1) {
        that.page = 1
      }
      API.getNoticeList({
        page: that.page,
        size: that.size,
      }).then((res) => {
        if (res.code == 0) {
          that.recordList = res.data;
          that.recordList.content.forEach((item, index) => {
            that.$set(item, 'checked', false)
          })
          that.allChecked = false;
          that.chooseList = []
        }
      });
    },
  },
  computed: {
    ...mapState([ "userInfo", "token"]),
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
      cursor: pointer;
    }

    i {
      font-style: normal;
      color: #dd6950;
    }
  }

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
