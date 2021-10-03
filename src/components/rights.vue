<template>
  <div>
    <!-- 权限列表导航栏 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 权限列表主题区域 -->
    <el-card>
      <el-table
        :data="rightsList"
        stripe
        border
        highlight-current-row
      >
        <el-table-column label="#" type="index"> </el-table-column>
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level == 0">权限一</el-tag>
            <el-tag v-if="scope.row.level == 1" type="success">权限二</el-tag>
            <el-tag v-if="scope.row.level == 2" type="warning">权限三</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      rightsList: [],
    };
  },
  created() {
    this.getRightsList();
  },
  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get("rights/list");
      // console.log(res.data);
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      }
      this.rightsList = res.data;
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
/deep/ .el-table{
    margin: 0 auto;
    width: 98%;
    margin-top:15px
}

</style>