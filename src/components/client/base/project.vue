<template>
  <div class="project">
    <el-container>
      <el-aside width="280px">
        <el-tree :data="projectTree" ref="tree" :highlight-current="treeHighlight" default-expand-all node-key="id" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
      </el-aside>
      <el-main>
        <div class="content" ref="content">
          <div class="search">
            <div class="item">
              <span>项目名称</span>
              <el-input style="width: 160px;" v-model="nowSearch.project"></el-input>
            </div>
            <div class="item">
              <span>项目编码</span>
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
              <el-table-column prop="project_mark" label="编码"></el-table-column>
              <el-table-column label="项目名称">
                <template slot-scope="scope">
                  <a href="javascript:void(0);" class="details blue" @click="checkDetails(scope.row.project_id)">{{ scope.row.project_name }}</a>
                </template>
              </el-table-column>
              <el-table-column label="项目类型">
                <template slot-scope="scope">
                  <span v-if="scope.row.project_type === 0">住宅</span>
                  <span v-else-if="scope.row.project_type === 1">商场</span>
                  <span v-else-if="scope.row.project_type === 2">商住一体</span>
                  <span v-else-if="scope.row.project_type === 3">写字楼</span>
                  <span v-else-if="scope.row.project_type === 4">政府物业</span>
                  <span v-else-if="scope.row.project_type === 5">医院物业</span>
                  <span v-else-if="scope.row.project_type === 6">酒店</span>
                  <span v-else-if="scope.row.project_type === 7">园区</span>
                </template>
              </el-table-column>
              <el-table-column prop="project_area" label="地址"></el-table-column>
              <el-table-column prop="create_date" label="创建时间"></el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <i class="el-icon-edit" @click="comClick(scope.row.project_id)"></i>
                  <i class="el-icon-delete" @click="delClick(scope.row.project_id)"></i>
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
        <h5 class="title">新增项目</h5>
      </div>
      <div class="body-content">
        <el-form :model="addForm" :rules="rules" ref="ruleAddForm" :label-width="formLabelWidth">
          <el-form-item label="上级项目" prop="parent">
            <el-input :disabled="true" v-model="addForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="addForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目编码" prop="coding">
            <el-input v-model="addForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人" prop="crew">
            <el-select v-model="addForm.crew" filterable placeholder="请选择项目负责人">
              <el-option v-for="item in crewOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型" prop="type">
            <el-select v-model="addForm.type" placeholder="请选择项目类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目地址" prop="site">
            <el-input v-model="addForm.site"></el-input>
          </el-form-item>
          <el-form-item label="项目区域" prop="area">
            <el-cascader
              expand-trigger="hover"
              :options="areaData"
              :props="areaProps"
              v-model="addForm.area"
              @change="areaChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="项目坐标" prop="coord">
            <el-input :disabled="true" v-model="addForm.coord" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" :disabled="mapDisabled" @click="mapClick">选择坐标</el-button>
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
        <h5 class="title">项目详情</h5>
      </div>
      <div class="body-content">
        <el-form :label-width="formLabelWidth">
          <el-form-item label="上级项目">
            <el-input v-model="detForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="detForm.name"></el-input>
          </el-form-item>
          <el-form-item label="项目编码">
            <el-input v-model="detForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人">
            <el-input v-model="detForm.crew"></el-input>
          </el-form-item>
          <el-form-item label="项目类型">
            <el-input v-model="detForm.type"></el-input>
          </el-form-item>
          <el-form-item label="项目地址">
            <el-input v-model="detForm.site"></el-input>
          </el-form-item>
          <el-form-item label="项目区域">
            <el-input v-model="detForm.areaName"></el-input>
          </el-form-item>
          <el-form-item label="项目坐标">
            <el-input v-model="detForm.coord"></el-input>
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
        <h5 class="title">编辑项目</h5>
      </div>
      <div class="body-content">
        <el-form :model="comForm" :rules="rules" ref="ruleComForm" :label-width="formLabelWidth">
          <el-form-item label="上级项目" prop="parent">
            <el-input :disabled="true" v-model="comForm.parent"></el-input>
          </el-form-item>
          <el-form-item label="项目名称" prop="name">
            <el-input v-model="comForm.name" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="项目编码" prop="coding">
            <el-input :disabled="true" v-model="comForm.coding"></el-input>
          </el-form-item>
          <el-form-item label="项目负责人" prop="crew">
            <el-select v-model="comForm.crew" filterable placeholder="请选择项目负责人">
              <el-option v-for="item in crewOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目类型" prop="type">
            <el-select v-model="comForm.type" placeholder="请选择项目类型">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目地址" prop="site">
            <el-input v-model="comForm.site"></el-input>
          </el-form-item>
          <el-form-item label="项目区域" prop="area">
            <el-cascader
              expand-trigger="hover"
              :options="areaData"
              :props="areaProps"
              v-model="comForm.area"
              @change="areaChange">
            </el-cascader>
          </el-form-item>
          <el-form-item label="项目坐标" prop="coord">
            <el-input :disabled="true" v-model="comForm.coord" style="width: 60%; margin-right: 20px;"></el-input>
            <el-button type="primary" @click="mapClick">选择坐标</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetComForm('ruleComForm')">取 消</el-button>
        <el-button type="primary" :disabled="comDisabled" @click="submitComForm('ruleComForm')">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 地图 -->
    <el-dialog :title="companyName" :visible.sync="mapDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
      <div class="body-top">
        <h5 class="title">选择坐标</h5>
      </div>
      <div class="body-content">
        <el-input placeholder="请选取坐标" prefix-icon="el-icon-location-outline" v-model="mapCoord" :disabled="true" class="crew-search"></el-input>
        <div id="allmap" class="allmap"></div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mapDialog = false">取 消</el-button>
        <el-button type="primary" @click="selectCoord">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 删除 -->
    <el-dialog title="提示" :visible.sync="delDialog" width="26%" :show-close="false" :close-on-click-modal="false" custom-class="hint-dialog">
      <p class="del-hint"><i class="el-icon-warning"></i>是否要删除该项目？</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="delDialog = false">取 消</el-button>
        <el-button type="primary" :disabled="delDisabled" @click="submitDelForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BMap from 'BMap'
export default{
  props: ['parentClient'],
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
        callback(new Error('请输入项目编码'))
      }
    }
    return {
      companyName: this.parentClient.clientName,
      authority: {
        add: true,
        com: true,
        del: true
      },
      search: {
        project: '',
        coding: ''
      },
      nowSearch: {
        project: '',
        coding: ''
      },
      projectTree: [
        {
          'id': 0,
          'name': this.parentClient.clientName,
          'children': null
        }
      ],
      treeHighlight: true,
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      proName: '',
      proId: 0,
      tableData: [],
      total: 0,
      nowPage: 1,
      limit: 10,
      typeOptions: [
        {
          label: '住宅',
          value: 0
        },
        {
          label: '商场',
          value: 1
        },
        {
          label: '商住一体',
          value: 2
        },
        {
          label: '写字楼',
          value: 3
        },
        {
          label: '政府物业',
          value: 4
        },
        {
          label: '医院物业',
          value: 5
        },
        {
          label: '酒店',
          value: 6
        },
        {
          label: '园区',
          value: 7
        }
      ],
      addDialog: false,
      addForm: {
        parent: '',
        parentId: 0,
        name: '',
        coding: '',
        crew: '',
        type: '',
        site: '',
        area: [],
        areaName: '',
        cityId: '',
        coord: ''
      },
      mapDisabled: true,
      addDisabled: false,
      detDialog: false,
      detForm: {
        parent: '',
        name: '',
        coding: '',
        crew: '',
        type: '',
        site: '',
        areaName: '',
        coord: ''
      },
      comDialog: false,
      comForm: {
        parent: '',
        name: '',
        coding: '',
        crew: '',
        type: '',
        site: '',
        area: [],
        areaName: '',
        cityId: '',
        coord: ''
      },
      comDisabled: false,
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        coding: [
          { required: true, validator: checkCoding, trigger: 'blur' }
        ],
        crew: [
          { required: true, message: '请选择项目负责人', trigger: 'change' }
        ],
        type: [
          { required: true, message: '请选择项目类型', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择项目区域 ', trigger: 'change' }
        ],
        coord: [
          { required: true, message: '请选择项目坐标 ', trigger: 'change' }
        ]
      },
      formLabelWidth: '120px',
      crewOptions: [],
      areaData: [],
      areaProps: {
        children: 'cityList',
        label: 'province_name',
        value: 'province_id'
      },
      mapDialog: false,
      mapCoord: '',
      delDialog: false,
      delDisabled: false,
      itemId: ''
    }
  },
  created () {

  },
  mounted () {
    // 设置显示框高度
    const domHeight = this.$common.getDomClientSize().height
    const contentHeight = domHeight - 300
    this.$refs.content.style.height = contentHeight + 'px'
    // 获取项目树
    this.getProjectTree()
    // 获取列表
    this.getListData()
    // 获取人员列表
    this.getCrewList()
    // 获取地区数据
    this.getAreaData()
  },
  methods: {
    // 获取项目树
    getProjectTree () {
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
          const treeData = res.data.data1
          this.projectTree = [
            {
              'id': 0,
              'name': this.parentClient.clientName,
              'children': treeData
            }
          ]
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
    // 点击项目树
    handleNodeClick (data) {
      // 设置当前name和id
      this.proId = data.id
      if (data.id === 0) {
        this.proName = ''
      } else {
        this.proName = data.name
      }
      // 设置高亮
      this.treeHighlight = true
      // 清空搜索框
      this.search = {
        project: '',
        coding: ''
      }
      this.nowSearch = {
        project: '',
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
      this.proName = ''
      this.proId = 0
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
        project_name: this.proName,
        find_pro_id: this.proId,
        s_pro_name: this.search.project,
        s_pro_mark: this.search.coding,
        page: this.nowPage,
        limit1: this.limit
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selProjectChild',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.total = res.data.data1.total
          this.tableData = res.data.data1.pro
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
        parent: this.proName,
        parentId: this.proId,
        name: '',
        coding: '',
        crew: '',
        type: 0,
        site: '',
        area: [],
        areaName: '',
        cityId: '',
        coord: ''
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
        parent_pro_id: this.addForm.parentId,
        project_name: this.addForm.name,
        project_mark: this.addForm.coding,
        project_user: this.addForm.crew,
        project_type: this.addForm.type,
        project_address: this.addForm.site,
        project_area: this.addForm.areaName,
        city_id: this.addForm.cityId,
        coordinate: this.addForm.coord
      }
      params = this.$qs.stringify(params)
      this.addDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/addProject',
        data: params
      }).then((res) => {
        this.addDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetAddForm('ruleAddForm')
          // 刷新树
          this.getProjectTree()
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
        projectN_id: id
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selProjectByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          let typeValue = itemData.project_type
          const typeItem = this.typeOptions.find((item) => {
            return item.value === typeValue
          })
          const typeLabel = typeItem.label
          this.detForm = {
            parent: itemData.parent_pro_name,
            name: itemData.project_name,
            coding: itemData.project_mark,
            crew: itemData.project_user_name,
            type: typeLabel,
            site: itemData.project_address,
            areaName: itemData.project_area,
            coord: itemData.coordinate
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
        parent: '',
        name: '',
        coding: '',
        crew: '',
        type: '',
        site: '',
        area: [],
        areaName: '',
        cityId: '',
        coord: ''
      }
      this.getComItem()
    },
    getComItem () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        projectN_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/selProjectByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 项目区域
          const areaName = itemData.project_area
          const provinceName = this.getProvince(areaName)
          let provinceItem = this.areaData.find((item) => {
            return item.province_name === provinceName
          })
          const provinceId = provinceItem.province_id
          const cityId = itemData.city_id
          this.comForm = {
            parent: itemData.parent_pro_name,
            name: itemData.project_name,
            coding: itemData.project_mark,
            crew: parseInt(itemData.project_user),
            type: itemData.project_type,
            site: itemData.project_address,
            area: [provinceId, cityId],
            areaName: areaName,
            cityId: cityId,
            coord: itemData.coordinate
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
        alt_pro_id: this.itemId,
        project_name: this.comForm.name,
        project_mark: this.comForm.coding,
        project_user: this.comForm.crew,
        project_type: this.comForm.type,
        project_address: this.comForm.site,
        project_area: this.comForm.areaName,
        city_id: this.comForm.cityId,
        coordinate: this.comForm.coord
      }
      params = this.$qs.stringify(params)
      this.comDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/alterProject',
        data: params
      }).then((res) => {
        this.comDisabled = false
        if (res.data.result === 'Sucess') {
          // 重置表单
          this.resetComForm('ruleComForm')
          // 刷新树
          this.getProjectTree()
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
    // 获取省
    getProvince (area) {
      let length = 0
      if (area.indexOf('省') > 0) {
        length = area.indexOf('省') + 1
        return area.substr(0, length)
      } else if (area.indexOf('区') > 0) {
        length = area.indexOf('区') + 1
        return area.substr(0, length)
      } else {
        length = area.indexOf('市') + 1
        return area.substr(0, length)
      }
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
        del_pro_id: this.itemId
      }
      params = this.$qs.stringify(params)
      this.delDisabled = true
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/delProject',
        data: params
      }).then((res) => {
        this.delDisabled = false
        if (res.data.result === 'Sucess') {
          // 隐藏提示框
          this.delDialog = false
          // 刷新树
          this.getProjectTree()
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
        company_id: this.parentClient.clientId,
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
        url: this.sysetApi() + '/selUser',
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
    },
    /* 选择区域 */
    getAreaData () {
      this.$axios({
        method: 'post',
        url: this.sysetApi() + '/v2.1/pc/sel/selProvinceAndCityAll'
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          let areaData = res.data.data1.provinceList
          areaData.forEach(parItem => {
            parItem.cityList.forEach(cliItem => {
              cliItem.province_name = cliItem.city_name
              cliItem.province_id = cliItem.city_id
            })
          })
          this.areaData = areaData
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
    areaChange (data) {
      let provinceItem = this.areaData.find((item) => {
        return item.province_id === data[0]
      })
      const provinceName = provinceItem.province_name
      let cityItem = provinceItem.cityList.find((item) => {
        return item.province_id === data[1]
      })
      const cityName = cityItem.province_name
      let areaName = ''
      if (provinceName === cityName) {
        areaName = provinceName
      } else {
        areaName = provinceName + cityName
      }
      if (this.addDialog) {
        this.addForm.areaName = areaName
        this.addForm.cityId = data[1]
        this.addForm.coord = ''
      } else if (this.comDialog) {
        this.comForm.areaName = areaName
        this.comForm.cityId = data[1]
        this.comForm.coord = ''
      }
    },
    /* 坐标 */
    mapClick () {
      this.mapDialog = true
      // 清空坐标
      this.mapCoord = ''
      // 调用地图
      setTimeout(() => {
        let areaName = ''
        if (this.addDialog) {
          areaName = this.addForm.areaName
        } else if (this.comDialog) {
          areaName = this.comForm.areaName
        }
        this.showMap(areaName)
      }, 100)
    },
    showMap (area) {
      let _this = this
      let nowArea = area || '广东省深圳市'
      // 创建Map地图实例
      let map = new BMap.Map('allmap', {enableMapClick: false})
      // 设置地图级别（1-18）
      map.centerAndZoom(nowArea, 12)
      // 开启滚轮缩放地图
      map.enableScrollWheelZoom()
      // click--点击事件获取经纬度
      map.addEventListener('click', function (e) {
        let coordCode = e.point.lng + ', ' + e.point.lat
        _this.mapCoord = coordCode
      })
    },
    selectCoord () {
      if (this.addDialog) {
        this.addForm.coord = this.mapCoord
      } else if (this.comDialog) {
        this.comForm.coord = this.mapCoord
      }
      this.mapDialog = false
    }
  },
  watch: {
    'addForm.area' (newVal, oldVal) {
      if (newVal.length > 0) {
        this.mapDisabled = false
      } else {
        this.mapDisabled = true
      }
    }
  }
}
</script>

<style lang="less" scoped>
.project{
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
  .my-dialog{
    .crew-search{
      width: 40%;
      margin-bottom: 10px;
    }
    .allmap{
      width: 100%;
      height: 420px;
      border: 1px solid #ccc;
      overflow: hidden;
    }
  }
}
</style>
