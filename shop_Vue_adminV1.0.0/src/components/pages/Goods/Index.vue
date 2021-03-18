<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/goods/add')" type="primary">添加</el-button>
        <el-table 
            :data="goods" 
            style="width:100%" 
            border 
            stripe
        >
            <el-table-column prop="id" label="商品编号" width="80px"></el-table-column>
            <el-table-column prop="goodsname" label="商品名称"></el-table-column>
            <el-table-column prop="price" label="商品价格"></el-table-column>
            <el-table-column prop="market_price" label="市场价格"></el-table-column>
            <el-table-column label="图片">
                <template slot-scope="item">
                    <img style="width:100px;height:100px;" :src="item.row.img" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="是否新品">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.isnew == 1">是</el-tag>
                    <el-tag effect="dark" type="danger" v-else>否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="是否热卖">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.ishot == 1">是</el-tag>
                    <el-tag effect="dark" type="danger" v-else>否</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.status == 1">启用</el-tag>
                    <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="item">
                    <el-button type="primary" @click="edit(item.row.id)">编辑</el-button>
                    <el-button type="danger" @click="del(item.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination 
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="totalNum"
            @current-change="(n)=>pageChange(n)"
        ></el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            goods: [],
            totalNum:0,
            pageSize:10,
            page:1
        };
    },
    mounted() {
        this.$http.get(this.$apis.goodscount).then(res=>{
            if(res.data.code === 200){
                this.totalNum = res.data.list[0].total;
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        })
        this.getList();
    },
    methods: {
        getList(){
            this.$http.get(this.$apis.goodslist,{page:this.page,size:this.pageSize}).then(res=>{
                if(res.data.code == 200){
                    this.goods = res.data.list;
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            })
        },
        pageChange(n){
            this.page = n;
            this.getList();
        },
        edit(id){
            this.$router.push('/goods/'+id)
        },
        del(id) {
            this.$confirm("此操作将永久删除该商品, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.goodsdelete, { id:id }).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.goods = res.data.list;
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                });
            });
        }
    }
};
</script>

<style></style>
