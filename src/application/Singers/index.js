import React, { useEffect, useContext } from "react";
import Horizen from "../../baseUI/horizen-item/index";
import { categoryTypes, alphaTypes } from "../../api/config";
import { List, ListItem, ListContainer } from "./style";

import PropTypes from "prop-types";
import styled from "styled-components";

//公共组件 loading scoll
import Loading from "../../baseUI/loading/index";
import Scroll from "../../baseUI/scroll/index";

//图片懒加载
import LazyLoad from "react-lazyload";

//redux
import { connect } from "react-redux";
import {
  getHotSingerList,
  getSingerList,
  refreshMoreHotSingerList,
  refreshMoreSingerList,
  changePageCount,
  changeEnterLoading,
  changePullUpLoading,
  changePullDownLoading,
} from "./store/actionCreators";

//路由
import { renderRoutes } from 'react-router-config';

//切换组件，组件重载，已有数据丢失，为了在重载时仍然读取到旧的数据，需将数据缓存
import {
  DataContext,
  CHANGE_CATEGORY,
  CHANGE_ALPHA,
} from "./data";

export const NavContainer = styled.div`
  box-sizing: border-box;
  position: fixed;
  top: 95px;
  width: 100%;
  padding: 5px;
  overflow: hidden;
`;

function Singers(props) {
  let { data = {}, dispatch } = useContext(DataContext);
  let { category = "", alpha = "" } = data;
  let {
    singerList,
    enterLoading,
    pullUpLoading,
    pullDownLoading,
    pageCount,
  } = props;
  let {
    getHotSingerDispatch,
    updateDispatch,
    pullUpRefreshDispatch,
    pullDownRefreshDispatch,
  } = props;

  let handleUpdateAlpha = (val) => {
    dispatch({
      type: CHANGE_ALPHA,
      data: val,
    });
    updateDispatch(category, val);
  };

  let handleUpdateCatetory = (val) => {
    dispatch({
      type: CHANGE_CATEGORY,
      data: val,
    });
    updateDispatch(val, alpha);
  };

  useEffect(() => {
    if (singerList && singerList.size > 0) {
      console.log("获取已缓存的歌手热门数据");
      return;
    }
    console.log("获取歌手热门数据");
    getHotSingerDispatch();
    // eslint-disable-next-line
  }, []);

  const handlePullUp = () => {
    pullUpRefreshDispatch(category, alpha, pageCount);
  };

  const handlePullDown = () => {
    pullDownRefreshDispatch(category, alpha);
  };

  const enterDetail = (id) => {
    props.history.push(`/singers/${id}`)
  }

  const renderSingerList = () => {
    const list = singerList ? singerList.toJS() : [];
    return (
      <List>
        {list.map((item, index) => {
          return (
            <ListItem key={item.accountId + "" + index} onClick={() => {
              enterDetail(item.id);
            }}>
              <div className="img_wrapper">
                <LazyLoad
                  placeholder={
                    <img
                      width="100%"
                      height="100%"
                      src={require("./singer.png")}
                      alt="music"
                    />
                  }
                >
                  <img
                    src={`${item.picUrl}?param=300*300`}
                    width="100%"
                    height="100%"
                    alt="music"
                  ></img>
                </LazyLoad>
              </div>
              <span className="name">{item.name}</span>
            </ListItem>
          );
        })}
      </List>
    );
  };

  return (
    <div>
      <NavContainer>
        <Horizen
          list={categoryTypes}
          title="分类（默认热门）:"
          handleClick={handleUpdateCatetory}
          oldVal={category}
        ></Horizen>
        <Horizen
          list={alphaTypes}
          title="首字母:"
          handleClick={handleUpdateAlpha}
          oldVal={alpha}
        ></Horizen>
      </NavContainer>
      <ListContainer>
        <Scroll
          pullUp={handlePullUp}
          pullDown={handlePullDown}
          pullUpLoading={pullUpLoading}
          pullDownLoading={pullDownLoading}
        >
          {renderSingerList()}
        </Scroll>
        {enterLoading ? <Loading /> : null}
      </ListContainer>
      { renderRoutes(props.route.routes) }
    </div>
  );
}

const mapStateToProps = (state) => ({
  singerList: state.getIn(["singers", "singerList"]),
  enterLoading: state.getIn(["singers", "enterLoading"]),
  pullUpLoading: state.getIn(["singers", "pullUpLoading"]),
  pullDownLoading: state.getIn(["singers", "pullDownLoading"]),
  pageCount: state.getIn(["singers", "pageCount"]),
});

const mapDispatchToProps = (dispatch) => ({
  getHotSingerDispatch() {
    dispatch(getHotSingerList());
  },
  updateDispatch(category, alpha) {
    dispatch(changePageCount(0));
    dispatch(changeEnterLoading(true));
    dispatch(getSingerList(category, alpha));
  },
  pullUpRefreshDispatch(category, alpha, count) {
    dispatch(changePullUpLoading(true));
    dispatch(changePageCount(count + 1));
    if (category === "" && alpha === "") {
      dispatch(refreshMoreHotSingerList());
    } else {
      dispatch(refreshMoreSingerList(category, alpha));
    }
  },
  pullDownRefreshDispatch(category, alpha) {
    dispatch(changePullDownLoading(true));
    dispatch(changePageCount(0));
    if (category === "" && alpha === "") {
      dispatch(getHotSingerList());
    } else {
      dispatch(getSingerList(category, alpha));
    }
  },
});

Singers.defaultProps = {
  pageCount: 1,
};

Scroll.propTypes = {
  pageCount: PropTypes.number,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Singers);
