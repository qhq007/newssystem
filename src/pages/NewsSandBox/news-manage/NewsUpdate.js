import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Steps, Button, Form, Input, Select, message ,notification } from 'antd';
import { useNavigate, useParams } from "react-router-dom"
import NewsEditor from '../../../components/NewsEditor';
import axios from 'axios';
import { ArrowLeftOutlined } from '@ant-design/icons';
const onFinish = (values) => {
  console.log('Success:', values);
};
const onFinishFailed = (errorInfo) => {
  console.log('Failed:', errorInfo);
};


export default function NewsUpdate() {
  const [current, setCurrent] = useState(0);
  const [categories, setCategories] = useState([]);
  const [formInfo, setFormInfo] = useState({});
  const [content, setContent] = useState("");
  const formRef = useRef();
  const navigate = useNavigate();


  const {id} = useParams();
  useEffect(() => {
    axios.get("/categories").then(res => {
      setCategories(res.data);
    })
    axios.get(`/news/${id}?_expand=category&_expand=role`).then(
        res => {
            const {title,categoryId,content} = res.data;
            formRef.current.setFieldsValue({
                title,
                categoryId
            })
            setContent(content);
        }
    )
  }, [])

  const user = JSON.parse(sessionStorage.getItem("token"));
  // 下一步
  const handelNext = () => {
    if (current === 0) {
      formRef.current.validateFields()
        .then(values => {
          setFormInfo(values);
          setCurrent(current + 1);
        })
        .catch(error => {
          console.log(error);
        })
    } else {
      if (content === "" || content.trim() === "<p></p>") {
        message.error("新闻内容不能为空");
      } else {
        setCurrent(current + 1);
      }
    }

  }

  // 保存,auditState=0表示草稿箱，auditState=1审核列表
  const handelSave = (auditState) => {
    return () => {
      axios.patch(`/news/${id}`, {
        ...formInfo,
        content,
        auditState
      }).then(
        res => {
          auditState === 0 ? navigate("/news-manage/draft") : navigate("/audit-manage/list");
          notification.open({
            message: '通知',
            description:`您可以到${auditState === 0 ? "草稿箱" :"审核列表"}中查看您的新闻`,
            placement:"bottomRight",
          }); 
        }
      )
    }
  }
  return (
    <Fragment>
      <div className='newsBoxTitle'><ArrowLeftOutlined onClick={() => navigate(-1)}/> 更新新闻</div>
      <Steps
        current={current}
        items={[
          {
            title: '基本信息',
            description: "新闻标题，新闻分类",
          },
          {
            title: '新闻内容',
            description: "新闻主题内容"
          },
          {
            title: '新闻提交',
            description: "保存草稿或者提交审核",
          },
        ]}
      />
      {/* 第一步 */}
      <div className={current === 0 ? "" : "hidden"}>
        <Form
          ref={formRef}
          style={{ marginTop: "50px" }}
          name="basic"
          labelCol={{
            span: 3,
          }}
          wrapperCol={{
            span: 24,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="新闻标题"
            name="title"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="新闻分类"
            name="categoryId"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Select options={categories.map(data => ({ value: data.id, label: data.title, key: data.id }))} />
          </Form.Item>
        </Form>
      </div>
      {/* 第二步 */}
      <div className={current === 1 ? "" : "hidden"}>
        <NewsEditor getContent={(value) => { setContent(value) }} content={content}/>
      </div>

      <div style={{ marginTop: "50px" }}>
        {
          current === 2 && <span>
            <Button type="primary" onClick={handelSave(0)}>保存草稿箱</Button>
            <Button danger onClick={handelSave(1)}>提交审核</Button>
          </span>
        }
        {current > 0 && <Button onClick={() => setCurrent(current - 1)}>上一步</Button>}
        {current < 2 && <Button type="primary" onClick={handelNext}>下一步</Button>}
      </div>
    </Fragment>
  )
}
