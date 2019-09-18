let apex = {
    lineCharts: function(eleId, data, name, title) {
        let options = {
            chart: {
                height: '220px',
                width: '800px',
                type: "line",
                zoom: {
                    enabled: !1
                }
            },
            dataLabels: {
                enabled: !1
            },
            colors: ["#ffbc00"],
            stroke: {
                width: [4],
                curve: "straight"
            },
            series: [{
                name: name,
                data: []
            }],
            xaxis: {
                categories: []
            },
            title: {
                text: title,
                align: "center"
            },
            responsive: [{
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: !1
                        }
                    },
                    legend: {
                        show: !1
                    }
                }
            }]
        };
        /**
         * data:
         *   [{key:[val1, val2, val3]},{}]
         *   [{key:val},{}]
         */
        if (data) {
            data.forEach(function(ele) {
                ele.forEach(function(value, key) {
                    if (Array.isArray(value)) {
                    } else {
                        options.xaxis.categories.push(key);
                        options.series[0].data.push(value);
                    }
                });
            });
        }
        let chart = new ApexCharts(document.querySelector('#' + eleId), options);
        chart.render();
    },

    apexAreaCahrts: function () {
    },

    apexColumnCharts: function () {
    },
};

let chartjs = {
    lineCharts: function(eleId, data, name, title, refresh, canvas, step){
        let options = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    fill: false,
                    showLine: true,
                    borderColor: '#727cf5',
                    borderWidth: 2,
                    pointRadius: 0,
                    label: name,
                    data: []
                }]
            },
            options: {
                responsive: !0,
                maintainAspectRatio: !1,
                legend: {
                    display: !1
                },
                tooltips: {
                    intersect: !1
                },
                hover: {
                    intersect: !0
                },
                plugins: {
                    filler: {
                        propagate: !1
                    }
                },
                scales: {
                    xAxes: [{
                        reverse: !0,
                        gridLines: {
                            color: "rgba(0,0,0,0.05)"
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            stepSize: step
                        },
                        display: !0,
                        borderDash: [5, 5],
                        gridLines: {
                            color: "rgba(0,0,0,0)",
                            fontColor: "#fff"
                        }
                    }]
                }
            }
        };
        let more_datasets = {
            fill: false,
            showLine: true,
            borderColor: '#f5a657',
            borderWidth: 2,
            pointRadius: 0,
            label: '',
            data: []
        };
        let borderColors = ['#727cf5', '#f5b3d7', '#e5f579', '#f5a657'];
        /**
         * data:
         *   [{key:[val1, val2, val3]},{}]
         *   [{key:val},{}]
         */
        if(data) {
            data.forEach(function(ele) {
                ele.forEach(function(value, key) {
                    if(Array.isArray(value)) {
                        options.data.labels.push(key);
                        value.forEach(function(sub_value, sub_idx) {
                            options.data.datasets.push(more_datasets);
                            options.data.datasets[sub_idx].data.push(sub_value);
                            options.data.datasets[sub_idx].borderColor = borderColors[sub_idx];
                            if(Array.isArray(name) && name.length > sub_idx) {
                                options.data.datasets[sub_idx].label = name[sub_idx];
                            }
                        });
                    } else {
                        options.data.labels.push(key);
                        options.data.datasets[0].data.push(value);
                    }
                });
            });
        }
        // if (refresh) {
        //     canvas.data = {...options.data};
        //     canvas.update();
        // } else {
            let ctx = document.getElementById(eleId).getContext('2d');
            return new Chart(ctx, options);
        // }
    },

    areaCharts: function(eleId, data, name, title, refresh, canvas, step){
        let options = {
            type: 'line',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: "rgba(114, 124, 245, 0.3)",
                    borderColor: "#727cf5",
                    pointRadius: 0,
                    label: name,
                    data: []
                }]
            },
            options: {
                responsive: !0,
                maintainAspectRatio: !1,
                legend: {
                    display: !1
                },
                tooltips: {
                    intersect: !1
                },
                hover: {
                    intersect: !0
                },
                plugins: {
                    filler: {
                        propagate: !1
                    }
                },
                scales: {
                    xAxes: [{
                        reverse: !0,
                        gridLines: {
                            color: "rgba(0,0,0,0.05)"
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            stepSize: step
                        },
                        display: !0,
                        borderDash: [5, 5],
                        gridLines: {
                            color: "rgba(0,0,0,0)",
                            fontColor: "#fff"
                        }
                    }]
                }
            }
        };
        let more_datasets = {
            backgroundColor: "rgba(114, 124, 245, 0.3)",
            borderColor: "#727cf5",
            pointRadius: 0,
            label: '',
            data: []
        };
        let borderColors = ['#727cf5', '#f5b3d7', '#e5f579', '#f5a657'];
        /**
         * data:
         *   [{key:[val1, val2, val3]},{}]
         *   [{key:val},{}]
         */
        if(data) {
            data.forEach(function(ele) {
                ele.forEach(function(value, key) {
                    if(Array.isArray(value)) {
                        options.data.labels.push(key);
                        value.forEach(function(sub_value, sub_idx) {
                            options.data.datasets.push(more_datasets);
                            options.data.datasets[sub_idx].data.push(sub_value);
                            options.data.datasets[sub_idx].borderColor = borderColors[sub_idx];
                            if(Array.isArray(name) && name.length > sub_idx) {
                                options.data.datasets[sub_idx].label = name[sub_idx];
                            }
                        });
                    } else {
                        options.data.labels.push(key);
                        options.data.datasets[0].data.push(value);
                    }
                });
            });
        }
        // if (refresh) {
        //     canvas.data = {...options.data};
        //     canvas.update();
        // } else {
            let ctx = document.getElementById(eleId).getContext('2d');
            return new Chart(ctx, options);
        // }
    },

    barCharts: function(eleId, data, name, title, refresh, canvas, step){
        let backgroundColor = document.getElementById(eleId).getContext("2d").createLinearGradient(0, 500, 0, 150);
            backgroundColor.addColorStop(0, "#fa5c7c");
            backgroundColor.addColorStop(1, "#727cf5");
        let options = {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    backgroundColor: "#e3eaef",
                    borderColor: "#e3eaef",
                    hoverBackgroundColor: "#e3eaef",
                    hoverBorderColor: "#e3eaef",
                    label: name,
                    data: []
                }]
            },
            options: {
                responsive: !0,
                maintainAspectRatio: !1,
                legend: {
                    display: !1
                },
                tooltips: {
                    intersect: !1
                },
                hover: {
                    intersect: !0
                },
                plugins: {
                    filler: {
                        propagate: !1
                    }
                },
                barThickenss: 100,
                scales: {
                    xAxes: [{
                        categoryPercentage: 0.5,
                        barPercentage: 1.0,
                        reverse: !0,
                        gridLines: {
                            offsetGridLines: true,
                            color: "rgba(0,0,0,0.05)"
                        },
                        stacked: !1
                    }],
                    yAxes: [{
                        ticks: {
                            stepSize: step
                        },
                        stacked: !1,
                        display: !0,
                        borderDash: [5, 5],
                        gridLines: {
                            display: !1,
                            color: "rgba(0,0,0,0.05)",
                            fontColor: "#fff"
                        }
                    }]
                }
            }
        };
        let more_datasets = {
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
            hoverBackgroundColor: backgroundColor,
            hoverBorderColor: backgroundColor,
            label: '',
            data: []
        };
        let borderColors = ['#727cf5', '#f5b3d7', '#e5f579', '#f5a657'];
        /**
         * data:
         *   [{key:[val1, val2, val3]},{}]
         *   [{key:val},{}]
         */
        if(data) {
            data.forEach(function(ele) {
                ele.forEach(function(value, key) {
                    if(Array.isArray(value)) {
                        options.data.labels.push(key);
                        value.forEach(function(sub_value, sub_idx) {
                            options.data.datasets.push(more_datasets);
                            options.data.datasets[sub_idx].data.push(sub_value);
                            // options.data.datasets[sub_idx].borderColor = borderColors[sub_idx];
                            if(Array.isArray(name) && name.length > sub_idx) {
                                options.data.datasets[sub_idx].label = name[sub_idx];
                            }
                        });
                    } else {
                        options.options.legend.display = false;
                        options.data.labels.push(key);
                        options.data.datasets[0].data.push(value);
                    }
                });
            });
        }
        // if (refresh) {
        //     canvas.data = {...options.data};
        //     canvas.update();
        // } else {
            let ctx = document.getElementById(eleId).getContext('2d');
            return new Chart(ctx, options);
        // }
    }
};

let EChartsJs = {
    barCharts: function(eleId, data, name, title) {
        let myChart = echarts.init(document.getElementById(eleId));

        // 指定图表的配置项和数据
        let options = {
            title: {
                text: title
            },
            tooltip: {},
            legend: {
                show: false
            },
            xAxis: {
                data: []
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: []
            }]
        };
        /**
         * data:
         *   [{key:[val1, val2, val3]},{}]
         *   [{key:val},{}]
         */
        if(data) {
            data.forEach(function(ele) {
                ele.forEach(function(value, key) {
                    if(Array.isArray(value)) {
                        options.xAxis.data.push(key);
                        value.forEach(function(sub_value, sub_idx) {
                            options.data.datasets.push(more_datasets);
                            options.data.datasets[sub_idx].data.push(sub_value);
                            // options.data.datasets[sub_idx].borderColor = borderColors[sub_idx];
                            if(Array.isArray(name) && name.length > sub_idx) {
                                options.data.datasets[sub_idx].label = name[sub_idx];
                            }
                        });
                    } else {
                        options.xAxis.data.push(key);
                        options.series[0].data.push(value);
                    }
                });
            });
        }
        // 使用刚指定的配置项和数据显示图表。
        myChart.setOption(options);
    }
};