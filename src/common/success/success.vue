<template>
  <div class="sucess_w">
    <div class="title">注册成功</div>
    <div class="success_img">
        <img src="@/static/success.png">
    </div>
    <div class="text1">欢迎注册成为易知用户!</div>
    <!-- <div class="text2">您已经成为易知的用户，可以继续浏览我们的官网信息。</div> -->
  </div>
</template>
<style lang="scss" scoped>
.sucess_w {
  width: 448px;
  height: 350px;
  background: #ffffff;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -224px;
  margin-top: -175px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 3px;
  .title {
    font-size: 30px;
    color: #000;
    font-weight: normal;
    line-height: 1;
    text-align: center;
    padding: 40px 0;
  }
  .success_img{
      display: flex;
      align-items: center;
      justify-content: center;
      img{
          height: 80px;
      }
  }
  .text1{
      font-size: 18px;
      color: #333;
      margin-top: 50px;
      line-height: 1;
  }
  .text2{
      font-size: 14px;
      margin-top: 10px;
       line-height: 1;
  }
}
</style>
