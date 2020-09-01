import React, { memo, useRef, useEffect } from "react";
import { getName, formatPlayTime } from "../../../api/util";
import {
  NormalPlayerContainer,
  Top,
  Middle,
  Bottom,
  Operators,
  CDWrapper,
  ProgressWrapper,
  ProgressBarWrapper,
  LyricContainer,
  LyricWrapper
} from "./style";
import PropTypes from "prop-types";

//animate 切入动画
import { CSSTransition } from "react-transition-group";
//帧动画
import animations from "create-keyframe-animation";

//config
import { playMode } from '../../../api/config';

//util
import { prefixStyle } from "../../../api/util";

//公共组件
import ProgressBar from '../../../baseUI/progress-bar';
import Scroll from '../../../baseUI/scroll';

function NormalPlayer(props) {
  console.log('全屏播放器加载');
  const { song, fullScreen, playing, mode, percent, duration, currentTime, currentLineNum, currentPlayingLyric, currentLyric } = props;
  console.log(song, fullScreen, playing, mode, percent, duration, currentTime)
  const {
    toggleFullScreen,
    clickPlaying,
    handlePrev,
    handleNext,
    changeMode,
    onProgressChange,
    togglePlayList
  } = props;

  const normalPlayerRef = useRef();
  const cdWrapperRef = useRef();
  const currentState = useRef("");
  const lyricScrollRef = useRef();
  const lyricLineRefs = useRef([]);

  //进度条 拖动交互
  const progressBar = useRef();
  const progress = useRef();
  const progressBtn = useRef();
  const [touch, setTouch] = useRef({});

  const progressBtnWidth = 16;
  const transform = prefixStyle("transform");

  //启用帧动画
  const enter = () => {
    normalPlayerRef.current.style.display = "block";
    const { x, y, scale } = _getPosAndScale(); // 获取 miniPlayer 图片中心相对 normalPlayer 唱片中心的偏移
    let animation = {
      0: {
        transform: `translate3d(${x}px,${y}px,0) scale(${scale})`,
      },
      60: {
        transform: `translate3d(0, 0, 0) scale(1.1)`,
      },
      100: {
        transform: `translate3d(0, 0, 0) scale(1)`,
      },
    };
    animations.registerAnimation({
      name: "move",
      animation,
      presets: {
        duration: 400,
        easing: "linear",
      },
    });
    animations.runAnimation(cdWrapperRef.current, "move");
  };

  // 计算偏移的辅助函数
  const _getPosAndScale = () => {
    const targetWidth = 40;
    const paddingLeft = 40;
    const paddingBottom = 30;
    const paddingTop = 80;
    const width = window.innerWidth * 0.8;
    const scale = targetWidth / width;
    // 两个圆心的横坐标距离和纵坐标距离
    const x = -(window.innerWidth / 2 - paddingLeft);
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom;
    return {
      x,
      y,
      scale,
    };
  };

  const afterEnter = () => {
    // 进入后解绑帧动画
    const cdWrapperDom = cdWrapperRef.current;
    animations.unregisterAnimation("move");
    cdWrapperDom.style.animation = "";
  };

  const leave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "all 0.4s";
    const { x, y, scale } = _getPosAndScale();
    cdWrapperDom.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
  };

  const afterLeave = () => {
    if (!cdWrapperRef.current) return;
    const cdWrapperDom = cdWrapperRef.current;
    cdWrapperDom.style.transition = "";
    cdWrapperDom.style[transform] = "";
    normalPlayerRef.current.style.display = "none";
    currentState.current = "";
  };

  //歌词插件
  useEffect(() => {
    if (!lyricScrollRef.current) {
      return;
    }
    let bScroll = lyricScrollRef.current.getBScroll();
    if (currentLineNum > 5) {
      let lineEl = lyricLineRefs.current[currentLineNum - 5].current;
      bScroll.scrollToElement(lineEl, 1000);
    } else {
      bScroll.scrollTo(0, 0, 1000);
    }
  }, [currentLineNum]);

  //进度条初始化
  useEffect(() => {
    if (percent >= 0 && percent <= 1 && !touch.initiated) {
      const barWidth = progressBar.current.clientWidth - progressBtnWidth;
      const offsetWidth = barWidth * percent ;
      _offset(offsetWidth);
    }
  }, [percent]);

  const _offset = (offsetWidth) => {
    progress.current.style.width = `${offsetWidth}px`;
    progressBtn.current.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`;
  };

  const progressTouchStart = (e) => {
    const startTouch = {};
    startTouch.initiate = true;
    startTouch.startX = e.touches[0].pageX;
    startTouch.left = progress.current.clientWidth;
    setTouch(startTouch);
  };

  const progressTouchMove = (e) => {
    if (!touch.initiated) return;
    const deltaX = e.touches[0].pageX - touch.startX;
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const offsetWidth = Math.min(Math.max(0, touch.left + deltaX), barWidth);
    _offset(offsetWidth);
  };

  const progressTouchEnd = (e) => {
    const endTouch = JSON.parse(JSON.stringify(touch));
    endTouch.initiated = false;
    setTouch(endTouch);
    changePercent();
  };

  const progressClick = (e) => {
    const rect = progressBar.current.getBoundingClientRect();
    const offsetWidth = e.pageX - rect.left;
    _offset(offsetWidth);
    changePercent();
  };

  const changePercent = () => {
    const barWidth = progressBar.current.clientWidth - progressBtnWidth;
    const curPercent = progress.current.clientWidth / barWidth;
    percentChange(curPercent);
  };

  const percentChange = (percent) => {
    onProgressChange(percent);
  };

  const toggleCurrentState = () => {
    if (currentState.current !== "lyric") {
      currentState.current = "lyric";
    } else {
      currentState.current = "";
    }
  }

  const getPlayMode = () => {
    let content;
    if (mode === playMode.sequence) {
      content = "&#xe6ab;";
    } else if (mode === playMode.loop) {
      content = "&#xe64c;";
    } else {
      content = "&#xe60e;";
    }
    return content;
  };

  const renderProgressBar = () => {
    return (
      <ProgressBarWrapper>
        <div className="bar-inner" ref={progressBar} onClick={progressClick}>
          <div className="progress" ref={progress}></div>
          <div
            className="progress-btn-wrapper"
            ref={progressBtn}
            onTouchStart={progressTouchStart}
            onTouchMove={progressTouchMove}
            onTouchEnd={progressTouchEnd}
          >
            <div className="progress-btn"></div>
          </div>
        </div>
      </ProgressBarWrapper>
    );
  };

  return (
    <CSSTransition
      classNames="normal"
      in={fullScreen}
      timeout={400}
      mountOnEnter
      onEnter={enter}
      onEntered={afterEnter}
      onExit={leave}
      onExited={afterLeave}
    >
      <NormalPlayerContainer ref={normalPlayerRef}>
        <div className="background">
          <img
            src={song.al.picUrl + "?param=300x300"}
            width="100%"
            height="100%"
            alt="歌曲图片"
          />
        </div>
        <div className="background layer"></div>
        <Top className="top">
          <div className="back" onClick={() => toggleFullScreen(false)}>
            <i className="iconfont icon-back">&#xe639;</i>
          </div>
          <h1 className="title">{song.name}</h1>
          <h1 className="subtitle">{getName(song.ar)}</h1>
        </Top>
        <Middle ref={cdWrapperRef} onClick={toggleCurrentState}>
          <CSSTransition timeout={400} className="fade" in={currentState.current !== "lyric"} >
            <CDWrapper style={{visibility: currentState.current !== "lyric" ? "visible" : "hidden"}}>
              <div className="cd">
                <img
                  className={`image play ${playing ? "" : "pause"}`}
                  src={song.al.picUrl + "?param=400x400"}
                  alt=""
                />
              </div>
              <p className="playing_lyric">{currentPlayingLyric}</p>
            </CDWrapper>
          </CSSTransition>
          <CSSTransition time={400} className="fade" in={currentState.current === "lyric"}>
            <LyricContainer>
              <Scroll ref={lyricScrollRef}>
                <LyricWrapper style={{visibility: currentState.current === "lyric" ? "visible" : "hidden"}} className="lyric_wrapper">
                  {
                    currentLyric ? currentLyric.lines.map((item, index) => {
                      lyricLineRefs.current[index] = React.createRef();
                      return (
                        <p className={`text ${currentLineNum === index ? "current" : ""}`} key={item + index} ref={lyricLineRefs.current[index]}>
                          { item.txt }
                        </p>
                      )
                    }) : <p className="text pure">纯音乐，请欣赏</p>
                  }
                </LyricWrapper>
              </Scroll>
            </LyricContainer>
          </CSSTransition>
        </Middle>
        <Bottom className="bottom">
          <ProgressWrapper>
            <span className="time time-l">{formatPlayTime(currentTime)}</span>
            <div className="progress-bar-wrapper">
              {renderProgressBar()}
            </div>
            <div className="time time-r">{formatPlayTime(duration)}</div>
          </ProgressWrapper>
          <Operators>
            <div className="icon i-left" onClick={changeMode}>
              <i
                className="iconfont"
                dangerouslySetInnerHTML={{ __html: getPlayMode() }}
              ></i>
            </div>
            <div className="icon i-left" onClick={handlePrev}>
              <i className="iconfont">&#xe87a;</i>
            </div>
            <div className="icon i-center">
              <i
                className="iconfont"
                onClick={(e) => clickPlaying(e, !playing)}
                dangerouslySetInnerHTML={{
                  __html: playing ? "&#xe60a;" : "&#xe66a;",
                }}
              ></i>
            </div>
            <div className="icon i-right" onClick={handleNext}>
              <i className="iconfont">&#xe8ab;</i>
            </div>
            <div className="icon i-right" onClick={() => togglePlayList(true)}>
              <i className="iconfont">&#xe696;</i>
            </div>
          </Operators>
        </Bottom>
      </NormalPlayerContainer>
    </CSSTransition>
  );
}

NormalPlayer.prototype = {
  fullScreen: PropTypes.bool,
  toggleFullScreenDispatch: PropTypes.func,
};

export default memo(NormalPlayer);
