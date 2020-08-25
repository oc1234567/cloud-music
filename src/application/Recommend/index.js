import React from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../components/scroll';
import { Content } from '../../components/style';

//redux
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';

function Recommend(props) {

    // const bannerList = [1, 2, 3, 4].map(item => {
    //     return {
    //         imageUrl: "http://p1.music.126.net/ZYLJ2oZn74yUz5x8NBGkVA==/109951164331219056.jpg"
    //     }
    // });

    // const recommendList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(item => {
    //     return {
    //         id: 1,
    //         picUrl: "https://p1.music.126.net/fhmefjUfMD-8qtj3JKeHbA==/18999560928537533.jpg",
    //         playCount: 12121222,
    //         name: "朴树、许巍、李健、郑钧、老狼、赵雷"
    //     }
    // })

    const { bannerList, recommendList } = props;
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

    useEffect(() => {
        getBannerDataDispatch();
        getRecommendListDataDispatch();
    }, []);

    const bannerListJS = bannerList ? bannerList.toJS() : [];
    const recommendListJS = recommendList ? recommendList.toJS() : [];

    return (
        <Content>
            <Scroll className="list">
                <div>
                    <Slider bannerList={bannerListJS}></Slider>
                    <RecommendList recommendList={recommendListJS}></RecommendList>
                </div>
            </Scroll>
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
});

const mapDispatchToProps = (dispatch) => {
    return {
        getBannerDataDispatch() {
            dispatch(actionTypes.getBannerList());
        },
        getRecommendListDataDispatch() {
            dispatch(actionTypes.getRecommendList());
        },
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Recommend));