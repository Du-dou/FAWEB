<template>
  <div class="hot_list">
    <!-- <div class="title">{{title}}</div> -->
    <ul>
      <li v-for="item in hotRecommend" :key="item.adverId">
        <a :href="item.adverLink" target="_blank">
          <img :src="$url + item.adverPath" />
          <span>{{ item.adverTitle }}</span>
        </a>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    hotRecommend: {
      type: Array,
      default: [],
    },
    title:{
      type:String,
      default:"热门推荐"
    }
  },
};
</script>
<style scoped lang="scss">
.hot_list {
  width: 200px;
  // background: #f7f8f9;
  padding-bottom: 30px;
  .title {
    font-size: 16px;
    color: #222;
    text-align: center;
    line-height: 1;
    padding: 18px 0 10px 0;
    margin: 0 14px;
    border-bottom: 1px solid #c5d1d7;
    @media screen and (max-width: 1440px) {
      font-size: 15px;
    }
  }
  ul {
    display: flex;
    flex-direction: column;
    align-items: center;
    li {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-top: 27px;
      // margin-top: 100px;
      a {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-decoration: none;
        img {
          width: 175px;
          height: 100px;
          background-color: #ccc;
        }
        span {
          font-size: 14px;
          color: #222;
          margin-top: 10px;
          line-height: 22px;
          max-width: 174px;
          @media screen and (max-width: 1440px) {
            font-size: 13px;
          }
        }
      }
    }
    li:first-child {
      margin-top: 15px;
    }
  }
}
</style>
