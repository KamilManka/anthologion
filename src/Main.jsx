import { Space, Switch } from "antd";
import React, {useState} from "react";

const Main = ({ children }) => {


  return (
    <div className="main">

      {children}
    </div>
  );
};

export default Main;
