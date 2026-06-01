# Elden Ring TRPG World Base

本 zip 是基于仓库 `StarFiddler/TRPG_Agent` 的 `Skills/01_规则执行层`、`Skills/02_角色构建层`、`Skills/03_内容实体层`、`Skills/04_叙事运行层` 四个目录下 48 个 Skill 文件执行生成的 `world_base`。

## 输入参数

`艾尔登法环及该游戏相关的所有wiki等参考链接`

## 输出内容

- `systems/01_规则执行层/`：12 个规则执行 logic，含 YAML 与 JSON。
- `systems/02_角色构建层/`：12 个角色构建 logic，含 YAML 与 JSON。
- `systems/03_内容实体层/`：12 个内容实体 logic，含 YAML 与 JSON。
- `systems/04_叙事运行层/`：12 个叙事运行 logic，含 YAML 与 JSON。
- `graph/`：四层 GraphRAG 路由实例、节点与边。
- `tables/`：术语映射表与核心游玩术语表。
- `world_base_bundle.json`：完整整合版 world_base。
- `skill_execution_manifest.json`：Skill 读取与输出清单。
- `input_sources.json`：传入资料源与后续核对入口。
- `audit/self_check.md`：自检结果与限制说明。

## 使用方式

1. 当输入是玩家行动时，先进入 `graph/00_master_router_elden_ring_instance.json` 判断属于哪一层。
2. 再根据具体术语检索对应 `systems/<layer>/<skill>.yaml`。
3. 若涉及道具、掉落、NPC位置、任务触发或DLC条目，按 `input_sources.json` 中的 Wiki 入口逐项核对。
4. 运行时结果应写回 `战役状态系统` 与 `角色状态快照系统`。

## 重要限制

本文件包生成的是 TRPG 可运行的 world_base 结构与 GraphRAG logic 底座，不是对所有 Wiki 页面进行逐条爬取后的完整资料镜像。涉及固定掉落、固定地点、NPC任务线和Boss奖励时，应继续使用 Wiki 条目进行逐项核验。
