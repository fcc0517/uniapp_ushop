<template>
	<div>
		<el-breadcrumb separator=">">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="javascript:;">活动列表</a></el-breadcrumb-item>
		</el-breadcrumb>
		<div class="app-container">
			<el-button type="primary" @click="$router.push('/seckill/add')">添加</el-button>
			<!-- 限时秒杀列表 -->
			<el-table
				:data="secks"
				border
				row-key="id"
				style="width: 100%"
			>
				<el-table-column label="活动名称" prop="title" width="180"></el-table-column>
				<el-table-column label="状态" width="100">
					<template slot-scope="scope">
						<el-tag effect="dark" type="success" v-if="scope.row.status===1">启用</el-tag>
						<el-tag effect="dark" type="danger" v-else>禁用</el-tag>
					</template>
				</el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
						<el-button type="danger" @click="del(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</div>
	</div>
</template>
<script>
export default {
	data() {
		return {
            secks:[]
		}
	},
	methods: {
		edit(id) {
			this.$router.push('/seckill/'+id)
		},
		del(id) {
			this.$http.post(this.$apis.seckdelete, { id }).then(res => {
                if(res.data.code == 200){
                    this.secks = res.data.list;
                }else{
                    this.$message({
                        showClose: true,
                        message: res.data.msg,
                        type: 'error'
                    });
                }
			})
        }
	},
	mounted() {
		this.$http.get(this.$apis.secklist).then(res => {
            if(res.data.code == 200){
                this.secks = res.data.list || [];
            }else{
                this.$message({
                    showClose: true,
                    message: res.data.msg,
                    type: 'error'
                });
            }
        })
	}
}
</script>

<style>
</style>