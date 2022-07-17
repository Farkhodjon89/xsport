import React from 'react'
import LayoutTwo from '../components/LayoutTwo'
import ApplicationMain from '../components/ApplicationMain'
// import { HeadData } from "../components/Head";

const Application = () => {
  return (
    <>
      {/* <HeadData title={"Оформление заказа"} pageUrl="/application" /> */}
      <LayoutTwo>
        <ApplicationMain />
      </LayoutTwo>
    </>
  )
}

export default Application
