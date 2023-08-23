// 自定义hooks
import axios from 'axios'
import { notification } from 'antd'
import { useEffect, useState } from 'react'

function usePublish(type) {
    const [dataSource, setDataSource] = useState([]);
    const { username } = JSON.parse(sessionStorage.getItem("token"));
    useEffect(() => {
        axios.get(`/news?author=${username}&publishState=${type}&_expand=category`).then(
            res => {
                setDataSource(res.data)
            }
        )
    }, [])

    const handelPublish = (id) => {
        return () => {
            setDataSource(dataSource.filter(data => data.id !== id));
            axios.patch(`/news/${id}`, {
                publishState:2,
                publishTime:Date.now()
              }).then(
                res => {
                  notification.open({
                    message: '通知',
                    description: `您可以到【发布管理-已发布】中查看您发布的新闻`,
                    placement: "bottomRight",
                  });
                }
              )
        }
    }

    const handelSunset = (id) => {
        return () => {
            setDataSource(dataSource.filter(data => data.id !== id));
            axios.patch(`/news/${id}`, {
                publishState:3,
              }).then(
                res => {
                  notification.open({
                    message: '通知',
                    description: `您可以到【发布管理-已下线】中查看您下线的新闻`,
                    placement: "bottomRight",
                  });
                }
              )
        }
    }

    const handelDelete = (id) => {
        return () => {
            setDataSource(dataSource.filter(data => data.id !== id));
            axios.delete(`/news/${id}`).then(
                res => {
                  notification.open({
                    message: '通知',
                    description: `您已删除已下线的新闻`,
                    placement: "bottomRight",
                  });
                }
              )
        }
    }
    return {
        dataSource,
        handelDelete,
        handelPublish,
        handelSunset
    }
}
export default usePublish;