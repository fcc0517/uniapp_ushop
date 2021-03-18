<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/user/add')" type="primary">添加</el-button>
        <el-table 
            :data="users" 
            style="width:100%" 
            border 
            stripe
        >
            <el-table-column prop="id" label="用户编号" width="80px"></el-table-column>
            <el-table-column prop="username" label="用户名"></el-table-column>
            <el-table-column prop="rolename" label="所属角色"></el-table-column>
            <el-table-column label="状态">
                <template slot-scope="item">
                    <el-tag effect="dark" v-if="item.row.status == 1">启用</el-tag>
                    <el-tag effect="dark" type="danger" v-else>禁用</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="item">
                    <el-button type="primary" @click="edit(item.row.uid)">编辑</el-button>
                    <el-button type="danger" @click="del(item.row.uid)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 
            分页组件
                current-change 页码点击的事件
                page-size 每页展示的数据条数
                total   总数据条数
                background 背景
         -->
        <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pagesize"
            :total="total"
            @current-change="(n)=>pageChange(n)"
        >
        </el-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            users: [],
            total:0,//用户总数
            pagesize:2,//每页显示的条数
            nowpage:1//当前页
        };
    },
    mounted() {
        this.getCount();
        this.getPage();
    },
    methods: {
        getCount(){
            //获取用户的总数，用于计算分页
            this.$http.get(this.$apis.usercount).then(res=>{
                if(res.data.code == 200){
                    this.total = res.data.list[0].total;
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            });
        },
        getPage(){
            this.$http.get(this.$apis.userlist,{page:this.nowpage,size:this.pagesize}).then(res=>{
                if(res.data.code == 200){
                    this.users = res.data.list;
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'error'
                    });
                }
            });
        },
        pageChange(n){
            this.nowpage = n;
            this.getPage()
        },
        edit(id){
            this.$router.push('/user/'+id)
        },
        del(id) {
            this.$confirm("此操作将永久删除该用户, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.userdelete,{ uid:id }).then(res => {
                    if (res.data.code === 200) {
                        this.getPage();
                        this.$message({
                            type: "success",
                            message: "删除成功!"
                        });
                    } else {
                        this.$message({
                            showClose:true,
                            type: "error",
                            message: res.data.msg
                        });
                    }
                });
            });
        }
    }
};
</script>

<style></style>
