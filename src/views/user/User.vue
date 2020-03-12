<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/welcome' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 空白区域 -->
    <el-card>
      <!-- 行 -->
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="userparam.query" clearable @clear="getuserlist">
            <el-button slot="append" icon="el-icon-search" @click="getuserlist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 点击添加用户出现一个对话框 -->
          <el-button type="success" @click="centerDialogVisible = true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户表格数据 -->
      <el-table :data="userlist" border stripe>
        <!-- 每一个column都是一个列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="username" label="姓名"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="200"></el-table-column>
        <el-table-column prop="mobile" label="电话"></el-table-column>
        <el-table-column prop="role_name" label="角色"></el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <template v-slot="slot">
            <!-- {{slot.row}} -->
            <el-switch v-model="slot.row.mg_state" @change="userstatechange(slot.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editform(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteUSerInfo(scope.row.id)"
            ></el-button>
            <el-tooltip effect="dark" content="角色分配" placement="top-start" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="addrole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userlist.pagenum"
        :page-sizes="[3,5,7]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </el-card>

    <!--添加用户对话框  -->
    <el-dialog
      title="注册"
      :visible.sync="centerDialogVisible"
      width="50%"
      center
      @close="addDialogClose"
    >
      <el-form :model="addformdata" :rules="addfromrule" ref="addformref" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addformdata.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addformdata.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addformdata.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="addformdata.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="validateForm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editdialogVisible"
      width="60%"
      center
      @close="editDialogClose"
    >
      <el-form :model="edituserlist" :rules="editformrules" ref="editForm" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="edituserlist.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="edituserlist.email"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="mobile">
          <el-input v-model="edituserlist.mobile"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editFormInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示分配角色对话框 -->
    <el-dialog title="修改角色" :visible.sync="addRoleVisible" width="50%">
      <div>
        <p class="userList">当前用户：{{nowuserlist.username}}</p>
        <p class="userList">当前角色：{{nowuserlist.role_name}}</p>
        <p class="userList">
          切换角色：
          <el-select v-model="chooseid" placeholder="请选择">
            <el-option v-for="item in roles" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addRoleVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRolePower">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>
<script>
import { menu } from "../../network/user";
export default {
  name: "user",
  data() {
    // 关于邮箱的验证规则
    var checkemail = (rule, value, confirm) => {
      let check = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
      if (check.test(value)) return confirm();
      confirm(new Error("请输入合法的邮箱！"));
    };
    // 关于手机号码的验证规则
    var checkmobilenum = (rule, value, confirm) => {
      let check = /^1[34578]\d{9}$/;
      if (check.test(value)) return confirm();
      confirm(new Error("请输入合法的手机号！"));
    };
    return {
      // 用户角色对象数据数组
      userlist: [],

      // 请求的用户角色对象
      userparam: {
        query: "",
        // 当前的页码
        pagenum: 1,
        // 每页保存的条数
        pagesize: 3
      },

      total: 3,
      // 当前对对话框是否显示
      centerDialogVisible: false,

      // 添加用户的规则
      addfromrule: {
        username: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          { min: 6, max: 12, message: "长度在 6 到 12 个字符", trigger: "blur" }
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkemail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入电话号号码",
            trigger: "blur"
          },
          {
            validator: checkmobilenum,
            trigger: "blur"
          }
        ]
      },

      //添加用户的数据绑定
      addformdata: {},

      // 编辑用户的用户框显示
      editdialogVisible: false,

      // 编辑用户返回的数据
      edituserlist: {},

      //编辑用户的规则
      editformrules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur"
          },
          {
            validator: checkemail,
            trigger: "blur"
          }
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur"
          },
          {
            validator: checkmobilenum,
            trigger: "blur"
          }
        ]
      },

      // 当前的用户信息
      nowuserlist: {},

      // 分配角色对话框
      addRoleVisible: false,

      // 选中的角色id
      chooseid: "",

      // 全部角色数据
      roles: []
    };
  },
  created() {
    // 组件初始化进行触发获取用户角色列表方法
    this.getuserlist();
  },
  methods: {
    // 从接口中获取用户角色列表数据
    async getuserlist() {
      // this.$http
      //   .get("http://127.0.0.1:8888/api/private/v1/users", {
      //     params: this.userparam
      //   })
      //   .then(da => {
      //     console.log(da);
      //   });
      let { data } = await menu("/users", {
        params: this.userparam
      });
      console.log(data);

      // 从后台数据库中接受用户的一共条数，并复制到data的total中；
      this.total = data.data.total;
      // 将后台数据的用户放进data中的userlist数组中
      this.userlist = data.data.users;
    },
    // 当用户点击页码的条数大小时切换，自动触发size-change事件
    handleSizeChange(news) {
      this.userparam.pagesize = news;
      this.getuserlist();
    },

    // 当用户点击页码时切换，自动触发current-change事件
    handleCurrentChange(nes) {
      this.userparam.pagenum = nes;
      this.getuserlist();
    },

    // 对用户的角色数据状态进行切换，并更新到数据库中
    async userstatechange(user) {
      let { data: res } = await this.$http.put(
        `/users/${user.id}/state/${user.mg_state}`
      );
      // 当请求更新到数据库失败后，切换的按钮就不切换了
      if (res.meta.status !== 200) {
        user.mg_state = !user.mg_state;
        return this.$Message.error("用户更新失败!");
      }
    },
    // 关闭添加用户的对话框，对表单进行重置
    addDialogClose() {
      console.log(this.$refs);
      this.$refs.addformref.resetFields();
    },
    // 对添加用户列表的数据进行验证
    validateForm() {
      this.$refs.addformref.validate(async val => {
        if (val !== true) return;
        // 如果验证成功的话则将数据进行保存在后台数据库中
        let { data: res } = await this.$http.post("/users", this.addformdata);
        if (res.meta.status !== 201) return;
        this.centerDialogVisible = false;

        // 添加到数据库的时候，必须重新渲染
        this.getuserlist();
        // 显示添加成功！
        this.$Message.success("添加用户成功！");
      });
    },

    // 点击修改用户的按钮时
    async editform(id) {
      this.editdialogVisible = true;
      let { data: res } = await this.$http.get("/users/" + id);
      if (res.meta.status !== 200) return;
      this.edituserlist = res.data;
    },

    // 关闭修改用户对话框时，进行表单重验证
    editDialogClose() {
      this.$refs.editForm.resetFields();
    },
    // 对修改用户的表单进行验证
    editFormInfo() {
      this.$refs.editForm.validate(async val => {
        if (val !== true) return;
        let { data: res } = await this.$http.put(
          "/users/" + this.edituserlist.id,
          {
            email: this.edituserlist.email,
            mobile: this.edituserlist.mobile
          }
        );
        if (res.meta.status !== 200) {
          return this.$Message.error("更新数据失败！");
        }
        // 刷新数据列表
        this.getuserlist();
        // 显示数据更新成功
        this.$Message.success("更新成功！");
        // 关闭当前对话框!
        this.editdialogVisible = false;
      });
    },

    // 根据用户id进行删除用户信息
    async deleteUSerInfo(id) {
      // 提示是否删除用户的对话
      // 当确认删除t为confirm，当取消删除t为cancel
      var t = await this.$MessageBox(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
        // 捕获错误
      ).catch(val => val);
      if (t == "cancel") return this.$Message.info("已取消删除！");
      if (t == "confirm") {
        let { data: res } = await this.$http.delete(`users/${id}`);
        if (res.meta.status === 200) {
          this.$Message.success("删除成功");
        } else {
          return this.$Message.error("删除失败");
        }
        // 删除成功刷新用户列表
        this.getuserlist();
      }
    },

    //显示该修改用户角色的对话框方法
    async addrole(t) {
      this.addRoleVisible = true;

      // 当前用户的信息保存在data中
      this.nowuserlist = t;
      // 获取角色数据（/roles）
      let { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) return this.$Message.error("修改权限失败！");

      // 保存全部角色数据在data中
      this.roles = res.data;
    },

    //点击修改用户角色方法
    async addRolePower() {
      // 超级管理员不可进行角色切换
      if (this.nowuserlist.role_name == "超级管理员") {
        return this.$Message.info("超级管理员不可修改");
      }
      if (!this.chooseid) return this.$Message.info("请选择要分配的角色");

      let { data: res } = await this.$http.put(
        `/users/${this.nowuserlist.id}/role`,
        {
          rid: this.chooseid
        }
      );
      if (res.meta.status !== 200) return this.$Message.error("修改角色失败！");

      // 修改后设置select选中的chooseid为空
      this.chooseid="";
      this.$Message.success("修改角色成功！")
      
      // 刷新用户的列表
      this.getuserlist();

      // 关闭该对话框
      this.addRoleVisible = false;
    }
  }
};
</script>
<style  scoped>
</style>