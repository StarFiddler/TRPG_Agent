/**
 * NarrativeRuntimeLayerGraphRAG
 * 层级：叙事运行层
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


const NarrativeRuntimeLayerGraphRAG = {
  layerId: "L4_NARRATIVE_RUNTIME",
  layerName: "叙事运行层",
  description: `负责把世界观、地图、场景、关系、派系、任务、线索、冲突、遭遇节点、战役状态、时间推进与裁定映射为战役运行 logic。该层回答“当前故事中发生了什么，以及规则如何作用于故事”。`,
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
    "id": "WorldviewLogic",
    "name": "世界观系统",
    "logic": "将作品世界基本设定、历史、魔法/科技规律抽象为 worldview logic。",
    "aliasScope": "世界观/背景设定/宇宙规则",
    "aliases": [
      "世界观",
      "背景设定",
      "宇宙规则",
      "世界规则",
      "worldview",
      "lore",
      "setting"
    ],
    "crossWorkTerms": [
      "魔法体系",
      "科技水平",
      "神话结构",
      "阵营结构",
      "历史年表",
      "灾厄",
      "圣杯战争",
      "异世界法则"
    ],
    "outputContract": "输出时代、核心冲突、文明、禁忌、能力限制和世界规则差异。"
  },
  {
    "id": "MapLocationLogic",
    "name": "地图与地点系统",
    "logic": "将地点、区域、地图连接、地牢、据点抽象为 map-location logic。",
    "aliasScope": "地图/地点/区域/地牢",
    "aliases": [
      "地图",
      "地点",
      "区域",
      "地牢",
      "据点",
      "location",
      "map",
      "area"
    ],
    "crossWorkTerms": [
      "开放世界区域",
      "城市",
      "村庄",
      "迷宫",
      "副本",
      "关卡",
      "安全区",
      "传送点",
      "赐福",
      "篝火"
    ],
    "outputContract": "输出位置、相邻关系、进入条件、危险等级、可触发内容。"
  },
  {
    "id": "SceneLogic",
    "name": "场景系统",
    "logic": "将当前房间、战场、对话场景、旅行节点抽象为 scene logic。",
    "aliasScope": "场景/当前局面/战场",
    "aliases": [
      "场景",
      "当前场景",
      "局面",
      "战场",
      "房间",
      "scene",
      "situation"
    ],
    "crossWorkTerms": [
      "当前房间",
      "战斗地图",
      "对话现场",
      "潜入区域",
      "追逐现场",
      "营地现场",
      "过场节点"
    ],
    "outputContract": "输出参与者、环境、威胁、出口、可互动对象和待处理判定。"
  },
  {
    "id": "NPCRelationshipNetworkLogic",
    "name": "NPC 与关系网络系统",
    "logic": "将角色关系、态度、信任、敌意、羁绊抽象为 relationship network logic。",
    "aliasScope": "关系/好感/态度/羁绊",
    "aliases": [
      "关系",
      "好感",
      "态度",
      "信任",
      "敌意",
      "羁绊",
      "relationship",
      "affinity"
    ],
    "crossWorkTerms": [
      "亲密度",
      "信赖度",
      "仇恨",
      "背叛",
      "依赖",
      "交易关系",
      "师徒关系",
      "宿敌",
      "隐藏关系"
    ],
    "outputContract": "输出关系双方、强度、历史事件、改善/恶化条件和触发内容。"
  },
  {
    "id": "FactionLogic",
    "name": "派系系统",
    "logic": "将组织、国家、教会、学院、阵营势力抽象为 faction logic。",
    "aliasScope": "派系/组织/阵营/势力",
    "aliases": [
      "派系",
      "组织",
      "阵营",
      "势力",
      "国家",
      "公会",
      "faction",
      "organization"
    ],
    "crossWorkTerms": [
      "教会",
      "学院",
      "商会",
      "盗贼公会",
      "军团",
      "家族",
      "邪教",
      "舰队",
      "学园阵营"
    ],
    "outputContract": "输出目标、资源、领地、成员、声望、敌友关系和当前状态。"
  },
  {
    "id": "QuestLogic",
    "name": "任务系统",
    "logic": "将主线、支线、角色任务、派系任务抽象为 quest state machine logic。",
    "aliasScope": "任务/委托/剧情线",
    "aliases": [
      "任务",
      "委托",
      "主线",
      "支线",
      "剧情线",
      "quest",
      "mission"
    ],
    "crossWorkTerms": [
      "角色个人线",
      "羁绊任务",
      "派系任务",
      "隐藏任务",
      "限时任务",
      "每日任务",
      "事件任务",
      "调查目标"
    ],
    "outputContract": "输出任务阶段、目标、完成/失败条件、关联对象、奖励和后续节点。"
  },
  {
    "id": "ClueInfoLogic",
    "name": "线索与信息系统",
    "logic": "将线索、谣言、证词、地图、痕迹、情报抽象为 clue-info logic。",
    "aliasScope": "线索/情报/信息/证据",
    "aliases": [
      "线索",
      "情报",
      "信息",
      "证据",
      "谣言",
      "clue",
      "intel",
      "evidence"
    ],
    "crossWorkTerms": [
      "书信",
      "预言",
      "现场痕迹",
      "怪物踪迹",
      "魔法残留",
      "日志",
      "档案",
      "地图碎片",
      "证词"
    ],
    "outputContract": "输出发现方式、难度、关联任务、真实含义、误导性和发现状态。"
  },
  {
    "id": "ConflictLogic",
    "name": "冲突系统",
    "logic": "将阵营冲突、个人恩怨、资源争夺、世界危机抽象为 conflict logic。",
    "aliasScope": "冲突/危机/战争/矛盾",
    "aliases": [
      "冲突",
      "危机",
      "战争",
      "矛盾",
      "恩怨",
      "conflict",
      "crisis"
    ],
    "crossWorkTerms": [
      "派系战争",
      "追杀",
      "阴谋",
      "资源争夺",
      "宗教冲突",
      "灾难倒计时",
      "复仇",
      "世界危机"
    ],
    "outputContract": "输出冲突双方、原因、阶段、升级/缓和条件和后果。"
  },
  {
    "id": "EncounterNodeLogic",
    "name": "遭遇节点系统",
    "logic": "将叙事中的固定/条件/随机遭遇节点抽象为 encounter node logic。",
    "aliasScope": "遭遇节点/触发事件/场景事件",
    "aliases": [
      "遭遇节点",
      "触发事件",
      "场景事件",
      "encounter node",
      "event node"
    ],
    "crossWorkTerms": [
      "Boss遭遇",
      "伏击节点",
      "谈判节点",
      "追击事件",
      "潜入节点",
      "随机事件",
      "剧情战节点"
    ],
    "outputContract": "输出触发地点、条件、参与者、初始态势、绕过方式和后续变化。"
  },
  {
    "id": "CampaignStateLogic",
    "name": "战役状态系统",
    "logic": "将当前战役动态记忆、世界状态、任务状态抽象为 campaign state logic。",
    "aliasScope": "战役状态/世界状态/当前进度",
    "aliases": [
      "战役状态",
      "世界状态",
      "当前进度",
      "存档",
      "campaign state",
      "world state"
    ],
    "crossWorkTerms": [
      "已完成任务",
      "进行中任务",
      "NPC存活",
      "地区控制权",
      "玩家选择",
      "当前时间",
      "当前地点",
      "队伍资源",
      "剧情标记"
    ],
    "outputContract": "输出当前时间、地点、队伍、任务、派系、NPC、地区和选择记录。"
  },
  {
    "id": "TimeProgressionLogic",
    "name": "时间推进系统",
    "logic": "将昼夜、日程、倒计时、刷新、派系行动抽象为 time progression logic。",
    "aliasScope": "时间/日程/倒计时/刷新",
    "aliases": [
      "时间",
      "日程",
      "倒计时",
      "刷新",
      "昼夜",
      "time",
      "schedule",
      "timer"
    ],
    "crossWorkTerms": [
      "每日刷新",
      "季节",
      "商店刷新",
      "巡逻路线",
      "敌人行动",
      "任务期限",
      "灾难进度",
      "世界事件推进"
    ],
    "outputContract": "输出时间单位、推进触发器、日程、期限、世界事件和错过后果。"
  },
  {
    "id": "GMAdjudicationHomebrewLogic",
    "name": "GM裁定与自制规则系统",
    "logic": "将临时裁定、桌规、自制机制、世界观特例抽象为 adjudication-homebrew logic。",
    "aliasScope": "裁定/桌规/自制规则/特例",
    "aliases": [
      "裁定",
      "桌规",
      "自制规则",
      "特例",
      "GM裁定",
      "homebrew",
      "adjudication"
    ],
    "crossWorkTerms": [
      "临时规则",
      "世界观特例",
      "自制职业",
      "自制装备",
      "自制怪物",
      "版本修正",
      "系统补丁",
      "本桌规则"
    ],
    "outputContract": "输出适用范围、覆盖原规则、生效时间、影响对象和复查条件。"
  }
],
  edges: [
  {
    "from": "WorldviewLogic",
    "to": "MapLocationLogic",
    "relation": "WORLDVIEW_CONSTRAINS_LOCATION"
  },
  {
    "from": "MapLocationLogic",
    "to": "SceneLogic",
    "relation": "LOCATION_CONTAINS_SCENE"
  },
  {
    "from": "SceneLogic",
    "to": "EncounterNodeLogic",
    "relation": "SCENE_MAY_TRIGGER_ENCOUNTER_NODE"
  },
  {
    "from": "NPCRelationshipNetworkLogic",
    "to": "QuestLogic",
    "relation": "RELATIONSHIP_MAY_UNLOCK_QUEST"
  },
  {
    "from": "FactionLogic",
    "to": "NPCRelationshipNetworkLogic",
    "relation": "FACTION_MODIFIES_NPC_ATTITUDE"
  },
  {
    "from": "QuestLogic",
    "to": "ClueInfoLogic",
    "relation": "QUEST_REQUIRES_CLUE"
  },
  {
    "from": "ConflictLogic",
    "to": "FactionLogic",
    "relation": "CONFLICT_INVOLVES_FACTION"
  },
  {
    "from": "EncounterNodeLogic",
    "to": "QuestLogic",
    "relation": "ENCOUNTER_NODE_MAY_ADVANCE_QUEST"
  },
  {
    "from": "CampaignStateLogic",
    "to": "QuestLogic",
    "relation": "CAMPAIGN_STATE_RECORDS_QUEST"
  },
  {
    "from": "CampaignStateLogic",
    "to": "FactionLogic",
    "relation": "CAMPAIGN_STATE_RECORDS_FACTION"
  },
  {
    "from": "TimeProgressionLogic",
    "to": "CampaignStateLogic",
    "relation": "TIME_UPDATES_CAMPAIGN_STATE"
  },
  {
    "from": "GMAdjudicationHomebrewLogic",
    "to": "WorldviewLogic",
    "relation": "HOMEBREW_MAY_OVERRIDE_WORLD_RULE"
  },
  {
    "from": "GMAdjudicationHomebrewLogic",
    "to": "CampaignStateLogic",
    "relation": "ADJUDICATION_WRITES_BACK_TO_CAMPAIGN_STATE"
  }
],
  resolve(query) {
    return resolveSystem(query, this.systems);
  },
  plan(query) {
    return buildRetrievalPlan(query, this);
  }
};

module.exports = NarrativeRuntimeLayerGraphRAG;
