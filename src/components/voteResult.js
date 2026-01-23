import React from "react";
import { Container, Row, Col, Table } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";
import "../asserts/css/development.css";
import "../asserts/css/style.css";

/**
 * 投票結果画面
 */
class VoteResult extends React.Component {
  constructor(props) {
    super(props);
    
    // 格式化日期，包含日本星期（辅助函数）
    const formatDateWithWeekday = (date) => {
      const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const weekday = weekdays[date.getDay()];
      
      return `${year}年${month}月${day}日（${weekday}）${hours}:${minutes}`;
    };
    
    // 生成100行初始数据
    const generateInitialData = () => {
      
      const data = [];
      const baseDate = new Date(2025, 2, 26, 10, 3); // 2025年3月26日 10:03
      
      // 分散的分钟数数组，避免都是整数（3, 7, 13, 17, 23, 28, 31, 37, 42, 47, 53, 58等）
      const minuteOffsets = [3, 7, 13, 17, 23, 28, 31, 37, 42, 47, 53, 58, 4, 11, 19, 26, 34, 41, 49, 56];
      
      for (let i = 0; i < 100; i++) {
        const date = new Date(baseDate);
        // 计算小时偏移（跨越多天）
        const totalMinutes = i * 7 + minuteOffsets[i % minuteOffsets.length]; // 平均每7分钟一个，加上分散的分钟数
        const hourOffset = Math.floor(totalMinutes / 60);
        const minuteOffset = totalMinutes % 60;
        
        date.setHours(date.getHours() + hourOffset);
        date.setMinutes(minuteOffset);
        
        // 如果超过当天17:00，则移到下一天
        if (date.getHours() > 17 || (date.getHours() === 17 && date.getMinutes() > 0)) {
          date.setDate(date.getDate() + 1);
          date.setHours(10);
          date.setMinutes(minuteOffset);
        }
        
        data.push({
          id: i + 1,
          employeeNo: `LYC***`,
          time: formatDateWithWeekday(date)
        });
      }
      
      return data;
    };

    this.state = {
      participantCount: 52,      // 参加者数
      agreeCount: 40,            // 賛成票数
      disagreeCount: 12,         // 反対票数
      pageView: 80,              // ページビュー
      voterList: generateInitialData(), // 投票者リスト
    };
  }

  // 格式化日期，包含日本星期
  formatDateWithWeekday = (date) => {
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日（${weekday}）${hours}:${minutes}`;
  };

  handleNumberChange = (field, value) => {
    // 只允许输入数字
    const numValue = value === "" ? 0 : parseInt(value, 10);
    if (!isNaN(numValue) || value === "") {
      this.setState({
        [field]: value === "" ? "" : numValue,
      });
    }
  };

  handleVoterChange = (index, field, value) => {
    const updatedList = [...this.state.voterList];
    updatedList[index] = {
      ...updatedList[index],
      [field]: value
    };
    this.setState({
      voterList: updatedList
    });
  };

  handleDeleteVoter = (index) => {
    const updatedList = this.state.voterList.filter((_, i) => i !== index);
    // 重新编号
    const renumberedList = updatedList.map((voter, i) => ({
      ...voter,
      id: i + 1
    }));
    this.setState({
      voterList: renumberedList
    });
  };

  handleAddVoter = () => {
    const currentList = this.state.voterList;
    const newId = currentList.length + 1;
    const newEmployeeNo = `LYC***`;
    
    // 生成新的时间（当前时间）
    const now = new Date();
    const newTime = this.formatDateWithWeekday(now);
    
    const newVoter = {
      id: newId,
      employeeNo: newEmployeeNo,
      time: newTime
    };
    
    this.setState({
      voterList: [...currentList, newVoter]
    });
  };

  render() {
    return (
      <Container fluid>
        <Row>
          <Col>
            {/* 最上面居中显示 投票結果 */}
            <div
              style={{
                backgroundColor: "#E6F3FF",
                padding: "20px 16px 2px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <h1 style={{ fontSize: "36px", fontWeight: "bold" }}>投票結果</h1>
              </div>

              {/* 投票結果正下方居中显示一行正常字体 */}
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <p style={{ fontSize: "20px" }}>LYC_R7労働者代表選任</p>
              </div>
            </div>

            {/* 很大的空白区域 - 带背景图片 */}
            <div
              style={{
                minHeight: "400px",
                marginTop: "8px",
                marginBottom: "8px",
                padding: "40px",
                backgroundImage: "url('/src/asserts/images/img_96165.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                borderRadius: "8px",
              }}
            >
              <div style={{ lineHeight: "1.5", fontSize: "20px", color: "#333333" }}>
                <p style={{ marginBottom: "20px" }}>
                  労働者派遣法に基づく「労使協定」締結のため、<br />
                  「労働者の過半数を代表する者」を選任いたします。<br />
                  下記によりオンライン投票を実施しますので、必ずご参加ください。
                </p>
                <p style={{ marginBottom: "10px", marginTop: "30px" }}>
                  <strong>1. 投票期間</strong>
                </p>
                <p style={{ marginLeft: "20px", marginBottom: "20px" }}>
                  2025年3月26日（水）10:00 ～2025年3月28日（金）17:00
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <strong>2. 投票方法</strong>
                </p>
                <p style={{ marginLeft: "20px", marginBottom: "20px" }}>
                  ・不記名のオンライン投票です。
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <strong>3. 投票資格者</strong>
                </p>
                <p style={{ marginLeft: "20px", marginBottom: "20px" }}>
                  当社に雇用される全労働者
                </p>
                <p style={{ marginBottom: "10px" }}>
                  <strong>4. 立候補者</strong>
                </p>
                <p style={{ marginLeft: "20px", marginBottom: "10px" }}>
                  従業員　王　継星　様
                </p>
                <p style={{ marginTop: "20px", marginBottom: "0px" }}>
                  以上、ご協力をよろしくお願いいたします。
                </p>
              </div>
            </div>

            {/* 四等分区域，中间两个淡绿色，两边淡蓝色 */}
            <div
              style={{
                padding: "19px 13px",
                marginTop: "5px",
                marginBottom: "20px",
              }}
            >
              <Row>
                {/* 左侧：参加者数 - 淡蓝色 */}
                <Col
                  xs={3}
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid #CCCCCC",
                    backgroundColor: "#E6F3FF",
                    padding: "13px 6px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.participantCount}
                    onChange={(e) => this.handleNumberChange("participantCount", e.target.value)}
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "text",
                    }}
                  />
                  <div style={{ fontSize: "16px" }}>参加者数</div>
                </Col>

                {/* 左中：賛成票数 - 深绿色 */}
                <Col
                  xs={3}
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid #CCCCCC",
                    backgroundColor: "#2E7D32",
                    padding: "13px 6px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.agreeCount}
                    onChange={(e) => this.handleNumberChange("agreeCount", e.target.value)}
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "text",
                      color: "#FFFFFF",
                    }}
                  />
                  <div style={{ fontSize: "16px", color: "#FFFFFF" }}>
                    <FontAwesomeIcon
                      icon={faThumbsUp}
                      style={{ fontSize: "16px", marginRight: "5px" }}
                    />
                    賛成票数
                  </div>
                </Col>

                {/* 右中：反対票数 - 深绿色 */}
                <Col
                  xs={3}
                  style={{
                    textAlign: "center",
                    borderRight: "1px solid #CCCCCC",
                    backgroundColor: "#2E7D32",
                    padding: "13px 6px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.disagreeCount}
                    onChange={(e) => this.handleNumberChange("disagreeCount", e.target.value)}
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "text",
                      color: "#FFFFFF",
                    }}
                  />
                  <div style={{ fontSize: "16px", color: "#FFFFFF" }}>
                    反対票数
                    <FontAwesomeIcon
                      icon={faThumbsDown}
                      style={{ fontSize: "16px", marginLeft: "5px" }}
                    />
                  </div>
                </Col>

                {/* 右侧：ページビュー - 淡蓝色 */}
                <Col
                  xs={3}
                  style={{
                    textAlign: "center",
                    backgroundColor: "#E6F3FF",
                    padding: "13px 6px",
                  }}
                >
                  <input
                    type="text"
                    value={this.state.pageView}
                    onChange={(e) => this.handleNumberChange("pageView", e.target.value)}
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "text",
                    }}
                  />
                  <div style={{ fontSize: "16px" }}>ページビュー</div>
                </Col>
              </Row>
            </div>

            
            {/* 表格左上方显示 投票者一覧*/}
            <div style={{ textAlign: "left", marginTop: "10px" }}>
              <p style={{ fontSize: "25px" }}>投票者一覧</p>
            </div>
            {/* 投票者リスト - 两列布局 */}
            <div style={{ marginTop: "40px", marginBottom: "30px" }}>
              <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                <thead style={{ backgroundColor: "#5599FF", color: "#FFFFFF" }}>
                  <tr>
                    <th style={{ textAlign: "center", width: "8%" }}>順番</th>
                    <th style={{ textAlign: "center", width: "15%" }}>社員番号</th>
                    <th style={{ textAlign: "center", width: "22%" }}>時間</th>
                    <th style={{ textAlign: "center", width: "5%" }}>備考</th>
                    <th style={{ textAlign: "center", width: "8%" }}>順番</th>
                    <th style={{ textAlign: "center", width: "15%" }}>社員番号</th>
                    <th style={{ textAlign: "center", width: "22%" }}>時間</th>
                    <th style={{ textAlign: "center", width: "5%" }}>備考</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.voterList.map((voter, index) => {
                    // 每两个员工一行
                    if (index % 2 === 0) {
                      const voter1 = this.state.voterList[index];
                      const voter2 = this.state.voterList[index + 1];
                      
                      return (
                        <tr key={index}>
                          {/* 第一条员工信息 */}
                          <td style={{ textAlign: "center", width: "8%" }}>{voter1.id}</td>
                          <td style={{ textAlign: "center", padding: "5px", width: "15%" }}>
                            <input
                              type="text"
                              value={voter1.employeeNo}
                              onChange={(e) => this.handleVoterChange(index, "employeeNo", e.target.value)}
                              style={{
                                width: "100%",
                                border: "none",
                                background: "transparent",
                                padding: "5px",
                                textAlign: "center",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                cursor: "text",
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "center", padding: "5px", width: "22%" }}>
                            <input
                              type="text"
                              value={voter1.time}
                              onChange={(e) => this.handleVoterChange(index, "time", e.target.value)}
                              style={{
                                width: "100%",
                                border: "none",
                                background: "transparent",
                                padding: "5px",
                                textAlign: "center",
                                fontSize: "13px",
                                boxSizing: "border-box",
                                outline: "none",
                                cursor: "text",
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "center", padding: "5px", width: "5%" }}>
                            <button
                              onClick={() => this.handleDeleteVoter(index)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "#dc3545",
                                cursor: "pointer",
                                padding: "5px",
                                display: "none",
                              }}
                              title="削除"
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </td>
                          {/* 第二条员工信息 */}
                          {voter2 ? (
                            <>
                              <td style={{ textAlign: "center", width: "8%" }}>{voter2.id}</td>
                              <td style={{ textAlign: "center", padding: "5px", width: "15%" }}>
                                <input
                                  type="text"
                                  value={voter2.employeeNo}
                                  onChange={(e) => this.handleVoterChange(index + 1, "employeeNo", e.target.value)}
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    background: "transparent",
                                    padding: "5px",
                                    textAlign: "center",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                    cursor: "text",
                                  }}
                                />
                              </td>
                              <td style={{ textAlign: "center", padding: "5px", width: "22%" }}>
                                <input
                                  type="text"
                                  value={voter2.time}
                                  onChange={(e) => this.handleVoterChange(index + 1, "time", e.target.value)}
                                  style={{
                                    width: "100%",
                                    border: "none",
                                    background: "transparent",
                                    padding: "5px",
                                    textAlign: "center",
                                    fontSize: "13px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                    cursor: "text",
                                  }}
                                />
                              </td>
                              <td style={{ textAlign: "center", padding: "5px", width: "5%" }}>
                                <button
                                  onClick={() => this.handleDeleteVoter(index + 1)}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    color: "#dc3545",
                                    cursor: "pointer",
                                    padding: "5px",
                                    display: "none",
                                  }}
                                  title="削除"
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ textAlign: "center", width: "8%" }}></td>
                              <td style={{ textAlign: "center", width: "15%" }}></td>
                              <td style={{ textAlign: "center", width: "22%" }}></td>
                              <td style={{ textAlign: "center", width: "5%" }}></td>
                            </>
                          )}
                        </tr>
                      );
                    }
                    return null;
                  })}
                  {/* 添加新员工行 */}
                  <tr style={{ backgroundColor: "#f8f9fa" }}>
                    <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                      <button
                        onClick={this.handleAddVoter}
                        style={{
                          background: "#28a745",
                          color: "white",
                          border: "none",
                          padding: "10px 20px",
                          borderRadius: "5px",
                          cursor: "pointer",
                          fontSize: "16px",
                          fontWeight: "bold",
                        }}
                        title="新規追加"
                      >
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: "8px" }} />
                        新規追加
                      </button>
                    </td>
                    <td colSpan="5" style={{ textAlign: "center", padding: "15px" }}>
                      {/* 右侧空白，保持对称 */}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default VoteResult;
