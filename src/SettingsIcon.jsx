import React from 'react'
import { Space, Dropdown, Switch, ConfigProvider, DatePicker } from "antd";
import { RiSettings4Fill } from "react-icons/ri";
import { useState } from 'react';
import plPL from "antd/locale/pl_PL";
import dayjs from "dayjs";
import "dayjs/locale/pl";
dayjs.locale("pl-pl");


const SettingsIcon = ({date, tone, day, onDateChange}) => {
    const [openDropdown, setOpenDropdown] = useState(false);
    const [readerView, setReaderView] = useState();

    const locale = plPL;
    function getWeeksDiff(startDate, endDate) {
      const msInWeek = 1000 * 60 * 60 * 24 * 7;
      return Math.ceil(Math.abs(endDate - startDate) / msInWeek);
    }
    let weeksDiff = getWeeksDiff(
        new Date("2022-06-24"),
        new Date(date.toISOString().slice(0, 10))
      );
    
      let lentWeeksDiff = getWeeksDiff(
        new Date(date.toISOString().slice(0, 10)),
        new Date("2023-04-16")
      );

    //   const onDateChange = (dateRaw, dateString) => {
    //     console.log(dateRaw.$d);
    //     let dateFormatted = dateRaw.$d;
    //     setDate(dateFormatted);
    //     weeksDiff = getWeeksDiff(new Date("2022-06-25"), dateFormatted);
    //     tone = getOctoechosTone(weeksDiff);
    //     console.log("new tone", tone);
    //     day = dateFormatted.getDay();
    //     console.log("new day", day);
    //     getStichos(tone, day, false);
    //     getStichos(tone, day, true);
    //     getProkeimenon(day);
    //   };
    const handleMenuClick = (e) => {
        if (e.key === "3") {
          setOpenDropdown(false);
        }
      };
    
      const handleOpenChange = (flag) => {
        setOpenDropdown(flag);
      };

      const items = [
        {
          label: (
            <Switch
              style={{ backgroundColor: "#8f2121" }}
              checkedChildren="Z kapłanem"
              unCheckedChildren="Bez kapłana"
              onChange={(checked, e) => {
                setReaderView(checked, e);
              }}
            />
          ),
          key: "0",
        },
        {
          label: (
            <ConfigProvider locale={locale}>
              <DatePicker
                // placeholder="Wybierz datę"
                // defaultValue={dayjs("YYYY-MM-DD")}
                // format={dayjs}
                onChange={(dateRaw, dateString) =>
                  onDateChange(dateRaw, dateString)
                }
              />
            </ConfigProvider>
          ),
          key: "1",
        },
      ];
  return (
    <div>    <Space direction="horizontal">
    <Dropdown
      menu={{ items, onClick: handleMenuClick }}
      trigger={["click"]}
      onOpenChange={handleOpenChange}
      open={openDropdown}
    >
      <a onClick={(e) => e.preventDefault()}>
        <Space>
          <RiSettings4Fill className="settings-icon" />
        </Space>
      </a>
    </Dropdown>
  </Space></div>
  )
}

export default SettingsIcon