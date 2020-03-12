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
      <!-- 设置警告区域 -->
      <el-row>
        <el-col>
          <el-alert title="注意：只允许第三类参数设置相关参数！" type="warning" :closable="false" show-icon></el-alert>
        </el-col>
      </el-row>

      <!-- 参数区域-->
      <el-row>
        <el-col>
          <span>
            选择商品的分类：
            <!-- 对获取的所有分类数据进行像树形展示 -->
            <el-cascader
              v-model="selectParamsId"
              :options="cateList"
              :props="paramsProps"
              @change="handleChange"
              closeabled
            ></el-cascader>
          </span>
        </el-col>
      </el-row>

      <!--参数列表区域  -->
      <el-row>
        <el-col>
          <!-- 标签页 -->
          <el-tabs v-model="activeName" @tab-click="handTabsClick">
            <!-- 第一个标签页 -->
            <el-tab-pane label="动态参数" name="many">
              <!--添加参数图标 -->
              <el-button type="primary" :disabled="judge" @click="adddialogVisible=true">添加参数</el-button>
              <!-- 动态参数表格渲染 -->
              <el-table :data="manyList" style="width: 100%" stripe border>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column prop="attr_name" label="操作">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editDialogShow(scope.row.attr_id)"
                    >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 第二个标签页 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="judge" @click="adddialogVisible=true">添加属性</el-button>
              <!-- 静态属性表格渲染 -->
              <el-table :data="onlyList" style="width: 100%" stripe border>
                <el-table-column type="expand"></el-table-column>
                <el-table-column type="index" label="#"></el-table-column>
                <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                <el-table-column prop="attr_name" label="操作">
                  <template v-slot="scope">
                    <el-button
                      type="primary"
                      icon="el-icon-edit"
                      size="mini"
                      @click="editDialogShow(scope.row.attr_id)"
                    >编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
    </el-card>

    <!-- 添加参数对话框,动态参数与静态属性同一个对话框-->
    <el-dialog
      :title="'提示'+titleChoose"
      :visible.sync="adddialogVisible"
      width="60%"
      @close="closeDiolog"
    >
      <!--  -->
      <el-form ref="goodsref" :model="goodAttrs" label-width="80px" :rules="goodsAttrsRules">
        <el-form-item :label="titleChoose" prop="attr_name">
          <el-input v-model="goodAttrs.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="adddialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addForm">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      :title="'提示'+titleChoose"
      :visible.sync="editdialogVisible"
      width="60%"
      @close="editcloseDiolog"
    >
      <!--  -->
      <el-form ref="editref" :model="editgoodAttrs" label-width="80px" :rules="editAttrsRules">
        <el-form-item :label="titleChoose" prop="attr_name">
          <el-input v-model="editgoodAttrs.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "params",
  data() {
    return {
      // 级联选中的分类id值
      selectParamsId: [],

      //  所有分类数据
      cateList: [],

      //   级联配置，以什么属性展示
      paramsProps: {
        expandTrigger: "hover",
        // 点击该分类，给它cat_id作为值进行区别
        value: "cat_id",
        // 树形分类的显示为cat_name
        label: "cat_name",
        //树形的迭代以children属性
        children: "children"
      },

      //  当前点击的tabs标签页id
      activeName: "many",

      cateId: 0,

      //   动态参数的数据
      manyList: [],

      // 静态属性的数据
      onlyList: [],

      //   是否显示添加参数对话框
      adddialogVisible: false,

      //添加参数的响应对象变量
      goodAttrs: {
        attr_name: ""
      },

      // 添加参数的规则检验
      goodsAttrsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入合法参数！",
            trigger: "blur"
          }
        ]
      },

      //是否显示或隐藏对话框
      editdialogVisible: false,

      //
      editgoodAttrs: {
        attr_name: ""
      },
      editAttrsRules: {
        attr_name: [
          {
            required: true,
            message: "请输入合法参数！",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    //   获取分类数据
    async getCateList() {
      let { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200)
        return this.$Message.error("获取分类数据失败！");

      // 将获取的数据进行保存在data中
      this.cateList = res.data;
    },

    //   当级联选中的分类id变化时
    handleChange() {
      // 把第三层的分类数据id进行保存在data中
      this.cateId = this.selectParamsId[2];
      this.handTabsClick();
    },

    //点击标签页触发的方法
    async handTabsClick() {
      // 获取该第三分类参数的动态参数或静态属性
      let { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res.data);

      // 如果请求的是many动态参数时
      if (this.activeName === "many") {
        this.manyList = res.data;
      } else {
        this.onlyList = res.data;
      }
    },

    //关闭添加参数的对话框时 触发
    closeDiolog() {
      this.$refs.goodsref.resetFields();
    },

    // 当点击添加参数按钮，触发
    addForm() {
      this.$refs.goodsref.validate(async val => {
        if (!val === true) return this.$Message.error("参数检验失败！");
        let { data: res } = await this.$http.post(
          `/categories/${this.cateId}/attributes`,
          {
            attr_name: this.goodAttrs.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status != 201)
          return this.$Message.error("添加参数失败！");

        //参数添加到后台后刷新列表
        this.handTabsClick();

        this.$Message.success("添加参数成功！");
        // 关闭对话框
        this.adddialogVisible = false;
      });
    },

    // 点击编辑参数按钮，触发
    async editDialogShow(attr_id) {
      // 显示修改对话框
      this.editdialogVisible = true;

      //请求该参数的数据
      let { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName
          }
        }
      );
      if (res.meta.status !== 200)
        return this.$Message.error("该参数获取失败！");

      //   后台返回该参数数据，进行放进input中
      this.editgoodAttrs = res.data;
    },

    // 关闭修改参数对话框时触发
    editcloseDiolog() {
      this.$refs.editref.resetFields();
    },

    // 点击按钮，修改参数
    editForm() {
      this.$refs.editref.validate(async val => {
        if (val !== true) return this.$Message.error("数据检验失败");
        let { data: res } = await this.$http.put(
          `/categories/${this.cateId}/attributes/${this.editgoodAttrs.attr_id}`,
          {
            attr_name: this.editgoodAttrs.attr_name,
            attr_sel: this.activeName
          }
        );
        if (res.meta.status !== 200)
          return this.$Message.error("修改参数失败!");
        this.$Message.success("修改参数成功！");

        // 更新完数据，刷新列表
        this.handTabsClick();

        // 关闭添加参数对话框
        this.editdialogVisible = false;
      });
    }
  },
  computed: {
    //进行判断是否添加的是第三分类参数的拓展（默认只能第三分类参数进行添加）
    // 返回布尔值看是否可以点击添加参数按钮
    judge() {
      console.log(3);
      if (this.selectParamsId.length !== 3) return true;
      return false;
    },

    // 判断点击哪一个添加参数按钮
    titleChoose() {
      if (this.activeName === "many") return "动态参数";
      return "静态属性";
    }
  },
  created() {
    //组件初始化触发一次获取数据方法
    this.getCateList();
  }
};
</script>
<style  scoped>
.el-cascader {
  margin-top: 20px;
}
</style>
