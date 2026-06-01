// RuleExecutionGraphRAG.js
// 规则执行层 GraphRAG 存储结构
// 用途：将不同 ACGN 作品中的近似规则术语归一化到统一 system logic，供 GraphRAG 检索、依赖展开与状态写回使用。

export const RuleExecutionGraphRAG = {
  graphName: "规则执行层 GraphRAG",
  purpose: "存储术语归一化结果、系统 logic、规则依赖关系、触发条件、例外关系和当前状态写回关系。",
  inputScope: [
    "任意ACGN作品名称",
    "wiki文档",
    "规则书文本",
    "角色卡",
    "战斗记录",
    "GM自制规则",
    "战役状态"
  ],
  nodeTypes: {
    TermNode: "作品原始术语节点",
    CanonicalTermNode: "归一化术语节点",
    SkillNode: "规则系统生成Skill节点",
    LogicNode: "系统logic节点",
    TriggerNode: "触发条件节点",
    ActorNode: "行动发起者节点",
    TargetNode: "行动目标节点",
    ResourceNode: "资源节点",
    StatusNode: "状态节点",
    ModifierNode: "修正来源节点",
    DifficultyNode: "难度节点",
    ExceptionNode: "例外规则节点",
    SourceNode: "来源文本节点",
    StateWritebackNode: "状态写回节点"
  },
  skillNodes: [
  "Skill_CheckLogic",
  "Skill_ContestLogic",
  "Skill_ActionEconomyLogic",
  "Skill_AttackDefenseLogic",
  "Skill_DamageHealingLogic",
  "Skill_StatusLogic",
  "Skill_ResourceLogic",
  "Skill_RestRecoveryLogic",
  "Skill_ExplorationTravelLogic",
  "Skill_SocialInteractionLogic",
  "Skill_AbilityExecutionLogic",
  "Skill_RulePriorityLogic"
],
  logicNodes: [
  "CheckLogic",
  "ContestLogic",
  "ActionEconomyLogic",
  "AttackDefenseLogic",
  "DamageHealingLogic",
  "StatusLogic",
  "ResourceLogic",
  "RestRecoveryLogic",
  "ExplorationTravelLogic",
  "SocialInteractionLogic",
  "AbilityExecutionLogic",
  "RulePriorityLogic"
],
  canonicalTermMap: {
  "CheckLogic": [
    "检定",
    "判定",
    "测试",
    "挑战",
    "试炼",
    "属性判定",
    "技能判定",
    "命中判定",
    "成功率判定",
    "难度判定",
    "抗性判定",
    "豁免",
    "意志抵抗",
    "精神抵抗",
    "体质抵抗",
    "命运判定"
  ],
  "ContestLogic": [
    "对抗",
    "比拼",
    "较量",
    "抵抗",
    "豁免",
    "压制",
    "招架",
    "闪避",
    "看破",
    "识破",
    "反制",
    "突破",
    "破防",
    "精神抵抗",
    "意志对抗",
    "隐匿对察觉",
    "欺瞒对洞察"
  ],
  "ActionEconomyLogic": [
    "行动点",
    "AP",
    "主行动",
    "副行动",
    "附赠行动",
    "反应",
    "回合",
    "轮次",
    "冷却",
    "读条",
    "准备动作",
    "延迟行动",
    "移动",
    "物品交互"
  ],
  "AttackDefenseLogic": [
    "攻击",
    "命中",
    "护甲",
    "防御",
    "防御等级",
    "AC",
    "装甲",
    "回避",
    "闪避",
    "格挡",
    "护盾",
    "掩体",
    "破防",
    "防御姿态"
  ],
  "DamageHealingLogic": [
    "伤害",
    "生命",
    "HP",
    "血量",
    "耐久",
    "护盾",
    "临时生命",
    "治疗",
    "恢复",
    "减伤",
    "抗性",
    "易伤",
    "免疫",
    "死亡",
    "濒死",
    "复活"
  ],
  "StatusLogic": [
    "状态",
    "Buff",
    "Debuff",
    "异常",
    "控制",
    "标记",
    "诅咒",
    "祝福",
    "中毒",
    "燃烧",
    "流血",
    "眩晕",
    "沉默",
    "隐身",
    "麻痹",
    "恐惧",
    "魅惑"
  ],
  "ResourceLogic": [
    "资源",
    "法力",
    "MP",
    "SP",
    "能量",
    "怒气",
    "灵力",
    "法术位",
    "技能点",
    "行动资源",
    "弹药",
    "材料",
    "金币",
    "补给",
    "耐久"
  ],
  "RestRecoveryLogic": [
    "休息",
    "扎营",
    "安全区",
    "篝火",
    "存档点",
    "据点整备",
    "短休",
    "长休",
    "恢复",
    "补给",
    "守夜",
    "营地"
  ],
  "ExplorationTravelLogic": [
    "探索",
    "旅行",
    "侦查",
    "潜行",
    "追踪",
    "导航",
    "随机遭遇",
    "地形",
    "天气",
    "光照",
    "迷路",
    "觅食",
    "行军"
  ],
  "SocialInteractionLogic": [
    "社交",
    "说服",
    "欺瞒",
    "威吓",
    "交涉",
    "谈判",
    "好感度",
    "声望",
    "派系态度",
    "洞察",
    "审问",
    "伪装",
    "收买"
  ],
  "AbilityExecutionLogic": [
    "能力",
    "法术",
    "技能",
    "异能",
    "战技",
    "咒术",
    "术式",
    "魔法",
    "宝具",
    "天赋",
    "奥义",
    "秘技",
    "领域",
    "解放"
  ],
  "RulePriorityLogic": [
    "例外",
    "覆盖",
    "特殊规则",
    "GM裁定",
    "桌规",
    "自制规则",
    "优先级",
    "冲突",
    "可选规则",
    "来源优先级"
  ]
},
  dependencies: {
  "AbilityExecutionLogic": [
    "ActionEconomyLogic",
    "ResourceLogic",
    "CheckLogic",
    "AttackDefenseLogic",
    "DamageHealingLogic",
    "StatusLogic",
    "RulePriorityLogic"
  ],
  "AttackDefenseLogic": [
    "CheckLogic",
    "ContestLogic",
    "DamageHealingLogic",
    "StatusLogic",
    "RulePriorityLogic"
  ],
  "DamageHealingLogic": [
    "StatusLogic",
    "ResourceLogic",
    "RulePriorityLogic"
  ],
  "RestRecoveryLogic": [
    "ResourceLogic",
    "StatusLogic",
    "ExplorationTravelLogic",
    "RulePriorityLogic"
  ],
  "SocialInteractionLogic": [
    "CheckLogic",
    "ContestLogic",
    "RulePriorityLogic"
  ],
  "ExplorationTravelLogic": [
    "CheckLogic",
    "ContestLogic",
    "ResourceLogic",
    "StatusLogic"
  ],
  "ActionEconomyLogic": [
    "ResourceLogic",
    "StatusLogic",
    "RulePriorityLogic"
  ],
  "ContestLogic": [
    "CheckLogic",
    "StatusLogic",
    "RulePriorityLogic"
  ]
},
  priorityLayer: [
    "GM裁定",
    "自制模组规则",
    "当前战役启用规则",
    "官方特殊规则",
    "官方通用规则",
    "推断性补全规则"
  ],
  stateWritebackTargets: [
    "角色状态",
    "资源状态",
    "状态列表",
    "场景状态",
    "地点状态",
    "NPC态度",
    "派系关系",
    "任务进度",
    "战役时间",
    "GM裁定记录"
  ],
  runtimeFlow: [
    "接收玩家行为描述",
    "抽取行为中的关键术语、对象、能力、资源和目标",
    "将作品原始术语映射到统一系统logic",
    "判断主要调用的系统logic",
    "展开该logic依赖的其他logic",
    "读取角色、实体、场景、资源、状态和任务状态",
    "检查特殊规则、例外规则和GM裁定",
    "生成具体判定流程",
    "执行判定或等待掷骰、抽卡、表格或GM裁定",
    "将结果写回战役状态"
  ]
};

export function normalizeRuleTerm(term) {
  const normalized = String(term || "").trim().toLowerCase();
  for (const [logic, terms] of Object.entries(RuleExecutionGraphRAG.canonicalTermMap)) {
    if (terms.some((candidate) => normalized === String(candidate).trim().toLowerCase())) {
      return logic;
    }
  }
  for (const [logic, terms] of Object.entries(RuleExecutionGraphRAG.canonicalTermMap)) {
    if (terms.some((candidate) => normalized.includes(String(candidate).trim().toLowerCase()))) {
      return logic;
    }
  }
  return "UnmappedTermNode";
}

export function expandLogicDependencies(logic) {
  const visited = new Set();
  const result = [];
  function visit(node) {
    if (!node || visited.has(node)) return;
    visited.add(node);
    result.push(node);
    for (const dep of RuleExecutionGraphRAG.dependencies[node] || []) visit(dep);
  }
  visit(logic);
  return result;
}

/*
原始 GraphRAG 段落存档：
# 规则执行层 GraphRAG

规则执行层 GraphRAG 应建立在上述 Skill 之上。它不是单独存储“某一条规则文本”，而是存储“术语归一化结果、系统 logic、规则依赖关系、触发条件、例外关系和当前状态写回关系”。

其核心目标是：当 input 来自不同 ACGN 作品时，即使不同作品使用完全不同的术语，也能通过术语归一化层将其指向同一个系统 logic。

例如：

“检定、判定、测试、挑战、试炼”应统一指向 CheckLogic；
“对抗、比拼、抵抗、反制、招架、闪避”应根据上下文指向 ContestLogic 或 AttackDefenseLogic；
“行动点、AP、主行动、副行动、冷却、读条、反应”应统一指向 ActionEconomyLogic；
“护甲、防御、防御等级、AC、装甲、回避、格挡、护盾”应根据上下文指向 AttackDefenseLogic 或 DamageHealingLogic；
“生命、HP、血量、耐久、护盾、临时生命”应统一指向 DamageHealingLogic 或 ResourceLogic；
“Buff、Debuff、异常、控制、标记、诅咒、祝福”应统一指向 StatusLogic；
“法术、技能、异能、战技、咒术、宝具、天赋、奥义”应统一指向 AbilityExecutionLogic；
“休息、扎营、安全区、篝火、存档点、据点整备”应统一指向 RestRecoveryLogic；
“探索、旅行、侦查、潜行、追踪、导航、随机遭遇”应统一指向 ExplorationTravelLogic；
“说服、欺瞒、威吓、交涉、好感度、声望、派系态度”应统一指向 SocialInteractionLogic；
“例外、覆盖、特殊规则、GM裁定、桌规、自制规则”应统一指向 RulePriorityLogic。

## 1. 规则执行层 GraphRAG 的节点类型

规则执行层 GraphRAG 至少应包含以下节点类型：

```yaml
RuleExecutionGraph:
  node_types:
    TermNode: 作品原始术语节点
    CanonicalTermNode: 归一化术语节点
    SkillNode: 规则系统生成Skill节点
    LogicNode: 系统logic节点
    TriggerNode: 触发条件节点
    ActorNode: 行动发起者节点
    TargetNode: 行动目标节点
    ResourceNode: 资源节点
    StatusNode: 状态节点
    ModifierNode: 修正来源节点
    DifficultyNode: 难度节点
    ResultNode: 结果分支节点
    ExceptionNode: 例外规则节点
    PriorityNode: 优先级节点
    SourceTextNode: 来源文本节点
    StateWritebackNode: 状态写回节点
```

其中，TermNode 保存作品中的原始说法，CanonicalTermNode 保存归一化后的系统术语，SkillNode 指向对应的规则生成 Skill，LogicNode 保存该 Skill 从 input 中生成的系统 logic。

## 2. 规则执行层 GraphRAG 的关系类型

规则执行层 GraphRAG 至少应包含以下关系类型：

```yaml
RuleExecutionGraph:
  edge_types:
    ALIAS_OF: 原始术语是某归一化术语的别名
    NORMALIZED_TO: 原始术语被归一化到某系统logic
    GENERATED_BY: logic由某Skill生成
    CALLS: 一个logic调用另一个logic
    DEPENDS_ON: 判定依赖属性、资源、状态、环境或难度
    TRIGGERED_BY: logic由某事件、行为或场景触发
    APPLIES_TO: logic作用于某角色、实体、场景或目标
    MODIFIED_BY: logic受到某修正来源影响
    BLOCKED_BY: logic被某状态、资源不足、环境或例外阻止
    OVERRIDES: 特殊规则覆盖通用规则
    CONFLICTS_WITH: 两条规则存在冲突
    PRIORITIZED_OVER: 某规则优先于另一规则
    PRODUCES: logic产生某结果
    WRITES_BACK_TO: 结果写回角色状态、场景状态、任务状态或战役状态
    CITED_FROM: logic来自某来源文本
```

通过这些关系，规则执行层 GraphRAG 可以在回答时形成可追溯路径：原始术语 → 归一化术语 → 系统 Skill → 系统 logic → 依赖规则 → 例外规则 → 当前状态 → 输出判定流程。

## 3. 术语归一化逻辑

规则执行层 GraphRAG 必须包含术语归一化逻辑，避免不同作品的术语差异导致系统无法复用。

术语归一化应遵循以下流程：

```yaml
TermNormalizationPipeline:
  step_1_extract_terms: 从input中抽取作品原始术语
  step_2_detect_context: 判断术语出现的上下文，如战斗、探索、社交、资源、状态或剧情
  step_3_map_to_canonical_terms: 将原始术语映射到归一化术语
  step_4_select_logic: 根据上下文选择对应系统logic
  step_5_check_conflict: 检查该映射是否与已有规则冲突
  step_6_attach_source: 将映射关系绑定来源文本
  step_7_allow_manual_override: 允许GM或规则维护者手动修正映射
```

例如，“护盾”在不同作品中可能有不同含义：

如果“护盾”用于抵挡一次攻击命中，则应指向 AttackDefenseLogic；
如果“护盾”用于吸收伤害数值，则应指向 DamageHealingLogic；
如果“护盾”作为一种可消耗资源存在，则应指向 ResourceLogic；
如果“护盾”是一种持续 Buff，则应指向 StatusLogic。

因此，GraphRAG 不能只依赖词面相似度，而必须结合上下文、来源文本、触发条件和作用结果进行归一化。

## 4. 规则执行层 GraphRAG 的推荐数据结构

规则执行层 GraphRAG 可以采用如下结构保存：

```yaml
RuleExecutionGraphRAG:
  input:
    work_name: ACGN作品名称
    source_documents:
      - wiki文档
      - 规则书文本
      - 角色卡
      - 战斗记录
      - 自制模组
  normalization_layer:
    terms:
      - raw_term: 作品原始术语
        canonical_term: 归一化术语
        mapped_logic: 对应LogicNode
        confidence: 映射置信度
        context: 术语出现的上下文
        source: 来源文本
  skill_layer:
    skills:
      - Skill_CheckLogic
      - Skill_ContestLogic
      - Skill_ActionEconomyLogic
      - Skill_AttackDefenseLogic
      - Skill_DamageHealingLogic
      - Skill_StatusLogic
      - Skill_ResourceLogic
      - Skill_RestRecoveryLogic
      - Skill_ExplorationTravelLogic
      - Skill_SocialInteractionLogic
      - Skill_AbilityExecutionLogic
      - Skill_RulePriorityLogic
  logic_layer:
    logic_nodes:
      - CheckLogic
      - ContestLogic
      - ActionEconomyLogic
      - AttackDefenseLogic
      - DamageHealingLogic
      - StatusLogic
      - ResourceLogic
      - RestRecoveryLogic
      - ExplorationTravelLogic
      - SocialInteractionLogic
      - AbilityExecutionLogic
      - RulePriorityLogic
  dependency_layer:
    dependencies:
      - logic: AbilityExecutionLogic
        calls:
          - ActionEconomyLogic
          - ResourceLogic
          - CheckLogic
          - AttackDefenseLogic
          - DamageHealingLogic
          - StatusLogic
      - logic: AttackDefenseLogic
        calls:
          - CheckLogic
          - ContestLogic
          - DamageHealingLogic
      - logic: RestRecoveryLogic
        calls:
          - ResourceLogic
          - StatusLogic
          - ExplorationTravelLogic
      - logic: SocialInteractionLogic
        calls:
          - CheckLogic
          - ContestLogic
          - RulePriorityLogic
  priority_layer:
    rule_priority:
      - GM裁定
      - 自制模组规则
      - 当前战役启用规则
      - 官方特殊规则
      - 官方通用规则
      - 推断性补全规则
  state_writeback_layer:
    writeback_targets:
      - 角色状态
      - 资源状态
      - 状态列表
      - 场景状态
      - 地点状态
      - NPC态度
      - 派系关系
      - 任务进度
      - 战役时间
      - GM裁定记录
```

该结构使规则执行层不仅能检索规则，还能解释“为什么调用这条规则”“这条规则来自哪里”“它覆盖了什么”“它会改变什么状态”。

## 5. 规则执行层 GraphRAG 的运行流程

当玩家提出一个行为时，规则执行层 GraphRAG 应按以下流程运行：

```yaml
RuleExecutionRuntime:
  step_1_receive_player_intent: 接收玩家行为描述
  step_2_extract_terms: 抽取行为中的关键术语、对象、能力、资源和目标
  step_3_normalize_terms: 将作品原始术语映射到统一系统logic
  step_4_select_primary_logic: 判断主要调用的系统logic
  step_5_expand_dependencies: 展开该logic依赖的其他logic
  step_6_retrieve_current_state: 读取角色、实体、场景、资源、状态和任务状态
  step_7_check_priority_and_exceptions: 检查特殊规则、例外规则和GM裁定
  step_8_generate_resolution_flow: 生成具体判定流程
  step_9_execute_or_wait_for_roll: 执行判定或等待掷骰、抽卡、表格或GM裁定
  step_10_writeback_result: 将结果写回战役状态
```

例如，当玩家说“我使用某角色的奥义打断敌人的蓄力攻击”时，GraphRAG 不应只检索“奥义”或“打断”的文本，而应执行：

奥义 → AbilityExecutionLogic；
打断 → ActionEconomyLogic 或 ContestLogic；
敌人蓄力攻击 → AbilityExecutionLogic；
是否能插入行动 → ActionEconomyLogic；
是否需要对抗 → ContestLogic；
是否造成伤害 → DamageHealingLogic；
是否附加状态 → StatusLogic；
是否有特殊免疫或霸体 → RulePriorityLogic；
最终结果 → StateWritebackNode。

这样，即使不同作品把“奥义”称作“宝具、必杀、秘技、解放、领域、术式”，系统仍然可以通过术语归一化把它指向 AbilityExecutionLogic，再根据具体作品资料生成对应判定逻辑。

## 6. 规则执行层 GraphRAG 的最终定位

完成上述抽象后，规则执行层不再是一份固定的 DND 规则说明，而是一组可被复用的规则系统生成 Skill。它可以接受任意 ACGN 作品名称、wiki 文档、规则书、角色卡或自制模组作为 input，并输出对应作品下可运行的 system logic。

这种设计可以使 GraphRAG 同时具备三种能力：

第一，跨作品术语兼容能力。不同作品中近似的系统术语可以被归一化到同一个 logic 中，从而避免“术语不同但机制相同”导致的检索断裂。

第二，规则流程生成能力。系统不只是返回文本，而是生成可执行、可检查、可写回状态的判定流程。

第三，长期战役维护能力。通过 StateWritebackNode 和 RulePriorityLogic，系统可以记录已经发生的结果、已经做出的 GM 裁定、已经启用的自制规则，并在后续判定中持续生效。

因此，规则执行层的最终形态应是：以 Skill 生成 system logic，以 GraphRAG 组织术语、规则、依赖、例外和状态，以当前战役状态驱动实际判定。它负责回答的不只是“这条规则是什么”，而是“在当前作品、当前场景、当前角色状态下，这个行为应该如何被判定”。

*/
