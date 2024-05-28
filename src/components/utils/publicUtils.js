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
