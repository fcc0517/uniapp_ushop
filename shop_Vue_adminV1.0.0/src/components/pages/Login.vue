<template>
    <div class="bg">
        <el-form 
            label-width="80px" 
            style="width:500px;"
            :model="info"
            :rules="rules"
            ref="loginForm"
            class="login"
        >
            <h2 class="h2">登录</h2>
            <el-form-item prop="username">
                <el-input v-model="info.username" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input type="password" v-model="info.password"  placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('loginForm')">登录</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
    data(){
        return{
            info:{
                username:'',
                password:''
            },
            rules:{
                username:[
                    { required:true,message:'请填写用户名' }
                ],
                password:[
                    { required:true,message:'请填写密码',trigger:'blur' }
                ]
            }
        }
    },
    methods:{
        ...mapActions(['userLoginSync']),
        submitInfo(formName){
            //表单验证
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.userLoginSync(this.info).then(res=>{
                        if(res.data.code == 200){
                            sessionStorage.setItem('token',res.data.list.token)
                            this.$router.push('/home')
                        }
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
    .bg{
        width:100%;
        height:100%;
        background: -webkit-linear-gradient(left,#563443,#413a53,#2f3d60);
        position: fixed;
    }
    .login{
        width:300px;
        height: 300px;
        background-color: #fff;
        border-radius: 10px;
        position: absolute;
        top:50%;
        left:50%;
        margin:-250px 0 0 -250px;
    }
    .el-button{
        width:100%;
    }
    .el-form-item{
        margin-top:20px;
        width:80%;
    }
    .h2{
        text-align: center;
        margin-top:30px;
    }
</style>