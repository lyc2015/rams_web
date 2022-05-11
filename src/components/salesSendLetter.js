// 営業送信画面
import React from "react";
import { Form, Button, Col, Row, InputGroup, Modal } from "react-bootstrap";
import axios from "axios";
import "react-datepicker/dist/react-datepicker.css";
import "../asserts/css/style.css";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SalesAppend from "./salesAppend";
import MyToast from "./myToast";
import ErrorsMessageToast from "./errorsMessageToast";
import store from "./redux/store";
import {
  faPlusCircle,
  faEnvelope,
  faMinusCircle,
  faListOl,
  faEdit,
  faPencilAlt,
  faLevelUpAlt,
} from "@fortawesome/free-solid-svg-icons";
import { array } from "prop-types";
axios.defaults.withCredentials = true;

class salesSendLetter extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; // 初期化
    this.handleListNameChange = this.handleListNameChange.bind(this);
  }
  // 初期化
  initialState = {
    storageListName: "", // 已选中的list的name
    selected: [], // selected when table loading
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    allCustomer: [], // お客様レコード用
    allCustomerTemp: [], // お客様レコード用
    customerNo: "",
    customerName: "", // おきゃく名前
    // customers: store.getState().dropDown[15],// 全部お客様 dropDowm用
    customers: store.getState().dropDown[77].slice(1),
    storageList: store.getState().dropDown[63].slice(1),
    storageListAll: store.getState().dropDown[63].slice(1),
    personInCharge: store.getState().dropDown[78].slice(1),
    proposeClassification: [
      // 提案区分
      { code: "0", name: "すべて" },
      { code: "1", name: "案件" },
      { code: "2", name: "要員" },
    ],
    errorsMessageShow: false,
    purchasingManagers: "",
    customerDepartmentNameDrop: store.getState().dropDown[22], // 部門の連想数列
    customerCode: "",
    customerDepartmentName: "",
    allCustomerNo: [],
    currentPage: 1, // 当前page
    selectetRowIds: [],
    customerTemp: [],
    myToastShow: false,
    tableClickColumn: "0",
    message: "",
    type: "",
    linkDetail: "担当追加",
    selectedCustomer: {},
    daiologShowFlag: false,
    positions: store.getState().dropDown[20],
    selectedEmpNos: this.props.location.state?.selectetRowIds || [],
    selectedCusInfos: [],
    listName: 1,
    salesLists: [],
    listName1: "",
    listName2: "",
    listName3: "",
    listShowFlag: true,
    oldListName1: "",
    oldListName2: "",
    oldListName3: "",
    selectedCtmNoStrs1: "",
    selectedCtmNoStrs2: "",
    selectedCtmNoStrs3: "",
    selectedlistName: "",
    storageListName: "",
    storageListNameChange: "",
    backPage: "",
    searchFlag: true,
    sendValue: {},
    projectNo: "",
    selectedCustomers: "",
    isHidden: true,
    addCustomerCode: "",
    backbackPage: "",
    proposeClassificationCode: "0", // 提案区分
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { allCustomer } = this.state;
    const { allCustomer: prevAllCustomer } = prevState;
    const { state: prePropsState } = prevProps.location;
    const { state: propsState } = this.props.location;

    // 从其他页面返回时，表格的data更新后(如果在表格data更新前设置会出现不可预计的bug)，设置对应的已选项和分页

    // 表格的data更新
    if (allCustomer.length && allCustomer !== prevAllCustomer) {
      if (!propsState) return;

      // 设置table的currentPage
      if (propsState.currPage && propsState.currPage !== this.state.currentPage)
        this.setState({
          currentPage: propsState.currPage,
        });

      // お客様情報から戻るばい
      if (
        propsState.customerNo &&
        !this.state.selected.includes(propsState.customerNo)
      ) {
        let targetRecord = this.getRecordFromAllCusByCusNo(
          propsState.customerNo
        );
        this.setState({
          selectetRowIds: [targetRecord.rowId],
          selectedCusInfos: [targetRecord],
          customerNo: propsState.customerNo,
          selected: [propsState.customerNo],
        });
      }

      // 要员送信と案件送信から戻るばい
      if (propsState.targetCusInfos) {
        const { targetCusInfos: selectedCusInfos } = propsState;
        let selectetRowIds = [],
          selected = [];
        selectedCusInfos.forEach((item, index) => {
          selectetRowIds.push(item.rowId);
          selected.push(item.customerNo);
        });

        this.setState({
          selectetRowIds,
          selectedCusInfos,
          selected,
        });
      }

      console.log(
        {
          propsState,
          prePropsState,
          state: this.state,
          prevState,
          prevAllCustomer: prevState.allCustomer,
          allCustomer: this.state.allCustomer,
        },
        "componentDidUpdate"
      );
    }
  }
  componentDidMount() {
    // 初期化
    if (!this.props.location.state) {
      this.setStorageList("0");
      this.getCustomers("all");
      this.getLists();
      return;
    }

    //　戻る時の初期化
    this.setState(
      {
        sendValue: this.props.location.state.sendValue,
        projectNo: this.props.location.state.projectNo,
        proposeClassificationCode:
          this.props.location.state.sendValue.proposeClassificationCode,
        //storageListName: this.props.location.state.sendValue.storageListName,
      },
      () => {
        this.setStorageList(
          this.props.location.state.sendValue.proposeClassificationCode
        );
        switch (this.props.location.state.sendValue.proposeClassificationCode) {
          case "0":
            this.getCustomers("all");
            break;
          case "1":
            this.getCustomers("projectInfoSearch");
            break;
          case "2":
            this.getCustomers("manageSituation");
            break;
          default:
            break;
        }
      }
    );

    // TODO:如果在此时设置selected会因为table的data还没有数据，导致显示出现bug
    if (
      !this.props.location.state.salesPersons ||
      !this.props.location.state.targetCusInfos
    ) {
      this.setState({
        backPage: this.props.location.state.backPage,
        isHidden: false,
      });
    }
    if (this.props.location.state.salesPersons) {
      this.setState({
        selectedEmpNos: this.props.location.state.salesPersons,
      });
    }
    if (this.props.location.state.targetCusInfos) {
      this.setState({
        selectedCusInfos: this.props.location.state.targetCusInfos,
      });
    }
    if (
      this.props.location.state.backbackPage !== null &&
      this.props.location.state.backbackPage !== undefined
    ) {
      this.setState({
        backPage: this.props.location.state.backbackPage,
        isHidden: true,
      });
    }
  }

  getLists = () => {
    axios
      .post(this.state.serverIP + "salesSendLetters/getLists")
      .then((result) => {
        this.setState({
          salesLists: result.data,
          listName: 1 + result.data.length,
          listName1: result.data.length >= 1 ? result.data[0].name : "",
          listName2: result.data.length >= 2 ? result.data[1].name : "",
          listName3: result.data.length >= 3 ? result.data[2].name : "",
          oldListName1: result.data.length >= 1 ? result.data[0].name : "",
          oldListName2: result.data.length >= 2 ? result.data[1].name : "",
          oldListName3: result.data.length >= 3 ? result.data[2].name : "",
          selectedCtmNoStrs1:
            result.data.length >= 1 ? result.data[0].customerNo : "",
          selectedCtmNoStrs2:
            result.data.length >= 2 ? result.data[1].customerNo : "",
          selectedCtmNoStrs3:
            result.data.length >= 3 ? result.data[2].customerNo : "",
        });
      })
      .catch(function (err) {
        alert(err);
      });
  };

  // 初期化お客様取る
  getCustomers = (proposeClassificationCode) => {
    let backPage =
      proposeClassificationCode === null ||
      proposeClassificationCode === undefined ||
      proposeClassificationCode === ""
        ? this.state.backPage
        : proposeClassificationCode;
    axios
      .post(this.state.serverIP + "salesSendLetters/getCustomers")
      .then((result) => {
        let customerNoArray = [];
        let dataArray = [];
        for (let i in result.data) {
          customerNoArray.push(result.data[i].customerNo);
          switch (backPage) {
            case "manageSituation":
              if (
                result.data[i].proposeClassificationCode === null ||
                result.data[i].proposeClassificationCode === "2" ||
                result.data[i].proposeClassificationCode === "3"
              )
                dataArray.push(result.data[i]);
              break;
            case "projectInfoSearch":
              if (
                result.data[i].proposeClassificationCode === null ||
                result.data[i].proposeClassificationCode === "1" ||
                result.data[i].proposeClassificationCode === "3"
              )
                dataArray.push(result.data[i]);
              break;
            default:
              dataArray.push(result.data[i]);
              break;
          }
        }
        for (let i in dataArray) {
          dataArray[i].rowId = i;
        }
        this.setState(
          {
            allCustomer: dataArray,
            allCustomerTemp: dataArray,
            customerTemp: [...dataArray],
            allCustomerNo: customerNoArray,
            allCustomerNum: dataArray.length,
          },
          () => {
            // TODO: 修改分页
          }
        );
      })
      .catch(function (err) {
        alert(err);
      });
  };

  /**
   * 根据CusNo从allCustomer中查找对应的record
   * @param {*} CusNo 目标customerNo(arr或string)
   * @returns
   */
  getRecordFromAllCusByCusNo = (CusNo = "") => {
    if (!CusNo) return undefined;

    if (CusNo instanceof array) {
      let records = [];
      CusNo.forEach((no, index) => {
        for (let index = 0; index < this.state.allCustomer.length; index++) {
          const item = this.state.allCustomer[index];
          if (item.customerNo === no) {
            records.push(item);
            break;
          }
        }
      });
      return records;
    } else {
      let records = {};
      for (let index = 0; index < this.state.allCustomer.length; index++) {
        const item = this.state.allCustomer[index];
        if (item.customerNo === CusNo) {
          records = item;
          break;
        }
      }
      return records;
    }
  };

  setStorageList = (proposeClassificationCode) => {
    let newStorageList = [];
    let storageList = this.state.storageListAll;
    for (let i in storageList) {
      if (storageList[i].text === proposeClassificationCode) {
        newStorageList.push(storageList[i]);
      }
    }
    this.setState({
      storageList: newStorageList,
    });
  };

  handleTagsChange = (event, values, fieldName) => {
    if (values === null) {
      switch (fieldName) {
        case "customerCode":
        case "customerName":
          this.setState({
            customerCode: "",
          });
          break;
        case "customerDepartmentCode":
          this.setState({
            customerDepartmentCode: "",
          });
          break;
        case "storageList":
          this.setState({
            storageListName: "",
            storageListNameChange: "",
            selectedCustomers: "",
          });
          switch (this.state.proposeClassificationCode) {
            case "0":
              this.getCustomers("all");
              break;
            case "1":
              this.getCustomers("projectInfoSearch");
              break;
            case "2":
              this.getCustomers("manageSituation");
              break;
            default:
              break;
          }
          break;
        case "personInCharge":
          this.setState({
            purchasingManagers: "",
            addCustomerCode: "",
          });
          break;
        default:
      }
    } else {
      switch (fieldName) {
        case "customerCode":
        case "customerName":
          this.setState({
            customerCode: values.code,
            purchasingManagers: "",
            addCustomerCode: values.code,
          });
          break;
        case "customerDepartmentCode":
          this.setState({
            customerDepartmentCode: values.code,
          });
          break;
        case "storageList":
          this.setState({
            storageListName: values.name,
            storageListNameChange: values.name,
            selectedCustomers: values.code,
          });

          axios
            .post(this.state.serverIP + "salesSendLetters/getCustomersByNos", {
              ctmNos: values.code.split(","),
              storageListName: values.name,
            })
            .then((result) => {
              let dataArray = [];
              for (let i in result.data) {
                switch (this.state.proposeClassificationCode) {
                  case "1":
                    if (
                      result.data[i].proposeClassificationCode === null ||
                      result.data[i].proposeClassificationCode === "1" ||
                      result.data[i].proposeClassificationCode === "3"
                    )
                      dataArray.push(result.data[i]);
                    break;
                  case "2":
                    if (
                      result.data[i].proposeClassificationCode === null ||
                      result.data[i].proposeClassificationCode === "2" ||
                      result.data[i].proposeClassificationCode === "3"
                    )
                      dataArray.push(result.data[i]);
                    break;
                  default:
                    dataArray.push(result.data[i]);
                    break;
                }
              }
              for (let i in dataArray) {
                dataArray[i].rowId = i;
              }
              this.setState({
                allCustomer: dataArray,
                allCustomerTemp: dataArray,
                customerTemp: [...dataArray],
                selectetRowIds: [],
                selectedCusInfos: [],
              });
            })
            .catch(function (err) {
              alert(err);
            });
          break;
        case "personInCharge":
          this.setState({
            purchasingManagers: values.value,
            customerCode: "",
            addCustomerCode: values.code,
          });
          break;
        default:
      }
    }
  };

  handleMailChange = (row, event) => {
    let allCustomer = this.state.allCustomer;
    allCustomer[row.rowId].purchasingManagersMail = event.target.value;
    this.setState({
      allCustomer: allCustomer,
    });
  };

  // storageListNameChange onchange
  handleListNameChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  // 提案区分onChange
  handleProposeClassificationCodeChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      storageListName: "",
      storageListNameChange: "",
    });
    this.setStorageList(event.target.value);
    switch (event.target.value) {
      case "0":
        this.getCustomers("all");
        break;
      case "1":
        this.getCustomers("projectInfoSearch");
        break;
      case "2":
        this.getCustomers("manageSituation");
        break;
      default:
        break;
    }
  };

  // リスト作成
  handleNewCustomerList = () => {
    let newAllCtmNos = this.state.allCustomer
      .map((item) => item.customerNo)
      .join(",");

    axios
      .post(this.state.serverIP + "salesSendLetters/addNewList", {
        proposeClassificationCode: this.state.proposeClassificationCode,
        code: this.state.selected.length
          ? this.state.selected.join(",")
          : newAllCtmNos,
      })
      .then((result) => {
        let newStorageListArray = this.state.storageList;
        let storageListTemp = {
          name: result.data,
          code: this.state.selected.length
            ? this.state.selected.join(",")
            : newAllCtmNos,
        };
        newStorageListArray.push(storageListTemp);
        this.setState({
          storageList: newStorageListArray,
          storageListName: result.data,
          storageListNameChange: result.data,
          selectedCustomers: this.state.selected.length
            ? this.state.selected.join(",")
            : newAllCtmNos,
          currentPage: 1,
        });
        axios
          .post(this.state.serverIP + "salesSendLetters/getCustomersByNos", {
            ctmNos: this.state.selected.length
              ? this.state.selected
              : newAllCtmNos.split(","),
            storageListName: result.data,
          })
          .then((result) => {
            this.setState({
              allCustomer: result.data,
              allCustomerTemp: result.data,
            });
            this.setState({
              myToastShow: true,
              type: "success",
              message: "処理成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getStorageListName",
            });
          })
          .catch(function (err) {
            alert(err);
          });
      });
  };

  // clearボタン事件
  handleClearLists = () => {
    let a = window.confirm("deleteCustomerList--削除していただきますか？");
    if (a) {
      if (this.state.storageListName !== "") {
        axios
          .post(this.state.serverIP + "salesSendLetters/deleteCustomerList", {
            storageListName: this.state.storageListName,
          })
          .then((result) => {
            let newStorageListArray = [];
            for (let i in this.state.storageList) {
              if (
                this.state.storageList[i].name === this.state.storageListName
              ) {
                let storageListTemp = {
                  name: this.state.storageList[i].name,
                  code: "",
                };
                newStorageListArray.push(storageListTemp);
              } else {
                newStorageListArray.push(this.state.storageList[i]);
              }
            }
            this.setState({
              storageList: newStorageListArray,
              allCustomer: [],
              customerTemp: [],
              selectedCusInfos: [],
              selected: [],
              selectetRowIds: [],
              myToastShow: true,
              type: "success",
              message: "処理成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getStorageListName",
            });
          });
      } else {
        this.setState({
          allCustomer: [],
          customerTemp: [],
          selectedCusInfos: [],
          selected: [],
          selectetRowIds: [],
          myToastShow: true,
          type: "success",
          message: "処理成功",
        });

        setTimeout(() => this.setState({ myToastShow: false }), 3000);
        store.dispatch({
          type: "UPDATE_STATE",
          dropName: "getStorageListName",
        });
      }
    }
  };

  // deleteボタン事件
  handleDeleteLists = () => {
    let a = window.confirm("deleteCustomerListByNo--削除していただきますか？");
    if (a) {
      let selectedIndex = this.state.selectetRowIds;
      let newCustomer = this.state.allCustomer;
      for (let i in selectedIndex) {
        for (let k in newCustomer) {
          if (selectedIndex[i] === newCustomer[k].rowId) {
            newCustomer.splice(k, 1);
            break;
          }
        }
      }
      for (let i in newCustomer) {
        newCustomer[i].rowId = i;
      }
      this.setState({
        selectedCusInfos: [],
        allCustomer: newCustomer,
        allCustomerTemp: newCustomer,
        customerTemp: newCustomer,
        selectetRowIds: [],
        selected: [],
      });

      if (this.state.storageListName !== "") {
        axios
          .post(
            this.state.serverIP + "salesSendLetters/deleteCustomerListByNo",
            {
              oldCtmNos: String(this.state.selectedCustomers).split(","),
              deleteCtmNos: this.state.selected,
              storageListName: this.state.storageListName,
            }
          )
          .then((result) => {
            let newStorageListArray = [];
            for (let i in this.state.storageList) {
              if (
                this.state.storageList[i].name === this.state.storageListName
              ) {
                let storageListTemp = {
                  name: this.state.storageList[i].name,
                  code: result.data,
                };
                newStorageListArray.push(storageListTemp);
              } else {
                newStorageListArray.push(this.state.storageList[i]);
              }
            }
            this.setState({
              selectedCustomers: result.data,
              storageList: newStorageListArray,
            });
            this.setState({
              myToastShow: true,
              type: "success",
              message: "処理成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getStorageListName",
            });
          })
          .catch(function (err) {
            alert(err);
          });
      } else {
        this.setState({
          myToastShow: true,
          type: "success",
          message: "処理成功",
        });
        setTimeout(() => this.setState({ myToastShow: false }), 3000);
        store.dispatch({
          type: "UPDATE_STATE",
          dropName: "getStorageListName",
        });
      }
    }
  };

  // 追加customer到customerList
  handleAddCustomerToList = () => {
    this.setState({ errorsMessageShow: false });
    let allCustomerData = this.state.allCustomer;
    for (let k in allCustomerData) {
      if (allCustomerData[k].customerNo === this.state.addCustomerCode) {
        this.setState({
          errorsMessageShow: true,
          message: "お客様は存在しています、チェックしてください。",
        });
        setTimeout(() => this.setState({ errorsMessageShow: false }), 2000);
        return;
      }
    }
    if (
      this.state.storageListName === null ||
      this.state.storageListName === ""
    ) {
      let newAllCtmNos = "";
      for (let i in this.state.allCustomer) {
        newAllCtmNos += this.state.allCustomer[i].customerNo + ",";
      }
      newAllCtmNos += this.state.addCustomerCode;
      axios
        .post(this.state.serverIP + "salesSendLetters/getCustomersByNos", {
          ctmNos: newAllCtmNos.split(","),
          storageListName: this.state.storageListName,
        })
        .then((result) => {
          let newStorageListArray = [];
          for (let i in this.state.storageList) {
            if (this.state.storageList[i].name === this.state.storageListName) {
              let storageListTemp = {
                name: this.state.storageList[i].name,
                code:
                  this.state.storageList[i].code +
                  "," +
                  this.state.addCustomerCode,
              };
              newStorageListArray.push(storageListTemp);
            } else {
              newStorageListArray.push(this.state.storageList[i]);
            }
          }
          this.setState({
            storageList: newStorageListArray,
            storageListName: this.state.storageListNameChange,
            allCustomer: result.data,
            allCustomerTemp: result.data,
            customerTemp: result.data,
          });
          this.setState({
            myToastShow: true,
            type: "success",
            message: "処理成功",
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getStorageListName",
          });
        })
        .catch(function (err) {
          alert(err);
        });
    } else {
      axios
        .post(this.state.serverIP + "salesSendLetters/customerListUpdate", {
          storageListName: this.state.storageListName,
          customerList: this.state.addCustomerCode,
        })
        .then((result) => {
          axios
            .post(this.state.serverIP + "salesSendLetters/getCustomersByNos", {
              ctmNos: result.data.split(","),
              storageListName: this.state.storageListName,
            })
            .then((result) => {
              let newStorageListArray = [];
              for (let i in this.state.storageList) {
                if (
                  this.state.storageList[i].name === this.state.storageListName
                ) {
                  let storageListTemp = {
                    name: this.state.storageList[i].name,
                    code:
                      this.state.storageList[i].code +
                      "," +
                      this.state.addCustomerCode,
                  };
                  newStorageListArray.push(storageListTemp);
                } else {
                  newStorageListArray.push(this.state.storageList[i]);
                }
              }

              let dataArray = [];
              for (let i in result.data) {
                switch (this.state.proposeClassificationCode) {
                  case "1":
                    if (
                      result.data[i].proposeClassificationCode === null ||
                      result.data[i].proposeClassificationCode === "1" ||
                      result.data[i].proposeClassificationCode === "3"
                    )
                      dataArray.push(result.data[i]);
                    break;
                  case "2":
                    if (
                      result.data[i].proposeClassificationCode === null ||
                      result.data[i].proposeClassificationCode === "2" ||
                      result.data[i].proposeClassificationCode === "3"
                    )
                      dataArray.push(result.data[i]);
                    break;
                  default:
                    dataArray.push(result.data[i]);
                    break;
                }
              }
              for (let i in dataArray) {
                dataArray[i].rowId = i;
              }

              this.setState({
                storageList: newStorageListArray,
                storageListName: this.state.storageListNameChange,
                allCustomer: dataArray,
                allCustomerTemp: dataArray,
                customerTemp: dataArray,
              });
              this.setState({
                myToastShow: true,
                type: "success",
                message: "処理成功",
              });
              setTimeout(() => this.setState({ myToastShow: false }), 3000);
              store.dispatch({
                type: "UPDATE_STATE",
                dropName: "getStorageListName",
              });
            })
            .catch(function (err) {
              alert(err);
            });
        })
        .catch(function (err) {
          alert(err);
        });
    }
  };

  // 全て選択ボタン事件
  handleSelectAllLists = () => {
    let isAlreadyAllSelected =
      this.state.selected.length === this.state.allCustomer.length;

    let selected = [],
      selectedCusInfos = [];

    this.state.allCustomer.forEach((item, index) => {
      selectedCusInfos.push(item);
      selected.push(item.customerNo);
    });
    this.setState({
      selectedCusInfos: isAlreadyAllSelected ? [] : selectedCusInfos,
      selectetRowIds: isAlreadyAllSelected
        ? []
        : this.state.allCustomer.map((item, index) => item.rowId),
      currentPage: 1, // 該当page番号
      selected: isAlreadyAllSelected ? [] : selected,
    });
  };

  // tableのonSelect事件
  handleRowSelect = (row, isSelected, e) => {
    // When allSelected, select any item to cancel the allSelected
    if (this.state.selected.length === this.state.allCustomer.length) {
      this.setState({
        selected: [],
        selectetRowIds: [],
      });
      return;
    }

    let { rowId: rowNo, customerNo } = row;
    if (isSelected) {
      // select
      this.setState({
        selectetRowIds: this.state.selectetRowIds.concat([rowNo]),
        selectedCusInfos: this.state.selectedCusInfos.concat(
          this.state.customerTemp[rowNo]
        ),
        customerNo: row.customerNo,
        selected: this.state.selected.concat(
          this.state.customerTemp[rowNo].customerNo || []
        ),
      });
    } else {
      // cancel select
      let index = this.state.selectetRowIds.findIndex((item) => item === rowNo);
      this.state.selectetRowIds.splice(index, 1);

      let index2 = this.state.selectedCusInfos.findIndex(
        (item) => item.rowId === rowNo
      );
      this.state.selectedCusInfos.splice(index2, 1);

      let index3 = this.state.selected.findIndex((item) => item === customerNo);
      this.state.selected.splice(index3, 1);

      this.setState({
        selectedCusInfos: this.state.selectedCusInfos,
        selectetRowIds: this.state.selectetRowIds,
        customerNo: "",
        selected: this.state.selected,
      });
    }
  };

  // 担当追加ボタンをクリック
  handleGetSalesPersons = (selectedCustomer) => {
    this.setState({
      selectedCustomer: selectedCustomer,
      daiologShowFlag: true,
    });
  };

  handleUpdateName = () => {
    for (let i in this.state.storageListAll) {
      if (
        this.state.storageListAll[i].name === this.state.storageListNameChange
      ) {
        this.setState({
          errorsMessageShow: true,
          message: "同名なリストが存在しています、チェックしてください。",
        });
        setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
        return;
      }
    }
    let salesSendLettersListNames = {
      storageListName: this.state.storageListNameChange,
      oldStorageListName: this.state.storageListName,
    };
    axios
      .post(
        this.state.serverIP + "salesSendLetters/listNameUpdate",
        salesSendLettersListNames
      )
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState({
            myToastShow: true,
            type: "success",
            message: "処理成功",
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          store.dispatch({
            type: "UPDATE_STATE",
            dropName: "getStorageListName",
          });

          let newStorageListArray = [];
          for (let i in this.state.storageList) {
            if (this.state.storageList[i].name === this.state.storageListName) {
              let storageListTemp = {
                name: this.state.storageListNameChange,
                code: this.state.storageList[i].code,
              };
              newStorageListArray.push(storageListTemp);
            } else {
              newStorageListArray.push(this.state.storageList[i]);
            }
          }
          this.setState({
            storageList: newStorageListArray,
            storageListName: this.state.storageListNameChange,
          });
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch(function (err) {
        alert(err);
      });
  };

  // 选中list后，删除当前选中的list
  handleDeleteList = () => {
    let a = window.confirm(
      `${this.state.storageListName}リストを削除していただきますか？`
    );
    if (a) {
      axios
        .post(this.state.serverIP + "salesSendLetters/deleteList", {
          storageListName: this.state.storageListNameChange,
        })
        .then((result) => {
          if (
            result.data.errorsMessage === null ||
            result.data.errorsMessage === undefined
          ) {
            let newStorageListArray = [];
            for (let i in this.state.storageList) {
              if (
                this.state.storageList[i].name === this.state.storageListName
              ) {
              } else {
                newStorageListArray.push(this.state.storageList[i]);
              }
            }
            let newStorageListAllArray = [];
            for (let i in this.state.storageListAll) {
              if (
                this.state.storageListAll[i].name === this.state.storageListName
              ) {
              } else {
                newStorageListAllArray.push(this.state.storageListAll[i]);
              }
            }
            this.setState({
              storageList: newStorageListArray,
              storageListAll: newStorageListAllArray,
              storageListNameChange: "",
              storageListName: "",
            });
            this.setState({
              myToastShow: true,
              type: "success",
              message: "処理成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getStorageListName",
            });
          } else {
            this.setState({ errorsMessageValue: result.data.errorsMessage });
          }
          this.getCustomers();
        })
        .catch(function (err) {
          alert(err);
        });
    }
  };

  /**
   * 戻るボタン
   */
  handleBack = () => {
    let path = {};
    path = {
      pathname: this.state.backPage,
      state: {
        searchFlag: this.state.searchFlag,
        sendValue: this.state.sendValue,
        selectedProjectNo: this.state.projectNo,
        projectNo: this.state.projectNo,
      },
    };
    this.props.history.push(path);
  };

  // 页面跳转
  handleShuseiTo = (actionType) => {
    let path = {};
    const { sendValue } = this.state;
    switch (actionType) {
      // 要員送信
      case "sendLettersConfirm":
        path = {
          pathname: "/subMenuManager/sendLettersConfirm",
          state: {
            currPage: this.state.currentPage,
            salesPersons: this.props.location.state
              ? this.state.selectedEmpNos
              : null,
            targetCusInfos: this.state.selectedCusInfos,
            backPage: "salesSendLetter",
            projectNo: this.state.projectNo,
            backbackPage: this.state.backPage,
            sendValue: {
              proposeClassificationCode: this.state.proposeClassificationCode,
              storageListName: this.state.storageListName,
              customerNo: this.state.customerNo,
            },
          },
        };
        break;
      // 案件送信
      case "sendLettersMatter":
        path = {
          pathname: "/subMenuManager/sendLettersMatter",
          state: {
            currPage: this.state.currentPage,
            targetCusInfos: this.state.selectedCusInfos,
            backPage: "salesSendLetter",
            projectNo: this.state.projectNo,
            backbackPage: this.state.backPage,
            sendValue: {
              proposeClassificationCode: this.state.proposeClassificationCode,
              storageListName: this.state.storageListName,
              customerNo: this.state.customerNo,
            },
          },
        };
        break;
      // お客様情報
      case "update":
        path = {
          pathname: "/subMenuManager/customerInfo",
          state: {
            currPage: this.state.currentPage,
            actionType: "update",
            customerNo: this.state.customerNo,
            backPage: "salesSendLetter",
            backbackPage: this.state.backPage,
            searchFlag: this.state.searchFlag,
            projectNo: this.state.projectNo,
            sendValue: {
              ...sendValue,
              proposeClassificationCode: this.state.proposeClassificationCode,
              storageListName: this.state.storageListName,
              customerNo: this.state.customerNo,
            },
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };

  // 行番号
  renderIndexN = (cell, row, enumObject, index) => {
    let rowNumber = (this.state.currentPage - 1) * 10 + (index + 1);
    return <div>{rowNumber}</div>;
  };

  renderPositionName = (cell) => {
    let positionsTem = this.state.positions;
    for (let i in positionsTem) {
      if (cell === positionsTem[i].code) {
        return positionsTem[i].name;
      }
    }
  };

  renderBusinessCount = (cell) => {
    if (cell === "0") return "";
    else return cell;
  };

  renderMailList = (cell, row, enumObject, index) => {
    if (cell !== null) {
      if (cell.length > 1) {
        return (
          <div>
            <Form.Control
              as="select"
              size="sm"
              onChange={this.handleMailChange.bind(this, row)}
              name="mail"
              autoComplete="off"
            >
              {cell.map((data) => (
                <option key={data} value={data}>
                  {data}
                </option>
              ))}
            </Form.Control>
          </div>
        );
      } else {
        return cell;
      }
    }
  };

  // 鼠标悬停显示全文
  renderCustomerName = (cell) => {
    return <span title={cell}>{cell}</span>;
  };

  renderCustomerDepartmentName = (cell) => {
    let customerDepartmentNameDropTem = this.state.customerDepartmentNameDrop;
    for (let i in customerDepartmentNameDropTem) {
      if (cell === customerDepartmentNameDropTem[i].code) {
        return customerDepartmentNameDropTem[i].name;
      }
    }
  };

  renderGetSalesPersons(cell, row) {
    return (
      <Button
        style={{ padding: 0 }}
        onClick={this.handleGetSalesPersons.bind(this, row)}
        variant="link"
      >
        {cell !== "" && cell !== null ? cell : this.state.linkDetail}
      </Button>
    );
  }

  renderShowsTotal = (start, to, total) => {
    return (
      <p
        style={{
          color: "dark",
          float: "left",
          display: total > 0 ? "block" : "none",
        }}
      >
        {start}から {to}まで , 総計{total}
      </p>
    );
  };

  saveSalesPersons = (row, appendPersonMsg) => {
    const { customerTemp } = this.state;
    /*		this.state.customerTemp[row.rowId].purchasingManagers2 = appendPersonMsg.purchasingManagers2;
		this.state.customerTemp[row.rowId].positionCode2 = appendPersonMsg.positionCode2;
		this.state.customerTemp[row.rowId].purchasingManagersMail2 = appendPersonMsg.purchasingManagersMail2;*/
    customerTemp[row.rowId].purchasingManagersOthers =
      appendPersonMsg.purchasingManagersOthers;
    this.setState({
      daiologShowFlag: false,
      customerTemp,
    });
    this.renderGetSalesPersons(row.salesPersonsAppend, row);
  };

  showSelectedCtms = (selectedNos, flag) => {
    this.setState({
      selectetRowIds: [],
      selected: [],
    });

    if (flag === "1") {
      this.setState({
        selectedlistName: this.state.listName1,
      });
    } else if (flag === "2") {
      this.setState({
        selectedlistName: this.state.listName2,
      });
    } else if (flag === "3") {
      this.setState({
        selectedlistName: this.state.listName3,
      });
    }
    axios
      .post(this.state.serverIP + "salesSendLetters/getCustomersByNos", {
        ctmNos: selectedNos.split(","),
        storageListName: this.state.storageListName,
      })
      .then((result) => {
        this.setState({
          allCustomer: result.data,
          allCustomerTemp: result.data,
        });
      })
      .catch(function (err) {
        alert(err);
      });
  };

  changeListName = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  render() {
    const { message, type } = this.state;
    console.log(
      {
        state: this.state,
        propsState: this.props.location.state,
        customersTable: this.refs.customersTable,
      },
      "render"
    );

    const selectRow = {
      mode: "checkbox",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.handleRowSelect,
      selected: this.state.selected,
    };

    const options = {
      onPageChange: (page) => {
        this.setState({ currentPage: page });
      },
      page: this.state.currentPage,
      defaultSortOrder: "dsc",
      sizePerPage: 10,
      pageStartIndex: 1,
      paginationSize: 3,
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      hideSizePerPage: true,
      alwaysShowAllBtns: true,
      paginationShowsTotal: this.renderShowsTotal,
    };

    return (
      <div>
        {/* MyToast */}
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={message}
            type={type}
          />
        </div>
        {/* ErrorsMessageToast */}
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={message}
            type={"danger"}
          />
        </div>
        {/* Modal */}
        <Modal
          aria-labelledby="contained-modal-title-vcenter"
          centered
          backdrop="static"
          onHide={() => this.setState({ daiologShowFlag: false })}
          show={this.state.daiologShowFlag}
          dialogClassName="modal-purchasingManagersSet"
        >
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <SalesAppend
              customer={this.state.selectedCustomer}
              depart={this.state.customerDepartmentNameDrop}
              allState={this}
              positions={this.state.positions}
            />
          </Modal.Body>
        </Modal>
        {/* title */}
        <Row inline="true">
          <Col className="text-center">
            <h2>
              {"お客様選択" +
                (this.state.backPage === ""
                  ? ""
                  : this.state.backPage === "manageSituation"
                  ? "（要員送信）"
                  : "（案件送信）")}
            </h2>
          </Col>
        </Row>
        <br />
        {/* Form */}
        <Form onSubmit={this.savealesSituation}>
          <Row>
            <Col sm={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text>提案区分</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  as="select"
                  placeholder="提案区分"
                  id="proposeClassificationCode"
                  name="proposeClassificationCode"
                  onChange={this.handleProposeClassificationCodeChange}
                  disabled={this.state.backPage !== "" ? true : false}
                  value={this.state.proposeClassificationCode}
                >
                  {this.state.proposeClassification.map((date) => (
                    <option key={date.code} value={date.code}>
                      {date.name}
                    </option>
                  ))}
                </Form.Control>
                <font style={{ marginLeft: "25px", marginRight: "0px" }}></font>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Row style={{ margin: "0px", padding: "0px" }}>
                <Col sm={8} style={{ margin: "0px", padding: "0px" }}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        お客様名
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      disabled={
                        this.state.allCustomer.length ===
                        this.state.allCustomerNum
                          ? true
                          : false
                      }
                      options={this.state.customers}
                      getOptionLabel={(option) =>
                        option.name ? option.name : ""
                      }
                      value={
                        this.state.customers.find(
                          (v) => v.code === this.state.customerCode
                        ) || ""
                      }
                      onChange={(event, values) =>
                        this.handleTagsChange(event, values, "customerName")
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            id="customerCode"
                            className="auto form-control Autocompletestyle-salesSend-customers"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={4} style={{ margin: "0px", padding: "0px" }}>
                  <InputGroup size="sm" className="mb-3">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sanKanji">担当者</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      disabled={
                        this.state.allCustomer.length ===
                        this.state.allCustomerNum
                          ? true
                          : false
                      }
                      options={this.state.personInCharge}
                      getOptionLabel={(option) =>
                        option.value ? option.value : ""
                      }
                      value={
                        this.state.personInCharge.find(
                          (v) => v.value === this.state.purchasingManagers
                        ) || ""
                      }
                      onChange={(event, values) =>
                        this.handleTagsChange(event, values, "personInCharge")
                      }
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            id="personInCharge"
                            className="auto form-control Autocompletestyle-salesSend-personInCharge"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
              </Row>
            </Col>

            <Col sm={3}>
              <div
                style={{
                  position: "absolute",
                  left: "0px",
                  marginLeft: "-22px",
                }}
              >
                <Button
                  size="sm"
                  variant="info"
                  onClick={this.handleAddCustomerToList}
                  /*
                   * disabled={this.state.allCustomer.length
                   * ===
                   * this.state.customerTemp.length ?
                   * true :
                   * false}
                   */
                  disabled={
                    this.state.customerCode !== "" ||
                    this.state.purchasingManagers !== ""
                      ? false
                      : true
                  }
                >
                  <FontAwesomeIcon icon={faPlusCircle} />
                  追加
                </Button>
              </div>
              <div style={{ position: "absolute", right: "0px" }}>
                <InputGroup size="sm" className="mb-3">
                  <InputGroup.Prepend>
                    <InputGroup.Text id="fiveKanji">格納リスト</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Autocomplete
                    options={this.state.storageList}
                    getOptionLabel={(option) => option?.name || ""}
                    disabled={this.state.selected.length !== 0}
                    value={
                      this.state.storageList.find(
                        (v) => v.name === this.state.storageListName
                      ) || ""
                    }
                    onChange={(event, values) =>
                      this.handleTagsChange(event, values, "storageList")
                    }
                    renderInput={(params) => (
                      <div ref={params.InputProps.ref}>
                        <input
                          type="text"
                          {...params.inputProps}
                          id="storageList"
                          className="auto form-control Autocompletestyle-salesSend-storageList"
                        />
                      </div>
                    )}
                  />
                </InputGroup>
              </div>
            </Col>
            <Col sm={3}>
              <InputGroup size="sm" className="mb-3">
                <Form.Control
                  placeholder="データ修正"
                  id="storageListNameChange"
                  name="storageListNameChange"
                  value={this.state.storageListNameChange}
                  onChange={this.handleListNameChange}
                />
                <Button
                  style={{ marginLeft: "5px", marginRight: "5px" }}
                  size="sm"
                  variant="info"
                  onClick={this.handleUpdateName}
                >
                  <FontAwesomeIcon icon={faPencilAlt} />
                  更新
                </Button>
                <Button
                  size="sm"
                  variant="info"
                  onClick={this.handleDeleteList}
                >
                  <FontAwesomeIcon icon={faMinusCircle} />
                  削除
                </Button>
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={6}>
              <Button
                size="sm"
                variant="info"
                name="clickButton"
                onClick={this.handleSelectAllLists}
                disabled={0 !== this.state.allCustomer.length ? false : true}
              >
                <FontAwesomeIcon icon={faListOl} />
                すべて選択
              </Button>{" "}
              <Button
                size="sm"
                onClick={this.handleShuseiTo.bind(this, "sendLettersConfirm")}
                variant="info"
                name="clickButton"
                hidden={
                  this.state.backPage !== "" &&
                  this.state.backPage !== "manageSituation"
                    ? true
                    : false
                }
                disabled={
                  this.state.selected.length === 0 ||
                  (this.state.backPage !== "" &&
                    this.state.backPage !== "manageSituation")
                    ? true
                    : false
                }
              >
                <FontAwesomeIcon icon={faEnvelope} />
                要員送信
              </Button>{" "}
              <Button
                size="sm"
                onClick={this.handleShuseiTo.bind(this, "sendLettersMatter")}
                variant="info"
                name="clickButton"
                hidden={
                  this.state.backPage !== "" &&
                  this.state.backPage !== "projectInfoSearch"
                    ? true
                    : false
                }
                disabled={
                  this.state.selected.length === 0 ||
                  (this.state.backPage !== "" &&
                    this.state.backPage !== "projectInfoSearch")
                    ? true
                    : false
                }
              >
                <FontAwesomeIcon icon={faEnvelope} />
                案件送信
              </Button>{" "}
              <Button
                size="sm"
                onClick={this.handleShuseiTo.bind(this, "update")}
                disabled={this.state.selectetRowIds.length !== 1 ? true : false}
                variant="info"
              >
                <FontAwesomeIcon icon={faEdit} />
                お客様情報
              </Button>{" "}
              <Button
                size="sm"
                hidden={
                  this.state.backPage === "" || this.state.backPage === null
                    ? true
                    : false
                }
                variant="info"
                onClick={this.handleBack.bind(this)}
              >
                <FontAwesomeIcon icon={faLevelUpAlt} />
                戻る
              </Button>
            </Col>
            <Col sm={6}>
              <div style={{ float: "right" }}>
                <Button
                  size="sm"
                  variant="info"
                  name="clickButton"
                  onClick={this.handleNewCustomerList}
                  disabled={
                    this.state.selected.length === 0 ||
                    !(
                      this.state.storageListName === null ||
                      this.state.storageListName === ""
                    )
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                  リスト作成
                </Button>{" "}
                {/*
                 * <Button size="sm" variant="info"
                 * name="clickButton"
                 * onClick={this.handleClearLists}
                 * disabled={this.state.selected.length===0}><FontAwesomeIcon
                 * icon={faBroom} />クリア</Button>{' '}
                 */}
                <Button
                  size="sm"
                  variant="info"
                  name="clickButton"
                  // TODO:此处业务待确认
                  onClick={
                    this.state.selected.length !== 0
                      ? this.handleClearLists
                      : this.handleDeleteLists
                  }
                  disabled={this.state.selectetRowIds.length === 0}
                >
                  <FontAwesomeIcon icon={faMinusCircle} />
                  削除
                </Button>
              </div>
            </Col>
          </Row>
        </Form>
        {/* BootstrapTable */}
        <Row>
          <Col sm={12}>
            <BootstrapTable
              ref="customersTable"
              data={this.state.allCustomer}
              pagination={true}
              options={options}
              selectRow={selectRow}
              trClassName="customClass"
              headerStyle={{ background: "#5599FF" }}
              striped
              hover
              condensed
            >
              <TableHeaderColumn
                width="6%"
                dataField="any"
                dataFormat={this.renderIndexN}
                autoValue
                editable={false}
              >
                番号
              </TableHeaderColumn>
              <TableHeaderColumn
                width="11%"
                dataField="customerNo"
                hidden
                isKey
              >
                お客様番号
              </TableHeaderColumn>
              <TableHeaderColumn
                width="22%"
                dataField="customerName"
                dataFormat={this.renderCustomerName.bind(this)}
              >
                お客様名
              </TableHeaderColumn>
              <TableHeaderColumn width="9%" dataField="purchasingManagers">
                担当者
              </TableHeaderColumn>
              <TableHeaderColumn
                width="10%"
                dataField="customerDepartmentCode"
                dataFormat={this.renderCustomerDepartmentName}
                hidden
              >
                部門
              </TableHeaderColumn>
              <TableHeaderColumn
                width="9%"
                dataField="positionCode"
                dataFormat={this.renderPositionName}
              >
                職位
              </TableHeaderColumn>
              <TableHeaderColumn
                width="25%"
                dataField="mailList"
                dataFormat={this.renderMailList.bind(this)}
              >
                メール
              </TableHeaderColumn>
              <TableHeaderColumn
                width="25%"
                dataField="purchasingManagersMail"
                hidden
              ></TableHeaderColumn>
              <TableHeaderColumn width="11%" dataField="levelCode" hidden>
                ランキング
              </TableHeaderColumn>
              <TableHeaderColumn
                width="8%"
                dataField="businessCount"
                dataFormat={this.renderBusinessCount}
              >
                取引数
              </TableHeaderColumn>
              <TableHeaderColumn
                width="12%"
                dataField="salesPersonsAppend"
                dataFormat={this.renderGetSalesPersons.bind(this)}
              >
                担当追加
              </TableHeaderColumn>
              <TableHeaderColumn width="11%" dataField="sendLetterCount">
                月送信回数
              </TableHeaderColumn>
              <TableHeaderColumn dataField="rowId" hidden={true}>
                ID
              </TableHeaderColumn>
            </BootstrapTable>
          </Col>
        </Row>
      </div>
    );
  }
}
export default salesSendLetter;
