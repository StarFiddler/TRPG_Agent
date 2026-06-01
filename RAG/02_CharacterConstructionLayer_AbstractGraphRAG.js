/**
 * CharacterConstructionLayerGraphRAG
 * 层级：角色构建层
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


const CharacterConstructionLayerGraphRAG = {
  layerId: "L2_CHARACTER_CONSTRUCTION",
  layerName: "角色构建层",
  description: `负责把角色属性、职业、种族、背景、成长、熟练、装备构筑与当前快照映射为角色能力来源 logic。该层回答“角色为什么拥有某能力”。`,
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
    "id": "AttributeLogic",
    "name": "基础属性系统",
    "logic": "将力量、敏捷、智力、精神、灵力等角色底层数值抽象为 attribute logic。",
    "aliasScope": "属性/能力值/基础数值",
    "aliases": [
      "属性",
      "能力值",
      "基础属性",
      "力量",
      "敏捷",
      "体质",
      "智力",
      "感知",
      "魅力",
      "attribute",
      "stat"
    ],
    "crossWorkTerms": [
      "筋力",
      "耐久",
      "魔力",
      "幸运",
      "灵力",
      "精神",
      "意志",
      "理智",
      "污染",
      "信仰",
      "科技适应性"
    ],
    "outputContract": "输出属性名称、数值、修正、成长方式和影响系统。"
  },
  {
    "id": "SpeciesLineageLogic",
    "name": "种族、血统或物种系统",
    "logic": "将种族、血统、物种、阵营生理特性抽象为 species-lineage logic。",
    "aliasScope": "种族/血统/物种/出身生理",
    "aliases": [
      "种族",
      "血统",
      "物种",
      "族裔",
      "lineage",
      "species",
      "race",
      "生理特征"
    ],
    "crossWorkTerms": [
      "舰娘",
      "英灵",
      "魔族",
      "妖怪",
      "精灵",
      "龙裔",
      "赛亚人",
      "半神",
      "改造人",
      "机械生命"
    ],
    "outputContract": "输出体型、感官、移动、天生能力、抗性、语言和叙事身份。"
  },
  {
    "id": "ClassLogic",
    "name": "职业系统",
    "logic": "将职业、战斗职能、角色职业树抽象为 class logic。",
    "aliasScope": "职业/职阶/职业树",
    "aliases": [
      "职业",
      "职阶",
      "职业树",
      "class",
      "job",
      "role class",
      "主职业"
    ],
    "crossWorkTerms": [
      "Saber",
      "Caster",
      "战士",
      "法师",
      "游侠",
      "牧师",
      "刺客",
      "盾卫",
      "治疗者",
      "召唤师",
      "机师"
    ],
    "outputContract": "输出职业定位、主属性、熟练、职业资源、每级能力和限制。"
  },
  {
    "id": "SpecializationLogic",
    "name": "子职业、专精或流派系统",
    "logic": "将子职业、流派、专精、路线、学派抽象为 specialization logic。",
    "aliasScope": "子职业/专精/流派/分支",
    "aliases": [
      "子职业",
      "专精",
      "流派",
      "分支",
      "学派",
      "subclass",
      "specialization",
      "archetype"
    ],
    "crossWorkTerms": [
      "剑术流派",
      "魔法学派",
      "神圣领域",
      "契约",
      "血脉",
      "战斗风格",
      "英雄路线",
      "技能树分支"
    ],
    "outputContract": "输出所属职业、解锁条件、分支能力、主题和叙事义务。"
  },
  {
    "id": "BackgroundOriginLogic",
    "name": "背景系统",
    "logic": "将角色出身、经历、社会身份、关系网抽象为 background-origin logic。",
    "aliasScope": "背景/出身/经历/社会身份",
    "aliases": [
      "背景",
      "出身",
      "身世",
      "经历",
      "履历",
      "background",
      "origin",
      "过去身份"
    ],
    "crossWorkTerms": [
      "学园经历",
      "组织成员",
      "前佣兵",
      "贵族",
      "流浪者",
      "实验体",
      "转生者",
      "被召唤者",
      "契约者"
    ],
    "outputContract": "输出技能、工具、语言、人脉、秘密、剧情钩子和初始资源。"
  },
  {
    "id": "ProgressionLogic",
    "name": "等级成长系统",
    "logic": "将等级、经验、突破、升阶、成长曲线抽象为 progression logic。",
    "aliasScope": "等级/成长/经验/突破",
    "aliases": [
      "等级",
      "成长",
      "经验",
      "升级",
      "里程碑",
      "level",
      "progression",
      "EXP",
      "突破"
    ],
    "crossWorkTerms": [
      "阶级提升",
      "灵基再临",
      "命座",
      "星级突破",
      "觉醒",
      "转职",
      "修炼境界",
      "技能升级"
    ],
    "outputContract": "输出升级条件、每级收益、资源上限变化和未来成长路径。"
  },
  {
    "id": "ProficiencySkillLogic",
    "name": "技能与熟练系统",
    "logic": "将技能、熟练、工具掌握、语言掌握抽象为 proficiency-skill logic。",
    "aliasScope": "技能/熟练/掌握/专精",
    "aliases": [
      "技能",
      "熟练",
      "专精",
      "掌握",
      "工具熟练",
      "语言",
      "proficiency",
      "skill"
    ],
    "crossWorkTerms": [
      "生活技能",
      "战斗熟练",
      "武器掌握",
      "工艺",
      "料理",
      "锻造",
      " hacking",
      "驾驶",
      "魔法适性",
      "适格率"
    ],
    "outputContract": "输出熟练类型、来源、加值方式、适用场景和重复处理。"
  },
  {
    "id": "FeatTraitLogic",
    "name": "专长、天赋与特性系统",
    "logic": "将天赋、被动、特性、专长、固有技能抽象为 feat-trait logic。",
    "aliasScope": "专长/天赋/特性/被动",
    "aliases": [
      "专长",
      "天赋",
      "特性",
      "被动",
      "固有技能",
      "feat",
      "trait",
      "talent",
      "passive"
    ],
    "crossWorkTerms": [
      "个性",
      "固有结界",
      "血统特性",
      "异能特质",
      "祝福",
      "诅咒",
      "称号效果",
      "羁绊被动"
    ],
    "outputContract": "输出来源、前置、触发、效果、叠加、限制和例外覆盖。"
  },
  {
    "id": "EquipmentBuildLogic",
    "name": "装备构建系统",
    "logic": "将角色拥有并可使用的装备集合抽象为 equipment build logic。",
    "aliasScope": "装备/装配/构筑",
    "aliases": [
      "装备",
      "构筑",
      "装配",
      "武装",
      "gear",
      "equipment",
      "loadout",
      "build"
    ],
    "crossWorkTerms": [
      "圣遗物",
      "礼装",
      "舰装",
      "武器盘",
      "护符",
      "芯片",
      "机体配置",
      "套装",
      "饰品槽"
    ],
    "outputContract": "输出装备来源、权限、槽位、限制、调谐、效果引用和负重。"
  },
  {
    "id": "AbilityListLogic",
    "name": "法术与能力列表系统",
    "logic": "将角色当前可用能力清单抽象为 ability list logic。",
    "aliasScope": "能力列表/法术书/技能栏",
    "aliases": [
      "能力列表",
      "技能栏",
      "法术书",
      "已知法术",
      "准备法术",
      "ability list",
      "spellbook"
    ],
    "crossWorkTerms": [
      "技能组",
      "卡组",
      "招式表",
      "宝具列表",
      "指令卡",
      "战技列表",
      "奥义栏",
      "召唤列表"
    ],
    "outputContract": "输出已知/已准备/可用能力、消耗、冷却、来源和当前可行动作。"
  },
  {
    "id": "RoleTacticLogic",
    "name": "角色定位与战术角色系统",
    "logic": "将角色队内职责、战斗定位、探索定位抽象为 role tactic logic。",
    "aliasScope": "定位/战术职责/队伍角色",
    "aliases": [
      "定位",
      "职责",
      "战术角色",
      "队伍角色",
      "role",
      "tactic",
      "position"
    ],
    "crossWorkTerms": [
      "主C",
      "副C",
      "坦克",
      "治疗",
      "辅助",
      "控制",
      "侦查",
      "谈判者",
      "召唤者",
      "指挥者",
      "斥候"
    ],
    "outputContract": "输出主要职责、次要职责、短板、协同对象和建议行动。"
  },
  {
    "id": "CharacterSnapshotLogic",
    "name": "角色状态快照系统",
    "logic": "将角色当前生命、资源、状态、位置、关系抽象为 character snapshot logic。",
    "aliasScope": "当前状态/角色快照/动态状态",
    "aliases": [
      "状态快照",
      "当前状态",
      "角色状态",
      "角色记录",
      "snapshot",
      "current state"
    ],
    "crossWorkTerms": [
      "HP当前值",
      "蓝量",
      "冷却",
      "负伤",
      "精神状态",
      "当前位置",
      "装备中",
      "任务目标",
      "临时效果"
    ],
    "outputContract": "输出当前数值、资源、装备、位置、关系、剧情标记和待处理判定。"
  }
],
  edges: [
  {
    "from": "AttributeLogic",
    "to": "ProficiencySkillLogic",
    "relation": "ATTRIBUTE_MODIFIES_SKILL"
  },
  {
    "from": "SpeciesLineageLogic",
    "to": "AttributeLogic",
    "relation": "LINEAGE_MAY_MODIFY_ATTRIBUTE"
  },
  {
    "from": "ClassLogic",
    "to": "AbilityListLogic",
    "relation": "CLASS_GRANTS_ABILITIES"
  },
  {
    "from": "SpecializationLogic",
    "to": "ClassLogic",
    "relation": "SPECIALIZATION_EXTENDS_CLASS"
  },
  {
    "from": "BackgroundOriginLogic",
    "to": "ProficiencySkillLogic",
    "relation": "BACKGROUND_GRANTS_PROFICIENCY"
  },
  {
    "from": "ProgressionLogic",
    "to": "ClassLogic",
    "relation": "PROGRESSION_UNLOCKS_CLASS_FEATURES"
  },
  {
    "from": "FeatTraitLogic",
    "to": "AbilityListLogic",
    "relation": "TRAIT_MAY_GRANT_ABILITY"
  },
  {
    "from": "EquipmentBuildLogic",
    "to": "AbilityListLogic",
    "relation": "EQUIPMENT_MAY_GRANT_ABILITY"
  },
  {
    "from": "CharacterSnapshotLogic",
    "to": "AbilityListLogic",
    "relation": "SNAPSHOT_FILTERS_CURRENT_AVAILABLE_ABILITIES"
  },
  {
    "from": "RoleTacticLogic",
    "to": "AbilityListLogic",
    "relation": "TACTIC_SELECTS_RECOMMENDED_ABILITY"
  },
  {
    "from": "CharacterSnapshotLogic",
    "to": "ProgressionLogic",
    "relation": "SNAPSHOT_RECORDS_GROWTH_STATE"
  }
],
  resolve(query) {
    return resolveSystem(query, this.systems);
  },
  plan(query) {
    return buildRetrievalPlan(query, this);
  }
};

module.exports = CharacterConstructionLayerGraphRAG;
