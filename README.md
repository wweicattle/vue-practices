前言  
这是一款以电商项目类型进行开发，本地接口与sql文件都以上传其**仓库**中，可立即拉取进行本地测试。  

## 技术栈
element-ui + vue-router + webpack + axios  

# 项目执行
项目效果：



## Project setup
```
npm install
```
### Compiles and hot-reloads for development
```
npm run serve
```
### Compiles and minifies for production
```
npm run build
```

##  项目系统优化
### 1.通过Nprogress进行添加进度条效果
```
1.先运行安装依赖nprogress包,  
    
2.后引入该包对应的js和css  

3.在请求响应拦截器中进行设置  

nprgress.start();  
nprgress.done();  

```