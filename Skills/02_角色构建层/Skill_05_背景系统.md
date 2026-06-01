# 角色构建层：背景系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【背景系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "角色构建层"
  target_system: "背景系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "背景系统"
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

可映射到本系统的常见近似术语包括：背景、出身、履历、过去经历、身份、社会阶层、所属组织、前职业、个人历史。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【背景系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 背景名称
- 社会身份
- 过往经历
- 人脉
- 背景特性
- 起始资源
- 秘密
- 剧情钩子

## 6. 核心属性字段

- background_id
- background_name
- identity
- history_tags
- granted_skills
- granted_tools
- contacts
- starting_items
- secrets
- plot_hooks
- reputation

## 7. 依赖关系

- 技能与熟练系统
- 装备构建系统
- NPC与关系网络系统
- 派系系统
- 任务系统

## 8. 处理流程

1. 读取角色档案、设定集或 Wiki 中描述过往身份的内容。
2. 判断这些内容是否提供熟练、人脉、资源、声望或剧情钩子。
3. 将背景拆解为可被规则调用的能力来源与叙事入口。
4. 建立背景与 NPC、派系、任务、地点之间的关系。
5. 输出 background logic，用于解释角色社会身份与剧情连接。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "背景系统"
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

- Character HAS_BACKGROUND Background
- Background GRANTS Proficiency
- Background CONNECTS_TO NPC
- Background AFFECTS Reputation
- Background TRIGGERS QuestHook

## 11. 输出 Logic 模板

```yaml
背景系统_logic:
  canonical_system: "背景系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "背景系统"
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
