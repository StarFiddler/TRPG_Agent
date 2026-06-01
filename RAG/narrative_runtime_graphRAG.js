// Auto-generated TRPG GraphRAG layer schema
// 本文件用于存储层级系统、术语别名、节点类型、边类型与检索策略。

export const graphRAG = {
  "layer": "叙事运行层",
  "version": "1.0.0",
  "purpose": "用于将任意 ACGN 作品、Wiki 文档、规则文本或自制设定中的术语映射到 叙事运行层 的标准系统 logic，并支持 GraphRAG 检索、归一化与跨系统调用。",
  "terminologyPolicy": {
    "keepSourceTerm": true,
    "createNormalizedTerm": true,
    "mapBySemanticFunctionFirst": true,
    "allowMultipleSourceTermsToOneSystem": true,
    "allowOneSourceTermToMultipleSystems": true,
    "conflictResolution": [
      "优先读取当前战役状态中的桌规与GM裁定。",
      "若作品术语与标准系统术语不同，保留原术语并建立 alias 边。",
      "若同一术语同时具备多种功能，允许建立 multi_map 关系。",
      "若文本证据不足，标记 confidence 并等待人工确认。"
    ]
  },
  "nodeTypes": [
    "Layer",
    "System",
    "Skill",
    "SourceTerm",
    "NormalizedTerm",
    "LogicObject",
    "Attribute",
    "Constraint",
    "StateChange",
    "SourceText",
    "Character",
    "Entity",
    "Scene",
    "Quest",
    "Faction",
    "Location",
    "Ruling"
  ],
  "edgeTypes": [
    "HAS_SYSTEM",
    "USES_SKILL",
    "MAPS_TO",
    "ALIASES",
    "DEPENDS_ON",
    "GRANTS",
    "MODIFIES",
    "CONSTRAINS",
    "TRIGGERS",
    "UPDATES",
    "REFERENCES",
    "OVERRIDES",
    "DERIVED_FROM",
    "APPLIES_TO"
  ],
  "systems": [
    {
      "id": "叙事运行层_01",
      "canonicalSystem": "世界观系统",
      "skillFile": "../skills/Skill_01_世界观系统.md",
      "aliases": [
        "世界观",
        "设定",
        "世界设定",
        "宇宙观",
        "神话",
        "历史背景",
        "时代背景",
        "世界规则",
        "作品设定"
      ],
      "coreObjects": [
        "世界名称",
        "时代",
        "核心冲突",
        "文明",
        "种族关系",
        "魔法来源",
        "科技水平",
        "宗教",
        "政治格局",
        "世界规则差异"
      ],
      "attributes": [
        "world_id",
        "world_name",
        "era",
        "core_conflict",
        "civilizations",
        "species_relations",
        "power_sources",
        "technology_level",
        "religions",
        "politics",
        "world_rules"
      ],
      "dependencies": [
        "种族、血统或物种系统",
        "职业系统",
        "派系系统",
        "地图与地点系统",
        "GM裁定与自制规则系统"
      ],
      "edgeTemplates": [
        "World CONTAINS Region",
        "World DEFINES Faction",
        "World CONSTRAINS CharacterOption",
        "World EXPLAINS PowerSource",
        "World OVERRIDES GenericAssumption"
      ],
      "retrievalIntent": "当输入内容涉及世界观系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_02",
      "canonicalSystem": "地图与地点系统",
      "skillFile": "../skills/Skill_02_地图与地点系统.md",
      "aliases": [
        "地图",
        "地点",
        "区域",
        "城市",
        "村庄",
        "副本",
        "地牢",
        "据点",
        "遗迹",
        "关卡",
        "场景地图"
      ],
      "coreObjects": [
        "地点名称",
        "地点类型",
        "所属区域",
        "相邻地点",
        "进入条件",
        "危险等级",
        "环境",
        "NPC",
        "遭遇",
        "可获取物"
      ],
      "attributes": [
        "location_id",
        "location_name",
        "location_type",
        "parent_region",
        "adjacent_locations",
        "entry_condition",
        "danger_level",
        "environment_tags",
        "npcs",
        "encounters",
        "loot",
        "explored_state"
      ],
      "dependencies": [
        "世界观系统",
        "环境实体系统",
        "遭遇实体系统",
        "NPC 实体系统",
        "探索与旅行系统",
        "任务系统"
      ],
      "edgeTemplates": [
        "Region CONTAINS Location",
        "Location CONNECTS_TO Location",
        "Location CONTAINS NPCEntity",
        "Location CONTAINS EncounterEntity",
        "Location HAS_ENVIRONMENT EnvironmentEntity"
      ],
      "retrievalIntent": "当输入内容涉及地图与地点系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_03",
      "canonicalSystem": "场景系统",
      "skillFile": "../skills/Skill_03_场景系统.md",
      "aliases": [
        "场景",
        "当前场景",
        "房间",
        "战场",
        "对话现场",
        "潜入区域",
        "旅行节点",
        "事件现场",
        "当前局面"
      ],
      "coreObjects": [
        "场景名称",
        "当前地点",
        "参与者",
        "敌人",
        "环境",
        "可互动对象",
        "出口",
        "威胁",
        "隐藏信息",
        "待判定事项"
      ],
      "attributes": [
        "scene_id",
        "scene_name",
        "current_location",
        "participants",
        "hostiles",
        "environment_state",
        "interactive_objects",
        "exits",
        "threats",
        "hidden_info",
        "pending_checks"
      ],
      "dependencies": [
        "地图与地点系统",
        "NPC 实体系统",
        "敌对单位与怪物系统",
        "环境实体系统",
        "遭遇实体系统",
        "战役状态系统"
      ],
      "edgeTemplates": [
        "Scene OCCURS_AT Location",
        "Scene INCLUDES Character",
        "Scene INCLUDES NPCEntity",
        "Scene USES EnvironmentEntity",
        "Scene HAS_PENDING Check"
      ],
      "retrievalIntent": "当输入内容涉及场景系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_04",
      "canonicalSystem": "NPC 与关系网络系统",
      "skillFile": "../skills/Skill_04_NPC 与关系网络系统.md",
      "aliases": [
        "关系",
        "好感",
        "信任",
        "敌意",
        "羁绊",
        "社交关系",
        "人物关系",
        "亲密度",
        "仇恨",
        "阵营态度"
      ],
      "coreObjects": [
        "关系双方",
        "关系类型",
        "关系强度",
        "当前态度",
        "历史事件",
        "改善条件",
        "恶化条件",
        "隐藏关系",
        "欺骗关系"
      ],
      "attributes": [
        "relationship_id",
        "actor_a",
        "actor_b",
        "relationship_type",
        "strength",
        "attitude",
        "history",
        "improve_conditions",
        "worsen_conditions",
        "hidden",
        "deception"
      ],
      "dependencies": [
        "NPC 实体系统",
        "社交互动系统",
        "派系系统",
        "任务系统",
        "战役状态系统"
      ],
      "edgeTemplates": [
        "Actor HAS_RELATION_WITH Actor",
        "Relationship AFFECTS SocialCheck",
        "Relationship MODIFIED_BY Event",
        "Relationship TRIGGERS Quest",
        "Relationship HIDDEN_FROM Character"
      ],
      "retrievalIntent": "当输入内容涉及NPC 与关系网络系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_05",
      "canonicalSystem": "派系系统",
      "skillFile": "../skills/Skill_05_派系系统.md",
      "aliases": [
        "派系",
        "势力",
        "组织",
        "阵营",
        "国家",
        "公会",
        "教会",
        "学院",
        "商会",
        "军团",
        "家族"
      ],
      "coreObjects": [
        "派系名称",
        "目标",
        "资源",
        "领地",
        "成员",
        "盟友",
        "敌人",
        "声望",
        "任务",
        "禁忌",
        "冲突"
      ],
      "attributes": [
        "faction_id",
        "faction_name",
        "goals",
        "resources",
        "territory",
        "members",
        "allies",
        "enemies",
        "reputation",
        "quests",
        "taboos",
        "conflicts",
        "current_state"
      ],
      "dependencies": [
        "世界观系统",
        "NPC 实体系统",
        "任务系统",
        "冲突系统",
        "NPC 与关系网络系统",
        "地图与地点系统"
      ],
      "edgeTemplates": [
        "Faction CONTROLS Location",
        "NPCEntity BELONGS_TO Faction",
        "Faction ALLIED_WITH Faction",
        "Faction OPPOSES Faction",
        "Faction OFFERS Quest"
      ],
      "retrievalIntent": "当输入内容涉及派系系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_06",
      "canonicalSystem": "任务系统",
      "skillFile": "../skills/Skill_06_任务系统.md",
      "aliases": [
        "任务",
        "主线",
        "支线",
        "委托",
        "剧情线",
        "个人任务",
        "派系任务",
        "隐藏任务",
        "限时任务",
        "事件链"
      ],
      "coreObjects": [
        "任务名称",
        "任务类型",
        "发起人",
        "目标",
        "阶段",
        "进度",
        "完成条件",
        "失败条件",
        "奖励",
        "分支",
        "后果"
      ],
      "attributes": [
        "quest_id",
        "quest_name",
        "quest_type",
        "giver",
        "objectives",
        "stages",
        "progress",
        "completion_conditions",
        "failure_conditions",
        "rewards",
        "branches",
        "consequences",
        "time_limit"
      ],
      "dependencies": [
        "NPC 实体系统",
        "派系系统",
        "线索与信息系统",
        "奖励与掉落系统",
        "战役状态系统",
        "时间推进系统"
      ],
      "edgeTemplates": [
        "Quest GIVEN_BY NPCEntity",
        "Quest REQUIRES Clue",
        "Quest TARGETS Location",
        "Quest REWARDS RewardEntity",
        "Quest UPDATES CampaignState"
      ],
      "retrievalIntent": "当输入内容涉及任务系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_07",
      "canonicalSystem": "线索与信息系统",
      "skillFile": "../skills/Skill_07_线索与信息系统.md",
      "aliases": [
        "线索",
        "情报",
        "提示",
        "书信",
        "证词",
        "谣言",
        "痕迹",
        "地图碎片",
        "预言",
        "调查信息"
      ],
      "coreObjects": [
        "线索名称",
        "线索类型",
        "所在地点",
        "发现方式",
        "发现难度",
        "关联任务",
        "真实含义",
        "误导信息",
        "是否已发现"
      ],
      "attributes": [
        "clue_id",
        "clue_name",
        "clue_type",
        "location",
        "discovery_method",
        "difficulty",
        "related_quest",
        "meaning",
        "misdirection",
        "discovered",
        "decoded"
      ],
      "dependencies": [
        "探索与旅行系统",
        "任务系统",
        "NPC 实体系统",
        "地图与地点系统",
        "战役状态系统"
      ],
      "edgeTemplates": [
        "Clue FOUND_AT Location",
        "Clue REVEALS Information",
        "Clue REQUIRED_BY Quest",
        "Clue PROVIDED_BY NPCEntity",
        "Clue UNLOCKS Scene"
      ],
      "retrievalIntent": "当输入内容涉及线索与信息系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_08",
      "canonicalSystem": "冲突系统",
      "skillFile": "../skills/Skill_08_冲突系统.md",
      "aliases": [
        "冲突",
        "战争",
        "阴谋",
        "危机",
        "灾难",
        "派系斗争",
        "追杀",
        "恩怨",
        "资源争夺",
        "世界危机"
      ],
      "coreObjects": [
        "冲突名称",
        "冲突双方",
        "原因",
        "阶段",
        "强度",
        "玩家介入方式",
        "升级条件",
        "缓和条件",
        "后果"
      ],
      "attributes": [
        "conflict_id",
        "conflict_name",
        "sides",
        "cause",
        "stage",
        "intensity",
        "player_intervention",
        "escalation_conditions",
        "deescalation_conditions",
        "consequences",
        "time_progression"
      ],
      "dependencies": [
        "世界观系统",
        "派系系统",
        "任务系统",
        "时间推进系统",
        "战役状态系统",
        "地图与地点系统"
      ],
      "edgeTemplates": [
        "Conflict INVOLVES Faction",
        "Conflict AFFECTS Location",
        "Conflict GENERATES Quest",
        "Conflict PROGRESSES_WITH Time",
        "Conflict UPDATES WorldState"
      ],
      "retrievalIntent": "当输入内容涉及冲突系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_09",
      "canonicalSystem": "遭遇节点系统",
      "skillFile": "../skills/Skill_09_遭遇节点系统.md",
      "aliases": [
        "遭遇节点",
        "事件节点",
        "固定遭遇",
        "随机遭遇",
        "伏击",
        "Boss战",
        "谈判节点",
        "追击节点",
        "剧情节点"
      ],
      "coreObjects": [
        "节点名称",
        "触发地点",
        "触发条件",
        "参与者",
        "初始站位",
        "环境",
        "可交涉条件",
        "胜败条件",
        "后续变化"
      ],
      "attributes": [
        "encounter_node_id",
        "node_name",
        "trigger_location",
        "trigger_condition",
        "participants",
        "initial_positions",
        "environment",
        "negotiation_conditions",
        "win_fail_conditions",
        "followup_changes",
        "triggered"
      ],
      "dependencies": [
        "遭遇实体系统",
        "场景系统",
        "地图与地点系统",
        "敌对单位与怪物系统",
        "NPC 实体系统",
        "奖励与掉落系统"
      ],
      "edgeTemplates": [
        "EncounterNode TRIGGERS EncounterEntity",
        "EncounterNode OCCURS_AT Location",
        "EncounterNode SPAWNS CreatureEntity",
        "EncounterNode UPDATES Scene",
        "EncounterNode GRANTS RewardEntity"
      ],
      "retrievalIntent": "当输入内容涉及遭遇节点系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_10",
      "canonicalSystem": "战役状态系统",
      "skillFile": "../skills/Skill_10_战役状态系统.md",
      "aliases": [
        "战役状态",
        "存档",
        "当前进度",
        "世界状态",
        "队伍状态",
        "剧情状态",
        "任务状态",
        "记录",
        "跑团状态"
      ],
      "coreObjects": [
        "当前时间",
        "当前地点",
        "队伍成员",
        "队伍资源",
        "任务状态",
        "NPC状态",
        "派系状态",
        "地区状态",
        "玩家选择",
        "后果记录"
      ],
      "attributes": [
        "campaign_state_id",
        "current_time",
        "current_location",
        "party_members",
        "party_resources",
        "quest_states",
        "npc_states",
        "faction_states",
        "region_states",
        "choices",
        "consequences",
        "gm_rulings"
      ],
      "dependencies": [
        "场景系统",
        "任务系统",
        "NPC 与关系网络系统",
        "派系系统",
        "时间推进系统",
        "角色状态快照系统"
      ],
      "edgeTemplates": [
        "CampaignState STORES QuestState",
        "CampaignState STORES NPCState",
        "CampaignState STORES FactionState",
        "CampaignState CONSTRAINS Scene",
        "CampaignState UPDATED_BY Event"
      ],
      "retrievalIntent": "当输入内容涉及战役状态系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_11",
      "canonicalSystem": "时间推进系统",
      "skillFile": "../skills/Skill_11_时间推进系统.md",
      "aliases": [
        "时间",
        "日程",
        "昼夜",
        "倒计时",
        "刷新",
        "期限",
        "巡逻",
        "季节",
        "事件推进",
        "世界时钟"
      ],
      "coreObjects": [
        "当前时间",
        "时间单位",
        "时间流速",
        "NPC日程",
        "派系计划",
        "任务期限",
        "天气变化",
        "资源消耗",
        "错过事件"
      ],
      "attributes": [
        "time_id",
        "current_time",
        "time_unit",
        "time_scale",
        "npc_schedules",
        "faction_plans",
        "quest_deadlines",
        "weather_cycle",
        "resource_consumption",
        "missed_events"
      ],
      "dependencies": [
        "战役状态系统",
        "任务系统",
        "派系系统",
        "NPC 实体系统",
        "地图与地点系统",
        "休息与恢复系统"
      ],
      "edgeTemplates": [
        "TimeState ADVANCES Quest",
        "TimeState TRIGGERS Event",
        "TimeState MOVES NPCEntity",
        "TimeState UPDATES FactionPlan",
        "TimeState CONSUMES Resource"
      ],
      "retrievalIntent": "当输入内容涉及时间推进系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "叙事运行层_12",
      "canonicalSystem": "GM裁定与自制规则系统",
      "skillFile": "../skills/Skill_12_GM裁定与自制规则系统.md",
      "aliases": [
        "GM裁定",
        "桌规",
        "自制规则",
        "临时规则",
        "房规",
        "特殊裁定",
        "世界观特例",
        "规则补丁",
        "模组规则"
      ],
      "coreObjects": [
        "裁定名称",
        "裁定原因",
        "适用范围",
        "覆盖原规则",
        "生效时间",
        "影响对象",
        "冲突处理",
        "复查条件"
      ],
      "attributes": [
        "ruling_id",
        "ruling_name",
        "reason",
        "scope",
        "overridden_rule",
        "effective_time",
        "affected_objects",
        "conflict_resolution",
        "review_condition",
        "duration"
      ],
      "dependencies": [
        "规则优先级与例外系统",
        "世界观系统",
        "战役状态系统",
        "角色构建层所有系统",
        "内容实体层所有系统"
      ],
      "edgeTemplates": [
        "GMRuling OVERRIDES Rule",
        "GMRuling APPLIES_TO System",
        "GMRuling STORED_IN CampaignState",
        "GMRuling CREATED_BY GM",
        "GMRuling HAS_REVIEW_CONDITION Condition"
      ],
      "retrievalIntent": "当输入内容涉及GM裁定与自制规则系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    }
  ]
};

export function normalizeTerm(term) {
  const result = [];
  for (const system of graphRAG.systems) {
    const candidates = [system.canonicalSystem, ...system.aliases];
    if (candidates.some(alias => String(term).toLowerCase().includes(String(alias).toLowerCase()) || String(alias).toLowerCase().includes(String(term).toLowerCase()))) {
      result.push({
        sourceTerm: term,
        mappedSystem: system.canonicalSystem,
        skillFile: system.skillFile,
        confidence: 0.75,
        reason: 'term_alias_or_semantic_overlap'
      });
    }
  }
  return result;
}

export function retrieveSystemLogic(input) {
  const text = typeof input === 'string' ? input : JSON.stringify(input);
  const hits = [];
  for (const system of graphRAG.systems) {
    const candidates = [system.canonicalSystem, ...system.aliases, ...system.coreObjects];
    const score = candidates.reduce((acc, term) => acc + (text.includes(term) ? 1 : 0), 0);
    if (score > 0) hits.push({ system: system.canonicalSystem, skillFile: system.skillFile, score });
  }
  return hits.sort((a, b) => b.score - a.score);
}
