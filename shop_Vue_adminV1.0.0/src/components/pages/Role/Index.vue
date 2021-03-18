<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/role/add')" type="primary"
            >添加</el-button
        >
        <el-table 
            :data="roles" 
            style="width:100%" 
            border 
            stripe
        >
            <el-table-column prop="id" label="角色编号" width="80px"></el-table-column>
            <el-table-column prop="rolename" label="角色名称"></el-table-column>
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
            roles: []
        };
    },
    mounted() {
        this.$http.get(this.$apis.rolelist).then(res=>{
            if(res.data.code == 200){
                this.roles = res.data.list;
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
        edit(rid){
            this.$router.push('/role/'+rid)
        },
        del(id) {
            this.$confirm("此操作将永久删除该角色, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.roledelete,{id}).then(res => {
                    if (res.data.code === 200) {
                        this.roles = res.data.list;//给页面中的数据重新赋值，实现数据变化，页面自动渲染的效果
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
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
