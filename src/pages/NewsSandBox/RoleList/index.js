import axios from 'axios';
import { Button, Table, Modal, Tree } from 'antd'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import React, { Fragment, useEffect, useState } from 'react'

export default function RoleList() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [rightList, setRightList] = useState([]);
  const [currentRights, setCurrentRights] = useState([]);
  const [currentId, setCurrentId] = useState(0);
  useEffect(() => {
    axios.get("/roles").then(
      res => {
        setDataSource(res.data);
      }
    )
  }, [])
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      res => {
        setRightList(res.data);
      }
    )
  }, [])
  const [modal, contextHolder] = Modal.useModal();


  // 删除角色
  const confirmMethod = (item) => {
    return async () => {
      const confirmed = await modal.confirm({ title: '你确定要删除吗？' });
      if (confirmed) {
        const list = dataSource.filter(data => data.id !== item.id);
        setDataSource(list);
        axios.delete(`/roles/${item.id}`);
      }
    }
  }

  // 展示权限分配框
  const showModal = (item) => {
    return () => {
      setIsModalOpen(true);
      setCurrentRights(item.rights);
      setCurrentId(item.id);
    }
  };

  // 处理权限分配的OK
  const handleOk = () => {
    setIsModalOpen(false);
    axios.patch(`/roles/${currentId}`, {
      rights: currentRights
    })
    const list = dataSource.map(data => {
      if (data.id === currentId) {
        data.rights = currentRights;
      }
      return data;
    })
    setDataSource(list);
  };

  const onCheck = (checkedKeys) => {
    setCurrentRights(checkedKeys.checked);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: "操作",
      render: (item) => (
        <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} onClick={confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} onClick={showModal(item)} />
          {contextHolder}
        </div>)
    }
  ];
  return (
    <Fragment>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />;
      <Modal title="权限分配" open={isModalOpen} onOk={handleOk} onCancel={() => setIsModalOpen(false)}>
        <Tree
          checkable
          checkedKeys={currentRights}
          onCheck={onCheck}
          treeData={rightList}
          checkStrictly
        />
      </Modal>
    </Fragment>
  )
}
