<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/menu">菜单列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>菜单{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- el-form验证时使用的属性
                rules   表单的验证规则
                model   表单验证时使用的数据
         -->
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="menuForm"
        >
            <el-form-item label="菜单名称" prop="title">
                <el-input v-model="info.title"></el-input>
            </el-form-item>
            <el-form-item label="上级菜单" prop="pid">
                <el-select v-model="info.pid" filterable placeholder="请选择">
                    <!-- 
                        value 
                        label   设置选中的选项名称
                     -->
                    <el-option value="">请选择</el-option>
                    <el-option :value="0" label="顶级菜单">顶级菜单</el-option>
                    <!-- 
                        遍历已添加的菜单数据，用来生成动态的菜单选项
                    -->
                    <el-option 
                        v-for="menuitem of menus" 
                        :key="menuitem.id"
                        :value="menuitem.id"
                        :label="menuitem.title"
                    >{{ menuitem.title }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="菜单类型">
                <el-radio v-model="info.type" :label="1">目录</el-radio>
                <el-radio v-model="info.type" :label="2">菜单</el-radio>
            </el-form-item>
            <el-form-item v-show="info.type == 1" label="菜单图标">
                <el-input v-model.trim="info.icon"></el-input>
            </el-form-item>
            <el-form-item v-show="info.type == 2" label="菜单地址">
                <el-input v-model="info.url"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('menuForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
    data(){
        return{
            tip:'添加',
            info:{
                pid:'',
                title:'',
                type:1,
                icon:'',
                url:'',
                status:true
            },
            rules:{
                title:[
                    { required:true,message:'菜单名称不能为空',trigger:'blur' },
                    { min:1,max:20,message:'菜单名称长度不符合要求' }
                ],
                pid:[
                    { required:true,message:'请选择上级菜单' }
                ]
            },
            menus:[]
        }
    },
    computed:{
        ...mapGetters(['navMenuArr'])
    },
    mounted(){
        //获取到已经添加的菜单
        this.menus = this.navMenuArr;
        if(this.$route.params.menuid){
            this.tip = '修改';
            //获取到当前路由地址编号对应的菜单信息
            this.$http.get(this.$apis.menuinfo,{id:this.$route.params.menuid}).then(res=>{
                this.info = res.data.list;
                //处理和数据库中不一样的数据类型
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
                    let url = this.$apis.menuadd;
                    if(this.$route.params.menuid){
                        url = this.$apis.menuedit;
                        data.id = this.$route.params.menuid;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    //发起post请求，请求接口项目中的菜单添加接口，完成数据的保存
                    this.$http.post(url,data).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/menu')
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