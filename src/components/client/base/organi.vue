<template>
  <div class="organi">
    <el-form :model="parentOrgani" :rules="rules" ref="ruleForm" :label-width="formLabelWidth">
      <el-form-item label="上级机构" prop="parent">
        <el-input :disabled="true" v-model="parentOrgani.parent"></el-input>
      </el-form-item>
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="parentOrgani.name" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item label="机构编码" prop="coding">
        <el-input v-model="parentOrgani.coding"></el-input>
      </el-form-item>
      <el-form-item label="机构电话" prop="plane">
        <el-input v-model="parentOrgani.plane" style="width: 60%; margin-right: 20px;"></el-input>
        <span class="red">示例：0755-61218000</span>
      </el-form-item>
      <el-form-item label="机构地址" prop="site">
        <el-input v-model="parentOrgani.site"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" maxlength="100" placeholder="文本长度不得超过100个字符" v-model="parentOrgani.remark"></el-input>
      </el-form-item>
    </el-form>
    <div class="operate">
      <el-button type="primary" @click="backClick">上一步</el-button>
      <el-button type="primary" @click="submitForm('ruleForm')">下一步</el-button>
      <router-link tag="el-button" :to="{ name: 'clibasic' }">取 消</router-link>
    </div>
  </div>
</template>

<script>
export default{
  props: ['parentOrgani'],
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
        callback()
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
      formLabelWidth: '100px',
      rules: {
        name: [
          { required: true, message: '请输入机构名称', trigger: 'blur' }
        ],
        coding: [
          { validator: checkCoding, trigger: 'blur' }
        ],
        plane: [
          { required: true, validator: checkPlane, trigger: 'blur' }
        ]
      }
    }
  },
  created () {

  },
  methods: {
    /* 上一步 */
    backClick () {
      this.$emit('parentActiveFun', 0)
    },
    /* 下一步 */
    // 验证表单
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.sendOrgani()
        } else {
          return false
        }
      })
    },
    sendOrgani () {
      this.$emit('parentOrganiFun', this.parentOrgani)
    }
  }
}
</script>

<style lang="less" scoped>
.organi{
  width: 560px;
  margin: 0 auto;
  .operate{
    padding-top: 20px;
    text-align: center;
  }
}
</style>
