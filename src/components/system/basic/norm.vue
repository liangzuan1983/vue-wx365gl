<template>
  <div class="norm">
    <el-container>
      <el-aside width="280px">
        <el-tree :data="normTree" ref="tree" :highlight-current="treeHighlight" default-expand-all node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item>系统配置</el-breadcrumb-item>
          <el-breadcrumb-item>基础信息维护</el-breadcrumb-item>
          <el-breadcrumb-item>巡检标准维护</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
          <div class="search">
            <div class="item">
              <span>检查项</span>
              <el-input style="width: 160px;" v-model="nowSearch.name"></el-input>
            </div>
            <div class="item">
              <span>报警等级</span>
              <el-select style="width: 160px;" v-model="nowSearch.level" clearable placeholder="请选择报警等级">
                <el-option
                  v-for="item in levelOptions"
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
              <el-table-column label="检查项" width="200">
                <template slot-scope="scope">
                  <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.ins_id)">{{ scope.row.ins_name }}</a>
                </template>
              </el-table-column>
              <el-table-column label="检查方法">
                <template slot-scope="scope">
                  <span>{{ scope.row.methods | filterWayData }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="check_content" label="检查内容及要求"></el-table-column>
              <el-table-column prop="alarm_level" label="报警等级" width="120"></el-table-column>
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <i class="el-icon-edit" @click="comClick(scope.row.ins_id)"></i>
                  <i class="el-icon-delete" @click="delClick(scope.row.ins_id)"></i>
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
        <h5 class="title">新增标准</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="上级标准" prop="parentName">
            <el-input :disabled="true" v-model="addForm.parentName"></el-input>
          </el-form-item>
          <el-form-item label="检查项" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="报警等级" prop="level">
            <el-select v-model="addForm.level" style="width: 160px;" placeholder="请选择报警等级">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检查方法" prop="way">
            <el-checkbox-group v-model="addForm.way">
              <el-checkbox label="目视检查" name="way"></el-checkbox>
              <el-checkbox label="听音" name="way"></el-checkbox>
              <el-checkbox label="嗅觉检查" name="way"></el-checkbox>
              <el-checkbox label="触摸" name="way"></el-checkbox>
              <el-checkbox label="乘坐检查" name="way"></el-checkbox>
              <el-checkbox label="专用工具检测" name="way"></el-checkbox>
              <el-checkbox label="手动检测" name="way"></el-checkbox>
              <el-checkbox label="温度检测" name="way"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="检查内容及要求" prop="remark">
            <el-input type="textarea" maxlength="100" v-model="addForm.remark" placeholder="文本长度不得超过100个字符"></el-input>
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
          <el-form-item label="上级标准">
            <el-input v-model="detForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="检查项">
            <el-input v-model="detForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="报警等级">
            <el-input v-model="detForm.level" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="检查方法">
            <el-input type="textarea" v-model="detForm.way"></el-input>
          </el-form-item>
          <el-form-item label="检查内容及要求">
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
          <el-form-item label="上级标准" prop="parentName">
            <el-input :disabled="true" v-model="comForm.parentName"></el-input>
          </el-form-item>
          <el-form-item label="检查项" prop="name">
            <el-input v-model="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="报警等级" prop="level">
            <el-select v-model="comForm.level" style="width: 160px;" placeholder="请选择报警等级">
              <el-option
                v-for="item in levelOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="检查方法" prop="way">
            <el-checkbox-group v-model="comForm.way">
              <el-checkbox label="目视检查" name="way"></el-checkbox>
              <el-checkbox label="听音" name="way"></el-checkbox>
              <el-checkbox label="嗅觉检查" name="way"></el-checkbox>
              <el-checkbox label="触摸" name="way"></el-checkbox>
              <el-checkbox label="乘坐检查" name="way"></el-checkbox>
              <el-checkbox label="专用工具检测" name="way"></el-checkbox>
              <el-checkbox label="手动检测" name="way"></el-checkbox>
              <el-checkbox label="温度检测" name="way"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="检查内容及要求" prop="remark">
            <el-input type="textarea" maxlength="100" v-model="comForm.remark" placeholder="文本长度不得超过100个字符"></el-input>
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
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该标准？</p>
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
        name: '',
        level: ''
      },
      nowSearch: {
        name: '',
        level: ''
      },
      levelOptions: [
        {
          value: '紧急',
          label: '紧急'
        },
        {
          value: '重要',
          label: '重要'
        },
        {
          value: '普通',
          label: '普通'
        }
      ],
      normTree: [],
      treeHighlight: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      normName: '',
      normId: 0,
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        level: [
          { required: true, message: '请选择报警等级', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',
      itemId: '',
      addDialog: false,
      addForm: {
        parentName: '',
        parentId: '',
        name: '',
        level: '',
        way: [],
        remark: ''
      },
      addDisabled: false,
      detDialog: false,
      detForm: {
        parent: '',
        name: '',
        level: '',
        way: '',
        remark: ''
      },
      comDialog: false,
      comForm: {
        parentName: '',
        parentId: '',
        name: '',
        level: '',
        way: [],
        remark: ''
      },
      comDisabled: false,
      crewOptions: [],
      delDialog: false,
      delDisabled: false
    }
  },
  created () {
    // 获取标准树
    this.getNormTree()
    // 获取列表
    this.getListData()
  },
  methods: {
    // 获取标准树
    getNormTree () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selInsTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const normData = res.data.data1
          const normTree = [
            {
              id: 0,
              name: '巡检标准维护树',
              children: normData
            }
          ]
          this.normTree = normTree
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
    // 点击标准树
    handleNodeClick (data) {
      // 设置当前name和id
      this.normId = data.id
      if (data.id === 0) {
        this.normName = ''
      } else {
        this.normName = data.name
      }
      // 设置高亮
      this.treeHighlight = true
      // 清空搜索框
      this.search = {
        name: '',
        level: ''
      }
      this.nowSearch = {
        name: '',
        level: ''
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
      this.normName = ''
      this.normId = 0
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
        s_parent_ins_id: this.normId,
        s_ins_name: this.search.name,
        s_alarm_level: this.search.level,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selIns',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.inss
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
        parentName: this.normName,
        parentId: this.normId,
        name: '',
        level: '',
        way: [],
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
      let way = this.addForm.way
      way = way.join(',')
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        parent_ins_id: this.addForm.parentId,
        ins_name: this.addForm.name,
        alarm_level: this.addForm.level,
        check_methods: way,
        check_content: this.addForm.remark
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addIns',
        data: params
      }).then((res) => {
        this.addDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetAddForm('ruleAddForm')
          // 刷新树
          this.getNormTree()
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
        ins_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selInsOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 检查方法
          let methods = itemData.methods
          let way = []
          methods.forEach(item => {
            way.push(item.check_method)
          })
          way = way.join('、')
          this.detForm = {
            parent: itemData.parent_ins_name || '',
            name: itemData.ins_name,
            level: itemData.alarm_level,
            way: way,
            remark: itemData.check_content
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
        parentName: '',
        parentId: '',
        name: '',
        level: '',
        way: [],
        remark: ''
      }
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ins_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selInsOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 检查方法
          let methods = itemData.methods
          let way = []
          methods.forEach(item => {
            if (item.check_method) {
              way.push(item.check_method)
            }
          })
          this.comForm = {
            parent: itemData.parent_ins_name || '',
            parentId: itemData.parent_ins_id || 0,
            name: itemData.ins_name,
            level: itemData.alarm_level,
            way: way,
            remark: itemData.check_content
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
      let way = this.comForm.way
      way = way.join(',')
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ins_id: this.itemId,
        parent_ins_id: this.comForm.parentId,
        ins_name: this.comForm.name,
        alarm_level: this.comForm.level,
        check_methods: way,
        check_content: this.comForm.remark
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/alterIns',
        data: params
      }).then((res) => {
        this.comDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetComForm('ruleComForm')
          // 刷新树
          this.getNormTree()
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
        ins_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delIns',
        data: params
      }).then((res) => {
        this.delDisabled = false
        if (res.data.result === 'Sucess') {
          // 隐藏提示框
          this.delDialog = false
          // 刷新树
          this.getNormTree()
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
    }
  },
  filters: {
    filterWayData (way) {
      if (!way) return ''
      let wayName = []
      way.forEach(item => {
        wayName.push(item.check_method)
      })
      wayName = wayName.join('、')
      return wayName
    }
  }
}
</script>

<style lang="less" scoped>
.norm{
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
}
</style>
