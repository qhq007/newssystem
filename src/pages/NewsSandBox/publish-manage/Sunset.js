import React, { Fragment } from 'react'
import { Button } from 'antd';
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../components/NewsPublish/usePublish';

export default function Sunset() {
  const {dataSource,handelDelete} = usePublish(3);
  return (
    <Fragment>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={handelDelete(id)}>删除</Button>}></NewsPublish>
    </Fragment>
  )
}