<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>轮播图列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/banner/add')" type="primary">添加</el-button>
        <el-table 
            :data="banners" 
            style="width:100%" 
            border 
            stripe
        >
            <el-table-column prop="id" label="编号" width="80px"></el-table-column>
            <el-table-column prop="title" label="轮播图标题"></el-table-column>
            <el-table-column label="图片">
                <template slot-scope="item">
                    <img style="width:100px;height:100px;" :src="item.row.img" alt="" />
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.status == 1">启用</el-tag>
                    <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <el-button type="primary" @click="edit(item.row.id)">编辑</el-button>
                    <el-button type="danger" @click="del(item.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            banners: []
        };
    },
    mounted() {
        this.$http.get(this.$apis.bannerlist).then(res=>{
            if(res.data.code == 200){
                this.banners = res.data.list;
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        })
    },
    methods: {
        edit(id){
            this.$router.push('/banner/'+id)
        },
        del(id) {
            this.$confirm("此操作将永久删除该轮播图, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.bannerdelete, { id:id }).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                        this.banners = res.data.list;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.data.msg
                        });
                    }
                });
            }).catch(() => {
                //点击取消执行的代码
                this.$message({
                    type: "info",
                    message: "已取消删除"
                });
            });
        }
    }
};
</script>

<style></style>
