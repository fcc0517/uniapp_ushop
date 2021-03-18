<template>
    <div>
        <!-- 绘制图表的容器，要有宽度和高度 -->
        <div id="main" style="width:100%;height:400px;"></div>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    data(){
        return{
            charts:'',
            orderData:["313","340","110","480","390","700","810"]
        }
    },
    methods:{
        drawLine(){
            // 基于准备好的dom，初始化echarts实例
            this.charts = echarts.init(document.getElementById('main'));
            // 使用刚指定的配置项和数据显示图表。
            this.charts.setOption({
                title: {
                    text: '近一周订单数量'
                },
                tooltip: {},
                legend: {
                    data:['近一周订单数量']
                },
                xAxis: {
                    type:'category',
                    data: ["周一","周二","周三","周四","周五","周六","周日"]
                },
                yAxis: {},
                series: [{
                    name: '近一周订单数量',
                    type: 'line',//折线图
                    data: this.orderData
                }]
            });
        }
    },
    mounted(){
        this.drawLine();
    }
}
</script>

<style>

</style>