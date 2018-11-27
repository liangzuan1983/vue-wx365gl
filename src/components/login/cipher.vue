<template>
  <div class="cipher">
    <div class="input-item">
      <el-input
        type="text"
        size="large"
        placeholder="账号"
        prefix-icon="iconfont icon-yonghu"
        v-model="phone">
      </el-input>
    </div>
    <div class="input-item">
      <el-input
        size="large"
        type="password"
        placeholder="密码"
        prefix-icon="iconfont icon-mima"
        @keyup.enter.native= "enterEvent"
        v-model="password">
      </el-input>
    </div>
    <el-checkbox v-model="checked" style="margin-bottom: 20px;">记住密码</el-checkbox>
    <div class="login-btn">
      <el-button type="primary" @click="verifyLogin">登  录</el-button>
    </div>
    <div class="loginHelp">
      <a href="javascript:void(0);" class="blue" @click="skipFindpwd">忘记密码</a>
    </div>
  </div>
</template>

<script>
export default{
  name: 'cipher',
  data () {
    return {
      phone: '',
      password: '',
      checked: false
    }
  },
  created () {
    // 获取账号
    const phone = localStorage.getItem('wxAdmLoginPhone') || ''
    this.phone = phone
    // 获取密码
    const password = localStorage.getItem('wxAdmLoginPwd') || ''
    this.password = password
    // 获取记住密码状态
    const state = localStorage.getItem('wxAdmSavePwdState')
    if (state === '1') {
      this.checked = true
    } else {
      this.checked = false
    }
  },
  methods: {
    // 登录验证
    verifyLogin () {
      // 验证手机
      let phone = this.phone
      if (!phone) {
        this.$message({
          showClose: true,
          message: '请输入账号!',
          type: 'warning'
        })
        return
      }
      // 验证密码
      let password = this.password
      if (!password) {
        this.$message({
          showClose: true,
          message: '请输入密码!',
          type: 'warning'
        })
        return
      }
      this.loginSkip()
    },
    // 回车
    enterEvent () {
      // 验证手机
      let phone = this.phone
      if (!phone) {
        return
      }
      // 验证密码
      let password = this.password
      if (!password) {
        return
      }
      this.loginSkip()
    },
    // 登录跳转
    loginSkip () {
      let params = { type: 0, user_phone: this.phone, user_pwd: this.password }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/login',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          // 保存账号
          let phone = this.phone
          localStorage.setItem('wxAdmLoginPhone', phone)
          // 保存密码
          if (this.checked) {
            localStorage.setItem('wxAdmSavePwdState', '1')
            let password = this.password
            localStorage.setItem('wxAdmLoginPwd', password)
          } else {
            localStorage.setItem('wxAdmSavePwdState', '0')
            localStorage.setItem('wxAdmLoginPwd', '')
          }
          // 存储本次登录需要用到的数据
          // 存储Token
          let token = res.data.data1.user.token
          sessionStorage.setItem('wxAdmToken', token)
          // 存储公司ID
          let companyId = res.data.data1.user.company_id
          sessionStorage.setItem('wxAdmFirmId', companyId)
          // 存储公司名称
          let companyName = res.data.data1.user.company_name
          sessionStorage.setItem('wxAdmFirmName', companyName)
          // 存储用户ID
          let userId = res.data.data1.user.user_id
          sessionStorage.setItem('wxAdmUserId', userId)
          // 存储用户名称
          let userName = res.data.data1.user.user_name
          sessionStorage.setItem('wxAdmUserName', userName)
          // 存储用户角色id
          let roleId = res.data.data1.user.role_id
          sessionStorage.setItem('wxAdmRoleId', roleId)
          // 存储用户号码
          let userPhone = res.data.data1.user.user_phone
          sessionStorage.setItem('wxAdmUserPhone', userPhone)
          // 存储用户头像
          let userPhoto = res.data.data1.user.head_picture || ''
          sessionStorage.setItem('wxAdmUserPhoto', userPhoto)
          /* 存储权限 */
          // const userAuts = res.data.data1.permissions
          // let authority = {
          //   firm: false,
          //   project: false,
          //   log: false,
          //   user: false,
          //   site: false,
          //   plan: false,
          //   task: false,
          //   calendar: false,
          //   norm: false,
          //   abnormal: false,
          //   work: false,
          //   rule: false,
          //   crew: false,
          //   shift: false,
          //   scheduling: false,
          //   approval: false,
          //   polcard: false,
          //   polReport: false,
          //   workReport: false,
          //   videoSetting: false,
          //   videoPlaza: false,
          //   event: false
          // }
          // // 组织结构管理
          // let autFirm = []
          // // 项目管理
          // let autProject = []
          // // 用户管理
          // let autUser = []
          // // 地址管理
          // let autSite = []
          // // 巡检计划管理
          // let autPlan = []
          // // 巡检任务
          // let autTask = []
          // // 巡检日历
          // let autCalendar = []
          // // 巡检标准维护
          // let autNorm = []
          // // 巡检异常
          // let autAbnormal = []
          // // 工单列表
          // let autWork = []
          // // 异常处理规则设置
          // let autRule = []
          // // 人员配置
          // let autCrew = []
          // // 编制排班
          // let autShift = []
          // // 排班管理
          // let autScheduling = []
          // // 审批列表
          // let autApproval = []
          // // 巡检绑卡管理
          // let autPolcard = []
          // // 事件列表
          // let autEvent = []
          // userAuts.forEach(item => {
          //   if (item.function_id === 3 || item.function_id === 4 || item.function_id === 5) { // 组织结构管理
          //     authority.firm = true
          //     autFirm.push(item.function_id)
          //   } else if (item.function_id === 7 || item.function_id === 8 || item.function_id === 9) { // 项目管理
          //     authority.project = true
          //     autProject.push(item.function_id)
          //   } else if (item.function_id === 18) { // 日志管理
          //     authority.log = true
          //   } else if (item.function_id === 15 || item.function_id === 16 || item.function_id === 17) { // 用户管理
          //     authority.user = true
          //     autUser.push(item.function_id)
          //   } else if (item.function_id === 26 || item.function_id === 27 || item.function_id === 28) { // 地址管理
          //     authority.site = true
          //     autSite.push(item.function_id)
          //   } else if (item.function_id === 30 || item.function_id === 31 || item.function_id === 34) { // 巡检计划管理
          //     authority.plan = true
          //     autPlan.push(item.function_id)
          //   } else if (item.function_id === 36 || item.function_id === 37 || item.function_id === 38 || item.function_id === 39) { // 巡检任务
          //     authority.task = true
          //     autTask.push(item.function_id)
          //   } else if (item.function_id === 40) { // 巡检日历
          //     authority.calendar = true
          //     autCalendar.push(item.function_id)
          //   } else if (item.function_id === 42 || item.function_id === 44 || item.function_id === 45) { // 巡检标准维护
          //     authority.norm = true
          //     autNorm.push(item.function_id)
          //   } else if (item.function_id === 47 || item.function_id === 181) { // 巡检异常
          //     authority.abnormal = true
          //     autAbnormal.push(item.function_id)
          //   } else if (item.function_id === 50 || item.function_id === 51 || item.function_id === 52 || item.function_id === 53 || item.function_id === 54) { // 工单列表
          //     authority.work = true
          //     autWork.push(item.function_id)
          //   } else if (item.function_id === 182 || item.function_id === 183 || item.function_id === 184) { // 异常处理规则设置
          //     authority.rule = true
          //     autRule.push(item.function_id)
          //   } else if (item.function_id === 185 || item.function_id === 186) { // 人员配置
          //     authority.crew = true
          //     autCrew.push(item.function_id)
          //   } else if (item.function_id === 187 || item.function_id === 188 || item.function_id === 189) { // 编制排班
          //     authority.shift = true
          //     autShift.push(item.function_id)
          //   } else if (item.function_id === 190 || item.function_id === 191) { // 排班管理
          //     authority.scheduling = true
          //     autScheduling.push(item.function_id)
          //   } else if (item.function_id === 62) { // 审批列表
          //     authority.approval = true
          //     autApproval.push(item.function_id)
          //   } else if (item.function_id === 21 || item.function_id === 22) { // 巡检绑卡管理
          //     authority.polcard = true
          //     autPolcard.push(item.function_id)
          //   } else if (item.function_id === 192) { // 巡检报表
          //     authority.polReport = true
          //   } else if (item.function_id === 193) { // 工单报表
          //     authority.workReport = true
          //   } else if (item.function_id === 206) { // 视频监控设置
          //     authority.videoSetting = true
          //   } else if (item.function_id === 207) { // 视频广场
          //     authority.videoPlaza = true
          //   } else if (item.function_id === 78 || item.function_id === 79 || item.function_id === 80 || item.function_id === 81 || item.function_id === 82) { // 事件列表
          //     authority.event = true
          //     autEvent.push(item.function_id)
          //   }
          // })
          // // 存储权限
          // authority = JSON.stringify(authority)
          // sessionStorage.setItem('userAuthority', authority)
          // // 组织结构管理
          // autFirm = JSON.stringify(autFirm)
          // sessionStorage.setItem('autFirm', autFirm)
          // // 项目管理
          // autProject = JSON.stringify(autProject)
          // sessionStorage.setItem('autProject', autProject)
          // // 用户管理
          // autUser = JSON.stringify(autUser)
          // sessionStorage.setItem('autUser', autUser)
          // // 地址管理
          // autSite = JSON.stringify(autSite)
          // sessionStorage.setItem('autSite', autSite)
          // // 巡检计划管理
          // autPlan = JSON.stringify(autPlan)
          // sessionStorage.setItem('autPlan', autPlan)
          // // 巡检任务
          // autTask = JSON.stringify(autTask)
          // sessionStorage.setItem('autTask', autTask)
          // // 巡检日历
          // autCalendar = JSON.stringify(autCalendar)
          // sessionStorage.setItem('autCalendar', autCalendar)
          // // 巡检标准维护
          // autNorm = JSON.stringify(autNorm)
          // sessionStorage.setItem('autNorm', autNorm)
          // // 巡检异常
          // autAbnormal = JSON.stringify(autAbnormal)
          // sessionStorage.setItem('autAbnormal', autAbnormal)
          // // 工单列表
          // autWork = JSON.stringify(autWork)
          // sessionStorage.setItem('autWork', autWork)
          // // 异常处理规则设置
          // autRule = JSON.stringify(autRule)
          // sessionStorage.setItem('autRule', autRule)
          // // 人员配置
          // autCrew = JSON.stringify(autCrew)
          // sessionStorage.setItem('autCrew', autCrew)
          // // 编制排班
          // autShift = JSON.stringify(autShift)
          // sessionStorage.setItem('autShift', autShift)
          // // 排班管理
          // autScheduling = JSON.stringify(autScheduling)
          // sessionStorage.setItem('autScheduling', autScheduling)
          // // 审批列表
          // autApproval = JSON.stringify(autApproval)
          // sessionStorage.setItem('autApproval', autApproval)
          // // 巡检绑卡管理
          // autPolcard = JSON.stringify(autPolcard)
          // sessionStorage.setItem('autPolcard', autPolcard)
          // // 事件列表
          // autEvent = JSON.stringify(autEvent)
          // sessionStorage.setItem('autEvent', autEvent)
          // 路由跳转
          this.$router.push({ path: '/home' })
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    // 跳转找回密码
    skipFindpwd () {
      this.$router.push({ path: '/findpwd' })
    }
  }
}
</script>

<style lang="less" scoped>
  .cipher{
    .input-item{
      margin-bottom: 20px;
    }
    .login-btn{
      margin-bottom: 10px;
      button{
        display: block;
        width: 100%;
        background: #ff5a00;
        color: #ffffff;
        font-size: 16px;
        border: none;
        border-radius: 6px;
      }
    }
    .loginHelp{
      line-height: 30px;
      text-align: right;
    }
  }
</style>
