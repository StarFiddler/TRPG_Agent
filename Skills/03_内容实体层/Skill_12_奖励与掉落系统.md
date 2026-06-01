# 内容实体层：奖励与掉落系统 Skill

## 1. Skill 定位

本 Skill 用于从任意 ACGN 作品名称、Wiki 文档、规则文本、设定集、角色档案、战役记录或自制设定中，抽象生成【奖励与掉落系统】对应的系统 logic。它不直接照搬某一作品的固有术语，而是将不同作品中的近似概念映射到同一套可复用的 TRPG GraphRAG 逻辑结构中。

## 2. Input

```yaml
input:
  source_type: "ACGN作品名称 | wiki文档 | 规则文本 | 设定集 | 角色档案 | 战役记录 | 自制模组"
  source_content: "作品名称、文本、URL摘要、Wiki条目、规则片段或人工整理资料"
  target_layer: "内容实体层"
  target_system: "奖励与掉落系统"
  abstraction_level: "high | middle | low"
  terminology_policy: "保留原术语 + 建立标准化别名映射"
  output_format: "logic"
```

## 3. Output

```yaml
output:
  system_logic:
    canonical_system: "奖励与掉落系统"
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

可映射到本系统的常见近似术语包括：奖励、掉落、战利品、经验、金币、素材、道具获取、声望奖励、剧情奖励、解锁、成就。

映射原则如下：

1. 若某术语描述的是同一类规则功能，则归入【奖励与掉落系统】。
2. 若原作品存在专有名称，应保留 source_term，同时生成 normalized_term。
3. 若术语跨系统，例如既影响角色成长又影响战斗执行，应在 graph_edges 中建立跨系统引用。
4. 若原作品没有显性规则，应根据文本中体现的功能、限制、代价、成长或状态变化进行抽象。

## 5. 核心抽象对象

- 奖励名称
- 奖励类型
- 获取条件
- 来源
- 概率
- 稀有度
- 任务绑定
- 地点绑定
- 是否可重复
- 剧情影响

## 6. 核心属性字段

- reward_id
- reward_name
- reward_type
- acquire_condition
- source
- drop_rate
- rarity
- quest_link
- location_link
- repeatable
- narrative_impact

## 7. 依赖关系

- 遭遇实体系统
- 敌对单位与怪物系统
- 任务系统
- 等级成长系统
- 装备构建系统
- 派系系统

## 8. 处理流程

1. 读取作品中的经验、金币、装备、素材、声望、剧情解锁或任务奖励。
2. 判断奖励是固定获取、随机掉落、条件解锁还是剧情后果。
3. 抽取获取条件、来源、概率、稀有度和可重复性。
4. 建立奖励与遭遇、怪物、任务、地点和角色成长的连接。
5. 输出 reward_entity logic，用于战利品与进度管理。

## 9. GraphRAG 节点建议

```yaml
nodes:
  - type: "System"
    name: "奖励与掉落系统"
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

- RewardEntity DROPPED_BY CreatureEntity
- RewardEntity GRANTED_BY Quest
- RewardEntity FOUND_AT Location
- RewardEntity UNLOCKS Feature
- RewardEntity AFFECTS Reputation

## 11. 输出 Logic 模板

```yaml
奖励与掉落系统_logic:
  canonical_system: "奖励与掉落系统"
  source_terms:
    - term: ""
      source_context: ""
      confidence: 0.0
  normalized_terms:
    - term: ""
      mapped_to: "奖励与掉落系统"
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
