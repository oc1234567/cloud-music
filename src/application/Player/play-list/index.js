import React, { memo, useRef, useState, useCallback, useEffect } from 'react';
import { CSSTransition } from "react-transition-group";
import { PlayListWrapper, ScrollWrapper, ListHeader, ListContent } from './style';

//config
import { playMode } from '../../../api/config';

//util
import { prefixStyle, getName, shuffle, findIndex } from '../../../api/util';

//公共组件
import Scroll from "../../../baseUI/scroll";
import Confirm from "../../../baseUI/confirm";

//action
import { changeShowPlayList, changeCurrentIndex, changePlayMode, changePlayList, deleteSong, changeSequecePlayList, changeCurrentSong, changePlayingState } from '../store/actionCreators';

//redux
import { connect } from 'react-redux';

function PlayList(props) {

    const { currentIndex, showPlayList, mode, currentSong:currentSongImmu, playList:playListImmu, sequencePlayList:sequencePlayListImmu } = props;
    const { togglePlayListDispatch, changeCurrentIndexDispatch, changeModeDispatch, changePlayListDispatch, deleteSongDispatch, clearDispatch } = props;
    const currentSong = currentSongImmu ? currentSongImmu.toJS() : null;
    const playList = playListImmu ? playListImmu.toJS() : null;
    const sequencePlayList = sequencePlayListImmu ? sequencePlayListImmu.toJS() : null;
    
    const [isShow, setIsShow] = useState(false);
    const [canTouch, setCanTouch] = useState(true);
    const [startY, setStartY] = useState(0);
    const [initialed, setInitialed] = useState(0);
    const [distance, setDistance] = useState(0);

    const playListRef = useRef();
    const listWrapperRef = useRef();
    const listContentRef = useRef();
    const confirmRef = useRef();

    const transform = prefixStyle("transform");

     
    const onEnterCB = useCallback(() => {
        setIsShow(true);
        listWrapperRef.current.style[transform] = `translate3d(0, 100%, 0)`;
    }, [transform]);

    const onEnteringCB = useCallback(() => {
        listWrapperRef.current.style["transition"] = "all 0.3s";
        listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
    }, [transform])

    const onExitingCB = useCallback(() => {
        listWrapperRef.current.style["transition"] = "all 0.3s";
        listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
    }, [transform]);

    const onExitedCB = useCallback(() => {
        setIsShow(false);
        listWrapperRef.current.style[transform] = `translate3d(0px, 100%, 0px)`;
    }, [transform]);


    const changeMode = useCallback(() => {
        let newMode = (mode + 1) % 3;
        if (newMode === 0) {
            changePlayListDispatch(sequencePlayList);
            let index = findIndex(currentSong, sequencePlayList);
            changeCurrentIndexDispatch(index);
        } else if (newMode === 1) {
            changePlayListDispatch(sequencePlayList);
        } else if (newMode === 2) {
            let newList = shuffle(sequencePlayList);
            let index = findIndex(currentSong, newList);
            changePlayListDispatch(newList);
            changeCurrentIndexDispatch(index);
        }
        changeModeDispatch(newMode);
    }, [currentSong, sequencePlayList]);

    const handleChangeCurrentIndex = (index) => {
        if (currentIndex === index)  {
            return ;
        } 
        changeCurrentIndexDispatch(index);
    };

    const handleDeleteSong = (e, song) => {
        e.stopPropagation();
        deleteSongDispatch(song);
    };
    
    const handleShowClear = () => {
        confirmRef.current.show();
    };

    const handleConfirmClear = () => {
        clearDispatch();
    };

    const handleScroll = (pos) => {
        let state = pos.y === 0;
        setCanTouch(state);
    };

    const handleTouchStart = (e) => {
        if (!canTouch || initialed) {
            return;
        }
        listWrapperRef.current.style["transition"] = "";
        setStartY(e.nativeEvent.touches[0].pageY);
        setInitialed(true);
    }

    const handleTouchMove = (e) => {
        if (!canTouch || initialed) {
            return;
        }
        let distance = e.nativeEvent.touches[0].pageY - startY;
        if (distance < 0) {
            return;
        }
        setDistance(distance);
        listWrapperRef.current.style[transform] = `translate3d(0, ${distance}px, 0)`;
    };

    const handleTouchEnd = (e) => {
        setInitialed(false);
        if (distance >= 150) {
            togglePlayListDispatch(false);
        } else {
            listWrapperRef.current.style["transition"] = "all 0.3s";
            listWrapperRef.current.style[transform] = `translate3d(0, 0, 0)`;
        }
    };

    const getPlayMode = useCallback(() => {
        let content, text;
        console.warn(`补充 顺序播放 单曲循环 随机播放 icon`);
        if (mode === playMode.sequence) {
            content = "";
            text = "顺序播放";
        } else if (mode === playMode.loop) {
            content = "";
            text = "单曲循环";
        } else {
            content = "";
            text = "随机播放";
        }
        return (
            <div>
                <i className="iconfont" onClick={e => changeMode(e)} dangerouslySetInnerHTML={{__html: content}}></i>
                <span className="text" onClick={e => changeMode(e)}>{ text }</span>
            </div>
        )
    }, []);

    const getCurrentIcon = useCallback((item) => {
        const current = currentSong.id === item.id;
        const className = current ? "icon-play" : "";
        console.warn(`补充 play icon`);
        const content = current ? "&#xe6e3;" : "";
        return <i className={`current iconfont ${className}`} dangerouslySetInnerHTML={{__html:content}}></i>
    });

    return (
        <CSSTransition
            in={showPlayList}
            timeout={300}
            className="list-fade"
            onEnter={onEnterCB}
            onEntering={onEnteringCB}
            onExiting={onExitingCB}
            onExited={onExitedCB}
        >
            <PlayListWrapper
                ref={playListRef}
                style={isShow === true ? { display: "block" } : { display: "none" }}
                onClick={() => togglePlayListDispatch(false)}
            >
                <div 
                    className="list_wrapper" 
                    ref={listWrapperRef} 
                    onClick={e => e.stopPropagation()}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <ListHeader>
                        <h1 className="title">
                            { getPlayMode() }
                            { console.warn(`补充 delete icon`) }
                            <span className="iconfont clear" onClick={handleShowClear}></span>
                        </h1>
                    </ListHeader>
                    <ScrollWrapper>
                        <Scroll ref={listContentRef} onScroll={pos => handleScroll(props)} bounceTop={false}>
                            <ListContent>
                                {
                                    playList.map((item, index) => {
                                        return (
                                            <li className="item" key={item.id} onClick={() => handleChangeCurrentIndex(index)}>
                                                { getCurrentIcon(item) }
                                                <span className="text">{ item.name } - {getName(item.ar)}</span>
                                                <span className="like">
                                                    <i className="iconfont">&#xe62d;</i>
                                                </span>
                                                <span className="delete" onClick={e => handleDeleteSong(e, item)}>
                                                    <i className="iconfont"></i>
                                                </span>
                                            </li>
                                        )
                                    })
                                }
                            </ListContent>
                        </Scroll>
                    </ScrollWrapper>
                    <Confirm 
                        ref={confirmRef}
                        text={"是否删除全部？"}
                        cancelBtnText={"取消"}
                        confirmBtnText={"确定"}
                        handleConfirm={handleConfirmClear}
                    >
                    </Confirm>
                </div>
            </PlayListWrapper>
        </CSSTransition>
    )
}

const mapStateToProps = (state) => ({
    currentIndex: state.getIn(["player", "currentIndex"]),
    currentSong: state.getIn(["player", "currentSong"]),
    playList: state.getIn(["player", "playList"]),
    sequencePlayList: state.getIn(["player", "sequencePlayList"]),
    showPlayList: state.getIn(["player", "showPlayList"]),
    mode: state.getIn(["player", "mode"])
});

const mapDispatchToProps = (dispatch) => ({
    togglePlayListDispatch(data) {
        dispatch(changeShowPlayList(data))
    },
    changeCurrentIndexDispatch(data) {
        dispatch(changeCurrentIndex(data));
    },
    changeModeDispatch(data) {
        dispatch(changePlayMode(data));
    },
    changePlayListDispatch(data) {
        dispatch(changePlayList(data));
    },
    deleteSongDispatch(data) {
        dispatch(deleteSong(data));
    },
    clearDispatch() {
        dispatch(changePlayList([]));
        dispatch(changeSequecePlayList([]));
        dispatch(changeCurrentIndex(-1));
        dispatch(changeShowPlayList(false));
        dispatch(changeCurrentSong({}));
        dispatch(changePlayingState(false));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(PlayList));