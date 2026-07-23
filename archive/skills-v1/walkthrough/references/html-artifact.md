# HTML 产物：稳定底座，不固定视觉风格

HTML 适合承载连续讲解、按需展开、图表和理解检查。它应当是一个可以离线打开的自包含文件，但页面风格仍根据对象和读者决定，不套用统一视觉模板。

页面的信息结构沿用 [comprehension-structure.md](comprehension-structure.md)。本文件只规定选择 HTML 后的离线运行和嵌入边界。

最终 HTML 的语义骨架和运行时占位遵循 [Walkthrough HTML demo](templates/walkthrough-html.demo.md)。该 Demo 不规定视觉风格；本文件不维护第二份产物模板。

## 代码高亮、Mermaid 与全屏底座

Skill 自带 Highlight.js 11.11.1、Mermaid 11.15.0 和 Walkthrough 运行时：

- `assets/highlight.min.js`：由 `@highlightjs/cdn-assets@11.11.1` 浏览器核心与全部语言模块组成的 BSD-3-Clause 包，预注册发行版提供的 192 种语言；
- `assets/mermaid.min.js`：MIT 许可的 Mermaid 浏览器包；
- `assets/walkthrough-runtime.js`：独立执行代码高亮和 Mermaid 渲染，并为图自动加入全屏按钮；
- `assets/walkthrough-runtime.css`：提供稳定的高亮主题、关键行强调、全屏和按钮基础样式，可由页面覆盖；
- `scripts/embed_html_runtime.py`：把这些资源内联进 HTML。

保留 [Walkthrough HTML demo](templates/walkthrough-html.demo.md) 中 `</body>` 前的运行时占位，然后运行：

```bash
python3 scripts/embed_html_runtime.py walkthrough.html
```

脚本默认原地写回，也可以把第二个路径作为输出文件。真实代码、配置、SQL、命令和请求响应优先使用显式语言：

```html
<pre><code class="language-java" data-highlight-lines="3,7-10">...</code></pre>
```

`language-*` 和 `lang-*` 都可识别。未写语言时默认自动识别；页面可在运行时加载前设置 `window.WALKTHROUGH_HIGHLIGHT_CONFIG = { autoDetect: false }` 关闭，或用 `autoDetectLanguages` 限定自动识别候选。未知显式语言保留原文，不报错改写；不应处理的块使用 `nohighlight` 或 `no-highlight`。`data-highlight-lines` 接受逗号分隔的单行与闭区间，只强调阅读主线，不改变语法颜色。

高亮只能帮助辨认结构，不能替代正文解释。不要把自然语言说明为了着色塞进代码块，也不要为某份文档再写正则 tokenizer。页面中的 Mermaid 使用普通写法：

```html
<pre class="mermaid">
flowchart LR
  A[开始] --> B[结果]
</pre>
```

代码高亮与 Mermaid 相互独立：只有代码、只有 Mermaid 或二者共存都能运行。运行时会自动创建图容器和半透明的全屏图标按钮；按钮保留本地化的无障碍标签，支持键盘操作，浏览器原生 `Escape` 退出全屏。页面可以通过 CSS 变量调整功能样式，也可以在运行时加载前设置 `window.WALKTHROUGH_MERMAID_CONFIG` 覆盖 Mermaid 配置。

图用于减少理解成本。图太大时拆成相邻的几张图，不靠缩小字号维持“只有一张图”的形式完整。

## 自包含边界

最终文件不依赖 CDN、远程字体或网络脚本。全语言高亮资产约 1 MB，会增加单文件体积；这是离线覆盖能力的明确成本。图片若必须随文件移动，使用内联数据或同时交付的稳定本地路径，并明确说明不是单文件。

不设置强制自动检查。页面重要或交互复杂时，实际打开它，按当前任务风险检查显式语言和自动识别是否着色、关键行是否对齐、Mermaid 是否渲染、全屏是否可用、文字是否清楚、目录是否可导航，以及从头滚动到尾能否走完整条链路；简单页面不为流程完整而制造额外验证。
