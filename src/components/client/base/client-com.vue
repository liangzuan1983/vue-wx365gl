<template>
  <div class="client-com">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息</el-breadcrumb-item>
      <el-breadcrumb-item>编辑企业</el-breadcrumb-item>
    </el-breadcrumb>
    <el-tabs v-model="activeName" style="margin-top: 10px;" @tab-click="tabClick">
      <el-tab-pane label="企业基本信息" name="1"></el-tab-pane>
      <el-tab-pane label="组织管理" name="2"></el-tab-pane>
      <el-tab-pane label="项目管理" name="3"></el-tab-pane>
      <el-tab-pane label="角色管理" name="4"></el-tab-pane>
      <el-tab-pane label="用户管理" name="5"></el-tab-pane>
    </el-tabs>
    <div class="content">
      <router-view :parentClient="clientInfo"></router-view>
    </div>
  </div>
</template>

<script>
export default{
  data () {
    return {
      clientInfo: {
        clientId: '',
        clientName: ''
      },
      activeName: '1'
    }
  },
  created () {
    // 保存客户参数
    this.clientInfo = {
      clientId: this.$route.params.id,
      clientName: this.$route.params.name
    }
    // 跳转基本信息
    this.$router.push({ path: '/home/client-com/baseinfo' })
  },
  methods: {
    tabClick (data) {
      const type = data.name
      switch (type) {
        case '1':
          this.$router.push({ path: '/home/client-com/baseinfo' })
          break
        case '2':
          this.$router.push({ path: '/home/client-com/firm' })
          break
        case '3':
          this.$router.push({ path: '/home/client-com/project' })
          break
        case '4':
          this.$router.push({ path: '/home/client-com/role' })
          break
        case '5':
          this.$router.push({ path: '/home/client-com/user' })
          break
      }
    }
  }
}
</script>

<style lang="less" scoped>
.client-com{
  padding-top: 20px;
  .nav-title{
    width: 860px;
    padding: 20px;
    margin: 0 auto;
  }
}
</style>
