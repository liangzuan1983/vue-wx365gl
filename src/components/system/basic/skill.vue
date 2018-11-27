<template>
  <div class="skill">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
      <el-breadcrumb-item>基础信息维护</el-breadcrumb-item>
      <el-breadcrumb-item>技能树维护</el-breadcrumb-item>
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
        <div class="operate">
          <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addClick">新增</el-button>
        </div>
      </div>
      <div class="table">
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column type="index" width="50" label="序号"></el-table-column>
          <el-table-column label="技能名称">
            <template slot-scope="scope">
              <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.skills_id)">{{ scope.row.skills_name }}</a>
            </template>
          </el-table-column>
          <el-table-column label="技能等级">
            <template slot-scope="scope">
              <span v-for="item in scope.row.level" :key="item.skills_id" style="margin: 0 5px;">{{ item.skills_name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="describe" label="描述" width="300"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <i class="el-icon-edit" @click="comClick(scope.row.skills_id)"></i>
              <i class="el-icon-delete" @click="delClick(scope.row.skills_id)"></i>
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
        <h5 class="title">新增技能</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="技能名称" prop="name">
            <el-input v-model.trim="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model.trim="addForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="添加等级">
            <el-input v-model.trim="addForm.level" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" :disabled="addLeveDis" @click="addLevelClick">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="level">
          <span class="text"><i style="color: #f56c6c; margin-right: 3px;">*</i>技能等级</span>
          <div class="level-content">
            <el-tag
              style="margin-right: 12px;"
              v-for="level in addLevels"
              :key="level.name"
              :type="level.type"
              closable
              @close="handleClose(level)">
              {{level.name}}
            </el-tag>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetAddForm('ruleAddForm')">取 消</el-button>
        <el-button type="primary" :disabled="addDisabled" @click="submitAddForm('ruleAddForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 详情 -->
    <el-dialog :title="companyName" :visible.sync="detDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">技能详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="技能名称">
            <el-input v-model.trim="detForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model.trim="detForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="技能等级">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model.trim="detForm.levelNames"></el-input>
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
        <h5 class="title">编辑技能</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="技能名称" prop="name">
            <el-input v-model.trim="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model.trim="comForm.remark"></el-input>
          </el-form-item>
          <el-form-item label="添加等级">
            <el-input v-model.trim="comForm.level" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" :disabled="comLeveDis" @click="comLevelClick(comForm)">添加</el-button>
          </el-form-item>
        </el-form>
        <div class="level">
          <span class="text"><i style="color: #f56c6c; margin-right: 3px;">*</i>技能等级</span>
          <div class="level-content">
            <el-tag
              style="margin-right: 12px;"
              v-for="level in comLevels"
              :key="level.name"
              :type="level.type"
              closable
              @close="delLevelClick(level)">
              {{level.name}}
            </el-tag>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetComForm('ruleComForm')">取 消</el-button>
        <el-button type="primary" :disabled="comDisabled" @click="submitComForm('ruleComForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" width="26%" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该技能？</p>
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
        name: ''
      },
      nowSearch: {
        crew: '',
        name: ''
      },
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      formLabelWidth: '120px',
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ]
      },
      itemId: '',
      addDialog: false,
      addForm: {
        name: '',
        remark: '',
        level: ''
      },
      addLeveDis: true,
      addDisabled: false,
      detDialog: false,
      detForm: {
        name: '',
        remark: '',
        levelNames: ''
      },
      comDialog: false,
      comForm: {
        name: '',
        remark: '',
        level: ''
      },
      comLeveDis: true,
      comDisabled: false,
      delDialog: false,
      delDisabled: false,
      addLevels: [],
      comLevels: []
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
        s_user_name: this.search.crew,
        skills_name: this.search.name,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selSkills',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.skills
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
        remark: '',
        level: ''
      }
      this.addLevels = []
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
      const addLevels = this.addLevels
      if (addLevels.length === 0) {
        this.$message({
          showClose: true,
          message: '技能等级不能为空！',
          type: 'warning'
        })
        return
      }
      let levelNames = []
      addLevels.forEach(item => {
        levelNames.push(item.name)
      })
      levelNames = levelNames.join(',')
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        skills_name: this.addForm.name,
        describe: this.addForm.remark,
        level_name: levelNames
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addSkills',
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
        skills_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selSkillsOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 技能等级
          const addLevels = itemData.child
          let levelNames = []
          addLevels.forEach(item => {
            levelNames.push(item.skills_name)
          })
          levelNames = levelNames.join('、')
          this.detForm = {
            name: itemData.skills_name,
            remark: itemData.describe,
            levelNames: levelNames
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
        remark: '',
        level: ''
      }
      this.comLevels = []
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        skills_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selSkillsOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 技能等级
          const levels = itemData.child
          let comLevels = []
          levels.forEach(item => {
            comLevels.push({
              name: item.skills_name,
              type: '',
              id: item.skills_id
            })
          })
          this.comForm = {
            name: itemData.skills_name,
            remark: itemData.describe,
            level: ''
          }
          this.comLevels = comLevels
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
        skills_id: this.itemId,
        skills_name: this.comForm.name,
        describe: this.comForm.remark
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selSkillsOnly',
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
        skills_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delSkills',
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
    /* 等级 */
    // 添加
    addLevelClick () {
      const level = {
        name: this.addForm.level,
        type: ''
      }
      this.addLevels.push(level)
      this.addForm.level = ''
    },
    // 移除
    handleClose (level) {
      this.addLevels.splice(this.addLevels.indexOf(level), 1)
    },
    // 新增
    comLevelClick (args) {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        parent_sk_id: this.itemId,
        skills_name: args.name,
        level_name: args.level
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/addLevelSkills',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const leve = {
            name: args.level,
            type: '',
            id: res.data.data1
          }
          this.comLevels.push(leve)
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
    // 删除
    delLevelClick (level) {
      const levels = this.comLevels
      if (levels.length === 1) {
        this.$message({
          showClose: true,
          message: '技能等级不能为空！',
          type: 'warning'
        })
        return
      }
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        skills_id: level.id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/delSkills',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          // 刷新等级
          this.comLevels.splice(this.comLevels.indexOf(level), 1)
          if (this.comDialog) {
            this.comForm.level = ''
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
    }
  },
  watch: {
    'addForm.level' (newVal, oldVal) {
      if (newVal) {
        this.addLeveDis = false
      } else {
        this.addLeveDis = true
      }
    },
    'comForm.level' (newVal, oldVal) {
      if (newVal) {
        this.comLeveDis = false
      } else {
        this.comLeveDis = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.skill{
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
  .my-dialog{
    .body-content{
      .level{
        display: table;
        width: 100%;
        margin-bottom: 22px;
        .text{
          display: table-cell;
          vertical-align:top;
          width: 120px;
          padding-right: 12px;
          text-align: right;
          line-height: 35px;
        }
        .level-content{
          display: table-cell;
          vertical-align:top;
          height: 54px;
          padding: 5px;
          border-radius: 4px;
          background: #ffffff;
        }
      }
    }
  }
}
</style>
