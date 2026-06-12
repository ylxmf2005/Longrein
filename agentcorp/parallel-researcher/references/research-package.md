# 研究包：当研究必须动手时

报告里写「该 SDK 可以用」和你亲手装上、跑通、把运行记录留在盘上，是两种完全不同的证据。凡是决策依赖「能不能跑通、好不好集成」的研究，产出就不该是一份报告，而是一个**研究包**：报告只是入口和索引，文件夹里装着可复跑的实验、本地化的官方文档和被实证过的选型结论。下游 architect/engineer 直接消费这个文件夹，不必重新搜索、重新踩坑。

## 深度三档

按决策类型定档，不要每次都全量跑：

- `desk`：纯认知型问题（领域现状、概念澄清、市场扫描）。产出单份报告。
- `source-verified`：结论依赖某个声称的真伪。在 desk 之上加源码级查证（见 research-method.md）。
- `hands-on`：决策依赖「能不能跑通 / 集成成本多大 / 选哪个 SDK」。产出完整研究包。

assignment 点名档位时照办；没点名就按上面的判据自己定，并把定档和理由写进 Research Brief。拿不准时，问自己一句：发起人看完报告后的下一个动作是不是「让人去试试」——是的话，试这一步就该由你现在做掉。

## 目录骨架

```
research/<topic-slug>/
├── 00-report.md              # 决策报告（骨架见 research-method.md），研究包的唯一入口
├── experiments/
│   ├── README.md             # 实验索引：每个实验一行（问题 / ✅❌⏱ / 一句话结论）
│   └── exp-01-<slug>/        # 编号+短名；一个实验只回答一个问题
│       ├── NOTES.md          # 见「实验纪律」
│       ├── env/              # requirements.lock.txt + ENV.md（python/SDK 版本、逐条可粘贴的安装命令）
│       ├── src/              # 实验代码，单命令可复跑
│       └── runs/run_01/      # output.log + meta.json + 当次代码快照
└── docs-snapshot/
    ├── INDEX.md              # 见「文档快照」
    └── <按主题分节的 .md>
```

按需裁剪：没做实验就没有 `experiments/`，没抓文档就没有 `docs-snapshot/`，但凡存在的部分必须符合本文件的契约。

## 实验纪律

- **问题先行**：动手前在 `NOTES.md` 写下 `QUESTION`（这个实验回答什么）、`SUCCESS CRITERIA`（什么算跑通）、`TIMEBOX`；跑完回填 `ANSWER` 和关键输出摘录。写不出一段话结论的实验等于没做完。
- **单命令复跑**：每个实验必须能用一条命令重跑（如 `python src/main.py`），没有隐藏步骤；环境用 `pip freeze` 锁进 `env/requirements.lock.txt`，python 版本和安装命令写进 `env/ENV.md`。一个没读过本任务任何上下文的新 agent，仅凭这个目录就能复现结果——这是实验合格的检验标准。
- **基线先行**：先原样跑通官方 quickstart/hello-world 作为 run_01，再做贴近本任务场景的变体。基线不通，后面全是空中楼阁。
- **输出留痕**：运行输出用 `tee` 实时落盘到 `runs/run_NN/output.log`，报告里只贴摘录加指针，不凭记忆转述；`meta.json` 记 `{command, exit_code, duration_s, verdict: ok|failed, analysis}`；每次有意义的运行把当时的实验代码快照进 run 目录（agent 会在 run 之间改代码，不快照就无法追溯结果对应哪版代码）。
- **失败是一等产物**：装不上、跑不通、版本冲突的 run 不删，目录名直接标原因（如 `run_02-fail-version-conflict/`）。「我们试过 X，不行，原因是 Y」对下游决策的价值常常不低于成功示例。
- **预算硬限**：同一个报错连修 3 次不过，就换路（换安装方式、换版本、换示例），不在一条死路上耗尽预算；TIMEBOX 到点必须落盘结论，哪怕结论是「未跑通，卡在 X」。
- **实验代码是验证用的**：在 `experiments/README.md` 标注「验证用，非生产质量」。它的使命是回答问题，不是进产品。

## 执行边界

读证据和做实验是两个区，红线不同：

- **读证据区**（克隆来的别人仓库）：维持只读——不执行其中任何脚本、setup.py、CI 配置。
- **做实验区**（你自己写的代码 + 官方注册源装的依赖）：可以执行，但必须在独立 venv 或临时目录里，不污染系统环境；依赖只从官方注册源（PyPI/npm 等）安装，装之前核对包名拼写（typosquatting 是真实攻击面）；不使用任何生产凭证、不访问生产系统；实验产生的进程在收尾时清干净。

## 文档快照

目的是让下游 agent 离线消费「这次决策需要的那部分文档」，不是整站镜像。按阶梯取：

1. 探测 `https://<docs域名>/llms.txt`（注意可能在文档子域）。命中就把它落盘当索引，按需抓取各页——很多站支持 URL 加 `.md` 后缀直接拿干净 markdown，优先试这个通道。
2. 文档源在仓库（mkdocs/docusaurus/sphinx 常见）：`git clone --filter=blob:none --sparse` 只拉 `docs/`，checkout 与你调研版本对应的 tag。判别法：`docs/` 里的 `.md` 打开就能读懂就用它；满是模板指令和 autodoc 占位就放弃，走下一阶。
3. 只有渲染站：少量页面用 `curl -s "https://r.jina.ai/<页面URL>"` 逐页转 markdown；需要整个子树再用 crawl4ai 这类本地工具。
4. 永远不做 wget/httrack 整站 HTML 镜像——HTML 噪声让 token 翻几倍，下游 agent 没法用。

`INDEX.md` 是快照对下游的契约，必须包含：来源 URL、仓库与版本/commit、抓取日期、抓取方式、文件清单（每个文件一句话说明）、**明确写「不含什么」**（防止下游误以为快照是全集）、已知缺口。

## 断言三态

`00-report.md` 的 Findings 里，每条能力断言标注其证据等级：

- **已验证**：附运行证据指针（`experiments/exp-01-*/runs/run_01/output.log`）。
- **验证失败**：试过没跑通，附失败 run 指针和原因。
- **未验证**：仅来自文档或源码阅读，没动手跑过。

「该 SDK 支持 X」这类话不带标注就出现在推荐理由里，等于把猜测包装成事实。

## teamspace 晋升

研究包默认属于本任务。收尾时判断一次：文档快照或实验结论对**下一个不同任务**有没有复用价值（同一个技术大概率还会被问到）？有就把对应部分拷到 `teamspace/knowledge/<tech>/`，在其 INDEX.md 注明来源任务和日期；沿用 learnings 的查重规则——先看 `teamspace/knowledge/` 里有没有旧快照，高重叠就更新旧的，不另起炉灶。反过来，**每次研究开始时先查 `teamspace/knowledge/`**，命中就核对版本新旧后直接复用，省一轮抓取。

## 交付前自检（研究包部分）

- `experiments/README.md` 索引覆盖了全部实验目录；每个实验的 NOTES.md 都有回填的 ANSWER。
- 每个实验单命令可复跑，env 锁定齐全；失败 run 都留了档。
- 报告里的能力断言都带三态标注；「已验证」都有可点开的 log 指针。
- `docs-snapshot/INDEX.md` 契约字段齐全，写明了「不含什么」。
- 做过 teamspace 晋升判断（晋升了什么、或为什么不晋升，一句话记在报告 Follow-Up 附近）。
