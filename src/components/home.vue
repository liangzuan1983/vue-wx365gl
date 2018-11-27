<template>
  <div class="home">
    <el-container style="height: 100%">
      <el-header height="120px" style="padding-left: 0; padding-right: 0;">
        <div class="nav-top">
          <div class="left nav-title">
            <img src="../assets/images/logo.png" height="42" alt="">
            <h2 class="title">e掌巡-智能移动管理系统平台</h2>
          </div>
          <div class="right nav-content">
            <div class="nav-item bd-right">
              <p class="nav-date">{{ nowTime }}</p>
            </div>
            <div class="nav-item bd-right">
              <router-link to="/home/message">
                <el-badge :value="mesCount" :max="99" class="message">
                  <i class="iconfont icon-xiaoxi"></i>
                </el-badge>
              </router-link>
            </div>
            <div class="nav-item bd-right">
              <div class="user">
                <div class="user-item">
                  <p>{{ companyName }}</p>
                  <p>{{ userName }}</p>
                </div>
                <el-dropdown class="user-item user-img">
                  <div class="el-dropdown-link img">
                    <img :src="iconUrl" alt="" />
                  </div>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item><a href="javascript:void(0);" @click="clickDatum">个人资料</a></el-dropdown-item>
                    <el-dropdown-item><a href="javascript:void(0);" @click="comPwdClick">修改密码</a></el-dropdown-item>
                    <el-dropdown-item><a href="javascript:void(0);" @click="quitLogin">退出登录</a></el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>
        <div class="nav-bottom">
          <el-radio-group v-model="mainNavActive" @change="mainNavChange">
            <el-radio-button :label="1">系统管理</el-radio-button>
            <el-radio-button :label="2">企业管理</el-radio-button>
            <el-radio-button :label="3">运营管理</el-radio-button>
            <el-radio-button :label="4">问题追踪</el-radio-button>
          </el-radio-group>
        </div>
      </el-header>
      <el-container style="margin-top: 1px;">
        <el-aside width="240px" style="padding-bottom: 20px; overflow-x: hidden;">
          <div v-show="mainNavActive === 1">
            <div class="roter-item bd-bottom"><router-link to="/home/firm">组织结构管理</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/role">角色管理</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/user">用户管理</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/log">日志管理</router-link></div>
            <el-collapse accordion>
              <el-collapse-item name="1-1" class="bd-bottom">
                <template slot="title">基本信息维护</template>
                <div class="roter-item"><router-link to="/home/skill" class="roter-item-inner">技能树维护</router-link></div>
                <div class="roter-item"><router-link to="/home/norm" class="roter-item-inner">巡检标准维护</router-link></div>
                <div class="roter-item"><router-link to="/home/knowledge" class="roter-item-inner">知识库维护</router-link></div>
              </el-collapse-item>
            </el-collapse>
            <div class="roter-item bd-bottom"><router-link to="/home/chunk">模块维护</router-link></div>
          </div>
          <div v-show="mainNavActive === 2">
            <div class="roter-item bd-bottom"><router-link to="/home/clibasic">企业信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clipro">项目分布</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clicrew">人员信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clifac">设备信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clipol">巡检信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/cliwork">工单信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clisal">考勤信息</router-link></div>
            <div class="roter-item bd-bottom"><router-link to="/home/clitce">能耗信息</router-link></div>
          </div>
        </el-aside>
        <el-main style="padding-top: 0;">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import initIcon from '../assets/images/head.png'
export default{
  data () {
    return {
      companyName: sessionStorage.getItem('wxAdmFirmName'),
      userName: sessionStorage.getItem('wxAdmUserName'),
      iconUrl: '',
      nowTime: '',
      time: null,
      mesCount: '',
      mainNavActive: 1
    }
  },
  created () {
    this.$router.push({ path: '/home/firm' })
    // 头像
    let iconUrl = sessionStorage.getItem('wxAdmUserPhoto')
    if (iconUrl) {
      iconUrl = this.sysetApi() + '/showImage?state=0&filename=' + iconUrl
    } else {
      iconUrl = initIcon
    }
    this.iconUrl = iconUrl
    // 时间
    this.getNowDate()
  },
  methods: {
    /* 时间显示 */
    getNowDate () {
      this.time = setInterval(() => {
        const nowTime = this.$common.getNowData('yyyy-mm-dd hh:mm:ss e')
        this.nowTime = nowTime
      }, 1000)
    },
    /* 切换主导航 */
    mainNavChange (index) {
      switch (index) {
        case 1:
          this.$router.push({ path: '/home/firm' })
          break
        case 2:
          this.$router.push({ path: '/home/clibasic' })
          break
      }
    },
    /* 个人资料 */
    clickDatum () {

    },
    /* 修改密码 */
    comPwdClick () {

    },
    /* 退出登录 */
    quitLogin () {
      clearInterval(this.timer)
      this.$router.push({ path: '/login/cipher' })
    }
  }
}
</script>

<style lang="less" scoped>
.home{
  height: 100%;
  .el-header{
    .nav-top{
      height: 60px;
      padding: 0 20px;
      background: #19345A;
      color: #fff;
      .nav-title{
        font-size: 0;
        img{
          vertical-align: middle;
        }
        .title{
          display: inline-block;
          vertical-align: middle;
          line-height: 60px;
          font-size: 24px;
        }
      }
      .nav-content{
        font-size: 0;
        .bd-right{
          border-right: 1px solid #ffffff;
        }
        .nav-item{
          vertical-align: middle;
          display: inline-block;
          padding: 0 20px;
          height: 60px;
          line-height: 60px;
          .nav-date{
            font-size: 12px;
          }
          .message{
            vertical-align: middle;
            text-align: center;
            line-height: 40px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: #4e89c5;
            cursor: pointer;
            .iconfont{
              color: #ffffff;
              font-size: 24px;
            }
          }
          .user{
            .user-item{
              display: inline-block;
              vertical-align: middle;
              p{
                line-height: 24PX;
                text-align: right;
                font-size: 14px;
                color: #ffffff;
              }
              &.user-img{
                .img{
                  width: 42px;
                  height: 42px;
                  margin-left: 5px;
                  line-height: 48px;
                  border-radius: 50%;
                  overflow: hidden;
                  background: #ffffff;
                  img{
                    width: 42px;
                    height: 42px;
                  }
                }
              }
            }
          }
        }
      }
    }
    .nav-bottom{
      height: 60px;
      padding-top: 10px;
      padding-left: 40px;
      background: #ffffff;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.3);
    }
  }
  .el-aside{
    background-color: #f1f1f1;
    border-right: 1px solid #d1d1d1;
    color: #333;
    .iconfont {
      margin-right: 5px;
    }
    .roter-item{
      height: 50px;
      a{
        display: block;
        height: 100%;
        padding-left: 40px;
        line-height: 50px;
        background: #f1f1f1;
        color: #142c4b;
      }
      .roter-item-inner{
        background: #4e89c5;
        color: #142c4b;
      }
      .link-active{
        color: #ffffff;
        background: #4e89c5;
      }
    }
    .bd-bottom{
      position: relative;
    }
    .bd-bottom::after{
      content: "";
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 1px;
      background: #d1d1d1;
    }
  }
}
</style>
