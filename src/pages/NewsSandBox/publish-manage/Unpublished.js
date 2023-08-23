import { Button } from 'antd';
import React, { Fragment } from 'react'
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../components/NewsPublish/usePublish';

export default function Unpublished() {
  const {dataSource,handelPublish} = usePublish(1);
  return (
    <Fragment>
      <NewsPublish dataSource={dataSource} button={(id) => <Button type='primary' onClick={handelPublish(id)}>发布</Button>}></NewsPublish>
    </Fragment>
  )
}
