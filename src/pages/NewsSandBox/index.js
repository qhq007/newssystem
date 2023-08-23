import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import { Layout, Spin, theme } from 'antd';
import NProgress from 'nprogress';
import "nprogress/nprogress.css"
import "./index.css"
import { connect } from 'react-redux';



function NewsSandBox(props) {
    NProgress.start();
    const { Content } = Layout;
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    useEffect(() => {
        NProgress.done();
    })

    return (
        <Layout>
            <SideMenu />
            <Layout>
                <TopHeader />
                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                    }}
                >
                    
                    <Spin size="large" spinning={props.loading} >
                        <Outlet/>
                    </Spin>
                </Content>
            </Layout>
        </Layout>
    )
}
export default connect(
    state => ({loading:state.loading})
)(NewsSandBox)
