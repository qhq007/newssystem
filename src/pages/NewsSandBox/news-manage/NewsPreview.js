import React, { Fragment, useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { ArrowLeftOutlined } from '@ant-design/icons';

export default function NewsPreview() {
    const {id} = useParams();
    const [newsInfo,setNewsInfo] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(
            res => {
                setNewsInfo(res.data);
            }
        )
    },[])

    const auditList = ["未审核","审核中","已通过","未通过"];
    const publishList = ["未发布","待发布","已上线","已下线"];
    const colorList = ["black","orange","green","red"];
    const items = [
        {
          key: '1',
          label: '创建者',
          children: newsInfo.author,
        },
        {
          key: '2',
          label: '创建时间',
          children: moment(newsInfo.createTime).format("YYYY/MM/DD HH:mm:ss"),
        },
        {
          key: '3',
          label: '发布时间',
          children: newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"
        },
        {
          key: '4',
          label: '区域',
          children: newsInfo.region,
        },
        {
          key: '5',
          label: '审核状态',
          children: <span style={{color:colorList[newsInfo.auditState]}}>{auditList[newsInfo.auditState]}</span>,
        },
        {
            key: '6',
            label: '发布状态',
            children: <span style={{color:colorList[newsInfo.auditState]}}>{publishList[newsInfo.publishState]}</span>,
          },
          {
            key: '7',
            label: '访问数量',
            children: <span style={{color:"skyblue"}}>{newsInfo.view}</span>,
          },
          {
            key: '8',
            label: '点赞数量',
            children: <span style={{color:"skyblue"}}>{newsInfo.star}</span>,
          },
          {
            key: '9',
            label: '评论数量',
            children: <span style={{color:"skyblue"}}>0</span>,
          }
    
      ];
  return (
    <Fragment>
        <Descriptions title={<div>
            <span><ArrowLeftOutlined onClick={() => navigate(-1)}/> {newsInfo.title}</span>
            <span style={{padding:"0 10px",fontWeight:"100",color:"#333"}}>{newsInfo.category?.title}</span>
        </div>} items={items} />
        <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:"1px solid #ddd"}}>
        </div>
    </Fragment>
  )
}
