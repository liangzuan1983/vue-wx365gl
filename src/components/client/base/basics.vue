<template>
  <div class="basics">
    <el-form :model="parentBasics" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="企业名称" prop="name">
        <el-input v-model="parentBasics.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="linkman">
        <el-input v-model="parentBasics.linkman" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="parentBasics.phone" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="企业性质" prop="nature">
        <el-select v-model="parentBasics.nature" placeholder="请选择企业性质">
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
          v-model="parentBasics.area"
          @change="areaChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="所属行业" prop="trade">
        <el-select v-model="parentBasics.trade" placeholder="请选择所属行业">
          <el-option
            v-for="item in tradeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="企业规模" prop="scale">
        <el-select v-model="parentBasics.scale" placeholder="请选择企业规模">
          <el-option
            v-for="item in scaleOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="state">
        <el-radio-group v-model="parentBasics.state">
          <el-radio label="正常"></el-radio>
          <el-radio label="冻结"></el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <div class="operate">
      <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
      <router-link tag="el-button" :to="{ name: 'clibasic' }">取 消</router-link>
    </div>
  </div>
</template>

<script>
export default{
  props: ['parentBasics'],
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
      rules: {
        name: [
          { required: true, message: '请输入企业名称', trigger: 'blur' }
        ],
        linkman: [
          { required: true, message: '请输入联系人', trigger: 'blur' }
        ],
        phone: [
          { required: true, validator: checkPhone, trigger: 'blur' }
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
    // 获取行政区域
    this.getAreaData()
  },
  methods: {
    // 验证表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendBasics()
        } else {
          return false
        }
      })
    },
    sendBasics () {
      this.$emit('parentBasicsFun', this.parentBasics)
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
      this.parentBasics.areaName = areaName
      this.parentBasics.cityId = data[1]
    }
  }
}
</script>

<style lang="less" scoped>
.basics{
  width: 560px;
  margin: 0 auto;
  .operate{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
