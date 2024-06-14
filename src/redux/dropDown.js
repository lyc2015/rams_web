import defaultState from "./state";
import request from "../service/request";

// dropdownのメソッド名
const methodNameList = [
  "getNationality",           // 国籍
  "getStation",               // 駅名
  "getEmployeeForm",          // 社員形式
  "getDepartment",            // 部署
  "getHomesAgentCode",        // 仲介区分
];

export async function fetchDropDown(state = defaultState) {
  try {
    let par = JSON.stringify(methodNameList);
    const response = await request.post('/initializationPage', par);
    
    const outArray = response.data.map(list => {
      const array = [{ code: "", name: "" }];
      for (const item of list) {
        array.push(item);
      }
      return array;
    });

    if (outArray.length > 0) {
      outArray.push(outArray[outArray.length - 1].slice(1)[0].name);
    }

    return outArray;
  } catch (error) {
    console.error('Error fetching dropdown data:', error);
    throw error;
  }
}
/**
 * reduxの更新
 *
 * @param {*}
 *            state reduxのstate
 * @param {*}
 *            dropName 更新の部分
 */
export async function updateDropDown(state = defaultState, dropName) {
  try {
    const methodList = [dropName];
    const par = JSON.stringify(methodList);
    const response = await request.post('/initializationPage', par);
    const resultList = response.data;

    const array = [{ code: "", name: "" }];
    for (const item of resultList[0]) {
      array.push(item);
    }

    let index = -1;
    for (let i = 0; i < methodNameList.length; i++) {
      if (dropName === methodNameList[i]) {
        index = i;
        break;
      }
    }

    if (index !== -1) {
      state.dropDown[index] = array;
    }

    return state;
  } catch (error) {
    console.error('Error updating dropdown data:', error);
    throw error;
  }
}