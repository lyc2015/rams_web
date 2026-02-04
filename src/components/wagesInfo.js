import React, { Component } from "react";
import {
  Row,
  Form,
  Col,
  InputGroup,
  Button,
  FormControl,
  Modal,
} from "react-bootstrap";
import MyToast from "./myToast";
import $ from "jquery";
import ErrorsMessageToast from "./errorsMessageToast";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import axios from "axios";
import * as publicUtils from "./utils/publicUtils.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faTrash,
  faUndo,
  faLevelUpAlt,
} from "@fortawesome/free-solid-svg-icons";
import * as utils from "./utils/publicUtils.js";
import {
  BootstrapTable,
  TableHeaderColumn,
  BSTable,
} from "react-bootstrap-table";
import "react-bootstrap-table/dist/react-bootstrap-table-all.min.css";
import ExpensesInfo from "./expensesInfo.js";
import Autocomplete from "@material-ui/lab/Autocomplete";
import store from "./redux/store";
registerLocale("ja", ja);
axios.defaults.withCredentials = true;
/**
 * 給料情報画面（社員用）
 */
class WagesInfo extends Component {
  constructor(props) {
    super(props);
    this.state = this.initialState; //初期化
    this._isMounted = false;
  }

  initialState = {
    employeeNo: "", //社員番号
    newEmployeeNo: "", //社員番号
    employeeName: "",
    reflectYearAndMonth: "", //反映年月
    socialInsuranceFlag: "", //社会保険フラグ
    salary: "", //給料
    waitingCost: "", //非稼動費用
    welfarePensionAmount: "", //厚生年金
    healthInsuranceAmount: "", //健康保険
    insuranceFeeAmount: "", //保険総額
    lastTimeBonusAmount: "", //ボーナス前回額
    secondTimeBonusAmount: "", //ボーナス予定額
    fristTimeBonusAmount: "", //ボーナス一回目額
    secondTimeBonusAmount: "", //ボーナス二回目額
    bonusNo: "0", //ボーナスフラグ
    nextBonusMonth: "", //次ボーナス月
    nextRaiseMonth: "", //次回昇給月
    totalAmount: "", //総額
    employeeFormCode: "", //社員形式
    remark: "", //備考
    fristBonusMonth: "", //ボーナス1の期日
    secondBonusMonth: "", //ボーナス2の期日
    raiseStartDate: "", //昇給の期日
    reflectStartDate: "", //反映年月
    lastTimeBonusAmountForInsert: "", //前回のボーナス額（）
    fristTimeBonusAmountForInsert: "", //前回のボーナス額（）
    employeeFormCodeStart: "",
    bonus: null, //ボーナス
    costInfoShow: false, //諸費用画面フラグ
    message: "", //toastのメッセージ
    type: "", //成功や失敗
    myToastShow: false, //toastのフラグ
    errorsMessageShow: false, ///エラーのメッセージのフラグ
    errorsMessageValue: "", //エラーのメッセージ
    actionType: "detail", //処理区分
    socialInsuranceFlagDrop: [], //社会保険フラグselect
    bonusFlagDrop: [], //ボーナスフラグselect
    EmployeeFormCodeDrop: [], //社員性質select
    employeeNameDrop: [], //社員名select
    wagesInfoList: [], //給料明細テーブル
    selectedWagesInfo: {}, //選択された行
    expensesInfoModel: null, //諸費用データ
    torokuText: "登録", //登録ボタンの文字
    expensesInfoModels: [], //諸費用履歴
    kadouCheck: true, //稼働フラグ
    leaderCheck: false, //リーダーフラグ
    backPage: "",
    searchFlag: true,
    sendValue: {},
    relatedEmployees: "", //要員
    allExpensesInfoList: [],
    deleteFlag: true,
    hatsunyubaFlag: true,
    employeeStatus: "",
    period: "",
    employeeStatuss: store.getState().dropDown[4],
    workingConditionStatus: store.getState().dropDown[74].slice(1),
    newEmployeeStatus: "",
    workingCondition: "0",
    rowReflectYearAndMonth: "",
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], //劉林涛　テスト
  };
  //onchange
  valueChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
  };
  //onchange
  valueChangeBonus = (event) => {
    var value = event.target.value;
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (value === "0") {
          this.setState(
            {
              fristTimeBonusAmount: "",
              secondTimeBonusAmount: "",
              fristBonusMonth: "",
              secondBonusMonth: "",
            },
            () => {
              this.totalKeisan();
            }
          );
        }
      }
    );
  };
  //onchange(金額)
  valueChangeMoney = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.state.socialInsuranceFlag === "1") {
          this.hokenKeisan();
        } else {
          this.totalKeisan();
        }
        this.setState({
          [name]: utils.addComma(value),
        });
      }
    );
  };
  //onchange(保険)
  valueChangeInsurance = (event) => {
    // 社会保険下拉框已注释，此函数暂时不再使用
    // if (event.target.value === "1") {
    //   this.setState({
    //     employeeFormCode: "2",
    //   });
    // }
    // this.setState(
    //   {
    //     [event.target.name]: event.target.value,
    //   },
    //   () => {
    //     this.hokenKeisan();
    //   }
    // );
  };
  //onchange(保険金額)
  valueChangeInsuranceMoney = (event) => {
    var name = event.target.name;
    var value = event.target.value;
    
    // 移除所有非数字字符（保留逗号用于千位分隔符显示）
    var numericValue = value.replace(/[^\d,]/g, '');
    
    // 如果输入为空，直接设置
    if (numericValue === "" || numericValue === ",") {
      this.setState({
        [name]: "",
      }, () => {
        // 当厚生或健康金额变化时，自动计算总金额
        this.calculateInsuranceFeeAmount();
      });
      return;
    }
    
    // 移除逗号，只保留数字
    var numberValue = numericValue.replace(/,/g, '');
    
    // 验证：不能为负数（实际上输入时已经过滤掉了非数字字符）
    // 确保是整数（不包含小数点）
    if (numberValue.includes('.')) {
      numberValue = numberValue.split('.')[0];
    }
    
    // 添加千位分隔符
    var formattedValue = utils.addComma(numberValue);
    
    this.setState({
      [name]: formattedValue,
    }, () => {
      // 当厚生或健康金额变化时，自动计算总金额
      this.calculateInsuranceFeeAmount();
    });
  };
  
  // 计算保険総額（厚生 + 健康）
  calculateInsuranceFeeAmount = () => {
    var welfarePensionAmount = utils.deleteComma(this.state.welfarePensionAmount);
    var healthInsuranceAmount = utils.deleteComma(this.state.healthInsuranceAmount);
    
    var welfareNum = welfarePensionAmount === "" ? 0 : Number(welfarePensionAmount);
    var healthNum = healthInsuranceAmount === "" ? 0 : Number(healthInsuranceAmount);
    
    var total = welfareNum + healthNum;
    var insuranceFeeAmount = total > 0 ? utils.addComma(total.toString()) : "";
    
    this.setState({
      insuranceFeeAmount: insuranceFeeAmount,
    }, () => {
      this.totalKeisan();
    });
  };

  componentDidMount() {
    this._isMounted = true;
    axios
      .post(this.state.serverIP + "subMenu/getCompanyDate")
      .then((response) => {
        if (!this._isMounted) return;
        this.setState({
          empNoHead: response.data.empNoHead,
        });
      })
      .catch((error) => {
        console.error("Error - " + error);
      });
    this.setEmployeeStatuss();
    this.getDropDowns();
    console.log(this.props.history);
    $("#expensesInfoBtn").attr("disabled", true);
    if (
      this.props.location.state !== null &&
      this.props.location.state !== undefined &&
      this.props.location.state !== ""
    ) {
      var employeeNo = this.props.location.state.employeeNo;
      var wagesInfo = {};
      wagesInfo["employeeNo"] = employeeNo;
      this.setState({
        sendValue: this.props.location.state.sendValue,
        searchFlag: this.props.location.state.searchFlag,
        actionType: "insert",
        employeeName: employeeNo,
        employeeNo: employeeNo,
        backPage: this.props.location.state.backPage,
      });
      this.search(wagesInfo);
    }
  }

  getemployeeStatus = (employeeNo) => {
    if (!this._isMounted) return;
    if (employeeNo === null) {
      this.setState({ newEmployeeStatus: "" });
    } else if (employeeNo.substring(0, 2) === "SP") {
      this.setState({ newEmployeeStatus: 2 });
    } else if (employeeNo.substring(0, 2) === "SC") {
      this.setState({ newEmployeeStatus: 3 });
    } else {
      this.setState({ newEmployeeStatus: 0 });
    }
  };

  setEmployeeStatuss = () => {
    let employeeStatuss = [];
    for (let i = 0; i < this.state.employeeStatuss.length; i++) {
      if (
        String(this.state.employeeStatuss[i].code) === "" ||
        String(this.state.employeeStatuss[i].code) === "0" ||
        String(this.state.employeeStatuss[i].code) === "2" ||
        String(this.state.employeeStatuss[i].code) === "3"
      ) {
        employeeStatuss.push(this.state.employeeStatuss[i]);
      }
    }
    this.setState({
      employeeStatuss: employeeStatuss,
    });
  };

  /**
   * select取得
   */
  getDropDowns = () => {
    if (!this._isMounted) return;
    var methodArray = [
      "getInsurance",
      "getBonus",
      "getEmployeeForm",
      "getEmployeeNameNoBP",
    ];
    utils.getPublicDropDown(methodArray, this.state.serverIP)
      .then((data) => {
        if (!this._isMounted) return;
        var bonusFlagDrop = [];
        bonusFlagDrop.push({ code: "0", name: "0" });
        bonusFlagDrop.push({ code: "1", name: "1" });
        bonusFlagDrop.push({ code: "2", name: "2" });
        var EmployeeFormCodeDrop = [];
        if (data && data[2]) {
          for (let i in data[2]) {
            if (data[2][i].code != "4") EmployeeFormCodeDrop.push(data[2][i]);
          }
        }
        this.setState({
          socialInsuranceFlagDrop: data && data[0] ? data[0].slice(1) : [],
          //bonusFlagDrop: data[1].slice(1),
          bonusFlagDrop: bonusFlagDrop,
          EmployeeFormCodeDrop: EmployeeFormCodeDrop,
          employeeNameDrop: data && data[3] ? data[3].slice(1) : [],
          employeeInfo: data && data[3] ? data[3].slice(1) : [],
        });
      })
      .catch((error) => {
        console.error("Error loading dropdown data:", error);
        if (!this._isMounted) return;
        // 设置默认值，避免页面崩溃
        this.setState({
          socialInsuranceFlagDrop: [],
          bonusFlagDrop: [
            { code: "0", name: "0" },
            { code: "1", name: "1" },
            { code: "2", name: "2" },
          ],
          EmployeeFormCodeDrop: [],
          employeeNameDrop: [],
          employeeInfo: [],
        });
      });
  };
  /**
   * ボーナス期日の変化
   */
  bonus1Change = (date) => {
    if (date !== null) {
      this.setState({
        fristBonusMonth: date,
      });
    } else {
      this.setState({
        fristBonusMonth: "",
      });
    }
  };

  bonus2Change = (date) => {
    if (date !== null) {
      this.setState({
        secondBonusMonth: date,
      });
    } else {
      this.setState({
        secondBonusMonth: "",
      });
    }
  };

  /**
   * 昇給期日の変化
   */
  raiseChange = (date) => {
    if (date !== null) {
      this.setState({
        raiseStartDate: date,
      });
    } else {
      this.setState({
        raiseStartDate: "",
      });
    }
  };
  /**
   * 昇給期日の変化
   */
  reflectStartDateChange = (date) => {
    if (date !== null) {
      this.setState({
        reflectStartDate: date,
      });
    } else {
      this.setState({
        reflectStartDate: "",
      });
    }
  };
  /**
   * 総計の計算
   */
  totalKeisan = () => {
    var sum = 0;
    var salary = utils.deleteComma(this.state.salary);
    var waitingCost = utils.deleteComma(this.state.waitingCost);
    var insuranceFeeAmount = utils.deleteComma(this.state.insuranceFeeAmount);
    var scheduleOfBonusAmount = utils.deleteComma(
      this.state.scheduleOfBonusAmount
    );

    if (waitingCost !== "" && waitingCost !== null) {
      sum += parseInt(waitingCost);
    } else if (salary !== "" && salary !== null) {
      sum += parseInt(salary);
    }
    sum =
      sum +
      parseInt(insuranceFeeAmount === "" ? 0 : insuranceFeeAmount) +
      Math.floor(
        (scheduleOfBonusAmount === "" ? 0 : scheduleOfBonusAmount) / 12
      );
    //var totalAmount = (isNaN(sum) ? '' : (sum === 0 ? '' : sum));
    var totalAmount = isNaN(sum) ? "" : sum;
    this.setState({
      totalAmount: utils.addComma(totalAmount),
    });
  };
  /**
   * 値を設定
   */
  giveValue = (wagesInfoMod) => {
    this.setState({
      socialInsuranceFlag: wagesInfoMod.socialInsuranceFlag,
      salary: utils.addComma(wagesInfoMod.salary),
      waitingCost: utils.addComma(wagesInfoMod.waitingCost),
      welfarePensionAmount: utils.addComma(wagesInfoMod.welfarePensionAmount),
      healthInsuranceAmount: utils.addComma(wagesInfoMod.healthInsuranceAmount),
      insuranceFeeAmount: utils.addComma(wagesInfoMod.insuranceFeeAmount),
      //lastTimeBonusAmount: utils.addComma(wagesInfoMod.lastTimeBonusAmount),
      fristTimeBonusAmount: utils.addComma(wagesInfoMod.fristTimeBonusAmount),
      secondTimeBonusAmount: utils.addComma(wagesInfoMod.secondTimeBonusAmount),
      scheduleOfBonusAmount: utils.addComma(wagesInfoMod.scheduleOfBonusAmount),
      bonusNo: wagesInfoMod.bonusNo === null ? "0" : wagesInfoMod.bonusNo,
      totalAmount: utils.addComma(wagesInfoMod.totalAmount),
      employeeFormCode: wagesInfoMod.employeeFormCode,
      remark: wagesInfoMod.remark,
      fristBonusMonth: utils.converToLocalTime(
        wagesInfoMod.fristBonusMonth,
        false
      ),
      secondBonusMonth: utils.converToLocalTime(
        wagesInfoMod.secondBonusMonth,
        false
      ),
      raiseStartDate: utils.converToLocalTime(
        wagesInfoMod.nextRaiseMonth,
        false
      ),
      reflectStartDate: utils.converToLocalTime(
        wagesInfoMod.reflectYearAndMonth,
        false
      ),
      workingCondition: wagesInfoMod.workingCondition,
    });
  };
  /**
   * 获取重置状态的对象（不直接调用setState）
   */
  getResetValueState = () => {
    if (this.state.bonus !== null && this.state.bonus !== undefined) {
      return {
        socialInsuranceFlag: "",
        salary: "",
        waitingCost: "",
        welfarePensionAmount: "",
        healthInsuranceAmount: "",
        insuranceFeeAmount: "",
        lastTimeBonusAmount: "",
        fristTimeBonusAmount: "",
        secondTimeBonusAmount: "",
        totalAmount: "",
        employeeFormCode: this.state.employeeFormCodeStart,
        remark: "",
        raiseStartDate: "",
        reflectStartDate: "",
        bonusNo: this.state.bonus.bonusNo,
        scheduleOfBonusAmount: utils.addComma(
          this.state.bonus.scheduleOfBonusAmount
        ),
        fristBonusMonth: utils.converToLocalTime(
          this.state.bonus.fristBonusMonth,
          false
        ),
        secondBonusMonth: utils.converToLocalTime(
          this.state.bonus.secondBonusMonth,
          false
        ),
        period: ''
      };
    } else {
      return {
        socialInsuranceFlag: "",
        salary: "",
        waitingCost: "",
        welfarePensionAmount: "",
        healthInsuranceAmount: "",
        insuranceFeeAmount: "",
        lastTimeBonusAmount: "",
        fristTimeBonusAmount: "",
        secondTimeBonusAmount: "",
        totalAmount: "",
        employeeFormCode: this.state.employeeFormCodeStart,
        remark: "",
        raiseStartDate: "",
        reflectStartDate: "",
        bonusNo: "0",
        scheduleOfBonusAmount: "",
        fristBonusMonth: "",
        secondBonusMonth: "",
        period: ''
      };
    }
  };

  /**
   * 値をリセット
   */
  resetValue = () => {
    if (!this._isMounted) return;
    const resetState = this.getResetValueState();
    this.getemployeeStatus(this.state.employeeNo);
    this.setState(resetState, () => {
      this.totalKeisan();
    });
  };

  /**
   * タイプが違う時に、色々な操作をします。
   */
  employeeStatusChange = (event) => {
    const value = event.target.value;
    let employeeInfoList = this.state.employeeInfo;
    if (value === "0") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (
          employeeInfoList[i].code.substring(0, 2) !== "BP" &&
          employeeInfoList[i].code.substring(0, 2) !== "SP" &&
          employeeInfoList[i].code.substring(0, 2) !== "SC"
        ) {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeNameDrop: newEmpInfoList, employeeName: "" });
    } else if (value === "2") {
      // 個人事業主
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 2) === "SP") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ 
        employeeNameDrop: newEmpInfoList, 
        employeeName: "",
        // 清空厚生和健康字段，并设置 socialInsuranceFlag 为 "0"
        socialInsuranceFlag: "0",
        welfarePensionAmount: "",
        healthInsuranceAmount: "",
        insuranceFeeAmount: "",
      }, () => {
        this.totalKeisan();
      });
    } else if (value === "3") {
      let newEmpInfoList = [];
      for (let i in employeeInfoList) {
        if (employeeInfoList[i].code.substring(0, 2) === "SC") {
          newEmpInfoList.push(employeeInfoList[i]);
        }
      }
      this.setState({ employeeNameDrop: newEmpInfoList, employeeName: "" });
    } else {
      this.setState({ employeeNameDrop: employeeInfoList });
    }
    this.setState({ employeeStatus: value });
  };

  getWagesInfo = (event, values) => {
    var employeeNo = null;
    var actionType = "detail";
    var employeeFormCodeStart = "";
    
    if (values !== null) {
      employeeNo = values.code;
      actionType = "insert";
    }
    
    var wagesInfoMod = {
      employeeNo: employeeNo,
    };
    
    // 先设置员工状态（同步操作）
    this.getemployeeStatus(employeeNo);
    
    // 然后更新基本状态
    this.setState(
      {
        [event.target.name]: event.target.value,
        employeeNo: employeeNo,
        employeeName: employeeNo,
        actionType: actionType,
        employeeFormCodeStart: employeeFormCodeStart,
      },
      () => {
        // 调用搜索，搜索完成后会通过handleRowSelect触发resetValue
        this.search(wagesInfoMod);
      }
    );
  };
  search = (wagesInfoMod) => {
    axios
      .post(this.state.serverIP + "wagesInfo/getWagesInfo", wagesInfoMod)
      .then((result) => {
        // 检查组件是否已挂载，避免在卸载后更新状态
        if (!this._isMounted) return;
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          $("#expensesInfoBtn").attr("disabled", false);
          if (!this._isMounted) return;
          this.setState({
            wagesInfoList: result.data.wagesInfoList,
            kadouCheck: result.data.kadouCheck,
            leaderCheck: result.data.leaderCheck,
            relatedEmployees: result.data.kadouList,
            employeeFormCode: result.data.employeeFormCode,
            employeeFormCodeStart: result.data.employeeFormCode,
            bonus: result.data.bonus,
            hatsunyubaFlag: result.data.hatsunyubaFlag,
            errorsMessageShow: false,
            allExpensesInfoList: result.data.allExpensesInfoList,
            expensesInfoModels: result.data.allExpensesInfoList,
            workingCondition: "0",
          });
          if (result.data.bonus !== null) {
            if (!this._isMounted) return;
            this.setState(
              {
                bonusNo:
                  result.data.bonus.bonusNo === null
                    ? "0"
                    : result.data.bonus.bonusNo,
                fristTimeBonusAmount: utils.addComma(
                  result.data.bonus.fristTimeBonusAmount
                ),
                secondTimeBonusAmount: utils.addComma(
                  result.data.bonus.secondTimeBonusAmount
                ),
                fristTimeBonusAmountForInsert: utils.addComma(
                  result.data.bonus.fristTimeBonusAmount
                ),
                lastTimeBonusAmount: utils.addComma(
                  result.data.bonus.lastTimeBonusAmount
                ),
                lastTimeBonusAmountForInsert: utils.addComma(
                  result.data.bonus.lastTimeBonusAmount
                ),
                scheduleOfBonusAmount: utils.addComma(
                  result.data.bonus.scheduleOfBonusAmount
                ),
                fristBonusMonth: utils.converToLocalTime(
                  result.data.bonus.fristBonusMonth,
                  false
                ),
                secondBonusMonth: utils.converToLocalTime(
                  result.data.bonus.secondBonusMonth,
                  false
                ),
                workingCondition: "0",
              },
              () => {
                this.totalKeisan();
              }
            );
          } else {
            if (!this._isMounted) return;
            this.setState(
              {
                bonusNo: "0",
                scheduleOfBonusAmount: "",
                fristBonusMonth: "",
                secondBonusMonth: "",
                workingCondition: "0",
              },
              () => {
                this.totalKeisan();
              }
            );
          }
        } else {
          $("#expensesInfoBtn").attr("disabled", true);
          if (!this._isMounted) return;
          this.setState(
            {
              wagesInfoList: [],
              allExpensesInfoList: [],
              expensesInfoModels: [],
              kadouCheck: result.data.kadouCheck,
              relatedEmployees: result.data.kadouList,
              leaderCheck: result.data.leaderCheck,
              employeeFormCode: result.data.employeeFormCode,
              employeeFormCodeStart: result.data.employeeFormCode,
              lastTimeBonusAmount: "",
              lastTimeBonusAmountForInsert: "",
              fristTimeBonusAmount: "",
              secondTimeBonusAmount: "",
              fristTimeBonusAmountForInsert: "",
              bonus: result.data.bonus,
              bonusNo: "0",
              workingCondition: "0",
              scheduleOfBonusAmount: "",
              fristBonusMonth: "",
              secondBonusMonth: "",
              hatsunyubaFlag: true,
            },
            () => {
              this.totalKeisan();
            }
          );
          if (!this._isMounted) return;
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
        if (!this._isMounted) return;
        // 只有当 wagesInfoList 存在且有元素时才自动选择最后一行
        if (result.data.wagesInfoList && result.data.wagesInfoList.length >= 1) {
          let _row = result.data.wagesInfoList[result.data.wagesInfoList.length - 1];
          if (_row) {
            this.handleRowSelect(_row, true);
          }
        }
      })
      .catch((error) => {
        console.log(error);
        if (!this._isMounted) return;
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue:
            "エラーが発生してしまいました、画面をリフレッシュしてください",
        });
      });
  };
  /**
   * 行Selectファンクション
   */
  handleRowSelect = (row, isSelected, e) => {
    if (!this._isMounted) return;
    
    if (isSelected) {
      // 准备选中行时的所有状态更新
      const selectedWagesInfo = { ...row };
      var salary = "";
      if (
        selectedWagesInfo.waitingCost !== "" &&
        selectedWagesInfo.waitingCost !== null &&
        selectedWagesInfo.waitingCost !== undefined
      ) {
        salary = selectedWagesInfo.salary;
        selectedWagesInfo["salary"] = "";
      }
      
      // 获取 giveValue 需要设置的状态
      const giveValueState = {
        socialInsuranceFlag: selectedWagesInfo.socialInsuranceFlag,
        salary: utils.addComma(selectedWagesInfo.salary),
        waitingCost: utils.addComma(selectedWagesInfo.waitingCost),
        welfarePensionAmount: utils.addComma(selectedWagesInfo.welfarePensionAmount),
        healthInsuranceAmount: utils.addComma(selectedWagesInfo.healthInsuranceAmount),
        insuranceFeeAmount: utils.addComma(selectedWagesInfo.insuranceFeeAmount),
        fristTimeBonusAmount: utils.addComma(selectedWagesInfo.fristTimeBonusAmount),
        secondTimeBonusAmount: utils.addComma(selectedWagesInfo.secondTimeBonusAmount),
        scheduleOfBonusAmount: utils.addComma(selectedWagesInfo.scheduleOfBonusAmount),
        bonusNo: selectedWagesInfo.bonusNo === null ? "0" : selectedWagesInfo.bonusNo,
        totalAmount: utils.addComma(selectedWagesInfo.totalAmount),
        employeeFormCode: selectedWagesInfo.employeeFormCode,
        remark: selectedWagesInfo.remark,
        fristBonusMonth: utils.converToLocalTime(selectedWagesInfo.fristBonusMonth, false),
        secondBonusMonth: utils.converToLocalTime(selectedWagesInfo.secondBonusMonth, false),
        raiseStartDate: utils.converToLocalTime(selectedWagesInfo.nextRaiseMonth, false),
        reflectStartDate: utils.converToLocalTime(selectedWagesInfo.reflectYearAndMonth, false),
        workingCondition: selectedWagesInfo.workingCondition,
      };
      
      // 恢复salary
      if (
        row.waitingCost !== "" &&
        row.waitingCost !== null &&
        row.waitingCost !== undefined
      ) {
        selectedWagesInfo["salary"] = salary;
      }
      
      // 确定其他状态
      let torokuText = "登録";
      let deleteFlag = true;
      let actionType = "update";
      
      // 检查 row 和 wagesInfoList 是否存在，避免访问 undefined 属性
      if (
        row &&
        row.reflectYearAndMonth &&
        this.state.wagesInfoList &&
        this.state.wagesInfoList.length > 0 &&
        this.state.wagesInfoList[this.state.wagesInfoList.length - 1] &&
        row.reflectYearAndMonth ===
        this.state.wagesInfoList[this.state.wagesInfoList.length - 1]
          .reflectYearAndMonth
      ) {
        torokuText = "更新";
        deleteFlag = false;
      } else {
        actionType = "detail";
      }
      
      const expensesInfoModels = row.expensesInfoModels != null ? row.expensesInfoModels : [];
      
      // 合并所有状态更新为一个setState调用
      this.setState({
        ...giveValueState,
        actionType: actionType,
        torokuText: torokuText,
        deleteFlag: deleteFlag,
        expensesInfoModels: expensesInfoModels,
        period: row.period,
        rowReflectYearAndMonth: row.reflectYearAndMonth,
      });
    } else {
      // 取消选择时，合并resetValue和其他状态更新
      const resetState = this.getResetValueState();
      this.setState({
        ...resetState,
        actionType: "insert",
        torokuText: "登録",
        expensesInfoModels: this.state.allExpensesInfoList,
        deleteFlag: true,
        period: "",
        rowReflectYearAndMonth: "",
      }, () => {
        // 在setState完成后调用totalKeisan
        this.totalKeisan();
      });
    }
  };
  /**
   * 修正ボタン
   */
  shuseiBtn = (selectedWagesInfo) => {
    var selectedWagesInfo = selectedWagesInfo;
    var salary = "";
    if (
      selectedWagesInfo.waitingCost !== "" &&
      selectedWagesInfo.waitingCost !== null &&
      selectedWagesInfo.waitingCost !== undefined
    ) {
      salary = selectedWagesInfo.salary;
      selectedWagesInfo["salary"] = "";
    }
    this.setState({
      actionType: "update",
    });
    this.giveValue(selectedWagesInfo);
    if (
      selectedWagesInfo.waitingCost !== "" &&
      selectedWagesInfo.waitingCost !== null &&
      selectedWagesInfo.waitingCost !== undefined
    ) {
      selectedWagesInfo["salary"] = salary;
    }
  };
  /**
   * https://asia-northeast1-tsunagi-all.cloudfunctions.net/
   * 社会保険計算
   */
  async hokenKeisan() {
    var salary = "";
    if (this.state.workingCondition === "0") {
      salary = utils.deleteComma(this.state.salary);
    } else if (this.state.workingCondition === "1") {
      // 优先使用当前输入的 salary 值
      var currentSalary = utils.deleteComma(this.state.salary);
      if (currentSalary !== "" && currentSalary !== "0") {
        salary = currentSalary;
      } else if (this.state.wagesInfoList.length > 0) {
        // 如果当前输入的 salary 为空，则从 wagesInfoList 中获取
        if (
          this.state.wagesInfoList[this.state.wagesInfoList.length - 1]
            .workingCondition === "1"
        ) {
          if (this.state.wagesInfoList.length > 1)
            salary = utils.deleteComma(
              this.state.wagesInfoList[this.state.wagesInfoList.length - 2]
                .salary
            );
          else
            salary = utils.deleteComma(
              this.state.wagesInfoList[this.state.wagesInfoList.length - 1]
                .salary
            );
        } else
          salary = utils.deleteComma(
            this.state.wagesInfoList[this.state.wagesInfoList.length - 1].salary
          );
      } else {
        // 如果 wagesInfoList 也为空，则使用 waitingCost
        salary = utils.deleteComma(this.state.waitingCost);
      }
    }
    // 社会保険接口调用逻辑已注释，改为手动录入方式
    // 当 socialInsuranceFlag === "1" 时，不再调用第三方接口，改为手动输入厚生和健康金额
    if (this.state.socialInsuranceFlag === "1") {
      // 以下代码已注释：不再验证工资和调用接口，改为手动录入
      // if (salary === "") {
      //   this.setState({
      //     errorsMessageShow: true,
      //     errorsMessageValue: "給料を入力してください",
      //     socialInsuranceFlag: "0",
      //     healthInsuranceAmount: "",
      //     welfarePensionAmount: "",
      //     insuranceFeeAmount: "",
      //   });
      //   setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
      // } else if (salary === "0") {
      //   this.setState({
      //     errorsMessageShow: true,
      //     errorsMessageValue: "給料を0以上に入力してください",
      //     socialInsuranceFlag: "0",
      //     healthInsuranceAmount: "",
      //     welfarePensionAmount: "",
      //     insuranceFeeAmount: "",
      //   });
      //   setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
      // } else {
      //   if (salary > 1000000) salary = 1000000;
      //   await axios
      //     .post("/api/getSocialInsurance202003?salary=" + salary + "&kaigo=0")
      //     .then((result) => {
      //       var welfarePensionAmount = utils.addComma(
      //         result.data.pension.payment
      //       );
      //       var healthInsuranceAmount = utils.addComma(
      //         result.data.insurance.payment
      //       );
      //       var insuranceFeeAmount = utils.addComma(
      //         result.data.insurance.payment + result.data.pension.payment
      //       );
      //       this.setState({
      //         welfarePensionAmount: welfarePensionAmount,
      //         healthInsuranceAmount: healthInsuranceAmount,
      //         insuranceFeeAmount: insuranceFeeAmount,
      //       });
      //     })
      //     .catch((error) => {
      //       this.setState({
      //         errorsMessageShow: true,
      //         errorsMessageValue:
      //           "エラーが発生してしまいました、画面をリフレッシュしてください",
      //         socialInsuranceFlag: "0",
      //       });
      //       setTimeout(
      //         () => this.setState({ errorsMessageValue: false }),
      //         3000
      //       );
      //     });
      // }
      // 手动录入模式下，只需要计算总金额，不需要调用接口
      this.totalKeisan();
    } else {
      this.setState(
        {
          welfarePensionAmount: "",
          healthInsuranceAmount: "",
          insuranceFeeAmount: "",
        },
        () => {
          this.totalKeisan();
        }
      );
    }
  }
  getExpensesInfo = (expensesInfoToroku) => {
    if (expensesInfoToroku === "success") {
      this.setState(
        {
          /*                costInfoShow: false,
           */
        },
        () => {
          var wagesInfoMod = {
            employeeNo: this.state.employeeNo,
          };
          this.search(wagesInfoMod);
          /*                this.refs.wagesInfoTable.setState({
                    selectedRowKeys:[],
                })*/
        }
      );
    }
    console.log(expensesInfoToroku);
  };
  /**
   * 登録ボタン
   */
  toroku = () => {
    // 验证厚生和健康字段：根据社員区分判断是否必填
    var welfarePensionAmount = utils.deleteComma(this.state.welfarePensionAmount);
    var healthInsuranceAmount = utils.deleteComma(this.state.healthInsuranceAmount);
    
    // 如果是社员（employeeStatus === "0"），则厚生和健康必填
    if (this.state.employeeStatus === "0") {
      // 必填验证
      if (welfarePensionAmount === "" || welfarePensionAmount === null || welfarePensionAmount === undefined) {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "厚生を入力してください",
        });
        setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
        return;
      }
      
      if (healthInsuranceAmount === "" || healthInsuranceAmount === null || healthInsuranceAmount === undefined) {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "健康を入力してください",
        });
        setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
        return;
      }
      
      // 数字验证：必须是整数、非负数
      var welfareNum = Number(welfarePensionAmount);
      var healthNum = Number(healthInsuranceAmount);
      
      if (isNaN(welfareNum) || welfareNum < 0 || !Number.isInteger(welfareNum)) {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "厚生は0以上の整数を入力してください",
        });
        setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
        return;
      }
      
      if (isNaN(healthNum) || healthNum < 0 || !Number.isInteger(healthNum)) {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue: "健康は0以上の整数を入力してください",
        });
        setTimeout(() => this.setState({ errorsMessageValue: false }), 3000);
        return;
      }
    } else if (this.state.employeeStatus === "2") {
      // 如果是個人事業主（社員区分 === "2"），清空厚生和健康字段
      welfarePensionAmount = "";
      healthInsuranceAmount = "";
    }
    
    var wagesInfoModel = {};
    $("#socialInsuranceFlag").attr("disabled", false);
    $("#bonusNo").attr("disabled", false);
    var formArray = $("#wagesInfoForm").serializeArray();
    $.each(formArray, function (i, item) {
      wagesInfoModel[item.name] = item.value;
    });
    wagesInfoModel["workingCondition"] = this.state.workingCondition;
    if (this.state.workingCondition === "0") {
      wagesInfoModel["salary"] = utils.deleteComma(this.state.salary);
      wagesInfoModel["waitingCost"] = "";
    } else {
      wagesInfoModel["salary"] = "";
      wagesInfoModel["waitingCost"] = utils.deleteComma(this.state.waitingCost);
    }
    wagesInfoModel["welfarePensionAmount"] = utils.deleteComma(
      this.state.welfarePensionAmount
    );
    wagesInfoModel["healthInsuranceAmount"] = utils.deleteComma(
      this.state.healthInsuranceAmount
    );
    wagesInfoModel["insuranceFeeAmount"] =
      Number(utils.deleteComma(this.state.welfarePensionAmount)) +
      Number(utils.deleteComma(this.state.healthInsuranceAmount));
    wagesInfoModel["scheduleOfBonusAmount"] = utils.deleteComma(
      this.state.scheduleOfBonusAmount
    );
    //wagesInfoModel["lastTimeBonusAmount"] = utils.deleteComma(this.state.lastTimeBonusAmount);
    wagesInfoModel["fristTimeBonusAmount"] = utils.deleteComma(
      this.state.fristTimeBonusAmount
    );
    wagesInfoModel["secondTimeBonusAmount"] = utils.deleteComma(
      this.state.secondTimeBonusAmount
    );
    wagesInfoModel["totalAmount"] = utils.deleteComma(this.state.totalAmount);
    wagesInfoModel["employeeNo"] = this.state.employeeNo;
    wagesInfoModel["nextRaiseMonth"] = utils.formateDate(
      this.state.raiseStartDate,
      false
    );
    wagesInfoModel["fristBonusMonth"] = utils.formateDate(
      this.state.fristBonusMonth,
      false
    );
    wagesInfoModel["secondBonusMonth"] = utils.formateDate(
      this.state.secondBonusMonth,
      false
    );
    wagesInfoModel["reflectYearAndMonth"] = utils.formateDate(
      this.state.reflectStartDate,
      false
    );
    wagesInfoModel["actionType"] = this.state.actionType;
    wagesInfoModel["expensesInfoModel"] = this.state.expensesInfoModel;
    wagesInfoModel["newEmployeeNo"] = this.state.newEmployeeNo;
    wagesInfoModel["employeeStatus"] = this.state.employeeFormCode;
    
    // socialInsuranceFlag 必传：新增时如果没有值，根据社員区分设置默认值
    // 如果是個人事業主（employeeStatus === "2"），设置为 "0"
    // 如果是社员（employeeStatus === "0"），根据是否有厚生和健康金额来判断
    if (!wagesInfoModel["socialInsuranceFlag"] || wagesInfoModel["socialInsuranceFlag"] === "") {
      if (this.state.employeeStatus === "2") {
        wagesInfoModel["socialInsuranceFlag"] = "0";
      } else if (this.state.employeeStatus === "0" && (welfarePensionAmount !== "" || healthInsuranceAmount !== "")) {
        wagesInfoModel["socialInsuranceFlag"] = "1";
      } else {
        wagesInfoModel["socialInsuranceFlag"] = this.state.socialInsuranceFlag || "0";
      }
    }
    
    // 如果是個人事業主（社員区分 === "2"），确保厚生和健康为空
    if (this.state.employeeStatus === "2") {
      wagesInfoModel["welfarePensionAmount"] = "";
      wagesInfoModel["healthInsuranceAmount"] = "";
      wagesInfoModel["insuranceFeeAmount"] = "";
    }
    if (this.state.employeeFormCode === "3") {
      $("#socialInsuranceFlag").attr("disabled", true);
      $("#bonusNo").attr("disabled", true);
    }
    axios
      .post(this.state.serverIP + "wagesInfo/toroku", wagesInfoModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.setState({
            myToastShow: true,
            type: "success",
            errorsMessageShow: false,
            message: result.data.message,
          });
          setTimeout(() => this.setState({ myToastShow: false }), 3000);
          if (this.state.newEmployeeNo !== "") {
            store.dispatch({
              type: "UPDATE_STATE",
              dropName: "getEmployeeName",
            });
            this.getNewEmployeeNameDrop(
              wagesInfoModel["employeeNo"],
              this.state.newEmployeeNo
            );
            wagesInfoModel["employeeNo"] = this.state.newEmployeeNo;
          }
          this.search(wagesInfoModel);
          this.resetValue();
          this.refs.wagesInfoTable.setState({
            selectedRowKeys: [],
          });
          this.setState({
            actionType: "insert",
            torokuText: "登録",
            deleteFlag: true,
          });
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        this.setState({
          errorsMessageShow: true,
          errorsMessageValue:
            "エラーが発生してしまいました、画面をリフレッシュしてください",
        });
      });
  };

  getNewEmployeeNameDrop = (employeeNo, newEmployeeNo) => {
    let employeeNameDrop = this.state.employeeNameDrop;
    for (let i = 0; i < employeeNameDrop.length; i++) {
      if (employeeNameDrop[i].code === employeeNo) {
        employeeNameDrop[i].code = newEmployeeNo;
        employeeNameDrop[i].name =
          employeeNameDrop[i].text + "(" + newEmployeeNo + ")";
      }
    }
    this.setState({
      employeeNameDrop: employeeNameDrop,
      employeeName: newEmployeeNo,
      employeeNo: newEmployeeNo,
    });
  };

  /**
   * 小さい画面の閉め
   */
  handleHideModal = (Kbn) => {
    this.setState({ costInfoShow: false });
  };
  /**
   *  小さい画面の開き
   */
  handleShowModal = (Kbn) => {
    this.setState({ costInfoShow: true });
  };
  /**
   * テーブルの下もの
   * @param {} start
   * @param {*} to
   * @param {*} total
   */
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
  addMarkSalary = (cell, row) => {
    let salary = utils.addComma(row.salary.split("(")[0]);
    let str = utils.addComma(row.salary.split("(")[1]);
    if (str.length > 0) {
      salary = salary + "(非)";
    }
    return salary;
  };
  addMarkInsuranceFeeAmount = (cell, row) => {
    let insuranceFeeAmount = utils.addComma(row.insuranceFeeAmount);
    return insuranceFeeAmount;
  };
  addMarkTransportationExpenses = (cell, row) => {
    let transportationExpenses = utils.addComma(row.transportationExpenses);
    return transportationExpenses;
  };
  addMarkLeaderAllowanceAmount = (cell, row) => {
    let leaderAllowanceAmount = utils.addComma(row.leaderAllowanceAmount);
    return leaderAllowanceAmount;
  };
  addMarkintroductionAllowance = (cell, row) => {
    let introductionAllowance = utils.addComma(row.introductionAllowance);
    return introductionAllowance;
  };
  addMarkOtherAllowanceAmount = (cell, row) => {
    let otherAllowanceAmount = utils.addComma(
      Number(row.otherAllowanceAmount) +
        Number(row.leaderAllowanceAmount) +
        Number(row.introductionAllowance)
    );
    return otherAllowanceAmount === "0" ? "" : otherAllowanceAmount;
  };
  addMarkScheduleOfBonusAmount = (cell, row) => {
    let bonusSum = utils.addComma(row.bonusSum).replace(".0", "");
    return bonusSum;
  };
  /**
   * 戻るボタン
   */
  back = () => {
    var path = {};
    path = {
      pathname: this.state.backPage,
      state: {
        searchFlag: this.state.searchFlag,
        sendValue: this.state.sendValue,
      },
    };
    this.props.history.push(path);
  };

  newEmployeeStatusChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value,
    });
    let employeeNo = this.state.employeeNo;
    if (employeeNo != null) {
      switch (event.target.value) {
        case "":
          this.setState({ newEmployeeNo: "" });
          break;
        case "0": //社員
          if (
            employeeNo.substring(0, 2) !== "SP" &&
            employeeNo.substring(0, 2) !== "SC"
          ) {
            this.setState({ newEmployeeNo: "" });
          } else if (employeeNo.substring(0, 2) === "SP") {
            this.getNO(this.state.empNoHead);
          } else if (employeeNo.substring(0, 2) === "SC") {
            this.getNO(this.state.empNoHead);
          }
          break;
        case "2": //個人事業主
          if (
            employeeNo.substring(0, 2) !== "SP" &&
            employeeNo.substring(0, 2) !== "SC"
          ) {
            this.getNO("SP");
          } else if (employeeNo.substring(0, 2) === "SP") {
            this.setState({ newEmployeeNo: "" });
          } else if (employeeNo.substring(0, 2) === "SC") {
            this.getNO("SP");
          }
          break;
        case "3": //子会社社員
          if (
            employeeNo.substring(0, 2) !== "SP" &&
            employeeNo.substring(0, 2) !== "SC"
          ) {
            this.getNO("SC");
          } else if (employeeNo.substring(0, 2) === "SP") {
            this.getNO("SC");
          } else if (employeeNo.substring(0, 2) === "SC") {
            this.setState({ newEmployeeNo: "" });
          }
          break;
        default:
          break;
      }
    } else {
      this.setState({ newEmployeeNo: "" });
    }
  };

  /**
   * 採番番号
   */
  getNO = (NO) => {
    const promise = Promise.resolve(
      publicUtils.getNO("employeeNo", NO, "T001Employee", this.state.serverIP)
    );
    promise.then((value) => {
      this.setState({
        newEmployeeNo: value,
      });
    });
  };

  employeeFormChange = (event) => {
    this.setState(
      {
        [event.target.name]: event.target.value,
      },
      () => {
        if (this.state.employeeFormCode === "3") {
          this.setState(
            {
              socialInsuranceFlag: "0",
              welfarePensionAmount: "",
              healthInsuranceAmount: "",
              insuranceFeeAmount: "",
              bonusNo: "0",
              scheduleOfBonusAmount: "",
              fristBonusMonth: "",
              secondBonusMonth: "",
            },
            () => {
              this.totalKeisan();
            }
          );
        } else if (this.state.employeeFormCode === "2") {
          // 如果是個人事業主，清空厚生和健康字段，并设置 socialInsuranceFlag 为 "0"
          this.setState(
            {
              socialInsuranceFlag: "0",
              welfarePensionAmount: "",
              healthInsuranceAmount: "",
              insuranceFeeAmount: "",
            },
            () => {
              this.totalKeisan();
            }
          );
        } else {
          if (this.state.bonus !== null) {
            this.setState(
              {
                fristBonusMonth: utils.converToLocalTime(
                  this.state.bonus.fristBonusMonth,
                  false
                ),
                secondBonusMonth: utils.converToLocalTime(
                  this.state.bonus.secondBonusMonth,
                  false
                ),
                bonusNo:
                  this.state.bonus.bonusNo === null
                    ? "0"
                    : this.state.bonus.bonusNo,
                scheduleOfBonusAmount: utils.addComma(
                  this.state.bonus.scheduleOfBonusAmount
                ),
              },
              () => {
                this.totalKeisan();
              }
            );
          }
        }
      }
    );
  };
  delete = () => {
    var a = window.confirm("削除してもよろしいでしょうか？");
    if (a) {
      var deleteMod = {};
      deleteMod["employeeNo"] = this.state.employeeName;
      deleteMod["reflectYearAndMonth"] = this.state.rowReflectYearAndMonth;
      axios
        .post(this.state.serverIP + "wagesInfo/delete", deleteMod)
        .then((result) => {
          if (
            result.data.errorsMessage === null ||
            result.data.errorsMessage === undefined
          ) {
            this.setState({
              myToastShow: true,
              type: "success",
              errorsMessageShow: false,
              message: "削除成功",
            });
            setTimeout(() => this.setState({ myToastShow: false }), 3000);
            var wagesInfoMod = {};
            wagesInfoMod["employeeNo"] = this.state.employeeName;
            this.resetValue();
            this.search(wagesInfoMod);
            this.setState({
              actionType: "insert",
              torokuText: "登録",
              expensesInfoModels: [],
              deleteFlag: true,
            });
          } else {
            this.setState({
              errorsMessageShow: true,
              errorsMessageValue: result.data.errorsMessage,
            });
            setTimeout(() => this.setState({ errorsMessageShow: false }), 3000);
          }
        })
        .catch((error) => {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue:
              "エラーが発生してしまいました、画面をリフレッシュしてください",
          });
        });
    }
  };
  shuseiTo = (actionType) => {
    var path = {};
    switch (actionType) {
      case "employeeInfo":
        path = {
          pathname: "/subMenuManager/employeeUpdateNew",
          state: {
            id: this.state.employeeName,
            employeeNo: this.state.employeeName,
            backPage: "wagesInfo",
            sendValue: this.state.sendValue,
            searchFlag: true,
            actionType: "update",
            backbackPage: this.state.backPage,
          },
        };
        break;
      case "siteInfo":
        path = {
          pathname: "/subMenuManager/siteInfo",
          state: {
            employeeNo: this.state.employeeName,
            backPage: "wagesInfo",
            sendValue: this.state.sendValue,
            searchFlag: true,
            backbackPage: this.state.backPage,
          },
        };
        break;
      default:
    }
    this.props.history.push(path);
  };
  render() {
    const {
      employeeNo,
      period,
      employeeName,
      socialInsuranceFlag,
      salary,
      waitingCost,
      welfarePensionAmount,
      healthInsuranceAmount,
      insuranceFeeAmount,
      lastTimeBonusAmount,
      fristTimeBonusAmount,
      secondTimeBonusAmount,
      scheduleOfBonusAmount,
      bonusNo,
      bonus,
      totalAmount,
      employeeFormCode,
      newEmployeeStatus,
      remark,
      raiseStartDate,
      costInfoShow,
      message,
      type,
      errorsMessageValue,
      actionType,
      socialInsuranceFlagDrop,
      bonusFlagDrop,
      EmployeeFormCodeDrop,
      wagesInfoList,
      employeeNameDrop,
      torokuText,
      expensesInfoModels,
      kadouCheck,
      leaderCheck,
      relatedEmployees,
      backPage,
      hatsunyubaFlag,
      deleteFlag,
    } = this.state;
    //テーブルの列の選択
    const selectRow = {
      mode: "radio",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true, // click to select, default is false
      clickToExpand: true, // click to expand row, default is false
      onSelect: this.handleRowSelect,
      selected: [this.state.period]
    };
    //テーブルの列の選択(詳細)
    const selectRowDetail = {};
    //テーブルの定義
    const options = {
      noDataText: <i>データなし</i>,
      page: 1, // which page you want to show as default
      sizePerPage: 8, // which size per page you want to locate as default
      pageStartIndex: 1, // where to start counting the pages
      paginationSize: 3, // the pagination bar size.
      prePage: "<", // Previous page button text
      nextPage: ">", // Next page button text
      firstPage: "<<", // First page button text
      lastPage: ">>", // Last page button text
      expandRowBgColor: "rgb(165, 165, 165)",
      paginationShowsTotal: this.renderShowsTotal, // Accept bool or function
      hideSizePerPage: true, //> You can hide the dropdown for sizePerPage
      expandRowBgColor: "rgb(165, 165, 165)",
    };
    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={message}
            type={type}
          />
        </div>
        <div
          style={{ display: this.state.errorsMessageShow ? "block" : "none" }}
        >
          <ErrorsMessageToast
            errorsMessageShow={this.state.errorsMessageShow}
            message={errorsMessageValue}
            type={"danger"}
          />
        </div>
        <div id="Home">
          <Modal
            centered
            backdrop="static"
            onHide={this.handleHideModal}
            show={costInfoShow}
            dialogClassName="modal-expensesInfo"
          >
            <Modal.Header closeButton></Modal.Header>
            <Modal.Body>
              <ExpensesInfo
                kadouCheck={kadouCheck}
                leaderCheck={leaderCheck}
                relatedEmployees={relatedEmployees}
                expensesInfoModels={expensesInfoModels}
                employeeNo={employeeNo}
                period={period}
                expensesInfoModel={this.state.expensesInfoModel}
                expensesInfoToroku={this.getExpensesInfo}
                actionType={period === "" ? "detail" : "insert"}
              />
            </Modal.Body>
          </Modal>
          <Row inline="true">
            <Col className="text-center">
              <h2>給料情報</h2>
            </Col>
          </Row>
          <br />
          <Form id="wagesInfoForm">
            <Form.Group>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="inputGroup-sizing-sm">
                        社員区分
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      className="w100p"
                      as="select"
                      size="sm"
                      onChange={this.employeeStatusChange.bind(this)}
                      name="employeeStatus"
                      value={this.state.employeeStatus}
                      autoComplete="off"
                    >
                      {this.state.employeeStatuss.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup
                    size="sm"
                    className="mb-3 flexWrapNoWrap required-mark"
                  >
                    <InputGroup.Prepend>
                      <InputGroup.Text>社員名</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Autocomplete
                      className="w100p"
                      id="employeeName"
                      name="employeeName"
                      value={
                        this.state.employeeNameDrop.find(
                          (v) => v.code === this.state.employeeName
                        ) || {}
                      }
                      options={this.state.employeeNameDrop}
                      getOptionLabel={(option) => option.name || option.text || ""}
                      onChange={(event, values) =>
                        this.getWagesInfo(event, values)
                      }
                      renderOption={(option) => {
                        return (
                          <React.Fragment>{option.name || ""}</React.Fragment>
                        );
                      }}
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            placeholder="  例：佐藤真一"
                            type="text"
                            {...params.inputProps}
                            className="auto form-control Autocompletestyle-wagesInfo-employeeName w100p"
                          />
                        </div>
                      )}
                    />
                  </InputGroup>
                </Col>
                <Col sm={5}></Col>
                <Col sm={1}>
                  <Button
                    block
                    size="sm"
                    id="expensesInfoBtn"
                    // disabled={actionType === "detail" ? true : false}
                    onClick={this.handleShowModal}
                  >
                    諸費用
                  </Button>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>稼働区分</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control
                      className="w100p"
                      as="select"
                      size="sm"
                      onChange={this.valueChange}
                      name="workingCondition"
                      value={this.state.workingCondition}
                      disabled={actionType === "detail" ? true : false}
                      autoComplete="off"
                    >
                      {this.state.workingConditionStatus.map((data) => (
                        <option key={data.code} value={data.code}>
                          {data.name}
                        </option>
                      ))}
                    </Form.Control>
                  </InputGroup>
                </Col>
                <Col
                  sm={3}
                  hidden={this.state.workingCondition === "0" ? false : true}
                >
                  <InputGroup
                    size="sm"
                    className="mb-3 flexWrapNoWrap required-mark"
                  >
                    <InputGroup.Prepend>
                      <InputGroup.Text>給料</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="8"
                      value={salary}
                      name="salary"
                      onChange={this.valueChangeMoney}
                      /*readOnly={kadouCheck}*/
                      disabled={actionType === "detail" ? true : false}
                      placeholder="例：220000"
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ width: "2rem" }}>
                        円
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Col>
                <Col
                  sm={3}
                  hidden={this.state.workingCondition === "0" ? true : false}
                >
                  <InputGroup
                    size="sm"
                    className="mb-3 flexWrapNoWrap required-mark"
                  >
                    <InputGroup.Prepend>
                      <InputGroup.Text id="fiveKanji">
                        非稼動費用
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="8"
                      /*readOnly={!kadouCheck}*/
                      disabled={actionType === "detail" ? true : false}
                      name="waitingCost"
                      value={waitingCost}
                      onChange={this.valueChangeMoney}
                      placeholder="例：220000"
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ width: "2rem" }}>
                        円
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Col>
                {/* 社会保険下拉框已注释，改为手动录入方式 */}
                {/* <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>社会保険</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      disabled={
                        actionType === "detail"
                          ? true
                          : employeeFormCode === "3"
                          ? true
                          : false
                      }
                      name="socialInsuranceFlag"
                      id="socialInsuranceFlag"
                      onChange={this.valueChangeInsurance}
                      value={socialInsuranceFlag}
                    >
                      {socialInsuranceFlagDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col> */}
                <Col sm={3}>
                  <InputGroup size="sm" className={`mb-3 flexWrapNoWrap ${this.state.employeeStatus === "0" ? "required-mark" : ""}`}>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="niKanji">厚生</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="6"
                      readOnly={false}
                      onChange={this.valueChangeInsuranceMoney}
                      disabled={
                        actionType === "detail" 
                          ? true 
                          : this.state.employeeStatus === "2" 
                          ? true 
                          : false
                      }
                      name="welfarePensionAmount"
                      value={welfarePensionAmount}
                      type="text"
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text id="niKanji">健康</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="6"
                      readOnly={false}
                      disabled={
                        actionType === "detail" 
                          ? true 
                          : this.state.employeeStatus === "2" 
                          ? true 
                          : false
                      }
                      name="healthInsuranceAmount"
                      onChange={this.valueChangeInsuranceMoney}
                      value={healthInsuranceAmount}
                      type="text"
                    />
                    <InputGroup.Prepend hidden>
                      <InputGroup.Text id="niKanji">総額</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      readOnly
                      onChange={this.valueChangeMoney}
                      disabled={actionType === "detail" ? true : false}
                      name="insuranceFeeAmount"
                      value={insuranceFeeAmount}
                      hidden
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sixKanji">
                        次回昇給月
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={raiseStartDate}
                      onChange={this.raiseChange}
                      autoComplete="off"
                      locale="pt-BR"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      minDate={
                        new Date(
                          new Date().getFullYear(),
                          new Date().getMonth()
                        )
                      }
                      showDisabledMonthNavigation
                      className="form-control form-control-sm w100p"
                      id={
                        actionType === "detail"
                          ? "wagesInfoDatePicker-nextRaiseMonth-readOnly"
                          : "wagesInfoDatePicker-nextRaiseMonth"
                      }
                      dateFormat={"yyyy/MM"}
                      name="nextRaiseMonth"
                      locale="ja"
                      disabled={actionType === "detail" ? true : false}
                    />
                  </InputGroup>
                </Col>

                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sixKanji">
                        ボーナス回数
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      disabled={
                        actionType === "detail"
                          ? true
                          : employeeFormCode === "3"
                          ? true
                          : false
                      }
                      name="bonusNo"
                      id="bonusNo"
                      onChange={this.valueChangeBonus}
                      value={bonusNo}
                    >
                      {bonusFlagDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>支払月</InputGroup.Text>
                    </InputGroup.Prepend>
                    <InputGroup.Append>
                      <InputGroup.Prepend>
                        <DatePicker
                          selected={this.state.fristBonusMonth}
                          onChange={this.bonus1Change}
                          autoComplete="off"
                          locale="pt-BR"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          // minDate={new Date()}
                          showDisabledMonthNavigation
                          className="form-control form-control-sm w100p"
                          id={
                            actionType === "detail"
                              ? "wagesInfoDatePickerReadOnly"
                              : bonusNo === "0"
                              ? "wagesInfoDatePickerReadOnly"
                              : "wagesInfoDatePicker"
                          }
                          name="fristBonusMonth"
                          dateFormat={"yyyy/MM"}
                          locale="ja"
                          readOnly={bonusNo === "0" ? true : false}
                          disabled={actionType === "detail" ? true : false}
                        />
                      </InputGroup.Prepend>
                      <InputGroup.Prepend>
                        <DatePicker
                          selected={this.state.secondBonusMonth}
                          onChange={this.bonus2Change}
                          autoComplete="off"
                          locale="pt-BR"
                          showMonthYearPicker
                          showFullMonthYearPicker
                          // minDate={new Date()}
                          showDisabledMonthNavigation
                          className="form-control form-control-sm w100p"
                          id={
                            actionType === "detail"
                              ? "wagesInfoDatePickerReadOnly"
                              : bonusNo !== "2"
                              ? "wagesInfoDatePickerReadOnly"
                              : "wagesInfoDatePicker"
                          }
                          name="secondBonusMonth"
                          dateFormat={"yyyy/MM"}
                          locale="ja"
                          readOnly={bonusNo !== "2" ? true : false}
                          disabled={actionType === "detail" ? true : false}
                        />
                      </InputGroup.Prepend>
                    </InputGroup.Append>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    {/*<InputGroup.Prepend>
                                            <InputGroup.Text>前回額</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <FormControl
                                            onChange={this.valueChange}
                                            disabled={actionType === "detail" ? true : false}
                                            name="lastTimeBonusAmount"
                                            maxLength="7"
                                            readOnly
                                            placeholder="例：400000"
                                            value={lastTimeBonusAmount === "" ? this.state.lastTimeBonusAmountForInsert : lastTimeBonusAmount} />*/}
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sanKanji">一回目</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      readOnly={bonusNo === "0" ? true : false}
                      onChange={this.valueChangeMoney}
                      disabled={actionType === "detail" ? true : false}
                      name="fristTimeBonusAmount"
                      maxLength="8"
                      placeholder="例：400000"
                      value={fristTimeBonusAmount}
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text id="sanKanji">二回目</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      readOnly={bonusNo !== "2" ? true : false}
                      onChange={this.valueChangeMoney}
                      disabled={actionType === "detail" ? true : false}
                      name="secondTimeBonusAmount"
                      maxLength="8"
                      placeholder="例：400000"
                      value={secondTimeBonusAmount}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>総額</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      maxLength="7"
                      readOnly
                      onChange={this.valueChange}
                      disabled={actionType === "detail" ? true : false}
                      name="totalAmount"
                      value={totalAmount}
                    />
                    <InputGroup.Prepend>
                      <InputGroup.Text style={{ width: "2rem" }}>
                        円
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup
                    size="sm"
                    className="flexWrapNoWrap required-mark"
                  >
                    <InputGroup.Prepend>
                      <InputGroup.Text>開始年月</InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker
                      selected={this.state.reflectStartDate}
                      onChange={this.reflectStartDateChange}
                      dateFormat={"yyyy MM"}
                      autoComplete="off"
                      locale="pt-BR"
                      showMonthYearPicker
                      showFullMonthYearPicker
                      // minDate={new Date()}
                      showDisabledMonthNavigation
                      className="form-control form-control-sm w100p"
                      id={
                        actionType === "detail"
                          ? "wagesInfoDatePicker-reflectYearAndMonth-readOnly"
                          : "wagesInfoDatePicker-reflectYearAndMonth"
                      }
                      dateFormat={"yyyy/MM"}
                      name="reflectYearAndMonth"
                      locale="ja"
                      disabled={actionType === "detail" ? true : false}
                    />
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>社員形式</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      onChange={this.employeeFormChange}
                      disabled={
                        actionType === "detail" || socialInsuranceFlag === "1"
                          ? true
                          : false
                      }
                      name="employeeFormCode"
                      value={employeeFormCode}
                    >
                      {EmployeeFormCodeDrop.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col hidden>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>社員区分</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      as="select"
                      onChange={this.newEmployeeStatusChange}
                      disabled={actionType === "detail" ? true : false}
                      name="newEmployeeStatus"
                      value={newEmployeeStatus}
                    >
                      {this.state.employeeStatuss.map((date) => (
                        <option key={date.code} value={date.code}>
                          {date.name}
                        </option>
                      ))}
                    </FormControl>
                  </InputGroup>
                </Col>
                <Col sm={3}>
                  <InputGroup size="sm" className="mb-3 flexWrapNoWrap">
                    <InputGroup.Prepend>
                      <InputGroup.Text>備考</InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="remark"
                      onChange={this.valueChange}
                      disabled={actionType === "detail" ? true : false}
                      placeholder="例：XXXXX"
                      value={remark}
                    />
                  </InputGroup>
                </Col>
              </Row>
              <div style={{ textAlign: "center" }}>
                <Button
                  size="sm"
                  disabled={actionType === "detail" ? true : false}
                  variant="info"
                  onClick={this.toroku}
                >
                  <FontAwesomeIcon icon={faSave} />
                  {torokuText}
                </Button>{" "}
                <Button
                  size="sm"
                  disabled={actionType === "detail" ? true : false}
                  onClick={this.resetValue}
                  variant="info"
                  value="Reset"
                >
                  <FontAwesomeIcon icon={faUndo} />
                  リセット
                </Button>{" "}
                <Button
                  size="sm"
                  hidden={backPage === "" ? true : false}
                  variant="info"
                  onClick={this.back}
                >
                  <FontAwesomeIcon icon={faLevelUpAlt} />
                  戻る
                </Button>
              </div>
            </Form.Group>
          </Form>
          <Row>
            <Col sm={4}>
              <div style={{ float: "left" }}>
                <Button
                  size="sm"
                  onClick={this.shuseiTo.bind(this, "employeeInfo")}
                  disabled={this.state.employeeName === "" ? true : false}
                  variant="info"
                  id="employeeInfo"
                >
                  個人情報
                </Button>{" "}
                <Button
                  size="sm"
                  onClick={this.shuseiTo.bind(this, "siteInfo")}
                  disabled={this.state.employeeName === "" ? true : false}
                  variant="info"
                  id="siteInfo"
                >
                  現場情報
                </Button>{" "}
              </div>
            </Col>
            <Col sm={7}></Col>
            <Col sm={1}>
              <div style={{ float: "right" }}>
                <Button
                  variant="info"
                  size="sm"
                  id="delete"
                  onClick={this.delete}
                  disabled={deleteFlag}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  削除
                </Button>
              </div>
            </Col>
          </Row>
          <div>
            <Col sm={12}>
              <BootstrapTable
                selectRow={selectRow}
                pagination={true}
                options={options}
                data={wagesInfoList}
                headerStyle={{ background: "#5599FF" }}
                striped
                hover
                ref="wagesInfoTable"
                condensed
              >
                <TableHeaderColumn
                  isKey={true}
                  dataField="period"
                  tdStyle={{ padding: ".45em" }}
                  width="13%"
                >
                  給料期間
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="employeeFormName"
                  tdStyle={{ padding: ".45em" }}
                  width="10%"
                >
                  社員形式
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="salary"
                  tdStyle={{ padding: ".45em" }}
                  width="100"
                  width="10%"
                  dataFormat={this.addMarkSalary}
                >
                  給料
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="insuranceFeeAmount"
                  tdStyle={{ padding: ".45em" }}
                  width="10%"
                  dataFormat={this.addMarkInsuranceFeeAmount}
                >
                  社会保険
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="transportationExpenses"
                  tdStyle={{ padding: ".45em" }}
                  width="10%"
                  dataFormat={this.addMarkTransportationExpenses}
                >
                  交通代
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="leaderAllowanceAmount"
                  tdStyle={{ padding: ".45em" }}
                  dataFormat={this.addMarkLeaderAllowanceAmount}
                  hidden
                >
                  リーダー手当
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="introductionAllowance"
                  tdStyle={{ padding: ".45em" }}
                  dataFormat={this.addMarkintroductionAllowance}
                  hidden
                >
                  特別手当
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="otherAllowanceName"
                  tdStyle={{ padding: ".45em" }}
                  hidden
                >
                  他の手当
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="otherAllowanceAmount"
                  tdStyle={{ padding: ".45em" }}
                  width="10%"
                  dataFormat={this.addMarkOtherAllowanceAmount}
                >
                  手当合計
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="bonusSum"
                  tdStyle={{ padding: ".45em" }}
                  width="10%"
                  dataFormat={this.addMarkScheduleOfBonusAmount}
                >
                  ボーナス
                </TableHeaderColumn>
                <TableHeaderColumn
                  dataField="remark"
                  tdStyle={{ padding: ".45em" }}
                  width="27%"
                >
                  備考
                </TableHeaderColumn>
              </BootstrapTable>
            </Col>
          </div>
        </div>
      </div>
    );
  }

  componentWillUnmount() {
    this._isMounted = false;
  }
}
export default WagesInfo;
