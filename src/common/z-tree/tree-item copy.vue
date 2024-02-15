<template>
  <li>
    <span >
      <em v-if="hasChild" class="icon" @click.stop="toggle(data)">{{ open ? "－" : "＋" }}</em>
      <em v-else class="icon color_none">＋</em>
      <em @click.stop="setMain(data)">{{ data.dictLabel }}</em>
    </span>
    <ul v-show="open">
      <tree-item
        v-for="(item, index) in data.children"
        :data="item"
        :key="index"
      ></tree-item>
    </ul>
  </li>
</template>
<script>
import { httpGet,getData,limitKeyWords,getDataChangeChild} from '@/api/index'
import $bus from '@/api/bus'
import { mapMutations,mapState } from 'vuex'
export default {
  name: "TreeItem",
  props: {
    data: {
      type: [Object, Array],
      required: true,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    hasChild() {
      return this.data.hasChild;
    },
    ...mapState(['keyWord'])
  },
  methods: {
    ...mapMutations(['setState','setKeyWord','setKeywordsSubmit']),
    toggle(data) {
      if(this.hasChild&&data.children.length<=0){
        this.open = !this.open;
          this.loadTreeNode(data.dictType,data.dictCode)
      }else{
        this.open = !this.open;
      }
    },
    setMain(data){//关键词
      let keys = this.$store.state.keyWord;
      let flag = limitKeyWords(keys,data);
      this.setKeywordsSubmit({
        dictType:data.dictType,
        dictLabel:data.dictLabel,
        dictCode:data.dictCode
      })
      if(!flag){
        keys.push({
          dictType:data.dictType,
          dictLabel:data.dictLabel,
          dictCode:data.dictCode
        })

        this.setKeyWord(keys);
      }
       $bus.$emit('keysordsHandle',keys)
    },
    loadTreeNode(type,dictCode){
       httpGet(`/api/sysDictData/rest/list/${type}`, "", {
        dictCode:dictCode
      }).then((res) => {
        if (res.code == 0) {
          res.data.forEach((item)=>{
            item.children =[];
            // item.hasChild = true;
          })

          let dataCache = {
            dictCode:dictCode,
            children:[]
          }
          for(let k in res.data){
            dataCache.children.push(res.data[k])
          }
          if(type == 'EffecLevel'){
            var arrData = this.$store.state.EffecLevel;
          }
          if(type == 'EffecLevelEnglish'){
            var arrData = this.$store.state.EffecLevelEnglish;
          }
          if(type == 'PulishOffice'){
            var arrData = this.$store.state.PulishOffice;
          }
          if(type == 'PulishDate'){
            var arrData = this.$store.state.PulishDate;
          }
          if(type == 'CauseOfAction'){
            var arrData = this.$store.state.CauseOfAction;
          }
          if(type == 'ReferenceLevel'){
            var arrData = this.$store.state.ReferenceLevel
          }
          if(type == 'TrialCourt'){
            var arrData = this.$store.state.TrialCourt
          }
          if(type == 'TrialProcedure'){
            var arrData = this.$store.state.TrialProcedure
          }
          if(type == 'CourtHierarchy'){
            var arrData = this.$store.state.CourtHierarchy
          }
          if(type == 'YearOfConclusion'){
            var arrData = this.$store.state.YearOfConclusion
          }
          if(type == 'Field'){
            var arrData = this.$store.state.YearOfConclusion
          }
          if(type == 'Category'){
            var arrData = this.$store.state.YearOfConclusion
          }
          if(type == 'YearOfSigning'){
            var arrData = this.$store.state.YearOfConclusion
          }
          if(res.data.length<=0){
            getDataChangeChild(arrData,dictCode);
          }
          if(res.data.length>0){
            getData(arrData,dataCache);
          }
         this.setState({
           data:arrData,
           type:type
         })
        }
      });
    }
  },
};
</script>
<style scoped lang="scss">

li {
  font-size: 14px;
  margin-top: 10px;
  margin-left: 25px;
  li{
    margin-left: 15px;
  }
}

li > span {
  cursor: pointer;
  font-size: 14px;
  line-height: 20px;
  color: #333;
  display: flex;
  align-items: center;
  &:hover{
    color: #0168c1;
  }
  @media screen and (max-width: 1440px){
    font-size:13px
  }
}
li > span:visited {
  background: #fff;
}
em{
  font-style: normal;;
}
em.icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  background-repeat: no-repeat;
  vertical-align: middle;
  font-style: normal;
  font-weight: normal;
  text-align: center;
  font-size: 18px;
  margin-right: 5px;
  position: relative;
  top: -1px;
}
em.color_none{
  opacity: 0;
}
.tree-menu li {
  line-height: 1;
}
</style>
