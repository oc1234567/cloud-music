import { createGlobalStyle } from 'styled-components';

export const IconStyle = createGlobalStyle`
@font-face {
  font-family: "iconfont";
  src: url('iconfont.eot?t=1598594374775'); /* IE9 */
  src: url('iconfont.eot?t=1598594374775#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('iconfont.woff?t=1598594374775') format('woff'),
  url('iconfont.ttf?t=1598594374775') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1598594374775#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-down:before {
  content: "\e639";
}

.icon-loop:before {
  content: "\e64c";
}

.icon-stop1:before {
  content: "\e60a";
}

.icon-first-page:before {
  content: "\e87a";
}

.icon-last-page:before {
  content: "\e8ab";
}

.icon-stop:before {
  content: "\e613";
}

.icon-music_note_list:before {
  content: "\e696";
}

.icon-listen:before {
  content: "\e707";
}

.icon-PlayFilled:before {
  content: "\e66a";
}

.icon-discuss1e:before {
  content: "\e6bc";
}

.icon-iconsortrecommend:before {
  content: "\e62c";
}

.icon-uutrecommend:before {
  content: "\e60d";
}

.icon-uutrecommendon:before {
  content: "\e62d";
}

.icon-more:before {
  content: "\e68f";
}

.icon-back:before {
  content: "\e62b";
}

.icon-Menu:before {
  content: "\e664";
}

.icon-search:before {
  content: "\e600";
}
`
