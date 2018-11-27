<template>
  <div class="login">
    <h1 class="logo">
      <img src="../assets/images/login_logo.png" alt="">
    </h1>
    <div class="content">
      <div class="text-box">
        <div class="logo-app">
          <img src="../assets/images/logo_app.png" alt="">
        </div>
        <div class="text">
          <p class="txt">欢迎登录</p>
          <p class="txt">E掌巡后台管理系统</p>
        </div>
      </div>
      <div class="login-box">
        <div class="login-nav" id="login_nav">
          <router-link to="/login/cipher">密码登录</router-link>
          <span></span>
          <router-link to="/login/authcode">验证码登录</router-link>
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {

    }
  },
  created () {
    this.$router.push({ path: '/login/cipher' })
  },
  methods: {

  }
}
</script>

<style lang="less" scoped>
.login{
  width: 100%;
  height: 100%;
  padding-top: 120px;
  padding-bottom: 120px;
  position: relative;
  .logo{
    position: absolute;
    left: 10%;
    top: 28px;
  }
  .content{
    width: 100%;
    height: 100%;
    position: relative;
    background: url("../assets/images/login_bg.jpg") no-repeat center center;
    background-size: cover;
    .text-box{
      position: absolute;
      left: 10%;
      top: 50%;
      width: 460px;
      transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      .logo-app{
        text-align: center;
        padding-bottom: 20px;
      }
      .text{
        .txt{
          line-height: 60px;
          text-align: center;
          font-weight: 600;
          font-size: 32px;
          color: #FFFFFF;
        }
      }
    }
    .login-box{
      position: absolute;
      right: 10%;
      top: 50%;
      width: 460px;
      height: 360px;
      padding: 30px 50px 0;
      background: #ffffff;
      border-radius: 6px;
      transform: translateY(-50%);
      -ms-transform: translateY(-50%);
      -moz-transform: translateY(-50%);
      -webkit-transform: translateY(-50%);
      -o-transform: translateY(-50%);
      .login-nav{
        height: 40px;
        line-height: 40px;
        a{
          vertical-align: middle;
          font-size: 16px;
          &.link-active{
            color: #ff5a00;
          }
        }
        span{
          display: inline-block;
          vertical-align: middle;
          height: 20px;
          width: 1px;
          background: #666;
          margin: 0 20px;
        }
      }
    }
  }
}
</style>
