import React, { memo, useRef, useEffect, useState } from "react";
import MiniPlay from "./miniPlayer/index";
import NormalPlayer from "./normalPlayer/index";

//config
import { playMode } from "../../api/config";

//util
import { getSongUrl, isEmptyObject, shuffle } from "../../api/util";

//redux
import { connect } from "react-redux";
import {
  changeCurrentIndex,
  changeCurrentSong,
  changeFullScreen,
  changePlayList,
  changePlayMode,
  changePlayingState,
  changeShowPlayList,
} from "./store/actionCreators";

function Player(props) {
  //   const currentSong = {
  //     al: {
  //       picUrl:
  //         "https://p1.music.126.net/JL_id1CFwNJpzgrXwemh4Q==/109951164172892390.jpg",
  //     },
  //     name: "木偶人",
  //     ar: [{ name: "薛之谦" }],
  //   };
  const {
    fullScreen,
    playing,
    mode,
    currentIndex,
    currentSong: currentSongImmu,
    playList: playListImmu,
    sequencePlayList: sequecePlayListImmu, //顺序列表
  } = props;
  const {
    toggleFullScreenDispatch,
    togglePlayingDispatch,
    togglePlayListDispatch,
    changeCurrentIndexDispatch,
    changeCurrentDispatch,
    changeModeDispatch,
    changePlayListDispatch,
  } = props;

  const currentSong = currentSongImmu ? currentSongImmu.toJS() : {};
  const playList = playListImmu ? playListImmu.toJS() : [];
  const sequencePlayList = sequecePlayListImmu
    ? sequecePlayListImmu.toJS()
    : [];

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  let percent = isNaN(currentTime / duration) ? 0 : currentTime / duration;

  const audioRef = useRef();

  const [preSong, setPreSong] = useState({});

  useEffect(() => {
    changeCurrentIndexDispatch(0);
  }, []);

  useEffect(() => {
    if (
      !!playList.length ||
      currentIndex === -1 ||
      !playList[currentIndex] ||
      playList[currentIndex].id === preSong.id
    ) {
      return;
    }
    let current = playList[currentIndex];
    changeCurrentDispatch(current);
    setPreSong(current);
    audioRef.current.src = getSongUrl(current.id);
    setTimeout(() => {
      audioRef.current.play();
    });
    togglePlayListDispatch(true);
    setCurrentTime(0);
    setDuration((current.dt / 1000) | 0);
  }, [playList, currentIndex]);

  useEffect(() => {
    playing ? audioRef.current.play() : audioRef.current.pause();
  }, [playing]);

  const clickPlaying = (e, state) => {
    e.stopPropagation();
    togglePlayingDispatch(state);
  };

  const handleLoop = () => {
    audioRef.current.currentTime = 0; //从头播放
    changePlayingState(true);
    audioRef.current.play();
  };
  const handlePrev = (e) => {
    //只有一首歌，则单曲循环
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex - 1;
    if (index < 0) {
      index = playList.length - 1;
    }
    if (!playing) {
      togglePlayingDispatch(true);
    }
    changeCurrentIndexDispatch(index);
  };

  const handleNext = (e) => {
    if (playList.length === 1) {
      handleLoop();
      return;
    }
    let index = currentIndex + 1;
    if (index === playList.length) index = 0;
    if (!playing) togglePlayingDispatch(true);
    changeCurrentIndexDispatch(index);
  };

  const findIndex = (song, list) => {
    return list.findIndex((item) => {
      return song.id === item.id;
    });
  };

  const changeMode = () => {
    const newMode =
      mode === playMode.random
        ? playMode.loop
        : mode === playMode.loop
        ? playMode.sequence
        : playMode.random;
    if (newMode === 0) {
      //顺序模式
      changePlayListDispatch(sequencePlayList);
      let index = findIndex(currentSong, sequencePlayList);
      changeCurrentIndexDispatch(index);
    } else if (newMode === 1) {
      //单曲循环
      changePlayListDispatch(sequencePlayList);
    } else if (newMode === 2) {
      //随机播放
      let newList = shuffle(sequencePlayList);
      let index = findIndex(currentSong, newList);
      changePlayListDispatch(newList);
      changeCurrentIndexDispatch(index);
    }
    changeModeDispatch(newMode);
  };

  const onProgressChange = (curPercent) => {
      const newTime = curPercent * duration;
      setCurrentTime(newTime);
      audioRef.current.currentTime = newTime;
      if (!playing) {
          togglePlayingDispatch(true);
      }
  }

  return (
    <div>
      {isEmptyObject ? null : (
        <MiniPlay
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
        ></MiniPlay>
      )}
      {isEmptyObject ? null : (
        <NormalPlayer
          song={currentSong}
          fullScreen={fullScreen}
          playing={playing}
          mode={mode}
          handlePrev={handlePrev}
          handleNext={handleNext}
          changeMode={changeMode}
          toggleFullScreen={toggleFullScreenDispatch}
          clickPlaying={clickPlaying}
          onProgressChange={onProgressChange}
        ></NormalPlayer>
      )}
      <audio ref={audioRef}></audio>
    </div>
  );
}

const mapStateToProps = (state) => ({
  fullScreen: state.getIn(["player", "fullScreen"]),
  playing: state.getIn(["player", "playing"]),
  currentSong: state.getIn(["player", "currentSong"]),
  showPlayList: state.getIn(["player", "showPlayList"]),
  mode: state.getIn(["player", "mode"]),
  currentIndex: state.getIn(["player", "currentIndex"]),
  playList: state.getIn(["player", "playList"]),
  sequencePlayList: state.getIn(["player", "sequencePlayList"]),
});

const mapDispatchToProps = (dispatch) => ({
  togglePlayingDispatch(data) {
    dispatch(changePlayingState(data));
  },
  toggleFullScreenDispatch(data) {
    dispatch(changeFullScreen(data));
  },
  togglePlayListDispatch(data) {
    dispatch(changeShowPlayList(data));
  },
  changeCurrentIndexDispatch(index) {
    dispatch(changeCurrentIndex(index));
  },
  changeCurrentDispatch(data) {
    dispatch(changeCurrentSong(data));
  },
  changeModeDispatch(data) {
    dispatch(changePlayMode(data));
  },
  changePlayListDispatch(data) {
    dispatch(changePlayList(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(memo(Player));
