import axios from 'axios'
import React, { Fragment, useEffect, useState } from 'react'
import { Table, Button, Tag, notification } from 'antd'

export default function Audit() {
  const [dataSource, setDataSource] = useState([]);
  const { role: { roleType }, region, id } = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    axios.get(`/news?auditState=1&_expand=category`).then(
      res => {
        const list = res.data;
        setDataSource(roleType === 1 ? list : [...list.filter(item => item.region === region)]);
      }
    )
  }, [])

  // 处理审核通过、驳回
  const handelAudit = (id,auditState,publishState) => {
    return () => {
      setDataSource(dataSource.filter(data => data.id !== id));
      axios.patch(`/news/${id}`,{
        auditState,
        publishState
      })
    }
  }

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render: (title, item) => (<a href={`/news-manage/preview/${item.id}`}>{title}</a>)
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button type='primary' onClick={handelAudit(item.id,2,1)}>通过</Button>
          <Button danger onClick={handelAudit(item.id,3,0)}>驳回</Button>
        </div>)
    }
  ];
  return (
    <Fragment>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </Fragment>
  )
}
