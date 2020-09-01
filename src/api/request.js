// import { axiosInstance } from './config';
import axios from 'axios';
export const getBannerRequest = () => {
    return axios.get('http://localhost:3000/banner').then(res => res.data);
}

export const getRecommendListRequest = () => {
    return axios.get('http://localhost:3000/personalized').then(res => res.data);
}

export const getHotSingerListRequest = (count) => {
    return axios.get(`http://localhost:3000/top/artists?offset=${count}`).then(res => res.data);
}

export const getSingerListRequest= (category, alpha, count) => {
    return axios.get(`http://localhost:3000/artist/list?cat=${category}&initial=${alpha.toLowerCase()}&offset=${count}`).then(res => res.data);
}

export const getRankListRequest = () => {
    return axios.get('http://localhost:3000/toplist/detail').then(res => res.data);
}

export const getAlbumDetailRequest = (id) => {
    return axios.get(`http://localhost:3000/playlist/detail?id=${id}`).then(res => res.data);
}

export const getSingerInfoRequest = (id) => {
    return axios.get(`http://localhost:3000/artists?id=${id}`).then(res => res.data);
}

export const getLyricRequest = id => {
    return axios.get (`http://localhost:3000/lyric?id=${id}`).then(res => res.data);
  };