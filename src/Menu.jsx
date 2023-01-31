import React from "react";
import {
  AppstoreOutlined,
  MailOutlined,
  SettingOutlined,
  HomeOutlined
} from "@ant-design/icons";
import { Menu as NavMenu } from "antd";

import { useState } from "react";
import { Link } from "react-router-dom";

const menuItems = [
  {
    label: "Strona główna",
    // <Link to="/">Strona główna</Link>,
    key: "home",
    icon: <HomeOutlined />,
    disabled: true,
  },
  {
    label: <Link to="/nieszpory">Nieszpory</Link>,
    key: "vespers",
    // icon: <AppstoreOutlined />,
  },
  {
    label: "Powieczerze",
    key: "apodeipnon",
    disabled: true,
  },
  {
    label: "Jutrznia",
    key: "matins",
    disabled: true,
  },
  {
    label: "Godziny kanoniczne",
    key: "canonical-hours",
    // icon: <SettingOutlined />,
    children: [
      {
        label: "Pierwsza",
        key: "first-hour",
        disabled: true,
      },
      {
        label: "Trzecia",
        key: "third-hour",
        disabled: true,
      },
      {
        label: "Szósta",
        key: "sixth-hour",
        disabled: true,
      },
      {
        label: <Link to="/nona">Dziewiąta</Link>,
        key: "ninth-hour",
      },
    ],
  },
];



const Menu = () => {
  const [current, setCurrent] = useState("mail");


  const onClick = (e) => {
    console.log("click ", e);
    setCurrent(e.key);
  };


  return (<>
    <NavMenu
      onClick={onClick}
      selectedKeys={[current]}
      mode="horizontal"
      items={menuItems}
      className="nav-menu"
    />

  </>
  );
};

export default Menu;
