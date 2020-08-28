import React, { forwardRef, memo } from "react";

import { SongList, SongItem } from "./style";

//util
import { getCount, getName } from "../../api/util";

const SongsList = forwardRef(function(props, refs) {

  const { collectCount, showCollect, songs, showBackground } = props;
  const totalCount = songs.length;

  const handleClick = (e, index) => {
  }

  const renderSongsList = (list) => {
    return list.map((item, index) => {
      return (
        <li key={item.id} onClick={(e) => handleClick(e, index)}>
          <span className="index">{index + 1}</span>
          <div className="info">
            <span>{item.name}</span>
            <span>
            { item.ar ? getName(item.ar): getName(item.artists) } - { item.al ? item.al.name : item.album.name}
            </span>
          </div>
        </li>
      );
    });
  };

  const renderCollect = (count) => {
    return (
      <div className="add_list">
        <i className="iconfont">&#xe62d;</i>
        <span> 收藏 ({getCount(count)})</span>
      </div>
    );
  };

  return (
    <SongList ref={refs} showBackground={showBackground}>
      <div className="first_line">
        <div className="play_all" onClick={(e) => handleClick(e, 0)}>
          <i className="iconfont">&#xe66a;</i>
          <span>
            {" "}
            播放全部 <span className="sum">(共 {totalCount} 首)</span>
          </span>
        </div>
        { showCollect ? renderCollect(collectCount) : null}
      </div>
      <SongItem>{renderSongsList(songs)}</SongItem>
    </SongList>
  );
})

export default memo(SongsList);
