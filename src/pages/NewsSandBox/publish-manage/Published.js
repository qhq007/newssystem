import React, { Fragment } from 'react'
import { Button } from 'antd';
import NewsPublish from '../../../components/NewsPublish';
import usePublish from '../../../components/NewsPublish/usePublish';

export default function Published() {
  const {dataSource,handelSunset} = usePublish(2);
  return (
    <Fragment>
      <NewsPublish dataSource={dataSource} button={(id) => <Button danger onClick={handelSunset(id)}>下线</Button>}></NewsPublish>
    </Fragment>
  )
}