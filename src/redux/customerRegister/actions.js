// actions.js
import axios from 'axios';

// Action types
export const FETCH_NATIONALITY_CODES_REQUEST = 'FETCH_NATIONALITY_CODES_REQUEST';
export const FETCH_NATIONALITY_CODES_SUCCESS = 'FETCH_NATIONALITY_CODES_SUCCESS';
export const FETCH_NATIONALITY_CODES_FAILURE = 'FETCH_NATIONALITY_CODES_FAILURE';

export const FETCH_VISA_TYPES_REQUEST = 'FETCH_VISA_TYPES_REQUEST';
export const FETCH_VISA_TYPES_SUCCESS = 'FETCH_VISA_TYPES_SUCCESS';
export const FETCH_VISA_TYPES_FAILURE = 'FETCH_VISA_TYPES_FAILURE';

export const FETCH_CUSTOMER_BASE_REQUEST = 'FETCH_CUSTOMER_BASE_REQUEST';
export const FETCH_CUSTOMER_BASE_SUCCESS = 'FETCH_CUSTOMER_BASE_SUCCESS';
export const FETCH_CUSTOMER_BASE_FAILURE = 'FETCH_CUSTOMER_BASE_FAILURE';

export const FETCH_STATION_REQUEST = 'FETCH_STATION_REQUEST';
export const FETCH_STATION_SUCCESS = 'FETCH_STATION_SUCCESS';
export const FETCH_STATION_FAILURE = 'FETCH_STATION_FAILURE';

export const FETCH_MAX_ID_REQUEST = 'FETCH_MAX_ID_REQUEST';
export const FETCH_MAX_ID_SUCCESS = 'FETCH_MAX_ID_SUCCESS';
export const FETCH_MAX_ID_FAILURE = 'FETCH_MAX_ID_FAILURE';

// Action creators 国籍
export const fetchNationalityCodes = () => async dispatch => {
  dispatch({ type: FETCH_NATIONALITY_CODES_REQUEST });
  try {
    const response = await axios.post('http://localhost:8080/employee/searchAllNationalityInfo');

    //国籍dropdownリスト
    const formattedOptions = response.data.map(nationalityList => ({
      value: `${nationalityList.nationalityName} `,
      key: `${nationalityList.nationalityCode} `
    }));

    dispatch({ type: FETCH_NATIONALITY_CODES_SUCCESS, payload: formattedOptions });
  } catch (error) {
    dispatch({ type: FETCH_NATIONALITY_CODES_FAILURE, error });
  }
};


//　ビザ
export const fetchVISATypes = () => async dispatch => {
  dispatch({ type: FETCH_VISA_TYPES_REQUEST });
  try {
    const response = await axios.post('http://localhost:8080/employee/searchAllVisaInfo');
    const formattedOptions = response.data.map(visaList => ({
      value: `${visaList.visaName} `,
      key: `${visaList.visaCode} `
    }));

    dispatch({ type: FETCH_VISA_TYPES_SUCCESS, payload: formattedOptions });
  } catch (error) {
    dispatch({ type: FETCH_VISA_TYPES_FAILURE, error });
  }
};


//顧客
export const fetchCustomerBase = () => async dispatch => {
  dispatch({ type: FETCH_CUSTOMER_BASE_REQUEST });
  try {
    const response = await axios.post('http://localhost:8080/employee/getAllCustomerBase');
    const formattedOptions = response.data.map(customerBase => ({
      value: `${customerBase.customerBaseName} `,
      key: `${customerBase.customerBaseCode} `
    }));
    dispatch({ type: FETCH_CUSTOMER_BASE_SUCCESS, payload: formattedOptions });
  } catch (error) {
    dispatch({ type: FETCH_CUSTOMER_BASE_FAILURE, error });
  }
};


//最寄り駅
export const fetchStations = () => async dispatch => {
  dispatch({ type: FETCH_STATION_REQUEST });
  try {
    const response = await axios.post('http://localhost:8080/employee/getAllStations');
    const formattedOptions = response.data.map(stations => ({
      value: `${stations.stationName} `,
      key: `${stations.stationCode} `
    }));
    dispatch({ type: FETCH_STATION_SUCCESS, payload: formattedOptions });
  } catch (error) {
    dispatch({ type: FETCH_STATION_FAILURE, error });
  }
};



//最大お客様ID
export const fetchMaxId = () => async dispatch => {
  dispatch({ type: FETCH_MAX_ID_REQUEST });
  try {
    const response = await axios.post('http://localhost:8080/employee/getMaxCustomerNo');
    dispatch({ type: FETCH_MAX_ID_SUCCESS, payload: response.data });
  } catch (error) {
    dispatch({ type: FETCH_MAX_ID_FAILURE, error });
  }
};
