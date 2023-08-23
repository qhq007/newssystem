import React, { Fragment } from 'react'
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined
} from '@ant-design/icons';
import { Layout, Button, theme, Dropdown, Space, Avatar,} from 'antd';
import { useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';


const { Header } = Layout;

function TopHeader(props) {
    const navigate = useNavigate();
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const {role:{roleName},username} = JSON.parse(sessionStorage.getItem("token"));
    const items = [
        {
          key: '1',
          label: (
            <span>{roleName}</span>
          ),
        },
        {
          key: '2',
          danger: true,
          label: (
          <a onClick={() => {
              sessionStorage.removeItem("token");
              navigate("/login");
          }}>退出登录</a>
          ),
        },
      ];
    return (
        <Fragment>
            <Header
                style={{
                    padding: 0,
                    background: colorBgContainer,
                }}
            >
                <Button
                    type="text"
                    icon={ props.collapsed? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                    onClick={() => props.changeCollapsed(!props.collapsed)}
                    style={{
                        fontSize: '16px',
                        width: 64,
                        height: 64,
                    }}
                />
                <div style={{ float: "right",paddingRight:"20px" }}>
                    <span>欢迎<span style={{color:"#1890ff"}}>{username}</span>回来</span>
                    <Dropdown
                        menu={{
                            items,
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                            <Avatar size="large" icon={<UserOutlined />} />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
            </Header>
        </Fragment>
    )
}
export default connect(
    state => ({collapsed:state.collapsed}),
    {
        changeCollapsed:(data) => ({type:"changeCollapsed",data})
    }
)(TopHeader);
