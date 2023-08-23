import React, { Fragment } from 'react'
import { Table, Button, Tag,notification } from 'antd'


export default function NewsPublish(props) {
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
          render: (item) => props.button(item.id)
        }
      ];
  return (
    <Fragment>
        <Table dataSource={props.dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
      />
    </Fragment>
  )
}
