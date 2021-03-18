<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/goods">商品列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>商品{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form 
            label-width="80px" 
            style="width:800px;"
            :rules="rules"
            :model="info"
            ref="goodForm"
        >
            <el-form-item label="一级分类" prop="first_cateid">
                <!-- 切换一级分类，让二级分类的内容进行联动 -->
                <el-select 
                    v-model="info.first_cateid" 
                    placeholder="请选择"
                    @change="cateChange"
                >
                    <el-option value="">请选择</el-option>
                    <el-option 
                        v-for="cateitem of cates" 
                        :key="cateitem.id"
                        :value="cateitem.id"
                        :label="cateitem.catename"
                    >{{ cateitem.catename }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="first_cateid">
                <el-select v-model="info.second_cateid" placeholder="请选择">
                    <el-option value="">请选择</el-option>
                    <el-option 
                        v-for="seconditem of secondCates" 
                        :key="seconditem.id"
                        :value="seconditem.id"
                        :label="seconditem.catename"
                    >{{ seconditem.catename }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品名称" prop="goodsname">
                <el-input v-model="info.goodsname"></el-input>
            </el-form-item>
            <el-form-item label="价格" prop="price">
                <el-input v-model.number="info.price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="市场价格" prop="market_price">
                <el-input v-model.number="info.market_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="图片">
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
            <el-form-item label="商品规格" prop="specsid">
                <el-select 
                    placeholder="请选择"
                    @change="specsChange"
                    v-model="info.specsid"
                >
                    <el-option value="">请选择</el-option>
                    <el-option 
                        v-for="specsitem of specsarr" 
                        :key="specsitem.id"
                        :value="specsitem.id"
                        :label="specsitem.specsname"
                    >{{ specsitem.specsname }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="规格属性">
                <el-select v-model="info.specsattr" placeholder="请选择" multiple>
                    <el-option value="">请选择</el-option>
                    <el-option 
                        v-for="(attritem,attrindex) of specsattrs" 
                        :key="attrindex"
                        :value="attritem"
                        :label="attritem"
                    >{{ attritem }}</el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否新品">
                <el-radio v-model="info.isnew" :label="1">是</el-radio>
                <el-radio v-model="info.isnew" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="是否热卖">
                <el-radio v-model="info.ishot" :label="1">是</el-radio>
                <el-radio v-model="info.ishot" :label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item label="商品描述">
                <div id="desc"></div>
            </el-form-item>
            
            <el-form-item>
                <el-button type="primary" @click="submitInfo('goodForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import E from 'wangeditor'
export default {
    data(){
        return{
            dialogVisible:false,
            dialogImageUrl:'',
            fileList:[],
            tip:'添加',
            info:{
                first_cateid:'',
                second_cateid:'',
                goodsname:'',
                price:'',
                market_price:'',
                specsid:'',
                specsattr:'',
                description:'',
                isnew:1,
                ishot:1,
                status:true
            },
            img:'',
            rules:{
                first_cateid:[
                    { required:true,message:'请选择一级分类' }
                ],
                second_cateid:[
                    { required:true,message:'请选择二级分类' }
                ],
                goodsname:[
                    { required:true,message:'商品名称不能为空',trigger:'blur' },
                    { min:1,max:100,message:'商品名称长度不符合要求' }
                ]
            },
            cates:[],
            secondCates:[],
            specsarr:[],
            specsattrs:[],
            editor:null
        }
    },
    mounted(){
        this.editor = new E("#desc");
        this.editor.create();
        this.$http.get(this.$apis.catelist,{pid:0}).then(res=>{
            this.cates = res.data.list;
        });
        this.$http.get(this.$apis.specslist).then(res=>{
            this.specsarr = res.data.list;
        })
        if(this.$route.params.id){
            this.tip = '修改';
            //获取到当前路由地址编号对应的商品分类信息
            this.$http.get(this.$apis.goodsinfo,{id:this.$route.params.id}).then(res=>{
                this.info = res.data.list;
                //根据一级分类，获取到相应的二级分类
                this.cateChange(this.info.first_cateid);
                if(this.info.specsid){
                    //根据规格信息，获取到相应的规格属性
                    this.specsChange(this.info.specsid)
                }
                this.fileList = this.info.img ? [{ url : this.info.img}] : [];
                //处理和数据库中不一样的数据类型
                this.info.status = this.info.status == 1 ? true : false;
                this.info.specsattr = this.info.specsattr ? this.info.specsattr.split(',') : [];
                this.editor.txt.html(this.info.description);
            })
        }
    },
    methods:{
        //商品规格选择
        specsChange(e){
            if(e==""){
                return false;
            }
            this.$http.get(this.$apis.specsinfo,{id:e}).then(res=>{
                if(res.data.code === 200){
                    this.specsattrs = res.data.list ? res.data.list[0].attrs : [];
                }
            })
        },
        //一级分类选择
        cateChange(e){
            if(e==""){
                return false;
            }
            this.$http.get(this.$apis.catelist,{pid:e}).then(res=>{
                this.secondCates = res.data.list;
            })
        },
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
                    data.description = this.editor.txt.html();
                    //如果现在访问的是动态路由，则执行修改操作，否则执行添加操作
                    let url = this.$apis.goodsadd;
                    if(this.$route.params.id){
                        url = this.$apis.goodsedit;
                        data.id = this.$route.params.id;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    data.specsattr = data.specsattr ? data.specsattr.join(',') : '';
                    //处理包含文件的表单 
                    let form = new FormData();
                    for(let i in data){
                        form.append(i,data[i]);
                    }
                    if(this.img){
                        form.append('img',this.img);
                    }
                    //发起post请求，请求接口项目中的商品分类添加接口，完成数据的保存
                    this.$http.post(url,form).then(res=>{
                        if(res.data.code == 200){
                            this.$router.push('/goods')
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