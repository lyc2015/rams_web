import defaultState from "./state";
const $ = require("jquery");

const methodNameList = [
  "getNationality", // 国籍
//   "getServerIP", // 最後, 如果有新增的配置必须在getServerIP之前
];

const serverIP = "http://127.0.0.1:8080/";

export function fetchDropDown(state = defaultState) {
  var outArray = [];

  var par = JSON.stringify(methodNameList);
  $.ajax({
    type: "POST",
    url: serverIP + "initializationPage",
    data: par,
    async: false,
    contentType: "application/json",
    success: function (resultList) {
      for (let j = 0; j < resultList.length; j++) {
        var array = [{ code: "", name: "" }];
        var list = resultList[j];
        for (var i in list) {
          array.push(list[i]);
        }
        outArray.push(array);
      }
    },
  });
  outArray.push(outArray[outArray.length - 1]?.slice(1)[0].name);
  return outArray;
}
/**
 * reduxの更新
 *
 * @param {*}
 *            state reduxのstate
 * @param {*}
 *            dropName 更新の部分
 */
export function updateDropDown(state = defaultState, dropName) {
  var methodList = [dropName];
  //var serverIP = "http://54.201.204.105:8080/";

  var par = JSON.stringify(methodList);
  $.ajax({
    type: "POST",
    url: serverIP + "initializationPage",
    data: par,
    async: false,
    contentType: "application/json",
    success: function (resultList) {
      var array = [{ code: "", name: "" }];
      for (var i in resultList[0]) {
        array.push(resultList[0][i]);
      }
      var index = -1;
      for (var n in methodNameList) {
        if (dropName === methodNameList[n]) {
          index = n;
        }
      }
      state.dropDown[index] = array;
    },
  });
  return state;
}
