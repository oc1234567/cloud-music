import React, { memo, useRef, useCallback } from "react";
import { getName } from "../../../api/util";
import { MiniPlayerContainer, CircleWrapper } from "./style";

//animate
import { CSSTransition } from "react-transition-group";

function ProgressCircle(props) {
  const { radius, percent } = props;
  // 整个背景的周长
  const dashArray = Math.PI * 100;
  // 没有高亮的部分，剩下高亮的就是进度
  const dashOffset = (1 - percent) * dashArray;

  return (
    <CircleWrapper>
      <svg
        width={radius}
        height={radius}
        viewBox="0 0 100 100"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className="progress-background"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
        />
        <circle
          className="progress-bar"
          r="50"
          cx="50"
          cy="50"
          fill="transparent"
          strokeDasharray={dashArray}
          strokeDashoffset={dashOffset}
        />
      </svg>
      {props.children}
    </CircleWrapper>
  );
}

function MiniPlayer(props) {
  const { song, fullScreen, playing } = props;
  const { clickPlaying, toggleFullScreen, togglePlayList } = props;

  const miniPlayerRef = useRef();

  const handleTogglePlayList = useCallback((e) => {
    togglePlayList(true);
    e.stopPropagation();
    // eslint-disable-next-line
  }, []);
  
  return (
    <CSSTransition
      in={!fullScreen}
      timeout={400}
      classNames="mini"
      onEnter={() => {
        miniPlayerRef.current.style.display = "flex";
      }}
      onExited={() => {
        miniPlayerRef.current.style.display = "none";
      }}
    >
      <MiniPlayerContainer
        ref={miniPlayerRef}
        onClick={() => toggleFullScreen(true)}
      >
        <div className="icon">
          <div className="imgWrapper">
            <img
              className={`play ${playing ? "" : "pause"}`}
              src={song.al.picUrl}
              width="40"
              height="40"
              alt="img"
            />
          </div>
        </div>
        <div className="text">
          <h2 className="name">{song.name}</h2>
          <p className="desc">{getName(song.ar)}</p>
        </div>
        <div className="control" onClick={handleTogglePlayList}>
          <ProgressCircle radius={32} percent={0.2}>
            {playing ? (
              <i className="icon-mini iconfont icon-pause" onClick={e => clickPlaying(e, false)}>&#xe613;</i>
            ) : (
              <i className="icon-mini iconfont icon-play" onClick={e => clickPlaying(e, true)}>&#xe637;</i>
            )}
          </ProgressCircle>
        </div>
        <div className="control">
          <i className="iconfont">&#xe696;</i>
        </div>
      </MiniPlayerContainer>
    </CSSTransition>
  );
}

export default memo(MiniPlayer);
