import Vue from 'vue'
import { Button, Col, Row, Cascader, Step, Upload } from 'element-ui'
import { Form, FormItem } from 'element-ui'
import { Input } from 'element-ui'
import { Message } from 'element-ui'
import { Container, Header, Aside, Main } from "element-ui";
import {
    Menu, MenuItem, MenuItemGroup,
    Submenu, Breadcrumb, BreadcrumbItem,
    Card, TableColumn, Table, Switch, Tooltip,
    Pagination,
    Dialog,MessageBox,
    Tag,Tree,Select,Option
    ,Alert,Tabs,TabPane,Steps
    ,Checkbox,CheckboxGroup,Timeline,TimelineItem
} from "element-ui"
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Container);
Vue.use(Header);
Vue.use(Aside);
Vue.use(Main);
Vue.use(Menu);
Vue.use(MenuItem);
Vue.use(Submenu);
Vue.use(MenuItemGroup);
Vue.use(Breadcrumb);
Vue.use(BreadcrumbItem);
Vue.use(Card);
Vue.use(Input);
Vue.use(Col);
Vue.use(Row);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Switch);
Vue.use(Tooltip);
Vue.use(Pagination);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Tree);
Vue.use(Select);
Vue.use(Cascader);
Vue.use(Option);
Vue.use(Alert);
Vue.use(Tabs);
Vue.use(Step);
Vue.use(Steps);
Vue.use(Checkbox);
Vue.use(CheckboxGroup);
Vue.use(Tabs);
Vue.use(TabPane);
Vue.use(Upload);
Vue.use(Timeline);
Vue.use(TimelineItem);










// Message组件
Vue.prototype.$Message = Message;

// 弹框组件
Vue.prototype.$MessageBox = MessageBox.confirm;

