<template>
  <!-- 布局容器，并定义使用 -->
  <el-container class="mainPart">
    <!-- 头部容器 -->
    <el-header>
      <!-- 系统logo -->
      <div class="headerLogo">
        <img src="../assets/images/headerlogo.png" alt="" />

        <span class="headerTitle">创意后台管理系统</span>
      </div>
      <!-- 退出按钮 -->
      <el-button
        class="exitButton"
        @click="exit"
        type="primary"
        size="small"
        round
        >退出系统</el-button
      >
    </el-header>
    <!-- 中间主题容器 -->
    <el-container>
      <el-aside :width="foldState ? '64px' : '200px'">
        <!-- 折叠div -->
        <div class="foldButton" @click="flodchange">|||</div>
        <!-- 菜单属性 -->
        <el-menu
          :default-active="activePath"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          :collapse="foldState"
          :collapse-transition="false"
          router
        >
          <!-- 一级菜单 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconlist[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单,这里index要进行动态绑定 -->
            <el-menu-item
              class="subitem"
              :index="'/' + item.path"
              v-for="item in item.children"
              :key="item.id"
              @click="saveNavState('/' + item.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ item.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><router-view></router-view></el-main>
    </el-container>
    <!-- 足部容器 -->
    <el-footer>版本号 Version: 1.0</el-footer>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      // 菜单列表
      menulist: [],
      // 菜单图标
      iconlist: {
        125: "iconfont icon-user",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-shangpin",
        102: "iconfont icon-danju",
        145: "iconfont icon-baobiao",
      },
      // 折叠状态属性
      foldState: false,
      //被激活的链接属性
      activePath: "",
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("activePath");
  },
  methods: {
    // 退出按钮，清空token,跳转回登录界面
    exit() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取菜单页面
    async getMenuList() {
      const { data: res } = await this.$http.get("menus");
      if (res.meta.status !== 200) {
        return this.$message.error("用户名或者密码不存在,登录失败！");
      }
      this.menulist = res.data;
      // console.log(res.data);
    },
    // 转换折叠属性
    flodchange() {
      this.foldState = !this.foldState;
    },
    //保存链接的激活状态
    saveNavState(activePath) {
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
    },
  },
};
</script>
<style lang="less" scoped>
.el-footer {
  background-color: #778899;
  color: #333;
  text-align: right;
  line-height: 60px;
  font-size: 15px;
  color: #a2b5cd;
}

.el-aside {
  background-color: #545c64;
  color: #333;
  text-align: center;
}

// .el-main {
//   background-color: #fff;
//   color: #333;
//   text-align: center;
//   line-height: 160px;
// }

.mainPart {
  height: 100%;
}

.el-header {
  display: flex;
  background-color: #778899;
  justify-content: space-between;
  //   padding: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
}
.headerLogo {
  width: 240px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.iconfont {
  padding-right: 15px;
}
.el-menu {
  border-right: none;
}
.foldButton {
  width: 100%;
  height: 25px;
  background-color: #a2b5cd;
  text-align: center;
  color: #fff;
  font-size: 14px;
  line-height: 25px;
  letter-spacing: 0.15em;
}
/deep/ .el-submenu__title {
  padding-right: 60px;
}
</style>
