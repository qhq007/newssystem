import React, { useEffect, useState } from 'react'
import { Descriptions } from 'antd';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import moment from 'moment';
import { ArrowLeftOutlined,HeartTwoTone } from '@ant-design/icons';

export default function Detail() {
    const {id} = useParams();
    const [newsInfo,setNewsInfo] = useState({});
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`/news/${id}?_expand=category&_expand=role`).then(
            res => {
                setNewsInfo({
                    ...res.data,
                    view:res.data.view + 1
                });
                return res.data;
            }
        ).then(
            data => {
                axios.patch(`/news/${id}`,{
                    view:data.view + 1
                })
            }
        )       
    },[])

    // 点赞
    const handelStar = () => {
        setNewsInfo({
            ...newsInfo,
            star:newsInfo.star + 1
        });
        axios.patch(`/news/${id}`,{
            star:newsInfo.star + 1
        });
    }
    const items = [
        {
          key: '1',
          label: '创建者',
          children: newsInfo.author,
        },
        {
          key: '2',
          label: '发布时间',
          children: newsInfo.publishTime?moment(newsInfo.publishTime).format("YYYY/MM/DD HH:mm:ss"):"-"
        },
        {
          key: '3',
          label: '区域',
          children: newsInfo.region,
        },
          {
            key: '4',
            label: '访问数量',
            children: <span style={{color:"skyblue"}}>{newsInfo.view}</span>,
          },
          {
            key: '5',
            label: '点赞数量',
            children: <span style={{color:"skyblue"}}>{newsInfo.star}</span>,
          },
          {
            key: '6',
            label: '评论数量',
            children: <span style={{color:"skyblue"}}>0</span>,
          }
    
      ];
  return (
    <div style={{margin:"20px"}}>
        <Descriptions title={<div>
            <span><ArrowLeftOutlined onClick={() => navigate(-1)}/> {newsInfo.title}</span>
            <span style={{padding:"0 10px",fontWeight:"100",color:"#333"}}>{newsInfo.category?.title}</span>
            <span><HeartTwoTone twoToneColor="#eb2f96" onClick={handelStar}/></span>
        </div>} items={items} />
        <div dangerouslySetInnerHTML={{__html:newsInfo.content}} style={{border:"1px solid #ddd"}}/>
    </div>
  )
}

