import React, { useEffect, useState } from 'react';
import PageNavigation from '../../components/PageNavigation/page-navigation';
// import SectionTitle from "../../components/SectionTitle";
import PageContent from '../../components/PageContent';

const PageInfo = ({ pageContent }) => {
  // const [openNavigation, setOpenNavigation] = useState(false);
  // useEffect(() => {
  //   setOpenNavigation(false);
  // }, [activePage]);
  return (
    <div className="row">
      {/* <div className="col-lg-3 col-12 col-md-3 ">
        <PageNavigation
          navigation={pageNavigation}
          activePage={activePage}
          openNavigation={openNavigation}
          title={pageContent.title}
        />
      </div> */}
      <div className="col-lg-9 col-md-9 col-12">
        <PageContent
          slug={pageContent.slug}
          title={pageContent.title}
          content={pageContent.content}
          // openNavigation={openNavigation}
          // setOpenNavigation={setOpenNavigation}
        />
      </div>
    </div>
  );
};

export default PageInfo;
