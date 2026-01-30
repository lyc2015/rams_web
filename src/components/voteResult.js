import React from "react";
import { Container, Row, Col, Table, Form, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbsUp, faThumbsDown, faTrash, faPlus, faEdit, faSave, faTimes } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import store from "../components/redux/store";
import MyToast from "./myToast";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker, { registerLocale } from "react-datepicker";
import ja from "date-fns/locale/ja";
import "../asserts/css/development.css";
import "../asserts/css/style.css";

registerLocale("ja", ja);

/**
 * 投票結果画面
 */
class VoteResult extends React.Component {
  constructor(props) {
    super(props);
    
    // 日付をフォーマット（日本の曜日を含む）（ヘルパー関数）
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
    
    // 100行の初期データを生成
    const generateInitialData = () => {
      
      const data = [];
      const baseDate = new Date(2025, 2, 26, 10, 3); // 2025年3月26日 10:03
      
      // 分散した分数の配列（すべて整数にならないように）（3, 7, 13, 17, 23, 28, 31, 37, 42, 47, 53, 58など）
      const minuteOffsets = [3, 7, 13, 17, 23, 28, 31, 37, 42, 47, 53, 58, 4, 11, 19, 26, 34, 41, 49, 56];
      
      for (let i = 0; i < 100; i++) {
        const date = new Date(baseDate);
        // 時間オフセットを計算（複数日にまたがる）
        const totalMinutes = i * 7 + minuteOffsets[i % minuteOffsets.length]; // 平均7分ごと、分散した分数を追加
        const hourOffset = Math.floor(totalMinutes / 60);
        const minuteOffset = totalMinutes % 60;
        
        date.setHours(date.getHours() + hourOffset);
        date.setMinutes(minuteOffset);
        
        // 当日の17:00を超える場合、翌日に移動
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
      participantCount: 0,       // 参加者数
      agreeCount: 0,             // 賛成票数
      disagreeCount: 0,          // 反対票数
      pageView: 80,              // ページビュー
      voterList: [],             // 投票者リスト（APIから取得）
      selectedYear: new Date().getFullYear(), // 選択された年（デフォルトは現在の年）
      voteContent: "",           // 投票内容（APIから取得）
      serverIP: store.getState().dropDown[store.getState().dropDown.length - 1], // サーバーIP
      isEditing: false,          // 編集モードかどうか
      editingContent: "",        // 編集中の内容
      editingYear: new Date().getFullYear(), // 編集中の年
      voteId: null,              // 投票データのID
      myToastShow: false,        // toast表示フラグ
      message: "",               // toastメッセージ
      type: "",                  // toastタイプ（success/error）
      showAddButton: false,      // 新規追加ボタンの表示フラグ
    };
  }

  // 日付をフォーマット（日本の曜日を含む）
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
    // 数字のみ入力可能
    const numValue = value === "" ? 0 : parseInt(value, 10);
    if (!isNaN(numValue) || value === "") {
      this.setState({
        [field]: value === "" ? "" : numValue,
      });
    }
  };

  handleVoterChange = (index, field, value) => {
    const updatedList = [...this.state.voterList];
    const voter = updatedList[index];
    
    if (field === "employeeNo") {
      // 社員番号を変更する場合、表示用と送信用の両方を更新
      updatedList[index] = {
        ...voter,
        employeeNo: this.formatEmployeeNo(value), // 表示用（LYCで始まる場合は***に）
        employeeNoOriginal: value // 送信用（元の値）
      };
    } else if (field === "voteDateObject") {
      // 時間をDatePickerで変更する場合
      const dateObj = value;
      const formattedDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')} ${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}:00`;
      updatedList[index] = {
        ...voter,
        voteDateObject: dateObj,
        voteDate: formattedDate,
        time: this.formatDateTimeWithWeekday(formattedDate)
      };
    } else {
      updatedList[index] = {
        ...voter,
        [field]: value
      };
    }
    
    this.setState({
      voterList: updatedList
    });
  };

  // 投票者情報の変更を処理（時間と賛成/反対フィールドの保存）
  handleVoterFieldSave = (index, field, value) => {
    const voter = this.state.voterList[index];
    if (!voter || !voter.employeeNo || !this.state.voteId) {
      console.error("必要な情報が不足しています");
      return;
    }

    // 時間フィールドの場合は検証を実行
    if (field === "time") {
      const validation = this.validateTimeString(value);
      if (!validation.valid) {
        // エラーメッセージを表示
        this.setState({
          myToastShow: true,
          message: validation.message,
          type: "error"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
        // 元の値に戻す
        const updatedList = [...this.state.voterList];
        const originalVoter = this.state.voterList[index];
        updatedList[index] = {
          ...updatedList[index],
          time: this.formatDateTimeWithWeekday(originalVoter.voteDate)
        };
        this.setState({
          voterList: updatedList
        });
        return;
      }
    }

    const serverIP = this.state.serverIP || "/api-backend/";
    const updateData = {
      employeeNo: voter.employeeNoOriginal || voter.employeeNo, // 元の社員番号を使用
      voteActivityId: this.state.voteId
    };

    // フィールドタイプに応じて異なるパラメータを設定
    if (field === "time") {
      // 時間フィールド：ユーザー入力の時間文字列を解析
      const parsedDate = this.parseTimeString(value);
      updateData.voteDate = parsedDate;
    } else if (field === "voteResults") {
      // 賛成/反対フィールド：boolean値をそのまま使用
      updateData.voteResults = value === true || value === "true" || value === "賛成";
    }

    axios
      .post(serverIP + "vote/updateVoteInfo", updateData)
      .then((response) => {
        console.log("投票者情報の更新に成功しました:", response.data);
        // 成功メッセージを表示
        this.setState({
          myToastShow: true,
          message: "更新成功",
          type: "success"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
        // 投票者リストを再取得
        this.getVotersInfo(this.state.voteId);
      })
      .catch((error) => {
        console.error("投票者情報の更新に失敗しました:", error);
        // エラーメッセージを表示
        this.setState({
          myToastShow: true,
          message: "更新に失敗しました",
          type: "error"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
        // 元の値に戻す
        const updatedList = [...this.state.voterList];
        const originalVoter = this.state.voterList[index];
        updatedList[index] = {
          ...updatedList[index],
          [field]: field === "time" 
            ? this.formatDateTimeWithWeekday(originalVoter.voteDate) 
            : field === "voteResults"
            ? originalVoter.voteResults
            : originalVoter[field]
        };
        this.setState({
          voterList: updatedList
        });
      });
  };

  handleDeleteVoter = (index) => {
    const updatedList = this.state.voterList.filter((_, i) => i !== index);
    // 番号を再振り当て
    const renumberedList = updatedList.map((voter, i) => ({
      ...voter,
      id: i + 1
    }));
    this.setState({
      voterList: renumberedList
    });
  };

  handleAddVoter = () => {
    if (!this.state.voteId) {
      this.setState({
        myToastShow: true,
        message: "投票活動IDがありません",
        type: "error"
      });
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ myToastShow: false });
        }
      }, 3000);
      return;
    }

    // 既に新規追加の行があるかチェック
    const hasNewVoter = this.state.voterList.some(voter => voter.isNew === true);
    if (hasNewVoter) {
      this.setState({
        myToastShow: true,
        message: "既に新規追加の行があります。先に保存またはキャンセルしてください",
        type: "error"
      });
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ myToastShow: false });
        }
      }, 3000);
      return;
    }

    const currentList = this.state.voterList;
    const newId = currentList.length + 1;
    const now = new Date();
    const newTime = this.formatDateWithWeekday(now);
    const newVoteDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;
    
    // 新しい空白の投票者行を追加（未保存の状態）
    const newVoter = {
      id: newId,
      employeeNo: "", // 空白
      employeeNoOriginal: "", // 空白
      time: newTime,
      voteDate: newVoteDate,
      voteDateObject: now, // Dateオブジェクトを保存（DatePicker用）
      voteResults: null, // 未選択
      isNew: true // 新規追加のマーク
    };
    
    this.setState({
      voterList: [...currentList, newVoter]
    });
  };

  // 新規追加の投票者情報を保存（確認ボタンクリック時）
  handleSaveNewVoter = (index) => {
    const voter = this.state.voterList[index];
    if (!voter || !voter.isNew) {
      return; // 新規追加でない場合は何もしない
    }

    if (!voter.employeeNoOriginal || !voter.employeeNoOriginal.trim()) {
      this.setState({
        myToastShow: true,
        message: "社員番号を入力してください",
        type: "error"
      });
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ myToastShow: false });
        }
      }, 3000);
      return;
    }

    // 社員番号の重複チェック（現在の行を除く）
    const employeeNoToCheck = voter.employeeNoOriginal.trim();
    const isDuplicate = this.state.voterList.some((item, idx) => {
      if (idx === index) return false; // 現在の行は除外
      const existingEmployeeNo = item.employeeNoOriginal || item.employeeNo || "";
      return existingEmployeeNo.trim() === employeeNoToCheck;
    });

    if (isDuplicate) {
      this.setState({
        myToastShow: true,
        message: "社員番号が重複しています",
        type: "error"
      });
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ myToastShow: false });
        }
      }, 3000);
      return;
    }

    if (voter.voteResults === null || voter.voteResults === undefined) {
      this.setState({
        myToastShow: true,
        message: "賛成/反対を選択してください",
        type: "error"
      });
      setTimeout(() => {
        if (this._isMounted) {
          this.setState({ myToastShow: false });
        }
      }, 3000);
      return;
    }

    const serverIP = this.state.serverIP || "/api-backend/";
    // voteResultsを1（賛成）または0（反対）に変換
    const voteResultsValue = voter.voteResults === true || voter.voteResults === 1 ? 1 : 0;
    const addData = {
      employeeNo: voter.employeeNoOriginal,
      voteActivityId: this.state.voteId,
      voteResults: voteResultsValue,
      voteDate: voter.voteDate
    };

    axios
      .post(serverIP + "vote/addVoteInfo", addData)
      .then((response) => {
        console.log("投票者情報の追加に成功しました:", response.data);
        // 成功メッセージを表示
        this.setState({
          myToastShow: true,
          message: "追加成功",
          type: "success"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
        // 投票者リストと票数情報を再取得
        this.getVotersInfo(this.state.voteId);
        this.getTicketInfo(this.state.voteId);
      })
      .catch((error) => {
        console.error("投票者情報の追加に失敗しました:", error);
        // エラーメッセージを表示
        this.setState({
          myToastShow: true,
          message: "追加に失敗しました",
          type: "error"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
      });
  };

  // 新規追加をキャンセル
  handleCancelNewVoter = (index) => {
    const updatedList = this.state.voterList.filter((_, i) => i !== index);
    this.setState({
      voterList: updatedList
    });
  };

  handleYearChange = (event) => {
    const year = parseInt(event.target.value, 10);
    this.setState({
      selectedYear: year
    }, () => {
      // 年が変更されたらAPIを呼び出す
      this.getVoteInfo(year);
    });
  };

  // 投票情報を取得
  getVoteInfo = (year) => {
    const serverIP = this.state.serverIP || "/api-backend/";
    
    // まず関連データをクリア（新しい年を選択した時、古いデータを表示しないように）
    this.setState({
      participantCount: 0,
      agreeCount: 0,
      disagreeCount: 0,
      voterList: [],
      voteContent: "",
      voteId: null
    });
    
    axios
      .get(serverIP + "vote/getVoteInfo", {
        params: {
          year: year
        }
      })
      .then((response) => {
        if (response.data) {
          const voteId = response.data.id || null;
          this.setState({
            voteContent: response.data.voteContent || "",
            voteId: voteId
          });
          
          // idがある場合、他の2つのAPIを呼び出す（賛成票数と投票者一覧）
          if (voteId) {
            console.log("投票IDを取得しました:", voteId, "年:", year);
            console.log("getTicketInfoとgetVotersInfoを呼び出します");
            this.getTicketInfo(voteId);
            this.getVotersInfo(voteId);
          } else {
            // idがない場合、関連データは既にクリア済み
            console.log("投票IDがありません。年:", year);
          }
        } else {
          // データがない場合、関連データは既にクリア済み
          console.log("投票情報がありません。年:", year);
        }
      })
      .catch((error) => {
        console.error("投票情報の取得に失敗しました:", error);
        // エラー時も関連データは既にクリア済み
      });
  };

  // 票数情報を取得
  getTicketInfo = (voteActivityId) => {
    const serverIP = this.state.serverIP || "/api-backend/";
    // パラメータが数字型であることを確認
    const id = typeof voteActivityId === 'number' ? voteActivityId : parseInt(voteActivityId, 10);
    
    console.log("getTicketInfoを呼び出し、パラメータ:", id);
    console.log("完全なURL:", serverIP + "vote/getTicketInfo");
    
    axios
      .get(serverIP + "vote/getTicketInfo", {
        params: {
          voteActivityId: id
        }
      })
      .then((response) => {
        console.log("getTicketInfo レスポンス:", response.data);
        if (response.data) {
          const agreeCount = response.data.agreeCount || 0;
          const opponentCount = response.data.opponentCount || 0;
          const participantCount = agreeCount + opponentCount;
          
          this.setState({
            agreeCount: agreeCount,
            disagreeCount: opponentCount,
            participantCount: participantCount
          });
        }
      })
      .catch((error) => {
        console.error("票数情報の取得に失敗しました:");
        console.error("エラー詳細:", error);
        console.error("レスポンスステータス:", error.response?.status);
        console.error("レスポンスデータ:", error.response?.data);
        console.error("レスポンスヘッダー:", error.response?.headers);
        console.error("レスポンステキスト:", error.response?.data?.toString());
        console.error("リクエストURL:", error.config?.url);
        console.error("リクエストパラメータ:", error.config?.params);
        
        // エラーレスポンスからデータを抽出を試行（500エラーでもレスポンスボディにデータが含まれる場合がある）
        if (error.response && error.response.data) {
          try {
            // レスポンスデータが文字列の場合、解析を試行
            const responseData = typeof error.response.data === 'string' 
              ? JSON.parse(error.response.data) 
              : error.response.data;
            
            console.log("レスポンスデータの解析を試行:", responseData);
            
            // レスポンスデータに必要なデータがある場合、それを使用
            if (responseData.agreeCount !== undefined || responseData.opponentCount !== undefined) {
              const agreeCount = responseData.agreeCount || 0;
              const opponentCount = responseData.opponentCount || 0;
              const participantCount = agreeCount + opponentCount;
              
              this.setState({
                agreeCount: agreeCount,
                disagreeCount: opponentCount,
                participantCount: participantCount
              });
              console.log("エラーレスポンスからデータの抽出に成功");
              return;
            }
          } catch (parseError) {
            console.error("レスポンスデータの解析に失敗しました:", parseError);
          }
        }
      });
  };

  // 投票者リストを取得
  getVotersInfo = (voteActivityId) => {
    const serverIP = this.state.serverIP || "/api-backend/";
    // パラメータが数字型であることを確認
    const id = typeof voteActivityId === 'number' ? voteActivityId : parseInt(voteActivityId, 10);
    
    console.log("getVotersInfoを呼び出し、パラメータ:", id);
    console.log("完全なURL:", serverIP + "vote/listVotersInfo");
    
    axios
      .get(serverIP + "vote/listVotersInfo", {
        params: {
          voteActivityId: id
        }
      })
      .then((response) => {
        console.log("getVotersInfo レスポンス:", response.data);
        if (response.data && Array.isArray(response.data)) {
          const voterList = response.data.map((item, index) => {
            const voteDateObj = item.voteDate ? new Date(item.voteDate) : null;
            return {
              id: index + 1,
              employeeNo: this.formatEmployeeNo(item.employeeNo || ""), // 社員番号をフォーマット
              employeeNoOriginal: item.employeeNo || "", // 元の社員番号を保存（送信用）
              time: this.formatDateTimeWithWeekday(item.voteDate),
              voteDate: item.voteDate || "", // 元のvoteDateを保存（送信用）
              voteDateObject: voteDateObj, // Dateオブジェクトを保存（DatePicker用）
              voteResults: item.voteResults !== undefined && item.voteResults !== null 
                ? (item.voteResults === 1 || item.voteResults === true) 
                : null // 賛成/反対（1/true=賛成, 0/false=反対）
            };
          });
          
          this.setState({
            voterList: voterList
          });
        } else {
          this.setState({
            voterList: []
          });
        }
      })
      .catch((error) => {
        console.error("投票者リストの取得に失敗しました:");
        console.error("エラー詳細:", error);
        console.error("レスポンスステータス:", error.response?.status);
        console.error("レスポンスデータ:", error.response?.data);
        console.error("リクエストURL:", error.config?.url);
        console.error("リクエストパラメータ:", error.config?.params);
        this.setState({
          voterList: []
        });
      });
  };

  // 日時をフォーマット（日本の曜日を含む）
  formatDateTimeWithWeekday = (dateTimeString) => {
    if (!dateTimeString) return "";
    
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const date = new Date(dateTimeString);
    
    if (isNaN(date.getTime())) {
      return dateTimeString; // 解析できない場合、元の文字列を返す
    }
    
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const weekday = weekdays[date.getDay()];
    
    return `${year}年${month}月${day}日（${weekday}）${hours}:${minutes}`;
  };

  // 社員番号をフォーマット（LYCで始まる場合は後ろを***に置き換え）
  formatEmployeeNo = (employeeNo) => {
    if (!employeeNo) return "";
    if (employeeNo.startsWith("LYC")) {
      return "LYC***";
    }
    return employeeNo;
  };

  // 時間文字列が有効かどうかを検証
  validateTimeString = (timeString) => {
    if (!timeString || timeString.trim() === "") {
      return { valid: false, message: "時間を入力してください" };
    }

    // フォーマット済みの時間文字列を試行：2025年3月26日（水）10:03
    const match = timeString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日[（(]?[^）)]*[）)]?(\d{1,2}):(\d{1,2})/);
    if (match) {
      const year = parseInt(match[1], 10);
      const month = parseInt(match[2], 10);
      const day = parseInt(match[3], 10);
      const hours = parseInt(match[4], 10);
      const minutes = parseInt(match[5], 10);
      
      if (month < 1 || month > 12) {
        return { valid: false, message: "月の値が無効です（1-12の範囲で入力してください）" };
      }
      if (day < 1 || day > 31) {
        return { valid: false, message: "日の値が無効です（1-31の範囲で入力してください）" };
      }
      if (hours < 0 || hours > 23) {
        return { valid: false, message: "時の値が無効です（0-23の範囲で入力してください）" };
      }
      if (minutes < 0 || minutes > 59) {
        return { valid: false, message: "分の値が無効です（0-59の範囲で入力してください）" };
      }
      
      const date = new Date(year, month - 1, day, hours, minutes);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return { valid: false, message: "日付が無効です（存在しない日付です）" };
      }
      
      return { valid: true };
    }
    
    // 標準フォーマットを試行：2025-03-26 10:03
    const standardMatch = timeString.match(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})/);
    if (standardMatch) {
      const year = parseInt(standardMatch[1], 10);
      const month = parseInt(standardMatch[2], 10);
      const day = parseInt(standardMatch[3], 10);
      const hours = parseInt(standardMatch[4], 10);
      const minutes = parseInt(standardMatch[5], 10);
      
      if (month < 1 || month > 12) {
        return { valid: false, message: "月の値が無効です（1-12の範囲で入力してください）" };
      }
      if (day < 1 || day > 31) {
        return { valid: false, message: "日の値が無効です（1-31の範囲で入力してください）" };
      }
      if (hours < 0 || hours > 23) {
        return { valid: false, message: "時の値が無効です（0-23の範囲で入力してください）" };
      }
      if (minutes < 0 || minutes > 59) {
        return { valid: false, message: "分の値が無効です（0-59の範囲で入力してください）" };
      }
      
      const date = new Date(year, month - 1, day, hours, minutes);
      if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
        return { valid: false, message: "日付が無効です（存在しない日付です）" };
      }
      
      return { valid: true };
    }
    
    // Dateオブジェクトで直接解析を試行
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      return { valid: true };
    }
    
    return { valid: false, message: "時間の形式が正しくありません" };
  };

  // ユーザー入力の時間文字列を解析し、バックエンドに必要な形式に変換
  parseTimeString = (timeString) => {
    if (!timeString) return "";
    
    // フォーマット済みの時間文字列を試行：2025年3月26日（水）10:03
    const match = timeString.match(/(\d{4})年(\d{1,2})月(\d{1,2})日[（(]?[^）)]*[）)]?(\d{1,2}):(\d{1,2})/);
    if (match) {
      const year = match[1];
      const month = String(match[2]).padStart(2, '0');
      const day = String(match[3]).padStart(2, '0');
      const hours = String(match[4]).padStart(2, '0');
      const minutes = String(match[5]).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    }
    
    // 標準フォーマットを試行：2025-03-26 10:03
    const standardMatch = timeString.match(/(\d{4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})/);
    if (standardMatch) {
      const year = standardMatch[1];
      const month = String(standardMatch[2]).padStart(2, '0');
      const day = String(standardMatch[3]).padStart(2, '0');
      const hours = String(standardMatch[4]).padStart(2, '0');
      const minutes = String(standardMatch[5]).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    }
    
    // Dateオブジェクトで直接解析を試行
    const date = new Date(timeString);
    if (!isNaN(date.getTime())) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:00`;
    }
    
    // 解析できない場合は元の文字列を返す
    return timeString;
  };

  // 編集モードに入る
  handleEdit = () => {
    this.setState({
      isEditing: true,
      editingContent: this.state.voteContent || "",
      editingYear: this.state.selectedYear
    }, () => {
      // contentEditable要素が正しく初期化されることを確認
      if (this.editorRef) {
        this.editorRef.innerHTML = this.state.editingContent || "";
      }
    });
  };

  // 編集をキャンセル
  handleCancelEdit = () => {
    this.setState({
      isEditing: false,
      editingContent: "",
      editingYear: this.state.selectedYear
    });
  };

  // 編集を保存
  handleSaveEdit = () => {
    const serverIP = this.state.serverIP || "/api-backend/";
    // contentEditable要素から最新の内容を取得
    const currentContent = this.editorRef ? this.editorRef.innerHTML : this.state.editingContent;
    
    // 選択された年が現在のデータの年かどうかを判断
    // 現在のデータの年の場合、idを渡す（更新操作）
    // そうでない場合、idを空にする（新規作成操作）
    const isCurrentYear = this.state.editingYear === this.state.selectedYear;
    const saveId = isCurrentYear ? (this.state.voteId || "") : "";
    
    const saveData = {
      id: saveId,
      voteContent: currentContent,
      year: this.state.editingYear
    };

    axios
      .post(serverIP + "vote/saveOrUpdateVoteInfo", saveData)
      .then((response) => {
        // 保存成功後、表示内容を更新し編集モードを終了
        this.setState({
          isEditing: false,
          voteContent: currentContent,
          selectedYear: this.state.editingYear,
          voteId: response.data?.id || (isCurrentYear ? this.state.voteId : null),
          myToastShow: true,
          message: "編集成功",
          type: "success"
        });
        // 3秒後に自動的に非表示
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
        // データ同期のため、データを再取得
        this.getVoteInfo(this.state.editingYear);
      })
      .catch((error) => {
        console.error("投票情報の保存に失敗しました:", error);
        this.setState({
          myToastShow: true,
          message: "保存に失敗しました。再試行してください",
          type: "error"
        });
        setTimeout(() => {
          if (this._isMounted) {
            this.setState({ myToastShow: false });
          }
        }, 3000);
      });
  };

  // 編集モードでの年の変更
  handleEditingYearChange = (event) => {
    this.setState({
      editingYear: parseInt(event.target.value, 10)
    });
  };

  // リッチテキスト内容の変更
  handleContentChange = (event) => {
    this.setState({
      editingContent: event.target.innerHTML
    });
  };

  componentDidMount() {
    // コンポーネントマウント時にAPIを呼び出して現在の年のデータを取得
    this.getVoteInfo(this.state.selectedYear);
  }

  componentDidUpdate(prevProps, prevState) {
    // 編集モードに入る時、contentEditableの内容を初期化
    if (this.state.isEditing && !prevState.isEditing && this.editorRef) {
      this.editorRef.innerHTML = this.state.editingContent || "";
    }
  }

  // 年のオプションを生成（現在の年の前後10年）
  generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear - 10; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  };

  // 編集モードでの年のオプションを生成（現在の年+1年または現在のデータの年のみ選択可能）
  generateEditingYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const years = [currentYear + 1]; // 現在の年+1年
    // 現在のデータの年がリストにない場合、追加
    if (this.state.selectedYear && !years.includes(this.state.selectedYear)) {
      years.push(this.state.selectedYear);
    }
    // ソート
    return years.sort((a, b) => a - b);
  };

  render() {
    const yearOptions = this.generateYearOptions();
    
    return (
      <>
        <MyToast
          myToastShow={this.state.myToastShow}
          message={this.state.message}
          type={this.state.type}
        />
        <Container fluid>
        {/* 年份筛选框和编辑按钮 - 放在蓝色区域上方 */}
        <Row style={{ marginTop: "10px", marginBottom: "10px" }}>
          <Col>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
              {/* 编辑按钮 */}
              {!this.state.isEditing && (
                <Button
                  variant="info"
                  size="sm"
                  onClick={this.handleEdit}
                  style={{ marginRight: "15px" }}
                >
                  <FontAwesomeIcon icon={faEdit} style={{ marginRight: "5px" }} />
                  編集
                </Button>
              )}
              
              {/* 编辑模式下的保存和取消按钮 */}
              {this.state.isEditing && (
                <>
                  <Button
                    variant="success"
                    size="sm"
                    onClick={this.handleSaveEdit}
                    style={{ marginRight: "10px" }}
                  >
                    <FontAwesomeIcon icon={faSave} style={{ marginRight: "5px" }} />
                    保存
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={this.handleCancelEdit}
                    style={{ marginRight: "15px" }}
                  >
                    <FontAwesomeIcon icon={faTimes} style={{ marginRight: "5px" }} />
                    取消
                  </Button>
                </>
              )}

              <label style={{ marginRight: "10px", fontSize: "17px", fontWeight: "normal" }}>
                年：
              </label>
              <Form.Control
                as="select"
                value={this.state.isEditing ? this.state.editingYear : this.state.selectedYear}
                onChange={this.state.isEditing ? this.handleEditingYearChange : this.handleYearChange}
                disabled={this.state.isEditing ? false : false}
                style={{
                  width: "120px",
                  fontSize: "16px",
                  padding: "5px 10px",
                }}
              >
                {(this.state.isEditing ? this.generateEditingYearOptions() : yearOptions).map((year) => (
                  <option key={year} value={year}>
                    {year}年
                  </option>
                ))}
              </Form.Control>
            </div>
          </Col>
        </Row>

        {/* 蓝色标题区域 */}
        <Row style={{ marginBottom: "10px" }}>
          <Col>
            <div
              style={{
                backgroundColor: "#E6F3FF",
                padding: "20px 16px 2px",
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
          </Col>
        </Row>

        <Row>
          <Col>

            {/* 投票内容显示区域 - 在蓝色区域下面，参加者数上面 */}
            {this.state.isEditing ? (
              <div
                style={{
                  marginTop: "8px",
                  marginBottom: "8px",
                  padding: "20px",
                  backgroundColor: "#FFFFFF",
                  border: "2px solid #007bff",
                  borderRadius: "8px",
                }}
              >
                <div
                  ref={(el) => (this.editorRef = el)}
                  contentEditable
                  onInput={this.handleContentChange}
                  suppressContentEditableWarning={true}
                  style={{
                    minHeight: "300px",
                    lineHeight: "1.8",
                    fontSize: "16px",
                    color: "#333333",
                    padding: "10px",
                    border: "1px solid #CCCCCC",
                    borderRadius: "4px",
                    outline: "none",
                  }}
                />
              </div>
            ) : (
              this.state.voteContent && (
                <div
                  style={{
                    marginTop: "8px",
                    marginBottom: "8px",
                    padding: "20px",
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #CCCCCC",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      lineHeight: "1.8",
                      fontSize: "16px",
                      color: "#333333",
                      whiteSpace: "pre-wrap",
                    }}
                    dangerouslySetInnerHTML={{ __html: this.state.voteContent }}
                  />
                </div>
              )
            )}

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
                    readOnly
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "default",
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
                    readOnly
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "default",
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
                    readOnly
                    style={{
                      fontSize: "32px",
                      fontWeight: "bold",
                      marginBottom: "8px",
                      width: "100%",
                      textAlign: "center",
                      border: "none",
                      backgroundColor: "transparent",
                      outline: "none",
                      cursor: "default",
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
            <div 
              style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center", 
                marginTop: "10px",
                position: "relative"
              }}
              onMouseEnter={() => this.setState({ showAddButton: true })}
              onMouseLeave={() => this.setState({ showAddButton: false })}
            >
              <p style={{ fontSize: "25px" }}>投票者一覧</p>
              <button
                onClick={this.handleAddVoter}
                style={{
                  background: "#28a745",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "bold",
                  opacity: this.state.showAddButton ? 1 : 0,
                  transition: "opacity 0.3s ease",
                  pointerEvents: this.state.showAddButton ? "auto" : "none",
                }}
                title="新規追加"
              >
                <FontAwesomeIcon icon={faPlus} style={{ marginRight: "5px" }} />
                新規追加
              </button>
            </div>
            {/* 投票者リスト - 两列布局 */}
            <div style={{ marginTop: "40px", marginBottom: "30px" }}>
              <Table striped bordered hover style={{ tableLayout: "fixed", width: "100%" }}>
                <thead style={{ backgroundColor: "#5599FF", color: "#FFFFFF" }}>
                  <tr>
                    <th style={{ textAlign: "center", width: "8%" }}>順番</th>
                    <th style={{ textAlign: "center", width: "15%" }}>社員番号</th>
                    <th style={{ textAlign: "center", width: "22%" }}>時間</th>
                    <th style={{ textAlign: "center", width: "5%" }}>結果</th>
                    <th style={{ textAlign: "center", width: "8%" }}>順番</th>
                    <th style={{ textAlign: "center", width: "15%" }}>社員番号</th>
                    <th style={{ textAlign: "center", width: "22%" }}>時間</th>
                    <th style={{ textAlign: "center", width: "5%" }}>結果</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.voterList.map((voter, index) => {
                    // 2人の従業員ごとに1行
                    if (index % 2 === 0) {
                      const voter1 = this.state.voterList[index];
                      const voter2 = this.state.voterList[index + 1];
                      
                      return (
                        <tr key={index}>
                          {/* 最初の従業員情報 */}
                          <td style={{ textAlign: "center", width: "8%" }}>{voter1.id}</td>
                          <td style={{ textAlign: "center", padding: "5px", width: "15%" }}>
                            <input
                              type="text"
                              value={voter1.isNew ? (voter1.employeeNoOriginal || "") : (voter1.employeeNo || "")}
                              onChange={(e) => this.handleVoterChange(index, "employeeNo", e.target.value)}
                              style={{
                                width: "100%",
                                border: voter1.isNew ? "1px solid #CCCCCC" : "none",
                                background: voter1.isNew ? "#FFFFFF" : "transparent",
                                padding: "5px",
                                textAlign: "center",
                                fontSize: "14px",
                                boxSizing: "border-box",
                                outline: "none",
                                cursor: "text",
                                borderRadius: voter1.isNew ? "3px" : "0",
                              }}
                            />
                          </td>
                          <td style={{ textAlign: "center", padding: "5px", width: "22%" }}>
                            <div style={{ width: "100%" }}>
                              <DatePicker
                                selected={voter1.voteDateObject || null}
                                onChange={(date) => {
                                  if (date) {
                                    this.handleVoterChange(index, "voteDateObject", date);
                                    if (!voter1.isNew) {
                                      // 既存の行の場合、変更後すぐに保存
                                      const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
                                      this.handleVoterFieldSave(index, "time", formattedDate);
                                    }
                                  }
                                }}
                                showTimeSelect
                                timeIntervals={1}
                                dateFormat="yyyy年MM月d日（E）HH:mm"
                                locale="ja"
                                className="form-control form-control-sm"
                                style={{
                                  width: "100%",
                                  border: voter1.isNew ? "1px solid #CCCCCC" : "none",
                                  background: voter1.isNew ? "#FFFFFF" : "transparent",
                                  padding: "5px",
                                  textAlign: "center",
                                  fontSize: "13px",
                                  boxSizing: "border-box",
                                  outline: "none",
                                  cursor: "pointer",
                                  borderRadius: voter1.isNew ? "3px" : "0",
                                }}
                              />
                            </div>
                          </td>
                          <td style={{ textAlign: "center", padding: "5px", width: "5%" }}>
                            {voter1.isNew ? (
                              // 新規追加の行：選択可能なドロップダウン
                              <select
                                value={voter1.voteResults === true || voter1.voteResults === 1 ? "1" : voter1.voteResults === false || voter1.voteResults === 0 ? "0" : ""}
                                onChange={(e) => {
                                  const voteResults = e.target.value === "1";
                                  this.handleVoterChange(index, "voteResults", voteResults);
                                }}
                                style={{
                                  width: "100%",
                                  border: "1px solid #CCCCCC",
                                  background: "#FFFFFF",
                                  padding: "5px",
                                  textAlign: "center",
                                  fontSize: "13px",
                                  boxSizing: "border-box",
                                  outline: "none",
                                  cursor: "pointer",
                                  borderRadius: "3px",
                                }}
                              >
                                <option value="">選択してください</option>
                                <option value="1">賛成</option>
                                <option value="0">反対</option>
                              </select>
                            ) : (
                              // 既存の行：アイコンを表示
                              <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                {voter1.voteResults === true || voter1.voteResults === 1 ? (
                                  <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: "16px", color: "#2E7D32" }} />
                                ) : voter1.voteResults === false || voter1.voteResults === 0 ? (
                                  <FontAwesomeIcon icon={faThumbsDown} style={{ fontSize: "16px", color: "#2E7D32" }} />
                                ) : (
                                  <span>-</span>
                                )}
                              </div>
                            )}
                          </td>
                          {voter1.isNew && (
                            <td style={{ textAlign: "center", padding: "5px", width: "8%" }}>
                              <button
                                onClick={() => this.handleSaveNewVoter(index)}
                                style={{
                                  background: "#28a745",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                  marginRight: "5px",
                                }}
                                title="確認"
                              >
                                <FontAwesomeIcon icon={faSave} style={{ marginRight: "3px" }} />
                                確認
                              </button>
                              <button
                                onClick={() => this.handleCancelNewVoter(index)}
                                style={{
                                  background: "#dc3545",
                                  color: "white",
                                  border: "none",
                                  padding: "5px 10px",
                                  borderRadius: "3px",
                                  cursor: "pointer",
                                  fontSize: "12px",
                                }}
                                title="キャンセル"
                              >
                                <FontAwesomeIcon icon={faTimes} style={{ marginRight: "3px" }} />
                                取消
                              </button>
                            </td>
                          )}
                          {/* 2番目の従業員情報 */}
                          {voter2 ? (
                            <>
                              <td style={{ textAlign: "center", width: "8%" }}>{voter2.id}</td>
                              <td style={{ textAlign: "center", padding: "5px", width: "15%" }}>
                                <input
                                  type="text"
                                  value={voter2.isNew ? (voter2.employeeNoOriginal || "") : (voter2.employeeNo || "")}
                                  onChange={(e) => this.handleVoterChange(index + 1, "employeeNo", e.target.value)}
                                  style={{
                                    width: "100%",
                                    border: voter2.isNew ? "1px solid #CCCCCC" : "none",
                                    background: voter2.isNew ? "#FFFFFF" : "transparent",
                                    padding: "5px",
                                    textAlign: "center",
                                    fontSize: "14px",
                                    boxSizing: "border-box",
                                    outline: "none",
                                    cursor: "text",
                                    borderRadius: voter2.isNew ? "3px" : "0",
                                  }}
                                />
                              </td>
                              <td style={{ textAlign: "center", padding: "5px", width: "22%" }}>
                                <div style={{ width: "100%" }}>
                                  <DatePicker
                                    selected={voter2.voteDateObject || null}
                                    onChange={(date) => {
                                      if (date) {
                                        this.handleVoterChange(index + 1, "voteDateObject", date);
                                        if (!voter2.isNew) {
                                          // 既存の行の場合、変更後すぐに保存
                                          const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:00`;
                                          this.handleVoterFieldSave(index + 1, "time", formattedDate);
                                        }
                                      }
                                    }}
                                    showTimeSelect
                                    timeIntervals={1}
                                    dateFormat="yyyy年MM月d日（E）HH:mm"
                                    locale="ja"
                                    className="form-control form-control-sm"
                                    style={{
                                      width: "100%",
                                      border: voter2.isNew ? "1px solid #CCCCCC" : "none",
                                      background: voter2.isNew ? "#FFFFFF" : "transparent",
                                      padding: "5px",
                                      textAlign: "center",
                                      fontSize: "13px",
                                      boxSizing: "border-box",
                                      outline: "none",
                                      cursor: "pointer",
                                      borderRadius: voter2.isNew ? "3px" : "0",
                                    }}
                                  />
                                </div>
                              </td>
                              <td style={{ textAlign: "center", padding: "5px", width: "5%" }}>
                                {voter2.isNew ? (
                                  // 新規追加の行：選択可能なドロップダウン
                                  <select
                                    value={voter2.voteResults === true || voter2.voteResults === 1 ? "1" : voter2.voteResults === false || voter2.voteResults === 0 ? "0" : ""}
                                    onChange={(e) => {
                                      const voteResults = e.target.value === "1";
                                      this.handleVoterChange(index + 1, "voteResults", voteResults);
                                    }}
                                    style={{
                                      width: "100%",
                                      border: "1px solid #CCCCCC",
                                      background: "#FFFFFF",
                                      padding: "5px",
                                      textAlign: "center",
                                      fontSize: "13px",
                                      boxSizing: "border-box",
                                      outline: "none",
                                      cursor: "pointer",
                                      borderRadius: "3px",
                                    }}
                                  >
                                    <option value="">選択してください</option>
                                    <option value="1">賛成</option>
                                    <option value="0">反対</option>
                                  </select>
                                ) : (
                                  // 既存の行：アイコンを表示
                                  <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                    {voter2.voteResults === true || voter2.voteResults === 1 ? (
                                      <FontAwesomeIcon icon={faThumbsUp} style={{ fontSize: "16px", color: "#2E7D32" }} />
                                    ) : voter2.voteResults === false || voter2.voteResults === 0 ? (
                                      <FontAwesomeIcon icon={faThumbsDown} style={{ fontSize: "16px", color: "#2E7D32" }} />
                                    ) : (
                                      <span>-</span>
                                    )}
                                  </div>
                                )}
                              </td>
                              {voter2.isNew && (
                                <td style={{ textAlign: "center", padding: "5px", width: "8%" }}>
                                  <button
                                    onClick={() => this.handleSaveNewVoter(index + 1)}
                                    style={{
                                      background: "#28a745",
                                      color: "white",
                                      border: "none",
                                      padding: "5px 10px",
                                      borderRadius: "3px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                      marginRight: "5px",
                                    }}
                                    title="確認"
                                  >
                                    <FontAwesomeIcon icon={faSave} style={{ marginRight: "3px" }} />
                                    確認
                                  </button>
                                  <button
                                    onClick={() => this.handleCancelNewVoter(index + 1)}
                                    style={{
                                      background: "#dc3545",
                                      color: "white",
                                      border: "none",
                                      padding: "5px 10px",
                                      borderRadius: "3px",
                                      cursor: "pointer",
                                      fontSize: "12px",
                                    }}
                                    title="キャンセル"
                                  >
                                    <FontAwesomeIcon icon={faTimes} style={{ marginRight: "3px" }} />
                                    取消
                                  </button>
                                </td>
                              )}
                            </>
                          ) : (
                            <>
                              <td style={{ textAlign: "center", width: "8%" }}></td>
                              <td style={{ textAlign: "center", width: "15%" }}></td>
                              <td style={{ textAlign: "center", width: "22%" }}></td>
                              <td style={{ textAlign: "center", width: "5%" }}></td>
                              {voter1.isNew && (
                                <td style={{ textAlign: "center", width: "8%" }}></td>
                              )}
                            </>
                          )}
                        </tr>
                      );
                    }
                    return null;
                  })}
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
      </Container>
      </>
    );
  }
}

export default VoteResult;
