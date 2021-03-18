<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>会员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-table :data="members" style="width:100%" border stripe>
            <el-table-column
                prop="id"
                label="用户编号"
                width="80px"
            ></el-table-column>
            <el-table-column prop="nickname" label="昵称"></el-table-column>
            <el-table-column prop="phone" label="手机号"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.status == 1">启用</el-tag>
                    <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <el-button type="primary" @click="edit(item.row.uid)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data() {
        return {
            members: []
        };
    },
    mounted() {
        this.$http.get(this.$apis.memberlist).then(res => {
            if(res.data.code == 200){
                this.members = res.data.list;
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        });
    },
    methods: {
        edit(id) {
            this.$router.push("/member/" + id);
        }
    }
};
</script>

<style></style>
