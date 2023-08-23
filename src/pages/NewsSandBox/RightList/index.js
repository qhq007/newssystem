import React, { Fragment, useEffect, useState } from 'react'
import { Button, Table, Tag, Popover,Switch } from 'antd'
import { EditOutlined } from "@ant-design/icons"
import axios from 'axios';

export default function RightList() {
  const [dataSource, setDataSource] = useState([]);

  // 获取权限信息
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      res => {
        const data = res.data;
        const list = data.map((obj) => {
          if (!obj.children.length) {
            delete obj.children;
          }
          return obj;
        })
        setDataSource(list);
      }
    )
  }, [])

  // 是否在侧边栏展示页面权限
  const switchMethod = (item) =>{
    return () => {
      item.pagepermission = item.pagepermission === 1 ? 0 : 1;
      setDataSource([...dataSource]);
      if(item.grade === 1){
        axios.patch(`/rights/${item.id}`,{
          pagepermission:item.pagepermission
        })
      }
      if(item.grade === 2){
        axios.patch(`/children/${item.id}`,{
          pagepermission:item.pagepermission
        })
      }
    }
  }


  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render: (key) => <Tag color="orange">{key}</Tag>
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Popover content={<div><Switch checked={item.pagepermission} onChange={switchMethod(item)}/></div>}
           title="页面配置项" trigger={item.pagepermission!==undefined ? "click" : null}>
            <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermission === undefined}/>
          </Popover>
        </div>)
    }
  ];
  return (
    <Fragment>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }} />
    </Fragment>
  )
}
