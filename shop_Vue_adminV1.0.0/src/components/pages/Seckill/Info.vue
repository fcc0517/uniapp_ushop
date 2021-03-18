<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{path:'/home'}">首页</el-breadcrumb-item>
            <el-breadcrumb-item>
                <a href="#/seckill">活动列表</a>
            </el-breadcrumb-item>
            <el-breadcrumb-item>活动{{ tip }}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-form
            :model="info"
            :rules="rules"
            ref="seckForm"
            label-width="100px"
            style="width:600px;"
        >
            <el-form-item label="活动名称" prop="title">
                <el-input v-model="info.title"></el-input>
            </el-form-item>
            <el-form-item label="活动期限">
                <el-date-picker
                    v-model="dateVal"
                    value-format="timestamp"
                    type="datetimerange"
                    :picker-options="pickerOptions"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                    @change="timeChange"
                >
                </el-date-picker>
            </el-form-item>
            <el-form-item label="一级分类" prop="first_cateid">
                <el-select 
                    v-model="info.first_cateid" 
                    placeholder="请选择分类"
                    @change="cateChange"
                >
                    <el-option
                        v-for="item in firstarr"
                        :key="item.id"
                        :label="item.catename"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="二级分类" prop="second_cateid">
                <el-select 
                    v-model="info.second_cateid" 
                    placeholder="请选择分类"
                    @change="getGoods()"
                >
                    <el-option
                        v-for="item in secondarr"
                        :key="item.id"
                        :label="item.catename"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商品">
                <el-select v-model="info.goodsid" placeholder="请选择商品">
                    <el-option
                        v-for="item in goodsarr"
                        :key="item.id"
                        :label="item.goodsname"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-switch v-model="info.status"></el-switch>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitInfo('seckForm')">{{ tip }}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        return{
            tip:'添加',
            info: {
                title: '',
                begintime:'',
                endtime:'',
                first_cateid:'',
                second_cateid:'',
                goodsid:'',
				status: true
			},
			rules: {
				title: [
					{ required: true, message: "请输入限时秒杀名称", trigger: "blur" },
					{ min: 2, max: 20, message: "长度在 2 到 20 个字符", trigger: "blur" }
				]
			},
			pickerOptions: {
				shortcuts: [{
					text: '最近一周',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近一个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
						picker.$emit('pick', [start, end]);
					}
				}, {
					text: '最近三个月',
					onClick(picker) {
						const end = new Date();
						const start = new Date();
						start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
						picker.$emit('pick', [start, end]);
					}
				}]
			},
            dateVal: [],
            firstarr: [],
            secondarr:[],
            goodsarr:[]
        }
    },
    mounted(){
        if(this.$route.params.id){
            this.tip = '修改';
            this.getCategory();
            //获取到当前路由地址编号对应的活动信息
            this.$http.get(this.$apis.seckinfo,{id:this.$route.params.id}).then(res=>{
                this.info = res.data.list;
                //处理和数据库中不一样的数据类型
                this.info.status = this.info.status == 1 ? true : false;
                this.getCategory(this.info.first_cateid);
                this.dateVal = [this.info.begintime,this.info.endtime]
                this.$http.get(this.$apis.goodslist,{fid:this.info.first_cateid,sid:this.info.second_cateid}).then(res=>{
                    this.goodsarr = res.data.list || [];
                });
            })
        }
        this.getCategory();
    },
    methods:{
        getCategory(pid=0){
            this.$http.get(this.$apis.catelist, { pid:pid }).then(res => {
                if(pid === 0){
                    this.firstarr = res.data.list;
                }else{
                    this.secondarr = res.data.list;
                }
			})
        },
        cateChange(e){
            this.secondarr = [];
            this.getCategory(e)
        },
        getGoods(){
            this.$http.get(this.$apis.goodslist,{fid:this.info.first_cateid,sid:this.info.second_cateid}).then(res=>{
                this.goodsarr = res.data.list || []
            })
        },
        timeChange(e){
            this.info.begintime = e[0];
            this.info.endtime = e[1];
        },
        submitInfo(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let data = JSON.parse(JSON.stringify(this.info));
                    let url = this.$apis.seckadd;
                    if(this.$route.params.id){
                        url = this.$apis.seckedit;
                        data.id = this.$route.params.id;//执行修改接口时的必要条件
                    }
                    //数据库中的status字段不是布尔值，所以要自行转换一下
                    data.status = data.status ? 1 : 2;
                    this.$http.post(url, data).then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                showClose: true,
                                message: res.data.msg,
                                type: 'success'
                            });
                            this.$router.push('/seckill')
                        } else {
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