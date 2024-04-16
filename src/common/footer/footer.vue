<template>
  <div class="footer">
    <ul>
<!--      <li>版权所有：北京易知数聚科技有限公司  |  京ICP备19044373号  |   联系我们:<a href="mailto:awsees@163.com"> lawsees@163.com</a></li>-->
      <li ><a href="https://beian.miit.gov.cn" style="font-size: 14px">京ICP备2023027961号-2</a>  |  <img src="https://www.lawsees.com/file/beian.png">京公网安备11010802043705号</li>
    </ul>
  </div>
</template>
<script>
export default {

}
</script>
<style scoped lang="scss">
.footer{
  height: 70px;
  background: #2d3237;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c0c2c3;
  font-size: 14px;
  @media screen and (max-width: 1440px){
    font-size:12px;
  }
  ul{
    display: flex;
    align-items: center;
    li{
      margin-right: 20px;
      a{
        color: #c0c2c3;
        font-size: 16px;
        text-decoration: none;
      }
    }
    li:last-child{
      margin-right: 0;
    }
  }
}
</style>
