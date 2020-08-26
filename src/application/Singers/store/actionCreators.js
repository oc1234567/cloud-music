import { CHANGE_SINGER_LIST, CHANGE_PAGE_COUNT, CHANGE_ENTER_LOADING, CHANGE_PULLDOWN_LOADING, CHANGE_PULLUP_LOADING  } from './constants';
import { fromJS } from 'immutable';
import { getSingerListRequest, getHotSingerListRequest } from '../../../api/request';

export const changeSingerList = (data) => ({
    type: CHANGE_SINGER_LIST,
    data: fromJS(data)
});

export const changePageCount = (data) => ({
    type: CHANGE_PAGE_COUNT,
    data
});

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const changePullUpLoading = (data) => ({
    type: CHANGE_PULLUP_LOADING,
    data
});

export const changePullDownLoading = (data) => ({
    type: CHANGE_PULLDOWN_LOADING,
    data
});

export const getHotSingerList = () => {
    return (dispatch) => {
        getHotSingerListRequest(0).then(data => {
            dispatch(changeSingerList(data.artists));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(() => {
            console.log(`热门歌手数据传输错误`);
        })
    }
};

export const refreshMoreHotSingerList = () => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(["singers", "pageCount"]);
        const singerList = getState().getIn(["singers", "singerList"]).toJS();
        getHotSingerListRequest(pageCount).then(data => {
            dispatch(changeSingerList([...singerList, ...data.artists]));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log(`热门歌手数据传输错误`);
        })
    }
}

export const getSingerList = (category, alpha) => {
    return (dispatch) => {
        getSingerListRequest(category, alpha, 0).then(data => {
            dispatch(changeSingerList(data.artists));
            dispatch(changeEnterLoading(false));
            dispatch(changePullDownLoading(false));
        }).catch(() => {
            console.log("歌手数据传输错误");
        })
    }
};

export const refreshMoreSingerList = (category, alpha) => {
    return (dispatch, getState) => {
        const pageCount = getState().getIn(["singers", "pageCount"]);
        const singerList = getState().getIn(["singers", "singerList"]).toJS();
        getSingerListRequest(category, alpha, pageCount).then(data => {
            dispatch(changeSingerList([...singerList, ...data.artists]));
            dispatch(changePullUpLoading(false));
        }).catch(() => {
            console.log("歌手数据传输错误");
        })
    }
}
