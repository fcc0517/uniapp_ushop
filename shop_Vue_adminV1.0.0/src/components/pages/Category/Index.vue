<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/category/add')" type="primary">添加</el-button>
        <el-table 
            :data="categorys" 
            style="width:100%" 
            border 
            stripe
            row-key="id"
            :tree-props="{children: 'children'}"
        >
            <el-table-column prop="id" label="分类编号" width="80px"></el-table-column>
            <el-table-column prop="catename" label="分类名称"></el-table-column>
            <el-table-column label="图片">
                <template slot-scope="item" v-if="item.row.img">
                    <img style="width:100px;height:100px;" :src="item.row.img" />
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
            categorys: []
        };
    },
    mounted() {
        this.$http.get(this.$apis.catelist,{istree:1}).then(res=>{
            if(res.data.code == 200){
                this.categorys = res.data.list;
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
            this.$router.push('/category/'+id)
        },
        del(id) {
            this.$confirm("此操作将永久删除该分类, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.catedelete, { id:id }).then(res => {
                    if (res.data.code === 200) {
                        this.$router.push('/category')
                    } else {
                        this.$message({
                            showClose: true,
                            message: res.data.msg,
                            type: 'error'
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
