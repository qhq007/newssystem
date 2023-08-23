import React, { Fragment, useEffect, useState } from 'react'
import { Button, Table,  Modal, notification } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined } from "@ant-design/icons"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function NewsDraft() {
  const [dataSource, setDataSource] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const navigate = useNavigate();

  const { username } = JSON.parse(sessionStorage.getItem("token"));
  // 获取新闻信息
  useEffect(() => {
    axios.get(`/news?author=${username}&auditState=0&_expand=category`).then(
      res => {
        setDataSource(res.data)
      }
    )
  }, [])


  // 确认删除新闻
  const confirmMethod = (item) => {
    return async () => {
      const confirmed = await modal.confirm({ title: '你确定要删除吗？' });
      if (confirmed) {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/news/${item.id}`);
      }
    }
  }

  // 提交审核
  const handelCheck = (id) => {
    return () => {
      console.log("test");
      axios.patch(`/news/${id}`,{
        auditState:1
      }).then(
        res => {
          navigate("/audit-manage/list");
          notification.open({
            message: '通知',
            description:`您可以到审核列表中查看您的新闻`,
            placement:"bottomRight",
          }); 
        }
      )
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item) => (<a href={`/news-manage/preview/${item.id}`}>{title}</a>)
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '分类',
      dataIndex: 'category',
      render: (category) => category.title
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={confirmMethod(item)} />
          <Button shape="circle" icon={<EditOutlined />} onClick={() => navigate(`/news-manage/update/${item.id}`)}/>
          <Button type="primary" shape="circle" icon={<UploadOutlined />} onClick={handelCheck(item.id)}/>
          {contextHolder}
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
