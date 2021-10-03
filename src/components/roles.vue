<template>
  <div>
    <!-- 权限列表导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 添加角色行 -->
      <el-row>
        <el-col
          ><el-button type="primary" @click="addDialogVisible = true"
            >添加角色</el-button
          ></el-col
        >
      </el-row>
      <!-- 角色列表区域 -->
      <el-table :data="rolesList" stripe border highlight-current-row>
        <el-table-column type="expand" width="60">
          <template slot-scope="scope">
            <el-row
              class="bdbottom vcenter"
              v-for="item1 in scope.row.children"
              :key="item1.id"
            >
              <!-- {{ item1.authName }} -->
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightsId(scope.row, item1.id)">{{
                  item1.authName
                }}</el-tag>
                <i class="el-icon-arrow-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  v-for="item2 in item1.children"
                  :key="item2.id"
                  class="vcenter"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRightsId(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="removeRightsId(scope.row, item3.id)"
                      >{{ item3.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre> {{ scope.row }}</pre> -->
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="70"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称" width="300">
        </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <!-- 编辑角色权限 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editRoles(scope.row.id)"
              >编辑</el-button
            >
            <!-- 删除角色权限 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="small"
              @click="delRoles(scope.row.id)"
              >删除</el-button
            >
            <!-- 分配角色权限 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配权限"
              placement="top-start"
            >
              <el-button
                type="warning"
                size="small"
                icon="el-icon-setting"
                @click="setRights(scope.row)"
                >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 添加角色对话框 -->
    <el-dialog
      title="添加角色信息"
      :visible.sync="addDialogVisible"
      width="50%"
      close-on-press-escape
      @close="addClear()"
    >
      <!-- 增加对话框主体区域 -->
      <el-form
        :model="addRolesForm"
        :rules="addRolesRules"
        ref="addRolesRef"
        label-width="100px"
      >
        <el-form-item prop="roleName" label="角色名称">
          <el-input v-model="addRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 增加对话框处理足部 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改角色信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClear()"
    >
      <!-- 修改对话框主体区域 -->
      <el-form
        :model="editRolesForm"
        :rules="editRolesRules"
        ref="editRolesRef"
        label-width="80px"
      >
        <el-form-item label="角色ID" prop="roleId">
          <el-input v-model="editRolesForm.roleId" disabled></el-input>
        </el-form-item>
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editRolesForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editRolesForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 修改对话框足部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ediRoleInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="角色权限列表"
      :visible.sync="setRightsdialogVisible"
      width="50%"
      @close="setRightsClear()"
    >
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultkey"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRightsTree()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 角色列表
      rolesList: [],
      // 权限列表
      rightsList: [],
      // 保存角色ID
      roleId: "",
      addRolesForm: {
        roleName: "",
        roleDesc: "",
      },
      // 默认勾选功能
      defaultkey: [],
      // 树形组件接收
      treeProps: {
        label: "authName",
        children: "children",
      },

      editRolesForm: {},
      addDialogVisible: false,
      editDialogVisible: false,
      setRightsdialogVisible: false,
      // 增加表单验证
      addRolesRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "用户名在 2 到 5 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "用户名在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 修改表单验证
      editRolesRules: {
        roleName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 2,
            max: 5,
            message: "用户名在 2 到 5 个字符",
            trigger: "blur",
          },
        ],
        roleDesc: [
          { required: true, message: "请输入角色", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "用户名在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    //   获取角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      //   console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      }
      this.rolesList = res.data;
    },
    // 清除添加角色的文本框
    addClear() {
      this.$refs.addRolesRef.resetFields();
    },
    // 发起添加用户请求
    addRoleInfo() {
      // 验证成功函数是个布尔值
      this.$refs.addRolesRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.post("roles", this.addRolesForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("用户添加失败！");
        }
        this.$message.success("用户添加成功！");
        this.addDialogVisible = false;
        this.getRolesList();
      });
    },
    // 查询修改用户信息
    async editRoles(id) {
      const { data: res } = await this.$http.get("roles/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editRolesForm = res.data;
      this.editDialogVisible = true;
      // console.log(this.editForm);
    },
    // 清除修改角色的文本框
    editClear() {
      this.$refs.editRolesRef.resetFields();
    },
    //修改角色信息提交
    ediRoleInfo() {
      this.$refs.editRolesRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "roles/" + this.editRolesForm.roleId,
          {
            roleName: this.editRolesForm.roleName,
            roleDesc: this.editRolesForm.roleDesc,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("角色信息修改失败！");
        }
        this.$message.success("角色信息修改成功！");
        this.editDialogVisible = false;
        this.getRolesList();
      });
    },
    // 删除角色信息
    async delRoles(id) {
      // 将操作结果primise对象简化保存在res中
      const tipinfo = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      // console.log(res);
      if (tipinfo == "confirm") {
        const { data: res } = await this.$http.delete("roles/" + id);
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("角色删除失败！");
        } else {
          this.$message.success("角色删除成功！");
          this.getRolesList();
        }
      }
    },
    // 查询权限列表树
    async setRights(role) {
      this.roleId = role.id;
      // console.log(this.roleId);
      const { data: res } = await this.$http.get("rights/tree");

      if (res.meta.status !== 200) {
        return this.$message.error("获取权限数据列表失败！");
      }
      this.rightsList = res.data;
      // console.log(this.rightsList);
      //调用role给递归函数数组
      this.getReafNode(role, this.defaultkey);
      // console.log(this.defaultkey);
      this.setRightsdialogVisible = true;
    },
    //删除权限ID
    async removeRightsId(role, rightId) {
      const tipinfo = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除",
        });
      });
      if (tipinfo == "confirm") {
        const { data: res } = await this.$http.delete(
          `roles/${role.id}/rights/${rightId}`
        );
        if (res.meta.status !== 200) {
          return this.$message.error("删除权限失败！");
        } else {
          this.$message.success("删除权限成功！");
          // 不用重新渲染页面
          role.children = res.data;
        }
      }
    },
    // 递归获取默认节点
    getReafNode(node, arr) {
      // 如果没有children则是三级节点函数
      if (!node.children) {
        return arr.push(node.id);
      }
      // 如果不是三级节点函数，那么需要把每个节点加入
      node.children.forEach((item) => {
        this.getReafNode(item, arr);
      });
    },
    // 清空树形节点数组
    setRightsClear() {
      this.defaultkey = [];
    },
    // 分配权限节点
    async setRightsTree() {
      const keys = [
        // 返回目前被选中的节点所组成的数组
        ...this.$refs.treeRef.getCheckedKeys(),
        // 返回目前半选中的节点所组成的数组
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ];

      const idStr = keys.join(",");
      // console.log(idStr);
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: idStr,
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("分配权限失败！");
      } else {
        this.$message.success("分配权限成功！");
        this.getRolesList();
        this.setRightsdialogVisible = false;
      }
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
/deep/ .el-table {
  margin-top: 25px;
  width: 100%;
}

.bdbottom {
  border-bottom: 1px solid #eee;
}
.el-tag {
  margin: 15px;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>