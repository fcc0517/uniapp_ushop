<template>
    <el-aside style="width:152px;">
          <!-- 
              background-color  导航菜单背景颜色
              text-color        导航菜单文字颜色
              active-text-color 导航菜单选中后文字颜色
              router            是否使用 vue-router 的模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
              index             submenu的唯一标识
           -->
        <el-menu 
            class="el-menu-vertical-demo"
            background-color="#20222a"
            text-color="#fff"
            active-text-color="#ffd04b"
            router
            unique-opened
            :default-active="defaultActive"
        >
            <el-menu-item index="/home">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <!-- 遍历一级菜单信息，生成submenu组件 -->
            <el-submenu 
                v-for="(navitem,index) of userInfo.menus" 
                :key="navitem.id"
                :index="index.toString()"
            >
                <template slot="title">
                <i :class="navitem.icon"></i>
                <span>{{ navitem.title }}</span>
                </template>
                <el-menu-item-group>
                    <!-- 遍历一级菜单下的二级菜单，生成具体的菜单项 -->
                    <el-menu-item 
                        v-for="subitem of navitem.children" 
                        :key="subitem.id" :index="subitem.url"
                    >{{ subitem.title }}</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </el-aside>
</template>
<script>
import { mapGetters } from 'vuex';
export default {
    data(){
        return{
            defaultActive:''
        }
    },
    computed:{
        ...mapGetters(['userInfo'])
    },
    mounted(){
        //页面加载时，控住左侧菜单选中效果
        //把当前路由中的meta的自定义属性赋值给默认选中变量
        this.defaultActive = this.$route.meta.select;
    },
    watch:{
        $route(newVal){
            this.defaultActive = newVal.meta.select;
        }
    }
}
</script>
<style scoped>

.el-aside {
  background-color: #20222a;
}
.el-submenu .el-menu-item{
    min-width: 148px;
}
</style>