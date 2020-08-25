import { createGlobalStyle } from 'styled-components';

export const IconStyle = createGlobalStyle`
@font-face {font-family: "iconfont";
  src: url('iconfont.eot?t=1598343956055'); /* IE9 */
  src: url('iconfont.eot?t=1598343956055#iefix') format('embedded-opentype'), /* IE6-IE8 */
  url('data:application/x-font-woff2;charset=utf-8;base64,d09GMgABAAAAAALgAAsAAAAABmgAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHEIGVgCCcAp0gRUBNgIkAwgLBgAEIAWEbQcwG7sFEdWTEWR/TE7H4FuAr6eybAqyjEa/ydeU+b3FW0sHd4ciNN1q+HBrypaLgSvpMcF//4d535/ZWqlW2rPaUguFIODhEAYwQAFquBbgDw65tgdXTL0GCCjgCkHM7RHNJqX4dWjESUQl5DUkiYdmleurSBxwXTwneDxhA86SFGNZbgAGtfotkWQF6XK6YGPUC9Ule771LJ/x2V2fZzmEEZDMAP/5IGPYAjlAlALA57mm3i28QPIDzSUiLKKfRwIObDrAqKKRbSQj3zB2wQs8DgFZOlaUnNIC4tjjBKgZKzks+HGcpdKIZMNSIxow0vpeOAHv0ff1Y50QSBiwpz6XU0X25MiUuAcEAQi4OgEYsAIOEhrjj4AY28jGywDHKhUcxQM7OqoFsb/OLs4D0ILSZ5J58kctDgB40j0A20m3QnD1/1lUfonT76rvima/XKTrVdQ0oVYUq+T8EyHhreF2M2zvu/ZLL97ObNa+t07kiILMrRtU1eCrhtA0AIszxtAGv8OBAJHtLEyA4HSfOKOrEYDv/R2RN3KGOSG9e7v4TbKBTW4obFswarJGZ2AwaWwAsmSBGHZX/U01Nu4pLdI07syZop3BSDMinb5CghwbJEmzR5alq9U5al4BGW3AwhuAKPtAoMgnjLIv0um/SND0jyTlQJYXnS1zTJKijFAxWtAfiGZbnetgGZee0T+Korwi4tyRagxB33Tl1Iwr0hIz6tMPzA4cbQtM4DQsZYOdtoSGm8C8j23rmt7UmG0RUkSoGC3oD0SzrS7ozLLy+TP6R1HUUVYXviPV2Dv0TTeAnLXroLJHeaU+/cDswNG2wAQGYSkb7M2DEhpuwoToPrZOOzdU22yvX36ghFVhmzg5/QwqKjJBCA==') format('woff2'),
  url('iconfont.woff?t=1598343956055') format('woff'),
  url('iconfont.ttf?t=1598343956055') format('truetype'), /* chrome, firefox, opera, Safari, Android, iOS 4.2+ */
  url('iconfont.svg?t=1598343956055#iconfont') format('svg'); /* iOS 4.1- */
}

.iconfont {
  font-family: "iconfont" !important;
  font-size: 16px;
  font-style: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-search:before {
  content: "\e600";
}
`

