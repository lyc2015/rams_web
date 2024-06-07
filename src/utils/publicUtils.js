import axios from "axios";

// 郵便番号
export async function postcodeApi(value) {
  let result = "";
  if (value.length === 7) {
    try {
      const response = await fetch(`https://zipcloud.ibsnet.co.jp/api/search?zipcode=${value}`);
      const data = await response.json();
      if (data.status === 200 && data.results) {
        const { address1, address2, address3 } = data.results[0];
          result = address1 + address2 + address3;
      } else {
        alert('郵便番号が見つかりません');
      }
    } catch (error) {
      alert('エラーが発生しました。再試行してください');
    }
  }
  return result;
};

export async function katakanaApi(value) {
  const apiKey = '36767e486ea387713ac17cff9c07ee840ce0781e7320010bd6ff661724a49c7a';
  try {
    const response = await axios.post('https://labs.goo.ne.jp/api/hiragana', {
      app_id: apiKey,
      sentence: value,
      output_type: 'katakana'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data.converted;
  } catch (error) {
    console.error('Error converting to katakana:', error);
    return value;
  }
}

export function addDateZero(num) {
  return num < 10 ? "0" + num : num;
}
/**
 * 前到后时间格式
 *
 * @param {*}
 *            datetime 日本时间时间戳
 * @param {*}
 *            flag 判断是年月(false)还是年月日(true)
 * @return 年月或年月日（没有/）或空
 */
export function formateDate(datetime, flag) {
  if (datetime !== undefined && datetime !== null && datetime !== "") {
    // console.log(datetime instanceof Date, datetime, "formateDate");
    let d = datetime;
    if (!(d instanceof Date)) {
      d = new Date(datetime);
    }
    let formatdatetime;
    if (flag === true) {
      formatdatetime =
        d.getFullYear() +
        "" +
        addDateZero(d.getMonth() + 1) +
        "" +
        addDateZero(d.getDate());
    } else {
      formatdatetime = d.getFullYear() + "" + addDateZero(d.getMonth() + 1);
    }
    return formatdatetime;
  } else {
    return "";
  }
}

/**
 * 联想框label的value取得
 *
 * @param {*}
 *            name name的值
 * @param {*}
 *            list 后台传来的下拉框数组
 * @return name对应的code值
 */
export function labelGetValue(name, list) {
  for (var i in list) {
    if (name === list[i].name) {
      return list[i].code;
    }
  }
}

// Null to empty
// input Object
// output Object or ""
export function nullToEmpty(obj) {
  return isNull(obj) ? "" : obj;
}

/**
 * trim(str, pos)
 * 该方法可以去除空格，分别可以去除所有空格，两端空格，左边空格，右边空格，默认为去除两端空格
 * str <String> 字符串
 * pos <String> 去除那些位置的空格，可选为：both-默认值，去除两端空格，left-去除左边空格，right-去除右边空格，all-去除包括中间和两端的所有空格
 */
export function trim(str, pos = "both") {
  if (pos === "both") {
    return str.replace(/^\s+|\s+$/g, "");
  } else if (pos === "left") {
    return str.replace(/^\s*/, "");
  } else if (pos === "right") {
    return str.replace(/(\s*$)/g, "");
  } else if (pos === "all") {
    return str.replace(/\s+/g, "");
  } else {
    return str;
  }
}

// is Null?
// input Object
// output boolean
export function isNull(obj) {
  return obj === undefined || obj === null;
}