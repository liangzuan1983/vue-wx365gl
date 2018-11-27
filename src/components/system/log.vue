<template>
  <div class="log">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="search">
        <div class="search-input" style="margin-bottom: 10px;">
          <div class="item">
            <span>操作人员</span>
            <el-input style="width: 160px;" v-model="nowSearch.crew"></el-input>
          </div>
          <div class="item">
            <span>开始日期</span>
            <el-date-picker
              style="width: 160px;"
              v-model="nowSearch.startDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="item">
            <span>结束日期</span>
            <el-date-picker
              style="width: 160px;"
              v-model="nowSearch.endDate"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择日期">
            </el-date-picker>
          </div>
          <div class="operate"></div>
        </div>
        <div class="search-input">
          <div class="item">
            <span>操作类型</span>
            <el-input style="width: 160px;" v-model="nowSearch.type"></el-input>
          </div>
          <div class="item">
            <span>所属模块</span>
            <el-input style="width: 160px;" v-model="nowSearch.module"></el-input>
          </div>
          <div class="operate">
            <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
          </div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="operation_user" label="操作人员"></el-table-column>
          <el-table-column prop="operation_type" label="操作类型"></el-table-column>
          <el-table-column label="操作时间" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.operation_time | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="with_module" label="所属模块"></el-table-column>
          <el-table-column prop="describe" width="600" label="描述"></el-table-column>
        </el-table>
      </div>
      <div class="paging">
        <el-pagination
          background
          prev-text="上一页"
          next-text="下一页"
          :current-page="nowPage"
          layout="prev, pager, next, total"
          @current-change="pageChang"
          :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  data () {
    return {
      search: {
        crew: '',
        startDate: '',
        endDate: '',
        type: '',
        module: ''
      },
      nowSearch: {
        crew: '',
        startDate: '',
        endDate: '',
        type: '',
        module: ''
      },
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10
    }
  },
  created () {
    this.nowSearch.startDate = this.$common.getNowData()
    this.nowSearch.endDate = this.$common.getNowData()
    this.getListData()
  },
  methods: {
    // 搜索
    searchList () {
      this.search = this.nowSearch
      // 当前页码初始化
      this.nowPage = 1
      // 获取列表数据
      this.getListData()
    },
    // 获取列表数据
    getListData () {
      let startDate = ''
      if (this.search.startDate) {
        startDate = this.search.startDate + ' ' + '00:00:00'
      } else {
        startDate = this.$common.getNowData() + ' ' + '00:00:00'
      }
      let endDate = ''
      if (this.search.endDate) {
        endDate = this.search.endDate + ' ' + '23:59:59'
      } else {
        endDate = this.$common.getNowData() + ' ' + '23:59:59'
      }
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        user_name: this.search.crew,
        start_time: startDate,
        end_time: endDate,
        type: this.search.type,
        module: this.search.module,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selMLog',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.mlogs
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
    // 点击分页
    pageChang (page) {
      this.nowPage = page
      // 获取列表数据
      this.getListData()
    }
  }
}
</script>

<style lang="less" scoped>
.log{
  padding-top: 20px;
  .content{
    margin-top: 20px;
    .search{
      padding: 5px 20px;
      background-color: #f1f1f1;
      .search-input{
        display: table;
        width: 100%;
        .item{
          display: table-cell;
          vertical-align: middle;
          width: 280px;
          font-size: 0;
          span{
            margin-right: 5px;
            display: inline-block;
            line-height: 34px;
            font-size: 14px;
          }
        }
        .operate{
          display: table-cell;
          vertical-align: middle;
          text-align: right;
        }
      }
    }
    .table{
      margin-top: 20px;
    }
    .paging{
      margin-top: 20px;
    }
  }
}
</style>
