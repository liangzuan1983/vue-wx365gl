<template>
  <div class="firm">
    <el-container>
      <el-aside width="280px">
        <el-tree :data="firmTree" ref="tree" :highlight-current="treeHighlight" default-expand-all node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>组织结构管理</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
          <div class="search">
            <div class="item">
              <span>机构名称</span>
              <el-input style="width: 160px;" v-model="nowSearch.organ"></el-input>
            </div>
            <div class="item">
              <span>机构编码</span>
              <el-input style="width: 160px;" v-model="nowSearch.coding"></el-input>
            </div>
            <div class="operate">
              <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
              <el-button type="primary" icon="el-icon-circle-plus-outline" :disabled="opeAddDis" @click="addClick">新增</el-button>
            </div>
          </div>
          <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column prop="ogz_mark" label="编码"></el-table-column>
              <el-table-column label="机构名称">
                <template slot-scope="scope">
                  <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row)">{{ scope.row.ogz_name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="user_name" label="负责人"></el-table-column>
              <el-table-column prop="ogz_phone" label="机构电话"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-edit" @click="comClick(scope.row)"></i>
                  <i class="el-icon-delete" @click="delClick(scope.row.ogz_id)"></i>
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
      </el-main>
    </el-container>
    <!-- 新增 -->
    <el-dialog :title="companyName" :visible.sync="addDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">新增机构</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="上级机构" prop="parent">
            <el-input :disabled="true" v-model="addForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="机构编码" prop="coding">
            <el-input v-model="addForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="机构负责人" prop="crew">
            <el-select v-model="addForm.crew" filterable placeholder="请选择机构负责人">
              <el-option v-for="item in crewOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构电话" prop="plane">
            <el-input v-model="addForm.plane" style="width: 60%; margin-right: 20px;"></el-input>
            <span class="red">示例：0755-61218000</span>
          </el-form-item>
          <el-form-item label="机构地址" prop="site">
            <el-input v-model="addForm.site"></el-input>
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
        <h5 class="title">机构详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="上级机构">
            <el-input v-model="detForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="机构名称">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="机构编码">
            <el-input v-model="detForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="机构负责人">
            <el-input v-model="detForm.crew"></el-input>
          </el-form-item>
          <el-form-item label="机构电话">
            <el-input v-model="detForm.plane"></el-input>
          </el-form-item>
          <el-form-item label="机构地址">
            <el-input v-model="detForm.site"></el-input>
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
        <h5 class="title">编辑机构</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="上级机构" prop="parent">
            <el-input :disabled="true" v-model="comForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="机构名称" prop="name">
            <el-input v-model="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="机构编码" prop="coding">
            <el-input :disabled="true" v-model="comForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="机构负责人" prop="crew">
            <el-select v-model="comForm.crew" filterable placeholder="请选择机构负责人">
              <el-option v-for="item in crewOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="机构电话" prop="plane">
            <el-input v-model="comForm.plane" style="width: 60%; margin-right: 20px;"></el-input>
            <span class="red">示例：0755-61218000</span>
          </el-form-item>
          <el-form-item label="机构地址" prop="site">
            <el-input v-model="comForm.site"></el-input>
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
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" width="26%" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该机构？</p>
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
    let checkPlane = (rule, value, callback) => {
      let regex = /^0\d{2,3}-?\d{7,8}$/
      if (value) {
        if (value.match(regex)) {
          callback()
        } else {
          callback(new Error('机构电话格式错误'))
        }
      } else {
        callback(new Error('请输入机构电话'))
      }
    }
    return {
      companyName: sessionStorage.getItem('wxAdmFirmName'),
      search: {
        organ: '',
        coding: ''
      },
      nowSearch: {
        organ: '',
        coding: ''
      },
      firmTree: [],
      treeHighlight: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      ogzName: '',
      ogzId: sessionStorage.getItem('wxAdmUserId'),
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      opeAddDis: true,
      addDialog: false,
      addForm: {
        parent: '',
        parentId: 0,
        name: '',
        coding: '',
        crew: '',
        plane: '',
        site: '',
        remark: ''
      },
      addDisabled: false,
      detDialog: false,
      detForm: {
        parent: '',
        name: '',
        coding: '',
        crew: '',
        phone: '',
        plane: '',
        site: '',
        remark: ''
      },
      comDialog: false,
      comForm: {
        id: 0,
        parent: '',
        name: '',
        coding: '',
        crew: '',
        plane: '',
        site: '',
        remark: ''
      },
      comDisabled: false,
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        coding: [
          { required: true, validator: checkCoding, trigger: 'blur' }
        ],
        crew: [
          { required: true, message: '请选择机构负责人', trigger: 'change' }
        ],
        plane: [
          { required: true, validator: checkPlane, trigger: 'blur' }
        ]
      },
      formLabelWidth: '120px',
      crewOptions: [],
      delDialog: false,
      delDisabled: false,
      itemId: ''
    }
  },
  created () {
    // 获取组织树
    this.getFirmTree()
    // 获取列表
    this.getListData()
    // 获取人员列表
    this.getCrewList()
  },
  methods: {
    // 获取组织树
    getFirmTree () {
      let params = { company_id: sessionStorage.getItem('wxAdmFirmId'), user_id: sessionStorage.getItem('wxAdmUserId'), project_id: 0 }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selOrganzationTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.firmTree = res.data.data1
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
    // 点击组织树
    handleNodeClick (data) {
      // 设置当前name和id
      this.ogzId = data.id
      this.ogzName = data.name
      // 设置高亮
      this.treeHighlight = true
      // 清空搜索框
      this.search = {
        organ: '',
        coding: ''
      }
      this.nowSearch = {
        organ: '',
        coding: ''
      }
      // 当前页码初始化
      this.nowPage = 1
      // 获取列表数据
      this.getListData()
    },
    // 搜索
    searchList () {
      this.search = this.nowSearch
      // 清空选中项
      this.ogzName = ''
      this.ogzId = sessionStorage.getItem('wxAdmUserId')
      // 取消高亮
      this.treeHighlight = false
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
        ogz_name: this.ogzName,
        ogz_id: this.ogzId,
        s_ogz_name: this.search.organ,
        s_ogz_mark: this.search.coding,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selOrganizationChild',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.ogz
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
        parent: this.ogzName,
        parentId: this.ogzId,
        name: '',
        coding: '',
        crew: parseInt(sessionStorage.getItem('wxAdmUserId')),
        plane: '',
        site: '',
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
        parent_ogz_id: this.addForm.parentId,
        ogz_name: this.addForm.name,
        ogz_mark: this.addForm.coding,
        ogz_head: this.addForm.crew,
        ogz_phone: this.addForm.plane,
        ogz_address: this.addForm.site,
        instructions: this.addForm.remark
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addOrganization',
        data: params
      }).then((res) => {
        this.addDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetAddForm('ruleAddForm')
          // 刷新树
          this.getFirmTree()
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
    checkDetails (data) {
      this.detDialog = true
      let coding = ''
      if (data.ogz_mark !== undefined) {
        coding = data.ogz_mark
      }
      this.detForm = {
        parent: data.parent_ogz_name,
        name: data.ogz_name,
        coding: coding,
        crew: data.user_name,
        plane: data.ogz_phone,
        site: data.ogz_address,
        remark: data.instructions
      }
    },
    /* 编辑 */
    comClick (data) {
      this.comDialog = true
      let coding = ''
      if (data.ogz_mark !== undefined) {
        coding = data.ogz_mark
      }
      this.comForm = {
        id: data.ogz_id,
        parent: data.parent_ogz_name,
        name: data.ogz_name,
        coding: coding,
        crew: data.ogz_head,
        plane: data.ogz_phone,
        site: data.ogz_address,
        remark: data.instructions
      }
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
        ogz_name: this.comForm.name,
        ogz_id: this.comForm.id,
        ogz_mark: this.comForm.coding,
        ogz_head: this.comForm.crew,
        ogz_phone: this.comForm.plane,
        ogz_address: this.comForm.site,
        instructions: this.comForm.remark
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/alterOrganization',
        data: params
      }).then((res) => {
        this.comDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetComForm('ruleComForm')
          // 刷新树
          this.getFirmTree()
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
        ogz_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delOrganization',
        data: params
      }).then((res) => {
        this.delDisabled = false
        if (res.data.result === 'Sucess') {
          // 隐藏提示框
          this.delDialog = false
          // 刷新树
          this.getFirmTree()
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
    /* 选择人员 */
    getCrewList () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ogz_id: 0,
        s_user_name: '',
        s_user_phone: '',
        s_role_id: '',
        page: '1',
        limit1: '10000'
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selUser',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.crewOptions = res.data.data1.users
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
    }
  },
  watch: {
    ogzId (newVal, oldVal) {
      if (newVal) {
        this.opeAddDis = false
      } else {
        this.opeAddDis = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.firm{
  height: 100%;
  .el-container{
    height: 100%;
    .el-aside{
      height: 100%;
      padding-top: 20px;
      padding-right: 20px;
      border-right: 1px solid #d1d1d1;
    }
    .el-main{
      padding-right: 0;
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
            button{
              margin: 0 5px;
              .iconfont{
                margin-right: 3px;
              }
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
  }
  .crew-search{
    width: 40%;
    margin-bottom: 10px;
  }
}
</style>
