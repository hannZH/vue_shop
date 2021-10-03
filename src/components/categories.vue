<template>
  <div>
    <!-- 商品导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 商品分类卡片 -->
    <el-card class="box-card">
      <el-row>
        <el-col :span="6">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加分类</el-button
          ></el-col
        >
      </el-row>
      <!-- 列表区域 -->
      <tree-table
        :data="goodsList"
        :columns="columns"
        :show-index="true"
        index-text="#"
        border
        :selection-type="false"
        :expand-type="false"
      >
        <!-- 是否有效 -->
        <template slot="effective" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === true"
            style="color: red"
          ></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="small" v-if="scope.row.cat_level === 0">标签一</el-tag>
          <el-tag type="success" size="small" v-if="scope.row.cat_level === 1"
            >标签二</el-tag
          >
          <el-tag type="warning" size="small" v-if="scope.row.cat_level === 2"
            >标签三</el-tag
          >
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <!-- 编辑 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="catEdit(scope.row.cat_id)"
            >编辑</el-button
          >
          <!-- 删除 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[7, 8, 9, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加对话框 -->
    <el-dialog
      title="添加商品分类"
      :visible.sync="addDialogVisible"
      width="40%"
      @close="addClear()"
    >
      <el-form
        ref="addFormRef"
        :model="addForm"
        :rules="addFormRules"
        label-width="90px"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addForm.cat_name"></el-input>
        </el-form-item>
        <!-- 级联选择器，用props接受数据，用option绑定数据 -->
        <el-form-item label="父级分类:" v-model="addForm.cat_pid">
          <el-cascader
            :options="goodsList"
            :props="selectList"
            v-model="selectKeys"
            @change="catChange()"
            expandTrigger="hover"
            clearable
            filterable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="catAdd()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑对话框 -->
    <!-- <el-dialog
      title="修改商品分类"
      :visible.sync="editdialogVisible"
      width="50%"
      @close="editClear()"
    >
      <el-form
        ref="editFormRef"
        :model="editForm"
        label-width="100px"
        :rules="editFormRules"
      >
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="editForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类:" v-model="editForm.cat_pid">
          <el-cascader
            :options="goodsList"
            :props="selectList"
            v-model="editKeys"
            @change="catChange()"
            expandTrigger="hover"
            clearable
            filterable
            :change-on-select="true"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
  </div>
</template>
<script>
export default {
  data() {
    return {
      addDialogVisible: false,
      editdialogVisible: false,
      // 添加表单信息
      addForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },
      // 编辑表单信息
      editForm: {},
      selectKeys: [],
      editKeys: [],
      goodsList: [],
      //   商品分类请求参数
      queryInfo: {
        type: "",
        pagenum: 1,
        pagesize: 7,
      },
      total: 0,
      // 表格列属性
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "effective",
        },
        {
          label: "排序",
          type: "template",
          template: "order",
        },
        {
          label: "操作",
          type: "template",
          template: "opt",
        },
      ],
      selectList: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 修改表单校验对象
      addFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 修改表单校验对象
      editFormRules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
  },
  methods: {
    // 获得商品分类列表
    async getGoodsList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败！");
      }
      this.goodsList = res.data.result;
      this.total = res.data.total;
    },
    //改变每页显示条目个数
    handleSizeChange(pagesize) {
      //   console.log(pagesize);
      this.queryInfo.pagesize = pagesize;
      this.getGoodsList();
    },
    //改变页数
    handleCurrentChange(pagenum) {
      //   console.log(pagesize);
      this.queryInfo.pagenum = pagenum;
      this.getGoodsList();
    },
    //改变触发事件
    catChange() {
      // console.log(this.selectKeys);
      //  通过判断数组长度，长度为0则上传为空

      if (this.selectKeys.length == 0) {
        this.addForm.cat_pid = 0;
        this.addForm.cat_level = 0;
      }
      // 长度不为0，那么cat_level对应为长度-1，cat_pid就是数组中长度-1的值
      else {
        this.addForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addForm.cat_level = this.selectKeys.length;
      }
      // 解决一个选中三级级联目录优化问题
      // if (this.selectKeys.length == 3) {
      //   return 
      // }
    },
    // 添加商品分类
    catAdd() {
      // console.log(this.addForm);
      // 验证成功函数是个布尔值
      this.$refs.addFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.post("categories", this.addForm);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg + "," + "用户添加失败!");
        }
        this.$message.success("用户添加成功！");
        this.addDialogVisible = false;
        this.getGoodsList();
      });
    },
    // 清除添加表单数据
    addClear() {
      this.$refs.addFormRef.resetFields();
      this.selectKeys = [];
      this.addForm.cat_pid = 0;
      this.addForm.cat_level = 0;
      this.addForm.cat_name = "";
    },
    // 编辑商品分类
    async catEdit(id) {
      const { data: res } = await this.$http.get("categories/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询商品信息失败！");
      }
      this.editForm = res.data;
      this.editdialogVisible = true;
      // console.log(this.editForm);
    },
    // 编辑商品分类提交
    // editCatInfo() {
    //   this.$refs.editFormRef.validate(async (valid) => {
    //     // await简化promise对象
    //     if (!valid) return;
    //     if (this.editKeys.length === 0) {
    //       this.editForm.cat_pid = 0;
    //       this.editForm.cat_level = 0;
    //     } else {
    //       this.editForm.cat_pid = this.editKeys[this.editKeys.length - 1];
    //       this.editForm.cat_level = this.editKeys.length;
    //     }
        
    //     const { data: res } = await this.$http.put(
    //       "categories/" + this.editForm.cat_id,
    //       {
    //         cat_name: this.editForm.cat_name,
    //         cat_pid: this.editForm.cat_pid,
    //         cat_level: this.editForm.cat_level,
    //       }
    //     );
    //     console.log(this.editForm);
    //     if (res.meta.status !== 200) {
    //       return this.$message.error("商品分类信息修改失败！");
    //     }
    //     this.$message.success("商品分类信息修改成功！");
    //     this.editdialogVisible = false;
    //     this.getGoodsList();
    //   });
    // },
    // 清除编辑表单数据
    // editClear() {
    //   this.$refs.editFormRef.resetFields();
    //   this.selectKeys = [];
    //   this.editForm.cat_pid = 0;
    //   this.editForm.cat_level = 0;
    //   this.editForm.cat_name = "";
    //   this.editdialogVisible = false;
    // },
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

/deep/ .el-card {
  position: relative;
  //   left: 10px;
  top: 15px;
}
/deep/ .el-table {
  //   left: 10px;
  margin-top: 30px;
  margin-left: 5px;
}
.el-button {
  margin-top: 10px;
  margin-left: 5px;
}
/deep/ .tree-table {
  margin-top: 30px;
  margin-left: 5px;
}
.el-pagination {
  margin-top: 25px;
  margin-bottom: 25px;
  float: right;
}
.zk-table {
  margin-top: 30px;
  margin-left: 5px;
}
</style>