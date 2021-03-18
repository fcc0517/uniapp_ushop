<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/category">商品分类列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>商品分类{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:600px;"
            :rules="rules"
            :model="info"
            ref="cateForm"
        >
            <el-form-item label="上级分类" prop="pid">
                <el-select v-model="info.pid" placeholder="请选择">
                    <el-option value="">请选择</el-option>
                    <el-option :value="0" label="顶级分类">顶级分类</el-option>
                    <el-option 
                        v-for="cateitem of cates" 
                        :key="cateitem.id"
                        :value="cateitem.id"
                        :label="cateitem.catename"
                    >{{ cateitem.catename }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类名称" prop="catename">
                <el-input v-model="info.catename"></el-input>
            </el-form-item>
            <el-form-item label="图片">
                <!-- 
                    上传组件
                        action 上传的服务器地址
                        list-type   文件列表的类型
                        on-preview  图片预览时执行的函数
                        on-remove   图片删除时执行的函数
                        auto-upload 是否选择完文件后自动上传，默认是true
                        on-change   文件选择好之后或者上传完成、失败后执行的函数
                 -->
                <el-upload
                    action="#"
                    list-type="picture-card"
                    :on-preview="handlePictureCardPreview"
                    :on-remove="handleRemove"
                    :auto-upload="false"
                    :on-change="fileChange"
                    :file-list="fileList"
                >
                    <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('cateForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            dialogVisible:false,
            dialogImageUrl:'',
            fileList:[],
            tip:'添加',
            info:{
                pid:'',
                img:'',
                catename:'',
                status:true
            },
            img:'',
            rules:{
                pid:[
                    { required:true,message:'请选择上级分类' }
                ],
                catename:[
                    { required:true,message:'商品分类名称不能为空',trigger:'blur' },
                    { min:1,max:20,message:'商品分类名称长度不符合要求' }
                ]
            },
            cates:[]
        }
    },
    mounted(){
        this.$http.get('/api/catelist').then(res=>{
            this.cates = res.data.list;
        })
        if(this.$route.params.id){
            this.tip = '修改';
            //获取到当前路由地址编号对应的商品分类信息
            this.$http.get(this.$apis.cateinfo,{id:this.$route.params.id}).then(res=>{
                this.info = res.data.list;
                this.fileList = this.info.img ? [{ url : this.info.img}] : [];
                //处理和数据库中不一样的数据类型
                this.info.status = this.info.status == 1 ? true : false;
            })
        }
    },
    methods:{
        handlePictureCardPreview(file){
            this.dialogImageUrl = file.url;
            this.dialogVisible = true;
        },
        handleRemove(){},
        fileChange(file){
            this.img = file.raw;
        },
        submitInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    //验证规则满足时，才执行数据添加操作
                    //获取一下表单中的数据，用JSON序列化一下，防止数据变化后页面跟着变化
                    let data = JSON.parse(JSON.stringify(this.info));
                    //如果现在访问的是动态路由，则执行修改操作，否则执行添加操作
                    let url = this.$apis.cateadd;
                    if(this.$route.params.id){
                        url = this.$apis.cateedit;
                        data.id = this.$route.params.id;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    //处理包含文件的表单
                    let form = new FormData();
                    for(let i in data){
                        form.append(i,data[i]);
                    }
                    form.append('img',this.img);
                    //发起post请求，请求接口项目中的商品分类添加接口，完成数据的保存
                    this.$http.post(url,form).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/category')
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