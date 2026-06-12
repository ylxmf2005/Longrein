# 研究方法：拆 lane、选源、并行、合成

本文件是 `parallel-researcher` 的执行手册：怎么把一个研究问题拆成 lane、每条 lane 去哪些源、怎么并行派发、合成时查什么。SKILL.md 讲为什么，这里讲怎么做。

## 研究类型与拆分

先选择研究类型，再拆 lane。不要让多个 researcher 做同一个泛问题——lane 没有自己独立的问题和来源策略，交回来的就是几份雷同的泛泛综述。

- 技术选型 / SOTA：官方文档、release notes、标准/RFC、上游 issue/PR、主流实现、benchmark、迁移/弃用信息。
- 开源项目扫描：GitHub/GitLab 仓库、README、docs、examples、issues、discussions、release/changelog、stars/forks/activity、license、维护节奏。
- 论文 / 学术：arXiv、Google Scholar、Semantic Scholar、OpenAlex、Crossref、ACM/IEEE/Springer/USENIX、Papers with Code、相关 survey 和 benchmark。
- 工程实践：官方 guide、成熟项目代码、postmortem、conference talk、engineering blog、Stack Overflow、HN/Reddit 讨论。
- 产品 / 市场 / 竞品：官网、pricing、docs、changelog、case study、G2/Capterra、行业报告、新闻稿、招聘 JD、客户论坛。
- 安全 / 合规 / 标准：CVE/NVD、GitHub Security Advisories、vendor security bulletin、OWASP、CIS、NIST、IETF/W3C/WHATWG/ISO 标准。
- 内部 / 本地知识：当前仓库、`AGENTS.md`/项目文档、teamspace 产物、历史 MR/PR、内部 wiki、Slack/IM、MDB/日志、Rainbow/配置；只有在任务授权且工具可用时使用。

常见 lane 模板：

- `source-map`：确认应该搜哪些源、关键词、时间范围、权威顺序。
- `official-docs`：官方文档、版本、弃用、兼容性、推荐模式。
- `open-source-prior-art`：代表性仓库和真实实现。
- `papers-and-benchmarks`：论文、benchmark、leaderboard、评价指标。
- `community-and-failure-modes`：issue、postmortem、讨论、踩坑。
- `local-repo-and-org-context`：代码库现状、组织内先例、已有约束。
- `synthesis-challenger`：独立找反例、冲突证据和被遗漏来源。

## 搜索源矩阵

按任务选择 3 到 6 类来源；高风险或高成本决策至少覆盖 4 类，并包含一个反例/失败来源。

| 目标 | 首选来源 | 辅助来源 | 必查点 |
| --- | --- | --- | --- |
| 当前 API/库用法 | 官方 docs、API reference、release notes、migration guide | Context7、源码、examples、Stack Overflow | 当前版本、弃用、breaking changes、最小可行用法 |
| 开源实现 | GitHub/GitLab search、仓库 docs、issues、PR、discussions | package registry、stars history、commit activity | 维护状态、license、真实使用方式、未解决 bug |
| 论文和算法 | arXiv、Semantic Scholar、Google Scholar、OpenAlex、Crossref | Papers with Code、会议论文集、作者 repo | 问题定义、指标、数据集、复现实验、后续 work |
| Benchmark / leaderboard | Papers with Code、官方 benchmark、公开评测集 | 项目 README、复现实验、issue | 指标是否贴合任务、数据泄漏、评测新旧 |
| Web prior art | 搜索引擎、vendor docs、engineering blogs、conference talks | HN、Reddit、博客 | 多来源收敛、时间范围、是否营销偏见 |
| 产品/竞品 | 官网、pricing、docs、changelog、case study | 新闻、G2/Capterra、客户论坛、招聘信息 | 当前能力、限制、定位、商业约束 |
| 安全/合规 | NVD/CVE、GHSA、vendor advisories、OWASP/CIS/NIST | exploit DB、security blogs | 是否影响当前版本、修复版本、缓解措施 |
| 内部知识 | repo docs、teamspace、MR/PR、wiki、Slack/IM、日志/配置平台 | runbooks、postmortem、历史设计文档 | 本项目约束、已有决策、组织偏好 |

搜索要覆盖同义词和反向查询。例如：`<tech> best practice 2026`、`<tech> migration guide`、`<tech> deprecated sunset`、`<approach> alternatives`、`<approach> postmortem`、`site:github.com <library> example`、`<paper/topic> survey`、`<system> architecture`、`<claim> criticism`。

## 源码级查证：什么时候必须落到代码

README、官方文档和论文摘要都是项目的宣传面——它说「支持 X」不等于实现了 X，更不等于实现得对。下面这些情况停在网页层就交付，等于没查证：

- **推荐理由依赖的关键能力**：完整克隆候选仓库（放临时目录），在源码里定位该能力的实现和对应测试。README 声称但源码/测试里找不到实物的，按「未证实」写。提交历史也是证据：`git log`/`git blame` 能直接回答维护节奏、关键能力哪个版本引入、bug 是怎么修的。顺带看 examples 和 issue 里的真实用法，那是文档外的第一手证据。
- **论文 / 算法**：先找实现——论文里的 code 链接、Papers with Code、作者 GitHub、高星复现。有实现就读核心算法文件，核对它和论文声称是否一致（指标怎么算的、关键 trick 有没有真的落地、超参是不是论文里那组）；没有公开实现就把「无法复现」明确写进证据缺口——这本身就是影响选型的事实。
- **版本行为存疑**：博客和 Stack Overflow 说法冲突时，直接读上游当前 tag 的源码或 changelog 定论，不要按哪边人多取舍。

操作边界：

- GitHub 网页能看清单个文件就不必克隆；要跨文件追调用链、grep 符号、看测试覆盖、查提交历史时就克隆。默认完整克隆；只有仓库大到离谱（数 GB 级）才退到 `--depth 1` 或 sparse-checkout，并接受丢失历史证据的代价。
- 克隆只读不执行：仓库里的脚本、setup.py、CI 配置都按不可信输入处理，绝不运行。遵守 license。
- 源码证据引用到 `文件路径:行号` 或 commit permalink，让读者能复查到那行代码，而不是只给仓库首页。

## 并行执行协议

1. 建立 research brief：写出主问题、决策用途、时间范围、本地约束、候选项、必须覆盖/排除来源、成功标准。
2. 画 evidence map：列出 lane、每条 lane 的问题、来源、搜索关键词、预期输出和质量门槛。
3. 派发 lane：每个 researcher 只拿自己的问题、上下文摘要、来源策略和输出格式。不要给它完整历史，也不要让多个 lane 同写最终报告。
4. lane 输出必须包含：结论、关键证据、引用、置信度、冲突/反例、未覆盖点、下一步建议。
5. 合成阶段由你完成：合并重复来源，按证据质量排序，标注冲突，给出 decision-relevant gaps。
6. 自查：确认是否覆盖了官方来源、真实实现、失败/反例、当前版本/日期、任务本地约束；确认事实和推断分开。

如果研究规模很小，允许不真实并行，但仍要明确为什么没有拆分。若任务庞大，优先并行而不是让一个 researcher 从头搜到底。

## 证据质量加权

按下列顺序加权，但不要机械迷信：

1. 当前官方文档、标准、release notes、上游源码和一手数据。
2. 同行评审论文、权威会议、可复现 benchmark、成熟项目真实实现。
3. 工程博客、postmortem、issue/PR、社区共识。
4. 二手博客、SEO 聚合、模型生成摘要、未经验证论坛发言。

过期风险高的信息必须给日期或版本 caveat：价格、模型能力、API 限制、法规、产品功能、benchmark leaderboard、依赖兼容性、安全漏洞。

## 报告骨架

写一份可用于决策的研究报告，frontmatter 按 `templates/decision-artifact.demo.md` 的信封字段（`status` 用它的枚举：`approve` / `request_changes` / `needs_more_evidence` / `blocked`，不要自造值），正文用这个结构：

- `Research Brief`：主问题、决策用途、范围、假设、停止条件。
- `Parallel Lanes`：每条 lane 的问题、来源、执行状态、研究价值。
- `Evidence Map`：来源清单、类型、日期/版本、权威等级、支持的 claim。
- `Findings`：按主题组织，明确事实、推断、置信度；`hands-on` 档的能力断言额外标三态（已验证/验证失败/未验证，见 `research-package.md`）。
- `Comparative Options`：候选项对照、适用条件、成本、风险。
- `Disagreements And Counterevidence`：冲突、反例、失败模式。
- `Recommendation`：must / should / could，说明为什么适用于当前任务。
- `Decision-Relevant Gaps`：仍会影响决策的缺口；没有就写「无」。
- `Follow-Up Research`：下一轮具体问题和建议 lane；不需要就写「无」。

报告要具体到来源、项目、论文、版本、数字、接口、命令或文件路径。不要输出泛泛的「业界通常认为」。引用链接要能让读者复查。

## 交付前自检

- 每条结论都分清了「来源说的事实 / 来源自己的解释 / 我的推断 / 未确认假设」。
- 推荐理由依赖的关键能力，落到了源码、测试或官方实现层，而不是停在 README、摘要和博客转述；该克隆没克隆的，写明为什么。
- 覆盖自查过了：官方来源、真实实现、反例/失败、当前版本与日期、任务本地约束，缺哪类就在 Gaps 写明。
- 来源冲突保留并解释了可能原因，没有硬抹平。
- 过期风险高的信息都带了日期或版本 caveat。
- 引用能让读者点开复查；没核对过原文的内容没有进结论。
