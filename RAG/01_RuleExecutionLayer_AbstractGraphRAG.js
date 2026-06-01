/**
 * RuleExecutionLayerGraphRAG
 * 层级：规则执行层
 * 用途：将该层级内不同作品、不同 wiki、不同 TRPG 桌规中的近似术语，抽象映射到稳定的 system logic。
 * 输入：任意 ACGN 作品名称、wiki 文档片段、规则文本、角色卡片段、战役记录片段、玩家行动描述。
 * 输出：对应系统 logic 的候选定位、关联节点、检索计划与写回目标。
 */

/**
 * 通用术语规整器：用于把不同 ACGN 作品中的近似术语归并到同一个系统 logic。
 * 设计目标不是替代向量检索，而是在 GraphRAG 入口处提供轻量级 ontology routing。
 */
function normalizeTerm(input) {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[【】\[\]（）(){}<>《》「」『』:：,，.。;；!！?？]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreAliases(query, aliases = []) {
  const q = normalizeTerm(query);
  if (!q) return 0;
  let score = 0;
  for (const alias of aliases) {
    const a = normalizeTerm(alias);
    if (!a) continue;
    if (q === a) score += 100;
    else if (q.includes(a) || a.includes(q)) score += Math.min(60, 20 + Math.min(q.length, a.length));
    else {
      const qParts = new Set(q.split(/\s+/).filter(Boolean));
      const aParts = new Set(a.split(/\s+/).filter(Boolean));
      let overlap = 0;
      for (const p of qParts) if (aParts.has(p)) overlap += 1;
      if (overlap > 0) score += overlap * 8;
    }
  }
  return score;
}

function resolveSystem(query, systems) {
  const ranked = systems
    .map(system => ({
      systemId: system.id,
      canonicalName: system.name,
      logic: system.logic,
      score: scoreAliases(query, [system.id, system.name, ...(system.aliases || []), ...(system.crossWorkTerms || [])]),
      matchedAliasScope: system.aliasScope,
      outputContract: system.outputContract
    }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    query,
    best: ranked[0] || null,
    candidates: ranked.slice(0, 5),
    fallback: ranked.length ? null : "NO_DIRECT_MATCH__USE_LAYER_CONTEXT_AND_VECTOR_RETRIEVAL"
  };
}

function buildRetrievalPlan(query, layerGraph) {
  const systemResolution = resolveSystem(query, layerGraph.systems);
  const bestSystemId = systemResolution.best?.systemId;
  const relations = bestSystemId
    ? layerGraph.edges.filter(e => e.from === bestSystemId || e.to === bestSystemId)
    : [];
  return {
    layerId: layerGraph.layerId,
    layerName: layerGraph.layerName,
    query,
    systemResolution,
    retrievalTargets: bestSystemId ? [bestSystemId, ...relations.map(e => e.from === bestSystemId ? e.to : e.from)] : [],
    relations,
    recommendedNextStep: bestSystemId
      ? "RETRIEVE_SYSTEM_LOGIC__THEN_RETRIEVE_CONNECTED_CONTEXT"
      : "RUN_VECTOR_SEARCH__THEN_MAP_TO_NEAREST_CANONICAL_SYSTEM"
  };
}


const RuleExecutionLayerGraphRAG = {
  layerId: "L1_RULE_EXECUTION",
  layerName: "规则执行层",
  description: `负责把玩家行动、系统判定、战斗流程、探索流程、社交流程、资源消耗与规则例外映射为可执行 logic。该层回答“现在该如何判定”。`,
  inputContract: {
    acceptedInput: [
      "ACGN作品名称",
      "wiki文档片段",
      "规则文本片段",
      "角色卡片段",
      "怪物或道具条目",
      "战役记录",
      "玩家行动意图"
    ],
    normalizationPolicy: [
      "保留作品原术语",
      "提取近似系统术语",
      "映射到 canonical system logic",
      "保留 aliasTrace 以便回溯来源文本",
      "当术语无法精确命中时，允许进入相邻系统候选"
    ]
  },
  outputContract: {
    primaryOutput: "systemLogicResolution",
    includes: [
      "canonicalSystemId",
      "canonicalSystemName",
      "matchedAliases",
      "retrievalTargets",
      "relatedSystems",
      "logicSchema",
      "writeBackTargets"
    ]
  },
  systems: [
  {
    "id": "CheckLogic",
    "name": "基础判定系统",
    "logic": "将检定、判定、掷骰、命中前置判定、属性测试、技能测试等抽象为统一的 check logic。",
    "aliasScope": "判定/检定/测试/roll/check",
    "aliases": [
      "检定",
      "判定",
      "技能检定",
      "属性检定",
      "豁免",
      "豁免检定",
      "roll",
      "check",
      "test",
      "能力判定",
      "属性测试",
      "技能测试",
      "命运判定",
      "成功率判定"
    ],
    "crossWorkTerms": [
      "SAN值检定",
      "理智检定",
      "命中判定",
      "闪避判定",
      "调查判定",
      "潜行判定",
      "感知判定",
      "说服判定",
      "意志判定",
      "灵感判定"
    ],
    "outputContract": "输出判定触发条件、输入属性、难度、修正、成功/失败分支。"
  },
  {
    "id": "ContestLogic",
    "name": "对抗系统",
    "logic": "将双方或多方相互比较的行动抽象为 contest logic。",
    "aliasScope": "对抗/比较/抵抗/竞争",
    "aliases": [
      "对抗",
      "对抗检定",
      "抵抗",
      "抗衡",
      "比拼",
      "contest",
      "opposed roll",
      "resist",
      "抗性判定",
      "挣脱",
      "压制"
    ],
    "crossWorkTerms": [
      "抓取对抗",
      "推搡对抗",
      "潜行vs察觉",
      "欺骗vs洞察",
      "破防对抗",
      "精神抵抗",
      "封印抵抗"
    ],
    "outputContract": "输出主动方、被动方、比较方式、平局处理、胜负分支。"
  },
  {
    "id": "ActionEconomyLogic",
    "name": "行动经济系统",
    "logic": "将回合内可用行动资源抽象为 action economy logic。",
    "aliasScope": "行动/回合/行动点/动作资源",
    "aliases": [
      "行动",
      "动作",
      "回合",
      "轮次",
      "行动点",
      "AP",
      "action",
      "turn",
      "round",
      "反应",
      "附赠行动",
      "移动",
      "准备动作",
      "自由动作"
    ],
    "crossWorkTerms": [
      "主行动",
      "副行动",
      "战技动作",
      "奥义动作",
      "支援动作",
      "机会攻击",
      "追击",
      "连携行动",
      "即时动作"
    ],
    "outputContract": "输出本回合行动槽、移动槽、反应槽、互斥关系与消耗。"
  },
  {
    "id": "AttackDefenseLogic",
    "name": "攻击与防御系统",
    "logic": "将命中、护甲、防御、闪避、格挡、掩体等抽象为 attack-defense logic。",
    "aliasScope": "攻击/命中/防御/护甲/闪避",
    "aliases": [
      "攻击",
      "命中",
      "防御",
      "护甲",
      "AC",
      "护甲等级",
      "闪避",
      "格挡",
      "格挡值",
      "命中率",
      "回避率",
      "attack",
      "defense",
      "hit",
      "evasion"
    ],
    "crossWorkTerms": [
      "破盾",
      "弹反",
      "盾反",
      "招架",
      "精准",
      "回避",
      "防御等级",
      "防御力",
      "装甲值",
      "护盾值"
    ],
    "outputContract": "输出攻击类型、命中方式、防御目标、掩体/距离/视野修正。"
  },
  {
    "id": "DamageHealingLogic",
    "name": "伤害与治疗系统",
    "logic": "将生命变化、伤害结算、治疗、减免、抗性、易伤抽象为 damage-healing logic。",
    "aliasScope": "伤害/治疗/生命变化",
    "aliases": [
      "伤害",
      "治疗",
      "恢复",
      "扣血",
      "回血",
      "生命值",
      "HP",
      "damage",
      "heal",
      "recovery",
      "抗性",
      "易伤",
      "免疫",
      "减伤",
      "护盾"
    ],
    "crossWorkTerms": [
      "白血",
      "红血",
      "架势伤害",
      "真实伤害",
      "持续伤害",
      "DOT",
      "HOT",
      "吸血",
      "护盾吸收",
      "濒死",
      "死亡豁免"
    ],
    "outputContract": "输出伤害来源、伤害类型、结算顺序、减免、恢复与死亡流程。"
  },
  {
    "id": "StatusLogic",
    "name": "状态系统",
    "logic": "将 buff、debuff、异常、控制、持续效果抽象为 status logic。",
    "aliasScope": "状态/异常/buff/debuff",
    "aliases": [
      "状态",
      "异常",
      "buff",
      "debuff",
      "控制",
      "增益",
      "减益",
      "异常状态",
      "condition",
      "status",
      "effect"
    ],
    "crossWorkTerms": [
      "中毒",
      "流血",
      "燃烧",
      "冻结",
      "麻痹",
      "眩晕",
      "魅惑",
      "恐惧",
      "隐身",
      "沉默",
      "标记",
      "诅咒",
      "祝福",
      "力竭"
    ],
    "outputContract": "输出状态来源、持续时间、叠加规则、解除条件和影响范围。"
  },
  {
    "id": "ResourceLogic",
    "name": "资源消耗系统",
    "logic": "将可消耗、可恢复、可上限化的数值抽象为 resource logic。",
    "aliasScope": "资源/消耗/次数/能量",
    "aliases": [
      "资源",
      "消耗",
      "法力",
      "MP",
      "SP",
      "能量",
      "怒气",
      "专注",
      "法术位",
      "冷却",
      "CD",
      "次数",
      "弹药",
      "耐久",
      "resource",
      "cost"
    ],
    "crossWorkTerms": [
      "士气",
      "灵力",
      "查克拉",
      "气",
      "魂",
      "体力",
      "行动点",
      "奥义槽",
      "必杀槽",
      "精神力",
      "理智值"
    ],
    "outputContract": "输出资源类型、上限、当前值、消耗条件、恢复条件。"
  },
  {
    "id": "RestRecoveryLogic",
    "name": "休息与恢复系统",
    "logic": "将休息、扎营、安全区、补给与周期性恢复抽象为 rest-recovery logic。",
    "aliasScope": "休息/恢复/扎营/安全区",
    "aliases": [
      "休息",
      "短休",
      "长休",
      "扎营",
      "营地",
      "安全区",
      "恢复",
      "补给",
      "睡眠",
      "rest",
      "camp",
      "safe zone"
    ],
    "crossWorkTerms": [
      "篝火",
      "存档点",
      "旅馆",
      "据点恢复",
      "每日刷新",
      "回城恢复",
      "治疗站",
      "休整",
      "轮班守夜"
    ],
    "outputContract": "输出休息条件、安全等级、恢复内容、遭遇风险和状态写回。"
  },
  {
    "id": "ExplorationTravelLogic",
    "name": "探索与旅行系统",
    "logic": "将地图移动、旅行、侦查、追踪、环境移动抽象为 exploration-travel logic。",
    "aliasScope": "探索/旅行/移动/地图",
    "aliases": [
      "探索",
      "旅行",
      "移动",
      "行军",
      "地图",
      "地形",
      "迷路",
      "侦查",
      "追踪",
      "travel",
      "exploration",
      "movement"
    ],
    "crossWorkTerms": [
      "开放世界移动",
      "大地图移动",
      "跑图",
      "探索度",
      "区域危险",
      "随机遭遇",
      "潜行旅行",
      "觅食",
      "导航"
    ],
    "outputContract": "输出移动单位、地形成本、侦查配置、补给消耗和随机事件。"
  },
  {
    "id": "SocialInteractionLogic",
    "name": "社交互动系统",
    "logic": "将说服、威吓、欺骗、交易、阵营关系抽象为 social interaction logic。",
    "aliasScope": "社交/交涉/关系/声望",
    "aliases": [
      "社交",
      "交涉",
      "说服",
      "威吓",
      "欺骗",
      "谈判",
      "交易",
      "声望",
      "好感度",
      "关系",
      "social",
      "dialogue",
      "reputation"
    ],
    "crossWorkTerms": [
      "羁绊",
      "亲密度",
      "信赖度",
      "阵营声望",
      "派系态度",
      "好感检定",
      "审问",
      "收买",
      "伪装"
    ],
    "outputContract": "输出互动对象、态度、检定方式、成功收益、失败后果与关系写回。"
  },
  {
    "id": "AbilityExecutionLogic",
    "name": "魔法、技能与特殊能力执行系统",
    "logic": "将主动技能、法术、战技、奥义、被动触发抽象为 ability execution logic。",
    "aliasScope": "能力/技能/法术/奥义",
    "aliases": [
      "能力",
      "技能",
      "法术",
      "魔法",
      "战技",
      "奥义",
      "必杀",
      "天赋技能",
      "职业能力",
      "ability",
      "skill",
      "spell",
      "power"
    ],
    "crossWorkTerms": [
      "咒术",
      "术式",
      "忍术",
      "宝具",
      "异能",
      "灵装",
      "超能力",
      "召唤",
      "结界",
      "仪式",
      "被动触发"
    ],
    "outputContract": "输出施放条件、消耗、目标、范围、持续时间、命中/豁免和效果。"
  },
  {
    "id": "RulePriorityLogic",
    "name": "规则优先级与例外系统",
    "logic": "将一般规则、特殊规则、桌规、例外覆盖抽象为 rule priority logic。",
    "aliasScope": "优先级/例外/覆盖/桌规",
    "aliases": [
      "规则优先级",
      "例外",
      "特殊规则",
      "覆盖",
      "桌规",
      "裁定",
      "可选规则",
      "冲突解决",
      "rule priority",
      "exception",
      "override"
    ],
    "crossWorkTerms": [
      "特例",
      "专属机制",
      "角色专属规则",
      "世界观覆盖",
      "GM裁定",
      "系统冲突",
      "版本差异",
      "自定义规则"
    ],
    "outputContract": "输出通用规则、特殊规则、覆盖关系、冲突处理与裁定接口。"
  }
],
  edges: [
  {
    "from": "ActionEconomyLogic",
    "to": "AbilityExecutionLogic",
    "relation": "ACTION_RESOURCE_GATES_ABILITY"
  },
  {
    "from": "AbilityExecutionLogic",
    "to": "CheckLogic",
    "relation": "ABILITY_MAY_TRIGGER_CHECK"
  },
  {
    "from": "AbilityExecutionLogic",
    "to": "ResourceLogic",
    "relation": "ABILITY_CONSUMES_RESOURCE"
  },
  {
    "from": "AttackDefenseLogic",
    "to": "DamageHealingLogic",
    "relation": "HIT_CONFIRMED_THEN_DAMAGE"
  },
  {
    "from": "StatusLogic",
    "to": "ActionEconomyLogic",
    "relation": "STATUS_MODIFIES_ACTION_AVAILABILITY"
  },
  {
    "from": "StatusLogic",
    "to": "CheckLogic",
    "relation": "STATUS_MODIFIES_CHECK"
  },
  {
    "from": "DamageHealingLogic",
    "to": "StatusLogic",
    "relation": "DAMAGE_MAY_APPLY_STATUS"
  },
  {
    "from": "RestRecoveryLogic",
    "to": "ResourceLogic",
    "relation": "REST_RESTORES_RESOURCE"
  },
  {
    "from": "ExplorationTravelLogic",
    "to": "CheckLogic",
    "relation": "EXPLORATION_TRIGGERS_CHECK"
  },
  {
    "from": "SocialInteractionLogic",
    "to": "CheckLogic",
    "relation": "SOCIAL_TRIGGERS_CHECK"
  },
  {
    "from": "ContestLogic",
    "to": "CheckLogic",
    "relation": "CONTEST_COMPOSED_OF_CHECKS"
  },
  {
    "from": "RulePriorityLogic",
    "to": "ActionEconomyLogic",
    "relation": "EXCEPTION_CAN_OVERRIDE_ACTION_RULE"
  },
  {
    "from": "RulePriorityLogic",
    "to": "AbilityExecutionLogic",
    "relation": "EXCEPTION_CAN_OVERRIDE_ABILITY_RULE"
  }
],
  resolve(query) {
    return resolveSystem(query, this.systems);
  },
  plan(query) {
    return buildRetrievalPlan(query, this);
  }
};

module.exports = RuleExecutionLayerGraphRAG;
