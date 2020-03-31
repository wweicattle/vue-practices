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

      <!-- 选择参数区域-->
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
                <el-table-column type="expand">
                  <!-- 进行渲染参数标签页 -->
                  <template v-slot="scope">
                    <el-tag
                      closable
                      @close="tagDelete(index,scope)"
                      v-for="(val,index) in scope.row.attr_vals"
                      :key="index"
                    >{{val}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope)"
                      @blur="handleInputConfirm(scope)"
                    ></el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
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
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeParams(scope.row.attr_id)"
                    >删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>

            <!-- 第二个标签页 -->
            <el-tab-pane label="静态属性" name="only">
              <el-button type="primary" :disabled="judge" @click="adddialogVisible=true">添加属性</el-button>
              <!-- 静态属性表格渲染 -->
              <el-table :data="onlyList" style="width: 100%" stripe border>
                <el-table-column type="expand">
                  <!-- 进行渲染参数标签页 -->
                  <template v-slot="scope">
                    <el-tag
                      closable
                      @close="tagDelete(index,scope)"
                      v-for="(val,index) in scope.row.attr_vals"
                      :key="index"
                    >{{val}}</el-tag>
                    <el-input
                      class="input-new-tag"
                      v-if="scope.row.inputVisible"
                      v-model="scope.row.inputValue"
                      ref="saveTagInput"
                      size="small"
                      @keyup.enter.native="handleInputConfirm(scope)"
                      @blur="handleInputConfirm(scope)"
                    ></el-input>
                    <el-button
                      v-else
                      class="button-new-tag"
                      size="small"
                      @click="showInput(scope)"
                    >+ New Tag</el-button>
                  </template>
                </el-table-column>
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
                    <el-button
                      type="danger"
                      icon="el-icon-delete"
                      size="mini"
                      @click="removeParams(scope.row.attr_id)"
                    >删除</el-button>
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


    <!-- 编辑参数的对话框 -->
    <el-dialog
      :title="'提示'+titleChoose"
      :visible.sync="editdialogVisible"
      width="60%"
      @close="editcloseDiolog"
    >
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

      //双向绑定修改数据的参数
      editgoodAttrs: {
        attr_name: ""
      },
      // 添加参数时的规则
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
      // 判断用户点击是否第三分类
      if (this.selectParamsId.length < 3) {
        // 把所有的动态参数的列表清空，因为只添加第三分类的参数
        this.manyList = [];
        this.onlyList = [];
      } else {
        // 把第三层的分类数据id进行保存在data中
        this.cateId = this.selectParamsId[2];
        this.handTabsClick();
      }
    },

    //点击标签页触发的方法,中有获取该分类的参数请求
    async handTabsClick() {
      // 获取该第三分类参数的动态参数或静态属性
      let { data: res } = await this.$http.get(
        `/categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName }
        }
      );
      console.log(res);
      res.data.forEach(element => {
        // 在后台返回数据的时，对数据进行添加两个属性
        element.inputVisible = false;
        element.inputValue = "";
        var val = element.attr_vals;
        element.attr_vals = val ? val.split(" ") : [];
      });
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

      //请求该参数的数据,后面id是该参数attr_id
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
      // 进行验证添加参数是否正确
      this.$refs.editref.validate(async val => {
        if (val !== true) return this.$Message.error("数据检验失败");
        // 发送请求到后台进行修改参数数据,后面的id是你输入数据，绑定数据
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
    },

    //点击删除参数按钮，触发
    async removeParams(id) {
      let mess = await this.$MessageBox(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(val => val);
      console.log(mess);
      if (mess !== "confirm") return this.$Message.info("你已取消删除！");

      let { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${id}`
      );
      if (res.meta.status !== 200) {
        return this.$Message.error("删除参数失败！");
      }

      // 刷新参数列表
      this.handTabsClick();
    },

    // 这是提取修改参数的操作封装的方法
    async saveAtrrs(scope) {
      // 判断如果输入框的value值是空时，进行去除空格，不做请求修改操作
      if (scope.row.inputValue.trim().length === 0) {
        scope.row.inputValue = "";
        scope.row.inputVisible = false;
        return;
      }
      // 如果当前输入框有值时，那么请求修改
      scope.row.attr_vals.push(scope.row.inputValue.trim());
      // 发起修改请求，请求的参数必须时有该参数名称的具体情况
      let { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/
      ${scope.row.attr_id}`,
        {
          attr_name: scope.row.attr_name, //参数名称
          attr_sel: scope.row.attr_sel, //动态还是静态参数
          attr_vals: scope.row.attr_vals.join(" ") //详细参数
        }
      );
      // 如果修改返回码不为200
      if (res.meta.status !== 200) this.$Message.error("修改数据项失败");
      // 如果修改成功
      this.$Message.success("数据参数修改成功！");
      // 之后进行关闭输入框为空
      scope.row.inputValue = "";
      // 输入框不可见，变为按钮
      scope.row.inputVisible = false;
    },

    // 添加参数数据的文本框按enter键时或失焦时，触发的方法
    async handleInputConfirm(scope) {
      // 触发修改参数的方法
      this.saveAtrrs(scope);
    },

    // 添加参数数据的按钮，点击时触发
    showInput(scope) {
      // 显示input文本框
      scope.row.inputVisible = true;
      // 进行已进入文本框就进行获得焦点
      this.$nextTick(_ => {
        console.log(this.$refs.saveTagInput);
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 当参数标签进行删除时：触发
    tagDelete(index, scope) {
      console.log(index);
      // 删除该参数
      scope.row.attr_vals.splice(index, 1);
      // 重新发起修改请求
      this.saveAtrrs(scope);
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
.input-new-tag {
  width: 120px;
}
</style>
