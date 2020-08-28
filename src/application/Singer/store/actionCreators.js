import { CHANGE_SONGS_OF_ARTIST, CHANGE_ARTIST, CHANGE_ENTER_LOADING  } from './constants';
import { fromJS } from 'immutable';
import { getSingerInfoRequest } from '../../../api/request';

export const changeArtist = (data) => ({
    type: CHANGE_ARTIST,
    data: fromJS(data)
});

export const changeSongsOfArtist = (data) => ({
    type: CHANGE_SONGS_OF_ARTIST,
    data
});

export const changeEnterLoading = (data) => ({
    type: CHANGE_ENTER_LOADING,
    data
});

export const getSingerInfo = (id) => {
    return (dispatch) => {
        getSingerInfoRequest(id).then(data => {
            dispatch(changeArtist(data.artists));
            dispatch(changeSongsOfArtist(data.hotSongs));
            dispatch(changeEnterLoading(false));
        }).catch(() => {
            console.log(`热门歌手数据传输错误`);
        })
    }
};