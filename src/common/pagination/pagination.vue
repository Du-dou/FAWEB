<template>
  <div class="page-container">
    <ul>
      <li class="prev" @click="prev" :class="{'no-allowed':cur == 1}">上一页</li>
      <li
        v-for="index in paginations"
        :class="{ active: cur == index }"
        :key="index"
        @click="current(index)"
      >
        <a>{{ index }}</a>
      </li>
      <li class="next" @click="next" :class="{'no-allowed':cur == all}">下一页 <i class="iconfont icon-arrowright"></i></li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
   
    /**当前页 */
    cur: {
      type: Number,
      default: 1,
    },
    /*每页数量*/
    limit: {
      type: Number,
      default: 10,
    },
    /**总条数 */
    totalPage: {
      type: Number,
      default: 0,
    },
    /**页码连续数量 */
    groups: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    all(){
      return Math.floor((this.totalPage)/(this.limit))
    },
    paginations() {
      var min = 1;
      var max = this.all;
      var arr = [];

      if (this.all > this.groups) {
        if (this.cur <= Math.ceil(this.groups / 2)) {
          min = 1;
          max = this.groups;
        }
        if (
          this.cur > Math.ceil(this.groups / 2) &&
          this.cur <= this.all - Math.floor(this.groups / 2)
        ) {
          min = this.cur - Math.ceil(this.groups / 2) + 1;
          max = this.cur + Math.ceil(this.groups / 2);
        }
        if (this.cur > this.all - Math.floor(this.groups / 2)) {
          min = this.all - this.groups + 1;
          max = this.all;
        }
      }
      while (min <= max) {
        arr.push(min);
        min++;
      }
      return arr;
    },
  },
  methods: {
    prev() {
      if (this.cur <= 1) {
        return false;
      }
      let cur = this.cur;
      cur--
      this.$emit('currentChange',cur)
    },
    next() {
      if (this.cur >= this.all) {
        return false;
      }
     let cur = this.cur;
     cur++
      this.$emit('currentChange',cur)
    },
    current(index) {
      this.$emit('currentChange',index)
    },
  },
};
</script>
<style lang='scss' scoped>
.page-container {
  ul {
    display: flex;
    align-items: center;
    justify-content: center;
    li {
      width: 30px;
      height: 30px;
      background: #f7f8f9;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1171c5;
      border-radius: 3px;
      margin-right: 10px;
      font-size: 14px;
      cursor: pointer;
      &.active {
        color: #fff;
        background: #1171c5;
      }
      &.no-allowed{
        cursor:not-allowed;
        display: none;
      }
    }
    .prev {
      width: 80px;
    }
    .next {
      width: 80px;
      margin: 0;
      .icon-arrowright{
        font-size: 12px;
        font-weight: 600;
        vertical-align: middle;
      }
    }
  }
}
</style>