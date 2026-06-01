# TRPG GraphRAG 三层 Skills 拆分文件

本压缩包包含【角色构建层】、【内容实体层】、【叙事运行层】的系统 Skill Markdown 文件与对应 GraphRAG JS 文件。

## 文件结构

- `02_角色构建层/skills/`：角色构建层各系统 Skill
- `02_角色构建层/graphRAG/role_construction_graphRAG.js`：角色构建层 GraphRAG 存储示例
- `03_内容实体层/skills/`：内容实体层各系统 Skill
- `03_内容实体层/graphRAG/content_entity_graphRAG.js`：内容实体层 GraphRAG 存储示例
- `04_叙事运行层/skills/`：叙事运行层各系统 Skill
- `04_叙事运行层/graphRAG/narrative_runtime_graphRAG.js`：叙事运行层 GraphRAG 存储示例

## 使用方式

1. 先根据目标层级进入对应文件夹。
2. 若需要生成某个系统的 logic，读取该系统对应的 `Skill_XX_系统名.md`。
3. 若需要进行术语映射、系统检索或图谱存储，读取对应 `graphRAG/*.js` 文件。
4. 若一个 ACGN 术语同时对应多个系统，应保留原术语，并在 GraphRAG 中建立多重映射。
