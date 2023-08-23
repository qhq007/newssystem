import React, { Fragment, useEffect, useState } from 'react'
import { Button, Table, Switch, Modal, Form } from 'antd'
import { DeleteOutlined, EditOutlined } from "@ant-design/icons"
import axios from 'axios';
import UserForm from '../../../components/UserForm';


export default function UserList() {
  const [open, setOpen] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [form] = Form.useForm();
  const [modal, contextHolder] = Modal.useModal();
  const [dataSource, setDataSource] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  const {role:{roleType},region,id} = JSON.parse(sessionStorage.getItem("token"));
  useEffect(() => {
    axios.get("/users?_expand=role").then(
      res => {
        const data = res.data;
        const list = data.filter(item => (item.id === id) || (item.region === region && item.role.roleType > roleType))
        setDataSource(roleType === 1 ? data : list )
      }
    )
    axios.get("/roles").then(
      res => {
        setRoleList(res.data);
      })
    axios.get("/regions").then(
      res => {
        const list = new Set(res.data.map(data => data.value));
        setRegionList([...list]);
      })
  }, [])

  // 确认删除用户
  const confirmMethod = (item) => {
    return async () => {
      const confirmed = await modal.confirm({ title: '你确定要删除吗？' });
      if (confirmed) {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/users/${item.id}`);
      }
    }
  }

  //修改用户状态 
  const handelChange = (item) => {
    return () => {
      item.roleState = !item.roleState;
      setDataSource([...dataSource]);
      axios.patch(`/users/${item.id}`, {
        roleState: item.roleState
      })
    }
  }

  // 点击更新按钮
  const handelUpdate = (item) => {
    return () => {
      setIsUpdate(true);
      form.setFieldsValue(item);
      setCurrentId(item.id);
    }
  }

  // 更新表单数据
  const updateOk = () => {
    form
      .validateFields()
      .then(values => {
        setIsUpdate(false);
        setDataSource(dataSource.map(item => {
          if (item.id === currentId) {
            return {
              ...item,
              ...values,
              role: roleList.filter(role => role.id === values.roleId)[0]
            }
          }
          return item;
        }))
        axios.patch(`/users/${currentId}`, values);
      })
  }

  // 添加用户
  const handelOK = () => {
    form
      .validateFields()
      .then((values) => {
        form.resetFields();
        setOpen(false);
        // 先把数据传送到后端，生成id，便于后面的删除更新
        axios.post("/users", {
          ...values,
          roleState: true,
          default: false
        }).then(
          res => setDataSource([...dataSource, {
            ...res.data,
            role: roleList.filter(role => role.id === values.roleId)[0]
          }])
        )
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  }

  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(region => ({
          text: region,
          value: region
        })),
        {
          text: "全球",
          value: "全球"
        }
      ],
      onFilter: (value, record) => {
        if (value === "全球") {
          return record.region === "";
        } else {
          return record.region === value;
        }
      },
      render: (region) => <b>{region ? region : "全球"}</b>

    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => role?.roleName
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => <Switch checked={roleState} disabled={item.default} onChange={handelChange(item)} />
    },
    {
      title: '操作',
      render: (item) => (
        <div>
          <Button danger shape="circle" icon={<DeleteOutlined />} disabled={item.default} onClick={confirmMethod(item)} />
          <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.default} onClick={handelUpdate(item)} />
          {contextHolder}
        </div>)
    }
  ]

  // 创建添加用户表单
  const CollectionCreateForm = ({ open, onCancel }) => {
    return (
      <Modal
        open={open}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={handelOK}
      >
        <UserForm regionList={regionList} roleList={roleList} form={form} />
      </Modal>
    );
  };
  return (
    <Fragment>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
        }}
      >
        添加用户
      </Button>
      {/* 添加用户表单 */}
      <CollectionCreateForm
        open={open}
        onCancel={() => {
          setOpen(false);
        }}
      />
      {/* 编辑用户信息表单 */}
      <Modal
        open={isUpdate}
        title="修改信息"
        okText="确定"
        cancelText="取消"
        onCancel={() => setIsUpdate(false)}
        onOk={updateOk}
      >
        <UserForm regionList={regionList} roleList={roleList} form={form} />
      </Modal>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id} />
    </Fragment>
  )
}
