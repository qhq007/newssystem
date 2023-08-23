import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import * as echarts from "echarts";
import _ from 'lodash';
import axios from 'axios';
const { Meta } = Card;


export default function Home() {
    const [viewList, setViewList] = useState([]);
    const [starList, setStarList] = useState([]);
    const [open, setOpen] = useState(false);
    const [pieChart,setPieChart] = useState(null);
    const [allList,setAllList] = useState([]);
    const barRef = useRef();
    const pieRef = useRef();
    useEffect(() => {
        axios.get("http://localhost:5000/news?publishState=2&_sort=view&_order=desc&_limit=6").then(
            res => {
                setViewList(res.data);
            }
        );
        axios.get("http://localhost:5000/news?publishState=2&_sort=star&_order=desc&_limit=6").then(
            res => {
                setStarList(res.data);
            }
        )

    }, [])

    
    useEffect(() => {
        let list;
        axios.get("/news?publishState=2&_expand=category").then(
            res => {
                list = _.groupBy(res.data, item => item.category.title);
                renderBarView(list);
                setAllList(res.data);
            }
        )
        return () => window.onresize = null;
    }, [])
    // 柱状图
    const renderBarView = (list) => {
        const myChart = echarts.init(barRef.current);

        const option = {
            title: {
                text: "新闻分类图示"
            },
            legend: {
                data: ["数量"]
            },
            xAxis: {
                type: 'category',
                data: Object.keys(list),
                axisLabel: {
                    rotate: "45"
                }
            },
            yAxis: {
                type: 'value',
                // 最小间隔
                minInterval: 1
            },
            series: [
                {
                    name: "数量",
                    data: Object.values(list).map(item => item.length),
                    type: 'bar',
                    showBackground: true,
                    backgroundStyle: {
                        color: 'rgba(180, 180, 180, 0.2)'
                    }
                }
            ]
        };
        myChart.setOption(option);
        window.onresize = () => {
            myChart.resize();
        }
    }

    // 饼状图
    const renderPieView = () => {
        const currentList = allList.filter(item => item.author === username);
        const groupObj = _.groupBy(currentList,item => item.category.title);
        let list = [];
        for(let i in groupObj){
            list.push({
                value:groupObj[i].length,
                name:i
            })
        }
        let myChart;
        // 避免myChart被重复初始化
        if(!pieChart){
            myChart = echarts.init(pieRef.current);
            setPieChart(myChart);
        }else{
            myChart = pieChart;
        }
        const option = {
            title: {
                text: '当前用户新闻分类图示',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left'
            },
            series: [
                {
                    name: '发布数量',
                    type: 'pie',
                    radius: '50%',
                    data:list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        myChart.setOption(option);

    }
    const { username, region, role: { roleName } } = JSON.parse(sessionStorage.getItem("token"));
    return (
        <Fragment>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户最常浏览" bordered>
                        <List
                            size="small"
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={false}>
                        <List
                            size="small"
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{
                            width: 300,
                        }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={async () => {                                
                                // 使状态更新为同步更新
                                await new Promise((resolve) => {
                                    setOpen(true);
                                    resolve();
                                })
                                renderPieView();
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://xsgames.co/randomusers/avatar.php?g=pixel" />}
                            title={username}
                            description={
                                <div>
                                    <b>{region ? region : "全球"}</b>
                                    <span style={{ paddingLeft: "15px" }}>{roleName}</span>
                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>
            <div ref={barRef} style={{ height: "400px", width: "100%", marginTop: "30px" }} />
            <Drawer width="500px" title="个人新闻分类" placement="right" onClose={() => setOpen(false)} open={open}>
                <div ref={pieRef} style={{ height: "400px", width: "100%", marginTop: "30px" }} />
            </Drawer>
        </Fragment>
    )
}
