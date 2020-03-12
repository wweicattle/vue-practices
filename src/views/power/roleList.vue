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
      <!-- 获取的数据是一个角色数据数组，现在进行对数组中的对象进行一个个渲染 -->
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item,index) in scope.row.children"
              :class="['tagbottom',index==0?'tagtop':null,'vheiht']"
              :key="item.id"
            >
              <!-- 第一权限分五格 -->
              <el-col :span="5">
                <el-tag closable @close="closeTag(scope.row,item)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 第二权限和第三分19格，之后再细分 -->
              <el-col :span="19">
                <el-row
                  :class="[index==0?'':'tagtop','vheiht']"
                  :key="index"
                  v-for="(item2,index) in item.children"
                >
                  <!-- 第二全此案 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(scope.row,item2)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 为什么这里要对el-tag标签进行遍历呢，因为第三权限有很多同级的权限 -->
                    <el-tag
                      type="danger"
                      v-for="(item3,index) in item2.children"
                      :key="index"
                      closable
                      @close="closeTag(scope.row,item3)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template v-slot="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete">删除</el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="powersList(scope.row)"
            >添加权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 显示添加权限对话框 -->
    <el-dialog title="提示" :visible.sync="rightDialogVisible" width="50%">
      <!-- :data绑定数据源，：props进行树形以什么方式遍历children -->
      <el-tree
        :data="rightPowerList"
        :props="defaultPowerProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="checkid"
        ref="powertree"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="rightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmadd">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "roleList",
  data() {
    return {
      // 定义角色列表的数据变量，以及有该角色的权限
      roleList: [],

      // 权限列表树形数组
      powerList: [],

      // 是否显示分配权限变量
      rightDialogVisible: false,

      //   分配权限的树形
      rightPowerList: [],

      // 该树形以children属性展开，树形显示的authNAme属性值
      defaultPowerProps: {
        children: "children",
        label: "authName"
      },

      // 根据角色已经默认选中的id特权
      checkid: [],

      //保存点击的当前角色id，因为树形中需要使用该角色id
      chooseid: ""
    };
  },
  methods: {
    //  获取角色以及该角色有的权限的列表数据
    async getrolelist() {
      let { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) return this.$Message.error("数据获取失败！");
      this.roleList = res.data;
    },

    // 在标签删除后，自动触发close事件。
    async closeTag(role, power) {
      var t = await this.$MessageBox(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        // 捕获错误
      ).catch(val => val);
      if (t !== "confirm") {
        return this.$Message.info("取消删除权限！");
      }
      //   根据该角色id以及权限id进行删除
      let { data: res } = await this.$http.delete(
        `/roles/${role.id}/rights/${power.id}`
      );
      if (res.meta.status !== 200) return this.$Message.info("删除失败！");
      //显示删除权限成功！
      this.$Message.success("删除成功");
      console.log(res);
      // 角色与权限对象都在同一个对象中
      // 刷新列表不能触发全部数据，这样角色也刷新了一下
      // 直接刷新权限数据,该发出删除权限请求后，会返回一个该data是最新的权限数据
      role.children = res.data;
    },

    //点击分配权限,t是当前角色对象
    async powersList(t) {
      // 当前的角色id保存在data中
      this.chooseid = t.id;
      // 定义一个数组用来接受该角色已经选中的特权id
      let arr = [];

      // 触发对该角色筛选选中特权的方法
      this.findid(t, arr);

      // 放进data中，进行渲染
      this.checkid = arr;

      // 显示分配权限对话框
      this.rightDialogVisible = true;

      //获取权限列表(所有)
      let { data: res } = await this.$http.get("rights/tree");
      if (res.meta.status !== 200) return this.$Message.error("获取权限失败！");

      //将分配数据树形保存到变量中
      this.rightPowerList = res.data;
    },

    //根据角色筛选已有特权的id（递归）
    findid(t, arr) {
      if (!t.children) {
        return arr.push(t.id);
      }
      t.children.forEach(val => {
        this.findid(val, arr);
      });
    },

    // 点击确定添加权限
    async confirmadd() {
      // 当前树形被选中的节点id
      let a = this.$refs.powertree.getCheckedKeys();
      // 当前树形半选中的id
      let b = this.$refs.powertree.getHalfCheckedKeys();

      let str = [a, b].join(",");
      // 添加该权限到后台服务器中，请求的权限id是拼接字符串
      let { data: res } = await this.$http.post(
        `/roles/${this.chooseid}/rights`,
        {
          rids: str
        }
      );

      if (res.meta.status != 200) return this.$Message.error("添加权限失败！");
      this.$Message.success("添加权限成功！");

      this.getrolelist();
      this.rightDialogVisible = false;
    }
  },
  created() {
    //   组件初始化中触发一次请求角色列表方法
    this.getrolelist();
  }
};
</script>
<style  scoped>
/* 对角色列表进行纵向水平 */
.vheiht {
  display: flex;
  align-items: center;
}
</style>
