import React, { Fragment, useEffect, useState } from 'react'
import axios from "axios"
import {
  UserOutlined,
  AppstoreOutlined,
} from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import "./index.css"
import { useLocation, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
const { Sider } = Layout;

function getItem(label, key, icon, children, type) {
  return {
    key,
    icon,
    children,
    label,
    type,
  };
}
const iconList = {
  "/home":<UserOutlined/>,
  "/user-manage":<AppstoreOutlined />,
  "/user-manage/list":<AppstoreOutlined />,
  "/right-manage":<AppstoreOutlined />,
  "/right-manage/role/list":<AppstoreOutlined />,
  "/right-manage/right/list":<AppstoreOutlined />,
}
function SideMenu(props) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const location = useLocation();

  // 获取所有权限
  useEffect(() => {
    axios.get("/rights?_embed=children").then(
      res => {
        setMenu(res.data);
      }
    )
  }, [])
  
  const {role:{rights}} = JSON.parse(sessionStorage.getItem("token"));
  const items = menu.map(obj => {
    const { children, title, key } = obj;
    if(obj.pagepermission&&rights.includes(key)){
      if (children.length) {
        return getItem(title, key, iconList[key], children.map(obj2 => obj2.pagepermission ? getItem(obj2.title, obj2.key,iconList[obj2.key]) : null))
      } else {
        return {
          key,
          label: title,
          icon:iconList[key]
        }
      }
    }
  })
  const openKeys = "/"+location.pathname.split("/")[1];
  return (
    <Fragment>
      <Sider trigger={null} collapsible collapsed={props.collapsed}>
        <div className="demo-logo-vertical">全球新闻发布系统</div>
        <Menu
          theme="dark"
          mode="inline"
          onClick={(event) => navigate(event.key, { replace: false })}
          selectedKeys={location.pathname}
          defaultOpenKeys={[openKeys]}
          items={items}
        />
      </Sider>
    </Fragment>
  )
}
export default connect(
  state => ({collapsed:state.collapsed})
)(SideMenu);