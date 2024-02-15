<template>
  <div class="password_container">
    <div class="top_menu">
      <span>基本信息</span>
    </div>
    <form class="change_password_wraper">
      <ul>
        <li class="userAvatar">
          <div class="userAvatar_c">
            <div class="avatar_w">
              <label>
              <img :src="$url + avatarImg" />
              <span class="redit_avatar">修改头像</span>
              <input
                type="file"
                style="display: none"
                accept="image/*"
                @change="chooseImage"
              />
              </label>
            </div>

            <span>{{
              userInfo.nikeName ? userInfo.nikeName : "初始用户"
            }}</span>
          </div>
        </li>
        <li>
          <span>昵称：</span>
          <input type="text" v-model="nikeName" />
        </li>
        <li>
          <span>邮箱：</span>
          <input type="text" v-model="email" />
        </li>
        <li>
          <span>性别：</span>
          <div class="sex_wraper">
            <label>
              <input type="radio" value="1" v-model.number="sex" name="sex" />
              <span>男</span>
            </label>
            <label>
              <input type="radio" value="2" v-model.number="sex" name="sex" />
              <span>女</span>
            </label>
          </div>
        </li>
        <li>
          <span>单位：</span>
          <input type="text" v-model="company" />
        </li>
        <li style="align-items: flex-start">
          <span>个人简介：</span>
          <textarea type="text" v-model="briefIntroduction"></textarea>
        </li>
        <li class="tips">
          <span></span>
          <div class="tips_w" v-show="tips_show">
            <img src="@/static/tips.png" />
            <span>{{ tips_text }}</span>
          </div>
        </li>
        <li>
          <span></span>
          <button @click.prevent="saveMess" :disabled="disabled">保存</button>
        </li>
      </ul>
    </form>
    <div>
      <transition name="slideUp">
        <dialog-tip
          v-if="successTip"
          :successTipText="successText"
        ></dialog-tip>
      </transition>
    </div>
    <!--  -->
    <div class="total_wraper" v-show="editAvatarDialog"></div>
    <div class="cropper_wraper" v-show="editAvatarDialog">
      <div class="change_scale">
        <input value="+" type="button" title="放大" @click="changeScale(1)" />
        <input value="-" type="button" title="缩小" @click="changeScale(1)" />
        <input value="↺" type="button" title="左旋转" @click="rotateLeft" />
        <input value="↻" type="button" title="右旋转" @click="rotateRight" />
      </div>
      <div class="cropper_inner">
<!--        <vueCropper-->
<!--          ref="cropper"-->
<!--          :img="option.img"-->
<!--          :outputSize="option.size"-->
<!--          :outputType="option.outputType"-->
<!--          :info="option.info"-->
<!--          :full="option.full"-->
<!--          :canMove="option.canMove"-->
<!--          :canMoveBox="option.canMoveBox"-->
<!--          :original="option.original"-->
<!--          :autoCrop="option.autoCrop"-->
<!--          :autoCropWidth="option.autoCropWidth"-->
<!--          :autoCropHeight="option.autoCropHeight"-->
<!--          :fixedBox="option.fixedBox"-->
<!--          @realTime="realTime"-->
<!--        ></vueCropper>-->
      </div>
      <div class="btns">
        <span @click="finishCut">确定</span>
        <span @click="cancleCut">取消</span>
      </div>
    </div>
    <!-- 上传图片 -->
    <div>
      <transition name="slideUp">
        <div class="upfile_wraper" v-if="upFileFlag">
          <label>
            <div class="camera_wraper">
              <img src="@/static/camera.png" class="camera" />
            </div>
            <input
              type="file"
              style="display: none"
              @change="chooseImage"
              accept="image/*"
            />
          </label>
          <div class="etxt">请点击按钮选择图片</div>
          <div class="etxt2">仅支持JPG、JPEG、GIF、PNG格式图片文件</div>
          <div class="etxt3">文件不能大于2MB</div>
          <div class="confirm_btn">
            <label>
              <span>确定</span>
              <input
                type="file"
                style="display: none"
                accept="image/*"
                @change="chooseImage"
              />
            </label>

            <span @click="cancle">取消</span>
          </div>
        </div>
      </transition>

      <transition name="fade">
        <div class="commonBg" @click="cancle" v-if="upFileFlag"></div>
      </transition>
    </div>
  </div>
</template>
<script>
import API from "@/api/index";
import { mapState, mapMutations } from "vuex";
// import { VueCropper } from "vue-cropper";

export default {
  data() {
    return {
      tips_show: false,
      tips_text: "",
      disabled: false,
      nikeName: "",
      avatarImg: "",
      sex: 1,
      email: "",
      company: "",
      briefIntroduction: "",
      upFileFlag: false,

      editAvatarDialog: false,
      option: {
        img: require("@/static/camera.png"), // 裁剪图片的地址
        info: true, // 裁剪框的大小信息
        outputSize: 1, // 剪切后的图片质量（0.1-1）
        full: true, // 输出原图比例截图 props名full
        outputType: "png", // 裁剪生成额图片的格式
        canMove: true, // 能否拖动图片
        original: false, // 上传图片是否显示原始宽高
        canMoveBox: true, // 能否拖动截图框
        autoCrop: true, // 是否默认生成截图框
        autoCropWidth: 150,
        autoCropHeight: 150,
        fixedBox: true, // 截图框固定大小
      },
    };
  },
  created() {
    this.nikeName = this.userInfo.nikeName
      ? this.userInfo.nikeName
      : "初始用户";
    this.avatarImg = this.userInfo.avatarImg;
    this.sex = this.userInfo.sex;
    this.email = this.userInfo.email;
    this.company = this.userInfo.company;
    this.briefIntroduction = this.userInfo.briefIntroduction;
  },
  computed: {
    ...mapState(["hasLogin", "userInfo", "token"]),
  },
  components: {
    // VueCropper,
  },
  methods: {
    ...mapMutations(["login", "getToken"]),
    chooseImage(e) {
      let imgUrl = this.getObjectURL(e.target.files[0]);
      this.option.img = imgUrl;
      this.editAvatarDialog = true;
    },
    cancleCut(){//取消裁剪
      this.editAvatarDialog = false;
      this.upFileFlag = false
    },
    getObjectURL(file) {
      var url = null;
      if (window.createObjectURL != undefined) {
        //basic
        url = window.createObjectURL(file);
      } else if (window.URL != undefined) {
        //mozilla(firefox)兼容火狐
        url = window.URL.createObjectURL(file);
      } else if (window.webkitURL != undefined) {
        //webkit or chrome
        url = window.webkitURL.createObjectURL(file);
      }
      return url;
    },
    saveMess() {
      let that = this;
      that.disabled = true;
      API.changeUserInfo(
        {
          nikeName: that.nikeName ? that.nikeName : "",
          avatarImg: that.avatarImg ? that.avatarImg : "",
          sex: that.sex ? that.sex : "",
          email: that.email ? that.email : "",
          company: that.company ? that.company : "",
          briefIntroduction: that.briefIntroduction
            ? that.briefIntroduction
            : "",
        }
      )
        .then((res) => {
          if (res.code == 0) {
            that.tips_show = false;

            that.getInfo();
            that.$message({
              type: "success",
              message: "修改成功",
            });
          } else {
            that.$message({
              type: "info",
              message: res.mess,
            });
            that.tips_text = res.mess;
            that.tips_show = true;
          }
          that.disabled = false;
        })
        .catch((err) => {
          that.disabled = false;
        });
    },
    getInfo() {
      let that = this;
      API.getUserInfo().then((res) => {
        if (res.code == 0) {
          that.login(res.data);
        }
      });
    },
    showUpFile() {
      this.upFileFlag = true;
    },
    finishCut() {
      this.finish("blob");
    },
    //放大/缩小
      changeScale(num) {
        console.log('changeScale')
        num = num || 1;
        this.$refs.cropper.changeScale(num);
      },
      //坐旋转
      rotateLeft() {
        console.log('rotateLeft')
        this.$refs.cropper.rotateLeft();
      },
      //右旋转
      rotateRight() {
        console.log('rotateRight')
        this.$refs.cropper.rotateRight();
      },
    finish(type) {
      let that = this;
      this.$refs.cropper.getCropBlob((data) => {
        let file = new window.File([data], "play1.png", { type: "image/png" });
        let formData = new FormData();
        formData.append("upfile", file);
        API.uploadFile(formData)
          .then((res) => {
            if (res.code == 0) {
              that.avatarImg = res.data;
              that.upFileFlag = false;
              that.editAvatarDialog = false;
            } else {
              that.upFileFlag = false;
              that.tips_text = res.mess;
              that.tips_show = true;
              that.editAvatarDialog = false;
            }
          })
          .catch((err) => {
            that.upFileFlag = false;
          });
      });
    },
    cancle() {
      this.upFileFlag = false;
    },
  },
};
</script>
<style scoped lang="scss">
// 图片裁剪
.total_wraper{
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.5);
}
.cropper_wraper {
  background: #fff;
  width: 500px;
  height: 450px;
  position: fixed;
  left: 50%;
  top: 50%;
  border-radius: 3px;
  margin-left: -240px;
  margin-top: -205px;
  z-index: 10000;
  .change_scale{
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 15px;
    input{
      width: 24px;
      height: 24px;
      font-size:20px;
      margin:3px 10px;
      color: #333;
     text-align: center;
     cursor: pointer;
     border-radius: 2px;
     outline: none;
     border: 1px solid #333;
     background: none;
    }
  }
  .cropper_inner {
    width: 100%;
    height: 305px;
    padding: 10px;
    box-sizing: border-box;
  }
  .btns {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;
    margin-top: 30px;
    span {
      width: 47%;
      height: 50px;
      background: #dcdcdc;
      color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      font-size: 16px;
      cursor: pointer;
    }
    span:first-child {
      background: #0068c1;
    }
  }
}
.cropper {
  width: 260px;
  height: 260px;
}
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
    @media screen and (max-width: 1440px) {
      width: 60px;
      height: 20px;
      font-size: 14px;
    }
  }
}
// 更换密码
.change_password_wraper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding-right: 100px;
  ul {
    margin: 65px auto 0;
    @media screen and (max-width: 1440px) {
      margin: 30px auto 0;
    }
    li {
      display: flex;
      align-items: center;
      margin-top: 20px;
      span {
        width: 80px;
        color: #999;
        font-size: 16px;
        text-align: right;
        margin-right: 10px;
        @media screen and (max-width: 1440px) {
          font-size: 14px;
        }
      }
      input {
        box-sizing: border-box;
        padding: 0 20px;
        height: 40px;
        width: 360px;
        border: 1px solid #999;
        outline: none;
        color: #999;
        border-radius: 3px;
        @media screen and (max-width: 1440px) {
          width: 280px;
          height: 40px;
        }
      }
      textarea {
        width: 360px;
        height: 80px;
        padding: 10px 20px;
        box-sizing: border-box;
        outline: none;
        color: #999;
        border: 1px solid #999;
        resize: none;
        border-radius: 3px;
        @media screen and (max-width:1440px) {
          width: 280px;
        }
      }
      .sex_wraper {
        display: flex;
        align-items: center;
        label {
          display: flex;
          align-items: center;
          margin-right: 15px;
          span {
            width: auto;
          }
        }
        input[type="radio"] {
          width: 18px;
          height: 18px;
          margin-right: 8px;
        }
      }

      button {
        height: 40px;
        background: #0068c1;
        font-size: 16px;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 360px;
        border: none;
        outline: none;
        cursor: pointer;
        border-radius: 3px;
        @media screen and (max-width: 1440px) {
          width: 280px;
        }
      }
      img {
        width: 20px;
      }
    }
    li.tips {
      height: 20px;
      margin-top: 8px;
      .tips_w {
        display: flex;
        align-items: center;
        flex: 1;
        span {
          font-size: 12px;
          color: #b8b8b8;
          text-align: left;
          padding: 0 10px;
          flex: 1;
        }
      }
    }
    li:last-child {
      margin-top: 8px;
    }
    li.userAvatar {
      display: flex;
      align-items: center;
      justify-content: center;
      div {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        span {
          margin-right: 0;
          text-align: center;
          font-size: 22px;
          color: #333;
          margin-top: 10px;
          width: 100%;
          @media screen and (max-width: 1440px) {
            font-size: 18px;
          }
        }
        img {
          width: 110px;
          height: 110px;
          border-radius: 5px;
          background-color: #ccc;
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate3d(-50%, -50%, 0);
          @media screen and (max-width: 1440px){
            width: 80px;
            height: 80px;
          }
        }
      }
      .userAvatar_c {
        width: 100%;
      }
      .avatar_w {
        position: relative;
        border-radius: 5px;
        overflow: hidden;
        cursor: pointer;
        width: 110px;
        height: 110px;

        @media screen and (max-width: 1440px) {
          width: 80px;
          height: 80px;
        }
        .redit_avatar {
          position: absolute;
          bottom: 0px;
          left: 0;
          font-size: 12px;
          color: #ffffff;
          background: rgba(0, 0, 0, 0.5);
          line-height: 30px;
          z-index: 2;
        }
      }
    }
  }
}
.slideUp-enter,
.slideUp-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
.slideUp-enter-active,
.slideUp-leave-active {
  transition: all 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s;
}
.commonBg {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  background: rgba(0, 0, 0, 0.5);
}
.upfile_wraper {
  width: 480px;
  height: 410px;
  background: #ffffff;
  border-radius: 3px;
  position: fixed;
  left: 50%;
  top: 50%;
  margin-left: -240px;
  margin-top: -205px;
  z-index: 20;
  @media screen and (max-width: 1440px) {
    height: 380px;
  }
  label {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 38px 0 28px 0;
  }
  .camera_wraper {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #dcdcdc;
    @media screen and (max-width: 1440px) {
      width: 110px;
      height: 110px;
    }
    .camera {
      height: 80px;
      @media screen and (max-width: 1440px) {
        height: 60px;
      }
    }
  }
  .etxt {
    text-align: center;
    font-size: 15px;
    color: #000;
    padding-bottom: 5px;
  }
  .etxt2,
  .etxt3 {
    text-align: center;
    font-size: 14px;
    color: #b6b6b6;
    line-height: 25px;
  }
  .confirm_btn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 60px;
    margin-top: 30px;
    span,
    label {
      width: 47%;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 3px;
      color: #ffffff;
      cursor: pointer;
      padding: 0;
    }
    label {
      span {
        width: 100%;
      }
    }
    span:nth-child(1) {
      background: #0068c1;
    }
    span:nth-child(2) {
      background: #dcdcdc;
    }
  }
}
</style>
