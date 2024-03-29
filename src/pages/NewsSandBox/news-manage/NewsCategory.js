import { Table, Button, Modal,Form,Input } from 'antd'
import axios from 'axios';
import React, { Fragment, useEffect, useState ,useContext,useRef} from 'react'
import { DeleteOutlined } from "@ant-design/icons"

export default function NewsCategory() {
  const [dataSource, setDataSource] = useState([]);
  const [modal, contextHolder] = Modal.useModal();
  const EditableContext = React.createContext(null);
  useEffect(() => {
    axios.get("/categories").then(
      res => {
        setDataSource(res.data);
      }
    )
  }, [])

  // 确认删除
  const confirmMethod = (item) => {
    return async () => {
      const confirmed = await modal.confirm({ title: '你确定要删除吗？' });
      if (confirmed) {
        setDataSource(dataSource.filter(data => data.id !== item.id));
        axios.delete(`/categories/${item.id}`);
      }
    }
  }

  const handleSave = (row) => {
    console.log(row);
    setDataSource(dataSource.map(data => {
      if(data.id === row.id){
        return {...row}
      }
      return data;
    }))
    axios.patch(`/categories/${row.id}`,{
      title:row.title,
      value:row.value
    })
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => <b>{id}</b>
    },
    {
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => (
        <div><Button danger shape='circle' icon={<DeleteOutlined />} onClick={confirmMethod(item)} />{contextHolder}</div>
      )
    }

  ];

  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({
          ...record,
          ...values,
        });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
    let childNode = children;
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
    return <td {...restProps}>{childNode}</td>;
  };
  return (
    <Fragment>
      <Table dataSource={dataSource} columns={columns}
        pagination={{
          pageSize: 5
        }}
        rowKey={item => item.id}
        components={
          {
            body: {
              row: EditableRow,
              cell: EditableCell,
            }
          }
        }
      />
    </Fragment>
  )
}
