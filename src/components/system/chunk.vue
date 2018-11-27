<template>
  <div class="chunk">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>日志管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="search">
        <div class="item">
          <span>创建人</span>
          <el-input style="width: 160px;" v-model="nowSearch.crew"></el-input>
        </div>
        <div class="item">
          <span>模块名称</span>
          <el-input style="width: 160px;" v-model="nowSearch.name"></el-input>
        </div>
        <div class="item">
          <span>渠道</span>
          <el-select v-model="nowSearch.channel" style="width: 160px;" placeholder="请选择渠道">
            <el-option
              v-for="item in channelOptions"
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
      <div class="table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="模块名称">
            <template slot-scope="scope">
              <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.function_id)">{{ scope.row.function_name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="创建人"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | formatDate }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="describe" label="描述" width="300"></el-table-column>
          <el-table-column label="渠道">
            <template slot-scope="scope">
              <span v-if="scope.row.port === 0">应用端</span>
              <span v-else-if="scope.row.port === 1">管理端</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="comClick(scope.row.function_id)"></i>
              <i class="el-icon-delete" @click="delClick(scope.row.function_id)"></i>
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
    <!-- 新增 -->
    <el-dialog :title="companyName" :visible.sync="addDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">新增模块</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="选择渠道" prop="channel">
            <el-radio-group v-model="addForm.channel">
              <el-radio :label="0">应用端</el-radio>
              <el-radio :label="1">管理端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上级模块" prop="parent">
            <el-input :disabled="true" v-model="addForm.parentName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="getModTree(addForm.channel)">选择上级</el-button>
          </el-form-item>
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model="addForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm('ruleAddForm')">取 消</el-button>
        <el-button type="primary" :disabled="addDisabled" @click="submitAddForm('ruleAddForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :title="companyName" :visible.sync="detDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">模块详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="渠道">
            <el-input v-model="detForm.channel"></el-input>
          </el-form-item>
          <el-form-item label="上级模块">
            <el-input v-model="detForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="模块名称">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" v-model="detForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="detDialog = false">关 闭</el-button>
      </div>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog :title="companyName" :visible.sync="comDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">编辑模块</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="选择渠道" prop="channel">
            <el-radio-group v-model="comForm.channel">
              <el-radio :label="0">应用端</el-radio>
              <el-radio :label="1">管理端</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上级模块" prop="parent">
            <el-input :disabled="true" v-model="comForm.parentName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="getModTree(comForm.channel)">选择上级</el-button>
          </el-form-item>
          <el-form-item label="模块名称" prop="name">
            <el-input v-model="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model="comForm.remark"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetComForm('ruleComForm')">取 消</el-button>
        <el-button type="primary" :disabled="comDisabled" @click="submitComForm('ruleComForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 模块 -->
    <el-dialog :title="companyName" :visible.sync="modDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">上级模块</h5>
      </div>
      <div class="body-content" style="max-height: 480px; overflow-y: auto; padding: 10px; background: #ffffff;">
        <div>
          <el-tree :data="modTree" :highlight-current="treeHighlight" node-key="id" :props="defaultProps" @node-click="modTreeClick"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="modDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectMod">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" width="26%" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该角色？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="delDisabled" @click="submitDelForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default{
  data () {
    return {
      companyName: sessionStorage.getItem('wxAdmFirmName'),
      search: {
        crew: '',
        name: '',
        channel: 0
      },
      nowSearch: {
        crew: '',
        name: '',
        channel: 0
      },
      channelOptions: [
        {
          value: 0,
          label: '应用端'
        },
        {
          value: 1,
          label: '管理端'
        }
      ],
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      formLabelWidth: '120px',
      rules: {
        channel: [
          { required: true, message: '请选择渠道', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入用户姓名', trigger: 'blur' }
        ]
      },
      itemId: '',
      addDialog: false,
      addForm: {
        channel: 0,
        parentId: '',
        parentName: '',
        name: '',
        remark: ''
      },
      addDisabled: false,
      detDialog: false,
      detForm: {
        channel: '',
        parent: '',
        name: '',
        remark: ''
      },
      comDialog: false,
      comForm: {
        channel: '',
        parentId: '',
        parentName: '',
        name: '',
        remark: ''
      },
      comDisabled: false,
      delDialog: false,
      delDisabled: false,
      modDialog: false,
      modTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      treeHighlight: true,
      checkedModId: '',
      checkedModName: ''
    }
  },
  created () {
    // 获取列表数据
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
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        s_create_user: this.search.crew,
        s_module_name: this.search.name,
        s_port: this.search.channel,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selModule',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.modules
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
      this.addDialog = true
      this.addForm = {
        channel: 0,
        parentId: '',
        parentName: '',
        name: '',
        remark: ''
      }
    },
    // 验证表单
    submitAddForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendAddRequest()
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetAddForm (formName) {
      this.$refs[formName].resetFields()
      this.addDialog = false
    },
    // 提交
    sendAddRequest () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        port: this.addForm.channel,
        parent_fun_id: this.addForm.parentId || 0,
        parent_name: this.addForm.parentName,
        function_name: this.addForm.name,
        describe: this.addForm.remark
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addModule',
        data: params
      }).then((res) => {
        this.addDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetAddForm('ruleAddForm')
          // 刷新列表
          this.getListData()
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
    /* 查看详情 */
    checkDetails (id) {
      this.detDialog = true
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        function_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selModuleByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 渠道
          const channelNum = itemData.port
          let channel = ''
          if (channelNum === 0) {
            channel = '应用端'
          } else if (channelNum === 1) {
            channel = '管理端'
          }
          this.detForm = {
            channel: channel,
            parent: itemData.parent_fun_name,
            name: itemData.function_name,
            remark: itemData.describe || ''
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
    /* 编辑 */
    comClick (id) {
      this.comDialog = true
      this.itemId = id
      this.comForm = {
        channel: '',
        parentId: '',
        parentName: '',
        name: '',
        remark: ''
      }
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        function_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selModuleByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          this.comForm = {
            channel: itemData.port,
            parentId: itemData.parent_fun_id,
            parentName: itemData.parent_fun_name,
            name: itemData.function_name,
            remark: itemData.describe || ''
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
    // 验证表单
    submitComForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendComRequest()
        } else {
          return false
        }
      })
    },
    // 重置表单
    resetComForm (formName) {
      this.$refs[formName].resetFields()
      this.comDialog = false
    },
    // 提交
    sendComRequest () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        function_id: this.itemId,
        port: this.comForm.channel,
        parent_fun_id: this.comForm.parentId || 0,
        parent_name: this.comForm.parentName,
        function_name: this.comForm.name,
        describe: this.comForm.remark
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/alterModule',
        data: params
      }).then((res) => {
        this.comDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetComForm('ruleComForm')
          // 刷新列表
          this.getListData()
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.comDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    /* 删除 */
    delClick (id) {
      this.itemId = id
      this.delDialog = true
    },
    submitDelForm () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        function_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delModule',
        data: params
      }).then((res) => {
        this.delDisabled = false
        if (res.data.result === 'Sucess') {
          // 隐藏提示框
          this.delDialog = false
          // 刷新列表
          this.getListData()
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.delDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    /* 模块 */
    getModTree (type) {
      // 显示对话框
      this.modDialog = true
      // 设置选中id
      this.checkedModId = ''
      this.checkedModName = ''
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        type: type
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selPermissionTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.modTree = res.data.data1
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
    // 点击模块树
    modTreeClick (data) {
      // 设置选中id
      this.checkedModId = data.id
      this.checkedModName = data.name
    },
    // 确定
    selectMod () {
      const checkedModId = this.checkedModId
      const checkedModName = this.checkedModName
      if (this.addDialog) {
        this.addForm.parentName = checkedModName
        this.addForm.parentId = checkedModId
      } else if (this.comDialog) {
        this.comForm.parentName = checkedModName
        this.comForm.parentId = checkedModId
      }
      this.modDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.chunk{
  padding-top: 20px;
  .content{
    margin-top: 20px;
    .search{
      display: table;
      width: 100%;
      height: 60px;
      padding: 0 20px;
      background-color: #f1f1f1;
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
    .table{
      margin-top: 20px;
    }
    .paging{
      margin-top: 20px;
    }
  }
}
</style>
