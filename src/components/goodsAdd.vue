<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 警告标题 -->
      <el-alert title="添加商品信息" type="success" show-icon :closable="false">
      </el-alert>
      <!-- 步骤条 -->
      <el-steps :space="200" :active="activeIndex - 0" finish-status="success">
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-form
        :model="addForm"
        :rules="addrules"
        ref="addFormRefs"
        label-width="100px"
        label-position="top"
      >
        <!-- Tabs 标签页 -->
        <el-tabs
          :tab-position="tabPosition"
          v-model="activeIndex"
          @tab-click="tabClick()"
          :before-leave="beforeTabLeave"
        >
          <!-- 基本信息页面 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                :options="cateList"
                v-model="addForm.goods_cat"
                :props="cateProps"
                @change="selectChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品参数页面 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in manyTableDate"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :label="item"
                  v-for="(item, index) in item.attr_vals"
                  :key="index"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性页面 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item, index) in onlyTableDate"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handelSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容编辑 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"></quill-editor>
            <el-button
              type="success"
              icon="el-icon-check"
              size="medium"
              @click="add"
              >提交</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="PreviewDialogVisible"
      width="30%"
    >
      <img :src="previewPath" alt="" />
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      tabPosition: "left",
      cateList: [],
      cateProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      addForm: {
        goods_name: "0",
        goods_price: "0",
        goods_weight: "0",
        goods_number: "0",
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      manyTableDate: [],
      onlyTableDate: [],
      selectKeys: [],
      checkList: [],
      addrules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        goods_cat: [
          { required: true, message: "请选择商品分类", trigger: "blur" },
        ],
      },
      upload: "http://127.0.0.1:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      PreviewDialogVisible: false,
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

      this.cateList = res.data;
      // console.log(this.cateList);
      // console.log(this.addForm.goods_cat);
    },
    selectChange() {
      // console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    beforeTabLeave(oldActiveName) {
      // console.log(oldActiveName);
      if (oldActiveName !== 0 && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类！~");
        return false;
      }
    },
    // 切换商品参数获得动态商品属性
    async tabClick() {
      if (this.activeIndex == 1) {
        // console.log("111");
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "many" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("动态参数列表获取失败！");
        }

        res.data.forEach((item) => {
          if (item.attr_vals.length == 0) {
            item.attr_vals = [];
            return;
          }
          item.attr_vals = item.attr_vals.split(" ");
          // console.log(res.data);
        });
        // console.log(this.checkList);
        this.manyTableDate = res.data;
        // console.log(this.manyTableDate);
      }
      if (this.activeIndex == 2) {
        // console.log("111");
        const { data: res } = await this.$http.get(
          `categories/${this.addForm.goods_cat[2]}/attributes`,
          {
            params: { sel: "only" },
          }
        );

        if (res.meta.status !== 200) {
          return this.$message.error("动态参数列表获取失败！");
        }

        this.onlyTableDate = res.data;
        // console.log(this.onlyTableDate);
      }
    },
    // 图片预览功能
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url;
      this.PreviewDialogVisible = true;
    },
    // 图片移除功能
    handleRemove(file) {
      // console.log(file);
      const filePath = file.response.data.tmp_path;
      // console.log(filePath);
      const i = this.addForm.pics.findIndex((item) => {
        item.pic = filePath;
        return item;
      });
      this.addForm.pics.splice(i, 1);
      // console.log(this.addForm.pics);
    },
    // 图片临时路径存储
    handelSuccess(respond) {
      // console.log(respond);
      const ImagesUrl = { pic: respond.data.tmp_path };
      this.addForm.pics.push(ImagesUrl);
      // console.log(this.addForm.pics);
    },
    // 商品添加
    add() {
      // console.log(this.manyTableDate);
      this.$refs.addFormRefs.validate(async (valid) => {
        // 表单验证
        if (!valid) {
          return this.$message.error("请填写必要的表单项");
        }

        // 利用loadsh进行深拷贝
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        // console.log(form);
        // 处理动态参数
        this.manyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
      
        // // 处理静态参数
        this.onlyTableDate.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals,
          };
          this.addForm.attrs.push(newInfo);
        });
        form.attrs = this.addForm.attrs;
        // console.log(form);
        const { data: res } = await this.$http.post("goods", form);
        // console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("商品添加失败！");
        }
        this.$message.success("商品添加成功！");
        this.$router.push("/goods");
      });
      // console.log(this.addForm);
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
  margin-top: 5px;
  left: 10px;
}
.el-steps {
  margin-top: 25px;
  margin-left: 15%;
}
.el-tabs {
  margin-top: 25px;
  margin-left: 10px;
}
/deep/ .el-tabs__item {
  margin-top: 15px;
}
.el-checkbox {
  margin: 0;
  margin-right: 15px;
  margin-top: 5px;
}
img {
  width: 100%;
}
/deep/.ql-editor {
  min-height: 300px;
}
.el-button {
  margin-top: 20px;
  float: right;
}
</style>