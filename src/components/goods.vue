<template>
  <div>
    <!-- 商品参数导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20" type="flex" class="row-bg">
        <!-- 搜索框 -->
        <el-col :span="6">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getGoodsList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList()"
            ></el-button> </el-input
        ></el-col>
        <!-- 增加用户按钮 -->
        <el-col :span="1">
          <el-button type="primary" @click="goAddGood()">添加商品</el-button>
        </el-col>
      </el-row>
      <el-table
        :data="goodsList"
        stripe
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" type="index" width="70"> </el-table-column>
        <el-table-column label="商品名称" prop="goods_name" width="400">
        </el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="150">
        </el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="120">
        </el-table-column>
        <el-table-column label="创建时间" prop="upd_time">
          <template slot-scope="scope">
            {{ scope.row.upd_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="small"
              @click="editGoods(scope.row.goods_id)"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-edit"
              size="small"
              type="danger"
              @click="delGoods(scope.row.goods_id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 8, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改商品对话框 -->
    <el-dialog
      title="修改商品信息"
      :visible.sync="editDialogVisible"
      width="50%"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格(元)" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品分类" prop="goods_cat">
          <el-cascader
            :options="cateList"
            v-model="editForm.goods_cat"
            :props="cateProps"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editGoodsInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品表格数据
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      editForm: {},
      editDialogVisible: false,
      total: 0,
      // 修改表单校验对象
      editFormRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格(元)", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
      },
    };
  },
  created() {
    this.getGoodsList();
    this.getCateList();
  },
  methods: {
    // 获得三级标签列表
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("商品参数列表获取失败！");
      }

      this.cateList = res.data;
      // console.log(this.cateList);
      // console.log(this.addForm.goods_cat);
    },
    // 获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取用户列表数据失败！");
      }
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    //改变每页显示条目个数
    handleSizeChange(pagesize) {
      //   console.log(pagesize);
      this.queryInfo.pagesize = pagesize;
      this.getGoodsList();
    },
    //改变当前页数
    handleCurrentChange(pagenum) {
      //   console.log(pagenum);
      this.queryInfo.pagenum = pagenum;
      this.getGoodsList();
    },
    // 删除商品列表
    async delGoods(id) {
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
      const { data: res } = await this.$http.delete("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("用户删除失败！");
      }
      this.$message.success("用户删除成功");
      this.getGoodsList();
    },
    goAddGood() {
      this.$router.push("/goodsAdd");
    },
    // 修改商品信息
    async editGoods(id) {
      const { data: res } = await this.$http.get("goods/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editForm = res.data;
      // console.log(this.editForm);
      this.editDialogVisible = true;
    },
    //修改信息提交
    editGoodsInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.put(
          `goods/${this.editForm.goods_id}`,
          this.editForm
          // {
          //   goods_name: this.editForm.goods_name,
          //   goods_number: "1",
          //   goods_price: this.editForm.goods_price,
          //   goods_weight: this.editForm.goods_weight,
          //   goods_cat: [1, 3, 6],
          // }
        );
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("商品信息修改失败！");
        }
        this.$message.success("商品信息修改成功！");
        this.editDialogVisible = false;
        this.getGoodsList();
      });
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  padding-left: 10px;
}
.el-card {
  position: relative;
  //   left: 10px;
}
/deep/ .el-table {
  margin: 0 auto;
  width: 98%;
  margin-top: 15px;
}
.el-pagination {
  margin-top: 25px;
  margin-bottom: 25px;
  float: right;
}
</style>