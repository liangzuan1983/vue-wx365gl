import Vue from 'vue'
import Router from 'vue-router'

/* 登录 */
import Login from '@/components/login'
// 密码登录
import Cipher from '@/components/login/cipher'
// 验证码登录
import Authcode from '@/components/login/authcode'

/* 主页面 */
// 首页
import Home from '@/components/home'
// 消息
import Message from '@/components/head/message'

// 系统管理
// 组织结构管理
import Firm from '@/components/system/firm'
// 角色管理
import Role from '@/components/system/role'
// 用户管理
import User from '@/components/system/user'
// 日志管理
import Log from '@/components/system/log'
// 技能树维护
import Skill from '@/components/system/basic/skill'
// 巡检标准维护
import Norm from '@/components/system/basic/norm'
// 知识库维护
import Knowledge from '@/components/system/basic/knowledge'
// 模块管理
import Chunk from '@/components/system/chunk'

// 企业管理
// 企业信息
import Clibasic from '@/components/client/clibasic'
import ClientAdd from '@/components/client/base/client-add'
import ClientCom from '@/components/client/base/client-com'
// 基本信息
import CliBaseinfo from '@/components/client/base/baseinfo'
// 组织管理
import CliFirm from '@/components/client/base/firm'
// 项目管理
import CliProject from '@/components/client/base/project'
// 角色管理
import CliRole from '@/components/client/base/role'
// 用户管理
import CliUser from '@/components/client/base/user'

// 项目分布
import Clipro from '@/components/client/clipro'
// 人员信息
import Clicrew from '@/components/client/clicrew'
// 设备信息
import Clifac from '@/components/client/clifac'
// 巡检信息
import Clipol from '@/components/client/clipol'
// 工单信息
import Cliwork from '@/components/client/cliwork'
// 考勤信息
import Clisal from '@/components/client/clisal'
// 能耗信息
import Clitce from '@/components/client/clitce'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'link-active',
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
      children: [
        {
          path: 'cipher',
          name: 'cipher',
          component: Cipher
        },
        {
          path: 'authcode',
          name: 'authcode',
          component: Authcode
        }
      ]
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: 'message',
          name: 'message',
          component: Message
        },
        {
          path: 'firm',
          name: 'firm',
          component: Firm
        },
        {
          path: 'role',
          name: 'role',
          component: Role
        },
        {
          path: 'user',
          name: 'user',
          component: User
        },
        {
          path: 'log',
          name: 'log',
          component: Log
        },
        {
          path: 'skill',
          name: 'skill',
          component: Skill
        },
        {
          path: 'norm',
          name: 'norm',
          component: Norm
        },
        {
          path: 'knowledge',
          name: 'knowledge',
          component: Knowledge
        },
        {
          path: 'chunk',
          name: 'chunk',
          component: Chunk
        },
        {
          path: 'clibasic',
          name: 'clibasic',
          component: Clibasic
        },
        {
          path: 'client-add',
          name: 'clientAdd',
          component: ClientAdd
        },
        {
          path: 'client-com',
          name: 'clientCom',
          component: ClientCom,
          children: [
            {
              path: 'baseinfo',
              name: 'cliBaseinfo',
              component: CliBaseinfo
            },
            {
              path: 'firm',
              name: 'cliFirm',
              component: CliFirm
            },
            {
              path: 'project',
              name: 'cliProject',
              component: CliProject
            },
            {
              path: 'role',
              name: 'cliRole',
              component: CliRole
            },
            {
              path: 'user',
              name: 'cliUser',
              component: CliUser
            }
          ]
        },
        {
          path: 'clipro',
          name: 'clipro',
          component: Clipro
        },
        {
          path: 'clicrew',
          name: 'clicrew',
          component: Clicrew
        },
        {
          path: 'clifac',
          name: 'clifac',
          component: Clifac
        },
        {
          path: 'clipol',
          name: 'clipol',
          component: Clipol
        },
        {
          path: 'cliwork',
          name: 'cliwork',
          component: Cliwork
        },
        {
          path: 'clisal',
          name: 'clisal',
          component: Clisal
        },
        {
          path: 'clitce',
          name: 'clitce',
          component: Clitce
        }
      ]
    }
  ]
})
