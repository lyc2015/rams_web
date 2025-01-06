

// 数据处理
const formatPayroll = (payrollList, pageSize) => {
    let preIndex = 0 // 存前一个涨薪节点的index

    let _list = payrollList.map((item, index) => {
        //目标，找出涨薪节点
        //根据涨薪节点计算出一段时间的平均工资
        const _unitPrice = `${(item.unitPrice / 10000).toFixed(2)}万円`//単価
        const _salary = !!item.isWaiting ? `${(parseFloat(item.salary) / 10000).toFixed(2)}万円(非)` : `${(parseInt(item.salary) / 10000).toFixed(2)}万円`//給料
        const rough = (item.unitPrice - parseFloat(item.salary) - item.bonusPayoff - item.socialInsurancePayoff).toFixed(2)  //粗利益見込
        let yearRough = 0  // 年間粗利
        let averageSalary = 0// 平均給料
        let averageBonusPayoff = 0// 平均赏与
        // let averageTraffic = 0// 平均交通费
        let averageSocialInsurancePayoff = 0 // 平均社会保险
        // let averageOther = 0 // 其他平均
        let averageValue = 0 // 平均支付费用
        let isSalaryIncrease = !!item.isSalaryIncrease  // 是否涨薪

        //取出当前项及之前的数据并倒序
        const reverseList = payrollList.slice(0, index + 1).reverse()

        //最后一位直接按照节点往前算平均值
        if (index == payrollList.length - 1) {
            console.log('index===', index, 'payrollList.length===', payrollList.length)
            //  list = preIndex  index 取均值
            isSalaryIncrease = false
            // 计算平均給料
            averageSalary = (getSum(payrollList.slice(preIndex, index + 1), 'salary', index + 1 - preIndex) / 10000).toFixed(2)
            // 计算平均赏与
            averageBonusPayoff = (getSum(payrollList.slice(preIndex, index + 1), 'bonusPayoff', index + 1 - preIndex) / 10000).toFixed(2)
            // 计算平均社会保险
            averageSocialInsurancePayoff = (
                getSum(payrollList.slice(preIndex, index + 1), 'socialInsurancePayoff', index + 1 - preIndex) / 10000
            ).toFixed(2)
            // 计算平均支付费用
            averageValue = (
                parseFloat(averageSalary) +
                parseFloat(averageBonusPayoff) +
                parseFloat(averageSocialInsurancePayoff)
            ).toFixed(2)
        } else {
            for (let i = 1; i < reverseList.length; i++) {
                if (!reverseList[i].isWaiting) {//非待机的情况下
                    if (!!parseInt(reverseList[i].salary) && parseInt(item.salary) > parseInt(reverseList[i].salary)) {//这个月的salary大于上一个非待机月的salary
                        // 设置涨薪标志
                        isSalaryIncrease = true
                        // 计算平均給料
                        averageSalary = (getSum(payrollList.slice(preIndex, index + 1), 'salary', index + 1 - preIndex) / 10000).toFixed(2)
                        // 计算平均赏与
                        averageBonusPayoff = (getSum(payrollList.slice(preIndex, index + 1), 'bonusPayoff', index + 1 - preIndex) / 10000).toFixed(2)
                        // 计算平均社会保险
                        averageSocialInsurancePayoff = (
                            getSum(payrollList.slice(preIndex, index + 1), 'socialInsurancePayoff', index + 1 - preIndex) / 10000
                        ).toFixed(2)
                        // 计算平均支付费用
                        averageValue = (
                            parseFloat(averageSalary) +
                            parseFloat(averageBonusPayoff) +
                            parseFloat(averageSocialInsurancePayoff)
                        ).toFixed(2)

                        preIndex = index + 1
                        break
                    } else {
                        isSalaryIncrease = false
                        break
                    }
                } else {
                    isSalaryIncrease = false
                }
            }
        }
        return {
            ...item,
            rowNo: index + 1,
            rough, //粗利益見込
            unitPrice: _unitPrice,
            salary: _salary,
            isSalaryIncrease,
            averageSalary,
            averageBonusPayoff,
            averageSocialInsurancePayoff,
            averageValue,
            rowSpan: 0,
            yearRough
        }
    })
    // 计算yearRough年間粗利
    _list.map((item, index) => {
        let preIndex = 0
        if (!!item.isSalaryIncrease) {
            item.yearRough = getSum(_list.slice(preIndex, index), 'rough')
        }
    })
    // 合并单元格处理数据
    rowSpanDataFormat(_list, pageSize)
    // 设置表格底色
    setColor(_list)
    console.log('_list-=======', _list)
    return _list
}

// 合计
const getSum = (list, key, index) => {
    let sum = 0
    for (let i = 0; i < list.length; i++) {
        sum = sum + parseInt(list[i][key])
    }
    if (index) {
        sum = sum / index.toFixed(2)
    } else {
        sum = sum.toFixed(2)
    }
    return sum;
}
// 合并单元格处理数据
const rowSpanDataFormat = (_list, pageSize) => {
    if (_list.length == 0) return
    //先处理数据，获得给第一条数据赋值统计的数据
    let resuleList = firstDataFormat(_list)
    //根据pageSize拆分数据 
    const first_list = [];
    for (let i = 0; i < resuleList.length; i += pageSize) {
        first_list.push(resuleList.slice(i, i + pageSize));
    }
    //再根据涨薪节点拆分数据 [1,1,1,1,2,2,2,2,3,3][3,3,4,4,4,4]
    let second_list = [];
    first_list.forEach(item => {
        second_list = second_list.concat(splitBySalaryIncrease(item));
    })
    //[1,1,1,1,2][2,2,2,3][3][3,3,4][4,4,4]
    //根据数据长度设定rowSpan
    second_list.forEach(item => {
        item[0].rowSpan = item.length
    })
    return second_list
}
//根据涨薪节点拆分数据
const splitBySalaryIncrease = (array) => {
    if (!Array.isArray(array)) {
        console.error("Input must be an array.");
        return [];
    }

    const result = [];
    let tempGroup = [];

    array.forEach((item) => {
        tempGroup.push(item); // 将当前元素添加到临时组
        if (item.isSalaryIncrease) {
            result.push(tempGroup); // 遇到 `isSalaryIncrease === true` 时将临时组存入结果
            tempGroup = []; // 重置临时组
        }
    });

    // 如果还有未分组的剩余元素，添加到结果
    if (tempGroup.length > 0) {
        result.push(tempGroup);
    }

    return result;
};
// 合并单元格后合并的内容展示的是第一条数据，对第一条数据做一下处理，让它得到涨薪节点的数据
const firstDataFormat = (_list) => {
    //[1,1,1,1,2
    //,2,2,2,3,
    //3,3,3,4,
    //4,4,4]
    let list = []
    let resuleList = []
    list = list.concat(splitBySalaryIncrease(_list))
    list.forEach(item => {
        item.forEach(it => {
            it.averageSalary = item[item.length - 1].averageSalary
            it.averageBonusPayoff = item[item.length - 1].averageBonusPayoff
            it.averageSocialInsurancePayoff = item[item.length - 1].averageSocialInsurancePayoff
            it.averageValue = item[item.length - 1].averageValue
            it.rowEndYearAndMonth = item[item.length - 1].yearAndMonth
            it.averageTraffic = item[0].averageTraffic
            it.averageOther = item[0].averageOther
        })
        resuleList = resuleList.concat(item)
    })
    return resuleList
}
//设置在同一个现场的月份数表格底色相同
const setColor = (list) => {
    const getRandomColorIndex = (exclude) => {
        const availableColors = COLORS.filter((_, index) => index !== exclude);
        return Math.floor(Math.random() * availableColors.length);
    };

    return list.map((item, index) => {
        // console.log('item.customerNo', item.customerNo, !!item.customerNo)
        if (!!item.customerNo) {
            if (index === 0) {
                item.colorIndex = Math.floor(Math.random() * COLORS.length);
            } else if (item.customerNo === list[index - 1].customerNo) {
                item.colorIndex = list[index - 1]?.colorIndex;
            } else {
                item.colorIndex = getRandomColorIndex(list[index - 1]?.colorIndex);
            }
        } else {
            item.colorIndex = null
        }
        return item;
    });
}

const COLORS = [
    'rgba(85, 153, 255, 0.2)',  // 柔和的蓝色
    'rgba(123, 201, 123, 0.2)', // 柔和的绿色
    'rgba(255, 233, 150, 0.3)', // 浅黄色
    'rgba(255, 201, 150, 0.3)', // 浅橙色
    'rgba(250, 179, 179, 0.3)', // 浅粉色
    'rgba(179, 250, 250, 0.3)', // 浅青色
    'rgba(150, 150, 255, 0.2)', // 柔和的紫蓝色
    'rgba(255, 179, 203, 0.3)', // 浅玫红色
    'rgba(211, 179, 255, 0.3)', // 浅紫色
]

export { formatPayroll, getSum, COLORS }