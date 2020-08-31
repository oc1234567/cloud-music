import React, { useState, useRef, useEffect, useCallback } from "react";
import { Container, TopDesc, Menu } from "./style";
import { CSSTransition } from "react-transition-group";
import style from '../../assets/global-style';

import SongsList from '../SongsList/index';
import MusicNote from '../../baseUI/music-note/index';

//公共组件
import Header from "../../baseUI/header/index";
import Scroll from "../../baseUI/scroll/index";
import Loading from '../../baseUI/loading/index';

//util
import { isEmptyObject } from "../../api/util";

//redux
import { connect } from 'react-redux';
import { getAlbumList, changeEnterLoading } from './store/actionCreators';

export const HEADER_HEIGHT = 45;

function Album(props) {
  // console.log(`Album 组件载入`);
  const [showStatus, setShowStatus] = useState(true);
  const [title, setTitle] = useState("歌单");
  const [isMarquee, setIsMarquee] = useState(false);

  const headerEl = useRef();
  const musicNoteRef = useRef();

  //读取props数据
  const { currentAlbum:currentAlbumImmutable, enterLoading } = props;
  const { getAlbumDataDispatch } = props;

  // 从路由中拿到歌单的 id
  const id = props.match.params.id;

  let currentAlbum = currentAlbumImmutable ? currentAlbumImmutable.toJS() : {};
  const handleBack = useCallback(() => {
    setShowStatus(false);
  }, []);

  //load数据
  useEffect(() => {
      if (!currentAlbum.length) {
        getAlbumDataDispatch(id);
      }
      // eslint-disable-next-line
  }, []);

  //监听滚动
  const handleScroll = useCallback((pos) => {
    let minScrollY = -HEADER_HEIGHT;
    let percent = Math.abs(pos.y/minScrollY);
    let headerDom = headerEl.current;
    if (pos.y < minScrollY) {
        headerDom.style.backgroundColor = style["theme-color"];
        headerDom.style.opacity = Math.min(1, (percent-1)/2);
        setTitle(currentAlbum.name);
        setIsMarquee(true);
    } else {
        headerDom.style.backgroundColor = "";
        headerDom.style.opacity = 1;
        setTitle("歌单");
        setIsMarquee(false);
    }
}, [currentAlbum]);

  const renderTopDesc = () => {
      return (
        <TopDesc background={currentAlbum.coverImgUrl}>
        <div className="background">
          <div className="filter"></div>
        </div>
        <div className="img_wrapper">
          <div className="decorate"></div>
          <img src={currentAlbum.coverImgUrl} alt="" />
          <div className="play_count">
            <i className="iconfont play">&#xe707;</i>
            <span className="count">
            {" "}{Math.floor(currentAlbum.subscribedCount / 1000) / 10} 万{" "}
            </span>
          </div>
        </div>
        <div className="desc_wrapper">
          <div className="title">{currentAlbum.name}</div>
          <div className="person">
            <div className="avatar">
              <img src={currentAlbum.creator.avatarUrl} alt="" />
            </div>
            <div className="name">{currentAlbum.creator.nickname}</div>
          </div>
        </div>
      </TopDesc>
      );
  }

  const renderMenu = () => {
      return (
        <Menu>
        <div>
          <i className="iconfont">&#xe6bc;</i>
          评论
        </div>
        <div>
          <i className="iconfont">&#xe62c;</i>
          点赞
        </div>
        <div>
          <i className="iconfont">&#xe60d;</i>
          收藏
        </div>
        <div>
          <i className="iconfont">&#xe68f;</i>
          更多
        </div>
      </Menu>
      );
  }

  const musicAnimation = (x, y) => {
    musicNoteRef.current.startAnimation({ x, y });
  }

  return (
    <CSSTransition
      in={showStatus}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExit={props.history.goBack}
    >
      <Container>
        <Header ref={headerEl} title={title} handleClick={handleBack} isMarquee={isMarquee}></Header>
        {!isEmptyObject(currentAlbum) ?
        <Scroll bounceTop={false} onScroll={handleScroll}>
          <div>
            { renderTopDesc() }
            { renderMenu() }
            <SongsList collectCount={currentAlbum.subscribedCount} showCollect={true} songs={currentAlbum.tracks} showBackground={true} musicAnimation={musicAnimation}></SongsList>
          </div>
        </Scroll> : null}
        { enterLoading ? <Loading></Loading> : null}
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
    </CSSTransition>
  );
}

const mapStateToProps = (state) =>({
    currentAlbum: state.getIn(['album', 'currentAlbum']),
    enterLoading: state.getIn(['album', 'enterLoading'])
});

const mapDispatchToProps = (dispatch) => ({
    getAlbumDataDispatch(id) {
        dispatch(changeEnterLoading(true));
        dispatch(getAlbumList(id));
    }
})

export default connect(mapStateToProps, mapDispatchToProps)(React.memo(Album));
