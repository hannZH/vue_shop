<template>
  <div>
    <!-- 商品参数导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片展示区域 -->
    <el-card>
      <!-- 参数设置警告提示 -->
      <el-alert
        title="只允许为第三级分类设置分类参数"
        type="warning"
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 分类参数导航栏 -->
      <div class="search_nav">
        <el-tag class="tip_tag" type="info">选择商品分类：</el-tag>
        <el-cascader
          :options="paramsList"
          v-model="selectKeys"
          :props="cateProps"
          @change="handlechange()"
          clearable
        ></el-cascader>
      </div>
      <el-tabs v-model="activeName" @tab-click="changeState()">
        <!-- 动态参数面包屑 -->
        <el-tab-pane label="动态参数" name="many"
          ><el-button
            class="addButton"
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="manyTableList" stripe border highlight-current-row>
            <el-table-column type="expand" width="70">
              <!-- 参数展开标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="70">
            </el-table-column>
            <el-table-column prop="attr_name" label="参数名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 静态参数面包屑 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button
            class="addButton"
            type="primary"
            size="small"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加属性
          </el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableList" stripe border highlight-current-row>
            <el-table-column type="expand" width="70">
              <!-- 参数展开标签 -->
              <template slot-scope="scope">
                <el-tag
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  closable
                  @close="handleClose(index, scope.row)"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column label="#" type="index" width="70">
            </el-table-column>
            <el-table-column prop="attr_name" label="属性名称">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="el-icon-edit"
                  @click="editParams(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  size="small"
                  icon="el-icon-delete"
                  @click="delParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="titileAddName"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="clear()"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        label-width="80px"
        :rules="addFormRules"
      >
        <el-form-item :label="titileName" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="titileEditName"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClear()"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="80px"
        :rules="editFormRules"
      >
        <el-form-item :label="titileName" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamsInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 级联选择器绑定参数
      paramsList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      selectKeys: [],
      // 面包屑的绑定名字
      activeName: "many",
      // 动态参数表格
      manyTableList: [],
      // 静态参数表格
      onlyTableList: [],
      addDialogVisible: false,
      editDialogVisible: false,
      // // 存放新增标签
      // inputVisible: false,
      // // 存放新增标签值
      // inputValue: "",
      addForm: {
        attr_name: "",
      },
      editForm: {},
      // 添加表单校验对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      // 修改表单校验对象
      editFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    // 获得三级标签列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("商品参数列表获取失败！");
      }
      // this.$message.success("商品参数列表获取成功！");
      this.paramsList = res.data;
      // console.log(this.paramsList);
    },
    handlechange() {
      if (this.selectKeys.length !== 3) {
        this.manyTableList = [];
        this.onlyTableList = [];
        this.selectKeys = [];
      }
      this.getParamsData();
    },
    // 获取参数列表
    async getParamsData() {
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error(
          "动态参数列表获取失败，请选择商品三级分类！"
        );
      }
      // 切割数组渲染出来多级标签
      res.data.forEach((item) => {
        if (item.attr_vals == "") {
          item.inputVisible = false;
          item.inputValue = "";
          item.attr_vals = [];
          return;
        }
        item.attr_vals = item.attr_vals.split(" ");
        item.inputVisible = false;
        item.inputValue = "";

        // console.log(res.data);
      });
      // console.log(res.data.attr_vals);
      // 判断渲染哪个表格页面数据

      if (this.activeName == "many") {
        this.manyTableList = res.data;
        // console.log(this.manyTableList);
      } else if (this.activeName == "only") {
        this.onlyTableList = res.data;
        // console.log(this.onlyTableList);
      }
    },
    // 改变标签页名字
    changeState() {
      // console.log(this.activeName);
      this.getParamsData();
    },
    //清除添加表单事件
    clear() {
      this.$refs.addFormRef.resetFields();
    },
    //清除编辑表单事件
    editClear() {
      this.$refs.editFormRef.resetFields();
    },
    // 添加参数或者属性
    addParams() {
      this.$refs.addFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg + "," + "添加失败!");
        }
        this.$message.success("添加成功！");
        this.addDialogVisible = false;
        this.getParamsData();
      });
    },
    // 编辑查询参数信息
    async editParams(id) {
      // console.log(id);
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${id}`,
        {
          attr_sel: this.activeName,
        }
      );
      if (res.meta.status !== 200) {
        return this.$message.error("查询参数信息失败！");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 编辑提交参数信息
    editParamsInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("参数修改失败！");
        }
        this.$message.success("参数修改成功！");
        this.editDialogVisible = false;
        this.getParamsData();
      });
    },
    // 删除参数信息
    async delParams(id) {
      const tipinfo = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
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

      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$message.error("用户删除失败！");
      } else {
        this.$message.success("用户删除成功！");
        this.getParamsData();
      }
    },
    // 新增标签
    showInput(row) {
      row.inputVisible = true;
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //关闭标签，提交参数
    async handleInputConfirm(row) {
      // 清除空格
      if (row.inputValue.trim().length == 0) {
        row.inputVisible = false;
        row.inputValue = " ";
        return;
      }
      // console.log(row);
      row.attr_vals.push(row.inputValue.trim());
      row.inputVisible = false;
      row.inputValue = " ";
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("参数项添加失败！");
      }
      this.$message.success("参数项添加成功！");
      // this.getParamsData();
    },
    //删除参数标签
    async handleClose(index, row) {
      // console.log(index, row);
      row.attr_vals.splice(index, 1);
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("参数项删除失败！");
      }
      this.$message.success("参数项删除成功！");
    },
  },
  computed: {
    // 判断按钮属性是否禁用
    isDisabled() {
      if (this.selectKeys.length !== 3) {
        return true;
      }
      return false;
    },
    //返回cate属性ID
    cateId() {
      if (this.selectKeys.length == 3) {
        return this.selectKeys[2];
      }
      return null;
    },
    // 添加对话框标题
    titileName() {
      if (this.activeName == "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
    // 修改对话框标题
    titileEditName() {
      if (this.activeName == "many") {
        return "修改动态参数";
      } else {
        return "修改静态属性";
      }
    },
    // 添加对话框标题
    titileAddName() {
      if (this.activeName == "many") {
        return "添加动态参数";
      } else {
        return "添加静态属性";
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
.el-alert {
  margin-left: 5px;
  margin-top: 5px;
}
.search_nav {
  margin-left: 7px;
  margin-top: 25px;
  margin-bottom: 5px;
  // display: flex;
  // align-items: center;
}
.el-tabs {
  margin-left: 10px;
  margin-top: 20px;
}
.addButton {
  margin-top: 10px;
}
.el-tag {
  font-size: 14px;
  margin: 5px;
}
.el-table {
  margin-top: 25px;
}
// /deep/ .el-input__inner{
//   position: absolute;
//   left: 20%;
// }
.tip_tag {
  margin-right: 20px;
}
.input-new-tag {
  width: 150px;
}
</style>