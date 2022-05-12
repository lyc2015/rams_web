import React, { Component } from "react";
import {
  Row,
  Form,
  Col,
  InputGroup,
  Button,
  FormControl,
} from "react-bootstrap";
import axios from "axios";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faListOl } from "@fortawesome/free-solid-svg-icons";
import store from "./redux/store";
axios.defaults.withCredentials = true;
/**
 *営業送信画面社員追加
 */
class sendRepotAppend3 extends Component {
  initialState = {
    serverIP: store.getState().dropDown[store.getState().dropDown.length - 1],
    currentPage: 1, //　該当page番号
    allSalesPersons: [],
    selectetRowIds:
      this.props.customer.salesPersonsAppend !== "" &&
      this.props.customer.salesPersonsAppend !== null
        ? this.props.customer.salesPersonsAppend.split(",")
        : [],
    selectetRowMails: [],
    allSelectedFlag: false,
    allSalesPersonsName: [],
    allMailsName: [],
    parentSelectedInfo: this.props.customer,
    appendPersonMsg: {
      purchasingManagers2: "",
      positionCode2: "",
      purchasingManagersMail2: "",
    },
  };
  constructor(props) {
    super(props);
    this.state = this.initialState; //初期化
  }
  componentDidMount() {
    this.getSalesPersons(this.props.customer.customerNo);
    this.refs.salesPersonTable.setState({
      selectedRowKeys:
        this.props.customer.salesPersonsAppend !== "" &&
        this.props.customer.salesPersonsAppend !== null
          ? this.props.customer.salesPersonsAppend.split(",")
          : [],
    });
    this.refs.salesPersonTable.store.selected =
      this.props.customer.salesPersonsAppend !== "" &&
      this.props.customer.salesPersonsAppend !== null
        ? this.props.customer.salesPersonsAppend.split(",")
        : [];
  }
  getSalesPersons = (customerNo) => {
    axios
      .post(this.state.serverIP + "sendRepot/getSalesPersons", {
        customerNo: customerNo,
      })
      .then((result) => {
        let salesPersonsNameArray = new Array();
        let mailsNameArray = new Array();
        for (let i in result.data) {
          salesPersonsNameArray.push(result.data[i].responsiblePerson);
          mailsNameArray.push(result.data[i].customerDepartmentMail);
        }
        this.setState({
          allSalesPersons: result.data,
          allSalesPersonsName: salesPersonsNameArray,
          allMailsName: mailsNameArray,
        });
      })
      .catch(function (err) {
        alert(err);
      });
  };
  // 行番号
  indexN = (cell, row, enumObject, index) => {
    let rowNumber = (this.state.currentPage - 1) * 10 + (index + 1);
    return <div>{rowNumber}</div>;
  };

  // customerDepartmentNameFormat
  customerDepartmentNameFormat = (cell) => {
    let customerDepartmentNameDropTem = this.props.depart;
    for (var i in customerDepartmentNameDropTem) {
      if (cell === customerDepartmentNameDropTem[i].code) {
        return customerDepartmentNameDropTem[i].name;
      }
    }
  };

  // customerDepartmentNameFormat
  positionNameFormat = (cell) => {
    let positionsTem = this.props.positions;
    for (var i in positionsTem) {
      if (cell === positionsTem[i].code) {
        return positionsTem[i].name;
      }
    }
  };

  handleRowSelect = (row, isSelected, e) => {
    if (this.state.allSelectedFlag) {
      this.refs.salesPersonTable.setState({
        selectedRowKeys: [],
      });
      this.setState({
        allSelectedFlag: !this.state.allSelectedFlag,
        selectetRowIds: [],
        selectetRowMails: [],
      });
    }
    if (isSelected) {
      this.setState({
        selectetRowIds: this.state.selectetRowIds.concat([
          row.responsiblePerson,
        ]),
        selectetRowMails: this.state.selectetRowMails.concat([
          row.customerDepartmentMail,
        ]),
        appendPersonMsg: {
          purchasingManagers2: row.responsiblePerson,
          positionCode2: row.positionCode,
          purchasingManagersMail2: row.customerDepartmentMail,
        },
      });
    } else {
      let index = this.state.selectetRowIds.findIndex(
        (item) => item === row.responsiblePerson
      );
      let index2 = this.state.selectetRowMails.findIndex(
        (item) => item === row.customerDepartmentMail
      );
      this.state.selectetRowIds.splice(index, 1);
      this.state.selectetRowMails.splice(index2, 1);
      this.setState({
        selectetRowIds: this.state.selectetRowIds,
        selectetRowMails: this.state.selectetRowMails,
      });
    }
  };

  // 全て選択ボタン事件
  selectAllLists = () => {
    this.refs.salesPersonTable.store.selected = [];
    if (!this.state.allSelectedFlag) {
      this.refs.salesPersonTable.setState({
        selectedRowKeys: this.state.allSalesPersonsName,
        selectetRowMails: this.state.allMailsName,
      });
      this.setState({
        allSelectedFlag: !this.state.allSelectedFlag,
        selectetRowIds: this.state.allSalesPersonsName,
        selectetRowMails: this.state.allMailsName,
      });
    } else {
      this.refs.salesPersonTable.setState({
        selectedRowKeys: [],
      });
      this.setState({
        allSelectedFlag: !this.state.allSelectedFlag,
        selectetRowIds: [],
        selectetRowMails: [],
      });
    }
  };

  salesSelected = () => {
    let salesPersons = this.state.selectetRowIds.join(",");
    let mails = this.state.selectetRowMails.join(",");
    this.state.parentSelectedInfo.salesPersonsAppend = salesPersons;
    this.props.allState.saveSalesPersons(
      this.state.parentSelectedInfo,
      this.state.appendPersonMsg
    );
    const model = {
      subChargeMailList: mails,
      //storageListName: storageListName,
    };
    axios
      .post(this.state.serverIP + "sendRepot/salesPersonsListsUpdate", model)
      .then((result) => {})
      .catch(function (err) {
        alert(err);
      });
  };
  render() {
    const selectRow = {
      mode: "checkbox",
      bgColor: "pink",
      hideSelectColumn: true,
      clickToSelect: true,
      clickToExpand: true,
      onSelect: this.handleRowSelect,
    };

    const options = {
      onPageChange: (page) => {
        this.setState({ currentPage: page });
      },
      page: this.state.currentPage,
      defaultSortOrder: "dsc",
      sizePerPage: 5,
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
        <Row inline="true">
          <Col className="text-center">
            <h2>社員選択</h2>
          </Col>
        </Row>
        <Form>
          <Row>
            <Col sm={4}>
              <InputGroup size="sm" className="mb-3">
                <InputGroup.Prepend>
                  <InputGroup.Text id="inputGroup-sizing-sm">
                    会社名
                  </InputGroup.Text>
                </InputGroup.Prepend>
                <FormControl
                  defaultValue={this.props.customer.customerName}
                  disabled
                  size="sm"
                />
              </InputGroup>
            </Col>
          </Row>
          <Row>
            <Col sm={4}>
              <Button
                size="sm"
                variant="info"
                name="clickButton"
                onClick={this.selectAllLists}
                disabled={
                  0 !== this.state.allSalesPersons.length ? false : true
                }
              >
                <FontAwesomeIcon icon={faListOl} />
                すべて選択
              </Button>
            </Col>
          </Row>
        </Form>
        <div>
          <BootstrapTable
            ref="salesPersonTable"
            data={this.state.allSalesPersons}
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
              width="7%"
              dataField="any"
              dataFormat={this.indexN}
              dataAlign="center"
              autoValue
              dataSort={true}
              editable={false}
            >
              番号
            </TableHeaderColumn>
            <TableHeaderColumn
              width="11%"
              dataField="customerDepartmentCode"
              dataFormat={this.customerDepartmentNameFormat}
            >
              部門
            </TableHeaderColumn>
            <TableHeaderColumn
              width="9%"
              dataField="positionCode"
              dataFormat={this.positionNameFormat}
            >
              職位
            </TableHeaderColumn>
            <TableHeaderColumn width="9%" dataField="responsiblePerson" isKey>
              名前
            </TableHeaderColumn>
            <TableHeaderColumn width="20%" dataField="customerDepartmentMail">
              メール
            </TableHeaderColumn>
          </BootstrapTable>
        </div>
        <div>
          <div style={{ textAlign: "center" }}>
            <Button size="sm" variant="info" onClick={this.salesSelected}>
              <FontAwesomeIcon icon={faSave} /> {"確定"}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
export default sendRepotAppend3;
