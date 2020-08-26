import React, { forwardRef, useState, useEffect, useRef, useImperativeHandle, useMemo } from 'react';
import PropTypes from 'prop-types';
import BScroll from 'better-scroll';
import { ScrollContainer } from '../../components/style';

import styled from 'styled-components';

//加载动画
import Loading from '../loading/index';
import LoadingV2 from '../loading-v2/index';

//引入防抖
import { debounce } from '../../api/util';

export const PullUpLoading = styled.div`
    position: absolute;
    left:0; 
    right:0;
    bottom: 5px;
    width: 60px;
    height: 60px;
    margin: auto;
    z-index: 100;
`;

export const PullDownLoading = styled.div`
    position: absolute;
    left:0; 
    right:0;
    top: 0;
    height: 30px;
    margin: auto;
    z-index: 100;
`;

const Scroll = forwardRef((props, ref) => {
    const [bScroll, setBScroll] = useState();
    const scrollContainerRef = useRef();

    const { direction, click, refresh, pullUpLoading, pullDownLoading, bounceTop, bounceBottom } = props;
    const { pullUp, pullDown, onScroll } = props;

    //下拉与上拉函数防抖处理
    let pullUpDebounce = useMemo(() => {
        return debounce(pullUp, 300);
    }, [pullUp]);

    let pullDownDebounce = useMemo(() => {
        return debounce(pullDown, 300);
    }, [pullDown]);

    useEffect(() => {
        const scroll = new BScroll(scrollContainerRef.current, {
            scrollX: direction === "horizontal",
            scrollY: direction === "vertical",
            probeType: 3,
            click: click,
            bounce: {
                top: bounceTop,
                bottom: bounceBottom
            }
        });
        setBScroll(scroll);
        return () => {
            setBScroll(null);
        }
    }, [click, direction, bounceTop, bounceBottom]);

    useEffect(() => {
        if (refresh && bScroll) {
            bScroll.refresh();
        }
    });

    useEffect(() => {
        if (!bScroll || !onScroll) {
            return;
        } 
        bScroll.on("scroll", (scroll) => {
            onScroll(scroll);
        })
        return () => {
            bScroll.off("scroll");
        }
    }, [onScroll, bScroll]);

    useEffect(() => {
        if (!bScroll || !pullUp) {
            return;
        }
        bScroll.on("scrollEnd", () => {
            if (bScroll.y <= bScroll.maxScrollY + 100) {
                pullUpDebounce();
            }
        });
        return () => {
            bScroll.off("scrollEnd");
        }
    }, [pullUp, pullUpDebounce, bScroll]);

    useEffect(() => {
        if (!bScroll || !pullDown) {
            return ;
        }
        bScroll.on("touchEnd", (pos) => {
            if (pos.y > 50) {
                pullDownDebounce();
            }
        });
        return () => {
            bScroll.off("touchEnd");
        }
    }, [pullDown, pullDownDebounce, bScroll]);

    useImperativeHandle(ref, () => ({
        refresh() {
            if (bScroll) {
                bScroll.refresh();
                bScroll.scrollTo(0, 0);
            }
        },
        getBScroll() {
            if (bScroll) {
                return bScroll;
            }
        }
    }));

    const PullUpdisplayStyle = pullUpLoading ? {display: ''} : {display: 'none'};
    const PullDowndisplayStyle = pullDownLoading ? {display: ''} : {display: 'none'};
    return (
        <ScrollContainer ref={scrollContainerRef}>
            {props.children}
            <PullUpLoading style={PullUpdisplayStyle}><Loading></Loading></PullUpLoading>
            <PullDownLoading style={PullDowndisplayStyle}><LoadingV2></LoadingV2></PullDownLoading>
        </ScrollContainer>
    )
})

Scroll.propTypes = {
    direction: PropTypes.oneOf(["vertical", "horizontal"]),
    click: PropTypes.bool,
    refresh: PropTypes.bool,
    onScroll: PropTypes.func,
    pullUp: PropTypes.func,
    pullDown: PropTypes.func,
    pullUpLoading: PropTypes.bool,
    pullDownLoading: PropTypes.bool,
    bounceTop: PropTypes.bool,
    bounceBottom: PropTypes.bool
};

Scroll.defaultProps = {
    direction: "vertical",
    click: true,
    refresh: true,
    onScroll: null,
    pullUpLoading: false,
    pullDownLoading: false,
    pullUp: null,
    pullDown: null,
    bounceTop: true,
    bounceBottom: true
}

export default React.memo(Scroll);