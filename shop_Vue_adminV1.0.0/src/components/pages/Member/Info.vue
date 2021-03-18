<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/member">会员列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>会员{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="memberForm"
        >
            <el-form-item label="手机号" prop="phone">
                <el-input v-model="info.phone"></el-input>
            </el-form-item>
            <el-form-item label="昵称" prop="nickname">
                <el-input v-model="info.nickname"></el-input>
            </el-form-item>
             <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="info.password"></el-input>
                <span v-if="tip == '修改'">留空则不修改</span>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('memberForm')">{{ tip }}</el-button>
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
                phone:'',
                nickname:'',
                password:'',
                status:true
            },
            rules:{
                phone:[
                    { required:true,message:'手机号不能为空' },
                    { min:11,max:11,message:'手机号长度不符合要求' }
                ],
                nickname:[
                    { required:true,message:'会员名不能为空',trigger:'blur' },
                    { min:1,max:20,message:'会员名长度不符合要求' }
                ]
            }
        }
    },
    mounted(){
        //获取到已经添加的角色
        this.$http.get('/api/rolelist').then(res=>{
            this.roles = res.data.list//把接口返回的数据赋值给页面中的变量，用于页面展示内容
        })
        if(this.$route.params.id){
            this.tip = '修改';
            //获取到当前路由地址编号对应的会员信息
            this.$http.get(this.$apis.memberinfo,{uid:this.$route.params.id}).then(res=>{
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
                    let data = JSON.parse(JSON.stringify(this.info));
                    let url = this.$apis.memberadd;
                    if(this.$route.params.id){
                        url = this.$apis.memberedit;
                        data.id = this.$route.params.id;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    //发起post请求，请求接口项目中的会员添加接口，完成数据的保存
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