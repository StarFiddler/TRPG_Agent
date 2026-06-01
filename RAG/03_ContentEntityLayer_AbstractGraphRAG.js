/**
 * ContentEntityLayerGraphRAG
 * 层级：内容实体层
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


const ContentEntityLayerGraphRAG = {
  layerId: "L3_CONTENT_ENTITY",
  layerName: "内容实体层",
  description: `负责把能力、武器、护具、道具、法术、敌人、NPC、环境、陷阱、负面实体、遭遇与奖励映射为规则对象 logic。该层回答“某个对象的规则属性是什么”。`,
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
    "id": "AbilityEntityLogic",
    "name": "能力实体系统",
    "logic": "将职业能力、怪物能力、装备能力等具体能力条目抽象为 ability entity logic。",
    "aliasScope": "能力实体/技能条目",
    "aliases": [
      "能力",
      "技能",
      "能力实体",
      "技能条目",
      "ability",
      "skill entity",
      "power"
    ],
    "crossWorkTerms": [
      "宝具",
      "术式",
      "战技",
      "奥义",
      "天赋技能",
      "异能",
      "权能",
      "结界",
      "召唤术"
    ],
    "outputContract": "输出能力来源、触发、目标、消耗、效果、限制和规则引用。"
  },
  {
    "id": "WeaponEntityLogic",
    "name": "武器实体系统",
    "logic": "将武器、天然武器、魔法武器、远程武器抽象为 weapon entity logic。",
    "aliasScope": "武器/攻击装备",
    "aliases": [
      "武器",
      "兵器",
      "攻击装备",
      "weapon",
      "armament"
    ],
    "crossWorkTerms": [
      "舰装主炮",
      "圣剑",
      "枪械",
      "弓",
      "法杖",
      "拳套",
      "机甲武装",
      "宝具武器",
      "念能力具现物"
    ],
    "outputContract": "输出类别、伤害、射程、属性、熟练需求、特殊效果。"
  },
  {
    "id": "ArmorDefenseEntityLogic",
    "name": "护具与防御装备系统",
    "logic": "将护甲、盾牌、防御饰品、屏障装备抽象为 armor-defense entity logic。",
    "aliasScope": "护具/防御装备/盾",
    "aliases": [
      "护具",
      "护甲",
      "盾牌",
      "防具",
      "防御装备",
      "armor",
      "shield"
    ],
    "crossWorkTerms": [
      "护盾发生器",
      "圣遗物防御套",
      "护符",
      "防御芯片",
      "舰装装甲",
      "AT力场",
      "结界衣"
    ],
    "outputContract": "输出防御值、限制、熟练需求、抗性、槽位和副作用。"
  },
  {
    "id": "ItemConsumableLogic",
    "name": "道具与消耗品系统",
    "logic": "将药水、材料、任务物、钥匙、弹药等抽象为 item-consumable logic。",
    "aliasScope": "道具/消耗品/材料",
    "aliases": [
      "道具",
      "消耗品",
      "材料",
      "钥匙",
      "药水",
      "卷轴",
      "item",
      "consumable"
    ],
    "crossWorkTerms": [
      "料理",
      "强化材料",
      "芯片材料",
      "信物",
      "圣杯",
      "任务道具",
      "弹药",
      "补给",
      "制作素材"
    ],
    "outputContract": "输出使用条件、消耗方式、效果、稀有度、来源和任务绑定。"
  },
  {
    "id": "SpellEntityLogic",
    "name": "法术实体系统",
    "logic": "将魔法、咒术、仪式、技能法术化条目抽象为 spell entity logic。",
    "aliasScope": "法术/魔法/咒术",
    "aliases": [
      "法术",
      "魔法",
      "咒术",
      "仪式",
      "spell",
      "magic",
      "ritual"
    ],
    "crossWorkTerms": [
      "术式",
      "忍术",
      "阴阳术",
      "权能",
      "神术",
      "灵能",
      "宝具真名解放",
      "魔眼",
      "结界术"
    ],
    "outputContract": "输出等级、学派、施法时间、范围、成分、豁免、升阶和可反制性。"
  },
  {
    "id": "EnemyMonsterEntityLogic",
    "name": "敌对单位与怪物系统",
    "logic": "将敌人、怪物、Boss、召唤物、战斗单位抽象为 enemy-monster entity logic。",
    "aliasScope": "敌人/怪物/战斗单位",
    "aliases": [
      "敌人",
      "怪物",
      "首领",
      "Boss",
      "战斗单位",
      "monster",
      "enemy",
      "creature"
    ],
    "crossWorkTerms": [
      "精英怪",
      "小怪",
      "从者",
      "舰船敌人",
      "魔兽",
      "构装体",
      "深渊敌人",
      "召唤物",
      "机甲单位"
    ],
    "outputContract": "输出属性、护甲、生命、感官、能力、战术、掉落和生态位。"
  },
  {
    "id": "NPCEntityLogic",
    "name": "NPC 实体系统",
    "logic": "将非玩家角色、商人、导师、任务发起人抽象为 NPC entity logic。",
    "aliasScope": "NPC/角色实体/非玩家角色",
    "aliases": [
      "NPC",
      "非玩家角色",
      "商人",
      "导师",
      "任务发起人",
      "npc entity"
    ],
    "crossWorkTerms": [
      "剧情角色",
      "同伴",
      "可招募角色",
      "英灵御主",
      "舰队指挥官",
      "学园教师",
      "情报贩子"
    ],
    "outputContract": "输出身份、派系、所在地、态度、任务、交易、秘密和战斗能力。"
  },
  {
    "id": "EnvironmentEntityLogic",
    "name": "环境实体系统",
    "logic": "将地形、天气、光照、危险区域、掩体抽象为 environment entity logic。",
    "aliasScope": "环境/地形/天气/区域效果",
    "aliases": [
      "环境",
      "地形",
      "天气",
      "光照",
      "区域效果",
      "environment",
      "terrain"
    ],
    "crossWorkTerms": [
      "毒沼",
      "深水",
      "黑暗区域",
      "重力异常",
      "魔力污染",
      "火场",
      "暴风雪",
      "掩体",
      "高低差"
    ],
    "outputContract": "输出作用范围、触发、移动影响、检定影响、伤害和解除方式。"
  },
  {
    "id": "TrapMechanismEntityLogic",
    "name": "陷阱与机关系统",
    "logic": "将陷阱、机关、谜题装置、封印抽象为 trap-mechanism logic。",
    "aliasScope": "陷阱/机关/谜题",
    "aliases": [
      "陷阱",
      "机关",
      "谜题",
      "封印",
      "trap",
      "mechanism",
      "puzzle"
    ],
    "crossWorkTerms": [
      "警报",
      "机关门",
      "传送阵",
      "毒针",
      "落石",
      "魔法阵",
      "安全系统",
      "封锁装置"
    ],
    "outputContract": "输出发现难度、解除难度、触发、伤害、状态和绕过方式。"
  },
  {
    "id": "DiseasePoisonCurseEntityLogic",
    "name": "疾病、毒素与诅咒系统",
    "logic": "将疾病、毒、诅咒、污染、寄生等持续负面实体抽象为 affliction logic。",
    "aliasScope": "疾病/毒素/诅咒/污染",
    "aliases": [
      "疾病",
      "毒素",
      "诅咒",
      "污染",
      "寄生",
      "affliction",
      "poison",
      "curse"
    ],
    "crossWorkTerms": [
      "瘟疫",
      "腐化",
      "深渊侵蚀",
      "精神污染",
      "魔女诅咒",
      "血毒",
      "辐射",
      "理智侵蚀"
    ],
    "outputContract": "输出感染方式、阶段、豁免、发作周期、治疗和传播。"
  },
  {
    "id": "EncounterEntityLogic",
    "name": "遭遇实体系统",
    "logic": "将战斗、社交、探索、随机事件等遭遇模板抽象为 encounter entity logic。",
    "aliasScope": "遭遇/事件模板/遭遇配置",
    "aliases": [
      "遭遇",
      "事件",
      "遭遇模板",
      "随机遭遇",
      "encounter",
      "event"
    ],
    "crossWorkTerms": [
      "伏击",
      "Boss战",
      "谈判场景",
      "探索事件",
      "追逐",
      "潜入事件",
      "剧情战",
      "世界事件"
    ],
    "outputContract": "输出触发条件、参与单位、环境、胜败条件、奖励和后续变化。"
  },
  {
    "id": "RewardDropEntityLogic",
    "name": "奖励与掉落系统",
    "logic": "将经验、金币、装备、情报、声望、剧情权限抽象为 reward-drop logic。",
    "aliasScope": "奖励/掉落/收益",
    "aliases": [
      "奖励",
      "掉落",
      "战利品",
      "收益",
      "reward",
      "drop",
      "loot"
    ],
    "crossWorkTerms": [
      "固定掉落",
      "随机掉落",
      "宝箱",
      "任务奖励",
      "声望奖励",
      "线索奖励",
      "解锁权限",
      "羁绊提升"
    ],
    "outputContract": "输出获取条件、来源、概率、稀有度、绑定对象和剧情影响。"
  }
],
  edges: [
  {
    "from": "AbilityEntityLogic",
    "to": "SpellEntityLogic",
    "relation": "SPELL_IS_SPECIALIZED_ABILITY"
  },
  {
    "from": "WeaponEntityLogic",
    "to": "AbilityEntityLogic",
    "relation": "WEAPON_MAY_GRANT_ABILITY"
  },
  {
    "from": "ArmorDefenseEntityLogic",
    "to": "AbilityEntityLogic",
    "relation": "ARMOR_MAY_GRANT_DEFENSIVE_ABILITY"
  },
  {
    "from": "ItemConsumableLogic",
    "to": "RewardDropEntityLogic",
    "relation": "ITEM_MAY_BE_REWARD"
  },
  {
    "from": "EnemyMonsterEntityLogic",
    "to": "RewardDropEntityLogic",
    "relation": "ENEMY_MAY_DROP_REWARD"
  },
  {
    "from": "NPCEntityLogic",
    "to": "EncounterEntityLogic",
    "relation": "NPC_MAY_PARTICIPATE_IN_ENCOUNTER"
  },
  {
    "from": "EnvironmentEntityLogic",
    "to": "EncounterEntityLogic",
    "relation": "ENVIRONMENT_CONFIGURES_ENCOUNTER"
  },
  {
    "from": "TrapMechanismEntityLogic",
    "to": "EnvironmentEntityLogic",
    "relation": "TRAP_EMBEDDED_IN_ENVIRONMENT"
  },
  {
    "from": "DiseasePoisonCurseEntityLogic",
    "to": "EnemyMonsterEntityLogic",
    "relation": "AFFLICTION_MAY_BE_SOURCE_FROM_ENEMY"
  },
  {
    "from": "EncounterEntityLogic",
    "to": "RewardDropEntityLogic",
    "relation": "ENCOUNTER_PRODUCES_REWARD"
  }
],
  resolve(query) {
    return resolveSystem(query, this.systems);
  },
  plan(query) {
    return buildRetrievalPlan(query, this);
  }
};

module.exports = ContentEntityLayerGraphRAG;
