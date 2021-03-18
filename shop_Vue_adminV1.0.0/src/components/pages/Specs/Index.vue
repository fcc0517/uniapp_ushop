<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }" >首页</el-breadcrumb-item>
            <el-breadcrumb-item>规格列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/specs/add')" type="primary"
            >添加</el-button
        >
        <el-table 
            :data="specsarr" 
            style="width:100%" 
            border 
            stripe
        >
            <el-table-column prop="id" label="规格编号" width="80px"></el-table-column>
            <el-table-column prop="specsname" label="规格名称" width="150"></el-table-column>
            <el-table-column label="规格属性">
                <template slot-scope="scope">
                    <el-tag type="primary" v-for="(item,index) of scope.row.attrs" :key="index">{{ item }}</el-tag>
                </template>
            </el-table-column>
            <el-table-column label="状态" width="80">
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
            specsarr: [],
            totalNum:0,
            pageSize:10,
            page:1
        };
    },
    mounted() {
        this.$http.get(this.$apis.specscount).then(res=>{
            if(res.data.code == 200){
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
            this.$http.get(this.$apis.specslist,{size:this.pageSize,page:this.page}).then(res=>{
                if(res.data.code == 200){
                    this.specsarr = res.data.list;
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
            this.$router.push('/specs/'+id)
        },
        del(id) {
            this.$confirm("此操作将永久删除该商品规格, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.specsdelete,{id}).then(res => {
                    if (res.data.code === 200) {
                        this.specsarr = res.data.list;//给页面中的数据重新赋值，实现数据变化，页面自动渲染的效果
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
