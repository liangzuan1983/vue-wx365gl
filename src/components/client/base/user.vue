<template>
  <div class="user">
    <el-container>
      <el-aside width="280px">
        <el-tree :data="firmTree" :highlight-current="treeHighlight" default-expand-all node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <div class="content" ref="content">
          <div class="search">
            <div class="search-input" style="margin-bottom: 10px;">
              <div class="item">
                <span>用户姓名</span>
                <el-input style="width: 160px;" v-model="nowSearch.name"></el-input>
              </div>
              <div class="item">
                <span>联系电话</span>
                <el-input style="width: 160px;" v-model="nowSearch.phone"></el-input>
              </div>
              <div class="operate">
                <el-button type="primary" icon="el-icon-search" @click="searchList">搜索</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="addClick">新增</el-button>
              </div>
            </div>
            <div class="search-input">
              <div class="item">
                <span>用户角色</span>
                <el-select v-model="nowSearch.role" style="width: 160px;" clearable filterable placeholder="请选择用户角色">
                  <el-option
                    v-for="item in roleOptions"
                    :key="item.role_id"
                    :label="item.role_name"
                    :value="item.role_id">
                  </el-option>
                </el-select>
              </div>
              <div class="operate">
                <el-button type="primary" icon="el-icon-upload2" :disabled="opeUpDis" @click="upClick">导入</el-button>
                <el-button type="primary" icon="el-icon-download" :disabled="downDisabled" @click="downFile">导出</el-button>
              </div>
            </div>
          </div>
          <div class="table">
            <el-table :data="tableData" stripe style="width: 100%">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column prop="user_id" label="用户ID"></el-table-column>
              <el-table-column label="用户姓名">
                <template slot-scope="scope">
                  <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.user_id)">{{ scope.row.user_name }}</a>
                </template>
              </el-table-column>
              <el-table-column prop="user_phone" label="联系电话"></el-table-column>
              <el-table-column prop="role_name" label="角色"></el-table-column>
              <el-table-column prop="ogz_name" label="所属组织"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope" v-if="scope.row.role_name !== '企业管理员'">
                  <i class="iconfont icon-xiangmufanwei" @click="setProClick(scope.row.user_id)"></i>
                  <i class="el-icon-edit" @click="comClick(scope.row.user_id)"></i>
                  <i class="el-icon-delete" @click="delClick(scope.row.user_id)"></i>
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
        <h5 class="title">新增用户</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="addForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="addForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属组织" prop="orgName">
            <el-input :disabled="true" v-model="addForm.orgName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="orgClick">选择组织</el-button>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="addForm.role" filterable placeholder="请选择用户角色">
              <el-option
                v-for="item in useRoleOptions"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目范围" prop="proName">
            <el-input :disabled="true" v-model="addForm.proName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="addProClick">选择项目</el-button>
          </el-form-item>
          <el-form-item label="技能" prop="parSkillName">
            <el-input :disabled="true" v-model="addForm.parSkillName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="addSkillClick">选择技能</el-button>
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
        <h5 class="title">用户详情</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :label-width="formLabelWidth">
          <el-form-item label="用户姓名">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input v-model="detForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属组织">
            <el-input v-model="detForm.orgName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input v-model="detForm.role" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目范围">
            <el-input type="textarea" v-model="detForm.proName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="技能">
            <el-input type="textarea" v-model="detForm.skillName" auto-complete="off"></el-input>
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
        <h5 class="title">编辑用户</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="用户姓名" prop="name">
            <el-input v-model="comForm.name"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="comForm.phone" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="所属组织" prop="orgName">
            <el-input :disabled="true" v-model="comForm.orgName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="orgClick">选择组织</el-button>
          </el-form-item>
          <el-form-item label="角色" prop="role">
            <el-select v-model="comForm.role" filterable placeholder="请选择用户角色">
              <el-option
                v-for="item in useRoleOptions"
                :key="item.role_id"
                :label="item.role_name"
                :value="item.role_id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目范围" prop="proName">
            <el-input :disabled="true" v-model="comForm.proName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="comProClick">选择项目</el-button>
          </el-form-item>
          <el-form-item label="技能" prop="parSkillName">
            <el-input :disabled="true" v-model="comForm.parSkillName" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="comSkillClick">选择技能</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetComForm('ruleComForm')">取 消</el-button>
        <el-button type="primary" :disabled="comDisabled" @click="submitComForm('ruleComForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 组织 -->
    <el-dialog :title="companyName" :visible.sync="orgDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择组织</h5>
      </div>
      <div class="body-content" style="max-height: 480px; overflow-y: auto; padding: 10px; background: #ffffff;">
        <div>
          <el-tree :data="firmTree" :highlight-current="firmHighlight" default-expand-all node-key="id" :props="defaultProps" @node-click="firmTreeClick"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="orgDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectOrg">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 项目 -->
    <el-dialog :title="companyName" :visible.sync="proDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择项目</h5>
      </div>
      <div class="body-content" style="max-height: 480px; overflow-y: auto; padding: 10px; background: #ffffff;">
        <div>
          <el-tree :data="proTree" ref="proTree" show-checkbox default-expand-all check-strictly node-key="id" :props="defaultProps"></el-tree>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="proDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="proDisabled" @click="selectPro">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 技能 -->
    <el-dialog :title="companyName" :visible.sync="skillDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择技能</h5>
      </div>
      <div class="body-content">
        <el-input placeholder="请输入技能名称" prefix-icon="el-icon-search" v-model="skillFilter" style="width: 40%; margin-bottom: 10px;"></el-input>
        <el-table :data="skillData" ref="skillTable" @selection-change="skillSelectChange" stripe style="width: 100%" max-height="360">
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="name" label="技能名称"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="skillDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectSkill">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" width="26%" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该用户？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="delDisabled" @click="submitDelForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 导入 -->
    <el-dialog :title="companyName" :visible.sync="upDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">导入地址</h5>
      </div>
      <div class="body-content">
        <el-upload
          class="upload-demo"
          :action="reqUrl"
          :headers="reqHead"
          :on-success="upFileSuccess"
          :on-error="upFileError"
          :multiple="false"
          :file-list="fileList">
          <el-button size="small" type="primary">点击导入</el-button>
        </el-upload>
        <p class="up-hint">支持excel2003, excel2007请确保必填项填写完整</p>
        <p class="up-hint"><a href="javascript:;" @click="downTemplate">点击下载模板</a></p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upDialog = false">关闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default{
  props: ['parentClient'],
  data () {
    let checkPhone = (rule, value, callback) => {
      let regex = /^1[3|4|5|6|7|8|9][0-9]{9}$/
      if (value) {
        if (value.match(regex)) {
          callback()
        } else {
          callback(new Error('手机号码格式错误'))
        }
      } else {
        callback(new Error('请输入手机号码'))
      }
    }
    return {
      companyName: this.parentClient.clientName,
      search: {
        name: '',
        phone: '',
        role: ''
      },
      nowSearch: {
        name: '',
        phone: '',
        role: ''
      },
      ogzId: 0,
      roleOptions: [],
      useRoleOptions: [],
      firmTree: [],
      treeHighlight: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      addDialog: false,
      addForm: {
        name: '',
        phone: '',
        orgName: '',
        orgId: '',
        role: '',
        proName: '',
        proId: '',
        parSkillName: '',
        parSkillId: [],
        skillId: ''
      },
      addDisabled: false,
      detDialog: false,
      detForm: {
        name: '',
        phone: '',
        orgName: '',
        role: '',
        proName: '',
        skillName: ''
      },
      comDialog: false,
      comForm: {
        name: '',
        phone: '',
        orgName: '',
        orgId: '',
        role: '',
        proName: '',
        proId: '',
        parSkillName: '',
        parSkillId: [],
        skillId: ''
      },
      comDisabled: false,
      rules: {
        name: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
        ],
        orgName: [
          { required: true, message: '请选择所属组织', trigger: 'change' }
        ],
        role: [
          { required: true, message: '请选择角色', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',
      delDialog: false,
      delDisabled: false,
      itemId: '',
      orgDialog: false,
      firmHighlight: true,
      checkedOrgName: '',
      checkedOrgId: '',
      proDialog: false,
      proTree: [],
      proDisabled: false,
      skillDialog: false,
      skillData: [],
      oskillData: [],
      skillFilter: '',
      skillSelected: [],
      opeUpDis: true,
      upDialog: false,
      downDisabled: false,
      reqUrl: '',
      reqHead: {
        token: sessionStorage.getItem('wxAdmToken'),
        user_id: sessionStorage.getItem('wxAdmUserId')
      },
      fileList: []
    }
  },
  created () {

  },
  mounted () {
    // 设置显示框高度
    const domHeight = this.$common.getDomClientSize().height
    const contentHeight = domHeight - 300
    this.$refs.content.style.height = contentHeight + 'px'
    // 获取组织树
    this.getFirmTree()
    // 获取列表
    this.getListData()
    // 获取角色
    this.getRoleOptions()
  },
  methods: {
    // 获取组织树
    getFirmTree () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selOrganzationTree',
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
      // 设置当前id
      this.ogzId = data.id
      // 设置高亮
      this.treeHighlight = true
      // 清空搜索框
      this.search = {
        name: '',
        phone: '',
        role: ''
      }
      this.nowSearch = {
        name: '',
        phone: '',
        role: ''
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
      this.ogzId = 0
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
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ogz_id: this.ogzId,
        s_user_name: this.search.name,
        s_user_phone: this.search.phone,
        s_role_id: this.search.role,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selUser',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.users
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
        phone: '',
        orgName: '',
        orgId: '',
        role: '',
        proName: '',
        proId: '',
        parSkillName: '',
        parSkillId: [],
        skillId: ''
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
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        user_name: this.addForm.name,
        user_phone: this.addForm.phone,
        ogz_id: this.addForm.orgId,
        role_id: this.addForm.role,
        project_ids: this.addForm.proId,
        skills_id: this.addForm.skillId
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/addUser',
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
    /* 详情 */
    checkDetails (id) {
      this.detDialog = true
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selUserOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 项目范围
          const pros = itemData.userPRO
          let proName = []
          pros.forEach(item => {
            proName.push(item.project_name)
          })
          proName = proName.join('、')
          // 技能
          const skills = itemData.userSKL
          let skillName = []
          skills.forEach(item => {
            // skillName.push(item.all_name)
            skillName.push(item.parent_name)
          })
          skillName = skillName.join('、')
          this.detForm = {
            name: itemData.user_name,
            phone: itemData.user_phone,
            orgName: itemData.ogz_name,
            role: itemData.role_name,
            proName: proName,
            skillName: skillName
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
    /* 编辑 */
    comClick (id) {
      this.itemId = id
      this.comDialog = true
      this.comForm = {
        name: '',
        phone: '',
        orgName: '',
        orgId: '',
        role: '',
        proName: '',
        proId: '',
        parSkillName: '',
        parSkillId: [],
        skillId: ''
      }
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selUserOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 项目范围
          const pros = itemData.userPRO
          let proName = []
          let proId = []
          pros.forEach(item => {
            proName.push(item.project_name)
            proId.push(item.project_id)
          })
          proName = proName.join('、')
          proId = proId.join(',')
          // 技能
          const skills = itemData.userSKL
          let parSkillName = []
          let parSkillId = []
          let skillId = []
          skills.forEach(item => {
            parSkillName.push(item.parent_name)
            parSkillId.push(item.parent_sk_id)
            skillId.push(item.skills_id)
          })
          parSkillName = parSkillName.join('、')
          skillId = skillId.join(',')
          this.comForm = {
            name: itemData.user_name,
            phone: itemData.user_phone,
            orgName: itemData.ogz_name,
            orgId: itemData.ogz_id,
            role: itemData.role_id,
            proName: proName,
            proId: proId,
            parSkillName: parSkillName,
            parSkillId: parSkillId,
            skillId: skillId
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
    // 重置表单
    resetComForm (formName) {
      this.$refs[formName].resetFields()
      this.comDialog = false
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
    // 提交
    sendComRequest () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: this.itemId,
        user_name: this.comForm.name,
        user_phone: this.comForm.phone,
        ogz_id: this.comForm.orgId,
        role_id: this.comForm.role,
        project_ids: this.comForm.proId,
        skills_id: this.comForm.skillId
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/alterUser',
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
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/delUserOnly',
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
    /* 选择角色 */
    getRoleOptions () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        s_pro_name: '',
        s_pro_mark: '',
        page: '1',
        limit1: '10000'
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selRole',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const roleOptions = res.data.data1.roles
          this.roleOptions = roleOptions
          let useRoleOptions = []
          roleOptions.forEach(item => {
            if (item.role_name !== '企业管理员') {
              const roleItem = {
                role_name: item.role_name,
                role_id: item.role_id
              }
              useRoleOptions.push(roleItem)
            }
          })
          this.useRoleOptions = useRoleOptions
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
    /* 选择组织 */
    orgClick () {
      this.orgDialog = true
      // 清空选中项
      this.checkedOrgId = ''
      this.checkedOrgName = ''
      // 取消高亮
      this.firmHighlight = false
    },
    // 点击树
    firmTreeClick (data) {
      // 设置选中id
      this.checkedOrgId = data.id
      this.checkedOrgName = data.name
      // 设置高亮
      this.firmHighlight = true
    },
    // 确定
    selectOrg () {
      const checkedOrgId = this.checkedOrgId
      const checkedOrgName = this.checkedOrgName
      if (!checkedOrgId) {
        this.$message({
          showClose: true,
          message: '请选择组织机构!',
          type: 'warning'
        })
        return
      }
      if (this.addDialog) {
        this.addForm.orgName = checkedOrgName
        this.addForm.orgId = checkedOrgId
      } else if (this.comDialog) {
        this.comForm.orgName = checkedOrgName
        this.comForm.orgId = checkedOrgId
      }
      this.orgDialog = false
    },
    /* 选择项目 */
    // 新增
    addProClick () {
      this.proDialog = true
      if (this.proTree.length === 0) {
        setTimeout(() => {
          const ids = []
          this.getProOptions(ids)
        }, 100)
      } else {
        let ids = this.addForm.proId
        if (ids) {
          ids = ids.split(',')
        } else {
          ids = []
        }
        setTimeout(() => {
          this.$refs.proTree.setCheckedKeys(ids)
        }, 100)
      }
    },
    // 编辑
    comProClick () {
      this.proDialog = true
      let ids = this.comForm.proId
      if (ids) {
        ids = ids.split(',')
      } else {
        ids = []
      }
      if (this.proTree.length === 0) {
        setTimeout(() => {
          this.getProOptions(ids)
        }, 100)
      } else {
        setTimeout(() => {
          this.$refs.proTree.setCheckedKeys(ids)
        }, 100)
      }
    },
    // 设置
    setProClick (id) {
      this.itemId = id
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selUserOnly',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const pros = res.data.data1.userPRO || []
          let ids = []
          pros.forEach(item => {
            ids.push(item.project_id)
          })
          this.proDialog = true
          if (this.proTree.length === 0) {
            setTimeout(() => {
              this.getProOptions(ids)
            }, 100)
          } else {
            setTimeout(() => {
              this.$refs.proTree.setCheckedKeys(ids)
            }, 100)
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
    // 获取项目树
    getProOptions (id) {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selProjectTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.proTree = res.data.data1
          this.$refs.proTree.setCheckedKeys(id)
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
    selectPro () {
      const proData = this.$refs.proTree.getCheckedNodes()
      let proNames = []
      let proIds = []
      proData.forEach(item => {
        proNames.push(item.name)
        proIds.push(item.id)
      })
      proNames = proNames.join('、')
      proIds = proIds.join(',')
      if (this.addDialog) {
        this.addForm.proName = proNames
        this.addForm.proId = proIds
        this.proDialog = false
      } else if (this.comDialog) {
        this.comForm.proName = proNames
        this.comForm.proId = proIds
        this.proDialog = false
      } else {
        this.setUserProject(proIds)
      }
    },
    // 设置项目
    setUserProject (id) {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        userN_id: this.itemId,
        project_ids: id
      }
      params = this.$qs.stringify(params)
      this.proDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/alterUserPRO',
        data: params
      }).then((res) => {
        this.proDisabled = false
        if (res.data.result === 'Sucess') {
          // 隐藏选择框
          this.proDialog = false
        } else {
          const errHint = this.$common.errorCodeHint(res.data.error_code)
          this.$message({
            showClose: true,
            message: errHint,
            type: 'error'
          })
        }
      }).catch(() => {
        this.proDisabled = false
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    /* 选择技能 */
    // 新增
    addSkillClick () {
      this.skillDialog = true
      // 清空搜索
      this.skillFilter = ''
      if (this.skillData.length === 0) {
        setTimeout(() => {
          const skills = []
          this.getSkillData(skills)
        }, 100)
      } else {
        // 清空选中项
        this.$refs.skillTable.clearSelection()
        let skillSelected = []
        // 切换选中
        const parSkillId = this.addForm.parSkillId
        this.skillData.forEach(item => {
          for (let i = 0; i < parSkillId.length; i++) {
            if (parSkillId[i] === item.id) {
              skillSelected.push(item)
              break
            }
          }
        })
        skillSelected.forEach(item => {
          this.$refs.skillTable.toggleRowSelection(item)
        })
        this.skillSelected = skillSelected
      }
    },
    // 编辑
    comSkillClick () {
      this.skillDialog = true
      // 清空搜索
      this.skillFilter = ''
      if (this.skillData.length === 0) {
        setTimeout(() => {
          const parSkillId = this.comForm.parSkillId
          this.getSkillData(parSkillId)
        }, 100)
      } else {
        let skillSelected = []
        // 切换选中
        const parSkillId = this.comForm.parSkillId
        this.skillData.forEach(item => {
          for (let i = 0; i < parSkillId.length; i++) {
            if (parSkillId[i] === item.id) {
              skillSelected.push(item)
              break
            }
          }
        })
        // 清空选中项
        this.$refs.skillTable.clearSelection()
        skillSelected.forEach(item => {
          this.$refs.skillTable.toggleRowSelection(item)
        })
        this.skillSelected = skillSelected
      }
    },
    // 获取技能
    getSkillData (skills) {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selSkillTree',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.skillData = res.data.data1
          this.oskillData = res.data.data1
          // 清空选中项
          this.$refs.skillTable.clearSelection()
          // 切换选中
          let skillSelected = []
          this.skillData.forEach(item => {
            for (let i = 0; i < skills.length; i++) {
              if (skills[i] === item.id) {
                skillSelected.push(item)
                break
              }
            }
          })
          skillSelected.forEach(item => {
            this.$refs.skillTable.toggleRowSelection(item)
          })
          // 设置选择项
          this.skillSelected = skillSelected
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
    // 点击列表
    skillSelectChange (data) {
      this.skillSelected = data
    },
    // 确定
    selectSkill () {
      const skills = this.skillSelected
      let parSkillName = []
      let parSkillId = []
      let skillId = []
      skills.forEach(item => {
        parSkillName.push(item.name)
        parSkillId.push(item.id)
        skillId.push(item.children[0].id)
      })
      parSkillName = parSkillName.join('、')
      skillId = skillId.join(',')
      if (this.addDialog) {
        this.addForm.parSkillName = parSkillName
        this.addForm.parSkillId = parSkillId
        this.addForm.skillId = skillId
      } else if (this.comDialog) {
        this.comForm.parSkillName = parSkillName
        this.comForm.parSkillId = parSkillId
        this.comForm.skillId = skillId
      }
      this.skillDialog = false
    },
    /* 导入 */
    upClick () {
      this.upDialog = true
      let params = {
        state: 13,
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ogz_id: this.ogzId
      }
      params = this.$qs.stringify(params)
      const reqUrl = this.sysetApi() + '/upload?' + params
      this.reqUrl = reqUrl
      // 清空导入文件提示
      this.fileList = []
    },
    upFileSuccess (data) {
      if (data[0].msg === '0') {
        this.$message({
          showClose: true,
          message: '文件导入成功',
          type: 'success'
        })
        // 关闭导入框
        this.upDialog = false
        // 清空导入文件提示
        this.fileList = []
        // 刷新列表
        this.getListData()
      } else {
        this.$message({
          showClose: true,
          message: '文件导入失败，请稍后再试！',
          type: 'error'
        })
      }
    },
    upFileError () {
      this.$message({
        showClose: true,
        message: '文件导入失败，请稍后再试！',
        type: 'error'
      })
    },
    /* 下载 */
    // 下载模板
    downTemplate () {
      let params = {
        filename: 'UserModule.xls'
      }
      params = this.$qs.stringify(params)
      window.location.href = this.sysetApi() + '/download?filepath=/data/wx365/ExcelIn/&' + params
    },
    // 导出文件
    downFile () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ogz_id: this.ogzId,
        s_user_name: this.search.name,
        s_user_phone: this.search.phone,
        s_role_id: this.search.role
      }
      params = this.$qs.stringify(params)
      this.downDisabled = true
      setTimeout(() => {
        this.downDisabled = false
      }, 5000)
      window.location.href = this.sysetApi() + '/userEO?' + params
    }
  },
  watch: {
    ogzId (newVal, oldVal) {
      if (newVal) {
        this.opeUpDis = false
      } else {
        this.opeUpDis = true
      }
    },
    skillFilter (nowVal, oldVal) {
      this.skillData = this.oskillData.filter(item => (~item.name.indexOf(nowVal)))
    }
  }
}
</script>

<style lang="less" scoped>
.user{
  height: 100%;
  .el-container{
    height: 100%;
    .el-aside{
      padding-top: 20px;
      padding-right: 20px;
      border-right: 1px solid #d1d1d1;
    }
    .el-main{
      padding-right: 0;
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
  }
  .del-hint{
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    i{
      margin-right: 5px;
      font-size: 20px;
      color: #ffa800;
    }
  }
  .up-hint{
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: 14px;
    a{
      color: #33aefb;
    }
  }
}
</style>
