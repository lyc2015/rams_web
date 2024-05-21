import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as publicUtils from "./utils/publicUtils.js";
import axios from "axios";
import store from "./redux/store";
import FileViewer from "react-file-viewer";
import { notification } from "antd";

/**
 * メール確認
 *
 */
class mailConfirm extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.initState;
  }

  initState = {
    file: this.props.personalInfo.state.file,
    selectedEmployeeInfo: this.props.personalInfo.state.selectedEmployeeInfo,
    companyMailNames: [
      this.props.personalInfo.state.selectedMailCC.length >= 1
        ? this.props.personalInfo.state.selectedMailCC[0].companyMail
        : "",
      this.props.personalInfo.state.selectedMailCC.length >= 2
        ? this.props.personalInfo.state.selectedMailCC[1].companyMail
        : "",
    ].filter(function (s) {
      return s;
    }),
    mailTitle: this.props.personalInfo.state.mailTitle,
    employeeName: this.props.personalInfo.state.employeeName,
    nationalityName: this.props.personalInfo.state.nationalityName,
    genderStatus: this.props.personalInfo.state.genderStatus,
    employeeStatus: this.props.personalInfo.state.employeeStatus,
    age: this.props.personalInfo.state.age,
    nearestStation: this.props.personalInfo.state.nearestStation,
    stations: this.props.personalInfo.state.stations,
    japaneaseConversationLevel:
      this.props.personalInfo.state.japaneaseConversationLevel,
    japaneaseConversationLevels:
      this.props.personalInfo.state.japaneaseConversationLevels,
    englishConversationLevel:
      this.props.personalInfo.state.englishConversationLevel,
    englishConversationLevels:
      this.props.personalInfo.state.englishConversationLevels,
    yearsOfExperience: this.props.personalInfo.state.yearsOfExperience,
    siteRoleCode: this.props.personalInfo.state.siteRoleName,
    projectPhaseName: this.props.personalInfo.state.projectPhaseName,
    developLanguage: this.props.personalInfo.state.developLanguage,
    unitPrice: this.props.personalInfo.state.unitPrice,
    salesProgressCode: this.props.personalInfo.state.salesProgressCode,
    salesProgresss: this.props.personalInfo.state.salesProgresss,
    remark: this.props.personalInfo.state.remark,
    selectedCustomerName: this.props.personalInfo.state.selectedCustomerName,
    loginUserInfo: this.props.personalInfo.state.loginUserInfo,
    selectedmail: this.props.personalInfo.state.selectedmail,
    selectedPurchasingManagers:
      this.props.personalInfo.state.selectedPurchasingManagers,
    greetinTtext: this.props.personalInfo.state.greetinTtext,
    theMonthOfStartWork: this.props.personalInfo.state.theMonthOfStartWork,

    mailContent: this.props.personalInfo.state.mailContent,
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
  };
  componentDidMount() {}

  downloadResume = async () => {
    let {
      selectedEmployeeInfo: {
        resumeInfo1,
        resumeInfo2,
        resumeInfoName,
        newResumeName,
      },
    } = this.state;

    let currentResumeUrl = "";
    [resumeInfo1, resumeInfo2].forEach((value) => {
      if (!currentResumeUrl && value && value.includes(resumeInfoName)) {
        currentResumeUrl = value;
      }
    });

    let fileKey = "",
      downLoadPath = "";

    if (currentResumeUrl && currentResumeUrl.split("file/").length > 1) {
      fileKey = currentResumeUrl.split("file/")[1];
      downLoadPath = (
        currentResumeUrl.substring(0, currentResumeUrl.lastIndexOf("_") + 1) +
        currentResumeUrl.split("_")[1] +
        "." +
        currentResumeUrl.split(".")[currentResumeUrl.split(".").length - 1]
      ).replaceAll("/", "//");
    }

    // 选择的是本地文件
    if (!fileKey || !downLoadPath) {
      if (newResumeName === resumeInfoName) {
        this.showDownloadResume({
          fileBlobUrl: this.state.file,
          resumeInfoName,
        });
      } else {
        notification.error({
          message: "サーバーエラー",
          description: "ファイルが存在しません。",
          placement: "topLeft",
        });
      }
      return;
    }

    try {
      await axios.post(this.state.serverIP + "s3Controller/downloadFile", {
        fileKey,
        downLoadPath,
      });

      let path = downLoadPath.replaceAll("//", "/");
      let res = await axios.post(
        this.state.serverIP + "download",
        {
          name: path,
        },
        {
          responseType: "blob",
        }
      );
      let fileBlobUrl = window.URL.createObjectURL(res.data);
      this.showDownloadResume({ fileBlobUrl, resumeInfoName, fileKey });

      // this.setState({ fileBlobUrl }); // 预览
    } catch (error) {
      notification.error({
        message: "サーバーエラー",
        description: "ファイルが存在しません。",
        placement: "topLeft",
      });
    }
  };

  showDownloadResume({ fileBlobUrl, resumeInfoName, fileKey }) {
    var a = document.createElement("a");
    a.href = fileBlobUrl;
    a.download = fileKey
      ? resumeInfoName + "." + fileKey.split(".")[fileKey.split(".").length - 1]
      : resumeInfoName;
    a.click();
    a.remove();
  }

  render() {
    return (
      <div>
        <div>
          {this.state.fileBlobUrl ? (
            <FileViewer
              fileType="xlsx"
              filePath={this.state.fileBlobUrl}
              // errorComponent={CustomErrorComponent}
              // onError={this.onError}
            />
          ) : null}

          <Button
            style={{ marginBottom: "5px" }}
            size="sm"
            variant="info"
            name="clickButton"
            id="resumeInfo1"
            onClick={this.downloadResume.bind(this)}
            disabled={
              !this.state.selectedEmployeeInfo.resumeInfoName &&
              !this.state.selectedEmployeeInfo.newResumeName
            }
          >
            <FontAwesomeIcon icon={faDownload} />
            履歴書
          </Button>
          <textarea
            ref={(textarea) => (this.textArea = textarea)}
            disabled
            style={{
              height: "800px",
              width: "100%",
              resize: "none",
              border: "0",
            }}
            value={
              `To:` +
              this.state.selectedmail +
              (String(this.state.companyMailNames) === ""
                ? ""
                : `	CC:` + this.state.companyMailNames.join(";")) +
              `         
タイトル:` +
              this.state.mailTitle +
              `	添付ファイル名前:` +
              this.state.selectedEmployeeInfo.resumeInfoName +
              `

` +
              (this.state.selectedCustomerName
                .split("(")[0]
                .search("株式会社") === -1
                ? this.state.selectedCustomerName.split("(")[0] + `株式会社`
                : this.state.selectedCustomerName.split("(")[0]) +
              ` 
` +
              (this.state.selectedPurchasingManagers === ""
                ? "ご担当者"
                : this.state.selectedPurchasingManagers.split("　")[0]) +
              ` 様 
お世話になっております、LYC` +
              this.state.loginUserInfo[0].employeeFristName +
              `です。
` +
              this.state.greetinTtext /*`

【名　　前】：`+ this.state.employeeName + `　` + this.state.nationalityName + `　` + this.state.genderStatus + `
【所　　属】：`+ this.state.employeeStatus + (this.state.age === "" || this.state.age === null ?"":`
【年　　齢】：`)+ (this.state.age !== null && this.state.age !== ""? this.state.age : "") + (this.state.age === null || this.state.age === ""?"":`歳`) + (this.state.nearestStation !== "" && this.state.nearestStation !== null ?`
【最寄り駅】：`:"") + (this.state.nearestStation !== "" && this.state.nearestStation !== null ? this.state.stations.find((v) => (v.code === this.state.nearestStation)).name : '') + (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ?`
【日本　語】：`:"")+ (this.state.japaneaseConversationLevel !== "" && this.state.japaneaseConversationLevel !== null ? this.state.japaneaseConversationLevels.find((v) => (v.code === this.state.japaneaseConversationLevel)).name : '') + (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null ?`
【英　　語】：`:"")+ (this.state.englishConversationLevel !== "" && this.state.englishConversationLevel !== null ? this.state.englishConversationLevels.find((v) => (v.code === this.state.englishConversationLevel)).name : '') + (this.state.yearsOfExperience!==null&&this.state.yearsOfExperience!==""?`
【業務年数】：`:"")+ (this.state.yearsOfExperience!==null&&this.state.yearsOfExperience!==""?this.state.yearsOfExperience:"") + (this.state.yearsOfExperience === null || this.state.yearsOfExperience === ""?"":`年`) + (this.state.projectPhaseName === ""?"":`
【対応工程】：`)+ (this.state.projectPhaseName === ""?"":this.state.projectPhaseName+"から") + (this.state.developLanguage === null || this.state.developLanguage === ""?"":`
【得意言語】：`)+ (this.state.developLanguage === null ? "" : this.state.developLanguage) + (this.state.unitPrice === ""||this.state.unitPrice === null?"":`
【単　　価】：`)+ (this.state.unitPrice === ""||this.state.unitPrice === null?"":this.state.unitPrice) + (this.state.unitPrice === ""||this.state.unitPrice === null?"":`万円`) + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? `
【稼働開始】：`:"") + (this.state.theMonthOfStartWork !== "" && this.state.theMonthOfStartWork !== null ? this.state.theMonthOfStartWork:"") + (this.state.salesProgressCode !== "" && this.state.salesProgressCode !== null ?`
【営業状況】：`:"")+ (this.state.salesProgressCode !== "" ? this.state.salesProgresss.find((v) => (v.code === this.state.salesProgressCode)).name : '') + (this.state.remark === undefined || this.state.remark === null || this.state.remark === ""?"":`
【備　　考】：`)+ (this.state.remark === undefined || this.state.remark === null || this.state.remark === "" ? "" : this.state.remark)*/ +
              `

` +
              this.state.mailContent +
              `

以上、よろしくお願いいたします。
******************************************************************
LYC株式会社 ` +
              this.state.loginUserInfo[0].employeeFristName +
              ` ` +
              this.state.loginUserInfo[0].employeeLastName +
              `
〒:101-0032 東京都千代田区岩本町3-3-3サザンビル3F  
http://www.lyc.co.jp/   
TEL：03-6908-5796  携帯：` +
              this.state.loginUserInfo[0].phoneNo +
              `(優先）
Email：` +
              this.state.loginUserInfo[0].companyMail +
              ` 営業共通：eigyou@lyc.co.jp 
労働者派遣事業許可番号　派遣許可番号　派13-306371
ＩＳＭＳ：MSA-IS-385
*****************************************************************`
            }
          />
        </div>
      </div>
    );
  }
}

export default mailConfirm;
