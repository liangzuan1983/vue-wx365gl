<template>
  <div class="clibasic">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>企业管理</el-breadcrumb-item>
      <el-breadcrumb-item>企业信息</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="search">
        <div class="search-input" style="margin-bottom: 10px;">
          <div class="item">
            <span>行政区域</span>
            <el-select v-model="nowSearch.area" style="width: 160px;" clearable filterable placeholder="请选择行政区域">
              <el-option
                v-for="item in areaOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <span>企业状态</span>
            <el-select v-model="nowSearch.state" style="width: 160px;" clearable filterable placeholder="请选择企业状态">
              <el-option
                v-for="item in stateOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <span>所属行业</span>
            <el-select v-model="nowSearch.trade" style="width: 160px;" clearable filterable placeholder="请选择企业状态">
              <el-option
                v-for="item in tradeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="item">
            <span>企业规模</span>
            <el-select v-model="nowSearch.scale" style="width: 160px;" clearable filterable placeholder="请选择企业规模">
              <el-option
                v-for="item in scaleOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </div>
          <div class="operate">
            <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
            <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addClick">新增</el-button>
          </div>
        </div>
        <div class="search-input">
          <div class="item">
            <span>企业名称</span>
            <el-input style="width: 160px;" v-model="nowSearch.name"></el-input>
          </div>
          <div class="item">
            <span>联系人</span>
            <el-input style="width: 160px;" v-model="nowSearch.linkman"></el-input>
          </div>
          <div class="item">
            <span>创建人</span>
            <el-input style="width: 160px;" v-model="nowSearch.creator"></el-input>
          </div>
          <div class="operate">
            <el-button type="primary" icon="el-icon-download" :disabled="downDisabled" @click="downFile">导出</el-button>
          </div>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="企业名称">
            <template slot-scope="scope">
              <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.company_id)">{{ scope.row.company_name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="area" label="行政区域"></el-table-column>
          <el-table-column prop="com_state" label="状态" width="100"></el-table-column>
          <el-table-column prop="user_name" label="联系人" width="100"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="180"></el-table-column>
          <el-table-column prop="create_user_name" label="创建人" width="100"></el-table-column>
          <el-table-column label="创建时间" width="160">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | formatDate('yyyy-mm-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <i class="iconfont icon-mokuaipeizhi" @click="modClick(scope.row.company_id)"></i>
              <router-link tag="i" class="el-icon-edit" :to="{ name: 'clientCom', params:{id: scope.row.company_id, name: scope.row.company_name}}"></router-link>
            </template>
          </el-table-column>
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
    <!-- 详情 -->
    <el-dialog :title="detForm.name" :visible.sync="detDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">企业详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="企业名称">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="联系人">
            <el-input v-model="detForm.linkman"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="detForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="企业性质">
            <el-input v-model="detForm.nature"></el-input>
          </el-form-item>
          <el-form-item label="行政区域">
            <el-input v-model="detForm.area"></el-input>
          </el-form-item>
          <el-form-item label="所属行业">
            <el-input v-model="detForm.trade"></el-input>
          </el-form-item>
          <el-form-item label="规模">
            <el-input v-model="detForm.scale"></el-input>
          </el-form-item>
          <el-form-item label="状态">
            <el-input v-model="detForm.state"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 模块 -->
    <el-dialog :title="clientName" :visible.sync="modDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择模块</h5>
      </div>
      <div class="body-content" style="max-height: 480px; overflow-y: auto; padding: 10px; background: #ffffff;">
        <div>
          <el-tree :data="modTree" ref="modTree" show-checkbox node-key="id" :props="defaultProps"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="modDisabled" @click="selectMod">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default{
  data () {
    return {
      clientName: '',
      search: {
        area: '',
        state: '',
        trade: '',
        scale: '',
        name: '',
        linkman: '',
        creator: ''
      },
      nowSearch: {
        area: '',
        state: '',
        trade: '',
        scale: '',
        name: '',
        linkman: '',
        creator: ''
      },
      areaOptions: [
        {
          value: '北京市',
          label: '北京市'
        },
        {
          value: '上海市',
          label: '上海市'
        },
        {
          value: '天津市',
          label: '天津市'
        },
        {
          value: '重庆市',
          label: '重庆市'
        },
        {
          value: '河北省',
          label: '河北省'
        },
        {
          value: '山西省',
          label: '山西省'
        },
        {
          value: '内蒙古自治区',
          label: '内蒙古自治区'
        },
        {
          value: '黑龙江省',
          label: '黑龙江省'
        },
        {
          value: '吉林省',
          label: '吉林省'
        },
        {
          value: '辽宁省',
          label: '辽宁省'
        },
        {
          value: '陕西省',
          label: '陕西省'
        },
        {
          value: '甘肃省',
          label: '甘肃省'
        },
        {
          value: '青海省',
          label: '青海省'
        },
        {
          value: '新疆维吾尔自治区',
          label: '新疆维吾尔自治区'
        },
        {
          value: '宁夏回族自治区',
          label: '宁夏回族自治区'
        },
        {
          value: '山东省',
          label: '山东省'
        },
        {
          value: '河南省',
          label: '河南省'
        },
        {
          value: '江苏省',
          label: '江苏省'
        },
        {
          value: '浙江省',
          label: '浙江省'
        },
        {
          value: '安徽省',
          label: '安徽省'
        },
        {
          value: '江西省',
          label: '江西省'
        },
        {
          value: '福建省',
          label: '福建省'
        },
        {
          value: '台湾省',
          label: '台湾省'
        },
        {
          value: '湖北省',
          label: '湖北省'
        },
        {
          value: '湖南省',
          label: '湖南省'
        },
        {
          value: '广东省',
          label: '广东省'
        },
        {
          value: '广西壮族自治区',
          label: '广西壮族自治区'
        },
        {
          value: '海南省',
          label: '海南省'
        },
        {
          value: '四川省',
          label: '四川省'
        },
        {
          value: '云南省',
          label: '云南省'
        },
        {
          value: '贵州省',
          label: '贵州省'
        },
        {
          value: '西藏自治区',
          label: '西藏自治区'
        },
        {
          value: '澳门',
          label: '澳门'
        },
        {
          value: '香港',
          label: '香港'
        }
      ],
      stateOptions: [
        {
          value: '正常',
          label: '正常'
        },
        {
          value: '冻结',
          label: '冻结'
        }
      ],
      tradeOptions: [
        {
          value: '互联网行业',
          label: '互联网行业'
        },
        {
          value: '制造行业',
          label: '制造行业'
        },
        {
          value: '贸易/物流',
          label: '贸易/物流'
        },
        {
          value: '建筑/房地产',
          label: '建筑/房地产'
        },
        {
          value: '金融行业',
          label: '金融行业'
        },
        {
          value: '服务业',
          label: '服务业'
        },
        {
          value: '政府/事业单位',
          label: '政府/事业单位'
        },
        {
          value: '教育行业',
          label: '教育行业'
        },
        {
          value: '文化传媒行业',
          label: '文化传媒行业'
        },
        {
          value: '企业服务',
          label: '企业服务'
        },
        {
          value: '医疗医药',
          label: '医疗医药'
        },
        {
          value: '其他组织',
          label: '其他组织'
        }
      ],
      scaleOptions: [
        {
          value: '100以下',
          label: '100以下'
        },
        {
          value: '100-499',
          label: '100-499'
        },
        {
          value: '500-999',
          label: '500-999'
        },
        {
          value: '1000以上',
          label: '1000以上'
        }
      ],
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      formLabelWidth: '120px',
      itemId: '',
      detDialog: false,
      detForm: {
        name: '',
        linkman: '',
        phone: '',
        nature: '',
        area: '',
        trade: '',
        scale: '',
        state: ''
      },
      modDialog: false,
      modTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      modDisabled: false,
      downDisabled: false
    }
  },
  created () {
    // 获取列表数据
    this.getListData()
    // 获取模块树
    this.getModTree()
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
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        s_area: this.search.area,
        s_com_state: this.search.state,
        s_industry: this.search.trade,
        s_size: this.search.scale,
        s_company_name: this.search.name,
        s_user_name: this.search.linkman,
        s_create_user_name: this.search.creator,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selCompany',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.companys
          // 检验是否列表为空
          if (this.tableData.length === 0 && this.nowPage > 1) {
            this.nowPage--
            this.getListData()
          }
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
    },
    /* 新增 */
    addClick () {
      this.$router.push({ path: '/home/client-add' })
    },
    /* 查看详情 */
    checkDetails (id) {
      this.detDialog = true
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        companyN_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selComByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          this.detForm = {
            name: itemData.company_name,
            linkman: itemData.user_name,
            phone: itemData.phone,
            nature: itemData.nature,
            area: itemData.area,
            trade: itemData.industry,
            scale: itemData.size,
            state: itemData.com_state
          }
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.addDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    /* 模块配置 */
    modClick (id) {
      this.modDialog = true
      this.itemId = id
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        companyN_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selComByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          this.clientName = itemData.company_name
          const modData = itemData.com_fun
          let mods = []
          modData.forEach(item => {
            mods.push(item.function_id)
          })
          setTimeout(() => {
            this.$refs.modTree.setCheckedKeys(mods)
          }, 100)
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
    // 获取模块树
    getModTree () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        type: 0
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selPermissionTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          let modData = res.data.data1
          this.modTree = modData
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
    // 确定
    selectMod () {
      let mods = this.$refs.modTree.getCheckedKeys()
      mods = mods.join(',')
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        companyN_id: this.itemId,
        funs: mods
      }
      params = this.$qs.stringify(params)
      this.modDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/setComFun',
        data: params
      }).then((res) => {
        this.modDisabled = false
        if (res.data.result === 'Sucess') {
          this.modDialog = false
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.modDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    /* 导出 */
    downFile () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        page: 1,
        limit1: 10000
      }
      params = this.$qs.stringify(params)
      this.downDisabled = true
      setTimeout(() => {
        this.downDisabled = false
      }, 5000)
      window.location.href = this.bmApi() + '/companyEO?' + params
    }
  }
}
</script>

<style lang="less" scoped>
.clibasic{
  margin-top: 20px;
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
            width: 60px;
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
