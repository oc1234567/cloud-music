
import { createGlobalStyle } from 'styled-components';

export const IconStyle = createGlobalStyle`
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1598693010981'); /* IE9 */
  src: url('iconfont.eot?t=1598693010981#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,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') format('woff2'),
  url('iconfont.woff?t=1598693010981') format('woff'),
  url('iconfont.ttf?t=1598693010981') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1598693010981#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-music:before {
  content: "\e658";
}

.icon-icon_sequence:before {
  content: "\e6ab";
}

.icon-suijisenlin:before {
  content: "\e60e";
}

.icon-play1:before {
  content: "\e637";
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
}`

