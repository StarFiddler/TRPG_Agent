# 叙事运行层：NPC 与关系网络系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【NPC 与关系网络系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "叙事运行层"
  target_system: "NPC 与关系网络系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "NPC 与关系网络系统"
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

可映射到本系统的常见近似术语包括：关系、好感、信任、敌意、羁绊、社交关系、人物关系、亲密度、仇恨、阵营态度。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【NPC 与关系网络系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 关系双方
- 关系类型
- 关系强度
- 当前态度
- 历史事件
- 改善条件
- 恶化条件
- 隐藏关系
- 欺骗关系

## 6. 核心属性字段

- relationship_id
- actor_a
- actor_b
- relationship_type
- strength
- attitude
- history
- improve_conditions
- worsen_conditions
- hidden
- deception

## 7. 依赖关系

- NPC 实体系统
- 社交互动系统
- 派系系统
- 任务系统
- 战役状态系统

## 8. 处理流程

1. 读取角色互动、剧情事件和 NPC 档案。
2. 抽取 NPC 与玩家、NPC 与 NPC、NPC 与派系之间的关系。
3. 记录态度、强度、历史原因和改变条件。
4. 判断关系如何影响社交难度、任务触发和派系反应。
5. 输出 relationship_logic，用于长期社交记忆。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "NPC 与关系网络系统"
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

- Actor HAS_RELATION_WITH Actor
- Relationship AFFECTS SocialCheck
- Relationship MODIFIED_BY Event
- Relationship TRIGGERS Quest
- Relationship HIDDEN_FROM Character

## 11. 输出 Logic 模板

```yaml
NPC 与关系网络系统_logic:
  canonical_system: "NPC 与关系网络系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "NPC 与关系网络系统"
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
