import * as actionTypes from './constants';
import { fromJS } from 'immutable';
import { getAlbumDetailRequest } from '../../../api/request';

export const changeCurrentAlbum = (data) => ({
    type: actionTypes.CHANGE_CURRENT_ALBUM,
    data: fromJS(data)
});

export const changeEnterLoading = (data) => ({
    type: actionTypes.CHANGE_ENTER_LOADING,
    data
})

export const getAlbumList = (id) => {
    return (dispatch) => {
        getAlbumDetailRequest(id).then(data => {
            dispatch(changeCurrentAlbum(data.list));
            dispatch(changeEnterLoading(false));
        }).catch(() => {
            console.log("歌单详情数据传输错误");
        })
    }
};
