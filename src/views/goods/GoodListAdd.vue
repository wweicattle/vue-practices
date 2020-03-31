<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 空白区域-->
    <el-card>
      <!-- 添加商品信息警告 -->
      <el-row>
        <el-col>
          <el-alert title="添加商品信息" center type="info" show-icon :closable="false"></el-alert>
        </el-col>
      </el-row>
      <!-- 导航步骤 -->
      <el-steps :space="400" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页-->
      <el-form
        :model="addGoodsForm"
        :rules="rulesaddGoodsRule"
        ref="addGoodsForm"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClick"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="clickGoodsId"
                :options="cateList"
                :props="GoodsAddProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodsForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addGoodsForm.goods_price" type="number" id="sa"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addGoodsForm.goods_weight" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addGoodsForm.goods_number" type="number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in manygoodsList"
              :key="index"
            >
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox :label="val" v-for="(val,index) in item.attr_vals" :key="index" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="(item,index) in onlygoodslist"
              :key="index"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!--上传图片标签，action请求的路径  -->
            <!-- 有自己的请求头部设置，如果有token需要添加上去 -->
            <el-upload
              :action="url"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headers"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本框进行编写商品的内容-->
            <quill-editor ref="myQuillEditor" v-model="addGoodsForm.goods_introduce"   />
            <el-button type="primary" @click="addFormList">添加</el-button>

          </el-tab-pane>
        </el-tabs>
      </el-form>
      <!-- 图片预览的对话框 -->
      <el-dialog title="图片预览" :visible.sync="dialogVisible" width="60%">
        <img :src="currentPhotoPath" class="currentPath" />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  name: "goodListAdd",
  data() {
    return {
      // 当前标签页的步骤位置
      activeIndex: 0,

      //添加商品信息绑定
      addGoodsForm: {
        goods_name: "0",
        goods_price: "1",
        goods_number: "1",
        goods_weight: "1",
        // 选择分类的id
        goods_cat: [],
        // 上传图片的地址
        pics: [],
        // 富文本框中的内容文本
        goods_introduce: "",

        //  请求的参数数据
        attrs: []
      },
      //添加商品的信息格式检验
      rulesaddGoodsRule: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
        ],
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" }
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
      },

      //级联中绑定所有商品分类的数据
      cateList: [],

      //当前级联选中的分类id
      clickGoodsId: [],

      //   级联配置，以什么属性展示
      GoodsAddProps: {
        expandTrigger: "hover",
        // 点击该分类，给它cat_id作为值进行区别
        value: "cat_id",
        // 树形分类的显示为cat_name
        label: "cat_name",
        //树形的迭代以children属性
        children: "children"
      },

      // 商品信息动态参数
      manygoodsList: [],

      // 商品静态属性
      onlygoodslist: [],

      // 上传图片的url地址
      url: "http://127.0.0.1:8888/api/private/v1/upload",
      // 请求图片的url请求头配置,
      // 该组件有自己的请求规则
      headers: {
        Authorization: window.sessionStorage.getItem("token")
      },

      //图片预览效果图地址
      currentPhotoPath: "",

      //图片预览对话框
      dialogVisible: false
    };
  },
  methods: {
    // 获获取商品分类的所有数据
    async getCateList() {
      let { data: res } = await this.$http.get("/categories");
      if (res.meta.status != 200)
        return this.$Message.error("获取分类数据失败！");
      // 将获取的数据进行保存在data中
      this.cateList = res.data;
    },
    // 当级联选中之后进行方法触发
    handleChange() {
      console.log(this.clickGoodsId);
    },

    //当点击到另一个标签页的时候，触发
    beforeTabLeave(newActiveIndex, oldAcitveIndex) {
      // 当点击别的标签页时，判断的是否是第三分类
      if (this.clickGoodsId.length < 3 && newActiveIndex !== "0") {
        this.$Message.error("请选择第三商品分类");
        return false;
      }
    },

    //点击标签后进行，触发
    async tabClick() {
      if (this.activeIndex == 1) {
        // 请求商品分类的全部数据
        let { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "many"
            }
          }
        );
        // 进行所有该商品的参数进行
        res.data.forEach((val, index) => {
          val.attr_vals =
            val.attr_vals.length === 0 ? [] : val.attr_vals.split(" ");
        });
        // 将商品的分类动态参数数据保存
        this.manygoodsList = res.data;
        console.log(res);
      } else if (this.activeIndex == 2) {
        // 请求商品静态属性的全部数据
        let { data: res } = await this.$http.get(
          `/categories/${this.cateId}/attributes`,
          {
            params: {
              sel: "only"
            }
          }
        );

        //将商品静态属性进行保存起来
        this.onlygoodslist = res.data;
      }
    },

    // 处理图片预览效果
    handlePreview(res) {
      //将图片完整路径保存
      this.currentPhotoPath = res.response.data.url;

      // 显示图片预览对话框
      this.dialogVisible = true;
    },

    // 处理移除图片的操作
    handleRemove(res) {
      const path = res.response.data.tmp_path;
      let index = this.addGoodsForm.pics.findIndex(x => x.pic === path);
      this.addGoodsForm.pics.splice(index, 1);
    },

    // 监听图片上传成功的事件
    handleSuccess(res) {
      console.log(res);
      const picInfo = { pic: res.data.tmp_path };
      this.addGoodsForm.pics.push(picInfo);
    },

    //点击上传商品时，触发
    addFormList() {
      // 先验证添加数据检验是否正确
      this.$refs.addGoodsForm.validate(async val => {
        if (!val) return this.$Message.info("请填写必要的数据项");

        // 把级联选中的数组赋给this.addGoodsForm.goods_cat
        this.addGoodsForm.goods_cat = this.clickGoodsId;

        // 对动态参数进行提取
        this.manygoodsList.forEach((val, index) => {
          let obj = {
            attr_id: val.attr_id,
            attr_vals: val.attr_vals.join(" ")
          };
          this.addGoodsForm.attrs.push(obj);
        });

        // 对静态属性进行提取
        this.onlygoodslist.forEach((val, index) => {
          let obj = {
            attr_id: val.attr_id,
            attr_vals: val.attr_vals
          };
          this.addGoodsForm.attrs.push(obj);
        });

        //将添加的商品数据进行深拷贝给另一个变量，之后进行发起后台请求
        let obj = JSON.parse(JSON.stringify(this.addGoodsForm));
        obj.goods_cat = obj.goods_cat.join(",");

        // 发起商品添加请求，商品名称唯一
        let { data: res } = await this.$http.post("/goods", obj);
        if(res.meta.status!=201)return this.$Message.error("添加商品数据失败！");
        this.$Message.success("添加商品成功!");
        this.$router.push('/goods');
      });
    }
  },
  created() {
    // 组件初始化中就进行触发获取数据一次
    this.getCateList();
  },
  computed: {
    cateId() {
      if (this.clickGoodsId.length !== 3) {
        return null;
      } else {
        return this.clickGoodsId[2];
      }
    }
  }
};
</script>
<style  scoped>
</style>    