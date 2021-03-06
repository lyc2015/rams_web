import React, { Component } from "react";
import { Form, Button, ListGroup, FormControl } from "react-bootstrap";
import axios from "axios";
import MyToast from "./myToast";
import store from "./redux/store";
import { notification } from "antd";
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
        payOffRange = "??????";
      } else {
        payOffRange =
          (projectInfo.payOffRangeLowest === "0"
            ? "??????"
            : projectInfo.payOffRangeLowest) +
          "-" +
          (projectInfo.payOffRangeHighest === "0"
            ? "??????"
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
        "??????~" +
        projectInfo.unitPriceRangeHighest +
        "??????";
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
        notification.error({
          message: "?????????",
          description: "??????????????????????????????",
          placement: "topLeft",
        });
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
            message={"???????????????"}
            type={"danger"}
          />
        </div>
        {/*
         * <ListGroup>
         * <ListGroup.Item>???NO_?????????No.{projectNo}_{projectTypeName}
         * <br/>???????????????{projectName} <br/>??????????????????<br /> <FormControl
         * maxLength="500" cols="10" rows="8"
         * value={projectInfoDetail} as="textarea" disabled
         * className="projectContentDetail"> </FormControl></ListGroup.Item>
         * <ListGroup.Item>?????????????????????
         * <br/>??{keyWordOfLanagurueName1}???{keyWordOfLanagurueName2}???{keyWordOfLanagurueName3}
         * <br/> ??{requiredItem1} <br/> ??{requiredItem2}</ListGroup.Item>
         * <ListGroup.Item>??????????????????{unitPriceRange}
         * <br/>??????????????????{payOffRange} <br/>??????????????????{recruitmentNumbers}
         * <br/>??????????????????{admissionPeriod}~{projectPeriodName}
         * <br/>???????????????{siteLocationName} <br/>??????????????????{projectPhase}
         * <br/>????????????{nationalityName === null ? "" : nationalityName +
         * "???" + japaneaseConversationName}
         * <br/>??????????????????{noOfInterviewName} <br/>????????????{remark}</ListGroup.Item>
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
              `???NO_?????????No.` +
              projectNo +
              `_` +
              (projectTypeName === null ? "" : projectTypeName) +
              `
???????????????` +
              projectName +
              `
??????????????????` +
              `
???` +
              projectInfoDetail.replace(/\n/g, "\n???") +
              `

?????????????????????` +
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
?????` +
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
?????` + requiredItem1) +
              (requiredItem2 === null || requiredItem2 === ""
                ? ``
                : `
?????` + requiredItem2) +
              `
` +
              (unitPriceRange === null || unitPriceRange === ""
                ? ``
                : `
??????????????????` + unitPriceRange) +
              (payOffRange === null || payOffRange === ""
                ? ``
                : `
??????????????????` + payOffRange) +
              (recruitmentNumbers === null || recruitmentNumbers === ""
                ? ``
                : `
??????????????????` + recruitmentNumbers) +
              ((admissionPeriod === null || admissionPeriod === "") &&
              (projectPeriodName === null || projectPeriodName === "")
                ? ``
                : `
??????????????????` +
                  admissionPeriod +
                  ` ~ ` +
                  projectPeriodName) +
              (siteLocationName === null || siteLocationName === ""
                ? ``
                : `
???????????????` + siteLocationName) +
              (projectPhase === null || projectPhase === ""
                ? ``
                : `
??????????????????` + projectPhase) +
              (nationalityName !== null && nationalityName !== ""
                ? `
????????????` +
                  (nationalityName === null
                    ? ``
                    : nationalityName +
                      (japaneaseConversationName === null ||
                      japaneaseConversationName === ""
                        ? ""
                        : `???` + japaneaseConversationName))
                : ``) +
              (noOfInterviewName === null || noOfInterviewName === ""
                ? ``
                : `
??????????????????` + noOfInterviewName) +
              (remark === null || remark === ""
                ? ``
                : `
????????????` + remark)
            }
          />
        </div>
      </div>
    );
  }
}

export default ProjectContent;
