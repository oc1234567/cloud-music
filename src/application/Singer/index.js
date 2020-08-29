import React, { useState, useRef, useCallback, useEffect, memo } from "react";
import { CSSTransition } from "react-transition-group";
import {
  Container,
  ImgWrapper,
  CollectButton,
  BgLayer,
  SongListWrapper,
} from "./style";

import SongsList from "../SongsList/index";
import MusicNote from '../../baseUI/music-note/index';
import { HEADER_HEIGHT } from "../../api/config";

//公共组件
import Header from "../../baseUI/header";
import Scroll from "../../baseUI/scroll";
import Loading from "../../baseUI/loading";

//redux
import { connect } from "react-redux";
import { getSingerInfo, changeEnterLoading } from "./store/actionCreators";

function Singer(props) {
  //从props读取数据
  const { artist: artistImmu, songsOfArtist: songsImmu, enterLoading } = props;
  const { getSingerInfoDispatch } = props;

  const [showState, setShowState] = useState;
  const collectButton = useRef();
  const imageWrapper = useRef();
  const songScrollWrapper = useRef();
  const songScroll = useRef();
  const header = useRef();
  const layer = useRef();
  const initialHeight = useRef(0);
  const musicNoteRef = useRef();

  const OFFSET = 5;

  const artist = artistImmu ? artistImmu.toJS() : {};
  const songs = songsImmu ? songsImmu.toJS() : {};

  //从路由中获取id
  const id = props.match.params.id;

  //获取数据
  useEffect(() => {
    changeEnterLoading(true);
    getSingerInfoDispatch(id);
  }, [getSingerInfoDispatch, id]);

  //初始化UI
  useEffect(() => {
    let h = imageWrapper.current.offsetHeight;
    songScrollWrapper.current.style.top = `${h - OFFSET}px`;
    initialHeight.current = h;
    layer.current.style.top = `${h - OFFSET}px`;
    songScroll.current.refresh();
  }, []);

  const setShowStateFalse = useCallback(() => {
    setShowState(false);
  }, [setShowState]);

  const handleScroll = useCallback((pos) => {
    let height = initialHeight.current;
    const newY = pos.y;
    const imageDOM = imageWrapper.current;
    const buttonDOM = CollectButton.current;
    const headerDOM = header.current;
    const layerDOM = layer.current;
    const minScrollY = -(height - OFFSET) + HEADER_HEIGHT;
    const percent = Math.abs(newY / height);

    if (newY > 0) {
      imageDOM.style["transform"] = `scale(${1 + percent})`;
      buttonDOM.style["transform"] = `translate3d (0, ${newY}px, 0)`;
      layerDOM.style.top = `${height - OFFSET + newY}px`;
    } else if (newY >= minScrollY) {
      layerDOM.style.top = `${height - OFFSET - Math.abs(newY)}px`;
      layerDOM.style.zIndex = 1;
      imageDOM.style.paddingTop = "75%";
      imageDOM.style.height = 0;
      imageDOM.style.zIndex = -1;
      buttonDOM.style["transform"] = `translate3d(0, ${newY}px, 0)`;
      buttonDOM.style["opacity"] = `${1 - percent * 2}`;
    } else if (newY < minScrollY) {
      layerDOM.style.top = `${HEADER_HEIGHT - OFFSET}px`;
      layerDOM.style.zIndex = 1;
      headerDOM.style.zIndex = 100;
      imageDOM.style.height = `${HEADER_HEIGHT}px`;
      imageDOM.style.paddingTop = 0;
      imageDOM.style.zIndex = 99;
    }
  }, []);

  return (
    <CSSTransition
      in={showState}
      timeout={300}
      classNames="fly"
      appear={true}
      unmountOnExit
      onExited={() => props.history.goBack()}
    >
      <Container>
        <Header
          ref={header}
          title={artist.name}
          handleClick={setShowStateFalse}
        ></Header>
        <ImgWrapper ref={imageWrapper} bgUrl={artist.picUrl}>
          <div className="filter"></div>
        </ImgWrapper>
        <CollectButton ref={collectButton}>
          <i className="iconfont">&#xe60d;</i>
          <span className="text"> 收藏 </span>
        </CollectButton>
        <BgLayer ref={layer}></BgLayer>
        <SongListWrapper ref={songScrollWrapper}>
          <Scroll ref={songScroll} onScroll={handleScroll}>
            <SongsList songs={songs} showCollect={false} musicAnimation={musicAnimation}></SongsList>
          </Scroll>
        </SongListWrapper>
        <MusicNote ref={musicNoteRef}></MusicNote>
      </Container>
      {enterLoading ? <Loading></Loading> : null}
    </CSSTransition>
  );
}

const mapStateToProps = (state) => ({
  artist: state.getIn(["singerInfo", "artist"]),
  songsOfArtist: state.getIn(["singerInfo", "songsOfArtist"]),
  enterLoading: state.getIn(["singerInfo", "enterLoading"]),
});

const mapDispatchToProps = (dispatch) => ({
  getSingerInfoDispatch: (id) => {
    dispatch(getSingerInfo(id));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(Singer));
