<template>
    <el-container>
        <v-nav></v-nav>
        <el-container>
            <el-header>
                <span>{{ userInfo.username }}</span>
                <el-dropdown>
                    <i class="el-icon-setting" style="margin-right: 15px"></i>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>
                            <el-link @click="logout">退出</el-link>
                        </el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-header>
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
import vNav from "../views/Nav";
import { mapGetters,mapActions } from 'vuex'
export default {
    computed:{
        ...mapGetters(['userInfo'])
    },
    methods: {
        ...mapActions(['userLogoutSync']),
        logout() {
            this.userLogoutSync()
            this.$router.push("/login");
        }
    },
    components: {
        vNav
    }
};
</script>

<style>
.el-container {
    width: 100%;
    height: 100%;
}
.el-header {
    background-color: #b3c0d1;
    line-height: 60px;
    text-align: right; 
    font-size: 12px
}
.el-header .right {
    position: absolute;
    right: 20px;
    display: flex;
}
</style>
