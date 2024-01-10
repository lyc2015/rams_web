import React, { useState, useEffect } from "react";
import { Card, Button, Select, Table, message, List, Tooltip } from "antd";
import { useQuery } from "react-query";
import axios from "axios";
import { connect } from "react-redux";
import moment from "moment";
import { useHistory } from "react-router-dom";

import "../asserts/css/annualSalesSituationConfirm.css";

axios.defaults.withCredentials = true;

const CURRENT_YEAR = moment().year();

const getColumns = (setSelectedItemEmployeeId) => [
  {
    title: "日付",
    dataIndex: "date",
    key: "date",
    className: "columnHead",
  },
  {
    title: "人数",
    dataIndex: "nums",
    key: "nums",
    className: "columnHead",
  },
  {
    title: "詳細",
    dataIndex: "details",
    key: "details",
    className: "columnHead",
    render: (_, { details }) => {
      if (details.length === 0) {
        return <></>;
      }

      return (
        <List
          split
          dataSource={details.slice(0, 5)}
          grid={{ column: details.length }}
          renderItem={(value, index) => {
            const content = `${value.employeeFirstName}${
              value.employeeLastName
            }(${value.customerAbbreviation}, ${
              value.admissionEndDate
                ? moment(value.admissionEndDate).format("YYYY/MM") + "終了"
                : "稼働"
            })`;

            return (
              <List.Item
                className={
                  index === details.length - 1
                    ? "listItem listItemNoBorder"
                    : "listItem"
                }
                onClick={() =>
                  setSelectedItemEmployeeId((prevState) => {
                    return prevState === "" ? value.employeeNo : "";
                  })
                }
              >
                <Tooltip title={content}>
                  <div className="listItemContent">{content}</div>
                </Tooltip>
              </List.Item>
            );
          }}
        />
      );
    },
  },
];

const useFetchAnnualSalesSituationConfirmList = ({ requestIP, year }) => {
  const [detailsMap, setDetailsMap] = useState();
  const [numsMap, setNumsMap] = useState();
  const [numsArray, setNumsArray] = useState();

  const fetchAnnualSalesSituationConfirmList = (year) =>
    axios.post(requestIP, { salesYearAndMonth: year });

  const queryResult = useQuery(
    ["annualSalesSituationConfirm", "getAnnualSalesSituationConfirmList", year],
    () => fetchAnnualSalesSituationConfirmList(year),
    {
      refetchOnWindowFocus: false,
      onSuccess: ({ data }) => {
        const detailsMap = new Map();
        const numsMap = new Map();

        data.forEach((v) => {
          const salesStaffCode = v["salesStaff"];

          detailsMap.has(salesStaffCode)
            ? detailsMap.get(salesStaffCode).push({
                salesYearAndMonth: v.salesYearAndMonth,
                employeeFirstName: v.employeeFirstName,
                employeeLastName: v.employeeLastName,
                admissionEndDate: v.admissionEndDate,
                customerAbbreviation: v.customerAbbreviation,
                salesStaffFirstName: v.salesStaffFirstName,
                employeeNo: v.employeeNo,
              })
            : detailsMap.set(salesStaffCode, [
                {
                  salesYearAndMonth: v.salesYearAndMonth,
                  employeeFirstName: v.employeeFirstName,
                  employeeLastName: v.employeeLastName,
                  admissionEndDate: v.admissionEndDate,
                  customerAbbreviation: v.customerAbbreviation,
                  salesStaffFirstName: v.salesStaffFirstName,
                  employeeNo: v.employeeNo,
                },
              ]);

          numsMap.has(salesStaffCode)
            ? numsMap.set(salesStaffCode, numsMap.get(salesStaffCode) + 1)
            : numsMap.set(salesStaffCode, 1);
        });

        for (let [key, value] of detailsMap.entries()) {
          const temp = {};

          for (let i = 1; i <= 12; i++) {
            const month = i.toString().length > 1 ? i.toString() : "0" + i;
            temp[`${year}${month}`] = [];
          }

          value.forEach((v) => {
            temp[v.salesYearAndMonth].push(v);
          });

          detailsMap.set(key, []);

          for (let [tempKey, tempValue] of Object.entries(temp)) {
            const foo = {
              key: detailsMap.get(key).length + 1,
              date: tempKey.slice(0, 4) + "/" + tempKey.slice(4),
              nums: tempValue.length,
              details: tempValue,
            };

            detailsMap.get(key).push(foo);
          }
        }

        const numsArray = Array.from(numsMap);
        numsArray.sort((a, b) => b[1] - a[1]);

        setDetailsMap(detailsMap);
        setNumsArray(numsArray);
        setNumsMap(numsMap);
      },
    }
  );

  return {
    ...queryResult,
    detailsMap,
    numsMap,
    numsArray,
  };
};

const SalesTitle = ({ salesStaff, totalNums }) => {
  return (
    <h3 className="salesTitle">
      <span style={{ marginRight: "20px" }}>担当: {salesStaff}</span>
      <span>合計人数: {totalNums}</span>{" "}
    </h3>
  );
};

const AnnualSalesSituationConfirm = ({ serverIP, customerDrop }) => {
  const [selectedSalesStaff, setSelectedSalesStaff] = useState("");
  const [selectedSalesStaffCode, setSelectedSalesStaffCode] = useState("");
  const [displayedSalesStaff, setDisplayedSalesStaff] = useState([]);
  const [selectedCardIndex, setSelectedCardIndex] = useState(0);
  const [selectedItemEmployeeId, setSelectedItemEmployeeId] = useState("");

  const history = useHistory();

  const columns = getColumns(setSelectedItemEmployeeId);

  const requestIP = `${serverIP}annualSalesSituationConfirm/getAnnualSalesSituationConfirmList`;
  const { detailsMap, numsArray, numsMap } =
    useFetchAnnualSalesSituationConfirmList({
      requestIP,
      year: CURRENT_YEAR,
    });

  const isShowFirstSalesStaff =
    displayedSalesStaff.length >= 1 && detailsMap.has(displayedSalesStaff[0]);
  const isShowSecondSalesStaff =
    displayedSalesStaff.length >= 2 && detailsMap.has(displayedSalesStaff[1]);
  const firstSalesStaff = displayedSalesStaff[0];
  const secondSalesStaff = displayedSalesStaff[1];

  const handleSelectSalesStaffChange = (value, option) => {
    setSelectedSalesStaff(value);
    setSelectedSalesStaffCode(option.code);
  };

  const handlePersonalInfoClick = () => {
    const path = {
      pathname: "/subMenuManager/employeeUpdateNew",
      state: {
        actionType: "update",
        id: selectedItemEmployeeId,
      },
    };

    history.push(path);
  };

  const handleSiteInfoClick = () => {
    const path = {
      pathname: "/subMenuManager/siteInfo",
      state: {
        employeeNo: selectedItemEmployeeId,
      },
    };

    history.push(path);
  };

  const handleReflectClick = () => {
    if (!detailsMap.has(selectedSalesStaffCode)) {
      message.warning("データは存在していません！");
      return;
    }

    if (selectedCardIndex === 1 && displayedSalesStaff.length === 1) {
      message.warning("すでに展示してるのデータがあります！");
      return;
    }

    if (displayedSalesStaff.includes(selectedSalesStaffCode)) {
      message.warning("選択された担当がすでに展示されています！");
      return;
    }

    setDisplayedSalesStaff((state) => {
      return [...state, selectedSalesStaffCode];
    });

    setSelectedItemEmployeeId("");
  };

  const handleClearClick = () => {
    setDisplayedSalesStaff((state) => {
      if (selectedCardIndex === 1 && displayedSalesStaff.length >= 1) {
        return [...state.slice(1)];
      } else if (selectedCardIndex === 2 && displayedSalesStaff.length >= 2)
        return [state[0]];
    });

    setSelectedItemEmployeeId("");
  };

  const handleCardClick = (index) => {
    setSelectedCardIndex((prev) => {
      if (prev === index) {
        return 0;
      } else {
        return index;
      }
    });
  };

  useEffect(() => {
    if (numsArray?.length >= 2) {
      setDisplayedSalesStaff([numsArray[0][0], numsArray[1][0]]);
    } else if (numsArray?.length >= 1) {
      setDisplayedSalesStaff([numsArray[0][0]]);
    }
  }, [numsArray, detailsMap, numsMap]);

  return (
    <div className="box">
      <h2 className="title">年度営業状況確認(正社員)</h2>
      <div className="filterButtonContaier">
        <div className="filterButtonLeft">
          <div className="filterButtonBox">
            <div className="filterButtonTitle">年度</div>
            <Select
              placeholder="年度"
              value={CURRENT_YEAR}
              className="filterButtonSelect"
              options={[{ value: CURRENT_YEAR, label: CURRENT_YEAR }]}
            />
          </div>
          <div className="filterButtonBox">
            <div className="filterButtonTitle">営業担当</div>
            <Select
              placeholder="営業担当"
              value={selectedSalesStaff}
              onChange={handleSelectSalesStaffChange}
              className="filterButtonSelect"
              options={customerDrop?.map((item) => ({
                value: item.name,
                label: item.text,
                code: item.code,
              }))}
            />
          </div>
        </div>
        <div>
          <Button
            className="filterButton"
            onClick={handleReflectClick}
            disabled={displayedSalesStaff.length >= 2}
          >
            明細反映
          </Button>
          <Button
            className="filterButton"
            onClick={handleClearClick}
            disabled={
              selectedCardIndex === 0 ||
              (selectedCardIndex === 1 && !isShowFirstSalesStaff) ||
              (selectedCardIndex === 2 && !isShowSecondSalesStaff)
            }
          >
            明細クリア
          </Button>
        </div>
      </div>
      <div>
        <Button
          className="filterButton"
          onClick={handlePersonalInfoClick}
          disabled={!selectedItemEmployeeId}
        >
          個人情報
        </Button>
        <Button
          className="filterButton"
          onClick={handleSiteInfoClick}
          disabled={!selectedItemEmployeeId}
        >
          現場情報
        </Button>
      </div>
      {/* Card container */}
      <div className="cardContainer">
        <Card
          bordered={true}
          hoverable
          className={selectedCardIndex === 1 ? "card selected" : "card"}
          onClick={() => handleCardClick(1)}
        >
          <Table
            bordered
            pagination={false}
            columns={columns}
            title={
              isShowFirstSalesStaff
                ? () => (
                    <SalesTitle
                      salesStaff={
                        customerDrop?.find((v) => v.code === firstSalesStaff)
                          ?.name
                      }
                      totalNums={numsMap.get(firstSalesStaff)}
                    />
                  )
                : undefined
            }
            dataSource={
              isShowFirstSalesStaff ? detailsMap.get(firstSalesStaff) : []
            }
          />
        </Card>
        <Card
          bordered={true}
          hoverable
          className={selectedCardIndex === 2 ? "card selected" : "card"}
          onClick={() => handleCardClick(2)}
        >
          <Table
            bordered
            columns={columns}
            pagination={false}
            title={
              isShowSecondSalesStaff
                ? () => (
                    <SalesTitle
                      salesStaff={
                        customerDrop?.find((v) => v.code === secondSalesStaff)
                          ?.name
                      }
                      totalNums={numsMap.get(secondSalesStaff)}
                    />
                  )
                : undefined
            }
            dataSource={
              isShowSecondSalesStaff ? detailsMap.get(secondSalesStaff) : []
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default connect((state) => ({
  serverIP: state.dropDown[state.dropDown.length - 1],
  customerDrop: state.dropDown[56]
    ?.slice(1)
    .filter((item) => /^LYC.*/.test(item.code)),
}))(AnnualSalesSituationConfirm);
