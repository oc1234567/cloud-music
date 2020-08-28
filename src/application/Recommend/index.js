import React, { useEffect } from 'react';
import Slider from '../../components/slider';
import RecommendList from '../../components/list';
import Scroll from '../../baseUI/scroll';
import { Content } from '../../components/style';
import Loading from '../../baseUI/loading/index';

//路由
import { renderRoutes } from 'react-router-config';

//redux
import { connect } from 'react-redux';
import * as actionTypes from './store/actionCreators';

function Recommend(props) {
    const { bannerList, recommendList, enterLoading } = props;
    const { getBannerDataDispatch, getRecommendListDataDispatch } = props;

    useEffect(() => {
        // 在页面切换的时候，页面会重新发起请求，为了减少请求，利用 Redux 的数据来进行页面缓存
        if (!bannerList.size) {
            getBannerDataDispatch();
        }
        if (!recommendList.size) {
            getRecommendListDataDispatch();
        }
        console.log(`推荐页面重载：${bannerList.size}, ${recommendList.size}`)
        // eslint-disable-next-line
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
            { enterLoading ? <Loading></Loading> : null }
            { renderRoutes(props.route.routes) }
        </Content>
    )
}

const mapStateToProps = (state) => ({
    bannerList: state.getIn(['recommend', 'bannerList']),
    recommendList: state.getIn(['recommend', 'recommendList']),
    enterLoading: state.getIn(['recommend', 'enterLoading']),
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