import React, { useState } from "react";
import s from "./authorization.module.scss";
import ReactModal from "react-modal";

import SignUp from "./sign-up";
import PhoneVerification from "./phone-verification";
import SignIn from "./sign-in";

const Authorization = ({ referralCode }) => {
  const contentTypes = {
    signUp: "signUp",
    phoneVerification: "phoneVerification",
    signIn: "signIn",
  };

  const [content, setContent] = useState(contentTypes.signIn);
  const [contentBefore, setContentBefore] = useState(contentTypes.signIn);
  const [phone, setPhone] = useState("");

  const setContents = (contentType) => {
    setContentBefore(content);
    setContent(contentType);
  };

  const contentComponents = {
    signUp: (
      <SignUp
        setContent={setContents}
        contentTypes={contentTypes}
        phone={phone}
        setPhone={setPhone}
        referralCode={referralCode}
      />
    ),
    phoneVerification: (
      <PhoneVerification
        setContent={setContent}
        contentTypes={contentTypes}
        phone={phone}
        contentBefore={contentBefore}
      />
    ),
    signIn: (
      <SignIn
        contentTypes={contentTypes}
        setContent={setContents}
        phone={phone}
        referralCode={referralCode}
        setPhone={setPhone}
      />
    ),
  };

  return <div className="container">{contentComponents[content]}</div>;
};

export default Authorization;
