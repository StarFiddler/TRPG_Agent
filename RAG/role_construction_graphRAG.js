// Auto-generated TRPG GraphRAG layer schema
// 本文件用于存储层级系统、术语别名、节点类型、边类型与检索策略。

export const graphRAG = {
  "layer": "角色构建层",
  "version": "1.0.0",
  "purpose": "用于将任意 ACGN 作品、Wiki 文档、规则文本或自制设定中的术语映射到 角色构建层 的标准系统 logic，并支持 GraphRAG 检索、归一化与跨系统调用。",
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
      "id": "角色构建层_01",
      "canonicalSystem": "基础属性系统",
      "skillFile": "../skills/Skill_01_基础属性系统.md",
      "aliases": [
        "属性",
        "能力值",
        "六维",
        "三围",
        "资质",
        "参数",
        "能力参数",
        "力量/敏捷/体质",
        "HP以外的基础能力"
      ],
      "coreObjects": [
        "核心属性",
        "属性值",
        "属性修正",
        "属性成长",
        "属性上限与下限",
        "临时属性变化",
        "永久属性变化"
      ],
      "attributes": [
        "attribute_id",
        "attribute_name",
        "source_term",
        "normalized_term",
        "value",
        "modifier",
        "growth_rule",
        "cap_rule",
        "affected_checks",
        "affected_resources"
      ],
      "dependencies": [
        "检定系统",
        "技能与熟练系统",
        "职业系统",
        "等级成长系统",
        "装备构建系统",
        "角色状态快照系统"
      ],
      "edgeTemplates": [
        "Character HAS_ATTRIBUTE Attribute",
        "Attribute MODIFIES Check",
        "Attribute AFFECTS Resource",
        "SourceTerm MAPS_TO Attribute",
        "Attribute DERIVED_FROM SourceText"
      ],
      "retrievalIntent": "当输入内容涉及基础属性系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_02",
      "canonicalSystem": "种族、血统或物种系统",
      "skillFile": "../skills/Skill_02_种族、血统或物种系统.md",
      "aliases": [
        "种族",
        "血统",
        "物种",
        "族裔",
        "出身种族",
        "生物类别",
        "异能血脉",
        "舰种",
        "机体类型",
        "妖怪种类"
      ],
      "coreObjects": [
        "种族名称",
        "血统分支",
        "体型",
        "感官",
        "移动方式",
        "天生能力",
        "天生抗性",
        "语言或交流方式",
        "文化关系"
      ],
      "attributes": [
        "species_id",
        "species_name",
        "lineage",
        "body_type",
        "movement_modes",
        "senses",
        "innate_traits",
        "resistances",
        "languages",
        "culture_tags",
        "restrictions"
      ],
      "dependencies": [
        "基础属性系统",
        "背景系统",
        "职业系统",
        "专长、天赋与特性系统",
        "NPC与关系网络系统",
        "世界观系统"
      ],
      "edgeTemplates": [
        "Character HAS_SPECIES Species",
        "Species GRANTS Trait",
        "Species MODIFIES Attribute",
        "Species AFFECTS SocialReaction",
        "SourceTerm MAPS_TO Species"
      ],
      "retrievalIntent": "当输入内容涉及种族、血统或物种系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_03",
      "canonicalSystem": "职业系统",
      "skillFile": "../skills/Skill_03_职业系统.md",
      "aliases": [
        "职业",
        "职阶",
        "职业定位",
        "Class",
        "Job",
        "战斗职业",
        "角色职业",
        "从者职阶",
        "单位职业",
        "门派"
      ],
      "coreObjects": [
        "职业名称",
        "职业定位",
        "主属性",
        "生命成长",
        "熟练项",
        "职业资源",
        "职业能力",
        "职业等级",
        "装备权限"
      ],
      "attributes": [
        "class_id",
        "class_name",
        "role_tags",
        "primary_attributes",
        "hit_growth",
        "proficiencies",
        "class_resources",
        "class_features",
        "equipment_access",
        "level_table"
      ],
      "dependencies": [
        "基础属性系统",
        "技能与熟练系统",
        "等级成长系统",
        "子职业、专精或流派系统",
        "法术与能力列表系统",
        "装备构建系统"
      ],
      "edgeTemplates": [
        "Character HAS_CLASS Class",
        "Class GRANTS Feature",
        "Class GRANTS Proficiency",
        "Class UNLOCKS Resource",
        "Class HAS_LEVEL_TABLE LevelTable"
      ],
      "retrievalIntent": "当输入内容涉及职业系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_04",
      "canonicalSystem": "子职业、专精或流派系统",
      "skillFile": "../skills/Skill_04_子职业、专精或流派系统.md",
      "aliases": [
        "子职业",
        "专精",
        "流派",
        "学派",
        "分支",
        "路线",
        "誓言",
        "领域",
        "血脉",
        "契约",
        "武技风格"
      ],
      "coreObjects": [
        "分支名称",
        "所属职业",
        "解锁条件",
        "核心主题",
        "分支能力",
        "资源变化",
        "叙事义务"
      ],
      "attributes": [
        "subclass_id",
        "parent_class",
        "unlock_condition",
        "theme",
        "features",
        "resource_modifiers",
        "restrictions",
        "narrative_duties",
        "synergy_tags"
      ],
      "dependencies": [
        "职业系统",
        "专长、天赋与特性系统",
        "法术与能力列表系统",
        "资源消耗系统",
        "世界观系统"
      ],
      "edgeTemplates": [
        "Subclass BELONGS_TO Class",
        "Subclass GRANTS Feature",
        "Subclass MODIFIES Resource",
        "Subclass REQUIRES Condition",
        "SourceTerm MAPS_TO Subclass"
      ],
      "retrievalIntent": "当输入内容涉及子职业、专精或流派系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_05",
      "canonicalSystem": "背景系统",
      "skillFile": "../skills/Skill_05_背景系统.md",
      "aliases": [
        "背景",
        "出身",
        "履历",
        "过去经历",
        "身份",
        "社会阶层",
        "所属组织",
        "前职业",
        "个人历史"
      ],
      "coreObjects": [
        "背景名称",
        "社会身份",
        "过往经历",
        "人脉",
        "背景特性",
        "起始资源",
        "秘密",
        "剧情钩子"
      ],
      "attributes": [
        "background_id",
        "background_name",
        "identity",
        "history_tags",
        "granted_skills",
        "granted_tools",
        "contacts",
        "starting_items",
        "secrets",
        "plot_hooks",
        "reputation"
      ],
      "dependencies": [
        "技能与熟练系统",
        "装备构建系统",
        "NPC与关系网络系统",
        "派系系统",
        "任务系统"
      ],
      "edgeTemplates": [
        "Character HAS_BACKGROUND Background",
        "Background GRANTS Proficiency",
        "Background CONNECTS_TO NPC",
        "Background AFFECTS Reputation",
        "Background TRIGGERS QuestHook"
      ],
      "retrievalIntent": "当输入内容涉及背景系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_06",
      "canonicalSystem": "等级成长系统",
      "skillFile": "../skills/Skill_06_等级成长系统.md",
      "aliases": [
        "等级",
        "成长",
        "突破",
        "升阶",
        "进化",
        "星级",
        "练度",
        "经验值",
        "里程碑",
        "技能树进度"
      ],
      "coreObjects": [
        "当前等级",
        "总等级",
        "经验值",
        "升级条件",
        "等级收益",
        "能力解锁",
        "资源成长",
        "属性提升"
      ],
      "attributes": [
        "progression_id",
        "current_level",
        "total_level",
        "experience",
        "milestone",
        "level_rewards",
        "attribute_increase",
        "feature_unlocks",
        "resource_growth",
        "future_path"
      ],
      "dependencies": [
        "职业系统",
        "子职业、专精或流派系统",
        "基础属性系统",
        "专长、天赋与特性系统",
        "法术与能力列表系统"
      ],
      "edgeTemplates": [
        "Character HAS_LEVEL Progression",
        "Progression UNLOCKS Feature",
        "Progression INCREASES Attribute",
        "Progression MODIFIES Resource",
        "Progression ENABLES Subclass"
      ],
      "retrievalIntent": "当输入内容涉及等级成长系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_07",
      "canonicalSystem": "技能与熟练系统",
      "skillFile": "../skills/Skill_07_技能与熟练系统.md",
      "aliases": [
        "技能",
        "熟练",
        "熟练度",
        "专精",
        "掌握",
        "训练",
        "精通",
        "工具能力",
        "语言能力",
        "武器适性"
      ],
      "coreObjects": [
        "技能项",
        "熟练类型",
        "熟练来源",
        "熟练倍率",
        "临时熟练",
        "适用场景",
        "重复获得处理"
      ],
      "attributes": [
        "proficiency_id",
        "proficiency_name",
        "category",
        "source",
        "bonus_type",
        "multiplier",
        "temporary",
        "applicable_contexts",
        "duplicate_rule"
      ],
      "dependencies": [
        "基础属性系统",
        "职业系统",
        "背景系统",
        "装备构建系统",
        "规则执行层检定系统"
      ],
      "edgeTemplates": [
        "Character HAS_PROFICIENCY Proficiency",
        "Proficiency APPLIES_TO Check",
        "Class GRANTS Proficiency",
        "Background GRANTS Proficiency",
        "Equipment REQUIRES Proficiency"
      ],
      "retrievalIntent": "当输入内容涉及技能与熟练系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_08",
      "canonicalSystem": "专长、天赋与特性系统",
      "skillFile": "../skills/Skill_08_专长、天赋与特性系统.md",
      "aliases": [
        "专长",
        "天赋",
        "特性",
        "被动",
        "固有技能",
        "个性",
        "命座",
        "羁绊能力",
        "祝福",
        "诅咒",
        "被动技能"
      ],
      "coreObjects": [
        "特性名称",
        "获得来源",
        "前置条件",
        "触发条件",
        "主动或被动",
        "使用限制",
        "规则例外",
        "叠加关系"
      ],
      "attributes": [
        "trait_id",
        "trait_name",
        "source",
        "prerequisites",
        "trigger",
        "active_or_passive",
        "effect",
        "usage_limit",
        "stacking_rule",
        "exception_rule"
      ],
      "dependencies": [
        "种族、血统或物种系统",
        "职业系统",
        "等级成长系统",
        "法术与能力列表系统",
        "规则优先级与例外系统"
      ],
      "edgeTemplates": [
        "Character HAS_TRAIT Trait",
        "Trait REQUIRES Condition",
        "Trait MODIFIES Rule",
        "Trait GRANTS Ability",
        "Trait OVERRIDES GeneralRule"
      ],
      "retrievalIntent": "当输入内容涉及专长、天赋与特性系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_09",
      "canonicalSystem": "装备构建系统",
      "skillFile": "../skills/Skill_09_装备构建系统.md",
      "aliases": [
        "装备",
        "武器配置",
        "护甲配置",
        "圣遗物",
        "饰品",
        "遗物",
        "芯片",
        "机体部件",
        "道具栏",
        "负重"
      ],
      "coreObjects": [
        "装备槽位",
        "已装备物品",
        "装备权限",
        "起始装备",
        "调谐或绑定",
        "负重",
        "装备效果",
        "装备限制"
      ],
      "attributes": [
        "equipment_build_id",
        "slots",
        "equipped_items",
        "inventory_items",
        "attunement",
        "load",
        "requirements",
        "granted_effects",
        "restrictions",
        "durability"
      ],
      "dependencies": [
        "武器实体系统",
        "护具与防御装备系统",
        "道具与消耗品系统",
        "技能与熟练系统",
        "角色状态快照系统"
      ],
      "edgeTemplates": [
        "Character EQUIPS Item",
        "EquipmentBuild REFERENCES ItemEntity",
        "Item REQUIRES Proficiency",
        "Item GRANTS Effect",
        "EquipmentBuild MODIFIES CharacterState"
      ],
      "retrievalIntent": "当输入内容涉及装备构建系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_10",
      "canonicalSystem": "法术与能力列表系统",
      "skillFile": "../skills/Skill_10_法术与能力列表系统.md",
      "aliases": [
        "法术列表",
        "技能列表",
        "能力列表",
        "招式",
        "武技",
        "必杀技",
        "主动技能",
        "可用指令",
        "卡组",
        "技能栏"
      ],
      "coreObjects": [
        "已知能力",
        "已准备能力",
        "可用能力",
        "冷却",
        "消耗",
        "来源",
        "目标",
        "持续时间",
        "关联状态"
      ],
      "attributes": [
        "ability_list_id",
        "known_abilities",
        "prepared_abilities",
        "available_abilities",
        "cooldowns",
        "costs",
        "sources",
        "targets",
        "durations",
        "linked_status"
      ],
      "dependencies": [
        "职业系统",
        "子职业、专精或流派系统",
        "专长、天赋与特性系统",
        "法术实体系统",
        "能力实体系统",
        "资源消耗系统"
      ],
      "edgeTemplates": [
        "Character HAS_ABILITY Ability",
        "Ability DERIVED_FROM Source",
        "Ability CONSUMES Resource",
        "Ability REFERENCES AbilityEntity",
        "Ability APPLIES Status"
      ],
      "retrievalIntent": "当输入内容涉及法术与能力列表系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_11",
      "canonicalSystem": "角色定位与战术角色系统",
      "skillFile": "../skills/Skill_11_角色定位与战术角色系统.md",
      "aliases": [
        "定位",
        "战斗定位",
        "队伍职责",
        "职业角色",
        "前排",
        "输出",
        "辅助",
        "治疗",
        "控制",
        "侦查",
        "谈判者"
      ],
      "coreObjects": [
        "主定位",
        "副定位",
        "战斗职责",
        "探索职责",
        "社交职责",
        "短板",
        "团队协同",
        "推荐行动"
      ],
      "attributes": [
        "role_id",
        "primary_role",
        "secondary_roles",
        "combat_duties",
        "exploration_duties",
        "social_duties",
        "weaknesses",
        "synergies",
        "recommended_actions"
      ],
      "dependencies": [
        "职业系统",
        "基础属性系统",
        "法术与能力列表系统",
        "装备构建系统",
        "角色状态快照系统"
      ],
      "edgeTemplates": [
        "Character HAS_TACTICAL_ROLE TacticalRole",
        "TacticalRole SUGGESTS Action",
        "TacticalRole SYNERGIZES_WITH Character",
        "TacticalRole DEPENDS_ON AbilityList"
      ],
      "retrievalIntent": "当输入内容涉及角色定位与战术角色系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
    },
    {
      "id": "角色构建层_12",
      "canonicalSystem": "角色状态快照系统",
      "skillFile": "../skills/Skill_12_角色状态快照系统.md",
      "aliases": [
        "当前状态",
        "角色快照",
        "状态面板",
        "当前数值",
        "当前资源",
        "角色存档",
        "角色实时状态",
        "行动前状态"
      ],
      "coreObjects": [
        "当前生命",
        "当前资源",
        "当前状态",
        "当前位置",
        "当前装备",
        "当前任务",
        "临时效果",
        "持续效果"
      ],
      "attributes": [
        "snapshot_id",
        "character_id",
        "current_hp",
        "current_resources",
        "current_status",
        "location",
        "equipped_items",
        "active_quests",
        "temporary_effects",
        "persistent_effects",
        "last_updated"
      ],
      "dependencies": [
        "基础属性系统",
        "装备构建系统",
        "法术与能力列表系统",
        "战役状态系统",
        "规则执行层所有系统"
      ],
      "edgeTemplates": [
        "Character HAS_SNAPSHOT CharacterSnapshot",
        "CharacterSnapshot CONSTRAINS Action",
        "CharacterSnapshot REFERENCES Location",
        "CharacterSnapshot STORES ResourceState",
        "CharacterSnapshot UPDATES_AFTER Event"
      ],
      "retrievalIntent": "当输入内容涉及角色状态快照系统或其近似术语时，检索本系统 Skill 并生成对应 logic。"
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
