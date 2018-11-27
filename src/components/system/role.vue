<template>
  <div class="role">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>角色管理</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="search">
        <div class="item">
          <span>角色名称</span>
          <el-input style="width: 160px;" v-model="nowSearch.name"></el-input>
        </div>
        <div class="item">
          <span>角色编码</span>
          <el-input style="width: 160px;" v-model="nowSearch.coding"></el-input>
        </div>
        <div class="operate">
          <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addClick">新增</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column prop="role_mark" label="编码"></el-table-column>
          <el-table-column label="角色名称">
            <template slot-scope="scope">
              <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.role_id)">{{ scope.row.role_name }}</a>
            </template>
          </el-table-column>
          <el-table-column prop="instructions" width="600" label="角色描述"></el-table-column>
          <el-table-column label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.create_time | formatDate('yyyy-mm-dd') }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="user_name" label="创建人"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope" v-if="scope.row.role_name !== '企业管理员' && scope.row.role_name !== '游客'">
              <i class="el-icon-edit" @click="comClick(scope.row.role_id)"></i>
              <i class="el-icon-delete" @click="delClick(scope.row.role_id)"></i>
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
        <h5 class="title">新增角色</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="coding">
            <el-input v-model="addForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="autNames">
            <el-input :disabled="true" v-model="addForm.autNames" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="addAutClick">选择权限</el-button>
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
        <h5 class="title">角色详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="角色名称">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="角色编码">
            <el-input v-model="detForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="角色权限">
            <el-input type="textarea" v-model="detForm.authority"></el-input>
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
        <h5 class="title">编辑角色</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="角色名称" prop="name">
            <el-input v-model="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" prop="coding">
            <el-input :disabled="true" v-model="comForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="角色权限" prop="autNames">
            <el-input :disabled="true" v-model="comForm.autNames" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="comAutClick">选择权限</el-button>
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
    <!-- 权限 -->
    <el-dialog :title="companyName" :visible.sync="autDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择权限</h5>
      </div>
      <div class="body-content" style="max-height: 480px; overflow-y: auto; padding: 10px; background: #ffffff;">
        <div>
          <el-tree :data="autTree" ref="autTree" show-checkbox node-key="id" :props="defaultProps"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="autDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="autDisabled" @click="selectAut">确 定</el-button>
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
    let checkCoding = (rule, value, callback) => {
      let regex = /^[0-9a-zA-Z]+$/
      if (value) {
        if (value.match(regex)) {
          callback()
        } else {
          callback(new Error('编码只能为数字或字母'))
        }
      } else {
        callback(new Error('请输入机构编码'))
      }
    }
    return {
      companyName: sessionStorage.getItem('wxAdmFirmName'),
      search: {
        name: '',
        coding: ''
      },
      nowSearch: {
        name: '',
        coding: ''
      },
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      addDialog: false,
      addForm: {
        name: '',
        coding: '',
        autIds: '',
        autNames: '',
        remark: ''
      },
      addDisabled: false,
      detDialog: false,
      detForm: {
        name: '',
        coding: '',
        authority: '',
        remark: ''
      },
      comDialog: false,
      comForm: {
        name: '',
        coding: '',
        autIds: '',
        autNames: '',
        remark: ''
      },
      comDisabled: false,
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        coding: [
          { required: true, validator: checkCoding, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      crewOptions: [],
      delDialog: false,
      delDisabled: false,
      itemId: '',
      autDialog: false,
      autTree: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      autDisabled: false
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
        s_role_name: this.search.name,
        s_role_mark: this.search.coding,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selRole',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.roles
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
        name: '',
        coding: '',
        autIds: '',
        autNames: '',
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
        role_name: this.addForm.name,
        role_mark: this.addForm.coding,
        function_id: this.addForm.autIds || 0,
        instructions: this.addForm.remark
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addRole',
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
        role_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selRoleOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 权限
          const authority = itemData.permissions
          let autNames = []
          authority.forEach(item => {
            autNames.push(item.function_name)
          })
          autNames = autNames.join('、')
          this.detForm = {
            name: itemData.role_name,
            coding: itemData.role_mark,
            authority: autNames,
            remark: itemData.instructions
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
        name: '',
        coding: '',
        autIds: '',
        autNames: '',
        remark: ''
      }
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        role_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selRoleOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 权限
          const authority = itemData.permissions
          let autIds = []
          let autNames = []
          authority.forEach(item => {
            autNames.push(item.function_name)
            autIds.push(item.function_id)
          })
          autIds = autIds.join(',')
          autNames = autNames.join('、')
          this.comForm = {
            name: itemData.role_name,
            coding: itemData.role_mark,
            autIds: autIds,
            autNames: autNames,
            remark: itemData.instructions
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
        role_id: this.itemId,
        role_name: this.comForm.name,
        role_mark: this.comForm.coding,
        function_id: this.comForm.autIds || 0,
        instructions: this.comForm.remark
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/alterRole',
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
        role_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delRole',
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
    /* 权限 */
    // 新增
    addAutClick () {
      this.autDialog = true
      if (this.autTree.length === 0) {
        setTimeout(() => {
          let ids = []
          this.getAutOptions(ids)
        }, 100)
      } else {
        let ids = this.addForm.autIds
        if (ids) {
          ids = ids.split(',')
        } else {
          ids = []
        }
        setTimeout(() => {
          this.$refs.autTree.setCheckedKeys(ids)
        }, 100)
      }
    },
    // 编辑
    comAutClick () {
      this.autDialog = true
      let ids = this.comForm.autIds
      if (ids) {
        ids = ids.split(',')
      } else {
        ids = []
      }
      if (this.autTree.length === 0) {
        setTimeout(() => {
          this.getAutOptions(ids)
        }, 100)
      } else {
        setTimeout(() => {
          this.$refs.autTree.setCheckedKeys(ids)
        }, 100)
      }
    },
    // 获取权限树
    getAutOptions (id) {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        type: 1
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selPermissionTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.autTree = res.data.data1
          this.$refs.autTree.setCheckedKeys(id)
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
    selectAut () {
      const autData = this.$refs.autTree.getCheckedNodes()
      let autNames = []
      let autIds = []
      autData.forEach(item => {
        autNames.push(item.name)
        autIds.push(item.id)
      })
      autNames = autNames.join('、')
      autIds = autIds.join(',')
      if (this.addDialog) {
        this.addForm.autNames = autNames
        this.addForm.autIds = autIds
      } else if (this.comDialog) {
        this.comForm.autNames = autNames
        this.comForm.autIds = autIds
      }
      this.autDialog = false
    }
  }
}
</script>

<style lang="less" scoped>
.role{
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
