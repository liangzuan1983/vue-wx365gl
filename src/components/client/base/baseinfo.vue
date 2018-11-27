<template>
  <div class="baseinfo">
    <div class="baseinfo-in">
      <el-form :model="baseForm" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
        <el-form-item label="企业名称" prop="name">
          <el-input v-model="baseForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系人" prop="userId">
          <el-select v-model="baseForm.userId" filterable placeholder="请选择联系人" @change="linkChange">
            <el-option v-for="item in linkmanOptions" :key="item.user_id" :label="item.user_name" :value="item.user_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业性质" prop="nature">
          <el-select v-model="baseForm.nature" placeholder="请选择企业性质">
            <el-option
              v-for="item in natureOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="行政区域" prop="area">
          <el-cascader
            expand-trigger="hover"
            :options="areaOptions"
            :props="areaProps"
            v-model="baseForm.area"
            @change="areaChange">
          </el-cascader>
        </el-form-item>
        <el-form-item label="所属行业" prop="trade">
          <el-select v-model="baseForm.trade" placeholder="请选择所属行业">
            <el-option
              v-for="item in tradeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业规模" prop="scale">
          <el-select v-model="baseForm.scale" placeholder="请选择企业规模">
            <el-option
              v-for="item in scaleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="state">
          <el-radio-group v-model="baseForm.state">
            <el-radio label="正常"></el-radio>
            <el-radio label="冻结"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div class="operate">
        <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
        <router-link tag="el-button" :to="{ name: 'clibasic' }">取 消</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  props: ['parentClient'],
  data () {
    return {
      linkmanOptions: [],
      natureOptions: [
        {
          value: '民营企业',
          label: '民营企业'
        },
        {
          value: '国有企业',
          label: '国有企业'
        },
        {
          value: '合资企业',
          label: '合资企业'
        }
      ],
      areaOptions: [],
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
      formLabelWidth: '100px',
      baseForm: {
        name: '',
        linkman: '',
        userId: '',
        userName: '',
        userPhone: '',
        nature: '',
        area: [],
        areaName: '',
        cityId: '',
        trade: '',
        scale: '',
        state: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        userId: [
          { required: true, message: '请选择联系人', trigger: 'change' }
        ],
        nature: [
          { required: true, message: '请选择企业性质', trigger: 'change' }
        ],
        area: [
          { required: true, message: '请选择行政区域', trigger: 'change' }
        ],
        trade: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        scale: [
          { required: true, message: '请选择企业规模', trigger: 'change' }
        ],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      areaProps: {
        children: 'cityList',
        label: 'province_name',
        value: 'province_id'
      }
    }
  },
  created () {

  },
  mounted () {
    // 获取联系人
    this.getLinkmanData()
    // 获取行政区域
    this.getAreaData()
  },
  methods: {
    // 获取详情
    getClientDetails () {
      let params = {
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        companyN_id: this.parentClient.clientId
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selComByID',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          const itemData = res.data.data1
          // 行政区域
          const areaName = itemData.area
          const provinceName = this.getProvince(areaName)
          let provinceItem = this.areaOptions.find((item) => {
            return item.province_name === provinceName
          })
          const provinceId = provinceItem.province_id
          const cityId = itemData.city_id
          this.baseForm = {
            name: itemData.company_name,
            userId: itemData.user,
            userName: itemData.user_name,
            userPhone: itemData.phone,
            linkman: itemData.user,
            nature: itemData.nature,
            area: [provinceId, cityId],
            areaName: areaName,
            cityId: cityId,
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
    // 验证表单
    submitForm (formName) {
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
        company_id: sessionStorage.getItem('wxAdmFirmId'),
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        companyN_id: this.parentClient.clientId,
        company_name: this.baseForm.name,
        userN_id: this.baseForm.userId,
        user_name: this.baseForm.userName,
        user_phone: this.baseForm.userPhone,
        nature: this.baseForm.nature,
        area: this.baseForm.areaName,
        city_id: this.baseForm.cityId,
        industry: this.baseForm.trade,
        size: this.baseForm.scale,
        com_state: this.baseForm.state
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/alterCompany',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.$message({
            showClose: true,
            message: '企业基本信息修改成功！',
            type: 'success'
          })
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
    /* 联系人 */
    getLinkmanData () {
      let params = {
        company_id: this.parentClient.clientId,
        user_id: sessionStorage.getItem('wxAdmUserId'),
        project_id: 0,
        ogz_id: 0,
        s_user_name: '',
        s_user_phone: '',
        s_role_id: '',
        page: 1,
        limit1: 10000
      }
      params = this.$qs.stringify(params)
      this.$axios({
        method: 'post',
        url: this.bmApi() + '/selUser',
        data: params
      }).then((res) => {
        if (res.data.result === 'Sucess') {
          this.linkmanOptions = res.data.data1.users
        } else {
          // const errHint = this.$common.errorCodeHint(res.data.error_code)
          // this.$message({
          //   showClose: true,
          //   message: errHint,
          //   type: 'error'
          // })
        }
      }).catch(() => {
        this.$message({
          showClose: true,
          message: '服务器连接失败！',
          type: 'error'
        })
      })
    },
    // 选择联系人
    linkChange (id) {
      const linkmanOptions = this.linkmanOptions
      if (linkmanOptions === 0) {
        return
      }
      const userItem = this.linkmanOptions.find(item => {
        return item.user_id === id
      })
      const userId = userItem.user_id
      const userName = userItem.user_name
      const userPhone = userItem.user_phone
      this.baseForm.userId = userId
      this.baseForm.userName = userName
      this.baseForm.userPhone = userPhone
    },
    /* 行政区域 */
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
          this.areaOptions = areaData
          // 获取详情
          this.getClientDetails()
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
      let provinceItem = this.areaOptions.find((item) => {
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
      this.baseForm.areaName = areaName
      this.baseForm.cityId = data[1]
    }
  }
}
</script>

<style lang="less" scoped>
.baseinfo{
  padding: 20px;
  background: #d1d1d1;
  .baseinfo-in{
    width: 560px;
    margin: 0 auto;
    .operate{
      padding-top: 20px;
      text-align: center;
    }
  }
}
</style>
