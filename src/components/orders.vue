<template>
  <div>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 搜索栏 -->
      <el-row :gutter="20" type="flex" class="row-bg">
        <!-- 搜索框 -->
        <el-col :span="6">
          <el-input
            placeholder="请输入订单编号"
            v-model="queryInfo.query"
            clearable
            @clear="getOrderList()"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList()"
            ></el-button> </el-input
        ></el-col>
      </el-row>
      <el-table
        :data="orderList"
        stripe
        border
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="#" type="index" width="60"> </el-table-column>
        <el-table-column label="订单编号" prop="order_number">
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price"> </el-table-column>
        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status == 0" type="danger"
              >未付款</el-tag
            >
            <el-tag v-if="scope.row.pay_status == 1" type="success"
              >已付款</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"> </el-table-column>
        <el-table-column label="下单时间" prop="create_time">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="small"
            @click="editOrders()"
            >编辑</el-button
          >
          <el-button
            type="success"
            icon="el-icon-location"
            size="small"
            @click="getLogisticsInfo()"
            >定位</el-button
          >
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="EditdialogVisible"
      @close="clear()"
      width="50%"
    >
      <el-form
        :model="addressForm"
        :rules="addressrules"
        ref="addressRef"
        label-width="100px"
      >
        <el-form-item label="省市区、县" prop="address1">
          <el-cascader
            :options="cityData"
            clearable
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address1">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="EditdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="EditdialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 查看物流信息对话框 -->
    <el-dialog
      title="物流信息"
      :visible.sync="logisticsDialogVisible"
      width="50%"
    >
      <span>这是一段信息</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="logisticsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="logisticsDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import cityData from "../components/citydata";
export default {
  data() {
    return {
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      EditdialogVisible: false,
      addressForm: {
        address1: "",
        address2: "",
      },
      addressrules: {
        address1: [
          { required: true, message: "请输入省市区、县", trigger: "blur" },
        ],
        address2: [
          { required: true, message: "请输入详细地址", trigger: "blur" },
        ],
      },
      logisticsDialogVisible: false,
      cityData,
      logisticsInfo: [],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //   获得订单列表
    async getOrderList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.queryInfo,
      });
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取订单表列表数据失败！");
      }
      this.orderList = res.data.goods;
      this.total = res.data.total;
    },
    //改变每页显示条目个数
    handleSizeChange(pagesize) {
      //   console.log(pagesize);
      this.queryInfo.pagesize = pagesize;
      this.getOrderList();
    },
    //改变当前页数
    handleCurrentChange(pagenum) {
      //   console.log(pagenum);
      this.queryInfo.pagenum = pagenum;
      this.getOrderList();
    },
    // 修改对话框
    editOrders() {
      this.EditdialogVisible = true;
    },
    // 清空表单数据
    clear() {
      this.$refs.addressRef.resetFields();
      this.addressForm.address2 = "";
    },
    // 获取物流信息
    async getLogisticsInfo() {
      const { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      // console.log(res);
      //   if (res.meta.status !== 200) {
      //     return this.$message.error("获取物流信息失败！");
      //   }
      //   this.logisticsInfo = res.data;
      //   console.log(this.logisticsInfo);
      this.logisticsDialogVisible = true;
    },
  },
};
</script>
<style lang="less" scoped>
.el-breadcrumb {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
  padding-left: 10px;
}
.el-card {
  position: relative;
  //   left: 10px;
  top: 15px;
}
.el-table {
  margin-top: 25px;
}
.el-pagination {
  margin-top: 25px;
  margin-bottom: 25px;
  float: right;
}
</style>