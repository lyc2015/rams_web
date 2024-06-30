// reducers.js
import {
    FETCH_NATIONALITY_CODES_REQUEST,
    FETCH_NATIONALITY_CODES_SUCCESS,
    FETCH_NATIONALITY_CODES_FAILURE,

    FETCH_VISA_TYPES_REQUEST,
    FETCH_VISA_TYPES_SUCCESS,
    FETCH_VISA_TYPES_FAILURE,

    FETCH_CUSTOMER_BASE_REQUEST,
    FETCH_CUSTOMER_BASE_SUCCESS,
    FETCH_CUSTOMER_BASE_FAILURE,

    FETCH_STATION_REQUEST,
    FETCH_STATION_SUCCESS,
    FETCH_STATION_FAILURE,

    FETCH_MAX_ID_REQUEST,
    FETCH_MAX_ID_SUCCESS,
    FETCH_MAX_ID_FAILURE

} from './actions';

const initialState = {
    nationalityCodes: [],
    visaTypes: [],
    customerSource: [],
    stations: [],
    maxId: null,
    loading: false,
    error: null,
};

const dataReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_NATIONALITY_CODES_REQUEST:
        case FETCH_VISA_TYPES_REQUEST:
        case FETCH_CUSTOMER_BASE_REQUEST:
        case FETCH_STATION_REQUEST:
        case FETCH_MAX_ID_REQUEST:
            return { ...state, loading: true, error: null };




        case FETCH_NATIONALITY_CODES_SUCCESS:
            return { ...state, loading: false, nationalityCodes: action.payload };
        case FETCH_VISA_TYPES_SUCCESS:
            return { ...state, loading: false, visaTypes: action.payload };
        case FETCH_CUSTOMER_BASE_SUCCESS:
            return { ...state, loading: false, customerSource: action.payload };
        case FETCH_STATION_SUCCESS:
            return { ...state, loading: false, stations: action.payload };
        case FETCH_MAX_ID_SUCCESS:
            return { ...state, loading: false, maxId: action.payload };



        case FETCH_NATIONALITY_CODES_FAILURE:
        case FETCH_VISA_TYPES_FAILURE:
        case FETCH_CUSTOMER_BASE_FAILURE:
        case FETCH_STATION_FAILURE:
        case FETCH_MAX_ID_FAILURE:
            return { ...state, loading: false, error: action.error };
        default:
            return state;
    }
};

export default dataReducer;