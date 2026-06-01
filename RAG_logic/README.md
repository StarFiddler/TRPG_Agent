# EldenRing_TRPG_world_base

本包为 `EldenRing_TRPG_world_base_rule_execution.zip` 与 `EldenRing_TRPG_world_base_layers_02_03_04.zip` 的整合修正版。

## 整合范围

- `01_规则执行层`：已整合至 `layers/01_rule_execution/`
- `02_角色构建层`：保留于 `layers/02_character_construction/`
- `03_内容实体层`：保留于 `layers/03_content_entity/`
- `04_叙事运行层`：保留于 `layers/04_narrative_runtime/`

## 主文件

- `world_base.json`：四层整合后的主 world_base
- `integrated_world_base_01_04.json`：四层整合版兼容文件
- `index/interlayer_graph.json`：跨层 GraphRAG 连接图
- `index/layer_system_index.json`：四层系统索引
- `index/source_package_index.json`：源包整合记录
- `MANIFEST.json`：文件清单与 SHA256 校验

## 运行约束

保留上一版已经确定的 Elden Ring TRPG 事实与硬约束。固定地点、固定掉落、NPC 关系、Boss、商人库存、任务线与地图归属，仍需在运行时回查 Wiki 并写入 `source_trace`。
