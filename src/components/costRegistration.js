import React from "react";
import {
  Button,
  Form,
  Col,
  Row,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { InputNumber, Modal } from "antd";
import axios from "axios";
import "../asserts/css/development.css";
import "../asserts/css/style.css";
import $ from "jquery";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faEdit,
  faSave,
  faUndo,
  faFile,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import * as publicUtils from "./utils/publicUtils.js";
import store from "./redux/store";
import OtherCostModel from "./otherCost";
import * as utils from "./utils/publicUtils.js";
import { message, notification, Input, Divider } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { isMobileDevice } from "./redux/init";
axios.defaults.withCredentials = true;
moment.locale("ja");
/**
 * 費用登録画面
 */

function transportationCode(code, roundCode) {
  for (var i in roundCode) {
    if (roundCode[i].code != "") {
      if (code == roundCode[i].code) {
        return roundCode[i].name;
      }
    }
  }
}
class costRegistration extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; //初期化
    this.valueChange = this.valueChange.bind(this);
    this.valueChangeOnlyNum = this.valueChangeOnlyNum.bind(this);
    this.regularStatusChange = this.regularStatusChange.bind(this);
    this.handleShowModal = this.handleShowModal.bind(this);
    this.searchCostRegistration = this.searchCostRegistration.bind(this);
    this.searchEmployeeName = this.searchEmployeeName.bind(this);
  }

  componentDidMount() {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state.employeeNo !== undefined
    ) {
      this.setState(
        {
          employeeNo: this.props.location.state.employeeNo,
        },
        () => {
          this.searchCostRegistration();
        }
      );
    } else {
      this.searchCostRegistration();
    }
    this.searchEmployeeName();
  }

  //onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  valueChangeOnlyNum = (e) => {
    let cost = e.target.value;
    if (cost.length > 2) return cost;
    let result = "";
    for (let i = 0; i < cost.length; i++) {
      if (cost.charCodeAt(i) === 12288) {
        result += String.fromCharCode(cost.charCodeAt(i) - 12256);
        continue;
      }
      if (cost.charCodeAt(i) > 65280 && cost.charCodeAt(i) < 65375)
        result += String.fromCharCode(cost.charCodeAt(i) - 65248);
      else result += String.fromCharCode(cost.charCodeAt(i));
    }
    cost = utils.addComma(result);
    this.setState({
      [e.target.name]: cost,
    });
  };

  regularStatusChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
      detailedNameOrLine: "",
    });
  };
  costValueChange = (v, name) => {
    this.setState({
      [name]: utils.costValueChange(v),
    });
  };
  //　初期化データ
  initialState = {
    isMobileDevice: store.getState().isMobileDevice,
    employeeList: [],
    approvalStatuslist: [],
    stationCode1: "", // 出発
    stationCode2: "", // 到着
    detailedNameOrLine: "", //線路/回数
    rowSelectCostClassificationCode: "",
    showOtherCostModal: false, //他の費用
    otherCostModel: null, //他の費用データ
    changeData: false, //insert:false
    yearMonth: new Date(),
    cost: "",
    regularStatus: "0",
    errorItem: "",
    disabledFlag: false,
    station: store.getState().dropDown[14],
    costClassification: store.getState().dropDown[30],
    transportation: store.getState().dropDown[31],
    round: store.getState().dropDown[37],
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };
  //　検索
  searchCostRegistration = () => {
    let minDate = new Date(
      new Date().getMonth() + 1 === 1
        ? new Date().getFullYear() - 1 + "/12"
        : new Date().getFullYear() + "/" + new Date().getMonth()
    );
    minDate.setDate(1);
    this.setState({
      yearAndMonth: "",
      transportationCode: "",
      stationCode3: "",
      stationCode4: "",
      roundCode: "",
      cost1: "",
      oldCostClassification: "",
      oldHappendDate1: "",
      yearAndMonth: "",
      detailedNameOrLine2: "",
      stationCode5: "",
      remark: "",
      rowRemark: "",
      cost2: "",
      oldCostFile: "",
      changeData: "",
      changeFile: "",
      costRegistrationFileFlag: "",
    });
    var model = {};
    model["yearMonth"] = publicUtils
      .formateDate(this.state.yearMonth, true)
      .substring(0, 6);
    model["employeeNo"] = this.state.employeeNo;
    axios
      .post(
        this.state.serverIP + "costRegistration/selectCostRegistration",
        model
      )
      .then((response) => response.data)
      .then((data) => {
        var sumCost = 0;
        if (data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            sumCost = sumCost + data[i].cost * 1;
            if (data[i].costFile != null) {
              data[i].costFileForShow =
                data[i].costFile.split("\\")[
                  data[i].costFile.split("\\").length - 1
                ];
            }
          }
        } else {
          var sumCost = "";
        }
		if (data.length > 0 && data[0].approvalStatus == "1") {
	      this.setState({
	        disabledFlag: true,
	      });
	    }
        this.setState({
          employeeList: data,
          sumCost: utils.addComma(sumCost),
          minDate: minDate,
        });
      });
  };
  searchEmployeeName = () => {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state.employeeNo !== undefined
    ) {
      this.setState({
        employeeName: this.props.location.state.employeeName,
      });
    } else {
      axios
        .post(this.state.serverIP + "costRegistration/selectEmployeeName")
        .then((response) => {
          this.setState({
            employeeName: response.data.employeeName,
          });
        });
    }
  };

  //登録と修正
  InsertCost = () => {
    if (
      this.state.rowSelectCostClassificationCode !== "0" &&
      ($("#costRegistrationFile").get(0).files[0] === undefined ||
        $("#costRegistrationFile").get(0).files[0] === null)
    ) {
      message.error("領収書を添付してください");
      return;
    }
    const formData = new FormData();
    console.log(this.state, 123);
    if (
      this.state.cost === "" ||
      this.state.stationCode1 == "" ||
      this.state.stationCode2 == "" ||
      this.state.detailedNameOrLine == ""
    ) {
      message.error(
        (this.state.regularStatus === "0" ? "定期通勤" : "非定期通勤") +
          "関連の項目入力してください"
      );
      this.setState({
        method: "put",
      });
      if (this.state.stationCode1 === null || this.state.stationCode1 === "") {
        this.setState({ errorItem: "stationCode1" });
        return;
      }
      if (this.state.stationCode2 === null || this.state.stationCode2 === "") {
        this.setState({ errorItem: "stationCode2" });
        return;
      }
      if (this.state.detailedNameOrLine == "") {
        this.setState({ errorItem: "detailedNameOrLine" });
        return;
      }
      if (this.state.cost === "") {
        this.setState({ errorItem: "cost" });
        return;
      }
      return;
    }
    if (isNaN(utils.deleteComma(this.state.cost))) {
      message.error("料金は半角数字のみ入力してください。");
      this.setState({
        method: "put",
      });
      this.setState({ errorItem: "cost" });
      return;
    }
    if (Number(utils.deleteComma(this.state.cost)) <= 0) {
      message.error("料金は0以上を入力してください。");
      this.setState({
        method: "put",
      });
      this.setState({ errorItem: "cost" });
      return;
    }

    this.setState({ errorItem: "" });
    if (this.state.rowSelectCostClassificationCode === "0") {
      var theUrl = "costRegistration/updateCostRegistration";
    } else {
      var theUrl = "costRegistration/insertCostRegistration";
    }
    const emp = {
      costClassificationCode: 0,
      costClassificationName:
        this.state.regularStatus === "0" ? "定期" : "非定期",
      regularStatus: this.state.regularStatus,
      yearMonth: publicUtils
        .formateDate(this.state.yearMonth, true)
        .substring(0, 6),
      happendDate:
        publicUtils.formateDate(this.state.yearMonth, true).substring(0, 6) +
        "01",
      dueDate: null,
      transportationCode: this.state.stationCode1,
      destinationCode: this.state.stationCode2,
      detailedNameOrLine: this.state.detailedNameOrLine,
      cost: Number(utils.deleteComma(this.state.cost)),
      oldHappendDate: this.state.rowSelectHappendDate,
      oldCostClassificationCode: 0,
      oldCostFile: this.state.rowSelectCostFile,
      changeFile: this.state.changeFile,
      remark: this.state.remark,
      employeeNo: this.state.employeeNo,
      employeeName: this.state.employeeName,
      createTime: this.state.rowSelectCreateTime,
    };
    formData.append("emp", JSON.stringify(emp));
    formData.append(
      "costFile",
      publicUtils.nullToEmpty($("#costRegistrationFile").get(0).files[0])
    );
    axios
      .post(this.state.serverIP + theUrl, formData)
      .then((response) => {
        if (response.data) {
          this.setState({ changeData: false });
          message.success("更新成功");
          this.setState({
            method: "put",
          });
          this.resetBook();
          this.searchCostRegistration();
        } else {
          message.error(
            (this.state.employeeList[0].regularStatus === "0"
              ? "定期通勤"
              : "非定期通勤") + "データはすでに存在している"
          );
          this.setState({
            method: "put",
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  /**
   *修正ボタン
   */
  listChange = () => {
    if (this.state.rowSelectCostClassificationCode == "") {
      return;
    }
    if (this.state.rowSelectCostClassificationCode == 0) {
      var splDate = this.state.rowSelectHappendDate.split("～");
      this.setState({
        oldCostClassification: this.state.rowSelectCostClassificationCode,
        oldHappendDate: splDate[0],
        yearAndMonth1: publicUtils.converToLocalTime(splDate[0], true),
        yearAndMonth2: publicUtils.converToLocalTime(splDate[1], true),
        detailedNameOrLine: this.state.rowSelectDetailedNameOrLine,
        stationCode1: this.state.rowSelectTransportationCode.toString(),
        stationCode2: this.state.rowSelectDestinationCode.toString(),
        cost: this.state.rowSelectCost,
        oldCostFile: this.state.rowSelectCostFile,
        changeData: true,
        changeFile: false,
        costRegistrationFileFlag:
          this.state.rowSelectCostFile == "" ? false : true,
        remark: this.state.rowRemark,
      });
    } else if (this.state.rowSelectCostClassificationCode == 1) {
      this.setState({
        oldCostClassification1:
          this.state.rowSelectCostClassificationCode.toString(),
        oldHappendDate1: this.state.rowSelectHappendDate,
        costClassification1: this.state.rowSelectCostClassificationCode,
        yearAndMonth: publicUtils.converToLocalTime(
          this.state.rowSelectHappendDate,
          true
        ),
        transportationCode: this.state.rowSelectTransportationCode,
        stationCode3: this.state.rowSelectOriginCode,
        stationCode4: this.state.rowSelectDestinationCode,
        roundCode: this.state.rowSelectRoundCode,
        cost1: this.state.rowSelectCost,
        oldCostFile: this.state.rowSelectCostFile,
        changeData1: true,
        changeFile1: false,
        costRegistrationFileFlag1:
          this.state.rowSelectCostFile == "" ? false : true,
        showOtherCostModal: true,
        remark: "",
        rowRemark: this.state.rowSelectRemark,
      });
    } else if (this.state.rowSelectCostClassificationCode > 1) {
      this.setState({
        oldCostClassification1:
          this.state.rowSelectCostClassificationCode.toString(),
        oldHappendDate1: this.state.rowSelectHappendDate,
        costClassification1: this.state.rowSelectCostClassificationCode,
        yearAndMonth: publicUtils.converToLocalTime(
          this.state.rowSelectHappendDate,
          true
        ),
        detailedNameOrLine2: this.state.rowSelectDetailedNameOrLine,
        stationCode5: this.state.rowSelectStationCode,
        rowRemark: this.state.rowSelectRemark,
        cost2: this.state.rowSelectCost,
        oldCostFile: this.state.rowSelectCostFile,
        changeData1: true,
        changeFile1: false,
        costRegistrationFileFlag1:
          this.state.rowSelectCostFile == "" ? false : true,
        showOtherCostModal: true,
        remark: "",
      });
    }
  };
  /**
   *削除
   */
  listDel = () => {
    if (this.state.rowSelectCostClassificationCode == "") {
      return;
    }
    Modal.confirm({
      title: "削除してもよろしいでしょうか？",
      icon: <ExclamationCircleOutlined />,
      onOk: () => {
        $("#costRegistrationFile").val(null);
        var splDate = this.state.rowSelectHappendDate.split("～");
        const emp = {
          oldCostClassificationCode: this.state.rowSelectCostClassificationCode,
          oldHappendDate: splDate[0],
          oldCostFile: this.state.rowSelectCostFile,
          yearMonth: publicUtils
            .formateDate(this.state.yearMonth, true)
            .substring(0, 6),
          employeeNo: this.state.employeeNo,
          createTime: this.state.rowSelectCreateTime,
        };
        axios
          .post(
            this.state.serverIP + "costRegistration/deleteCostRegistration",
            emp
          )
          .then((result) => {
            if (result.data == true) {
              //削除の後で、rowSelectの値に空白をセットする
              this.setState({
                costRegistrationFile: null,
                costRegistrationFileName: null,
                changeData: false,
              });
              message.success("削除完了");
              this.setState({
                method: "put",
              });
              this.resetBook();
              this.searchCostRegistration();
            } else {
              message.error("削除失敗");
            }
          })
          .catch((error) => {
            notification.error({
              message: "エラー",
              description: "削除失敗，请检查程序",
              placement: "topLeft",
            });
            console.error("Error - " + error);
          });
      },
      centered: true,
      className: this.state.isMobileDevice ? "confirmModalBtnCenterClass" : "",
    });
  };
  //reset
  resetBook = () => {
    this.setState(() => this.resetStates);
    this.refs.table.setState({
      selectedRowKeys: [],
    });
  };
  //リセット　reset
  resetStates = {
    /*yearMonth: new Date(),*/ regularStatus: "0",
    yearAndMonth1: null,
    yearAndMonth2: null,
    stationCode1: null,
    stationCode2: null,
    detailedNameOrLine: "",
    cost: "",
    costRegistrationFile: null,
    changeData: false,
    oldCostClassification1: null,
    oldHappendDate1: null,
    changeFile: false,
    costRegistrationFileFlag: false,
    costClassification1: null,
    rowSelectHappendDate: "",
    rowSelectCostClassificationCode: "",
    rowSelectDetailedNameOrLine: "",
    rowSelectStationCode: "",
    rowSelectOriginCode: "",
    rowSelectTransportationCode: "",
    rowSelectDestinationCode: "",
    rowSelectCost: "",
    rowSelectRemark: "",
    rowSelectRoundCode: "",
    rowSelectCostFile: "",
    oldCostClassification1: "",
    oldHappendDate1: "",
    costClassification1: "",
    yearAndMonth: "",
    transportationCode: "",
    stationCode3: "",
    stationCode4: "",
    roundCode: "",
    cost1: "",
    oldCostFile: "",
    detailedNameOrLine2: "",
    stationCode5: "",
    remark: "",
    rowRemark: "",
    cost2: "",
    changeData: false,
    changeFile: false,
  };
  //　年月1
  inactiveYearAndMonth1 = (date) => {
    this.setState({
      yearAndMonth1: date,
      changeFile: true,
    });
  };
  //　年月2
  inactiveYearAndMonth2 = (date) => {
    this.setState({
      yearAndMonth2: date,
    });
  };
  state = {
    yearAndMonth: new Date(),
  };
  /**
   * 添付ボタン
   */
  addFile = (event) => {
    $("#costRegistrationFile").click();
  };

  addOtherFile = (event) => {
    $("#otherFile").click();
  };

  changeFile = (event) => {
    var filePath = event.target.value;
    var arr = filePath.split("\\");
    var fileName = arr[arr.length - 1];
    this.setState({
      costRegistrationFile: filePath,
      costRegistrationFileName: fileName,
      changeFile: true,
    });
    if (filePath != null) {
      this.setState(
        {
          costRegistrationFileFlag: true,
        },
        () => {
          this.InsertCost();
        }
      );
    }
  };

  changeOtherFile = (event) => {
    var filePath = event.target.value;
    var arr = filePath.split("\\");
    var fileName = arr[arr.length - 1];
    this.setState(
      {
        otherFile: filePath,
        otherFileName: fileName,
      },
      () => {
        if (filePath != null) {
          this.changeOtherCost();
        }
      }
    );
  };

  // 他の費用添付ファイル
  changeOtherCost = () => {
    const formData = new FormData();

    this.setState({ errorItem: "" });
    var theUrl = "costRegistration/updateCostRegistration";

    let costClassificationName = this.costClassificationCode(
      this.state.rowSelectCostClassificationCode
    );
    const emp = {
      costClassificationName: costClassificationName,
      costClassificationCode: this.state.rowSelectCostClassificationCode,
      happendDate: this.state.rowSelectHappendDate,
      yearMonth: publicUtils
        .formateDate(this.state.yearMonth, true)
        .substring(0, 6),
      oldHappendDate: this.state.rowSelectHappendDate,
      oldCostClassificationCode: this.state.rowSelectCostClassificationCode,
      createTime: this.state.rowSelectCreateTime,
    };
    formData.append("emp", JSON.stringify(emp));
    formData.append(
      "costFile",
      publicUtils.nullToEmpty($("#otherFile").get(0).files[0])
    );
    axios
      .post(this.state.serverIP + theUrl, formData)
      .then((response) => {
        if (response.data) {
          this.setState({ changeData: false });
          message.success("添付成功");
          this.setState({
            method: "put",
          });
          this.resetBook();
          this.searchCostRegistration();
        } else {
          message.error("添付失敗");
          this.setState({
            method: "put",
          });
        }
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
  };

  //行Selectファンクション
  handleRowSelect = (row, isSelected, e) => {
    if (isSelected) {
      this.setState({
        selectedRow: row,
        rowSelectHappendDate: row.happendDate,
        rowSelectCostClassificationCode: row.costClassificationCode,
        rowSelectDetailedNameOrLine: row.detailedNameOrLine,
        rowSelectStationCode: row.stationCode,
        rowSelectOriginCode: row.originCode,
        rowSelectTransportationCode: row.transportationCode,
        rowSelectDestinationCode: row.destinationCode,
        rowSelectCost: row.cost,
        rowSelectRemark: row.remark,
        rowSelectRoundCode: row.roundCode,
        rowSelectCostFile: row.costFile,
        rowSelectCreateTime: row.createTime,
      });
      if (row.costClassificationCode === "0") {
        this.setState({
          rowRemark: row.remark,
          regularStatus: row.regularStatus,
          stationCode1: row.transportationCode,
          stationCode2: row.destinationCode,
          detailedNameOrLine: row.detailedNameOrLine,
          cost: utils.addComma(row.cost),
          remark: row.remark,
          costRegistrationFileFlag:
            this.state.rowSelectCostFile == "" ? false : true,
        });
      } else {
        this.setState({
          selectedRow: {},
          rowRemark: "",
          regularStatus: "0",
          stationCode1: "",
          stationCode2: "",
          detailedNameOrLine: "",
          cost: "",
          remark: "",
          costRegistrationFileFlag: false,
        });
      }
    } else {
      this.setState({
        rowSelectHappendDate: "",
        rowSelectCostClassificationCode: "",
        rowSelectDetailedNameOrLine: "",
        rowSelectStationCode: "",
        rowSelectOriginCode: "",
        rowSelectTransportationCode: "",
        rowSelectDestinationCode: "",
        rowSelectCost: "",
        rowSelectRemark: "",
        rowSelectRoundCode: "",
        rowSelectCostFile: "",
        rowRemark: "",
        rowSelectCreateTime: "",
        oldCostClassification1: "",
        oldHappendDate1: "",
        costClassification1: "",
        yearAndMonth: "",
        transportationCode: "",
        stationCode3: "",
        stationCode4: "",
        roundCode: "",
        cost1: "",
        oldCostFile: "",
        detailedNameOrLine2: "",
        stationCode5: "",
        remark: "",
        rowRemark: "",
        cost2: "",
        stationCode1: "",
        stationCode2: "",
        detailedNameOrLine: "",
        cost: "",
        costRegistrationFileFlag: false,
      });
    }
  };

  /**
   *他の費用画面の開き
   */
  handleShowModal = () => {
    this.setState({ changeData1: false });
    this.setState({ showOtherCostModal: true });
  };
  /**
   *他の費用画面の閉め
   */
  handleHideModal = () => {
    this.setState({ showOtherCostModal: false });
  };
  /* 
	他の費用情報の取得
 　　　*/
  otherCostGet = (otherCostGetTokuro) => {
    this.setState({
      showOtherCostModal: false,
    });
    this.resetBook();
    this.searchCostRegistration();
  };

  station1 = (event, values) => {
    let station = this.state.station.find((v) => v.name === event.target.value);
    if (station !== null && station !== undefined) {
      this.setState({
        stationCode1: station.code,
      });
    }
  };

  station2 = (event, values) => {
    let station = this.state.station.find((v) => v.name === event.target.value);
    if (station !== null && station !== undefined) {
      this.setState({
        stationCode2: station.code,
      });
    }
  };

  getStation1 = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let stationCode = null;
        if (values !== null) {
          stationCode = values.code;
        }
        this.setState({
          stationCode1: stationCode,
        });
      }
    );
  };
  getStation2 = (event, values) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        let stationCode = null;
        if (values !== null) {
          stationCode = values.code;
        }
        this.setState({
          stationCode2: stationCode,
        });
      }
    );
  };
  // AUTOSELECT select事件
  handleTag = ({ target }, fieldName) => {
    const { value, id } = target;
    if (value === "") {
      this.setState({
        [id]: "",
      });
    } else {
      if (
        fieldName === "station" &&
        this.state.station.find((v) => v.name === value) !== undefined
      ) {
        switch (id) {
          case "stationCode1":
            this.setState({
              stationCode1: this.state.station.find((v) => v.name === value)
                .code,
            });
            break;
          case "stationCode2":
            this.setState({
              stationCode2: this.state.station.find((v) => v.name === value)
                .code,
            });
            break;
          default:
        }
      }
    }
  };
  renderShowsTotal(start, to, total) {
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
  }
  testSpan = (cell, row) => {
    if (row.costClassificationCode > 1) {
      return transportationCode(row.stationCode, this.state.station);
    } else {
      return (
        <div className="df align-center">
          <div
            title={transportationCode(
              row.costClassificationCode == 1
                ? row.originCode
                : row.transportationCode,
              this.state.station
            )}
            className="w50p white-space-pre-wrap"
          >
            {transportationCode(
              row.costClassificationCode == 1
                ? row.originCode
                : row.transportationCode,
              this.state.station
            )}
          </div>
          <Divider type="vertical" />
          <div
            title={transportationCode(row.destinationCode, this.state.station)}
            className="w50p white-space-pre-wrap"
          >
            {transportationCode(row.destinationCode, this.state.station)}
          </div>
        </div>
      );
    }
  };

  happendDate(cell, row) {
    return row.costClassificationCode === "0"
      ? cell.substring(0, 4) + "/" + cell.substring(4, 6)
      : cell.substring(0, 4) +
          "/" +
          cell.substring(4, 6) +
          "/" +
          cell.substring(6, 8);
  }

  costClassificationCode(code, row) {
    if (code === "0") {
      if (row.regularStatus === "0") return "定期";
      else return "非定期";
    } else {
      let costClassificationCode = this.state.costClassification;
      for (var i in costClassificationCode) {
        if (costClassificationCode[i].code != "") {
          if (code == costClassificationCode[i].code) {
            return costClassificationCode[i].name;
          }
        }
      }
    }
  }
  detailedNameOrLine(cell, row) {
    if (row.costClassificationCode === "0" && row.regularStatus === "1") {
      return "非定期通勤";
    } else {
      return <div className="white-space-pre-wrap">{cell}</div>;
    }
  }
  cost(cost) {
    return utils.addComma(cost);
  }
  stationCode(code) {
    let stationCode = this.state.station;

    for (var i in stationCode) {
      if (code == stationCode[i].code) {
        return stationCode[i].name;
      }
    }
  }
  transportationCode(code) {
    let transportationCode = this.state.station;
    for (var i in transportationCode) {
      if (code == transportationCode[i].code) {
        return transportationCode[i].name;
      }
    }
  }
  destinationCode(code) {
    let destinationCode = this.state.station;
    for (var i in destinationCode) {
      if (code == destinationCode[i].code) {
        return destinationCode[i].name;
      }
    }
  }

  test = (code) => {
    let destinationCode = this.state.station;
    for (var i in destinationCode) {
      if (code == destinationCode[i].code) {
        return destinationCode[i].name;
      }
    }
  };

  // 年月変更後、レコ＾ド再取る
  setEndDate = (date) => {
    // 禁用两个月前的数据

    /** new Date() 在ios、及不同浏览器上的适配
     * new Date('2022/5') 以字符串的格式创建date时，在ios会不被某些浏览器识别，导致出现 Invalid Date
     * 因此最好使用浏览器都能识别的格式
     * eg： new Date(2011, 01, 07)
     *
     */

    // let nowYearAndMonth =
    //   new Date().getMonth() + 1 === 1
    //     ? new Date().getFullYear() - 1 + "/12"
    //     : new Date().getFullYear() +
    //       "/" +
    //       utils.addDateZero(new Date().getMonth());
    let selectedDate = moment(date).format("YYYY/MM");
    let nowYearAndMonth = moment().subtract("1", "month").format("YYYY/MM");
    console.log(selectedDate, nowYearAndMonth, selectedDate < nowYearAndMonth);

    if (selectedDate < nowYearAndMonth) {
      this.setState({
        disabledFlag: true,
      });
    } else {
      this.setState({
        disabledFlag: false,
      });
    }
    this.refs.table.setState({
      selectedRowKeys: [],
    });
    this.setState(
      {
        yearMonth: date,
        rowRemark: "",
        stationCode1: "",
        stationCode2: "",
        detailedNameOrLine: "",
        cost: "",
        remark: "",
        costRegistrationFileFlag: false,
      },
      () => {
        this.searchCostRegistration();
      }
    );
  };

  render() {
    const { employeeList, isMobileDevice } = this.state;
    const station = this.state.station;

    console.log(
      {
        state: this.state,
        propsState: this.props.location.state,
      },
      "render"
    );

    //　テーブルの行の選択
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      clickToSelectAndEditCell: true,
      hideSelectColumn: true,
      clickToExpand: true, // click to expand row, default is false
      onSelect: this.handleRowSelect,
    };
    //　 テーブルの定義
    const options = {
      page: 1,
      sizePerPage: 5, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
      expandRowBgColor: "rgb(165, 165, 165)",
      approvalBtn: this.createCustomApprovalButton,
      onApprovalRow: this.onApprovalRow,
      handleConfirmApprovalRow: this.customConfirm,
      onDeleteRow: this.onDeleteRow,
    };
    const cellEdit = {
      mode: "click",
      blurToSave: true,
      afterSaveCell: this.sumWorkTimeChange,
    };
    return (
      <div className={isMobileDevice ? "clear-grid-padding" : ""}>
        {/*　 他の費用*/}
        <Modal
          destroyOnClose
          width={isMobileDevice ? "100%" : "40%"}
          visible={this.state.showOtherCostModal}
          footer={null}
          onCancel={this.handleHideModal.bind(this)}
          centered
          // style={isMobileDevice ? { top: "0" } : null}
          bodyStyle={isMobileDevice ? { padding: "12px 0px" } : null}
        >
          <OtherCostModel
            yearMonth={this.state.yearMonth}
            yearAndMonth={this.state.yearAndMonth}
            transportationCode={this.state.transportationCode}
            stationCode3={this.state.stationCode3}
            stationCode4={this.state.stationCode4}
            cost1={this.state.cost1}
            oldCostClassification1={this.state.oldCostClassification1}
            costClassification={this.state.oldCostClassification1}
            oldHappendDate1={this.state.oldHappendDate1}
            detailedNameOrLine2={this.state.detailedNameOrLine2}
            stationCode5={this.state.stationCode5}
            originCode={this.state.rowSelectOriginCode}
            remark={this.state.rowRemark}
            cost2={this.state.cost2}
            oldCostFile1={this.state.oldCostFile}
            changeData1={this.state.changeData1}
            changeFile1={this.state.changeFile1}
            costRegistrationFileFlag1={this.state.costRegistrationFileFlag1}
            otherCostToroku={this.otherCostGet}
            minDate={this.state.minDate}
            otherCostFile={this.state.oldCostFile}
            employeeNo={this.state.employeeNo}
            employeeName={this.state.employeeName}
            createTime={this.state.rowSelectCreateTime}
          />
        </Modal>
        <Form>
          <div>
            <Form.Group>
              <Row inline="true">
                <Col className="text-center">
                  <h2>
                    {this.state.employeeNo === undefined ||
                    this.state.employeeNo === null
                      ? ""
                      : this.state.employeeName + "_"}
                    費用登録
                  </h2>
                  {/* <br /> */}
                  {/* <h2>{new Date().toLocaleDateString()}</h2> */}
                </Col>
              </Row>
            </Form.Group>
          </div>
        </Form>
        <div disabled={true}>
          {/* {this.isMobileDevice?:} */}
          <Row>
            <Col xs={6} sm={3}>
              <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">年月</InputGroup.Text>
                </InputGroup.Prepend>
                <DatePicker
                  selected={this.state.yearMonth}
                  onChange={this.setEndDate}
                  autoComplete="off"
                  locale="ja"
                  showMonthYearPicker
                  showFullMonthYearPicker
                  className="form-control form-control-sm"
                  dateFormat="yyyy/MM"
                  id="datePicker"
                />
              </InputGroup>
            </Col>
            <Col xs={6} sm={2}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text
                    id="niKanjiFor150"
                    title={"定期と非定期のどちらかしか入力できません。"}
                  >
                    区分
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  id="regularStatus"
                  as="select"
                  size="sm"
                  title={"定期と非定期のどちらかしか入力できません。"}
                  onChange={this.regularStatusChange}
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  name="regularStatus"
                  value={this.state.regularStatus}
                  autoComplete="off"
                >
                  <option value="0">定期</option>
                  <option value="1">非定期</option>
                </Form.Control>
              </InputGroup>
            </Col>
            <Col>
              <div>
                <font style={{ color: "grey", fontSize: "14px" }}>
                  定期と非定期は自宅から現場までの費用。それ以外の場合は、「他の費用」の子画面に入力してください
                </font>
              </div>
            </Col>
          </Row>
          <Row>
            <Col sm={2}>
              <font style={{ whiteSpace: "nowrap" }}>
                <b>
                  {this.state.regularStatus === "0"
                    ? "定期券通勤"
                    : "非定期券通勤"}
                </b>
              </font>
            </Col>
          </Row>
          <Row>
            <Col xs={6} sm={3}>
              <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">出発</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="w100p"
                  id="stationCode1"
                  name="stationCode1"
                  value={
                    this.state.station?.find(
                      (v) => v.code === this.state.stationCode1
                    ) || {}
                  }
                  onChange={(event, values) => this.getStation1(event, values)}
                  onInput={this.station1}
                  options={this.state.station}
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="出発"
                        type="text"
                        {...params.inputProps}
                        style={
                          this.state.errorItem === "stationCode1"
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        className="auto form-control Autocompletestyle-costRegistration "
                        id="stationCode1"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
            <Col xs={6} sm={3}>
              <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">到着</InputGroup.Text>
                </InputGroup.Prepend>
                <Autocomplete
                  className="w100p"
                  id="stationCode2"
                  name="stationCode2"
                  value={
                    this.state.station.find(
                      (v) => v.code === this.state.stationCode2
                    ) || {}
                  }
                  onChange={(event, values) => this.getStation2(event, values)}
                  onInput={this.station2}
                  options={this.state.station}
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  getOptionLabel={(option) => option.name || ""}
                  renderInput={(params) => (
                    <div ref={params.InputProps.ref}>
                      <input
                        placeholder="到着"
                        type="text"
                        {...params.inputProps}
                        style={
                          this.state.errorItem === "stationCode2"
                            ? { borderColor: "red" }
                            : { borderColor: "" }
                        }
                        className="auto form-control Autocompletestyle-costRegistration"
                        id="stationCode2"
                      />
                    </div>
                  )}
                />
              </InputGroup>
            </Col>
            <Col xs={6} sm={3}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">
                    {this.state.regularStatus === "0" ? "線路" : "回数"}
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  value={this.state.detailedNameOrLine}
                  style={
                    this.state.errorItem === "detailedNameOrLine"
                      ? { borderColor: "red" }
                      : { borderColor: "" }
                  }
                  title={
                    this.state.regularStatus === "0"
                      ? null
                      : "往復は二回となります"
                  }
                  name="detailedNameOrLine"
                  autoComplete="off"
                  size="sm"
                  maxLength={this.state.regularStatus === "0" ? "20" : "3"}
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onChange={
                    this.state.regularStatus === "0"
                      ? this.valueChange
                      : (e) => this.valueChangeOnlyNum(e)
                  }
                  placeholder={
                    this.state.regularStatus === "0" ? "線路" : "回数"
                  }
                />
              </InputGroup>
            </Col>
            <Col xs={6} sm={3}>
              <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">
                    {this.state.regularStatus === "0" ? "料金" : "合計料金"}
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <InputNumber
                  type="tel"
                  className="w100p form-control"
                  ref="cost"
                  id="cost"
                  min={0}
                  max={9999999}
                  name="cost"
                  maxLength="8"
                  onChange={(v) => this.costValueChange(v, "cost")}
                  placeholder={
                    this.state.regularStatus === "0" ? "料金" : "回数合計料金"
                  }
                  formatter={(value) => utils.addComma(value)}
                  parser={(value) => utils.deleteComma(value)}
                  value={utils.deleteComma(this.state.cost)}
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  controls={false}
                  style={
                    this.state.errorItem === "cost"
                      ? { borderColor: "red" }
                      : { borderColor: "" }
                  }
                />
                {/* <Form.Control
                  type="text"
                  value={this.state.cost}
                  style={
                    this.state.errorItem === "cost"
                      ? { borderColor: "red" }
                      : { borderColor: "" }
                  }
                  name="cost"
                  autoComplete="off"
                  size="sm"
                  maxLength="7"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onChange={(e) => this.costValueChange(e)}
                  placeholder={
                    this.state.regularStatus === "0" ? "料金" : "回数合計料金"
                  }
                /> */}
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={6}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="niKanjiFor150">備考</InputGroup.Text>
                </InputGroup.Prepend>
                <Form.Control
                  type="text"
                  value={this.state.remark}
                  name="remark"
                  autoComplete="off"
                  size="sm"
                  maxLength="20"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onChange={this.valueChange}
                  placeholder="備考"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col>
              <div style={{ textAlign: "center", marginBottom: "20px" }}>
                <Button
                  size="sm"
                  variant="info"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onClick={this.InsertCost}
                  type="button"
                >
                  <FontAwesomeIcon
                    icon={
                      (this.state.rowSelectCostClassificationCode !== "0"
                        ? faSave
                        : faEdit) || ""
                    }
                  />{" "}
                  {this.state.rowSelectCostClassificationCode !== "0"
                    ? " 登録"
                    : " 修正"}
                </Button>{" "}
                <Button
                  size="sm"
                  variant="info"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  type="reset"
                  onClick={this.resetBook}
                >
                  <FontAwesomeIcon icon={faUndo || ""} /> Reset
                </Button>{" "}
                <Button
                  variant="info"
                  size="sm"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onClick={(event) => this.addFile(event)}
                >
                  <FontAwesomeIcon icon={faFile || ""} />
                  {this.state.costRegistrationFileFlag !== true
                    ? " 添付    "
                    : " 済み"}
                </Button>{" "}
                <Form.File
                  id="costRegistrationFile"
                  hidden
                  value={this.state.costRegistrationFile}
                  onChange={(event) => this.changeFile(event)}
                />
                <Form.File
                  id="otherFile"
                  hidden
                  value={this.state.otherFile}
                  onChange={(event) => this.changeOtherFile(event)}
                />
              </div>
            </Col>
          </Row>
          <div>
            <Row>
              <Col>
                <h2 className="text-left fz14 mb10 fwn">
                  総額：{this.state.sumCost || "0"} 円
                </h2>
              </Col>
            </Row>

            <Row className="align-center">
              <Col xs={12} sm={12}>
                <Button
                  variant="info"
                  size="sm"
                  disabled={
                    this.state.disabledFlag ||
                    !(
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    )
                  }
                  onClick={this.handleShowModal.bind(this)}
                >
                  <FontAwesomeIcon /> {" 他の費用"}
                </Button>
                <div style={{ float: "right" }}>
                  <Button
                    size="sm"
                    variant="info"
                    disabled={
                      this.state.disabledFlag ||
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    }
                    onClick={(event) => this.addOtherFile(event)}
                  >
                    <FontAwesomeIcon icon={faFile || ""} />{" "}
                    {"" === "" ? "添付" : "済み"}
                  </Button>{" "}
                  <Button
                    variant="info"
                    size="sm"
                    disabled={
                      this.state.disabledFlag ||
                      this.state.rowSelectCostClassificationCode === "" ||
                      this.state.rowSelectCostClassificationCode === "0"
                    }
                    onClick={this.listChange}
                    id="costRegistrationChange"
                  >
                    <FontAwesomeIcon icon={faEdit || ""} /> 修正
                  </Button>{" "}
                  <Button
                    variant="info"
                    size="sm"
                    disabled={
                      this.state.disabledFlag ||
                      this.state.rowSelectCostClassificationCode === ""
                    }
                    onClick={this.listDel}
                    id="costRegistrationDel"
                  >
                    <FontAwesomeIcon icon={faTrash || ""} /> 削除
                  </Button>
                </div>
              </Col>
            </Row>
          </div>
          <div>
            <Col sm={12}>
              <BootstrapTable
                data={employeeList}
                ref="table"
                id="table"
                pagination={true}
                options={options}
                approvalRow
                selectRow={selectRow}
                headerStyle={{ background: "#5599FF" }}
                striped
                hover
                condensed
              >
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="58"
                  tdStyle={{ padding: ".45em" }}
                  dataField="rowNo"
                  isKey
                  hidden={isMobileDevice}
                >
                  番号
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="100"
                  tdStyle={{ padding: ".45em" }}
                  dataFormat={this.happendDate.bind(this)}
                  dataField="happendDate"
                >
                  日付
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="60"
                  tdStyle={{ padding: ".45em" }}
                  dataField="costClassificationCode"
                  dataFormat={this.costClassificationCode.bind(this)}
                >
                  区分
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="150"
                  tdStyle={{ padding: ".45em" }}
                  dataField="detailedNameOrLine"
                  dataFormat={this.detailedNameOrLine.bind(this)}
                  hidden={isMobileDevice}
                >
                  名称（線路）
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  colSpan="1"
                  width="200"
                  headerAlign="center"
                  dataAlign="center"
                  hidden={isMobileDevice}
                  tdStyle={{ padding: ".45em" }}
                >
                  場所
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="1"
                  width="240"
                  dataField="stationCode"
                  dataAlign="center"
                  dataFormat={this.testSpan}
                  hidden={isMobileDevice}
                  tdStyle={{ padding: ".45em" }}
                >
                  <th
                    style={{
                      textAlign: "center",
                      border: "none",
                      width: "50%",
                      padding: "0px",
                      display: "inline-block",
                    }}
                  >
                    出発地
                  </th>
                  <th
                    style={{
                      textAlign: "center",
                      width: "50%",
                      border: "1px solid #ddd",
                      borderTop: "0",
                      borderBottom: "0",
                      borderRight: "0",
                      padding: "0px",
                      display: "inline-block",
                    }}
                  >
                    目的地
                  </th>
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="80"
                  tdStyle={{ padding: ".45em" }}
                  dataFormat={this.cost.bind(this)}
                  dataField="cost"
                >
                  金額
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="100"
                  tdStyle={{ padding: ".45em" }}
                  dataField="remark"
                  hidden={isMobileDevice}
                  dataFormat={(cell) => (
                    <div className="white-space-pre-wrap">{cell}</div>
                  )}
                >
                  備考
                </TableHeaderColumn>
                <TableHeaderColumn
                  row="0"
                  rowSpan="2"
                  width="100"
                  tdStyle={{ padding: ".45em" }}
                  dataField="costFileForShow"
                  dataFormat={(cell) => (
                    <div className="white-space-pre-wrap">{cell}</div>
                  )}
                  hidden={isMobileDevice}
                >
                  添付
                </TableHeaderColumn>
                <TableHeaderColumn
                  hidden
                  dataField="costFile"
                ></TableHeaderColumn>
                <TableHeaderColumn
                  dataField="transportationCode"
                  hidden
                ></TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </div>
        </div>
      </div>
    );
  }
}
export default costRegistration;
