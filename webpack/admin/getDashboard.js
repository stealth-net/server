import { getData } from "./frontend.js";

const dashboardCharts = document.querySelectorAll(".chartlist > *[apiname]");

dashboardCharts.forEach(async chartElement => {
    var chart = echarts.init(chartElement);

    const response = ((await getData("/admin-api/v1/get-analytics"))[chartElement.getAttribute("apiname")]);

    if(!response) return;

    const chartData = {
        xData: getFormattedDates(response),
        yData: getScore(response)
    }

    chart.setOption({
        title: {
            text: chartElement.getAttribute("name"),
            textStyle: {
                color: "#8B91C3"
            }
        },
        backgroundColor: "#1D1D2F",
        xAxis: {
            data: chartData.xData,
            axisLine: {
                lineStyle: {
                    color: "#8B91C3"
                }
            }
        },
        yAxis: {
            axisLine: {
                lineStyle: {
                    color: "#8B91C3"
                }
            }
        },
        series: [{
            type: "line",
            data: chartData.yData,
            lineStyle: {
                color: "#9EA4D6"
            },
            itemStyle: {
                color: "#AAB1EC"
            },
            symbol: "circle",
            symbolSize: 8 
        }]
    });
});