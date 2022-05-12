import React, { Component } from "react";
import { Form, Button, ListGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import MyToast from "./myToast";
import store from "./redux/store";
axios.defaults.withCredentials = true;

class ProjectContent extends Component {
  constructor(props) {
    super(props);
    this.state = this.initState;
  }
  initState = {
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    projectNo: "",
    projectType: "",
    projectTypeName: "",
    projectName: "",
    admissionPeriod: "",
    projectPeriodName: "",
    keyWordOfLanagurue1: "",
    keyWordOfLanagurue2: "",
    keyWordOfLanagurue3: "",
    projectInfoDetail: "",
    japaneaseConversationLevel: "",
    japaneaseConversationName: "",
    unitPriceRangeLowest: "",
    unitPriceRangeHighest: "",
    projectPhaseStart: "",
    projectPhaseEnd: "",
    projectPhase: "",
    projectPhaseNameStart: "",
    projectPhaseNameEnd: "",
    payOffRangeLowest: "",
    payOffRangeHighest: "",
    workStartPeriod: "",
    requiredItem1: "",
    requiredItem2: "",
    noOfInterviewName: "",
    recruitmentNumbers: "",
    siteLocation: "",
    siteLocationName: "",
    remark: "",
    nationalityName: "",
    payOffRange: "",
    unitPriceRange: "",
    keyWordOfLanagurueName1: "",
    keyWordOfLanagurueName2: "",
    keyWordOfLanagurueName3: "",
  };
  giveValue = (projectInfo) => {
    this.setState({
      projectNo: projectInfo.projectNo,
      projectType: projectInfo.projectType,
      projectTypeName: projectInfo.projectTypeName,
      projectName: projectInfo.projectName,
      siteLocation: projectInfo.siteLocation,
      siteLocationName: projectInfo.siteLocationName,
      admissionPeriod: projectInfo.admissionPeriod,
      projectPeriodName: projectInfo.projectPeriodName,
      keyWordOfLanagurue1: projectInfo.keyWordOfLanagurue1,
      keyWordOfLanagurue2: projectInfo.keyWordOfLanagurue2,
      keyWordOfLanagurue3: projectInfo.keyWordOfLanagurue3,
      projectInfoDetail: projectInfo.projectInfoDetail,
      japaneaseConversationLevel: projectInfo.japaneaseConversationLevel,
      japaneaseConversationName: projectInfo.japaneaseConversationName,
      unitPriceRangeLowest: projectInfo.unitPriceRangeLowest,
      unitPriceRangeHighest: projectInfo.unitPriceRangeHighest,
      projectPhaseStart: projectInfo.projectPhaseStart,
      projectPhaseEnd: projectInfo.projectPhaseEnd,
      projectPhaseNameStart: projectInfo.projectPhaseNameStart,
      projectPhaseNameEnd: projectInfo.projectPhaseNameEnd,
      payOffRangeLowest: projectInfo.payOffRangeLowest,
      payOffRangeHighest: projectInfo.payOffRangeHighest,
      workStartPeriod: projectInfo.workStartPeriod,
      requiredItem1: projectInfo.requiredItem1,
      requiredItem2: projectInfo.requiredItem2,
      noOfInterviewName: projectInfo.noOfInterviewName,
      recruitmentNumbers: projectInfo.recruitmentNumbers,
      remark: projectInfo.remark,
      nationalityName: projectInfo.nationalityName,
      keyWordOfLanagurueName1: projectInfo.keyWordOfLanagurueName1,
      keyWordOfLanagurueName2: projectInfo.keyWordOfLanagurueName2,
      keyWordOfLanagurueName3: projectInfo.keyWordOfLanagurueName3,
    });
    if (
      projectInfo.payOffRangeLowest !== undefined &&
      projectInfo.payOffRangeLowest !== null &&
      projectInfo.payOffRangeHighest !== undefined &&
      projectInfo.payOffRangeHighest !== null
    ) {
      var payOffRange = "";
      if (
        projectInfo.payOffRangeLowest === "0" &&
        projectInfo.payOffRangeHighest === "0"
      ) {
        payOffRange = "固定";
      } else {
        payOffRange =
          (projectInfo.payOffRangeLowest === "0"
            ? "固定"
            : projectInfo.payOffRangeLowest) +
          "-" +
          (projectInfo.payOffRangeHighest === "0"
            ? "固定"
            : projectInfo.payOffRangeHighest);
      }
      if (payOffRange === "-") {
        payOffRange = "";
      }
      this.setState({
        payOffRange: payOffRange,
      });
    }
    if (
      (projectInfo.unitPriceRangeLowest !== undefined &&
        projectInfo.unitPriceRangeLowest !== null &&
        projectInfo.unitPriceRangeLowest !== "") ||
      (projectInfo.unitPriceRangeHighest !== undefined &&
        projectInfo.unitPriceRangeHighest !== null &&
        projectInfo.unitPriceRangeHighest !== "")
    ) {
      var unitPriceRange = "";
      unitPriceRange =
        projectInfo.unitPriceRangeLowest +
        "万円~" +
        projectInfo.unitPriceRangeHighest +
        "万円";
      this.setState({
        unitPriceRange: unitPriceRange,
      });
    }
    var projectPhase = "";
    if (
      projectInfo.projectPhaseStart !== undefined &&
      projectInfo.projectPhaseStart !== null &&
      projectInfo.projectPhaseStart !== ""
    ) {
      projectPhase = projectInfo.projectPhaseNameStart;
    }
    if (
      projectInfo.projectPhaseNameEnd !== undefined &&
      projectInfo.projectPhaseNameEnd !== null &&
      projectInfo.projectPhaseNameEnd !== ""
    ) {
      projectPhase =
        (projectPhase === "" ? "" : projectPhase + "~") +
        projectInfo.projectPhaseNameEnd;
    }
    this.setState({
      projectPhase: projectPhase,
    });
  };
  search = (projectNo) => {
    var projectInfoModel = {
      projectNo: projectNo,
      theSelectProjectperiodStatus: "0",
    };
    axios
      .post(this.state.serverIP + "projectInfoSearch/search", projectInfoModel)
      .then((result) => {
        if (
          result.data.errorsMessage === null ||
          result.data.errorsMessage === undefined
        ) {
          this.giveValue(result.data.projectInfoList[0]);
        } else {
          this.setState({
            errorsMessageShow: true,
            errorsMessageValue: result.data.errorsMessage,
          });
        }
      })
      .catch((error) => {
        alert("检索错误，请检查程序");
      });
  };
  componentDidMount() {
    this.setState(
      {
        projectNo: this.props.projectNo,
      },
      () => {
        this.search(this.state.projectNo);
      }
    );
  }
  render() {
    const {
      projectNo,
      projectType,
      projectTypeName,
      projectName,
      admissionPeriod,
      projectPeriodName,
      siteLocationName,
      siteLocation,
      requiredItem1,
      requiredItem2,
      keyWordOfLanagurue1,
      keyWordOfLanagurue2,
      keyWordOfLanagurue3,
      keyWordOfLanagurueName1,
      keyWordOfLanagurueName2,
      keyWordOfLanagurueName3,
      projectInfoDetail,
      japaneaseConversationLevel,
      japaneaseConversationName,
      unitPriceRangeLowest,
      unitPriceRangeHighest,
      projectPhaseStart,
      projectPhaseEnd,
      projectPhase,
      projectPhaseNameStart,
      projectPhaseNameEnd,
      payOffRangeLowest,
      payOffRangeHighest,
      workStartPeriod,
      noOfInterviewName,
      recruitmentNumbers,
      nationalityName,
      remark,
      payOffRange,
      unitPriceRange,
    } = this.state;
    return (
      <div>
        <div style={{ display: this.state.myToastShow ? "block" : "none" }}>
          <MyToast
            myToastShow={this.state.myToastShow}
            message={"更新成功！"}
            type={"danger"}
          />
        </div>
        {/*
         * <ListGroup>
         * <ListGroup.Item>■NO_種別：No.{projectNo}_{projectTypeName}
         * <br/>■案件名：{projectName} <br/>■業務内容：<br /> <FormControl
         * maxLength="500" cols="10" rows="8"
         * value={projectInfoDetail} as="textarea" disabled
         * className="projectContentDetail"> </FormControl></ListGroup.Item>
         * <ListGroup.Item>■スキル要件：
         * <br/>·{keyWordOfLanagurueName1}，{keyWordOfLanagurueName2}，{keyWordOfLanagurueName3}
         * <br/> ·{requiredItem1} <br/> ·{requiredItem2}</ListGroup.Item>
         * <ListGroup.Item>■月額単金：{unitPriceRange}
         * <br/>■清算範囲：{payOffRange} <br/>■募集人数：{recruitmentNumbers}
         * <br/>■稼動時期：{admissionPeriod}~{projectPeriodName}
         * <br/>■勤務地：{siteLocationName} <br/>■作業工程：{projectPhase}
         * <br/>■国籍：{nationalityName === null ? "" : nationalityName +
         * "、" + japaneaseConversationName}
         * <br/>■面談回数：{noOfInterviewName} <br/>■備考：{remark}</ListGroup.Item>
         * </ListGroup>
         */}
        <div>
          <textarea
            ref={(textarea) => (this.textArea = textarea)}
            disabled
            style={{
              height: "600px",
              width: "100%",
              resize: "none",
              border: "0",
            }}
            value={
              `■NO_種別：No.` +
              projectNo +
              `_` +
              (projectTypeName === null ? "" : projectTypeName) +
              `
■案件名：` +
              projectName +
              `
■業務内容：` +
              `
　` +
              projectInfoDetail.replace(/\n/g, "\n　") +
              `

■スキル要件：` +
              ((
                (keyWordOfLanagurueName1 === null
                  ? ""
                  : keyWordOfLanagurueName1 + `,`) +
                (keyWordOfLanagurueName2 === null
                  ? ""
                  : keyWordOfLanagurueName2 + `,`) +
                (keyWordOfLanagurueName3 === null
                  ? ""
                  : keyWordOfLanagurueName3 + `,`)
              ).substring(
                0,
                (
                  (keyWordOfLanagurueName1 === null
                    ? ""
                    : keyWordOfLanagurueName1 + `,`) +
                  (keyWordOfLanagurueName2 === null
                    ? ""
                    : keyWordOfLanagurueName2 + `,`) +
                  (keyWordOfLanagurueName3 === null
                    ? ""
                    : keyWordOfLanagurueName3 + `,`)
                ).lastIndexOf(",")
              ) === ""
                ? ``
                : `
　·` +
                  (
                    (keyWordOfLanagurueName1 === null
                      ? ""
                      : keyWordOfLanagurueName1 + `,`) +
                    (keyWordOfLanagurueName2 === null
                      ? ""
                      : keyWordOfLanagurueName2 + `,`) +
                    (keyWordOfLanagurueName3 === null
                      ? ""
                      : keyWordOfLanagurueName3 + `,`)
                  ).substring(
                    0,
                    (
                      (keyWordOfLanagurueName1 === null
                        ? ""
                        : keyWordOfLanagurueName1 + `,`) +
                      (keyWordOfLanagurueName2 === null
                        ? ""
                        : keyWordOfLanagurueName2 + `,`) +
                      (keyWordOfLanagurueName3 === null
                        ? ""
                        : keyWordOfLanagurueName3 + `,`)
                    ).lastIndexOf(",")
                  )) +
              (requiredItem1 === null || requiredItem1 === ""
                ? ``
                : `
　·` + requiredItem1) +
              (requiredItem2 === null || requiredItem2 === ""
                ? ``
                : `
　·` + requiredItem2) +
              `
` +
              (unitPriceRange === null || unitPriceRange === ""
                ? ``
                : `
■月額単金：` + unitPriceRange) +
              (payOffRange === null || payOffRange === ""
                ? ``
                : `
■清算範囲：` + payOffRange) +
              (recruitmentNumbers === null || recruitmentNumbers === ""
                ? ``
                : `
■募集人数：` + recruitmentNumbers) +
              ((admissionPeriod === null || admissionPeriod === "") &&
              (projectPeriodName === null || projectPeriodName === "")
                ? ``
                : `
■稼動時期：` +
                  admissionPeriod +
                  ` ~ ` +
                  projectPeriodName) +
              (siteLocationName === null || siteLocationName === ""
                ? ``
                : `
■勤務地：` + siteLocationName) +
              (projectPhase === null || projectPhase === ""
                ? ``
                : `
■作業工程：` + projectPhase) +
              (nationalityName !== null && nationalityName !== ""
                ? `
■国籍：` +
                  (nationalityName === null
                    ? ``
                    : nationalityName +
                      (japaneaseConversationName === null ||
                      japaneaseConversationName === ""
                        ? ""
                        : `、` + japaneaseConversationName))
                : ``) +
              (noOfInterviewName === null || noOfInterviewName === ""
                ? ``
                : `
■面談回数：` + noOfInterviewName) +
              (remark === null || remark === ""
                ? ``
                : `
■備考：` + remark)
            }
          />
        </div>
      </div>
    );
  }
}

export default ProjectContent;
