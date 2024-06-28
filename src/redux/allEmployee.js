import defaultState from "./state";
const $ = require("jquery");


const serverIP = "http://127.0.0.1:8080/";

export function fetchGetAllEmployee(state = defaultState) {
  var outArray = [];
  $.ajax({
    type: "GET",
    url: serverIP + "employee/all",
    async: false,
    contentType: "application/json",
    success: function (resultList) {
      console.log("resultList", resultList);
      Array.prototype.push.apply(outArray, resultList);
    },
  });
  return outArray;
}
