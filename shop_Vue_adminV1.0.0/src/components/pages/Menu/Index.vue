<template>
    <div>
        <!-- 面包屑导航 -->
        <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }"
                >首页</el-breadcrumb-item
            >
            <el-breadcrumb-item>菜单列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-button @click="$router.push('/menu/add')" type="primary"
            >添加</el-button
        >
        <!-- 
            row-key 展示数据结构时必须设置的属性，值为唯一标识数据的值
            tree-props告知表格，子级数据的字段名
        -->
        <el-table 
            :data="menus" 
            style="width:100%" 
            border 
            stripe
            row-key="id"
            :tree-props="{children: 'children'}"
        >
            <el-table-column
                prop="id"
                label="菜单编号"
                width="80px"
            ></el-table-column>
            <el-table-column prop="title" label="菜单名称"></el-table-column>
            <el-table-column prop="icon" label="菜单图标"></el-table-column>
            <el-table-column prop="url" label="菜单地址"></el-table-column>
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
import { mapActions,mapGetters } from 'vuex'
export default {
    data() {
        return {
            menus: [],
            defaultProps:{
                children: 'children',
                label:'title'
            }
        };
    },
    mounted() {
        this.getNavMenuSync({istree:1}).then(res=>{
            if(res.data.code == 200){
                this.menus = res.data.list;
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
        ...mapActions(['getNavMenuSync']),
        edit(mid){
            this.$router.push('/menu/'+mid)
        },
        del(id) {
            this.$confirm("此操作将永久删除该菜单, 是否继续?", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning"
            }).then(() => {
                //点击确定执行的代码
                this.$http.post(this.$apis.menudelete,{ id:id }).then(res => {
                    if (res.data.code === 200) {
                        this.menus = res.data.list;//给页面中的数据重新赋值，实现数据变化，页面自动渲染的效果
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
