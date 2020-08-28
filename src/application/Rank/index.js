import React, { useEffect } from 'react';
import { Container, List, ListItem, SongList, EnterLoading } from './style';
import { renderRoutes } from 'react-router-config'; 
//util
import { filterIndex } from '../../api/util'

//公共组件
import Scroll from '../../baseUI/scroll/index';
import Loading from '../../baseUI/loading/index';

//redux
import { connect } from 'react-redux';
import { getRankList } from './store/actionCreators';

function Rank(props) {
    const { rankList:list, enterLoading } = props;
    const { getRankListDataDispatch } = props;

    let rankList = list ? list.toJS() : [];

    let globalStartIndex = filterIndex(rankList);
    let officialList = rankList.slice(0, globalStartIndex);
    let globalList = rankList.slice(globalStartIndex);

    useEffect(() => {
        if (!rankList.length) {
            getRankListDataDispatch();
        }
        // eslint-disable-next-line 
    }, []);

    const enterDetail = (detail) => {
        props.history.push(`/rank/${detail.id}`)
    }

    const renderRankList = (list, global) => {
        return (
            <List globalRank={global}>
                {
                    list.map((item, index) => (
                        <ListItem key={item.coverImgId+""+index} tracks={item.tracks} onClick={() => enterDetail(item)}>
                            <div className="img_wrapper">
                                <img src={item.coverImgUrl} alt="" />
                                <div className="decorate"></div>
                                <span className="update_frequecy">{item.updateFrequency}</span>
                            </div>
                            { renderSongList(item.tracks) }
                        </ListItem>
                    ))
                }
            </List>
        )
    }
    
    const renderSongList = (list) => {
        return list.length ? (
            <SongList>
                {
                    list.map((item, index) => (<li key={index}>{index+1}. {item.first} - {item.second}</li>))
                }
            </SongList>
        ) : null;
    }

    let displayStyle = enterLoading ? {"display":"none"}:  {"display": ""};

    return (
        <Container>
            <Scroll>
                <div>
                    <h1 className="offical" style={displayStyle}> 官方榜 </h1>
                    { renderRankList(officialList) }
                    <h1 className="global" style={displayStyle}> 全球榜 </h1>
                    { renderRankList(globalList, true) }
                    { enterLoading ? <EnterLoading><Loading></Loading></EnterLoading> : null }
                </div>
            </Scroll>
            { renderRoutes(props.route.routes) }
        </Container>
    )
}

const mapStateToProps = (state) => ({
    rankList: state.getIn(['rank', 'rankList']),
    enterLoading: state.getIn(['rank', 'enterLoading']),
})
const mapDispatchToProps = (dispatch) => ({
    getRankListDataDispatch() {
        dispatch(getRankList());
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Rank));