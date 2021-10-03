<template>
  <!-- 登录背景颜色 -->
  <div class="Login_Background">
    <!-- 登录框界面 -->
    <div class="login_box">
      <!-- logo图标 -->
      <div class="logo">
        <img src="../assets/images/logo.gif" alt="" />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref="ruleForm"
        :model="loginForm"
        :rules="loginFormRules"
        label-width="0px"
        class="login_form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            placeholder="请输入用户名"
            v-model="loginForm.username"
            clearable
            prefix-icon="iconfont icon-user"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            placeholder="请输入登录密码"
            v-model="loginForm.password"
            show-password
            prefix-icon="iconfont icon-3702mima"
          ></el-input>
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button size="medium" type="primary" @click="login"
            >登录</el-button
          >
          <el-button size="medium" type="info" @click="reset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 登录表单数据绑定
      loginForm: {
        username: "admin",
        password: "123456",
      },
      // 表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "用户名在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入登录密码", trigger: "blur" },
          {
            min: 5,
            max: 10,
            message: "登录密码在 5 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    // 登录方法
    login() {
      // 验证成功函数是个布尔值
      this.$refs.ruleForm.validate(async (valid) => {
        // await简化promise对象
        if (!valid) return;
        const { data: res } = await this.$http.post("login", this.loginForm);
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("用户名或者密码不存在,登录失败！");
        }
        this.$message.success("欢迎回来，登录成功！");
        // 将token值保存在sessionStorage
        window.sessionStorage.setItem("token", res.data.token);
        this.$router.push('/home')
      });
    },
    // 重置方法
    reset() {
      // 调用表单重置函数进行重置
      this.$refs.ruleForm.resetFields();
    },
  },
};
</script>


<style lang="less" scoped>
.Login_Background {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(0, #fff1eb, #ace0f9);
}
.login_box {
  width: 450px;
  height: 350px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.logo {
  width: 150px;
  height: 150px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 20px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>