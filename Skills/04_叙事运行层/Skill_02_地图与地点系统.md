# 叙事运行层：地图与地点系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【地图与地点系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "叙事运行层"
  target_system: "地图与地点系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "地图与地点系统"
    source_terms: []
    normalized_terms: []
    core_objects: []
    attributes: []
    constraints: []
    dependencies: []
    state_changes: []
    graph_nodes: []
    graph_edges: []
    execution_notes: []
```

## 4. 术语兼容规则

当传入内容来自不同 ACGN 作品时，系统应优先识别语义功能，而不是强制要求术语完全一致。

可映射到本系统的常见近似术语包括：地图、地点、区域、城市、村庄、副本、地牢、据点、遗迹、关卡、场景地图。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【地图与地点系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 地点名称
- 地点类型
- 所属区域
- 相邻地点
- 进入条件
- 危险等级
- 环境
- NPC
- 遭遇
- 可获取物

## 6. 核心属性字段

- location_id
- location_name
- location_type
- parent_region
- adjacent_locations
- entry_condition
- danger_level
- environment_tags
- npcs
- encounters
- loot
- explored_state

## 7. 依赖关系

- 世界观系统
- 环境实体系统
- 遭遇实体系统
- NPC 实体系统
- 探索与旅行系统
- 任务系统

## 8. 处理流程

1. 读取作品中的地图、区域、城镇、副本、地牢和特殊地点。
2. 抽取层级归属、邻接关系、进入条件、危险等级和可交互内容。
3. 判断地点是否触发探索、遭遇、任务或休息规则。
4. 建立地点与 NPC、环境、遭遇、奖励和任务的连接。
5. 输出 location_logic，用于导航与场景生成。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "地图与地点系统"
  - type: "SourceTerm"
    name: "原作品术语"
  - type: "NormalizedTerm"
    name: "标准化术语"
  - type: "LogicObject"
    name: "系统内对象"
  - type: "Constraint"
    name: "限制条件"
  - type: "StateChange"
    name: "状态变化"
  - type: "SourceText"
    name: "来源文本"
```

## 10. GraphRAG 边建议

- Region CONTAINS Location
- Location CONNECTS_TO Location
- Location CONTAINS NPCEntity
- Location CONTAINS EncounterEntity
- Location HAS_ENVIRONMENT EnvironmentEntity

## 11. 输出 Logic 模板

```yaml
地图与地点系统_logic:
  canonical_system: "地图与地点系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "地图与地点系统"
      reason: ""
  core_objects:
    - object_id: ""
      object_name: ""
      object_type: ""
      source_term: ""
      normalized_term: ""
  attributes:
    - key: ""
      value: ""
      source: ""
  constraints:
    - condition: ""
      effect: ""
      priority: "general | special | exception"
  dependencies:
    - depends_on_system: ""
      relation: ""
  state_changes:
    - trigger: ""
      before: ""
      after: ""
  graph_nodes:
    - node_id: ""
      node_type: ""
      label: ""
  graph_edges:
    - from: ""
      relation: ""
      to: ""
  execution_notes:
    - ""
```

## 12. 自检要求

生成 logic 前应检查：

1. 是否保留了原作品术语。
2. 是否建立了标准化术语映射。
3. 是否区分了静态设定、动态状态与规则逻辑。
4. 是否声明了跨系统依赖。
5. 是否避免把纯叙事描述误判为硬规则。
6. 是否能够被 GraphRAG 作为节点与边继续调用。
