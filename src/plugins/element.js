import Vue from 'vue'
// 按需求导入element-ui组件，并定义全局进行使用
import {
  Button
} from 'element-ui'
import {
  Form,
  FormItem
} from 'element-ui'
import {
  Input
} from 'element-ui'
import {
  Message
} from 'element-ui'
import {
  Card
} from 'element-ui'
import {
  Switch
} from 'element-ui'
import {
  tooltip
} from 'element-ui'
import {
  row,
  col
} from 'element-ui'
import {
  breadcrumb,
  breadcrumbItem
} from 'element-ui'
import {
  Table,
  TableColumn
} from 'element-ui'
import {
  menu,
  submenu,
  menuItem,
  menuItemGroup
} from 'element-ui'
import {
  container,
  header,
  aside,
  main,
  footer
} from 'element-ui'
import {
  pagination
} from 'element-ui'
import {
  dialog
} from 'element-ui'
// import {
//   MessageBox
// } from 'element-ui'
import {
  tag,tree,select,Option,Cascader,alert,tabs,tabPane,step,steps,CheckboxGroup,checkbox,upload
} from 'element-ui'





Vue.use(Button)
Vue.use(upload)
Vue.use(CheckboxGroup)
Vue.use(checkbox)
Vue.use(step)
Vue.use(steps)
Vue.use(tabs)
Vue.use(tabPane)
Vue.use(alert)
Vue.use(Cascader)
Vue.use(tree)
Vue.use(Option)
Vue.use(select)
Vue.use(dialog)
Vue.use(pagination)
Vue.use(Form)
Vue.use(tooltip)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(container)
Vue.use(header)
Vue.use(aside)
Vue.use(main)
Vue.use(footer)
Vue.use(menu)
Vue.use(submenu)
Vue.use(menuItem)
Vue.use(menuItemGroup)
Vue.use(breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(Card)
Vue.use(row)
Vue.use(col)
Vue.use(Switch)
Vue.use(tag)


// 弹框组件挂载到全局，this.$message就可以使用

Vue.prototype.$message = Message
