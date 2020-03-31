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
      <!-- 添加分类区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addCate">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格树形 -->
      <table-tree
        :data="cartList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <!-- 作用域插槽，自定义模板标签 -->
        <!-- 是否有效属性的插槽 -->
        <template v-slot:isok="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted==false" style="color:green"></i>
          <i class="el-icon-erroe" v-else style="color:#ccc"></i>
        </template>

        <!--  排序模板作用域插槽-->
        <template v-slot:isok1="scope">
          <el-tag type="success" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="warning" v-else-if="scope.row.cat_level===1">二级</el-tag>
          <el-tag type="info" v-else>三级</el-tag>
        </template>

        <!--操作模板作用域插槽  -->
        <template v-slot:isok2="scope">
          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>
      </table-tree>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryParam.pagenum"
        :page-sizes="[5,7,9]"
        :page-size="queryParam.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>

      <!-- 添加分类的对话框 -->
      <el-dialog
        title="添加分类"
        :visible.sync="addCatedialogVisible"
        width="60%"
        @close="cateDialogClose"
      >
        <!--添加分类的表单-->
        <el-form :model="cateList" :rules="caterules" ref="cateref" label-width="100px">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="cateList.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="父级分类" >
            <!-- options属性是绑定数据源，Props是数据配置信息，v-model绑定选中的id放在一个数组中 -->
            <el-cascader
              :options="parentList"
              :props="cascaderProps"
              clearable
              v-model="selectKeys"
              @change="parentCateChange"
              change-on-select
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addCatedialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmAddCate">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
    
  </div>
</template>
<script>
export default {
  name: "goods",
  data() {
    return {
      // 请求的分类参数
      queryParam: {
        type: 3,
        pagenum: 1,
        pagesize: 1
      },
      // 保存请求分类的数据
      cartList: [],

      // 商品的总数据条数
      total: 0,

      // 自定义table-tree列的属性，与属性值
      columns: [
        //   每个对象就是对该列的配置
        {
          label: "分类名称",
          prop: "cat_name"
        },
        {
          label: "是否有效",
          //   该列定义为模板列
          type: "template",
          //   表示当前这一列使用的模板名称
          template: "isok"
        },
        {
          label: "排序",
          type: "template",
          template: "isok1"
        },
        {
          label: "操作",
          type: "template",
          template: "isok2"
        }
      ],

      //   是否显示添加分类对话框
      addCatedialogVisible: false,

      // 保存添加分类的对象
      cateList: {
        cat_name: "",
        cat_level: 0,
        cat_pid: 0
      },
      //   对添加分类的格式进行检验
      caterules: {
        cat_name: [
          {
            required: true,
            message: "请输入分类名称",
            trigger: "blur"
          }
        ]
      },

      //   上面2级的父级分类名称
      parentList: [],

      // 对该表格树形的配置
      cascaderProps: {
        expandTrigger: "hover",
        // 点击该分类，给它cat_id作为值进行区别
        value: "cat_id",
        // 树形分类的显示为cat_name
        label: "cat_name",
        //树形的迭代以children属性
        children: "children"
      },

      //点击分类时保存cat_id,一层，二层
      selectKeys: []
    };
  },
  created() {
    // 组件进行初始化的时候自动触发一次（获取分类数据）
    this.getCartList();
  },
  methods: {
    // 请求商品分类的数据
    async getCartList() {
      let { data: res } = await this.$http.get("/categories", {
        params: this.queryParam
      });
      console.log(res);

      //   请求的数据保存在data中的变量
      this.cartList = res.data.result;

      // 总的分类数据数量，保存在data中，供分页使用
      this.total = res.data.total;
    },

    // 当点击分页的尺寸大小发生变化，自动触发该事件
    handleSizeChange(newsize) {
      this.queryParam.pagesize = newsize;
      this.getCartList();
    },

    // 当点击分页的页码大小发生变化，自动触发该事件
    handleCurrentChange(newpage) {
      this.queryParam.pagenum = newpage;
      this.getCartList();
    },
    // 点击添加分类时的方法
    addCate() {
      this.parentCateList();
      this.addCatedialogVisible = true;
    },

    // 请求分类数据(前2层就可以)供添加分类使用
    async parentCateList() {
      let { data: res } = await this.$http.get("/categories", {
        params: {
          type: 2
        }
      });
      if (res.meta.status !== 200)
        return this.$Message.error("获取父类名称失败!");

      // 获取的数据保存在data中
      this.parentList = res.data;
    },

    //当级联选择器发生变化（用户选择分类添加时）自动触发@change事件
    parentCateChange() {
      if (this.selectKeys.length != 0) {
        let value = this.selectKeys[this.selectKeys.length - 1];

        // 将选择的分类id，保存在data中，之后按确定与后台进行交互
        this.cateList.cat_pid = value;
        this.cateList.cat_level = this.selectKeys.length;
      } else {
        this.cateList.cat_pid = 0;
        this.cateList.cat_level = 0;
      }
    },

    // 当点击确定添加分类后，触发该方法
    confirmAddCate() {
      this.$refs.cateref.validate(async val => {
        if (!val) return this.$Message.error("数据格式错误!");
        let { data: res } = await this.$http.post("categories", this.cateList);
        if (res.meta.status != 201) return this.$Message.error("添加分类失败!");
        this.$Message.success("添加分类成功!");

        //刷新分类数据列表
        this.getCartList();

        // 关闭对话框
        this.addCatedialogVisible = false;
      });
    },

    // 当显示分类的对话框已经关闭时，清楚历史记录
    cateDialogClose() {
      this.$refs.cateref.resetFields();
      this.selectKeys = [];
      this.cateList = {};
    }
  }
};
</script>
<style  scoped>
.el-cascader{
    width: 100%;
}
</style>
