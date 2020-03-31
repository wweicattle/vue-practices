<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 空白区域 -->
    <el-card>
      <!-- 添加商品文本框区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable v-model="queryParams.query" @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品名称数据列表区域 -->
      <el-table :data="goodlist" border stripe style="width: 100%">
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="130"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100"></el-table-column>
        <!-- 后台返回的时间毫秒数进行转换 -->
        <el-table-column label="创建时间" prop="upd_time" width="130">
          <template v-slot="scope">{{scope.row.add_time|changeTime}}</template>
        </el-table-column>
        <el-table-column label="操作" prop="date" width="250">
          <template v-slot="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-edit" size="mini" @click="deleteGood(scope)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParams.pagenum"
        :page-sizes="[3,5,10,15]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "goodlist",
  data() {
    return {
      goodlist: [],
      queryParams: {
        query: "",
        pagenum: 1,
        pagesize: 3
      },
      total: 0
    };
  },
  methods: {
    // 获取商品的全部数据
    async getGoodList() {
      let { data: res } = await this.$http.get("/goods", {
        params: this.queryParams
      });
      console.log(res);
      if (res.meta.status === 200) {
        this.goodlist = res.data.goods;
        this.total = res.data.total;
      }
    },

    // 当分页中每页数量尺寸减少，触发
    handleSizeChange(newSize) {
      this.queryParams.pagesize = newSize;
      //   重新进行获取商品数据
      this.getGoodList();
    },

    //当分页点击新的页数，触发
    handleCurrentChange(newPage) {
      this.queryParams.pagenum = newPage;
      // 重新进行获取商品数据
      this.getGoodList();
    },
    // 当点击删除商品时，触发
    async deleteGood(scope) {
      let res = await this.$MessageBox(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(val => val);
      if (res==="cancel") return this.$Message.info("取消删除商品！");
      let { data: re } = await this.$http.delete(
        `/goods/${scope.row.goods_id}`
      );
      // 请求删除商品数据是否成功！
      if (re.meta.status !== 200) return this.$$Message.error("删除失败！");
      this.$Message.success("删除成功!");
      //   重新刷新列表
      this.getGoodList();
    },
    addGoods(){
        this.$router.push("/goods/add")
    }
  },
  created() {
    this.getGoodList();
  }
};
</script>
<style  scoped>
</style>    