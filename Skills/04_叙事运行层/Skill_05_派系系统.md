# 叙事运行层：派系系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【派系系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "叙事运行层"
  target_system: "派系系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "派系系统"
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

可映射到本系统的常见近似术语包括：派系、势力、组织、阵营、国家、公会、教会、学院、商会、军团、家族。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【派系系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 派系名称
- 目标
- 资源
- 领地
- 成员
- 盟友
- 敌人
- 声望
- 任务
- 禁忌
- 冲突

## 6. 核心属性字段

- faction_id
- faction_name
- goals
- resources
- territory
- members
- allies
- enemies
- reputation
- quests
- taboos
- conflicts
- current_state

## 7. 依赖关系

- 世界观系统
- NPC 实体系统
- 任务系统
- 冲突系统
- NPC 与关系网络系统
- 地图与地点系统

## 8. 处理流程

1. 识别作品中的国家、组织、阵营、家族、公会、教会或敌对势力。
2. 抽取目标、资源、成员、领地、盟友、敌人和禁忌。
3. 记录玩家与派系的声望和态度变化。
4. 建立派系与地点、NPC、任务、冲突之间的关系。
5. 输出 faction_logic，用于世界动态和社交后果。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "派系系统"
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

- Faction CONTROLS Location
- NPCEntity BELONGS_TO Faction
- Faction ALLIED_WITH Faction
- Faction OPPOSES Faction
- Faction OFFERS Quest

## 11. 输出 Logic 模板

```yaml
派系系统_logic:
  canonical_system: "派系系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "派系系统"
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
