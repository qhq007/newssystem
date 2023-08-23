import axios from 'axios'
import { Table, Button, Tag,notification } from 'antd'
import React, { Fragment, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function AuditList() {
  const [dataSource, setDataSource] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    axios.get(`/news?author=${user.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
      res => {
        setDataSource(res.data);
      }
    )
  }, [])

  // 撤销审核
  const handelRevert = (id) => {
    return () => {
      setDataSource(dataSource.filter(data => data.id !== id));
      axios.patch(`/news/${id}`, {
        auditState: 0
      }).then(
        res => {
          notification.open({
            message: '通知',
            description: `您可以到草稿箱中查看您撤销的新闻`,
            placement: "bottomRight",
          });
        }
      )
    }
  }

  const handelPublish = (id) => {
    return () => {
      setDataSource(dataSource.filter(data => data.id !== id));
      axios.patch(`/news/${id}`, {
        publishState:2,
        publishTime:Date.now()
      }).then(
        res => {
          navigate("/publish-manage/published");
          notification.open({
            message: '通知',
            description: `您可以到【发布管理-已发布】中查看您发布的新闻`,
            placement: "bottomRight",
          });
        }
      )
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        const colorList = ["", "orange", "green", "red"];
        const auditList = ["", "审核中", "已通过", "未通过"];
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          {item.auditState === 1 && <Button onClick={handelRevert(item.id)}>撤销</Button>}
          {item.auditState === 2 && <Button danger onClick={handelPublish(item.id)}>发布</Button>}
          {item.auditState === 3 && <Button type="primary" onClick={() => navigate(`/news-manage/update/${item.id}`)}>更新</Button>}
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
