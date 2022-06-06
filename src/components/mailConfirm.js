import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "react-bootstrap";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import * as publicUtils from "./utils/publicUtils.js";
import axios from "axios";
import store from "./redux/store";
import { notification } from "antd";

/**
 * メール確認
 *
 */
class mailConfirm extends React.Component {
  state = {
    englishConversationLevels: store.getState().dropDown[44].slice(1),
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    salesProgresss: store.getState().dropDown[16].slice(1),
    japaneaseConversationLevels: store.getState().dropDown[43].slice(1),
    genders: store.getState().dropDown[0].slice(1),
    employees: store.getState().dropDown[4].slice(1),
    stations: store.getState().dropDown[14].slice(1),
  };
  componentDidMount() {
    console.log(this.props.data, "data");
  }

  handleDownloadResume = async ({ name, type, value }) => {
    let { serverIP } = this.state;
    switch (type) {
      case "file":
        this.showDownloadResume({
          fileBlobUrl: value,
          resumeInfoName: name,
        });
        break;
      case "url":
        let fileKey = "",
          downLoadPath = "";

        if (value && value.split("file/").length > 1) {
          fileKey = value.split("file/")[1];
          downLoadPath = (
            value.substring(0, value.lastIndexOf("_") + 1) +
            value.split("_")[1] +
            "." +
            value.split(".")[value.split(".").length - 1]
          ).replaceAll("/", "//");
        }

        try {
          await axios.post(serverIP + "s3Controller/downloadFile", {
            fileKey,
            downLoadPath,
          });

          let path = downLoadPath.replaceAll("//", "/");
          let res = await axios.post(
            serverIP + "download",
            {
              name: path,
            },
            {
              responseType: "blob",
            }
          );
          let fileBlobUrl = window.URL.createObjectURL(res.data);
          this.showDownloadResume({
            fileBlobUrl,
            resumeInfoName: name,
            fileKey,
          });
        } catch (error) {
          notification.error({
            message: "エラー",
            description: "ファイルが存在しません。",
            placement: "topLeft",
          });
        }
        break;

      default:
        break;
    }
  };

  // 浏览器下载附件
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
    const { emailModel, selectedmail, resumeResults } = this.props.data;
    // const companyMailNames = [
    //   selectedMailCC?.length >= 1 ? selectedMailCC[0].companyMail : "",
    //   selectedMailCC?.length >= 2 ? selectedMailCC[1].companyMail : "",
    // ].filter(function (s) {
    //   return s;
    // });

    let selectedMailCCText =
      emailModel?.selectedMailCC?.length > 0
        ? `送信先(CC)： ${emailModel?.selectedMailCC.join("、")}` +
          `
`
        : "";

    let title = emailModel?.mailTitle
      ? `タイトル：` +
        emailModel?.mailTitle +
        `
`
      : "";
    return (
      <>
        <textarea
          ref={(textarea) => (this.textArea = textarea)}
          disabled
          style={{
            width: "100%",
            minHeight: "80%",
            resize: "none",
            border: "none",
            flex: "1",
            marginBottom: "10px",
          }}
          value={
            title +
            selectedMailCCText +
            (title || selectedMailCCText
              ? `
`
              : "") +
            emailModel?.mailConfirmContont
          }
        />
        {/* 添付ファイル: */}
        <div>
          {resumeResults?.length > 0
            ? resumeResults.map((item, i) => {
                if (!item.value) return null;
                return (
                  <Button
                    key={i}
                    style={{ marginBottom: "5px", marginRight: "5px" }}
                    size="sm"
                    variant="info"
                    name="clickButton"
                    id="resumeInfo1"
                    onClick={() => this.handleDownloadResume(item)}
                  >
                    <FontAwesomeIcon icon={faDownload} />
                    {item.name}
                  </Button>
                );
              })
            : null}
        </div>
      </>
    );
  }
}

export default mailConfirm;
