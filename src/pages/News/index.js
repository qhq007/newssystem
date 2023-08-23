import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Card, Col, Row, List } from 'antd';
import _ from 'lodash';
import "./index.css"

export default function News() {
    const [dataSource, setDataSource] = useState([]);
    useEffect(() => {
        axios.get("/news?publishState=2&_expand=category").then(
            res => {
                const list = _.groupBy(res.data, item => item.category.title);
                setDataSource(Object.entries(list));
            }
        )
    }, [])
    return (
        <div style={{ width: "98%" }}>
            <div className='newsTitle'><b>全球大新闻</b><span>查看新闻</span></div>
            <Row gutter={16}>
                    {
                        dataSource.map(item => {
                            return (
                                <Col span={8} key={item[0]} style={{marginTop:"10px"}}>
                                    <Card title={item[0]} hoverable bordered height="500px">
                                        <List
                                            size="small"
                                            pagination={{
                                                pageSize: 3
                                            }}
                                            dataSource={item[1]}
                                            renderItem={(data) => <List.Item><a href={`/detail/${data.id}`}>{data.title}</a></List.Item>}
                                        />
                                    </Card>
                                </Col>
                            )
                        })
                    }
            </Row>
        </div>
    )
}
