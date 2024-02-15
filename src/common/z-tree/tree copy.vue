<template>
  <div class="tree-menu">
    <ul
      v-for="(item, index) in data"
      :key="item.id"
      v-show="index >= 12 * pages && index < 12 * (pages + 1)"
    >
      <c-tree-item :data="item"></c-tree-item>
    </ul>
    <div class="result_more" v-if="data.length > 12">
      <span>{{pages + 1}}/{{Math.ceil(data.length/12)}}</span>
      <button @click="prev" :class="{'no_prev':pages==0}">上一页</button>
      <button @click="next" :class="{'no_prev':pages==(Math.floor(data.length/12))}">下一页</button>
    </div>
  </div>
</template>
<script>
import cTreeItem from "./tree-item";
export default {
  data(){
    return {
      pages:0
    }
  },
  props: {
    data: {
      type: [Object, Array],
      required: true,
    },
  },
  components: {
    cTreeItem,
  },
  methods: {
    clickItem(e) {},
    prev(){
      if(this.pages<=0){
        return 
      }
      this.pages--
    },
    next(){
      if(this.pages>=(Math.floor(this.data.length/12))){
        return 
      }
      this.pages++
    },
  },
};
</script>
<style scoped lang="scss">
.result_more {
  color: rgba(102, 102, 102, 1);
  margin-top: 20px;
  padding: 0 0 0 50px;
  span {
    margin-right: 5px;
  }
  button {
    cursor: pointer;
    border: 1px solid rgba(154, 154, 154, 1);
    background: none;
    padding: 2px 6px;
    font-size: 12px;
    &.no_prev{
      cursor: not-allowed;
      color: rgba(102, 102, 102, 1);
    }
  }
}
</style>
