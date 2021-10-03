<template>
  <div>
    <!-- 用户列表导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20" type="flex" class="row-bg">
        <!-- 搜索框 -->
        <el-col :span="6">
          <el-input
            placeholder="请输入用户名"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList()"
            ></el-button> </el-input
        ></el-col>
        <!-- 增加用户按钮 -->
        <el-col :span="1">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加</el-button
          >
        </el-col>
      </el-row>
      <!-- 增加对话框 -->
      <el-dialog
        title="添加用户信息"
        :visible.sync="addDialogVisible"
        width="50%"
        close-on-press-escape
        @close="addClear()"
      >
        <!-- 增加对话框主体区域 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item prop="username" label="用户名">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 增加对话框处理足部 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editClear()"
      >
        <!-- 修改对话框主体区域 -->
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 修改对话框足部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->

      <el-dialog
        title="分配用户角色"
        :visible.sync="setRoleDialogVisible"
        @close="clearSelectId()"
        width="40%"
      >
        <p class="p_username">当前用户：{{ userInfo.username }}</p>
        <p class="p_rolename">当前角色：{{ userInfo.role_name }}</p>
        <p class="p_selectrole">
          <label>分配新角色：</label>
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>

        <span slot="footer" class="dialog-footer">
          <el-button @click="setRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveRoleInfo()">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 列表区域 -->
      <el-table
        :data="userList"
        stripe
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" type="index" width="60"> </el-table-column>
        <el-table-column prop="username" label="用户名" width="180">
        </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="mg_state" label="状态" width="150">
          <!-- 创建一个模板并给插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              active-color="#7CCD7C"
              inactive-color="#CFCFCF"
              @change="stateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <!-- 修改用户信息 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editUsers(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除用户信息 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delUsers(scope.row.id)"
              >删除</el-button
            >
            <el-tooltip
              class="item"
              effect="dark"
              content="分配角色权限"
              placement="top-start"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="small"
                @click="distributionRole(scope.row)"
                >分配</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 4, 6, 8]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    // 自定义邮箱的验证规则，正则表达式
    var checkEmail = (rule, value, cb) => {
      var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
      if (reg.test(value)) {
        cb();
      }
      cb(new Error("邮箱格式不对"));
    };
    // 自定义手机号的验证规则，正则表达式
    var checkPhone = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (reg.test(value)) {
        cb();
      }
      cb(new Error("手机号格式不对"));
    };
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 4,
      },
      //存放用户列表的
      userList: [],
      total: 0,
      userInfo: {},
      roleList: [],
      selectRoleId: "",
      //添加对话框
      addDialogVisible: false,
      // 修改对话框
      editDialogVisible: false,
      // 设置角色属性对话框
      setRoleDialogVisible: false,
      // 增加用户表单信息
      addForm: {
        username: "",
        email: "",
        password: "",
        mobile: "",
      },
      // 修改用户表单信息
      editForm: {},
      // 增加表单验证规则
      addFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "用户名在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "用户名在  到 10 个字符",
            trigger: "blur",
          },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
      // 修改表单校验对象
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入电话", trigger: "blur" },
          { validator: checkPhone, trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      //   console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败！");
      }
      // console.log(res.data);
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    //改变每页显示条目个数
    handleSizeChange(pagesize) {
      //   console.log(pagesize);
      this.queryInfo.pagesize = pagesize;
      this.getUserList();
    },
    //改变当前页数
    handleCurrentChange(pagenum) {
      //   console.log(pagenum);
      this.queryInfo.pagenum = pagenum;
      this.getUserList();
    },
    // 监听switch状态改变
    async stateChange(userInfo) {
      // console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state != userInfo.mg_state;
        this.$message.error("用户状态设置失败");
      }
      this.$message.success("用户状态改变成功");
    },
    // 增加表单验证规则
    addClear() {
      this.$refs.addFormRef.resetFields();
    },
    // 修改表单重置
    editClear() {
      this.$refs.editFormRef.resetFields();
    },
    // 发起添加用户请求
    addUserInfo() {
      // 验证成功函数是个布尔值
      this.$refs.addFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg + "," + "用户添加失败!");
        }
        this.$message.success("用户添加成功！");
        this.addDialogVisible = false;
        this.getUserList();
      });
    },
    // 修改用户信息
    async editUsers(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },
    //修改信息提交
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("用户信息修改失败！");
        }
        this.$message.success("用户信息修改成功！");
        this.editDialogVisible = false;
        this.getUserList();
      });
    },
    // 删除用户信息
    // async delUsers(id) {
    //   // console.log(id);
    //   const { data: res } = await this.$http.delete("users/" + id);
    //   console.log(res);
    //   if (res.meta.status !== 200) {
    //     return this.$message.error("删除用户信息失败！");
    //   }
    //   this.$message.success("用户信息删除成功！");
    //   this.getUserList();
    // },
    async delUsers(id) {
      const tipinfo = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (tipinfo !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("用户删除失败！");
      }
      this.$message.success("用户删除成功");
      this.getUserList();
    },
    // 获取角色权限列表
    async distributionRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200) {
        this.$message.error("获取角色列表失败！");
      }
      this.roleList = res.data;
      // console.log(this.roleList);
      this.setRoleDialogVisible = true;
    },
    // 提交新角色权限
    async saveRoleInfo() {
      // console.log(this.selectRoleId);
      if (!this.selectRoleId) {
        return this.$message.error("您未设置角色,请设置角色！");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("用户设置权限失败！");
      } else {
        this.$message.success("用户设置权限成功！");
        this.getUserList();
        this.setRoleDialogVisible = false;
      }
    },
    // 清除下拉选择框
    clearSelectId() {
      this.selectRoleId = "";
      this.userInfo = "";
    },
  },
};
</script>
<style lang="less" scoped>
/deep/ .el-breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  padding-left: 10px;
}
.box-card {
  font-size: 15px;
  box-shadow: 0 1px 1px;
}
/deep/ .el-card {
  position: relative;
  //   left: 10px;
  top: 15px;
}
// /deep/ .el-input__inner {

//   width: 90%;

// }
// /deep/ .el-card__body {
//   display: flex;
//   align-items: flex-start;
// }
.row-bg {
  justify-content: start;
}
.el-table {
  margin-top: 25px;
}
.el-pagination {
  margin-top: 25px;
  margin-bottom: 25px;
  float: right;
}
.p_username {
  margin-left: 20px;
  margin-bottom: 30px;
  font-size: 14px;
}
.p_rolename {
  margin-left: 20px;
  margin-bottom: 25px;
  font-size: 14px;
}
.p_selectrole {
  margin-left: 20px;
}
label {
  margin: 10px;
  margin-left: 0px;
  font-size: 14px;
}
</style>