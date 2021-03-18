<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/role">角色列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>角色{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="roleForm"
        >
            <el-form-item label="角色名称" prop="rolename">
                <el-input v-model="info.rolename"></el-input>
            </el-form-item>
            <el-form-item label="角色权限">
                <!-- 
                    树形组件 
                        data 要展示的数据
                        props 默认属性
                        show-checkbox 显示复选框
                        default-expand-all 展开所有层级
                        default-checked-keys 设置默认选中 数据类型是数组
                -->
                <el-tree 
                    :data="menus" 
                    :props="defaultProps"
                    show-checkbox
                    ref="tree"
                    node-key="id"
                    default-expand-all
                    :default-checked-keys="defaultKeys"
                    check-strictly
                ></el-tree>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('roleForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tip:'添加',
            defaultKeys:[],
            info:{
                rolename:'',
                menus:'',
                status:true
            },
            rules:{
                rolename:[
                    { required:true,message:'角色名称不能为空',trigger:'blur' },
                    { min:1,max:20,message:'角色名称长度不符合要求' }
                ]
            },
            menus:[],
            defaultProps:{
                children:'children',
                label:'title'
            }
        }
    },
    mounted(){
        if(this.$route.params.roleid){
            this.tip = '修改';
            //获取到当前路由地址编号对应的角色信息
            this.$http.get(this.$apis.roleinfo,{id:this.$route.params.roleid}).then(res=>{
                this.info = res.data.list;
                //处理和数据库中不一样的数据类型
                this.info.status = this.info.status == 1 ? true : false;
                //设置菜单默认选中--要把字符串变成数组
                this.defaultKeys = this.info.menus ? this.info.menus.split(',') : [];
            })
        }
        //获取已有的菜单信息
        this.$http.get(this.$apis.menulist,{istree:1}).then(res=>{
            if(res.data.code == 200){
                this.menus = res.data.list;
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        })
    },
    methods:{
        submitInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.info));
                    let url = this.$apis.roleadd;
                    if(this.$route.params.roleid){
                        url = this.$apis.roleedit;
                        data.id = this.$route.params.roleid;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    //getCheckedKeys el-tree组件获取勾选的菜单的node-key属性值
                    //join方法用来将数组元素用指定的内容分隔，转换成一个字符串
                    data.menus = this.$refs.tree.getCheckedKeys() ? this.$refs.tree.getCheckedKeys().join(',') : '';
                    //发起post请求，请求接口项目中的角色添加接口，完成数据的保存

                    this.$http.post(url,data).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/role')
                        }else{
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'error'
                            });
                        }
                    })
                }
            });
        }
    }
}
</script>

<style scoped>
    .el-form{
        margin:20px;
    }
</style>