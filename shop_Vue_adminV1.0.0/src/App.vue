<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
    *{
        margin:0;padding:0;
    }
    html,body,#app{
        width:100%;
        height:100%;
    }
    .el-breadcrumb{
        margin-bottom:20px;
    }
    .el-pagination{
        float:right;
        margin-top:10px;
    }
</style>
