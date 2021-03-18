<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/specs">规格列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>规格{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="specsForm"
        >
            <el-form-item label="规格名称" prop="specsname">
                <el-input v-model="info.specsname"></el-input>
            </el-form-item>
            <!-- 根据属性值数组来动态生成页面结构 -->
            <el-form-item label="规格属性" v-for="(item,index) of specsAttrs" :key="index">
                <div class="attritem">
                    <el-input v-model="item.value"></el-input>
                    <el-button @click="addAttr" v-if="index == 0" type="primary">新增规格属性</el-button>
                    <el-button @click="removeAttr(index)" v-else type="danger">删除</el-button>
                </div>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('specsForm')">{{ tip }}</el-button>
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
                specsname:'',
                status:true
            },
            specsAttrs:[
                { value:'' }
            ],
            rules:{
                specsname:[
                    { required:true,message:'规格名称不能为空',trigger:'blur' },
                    { min:1,max:20,message:'规格名称长度不符合要求' }
                ]
            }
        }
    },
    mounted(){
        if(this.$route.params.id){
            this.tip = '修改';
            //获取到当前路由地址编号对应的规格信息
            this.$http.get(this.$apis.specsinfo,{id:this.$route.params.id}).then(res=>{
                this.info = res.data.list[0];
                //处理和数据库中不一样的数据类型
                this.info.status = this.info.status == 1 ? true : false;
                //处理规格属性
                this.info.attrs.map((d,i)=>{
                    if(i==0){
                        this.specsAttrs[0].value = d
                    }else{
                        this.specsAttrs.push({value:d})
                    }
                })
            })
        }
    },
    methods:{
        addAttr(){
            if(this.specsAttrs.length<=5){
                this.specsAttrs.push({
                    value:''
                })
            }
        },
        removeAttr(i){
            this.specsAttrs.splice(i,1)
        },
        submitInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.info));
                    let url = this.$apis.specsadd;
                    if(this.$route.params.id){
                        url = this.$apis.specsedit;
                        data.id = this.$route.params.id;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    let arr = [];
                    this.specsAttrs.map(item=>{
                        arr.push(item.value);
                    })
                    data.attrs = arr ? arr.join(',') : '';
                    //发起post请求，请求接口项目中的规格添加接口，完成数据的保存
                    this.$http.post(url,data).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/specs')
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
    .attritem{
        display:flex;
    }
</style>