$(function(){
    let page_title = $('#page_title').text();
    let page_lite = $('#page_lite').text();
    let page_lite2 = $('#page_lite2').text();
    let chart;
    let options;
    let dayfmt =  'MM/dd';
    let monthfmt = 'yyyy/MM';
    options = {
        annotations: {
            yaxis: [{
                y: 8400,
                borderColor: "#0acf97",
                label: {
                    borderColor: "#0acf97",
                    style: {
                        color: "#fff",
                        background: "#0acf97"
                    },
                    text: ""
                }
            }],
            xaxis: [{
                x: new Date("16 Feb 2019").getTime(),
                borderColor: "#775DD0",
                label: {
                    borderColor: "#775DD0",
                    style: {
                        color: "#fff",
                        background: "#775DD0"
                    },
                    text: "出かけ"
                }
            }, {
                x: new Date("21 Feb 2019").getTime(),
                borderColor: "#775DD0",
                label: {
                    borderColor: "#775DD0",
                    style: {
                        color: "#fff",
                        background: "#775DD0"
                    },
                    text: "帰宅"
                }
            }, {
                x: new Date("26 Feb 2019").getTime(),
                borderColor: "#fa5c7c",
                label: {
                    borderColor: "#fa5c7c",
                    style: {
                        color: "#fff",
                        background: "#fa5c7c"
                    },
                    text: page_lite2 + "検知"
                }
            }],
            points: [{
                x: new Date("19 Feb 2019").getTime(),
                y: 8506.9,
                marker: {
                    size: 8,
                    fillColor: "#fff",
                    strokeColor: "#0acf97",
                    radius: 2
                },
                label: {
                    borderColor: "#0acf97",
                    offsetY: 0,
                    style: {
                        color: "#fff",
                        background: "#0acf97"
                    },
                    text: "お休み中"
                }
            }]
        },
        chart: {
            height: 290,
            type: "line",
            id: "areachart-2"
        },
        colors: ["#39afd1"],
        dataLabels: {
            enabled: !1
        },
        stroke: {
            width: [3],
            curve: "straight"
        },
        series: [{
            data: series.monthDataSeries1.prices
        }],
        title: {
            text: "",
            align: "left"
        },
        labels: series.monthDataSeries1.dates,
        xaxis: {
            type: "datetime",
            labels: {
                datetimeFormatter: {
                    year: 'yyyy',
                    month: monthfmt,
                    day: dayfmt,
                    hour: 'HH:mm',
                }
            }
        },
        yaxis: {
            title: {
                text: "使用量("+page_lite+")"
            }
        },
        grid: {
            row: {
                colors: ["transparent", "transparent"],
                opacity: .2
            },
            borderColor: "#f1f3fa"
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
    (chart = new ApexCharts(document.querySelector("#line-chart-annotations"),options)).render();

    let ts2 = new Date(2018, 12, 31, 10, 10, 10).getTime(), dates = [], spikes = [5, -5, 3, -3, 8, -8]
    for (let i = 0; i < 120; i++) {
        let innerArr = [ts2 += 864e5, dataSeries[1][i].value];
        dates.push(innerArr)
    }

    let lastDate = 0, data = [];
    function getDayWiseTimeSeries(e, t, a) {
        for (var r = 0; r < t; ) {
            var o = e, n = Math.floor(Math.random() * (a.max - a.min + 1)) + a.min;
            data.push({
                x: o,
                y: n
            }),
            lastDate = e,
            e += 864e5,
            r++
        }
    }
    function getNewSeries(e, t) {
        let a = e + 864e5;
        lastDate = a,
        data.push({
            x: a,
            y: Math.floor(Math.random() * (t.max - t.min + 1)) + t.min
        })
    }
    function resetData() {
        data = data.slice(data.length - 10, data.length)
    }
    getDayWiseTimeSeries(new Date("11 Feb 2019 GMT").getTime(), 10, {
        min: 10,
        max: 90
    });

    options = {
        chart: {
            type: "area",
            stacked: !1,
            height: 292,
            zoom: {
                enabled: !0
            }
        },
        plotOptions: {
            line: {
                curve: "smooth"
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            width: [3]
        },
        series: [{
            name: "用量",
            data: dates
        }],
        markers: {
            size: 0,
            style: "full"
        },
        colors: ["#fa5c7c"],
        title: {
            text: "",
            align: "left"
        },
        grid: {
            row: {
                colors: ["transparent", "transparent"],
                opacity: .2
            },
            borderColor: "#f1f3fa"
        },
        fill: {
            gradient: {
                enabled: !0,
                shadeIntensity: 1,
                inverseColors: !1,
                opacityFrom: .5,
                opacityTo: .1,
                stops: [0, 70, 80, 100]
            }
        },
        yaxis: {
            min: 2e7,
            max: 25e7,
            labels: {
                formatter: function(e) {
                    return (e / 1e6).toFixed(0)
                }
            },
            title: {
                text: "使用量("+page_lite+")"
            }
        },
        xaxis: {
            type: "datetime",
            labels: {
                datetimeFormatter: {
                    year: 'yyyy',
                    month: monthfmt,
                    day: dayfmt,
                    hour: 'HH:mm',
                }
            }
        },
        tooltip: {
            shared: !1,
            y: {
                formatter: function(e) {
                    return (e / 1e6).toFixed(0)
                }
            }
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
    (chart = new ApexCharts(document.querySelector("#line-chart-zoomable"),options)).render();

    options = {
        chart: {
            height: 318,
            type: "line",
            animations: {
                enabled: !0,
                easing: "linear",
                dynamicAnimation: {
                    speed: 2e3
                }
            },
            toolbar: {
                show: !1
            },
            zoom: {
                enabled: !1
            }
        },
        dataLabels: {
            enabled: !1
        },
        stroke: {
            curve: "smooth",
            width: [3]
        },
        series: [{
            name: '',
            data: data
        }],
        markers: {
            size: 0
        },
        xaxis: {
            type: "datetime",
            range: 7776e5,
            labels: {
                datetimeFormatter: {
                    year: 'yyyy',
                    month: monthfmt,
                    day: dayfmt,
                    hour: 'HH:mm',
                }
            }
        },
        yaxis: {
            max: 100,
            title: {
                text: "使用量("+page_lite+")"
            }
        },
        legend: {
            show: !1
        },
        grid: {
            borderColor: "#f1f3fa"
        }
    };
    (chart = new ApexCharts(document.querySelector("#line-chart-realtime"),options)).render();

    window.setInterval(function() {
        getNewSeries(lastDate, {
            min: 10,
            max: 90
        }),
        chart.updateSeries([{
            data: data
        }])
    }, 2e3),
    window.setInterval(function() {
        resetData(),
        chart.updateSeries([{
            data: data
        }], !1, !0)
    }, 6e4);
});