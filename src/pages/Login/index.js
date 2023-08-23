import React from 'react'
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import "./index.css"
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  // 登录
  const onFinish = (values) => {
    axios.get(`/users?username=${values.username}&password=${values.password}&roleState=true&_expand=role`).then(
      res => {
        if(res.data.length){
          sessionStorage.setItem("token",JSON.stringify(res.data[0]));
          navigate("/");
        }else{
          message.error("用户名或密码错误");
        }
      }
    )
  };
  return (
    <div className="loginBox">
      <Form
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
      >
        <div className='title'>全球新闻发布系统</div>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            登录
          </Button>
          <a href="/news" style={{float:"right"}}>游客浏览</a>
        </Form.Item>
      </Form>
    </div>
  )
}
