<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/user">管理员列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>用户{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="userForm"
        >
            <el-form-item label="所属角色" prop="roleid">
                <el-select v-model="info.roleid" placeholder="请选择">
                    <el-option value="">请选择</el-option>
                    <el-option 
                        v-for="roleitem of roles" 
                        :key="roleitem.id" 
                        :value="roleitem.id"
                        :label="roleitem.rolename"
                    >{{ roleitem.rolename }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="info.username"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="info.password"></el-input>
                <span v-if="tip == '修改'">留空则不修改</span>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('userForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tip:'添加',
            info:{
                roleid:'',
                username:'',
                password:'',
                status:true
            },
            rules:{
                roleid:[
                    { required:true,message:'请选择所属角色' }
                ],
                username:[
                    { required:true,message:'用户名不能为空',trigger:'blur' },
                    { min:1,max:20,message:'用户名长度不符合要求' }
                ]
            },
            users:[],
            roles:[]
        }
    },
    mounted(){
        //获取到已经添加的角色
        this.$http.get(this.$apis.rolelist).then(res=>{
            this.roles = res.data.list//把接口返回的数据赋值给页面中的变量，用于页面展示内容
        })
        if(this.$route.params.userid){
            this.tip = '修改';
            //获取到当前路由地址编号对应的用户信息
            this.$http.get(this.$apis.userinfo,{uid:this.$route.params.userid}).then(res=>{
                this.info = res.data.list;
                //处理和数据库中不一样的数据类型
                this.info.password = '';//因为密码是加密的，留空则不修改密码
                this.info.status = this.info.status == 1 ? true : false;
                
            })
        }
    },
    methods:{
        submitInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证规则满足时，才执行数据添加操作
                    //获取一下表单中的数据，用JSON序列化一下，防止数据变化后页面跟着变化
                    let data = JSON.parse(JSON.stringify(this.info));
                    //如果现在访问的是动态路由，则执行修改操作，否则执行添加操作
                    let url = this.$apis.useradd;
                    if(this.$route.params.userid){
                        url = this.$apis.useredit;
                        data.id = this.$route.params.userid;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    //发起post请求，请求接口项目中的用户添加接口，完成数据的保存
                    this.$http.post(url,data).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/user')
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