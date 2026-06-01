// Auto-generated TRPG GraphRAG layer schema
// 本文件用于存储层级系统、术语别名、节点类型、边类型与检索策略。

export const graphRAG = {
  "layer": "内容实体层",
  "version": "1.0.0",
  "purpose": "用于将任意 ACGN 作品、Wiki 文档、规则文本或自制设定中的术语映射到 内容实体层 的标准系统 logic，并支持 GraphRAG 检索、归一化与跨系统调用。",
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
      "id": "内容实体层_01",
      "canonicalSystem": "能力实体系统",
      "skillFile": "../skills/Skill_01_能力实体系统.md",
      "aliases": [
        "能力",
        "技能",
        "固有能力",
        "特殊能力",
        "主动技能",
        "被动能力",
        "怪物能力",
        "装备能力",
        "环境能力"
      ],
      "coreObjects": [
        "能力名称",
        "能力类型",
        "来源",
        "触发条件",
        "消耗",
        "目标",
        "范围",
        "效果",
        "失败结果",
        "成功结果"
      ],
      "attributes": [
        "ability_id",
        "ability_name",
        "ability_type",
        "source",
        "trigger",
        "cost",
        "target",
        "range",
        "duration",
        "effect",
        "failure_effect",
        "success_effect",
        "limitations"
      ],
      "dependencies": [
        "法术与能力列表系统",
        "资源消耗系统",
        "状态系统",
        "伤害与治疗系统",
        "规则优先级与例外系统"
      ],
      "edgeTemplates": [
        "AbilityEntity HAS_EFFECT Effect",
        "AbilityEntity CONSUMES Resource",
        "AbilityEntity APPLIES Status",
        "AbilityEntity MODIFIES Rule",
        "SourceTerm MAPS_TO AbilityEntity"
      ],
      "retrievalIntent": "当输入内容涉及能力实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_02",
      "canonicalSystem": "武器实体系统",
      "skillFile": "../skills/Skill_02_武器实体系统.md",
      "aliases": [
        "武器",
        "兵装",
        "武装",
        "装备武器",
        "主武器",
        "副武器",
        "舰装",
        "机体武器",
        "法器",
        "远程武器"
      ],
      "coreObjects": [
        "武器名称",
        "武器类别",
        "攻击方式",
        "伤害类型",
        "射程",
        "重量",
        "特殊属性",
        "熟练需求",
        "附加效果"
      ],
      "attributes": [
        "weapon_id",
        "weapon_name",
        "weapon_category",
        "attack_mode",
        "damage_profile",
        "range",
        "weight",
        "properties",
        "requirements",
        "special_effects",
        "rarity"
      ],
      "dependencies": [
        "装备构建系统",
        "攻击与防御系统",
        "伤害与治疗系统",
        "技能与熟练系统",
        "奖励与掉落系统"
      ],
      "edgeTemplates": [
        "WeaponEntity DEALS DamageType",
        "WeaponEntity REQUIRES Proficiency",
        "Character EQUIPS WeaponEntity",
        "WeaponEntity MODIFIES Attack",
        "WeaponEntity HAS_PROPERTY Property"
      ],
      "retrievalIntent": "当输入内容涉及武器实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_03",
      "canonicalSystem": "护具与防御装备系统",
      "skillFile": "../skills/Skill_03_护具与防御装备系统.md",
      "aliases": [
        "护甲",
        "防具",
        "盾",
        "装甲",
        "护盾",
        "防御饰品",
        "结界",
        "屏障",
        "防御模块",
        "装甲部件"
      ],
      "coreObjects": [
        "护具名称",
        "防御类别",
        "基础防御",
        "限制条件",
        "抗性",
        "特殊防御",
        "装备需求",
        "副作用"
      ],
      "attributes": [
        "armor_id",
        "armor_name",
        "armor_category",
        "defense_value",
        "modifier_limit",
        "requirements",
        "resistances",
        "special_defense",
        "penalties",
        "attunement"
      ],
      "dependencies": [
        "装备构建系统",
        "攻击与防御系统",
        "状态系统",
        "技能与熟练系统",
        "资源消耗系统"
      ],
      "edgeTemplates": [
        "ArmorEntity PROVIDES Defense",
        "ArmorEntity REQUIRES Proficiency",
        "ArmorEntity GRANTS Resistance",
        "ArmorEntity PENALIZES Check",
        "Character EQUIPS ArmorEntity"
      ],
      "retrievalIntent": "当输入内容涉及护具与防御装备系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_04",
      "canonicalSystem": "道具与消耗品系统",
      "skillFile": "../skills/Skill_04_道具与消耗品系统.md",
      "aliases": [
        "道具",
        "消耗品",
        "药水",
        "补给",
        "材料",
        "钥匙",
        "任务物品",
        "弹药",
        "工具",
        "卷轴",
        "料理"
      ],
      "coreObjects": [
        "道具名称",
        "道具类型",
        "使用条件",
        "使用行动",
        "消耗方式",
        "效果",
        "持续时间",
        "制作材料",
        "价格",
        "任务关联"
      ],
      "attributes": [
        "item_id",
        "item_name",
        "item_type",
        "use_condition",
        "action_cost",
        "consumption",
        "effect",
        "duration",
        "crafting_materials",
        "price",
        "quest_link",
        "stack_limit"
      ],
      "dependencies": [
        "装备构建系统",
        "资源消耗系统",
        "探索与旅行系统",
        "任务系统",
        "奖励与掉落系统"
      ],
      "edgeTemplates": [
        "ItemEntity HAS_EFFECT Effect",
        "ItemEntity CONSUMED_BY UseAction",
        "ItemEntity REQUIRED_BY Quest",
        "ItemEntity CRAFTED_FROM Material",
        "Character OWNS ItemEntity"
      ],
      "retrievalIntent": "当输入内容涉及道具与消耗品系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_05",
      "canonicalSystem": "法术实体系统",
      "skillFile": "../skills/Skill_05_法术实体系统.md",
      "aliases": [
        "法术",
        "魔法",
        "术式",
        "咒术",
        "异能",
        "超能力",
        "技能卡",
        "奇迹",
        "祷告",
        "秘术",
        "奥义"
      ],
      "coreObjects": [
        "法术名称",
        "法术等级",
        "法术类别",
        "施放条件",
        "距离",
        "范围",
        "持续时间",
        "豁免",
        "攻击",
        "升阶效果"
      ],
      "attributes": [
        "spell_id",
        "spell_name",
        "spell_level",
        "school_or_type",
        "casting_condition",
        "casting_time",
        "range",
        "area",
        "duration",
        "save_type",
        "attack_type",
        "upcast_effect",
        "components"
      ],
      "dependencies": [
        "法术与能力列表系统",
        "资源消耗系统",
        "状态系统",
        "伤害与治疗系统",
        "规则优先级与例外系统"
      ],
      "edgeTemplates": [
        "SpellEntity IS_A AbilityEntity",
        "SpellEntity CONSUMES Resource",
        "SpellEntity REQUIRES Condition",
        "SpellEntity APPLIES Status",
        "SpellEntity DEALS DamageType"
      ],
      "retrievalIntent": "当输入内容涉及法术实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_06",
      "canonicalSystem": "敌对单位与怪物系统",
      "skillFile": "../skills/Skill_06_敌对单位与怪物系统.md",
      "aliases": [
        "怪物",
        "敌人",
        "敌对单位",
        "Boss",
        "精英怪",
        "小怪",
        "召唤物",
        "野兽",
        "机体",
        "敌方角色"
      ],
      "coreObjects": [
        "单位名称",
        "单位类型",
        "体型",
        "生命",
        "防御",
        "速度",
        "属性",
        "能力",
        "抗性",
        "战术倾向",
        "掉落"
      ],
      "attributes": [
        "creature_id",
        "creature_name",
        "creature_type",
        "size",
        "hp",
        "defense",
        "speed",
        "attributes",
        "skills",
        "senses",
        "resistances",
        "immunities",
        "abilities",
        "tactics",
        "drops"
      ],
      "dependencies": [
        "能力实体系统",
        "武器实体系统",
        "状态系统",
        "遭遇实体系统",
        "奖励与掉落系统",
        "地区生态或世界观系统"
      ],
      "edgeTemplates": [
        "CreatureEntity HAS_ABILITY AbilityEntity",
        "CreatureEntity DROPS Reward",
        "CreatureEntity APPEARS_IN Encounter",
        "CreatureEntity BELONGS_TO Faction",
        "CreatureEntity HAS_RESISTANCE DamageType"
      ],
      "retrievalIntent": "当输入内容涉及敌对单位与怪物系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_07",
      "canonicalSystem": "NPC 实体系统",
      "skillFile": "../skills/Skill_07_NPC 实体系统.md",
      "aliases": [
        "NPC",
        "角色",
        "非玩家角色",
        "商人",
        "导师",
        "任务角色",
        "剧情角色",
        "路人",
        "首领",
        "联系人"
      ],
      "coreObjects": [
        "NPC名称",
        "身份",
        "所属派系",
        "所在地",
        "态度",
        "动机",
        "秘密",
        "交易",
        "任务",
        "战斗能力"
      ],
      "attributes": [
        "npc_id",
        "npc_name",
        "identity",
        "faction",
        "location",
        "attitude",
        "motivation",
        "secrets",
        "services",
        "quests",
        "combat_profile",
        "relationship_state"
      ],
      "dependencies": [
        "社交互动系统",
        "任务系统",
        "派系系统",
        "地点系统",
        "NPC与关系网络系统"
      ],
      "edgeTemplates": [
        "NPCEntity BELONGS_TO Faction",
        "NPCEntity LOCATED_AT Location",
        "NPCEntity OFFERS Quest",
        "NPCEntity SELLS Item",
        "NPCEntity HAS_RELATION_WITH Character"
      ],
      "retrievalIntent": "当输入内容涉及NPC 实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_08",
      "canonicalSystem": "环境实体系统",
      "skillFile": "../skills/Skill_08_环境实体系统.md",
      "aliases": [
        "环境",
        "地形",
        "天气",
        "光照",
        "区域效果",
        "场地效果",
        "污染",
        "异常空间",
        "水域",
        "高温",
        "毒雾",
        "掩体"
      ],
      "coreObjects": [
        "环境名称",
        "环境类型",
        "作用范围",
        "触发条件",
        "影响检定",
        "影响移动",
        "伤害",
        "状态",
        "解除方式"
      ],
      "attributes": [
        "environment_id",
        "environment_name",
        "environment_type",
        "area",
        "trigger",
        "check_modifiers",
        "movement_modifiers",
        "attack_modifiers",
        "damage",
        "status_effects",
        "removal_condition"
      ],
      "dependencies": [
        "探索与旅行系统",
        "攻击与防御系统",
        "状态系统",
        "伤害与治疗系统",
        "地图与地点系统",
        "场景系统"
      ],
      "edgeTemplates": [
        "EnvironmentEntity LOCATED_AT Location",
        "EnvironmentEntity MODIFIES Check",
        "EnvironmentEntity MODIFIES Movement",
        "EnvironmentEntity DEALS Damage",
        "EnvironmentEntity APPLIES Status"
      ],
      "retrievalIntent": "当输入内容涉及环境实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_09",
      "canonicalSystem": "陷阱与机关系统",
      "skillFile": "../skills/Skill_09_陷阱与机关系统.md",
      "aliases": [
        "陷阱",
        "机关",
        "谜题机关",
        "封印",
        "警报",
        "机关门",
        "毒针",
        "落石",
        "传送陷阱",
        "安全系统"
      ],
      "coreObjects": [
        "陷阱名称",
        "陷阱类型",
        "发现难度",
        "解除难度",
        "触发条件",
        "伤害",
        "状态",
        "重置",
        "绕过方式"
      ],
      "attributes": [
        "trap_id",
        "trap_name",
        "trap_type",
        "detection_rule",
        "disarm_rule",
        "trigger_condition",
        "effect",
        "damage",
        "status_effects",
        "reset_rule",
        "bypass_methods",
        "location"
      ],
      "dependencies": [
        "探索与旅行系统",
        "基础检定系统",
        "道具与消耗品系统",
        "环境实体系统",
        "场景系统"
      ],
      "edgeTemplates": [
        "TrapEntity LOCATED_AT Location",
        "TrapEntity TRIGGERED_BY Condition",
        "TrapEntity REQUIRES Check",
        "TrapEntity DEALS Damage",
        "TrapEntity CAN_BE_DISARMED_BY Tool"
      ],
      "retrievalIntent": "当输入内容涉及陷阱与机关系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_10",
      "canonicalSystem": "疾病、毒素与诅咒系统",
      "skillFile": "../skills/Skill_10_疾病、毒素与诅咒系统.md",
      "aliases": [
        "疾病",
        "毒",
        "中毒",
        "诅咒",
        "腐化",
        "污染",
        "寄生",
        "瘟疫",
        "精神侵蚀",
        "侵蚀值",
        "异常感染"
      ],
      "coreObjects": [
        "名称",
        "类型",
        "感染方式",
        "潜伏期",
        "发作周期",
        "豁免",
        "阶段变化",
        "治疗",
        "传播",
        "免疫"
      ],
      "attributes": [
        "affliction_id",
        "affliction_name",
        "affliction_type",
        "transmission",
        "incubation",
        "cycle",
        "save_rule",
        "stages",
        "effects",
        "treatment",
        "cure_condition",
        "immunity_condition"
      ],
      "dependencies": [
        "状态系统",
        "休息与恢复系统",
        "伤害与治疗系统",
        "环境实体系统",
        "战役状态系统"
      ],
      "edgeTemplates": [
        "AfflictionEntity APPLIES Status",
        "AfflictionEntity PROGRESSES_OVER Time",
        "AfflictionEntity REQUIRES Save",
        "AfflictionEntity CURED_BY Treatment",
        "AfflictionEntity SPREADS_TO Character"
      ],
      "retrievalIntent": "当输入内容涉及疾病、毒素与诅咒系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_11",
      "canonicalSystem": "遭遇实体系统",
      "skillFile": "../skills/Skill_11_遭遇实体系统.md",
      "aliases": [
        "遭遇",
        "战斗遭遇",
        "随机遭遇",
        "事件",
        "关卡",
        "副本节点",
        "伏击",
        "谈判场景",
        "追逐",
        "谜题遭遇"
      ],
      "coreObjects": [
        "遭遇名称",
        "遭遇类型",
        "触发条件",
        "参与单位",
        "地点",
        "难度",
        "胜利条件",
        "失败条件",
        "奖励",
        "后续剧情"
      ],
      "attributes": [
        "encounter_id",
        "encounter_name",
        "encounter_type",
        "trigger",
        "participants",
        "location",
        "difficulty",
        "environment",
        "win_condition",
        "fail_condition",
        "rewards",
        "followups",
        "repeatable"
      ],
      "dependencies": [
        "敌对单位与怪物系统",
        "NPC 实体系统",
        "环境实体系统",
        "陷阱与机关系统",
        "奖励与掉落系统",
        "任务系统"
      ],
      "edgeTemplates": [
        "EncounterEntity OCCURS_AT Location",
        "EncounterEntity INCLUDES CreatureEntity",
        "EncounterEntity INCLUDES NPCEntity",
        "EncounterEntity USES EnvironmentEntity",
        "EncounterEntity GRANTS Reward"
      ],
      "retrievalIntent": "当输入内容涉及遭遇实体系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "内容实体层_12",
      "canonicalSystem": "奖励与掉落系统",
      "skillFile": "../skills/Skill_12_奖励与掉落系统.md",
      "aliases": [
        "奖励",
        "掉落",
        "战利品",
        "经验",
        "金币",
        "素材",
        "道具获取",
        "声望奖励",
        "剧情奖励",
        "解锁",
        "成就"
      ],
      "coreObjects": [
        "奖励名称",
        "奖励类型",
        "获取条件",
        "来源",
        "概率",
        "稀有度",
        "任务绑定",
        "地点绑定",
        "是否可重复",
        "剧情影响"
      ],
      "attributes": [
        "reward_id",
        "reward_name",
        "reward_type",
        "acquire_condition",
        "source",
        "drop_rate",
        "rarity",
        "quest_link",
        "location_link",
        "repeatable",
        "narrative_impact"
      ],
      "dependencies": [
        "遭遇实体系统",
        "敌对单位与怪物系统",
        "任务系统",
        "等级成长系统",
        "装备构建系统",
        "派系系统"
      ],
      "edgeTemplates": [
        "RewardEntity DROPPED_BY CreatureEntity",
        "RewardEntity GRANTED_BY Quest",
        "RewardEntity FOUND_AT Location",
        "RewardEntity UNLOCKS Feature",
        "RewardEntity AFFECTS Reputation"
      ],
      "retrievalIntent": "当输入内容涉及奖励与掉落系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
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
