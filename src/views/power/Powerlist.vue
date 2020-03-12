<template>
  <div>
    <!-- 面包屑列表 -->
    <el-breadcrumb>
      <el-breadcrumb-item :to="{path:'/welcome'}">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 空白区域 -->
    <el-card>
      <!-- 用户权限列表 -->
      <el-table :data="userList" border stripe  >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="authName" label="权限名称"></el-table-column>
        <el-table-column prop="path" label="路径"></el-table-column>
        <el-table-column prop="level" label="权限等级">
          <div slot-scope="scope">
            <el-tag type="success" v-if="scope.row.level=='0'">一级</el-tag>
            <el-tag type="info" v-else-if="scope.row.level=='1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </div>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "power",
  data() {
    return {
      userList: []
    };
  },
  methods: {
    async getPowerList() {
      let { data: res } = await this.$http.get("/rights/list");
      this.userList = res.data;
    }
  },
  created() {
    this.getPowerList();
  }
};
</script>
<style  scoped>
</style>