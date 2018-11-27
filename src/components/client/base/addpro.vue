<template>
  <div class="addpro">
    <el-form :model="parentAddpro" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="parentAddpro.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="项目编码" prop="coding">
        <el-input v-model="parentAddpro.coding"></el-input>
      </el-form-item>
      <el-form-item label="项目类型" prop="type">
        <el-select v-model="parentAddpro.type" placeholder="请选择项目类型">
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目地址" prop="site">
        <el-input v-model="parentAddpro.site"></el-input>
      </el-form-item>
      <el-form-item label="项目区域" prop="area">
        <el-cascader
          expand-trigger="hover"
          :options="areaOptions"
          :props="areaProps"
          v-model="parentAddpro.area"
          @change="areaChange">
        </el-cascader>
      </el-form-item>
      <el-form-item label="项目坐标" prop="coord">
        <el-input :disabled="true" v-model="parentAddpro.coord" style="width: 60%; margin-right: 20px;"></el-input>
        <el-button type="primary" :disabled="mapDisabled" @click="mapClick">选择坐标</el-button>
      </el-form-item>
    </el-form>
    <div class="operate">
      <el-button type="primary" @click="backClick">上一步</el-button>
      <el-button type="primary" :disabled="parentBtnState" @click="submitForm('ruleForm')">保存</el-button>
      <router-link tag="el-button" :to="{ name: 'clibasic' }">取 消</router-link>
    </div>
    <!-- 地图 -->
    <el-dialog :title="parentAddpro.clientName" :visible.sync="mapDialog" :show-close="false" :close-on-click-modal="false" custom-class="my-dialog">
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
  </div>
</template>

<script>
import BMap from 'BMap'
export default{
  props: ['parentAddpro', 'parentBtnState'],
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
      areaOptions: [],
      areaProps: {
        children: 'cityList',
        label: 'province_name',
        value: 'province_id'
      },
      formLabelWidth: '100px',
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
      mapDisabled: true,
      mapDialog: false,
      mapCoord: ''
    }
  },
  created () {
    // 项目区域
    this.getAreaData()
  },
  methods: {
    /* 上一步 */
    backClick () {
      this.$emit('parentActiveFun', 1)
    },
    /* 下一步 */
    // 验证表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendAddpro()
        } else {
          return false
        }
      })
    },
    sendAddpro () {
      this.$emit('parentSaveFun', this.parentAddpro)
    },
    /* 项目区域 */
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
      this.parentAddpro.areaName = areaName
      this.parentAddpro.cityId = data[1]
      this.parentAddpro.coord = ''
    },
    /* 坐标 */
    mapClick () {
      this.mapDialog = true
      // 清空坐标
      this.mapCoord = ''
      // 调用地图
      setTimeout(() => {
        let areaName = this.parentAddpro.areaName
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
      this.parentAddpro.coord = this.mapCoord
      this.mapDialog = false
    }
  },
  watch: {
    'parentAddpro.area' (newVal, oldVal) {
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
.addpro{
  width: 560px;
  margin: 0 auto;
  .operate{
    padding-top: 20px;
    text-align: center;
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
