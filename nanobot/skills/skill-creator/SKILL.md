---
name: skill-creator
description: 创建、更新、组织和打包 AgentSkills。适用于设计 skill 结构、编写 SKILL.md、添加 scripts/references/assets、校验和打包 .skill 文件的场景。
---

# 技能创建器

本技能用于指导 agent 创建高质量、可复用、低上下文成本的 skills。

## Skill 是什么

Skill 是一个模块化能力包，用来给 agent 提供某个领域、工具或任务的专门知识。它类似“上岗手册”：让通用 agent 在触发后快速掌握特定工作流程、工具用法、约束和可复用资源。

一个好的 skill 通常提供：

1. **专门工作流**：某类任务的稳定步骤。
2. **工具集成说明**：如何使用特定 CLI、API、文件格式或服务。
3. **领域知识**：业务规则、数据结构、公司规范、项目约定。
4. **可复用资源**：脚本、参考文档、模板、图片、字体、样例文件等。

## 核心原则

### 1. 简洁优先

上下文窗口很宝贵。默认假设 agent 已经很聪明，只写它确实不知道、但完成任务必须知道的信息。

写作时不断检查：

- 这段解释是否真的必要？
- 这段内容的 token 成本是否值得？
- 能否用一个短示例代替长解释？

### 2. 合理控制自由度

根据任务稳定性选择不同形式：

- **高自由度**：用文字说明。适合多种方法都可以、需要根据上下文判断的任务。
- **中自由度**：用伪代码或带参数脚本。适合有推荐模式，但允许局部变化的任务。
- **低自由度**：用具体脚本和少量参数。适合脆弱、易错、必须严格一致的流程。

### 3. 渐进披露

Skill 使用三层加载：

1. **metadata**：`name` + `description`，始终在上下文中，用于判断是否触发。
2. **SKILL.md 正文**：skill 触发后加载，应该短而核心。
3. **资源文件**：scripts、references、assets，只有需要时才读取或执行。

原则：`SKILL.md` 放核心流程和导航，细节放 `references/`，可执行逻辑放 `scripts/`，输出模板和素材放 `assets/`。

## 标准目录结构

```text
skill-name/
├── SKILL.md              # 必填
│   ├── YAML frontmatter  # 必填：name、description
│   └── Markdown 正文     # 必填：使用说明
└── 可选资源
    ├── scripts/          # 可执行脚本
    ├── references/       # 需要按需读取的参考文档
    └── assets/           # 输出时使用的模板、图片、字体等资源
```

## SKILL.md 标准写法

### Frontmatter

必须包含：

```yaml
---
name: my-skill
description: 说明这个 skill 做什么，以及在什么场景下必须使用。
---
```

要求：

- `name` 使用 skill 文件夹名。
- `description` 是最重要的触发信息，要写清楚“做什么”和“什么时候用”。
- “什么时候使用”尽量写在 `description` 中，因为正文只有触发后才会加载。
- nanobot 也支持 `metadata` 和 `always`，但仅在确实需要时添加。

### 正文

正文只写触发后完成任务所需的信息：

- 快速开始。
- 标准流程。
- 必要命令。
- 需要读取哪些参考文件。
- 失败处理和安全边界。
- 常见参数和示例。

不要把大量背景故事、安装日记、测试记录放进去。

## 资源目录使用标准

### scripts/

放可执行脚本，适合：

- 同一段代码会反复被重写。
- 任务需要确定性和稳定性。
- 流程脆弱，手写容易出错。

示例：

- `scripts/rotate_pdf.py`
- `scripts/validate_schema.py`
- `scripts/export_report.py`

脚本加入后必须实际运行测试。若脚本很多，至少测试代表性样本。

### references/

放需要按需读取的文档，适合：

- 数据库 schema。
- API 文档。
- 业务规则。
- 公司政策。
- 复杂工作流说明。

如果文档很大，`SKILL.md` 中应说明如何用 `grep` / `glob` 先缩小范围，例如：

- `grep(output_mode="files_with_matches")`
- `grep(output_mode="count")`
- `grep(fixed_strings=true)`
- `glob(entry_type="dirs")`
- `head_limit` / `offset` 分页

避免重复：同一信息不要同时放在 `SKILL.md` 和 `references/`。详细信息优先放参考文件，`SKILL.md` 只做导航。

### assets/

放输出时会用到的资源，不是给 agent 读取上下文用的。

适合：

- PPT 模板。
- DOCX 模板。
- logo、图标、图片。
- 字体。
- 前端模板。
- 样例文件。

## 不要放什么

skill 目录只放支持能力本身的必要文件。不要额外创建：

- `README.md`
- `INSTALLATION_GUIDE.md`
- `QUICK_REFERENCE.md`
- `CHANGELOG.md`
- 与最终能力无关的过程记录

这些文件会增加噪音，让 agent 更难判断真正该读什么。

## 创建流程

按以下步骤创建或更新 skill：

1. 明确 skill 要解决什么问题。
2. 收集具体使用示例。
3. 规划可复用资源：scripts、references、assets。
4. 初始化 skill。
5. 编写或修改资源。
6. 编写 `SKILL.md`。
7. 校验和打包。
8. 基于真实使用继续迭代。

## 命名规则

- 只使用小写字母、数字和连字符。
- 将用户给出的标题规范化为 hyphen-case，例如 `Plan Mode` -> `plan-mode`。
- 名称尽量短，最好动词开头。
- 需要避免混淆时可带工具命名空间，例如 `gh-address-comments`。
- 文件夹名必须和 skill name 完全一致。

## 第 1 步：理解具体示例

只有当使用模式已经非常明确时才跳过这一步。

需要弄清楚：

- 用户会在什么场景下触发这个 skill？
- 用户会怎么说？
- 这个 skill 要完成哪些动作？
- 哪些步骤容易出错？
- 哪些材料可以复用？

例子：

- 图片编辑 skill：用户可能会说“去掉红眼”“旋转图片”“裁剪头像”。
- PDF skill：用户可能会说“旋转这个 PDF”“提取这份 PDF 的文字”。
- BigQuery skill：用户可能会说“今天有多少用户登录”。

不要一次问用户太多问题，优先问最关键的 1-2 个。

## 第 2 步：规划复用资源

对每个具体示例分析：

1. 如果从零完成，需要哪些步骤？
2. 哪些步骤会反复出现？
3. 哪些步骤适合变成脚本？
4. 哪些资料适合放到 references？
5. 哪些模板或素材适合放到 assets？

示例：

- `pdf-editor`：旋转 PDF 需要反复写代码，适合放 `scripts/rotate_pdf.py`。
- `frontend-webapp-builder`：前端项目需要固定模板，适合放 `assets/template/`。
- `big-query`：查询前需要表结构，适合放 `references/schema.md`。

## 第 3 步：初始化 skill

创建新 skill 时，优先运行初始化脚本：

```bash
scripts/init_skill.py <skill-name> --path <output-directory> [--resources scripts,references,assets] [--examples]
```

nanobot 的自定义 skill 应放在当前 workspace 的 `skills/` 目录，例如：

```text
<workspace>/skills/my-skill/SKILL.md
```

示例：

```bash
scripts/init_skill.py my-skill --path ./workspace/skills
scripts/init_skill.py my-skill --path ./workspace/skills --resources scripts,references
scripts/init_skill.py my-skill --path ./workspace/skills --resources scripts --examples
```

初始化脚本会：

- 创建 skill 目录。
- 生成带 frontmatter 的 `SKILL.md` 模板。
- 按需创建资源目录。
- 在 `--examples` 开启时创建示例文件。

初始化后，替换或删除占位文件，只保留真正需要的内容。

## 第 4 步：编辑 skill

编辑时要站在“另一个 agent 使用它”的角度：

- 写非显而易见的流程知识。
- 写清楚边界条件。
- 写可执行命令和参数。
- 写什么时候读哪个 reference。
- 把详细资料移出 `SKILL.md`，避免正文过长。

### 推荐参考模式

- 多步骤流程：用有序步骤和必要分支。
- 输出格式严格的任务：给模板和正反例。
- 多框架/多供应商任务：正文只写选择规则，细节放各自 reference。

### 编写 frontmatter

`description` 要同时包含：

- skill 的能力。
- 触发场景。
- 用户可能的意图。

示例：

```yaml
---
name: docx
description: 创建、编辑和分析 .docx 专业文档，支持格式保留、批注、修订、文本抽取和模板生成。适用于用户要求处理 Word 文档、生成报告、修改内容或审阅文档的场景。
---
```

## 第 5 步：校验和打包

完成后运行打包脚本。打包会先自动校验：

```bash
scripts/package_skill.py <path/to/skill-folder>
```

指定输出目录：

```bash
scripts/package_skill.py <path/to/skill-folder> ./dist
```

校验内容包括：

- YAML frontmatter 是否正确。
- 必填字段是否存在。
- skill 名称和目录结构是否符合规范。
- description 是否足够清楚。
- 文件组织和资源引用是否合理。

通过后会生成 `.skill` 文件，例如 `my-skill.skill`。该文件本质上是 zip 包，只是扩展名为 `.skill`。

安全限制：如果目录中存在 symlink，打包会失败。

## 第 6 步：真实使用后迭代

skill 创建后要通过真实任务验证。

迭代流程：

1. 在真实任务中使用 skill。
2. 观察 agent 卡在哪里、误读了什么、重复做了什么。
3. 判断是需要改正文、补 reference，还是把流程变成 script。
4. 修改后重新测试。

## 常见质量检查清单

交付前检查：

- `description` 是否能让 agent 正确判断触发时机。
- `SKILL.md` 是否足够短，只包含核心流程。
- 大段细节是否已移入 `references/`。
- 反复执行的代码是否已移入 `scripts/`。
- 输出模板、图片、字体等是否已移入 `assets/`。
- 脚本是否实际运行过。
- 文件夹名是否与 `name` 一致。
- 是否避免了 README、安装记录、无关日志等噪音文件。

## 简短示例

```text
my-skill/
├── SKILL.md
├── scripts/
│   └── validate_input.py
├── references/
│   └── api-schema.md
└── assets/
    └── report-template.docx
```

`SKILL.md` 示例：

```markdown
---
name: my-skill
description: 处理某类固定业务任务。适用于用户要求校验输入、调用指定 API 并生成报告的场景。
---

# My Skill

## 流程

1. 先读取 `references/api-schema.md` 确认字段。
2. 运行 `scripts/validate_input.py` 校验输入。
3. 按模板生成结果。

## 注意事项

- 不要猜测缺失字段。
- 校验失败时先向用户说明问题。
```
