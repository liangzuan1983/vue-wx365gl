<template>
  <div class="client-add">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息</el-breadcrumb-item>
      <el-breadcrumb-item>新增企业</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="nav-title">
      <el-steps :active="titleActive" finish-status="success" align-center>
        <el-step title="企业基础信息"></el-step>
        <el-step title="添加组织"></el-step>
        <el-step title="添加项目"></el-step>
      </el-steps>
    </div>
    <div class="content">
      <basics
        :parentBasics="basicsForm"
        @parentBasicsFun="basicsFun"
        v-if="titleActive === 0"></basics>
      <organi
        :parentOrgani="organiForm"
        @parentActiveFun="activeFun"
        @parentOrganiFun="organiFun"
        v-else-if="titleActive === 1"></organi>
      <addpro
        :parentAddpro="addproForm"
        :parentBtnState="btnState"
        @parentActiveFun="activeFun"
        @parentSaveFun="saveFun"
        v-else-if="titleActive === 2"></addpro>
    </div>
  </div>
</template>

<script>
// 引入基础信息
import basics from '@/components/client/base/basics'
// 引入组织
import organi from '@/components/client/base/organi'
// 引入项目
import addpro from '@/components/client/base/addpro'
export default{
  data () {
    return {
      titleActive: 0,
      basicsForm: {
        name: '',
        linkman: '',
        phone: '',
        nature: '',
        area: [],
        areaName: '',
        cityId: '',
        trade: '',
        scale: '',
        state: '正常'
      },
      organiForm: {
        parent: '',
        name: '',
        coding: '',
        plane: '',
        site: '',
        remark: ''
      },
      addproForm: {
        clientName: '',
        name: '',
        coding: '',
        type: '',
        site: '',
        area: [],
        areaName: '',
        cityId: '',
        coord: ''
      },
      btnState: false
    }
  },
  created () {

  },
  components: {
    basics,
    organi,
    addpro
  },
  methods: {
    // 基本信息
    basicsFun (data) {
      this.basicsForm = data
      this.organiForm.parent = data.name
      this.addproForm.clientName = data.name
      this.titleActive = 1
    },
    // 组织机构
    organiFun (data) {
      this.organiForm = data
      this.titleActive = 2
    },
    // 第几步
    activeFun (num) {
      this.titleActive = num
    },
    // 保存
    saveFun (data) {
      this.addproForm = data
      this.sendAddRequest()
    },
    sendAddRequest () {
      let params = {
        user_id: sessionStorage.getItem('wxAdmUserId'),
        company_name: this.basicsForm.name,
        com_user_name: this.basicsForm.linkman,
        com_user_phone: this.basicsForm.phone,
        nature: this.basicsForm.nature,
        com_area: this.basicsForm.areaName,
        com_city_id: this.basicsForm.cityId,
        industry: this.basicsForm.trade,
        size: this.basicsForm.scale,
        com_state: this.basicsForm.state,
        ogz_name: this.organiForm.name,
        ogz_mark: this.organiForm.coding,
        ogz_phone: this.basicsForm.phone,
        telephone: this.organiForm.plane,
        ogz_address: this.organiForm.site,
        instructions: this.organiForm.remark,
        project_name: this.addproForm.name,
        project_mark: this.addproForm.coding,
        project_type: this.addproForm.type,
        project_address: this.addproForm.site,
        project_area: this.addproForm.areaName,
        project_city_id: this.addproForm.cityId,
        coordinate: this.addproForm.coord
      }
      params = this.$qs.stringify(params)
      this.btnState = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/add/longCompany',
        data: params
      }).then((res) => {
        this.btnState = false
        if (res.data.result === 'Sucess') {
          this.$router.push({ path: '/home/clibasic' })
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.btnState = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="less" scoped>
.client-add{
  padding-top: 20px;
  .nav-title{
    width: 860px;
    padding: 20px;
    margin: 0 auto;
  }
  .content{
    padding: 20px;
    background: #d1d1d1;
  }
}
</style>
