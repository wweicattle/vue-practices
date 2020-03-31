<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单数据</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 空白区域 -->
    <el-card>
      <!-- 搜索订单区域 -->
      <el-row>
        <el-col :span="13">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search">搜索</el-button>
          </el-input>
        </el-col>
      </el-row>

      <!--  -->
      <el-table :data="orderList">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>

        <el-table-column label="是否付款" prop="pay_status">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==='1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间" prop="update_time">
          <template slot-scope="scope">{{scope.row.update_time|changeTime}}</template>
        </el-table-column>
        <el-table-column label="操作" prop="order_number">
          <el-button type="primary" icon="el-icon-edit" size="mini" @click="editdialogVisible=true" ></el-button>
          <el-button type="success" icon="el-icon-location" size="mini" @click="serachMap"></el-button>
        </el-table-column>
      </el-table>
      <!-- 进行分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="50%">
      <el-form :model="editdata" :rules="editrules" ref="ruleForm" label-width="100px">
        <el-form-item label="省市级/县" prop="address">
          <el-cascader :options="addressData" v-model="editdata.address" :props="GoodsAddProps"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address1">
          <el-input v-model="editdata.address1"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流对话框 -->
    <el-dialog title="物流信息" :visible.sync="wuliudialogVisible" width="50%">
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in wuliuList"
          :key="index"
          :timestamp="activity.time"
        >{{activity.context}}</el-timeline-item>
      </el-timeline>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="wuliudialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="wuliudialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import addressData from "./address.js";
export default {
  name: "App",
  data() {
    return {
      // 请求的订单数据
      orderList: [],

      //请求绑定的参数
      queryParam: {
        query: {},
        pagenum: 1,
        pagesize: 5
      },

      // 总页数
      total: 0,

      // 显示编辑对话框
      editdialogVisible: false,

      // 全国省市县数据
      addressData,

      //编辑数据绑定
      editdata: {
        address: "",
        address1: ""
      },
      // 显示编辑数据检验
      editrules: {
        address: [
          {
            required: true,
            message: "请输入省市级/县",
            trigger: "blur"
          }
        ],
        address1: [
          {
            required: true,
            message: "请输入详细地址",
            trigger: "blur"
          }
        ]
      },

      //   级联配置，以什么属性展示
      GoodsAddProps: {
        expandTrigger: "hover",

        // 点击该分类，给它cat_id作为值进行区别
        value: "label",

        // 树形分类的显示为cat_name
        label: "value",

        //树形的迭代以children属性
        children: "children"
      },

      //
      wuliudialogVisible: false,


      // 
      wuliuList:[],
    };
  },
  methods: {
    async getOrderList() {
      let { data: res } = await this.$http.get("/orders", {
        params: this.queryParam
      });
      if (res.meta.status != 200)
        return this.$Message.error("获取订单数据失败！");
      // 将请求的数据进行保存起来
      this.orderList = res.data.goods;
      //   记录总数据
      this.total = res.data.total;
      console.log(res);
    },

    //当分页尺寸大小改变触发
    handleSizeChange(newSize) {
      this.queryParam.pagesize = newSize;
      this.getOrderList();
    },

    //当分页的页码发生变化，触发
    handleCurrentChange(newNum) {
      this.queryParam.pagenum = newNum;
      this.getOrderList();
    },

    // 显示编辑订单的对话框
    showEditDialog() {
      this.editdialogVisible = true;
    },

  // 点击物流对话框显示
    async serachMap() {
      this.wuliudialogVisible = true;
      let { data: res } = await this.$http.get("/kuaidi/804909574412544580");
      if(res.meta.status!==200)return this.$Message.error("获取物流信息失败!");
      
      // 将成功请求的数据进行保存
      this.wuliuList=res.data;
    },

  
   
  },
  created() {
    //   初始化组件，触发获取订单数据
    this.getOrderList();
  }
};
</script>
<style  scoped>
</style>
