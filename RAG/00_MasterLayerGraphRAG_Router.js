/**
 * 00_MasterLayerGraphRAG_Router.js
 * 最高级 GraphRAG：四层级抽象路由器
 * 用途：将任意 ACGN 作品名称、wiki 文档、规则片段、实体条目、角色卡、玩家行动或战役记录，优先定位到具体层级 RAG，再由对应层级 RAG 定位到系统 logic。
 *
 * 设计约束：
 * 1. 不直接写死某一作品规则。
 * 2. 对不同作品中的近似术语保持包容性。
 * 3. 先判断“问题属于哪一层”，再判断“属于该层哪个系统”。
 * 4. 保留 aliasTrace，避免把原作品术语直接改写丢失。
 */

const { RuleExecutionLayerGraphRAG } = require("./01_RuleExecutionLayer_AbstractGraphRAG.js");
const { CharacterConstructionLayerGraphRAG } = require("./02_CharacterConstructionLayer_AbstractGraphRAG.js");
const { ContentEntityLayerGraphRAG } = require("./03_ContentEntityLayer_AbstractGraphRAG.js");
const { NarrativeRuntimeLayerGraphRAG } = require("./04_NarrativeRuntimeLayer_AbstractGraphRAG.js");

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


const LayerRouterGraphRAG = {
  graphId: "MASTER_TRPG_ACGN_LAYER_ROUTER_GRAPHRAG",
  graphName: "TRPG / ACGN 通用四层 GraphRAG 路由器",
  purpose: "把输入术语、wiki文本或玩家意图定位到规则执行层、角色构建层、内容实体层或叙事运行层，再交由具体层级 RAG 解析为系统 logic。",
  layers: [
    {
      id: "L1_RULE_EXECUTION",
      name: "规则执行层",
      graphFile: "01_RuleExecutionLayer_AbstractGraphRAG.js",
      graph: RuleExecutionLayerGraphRAG,
      layerQuestion: "现在该如何判定？",
      routingAliases: [
        "判定", "检定", "掷骰", "行动", "攻击", "防御", "伤害", "治疗", "状态", "资源", "休息", "探索", "旅行", "社交", "施法", "技能执行", "规则例外",
        "roll", "check", "action", "attack", "damage", "status", "resource", "rest", "exploration", "social", "spell", "rule"
      ],
      routingExamples: ["我要潜行过去怎么判定", "这个技能如何结算", "中毒状态是否影响攻击", "本回合还能不能移动"]
    },
    {
      id: "L2_CHARACTER_CONSTRUCTION",
      name: "角色构建层",
      graphFile: "02_CharacterConstructionLayer_AbstractGraphRAG.js",
      graph: CharacterConstructionLayerGraphRAG,
      layerQuestion: "角色为什么拥有某能力？",
      routingAliases: [
        "角色", "属性", "种族", "血统", "职业", "子职业", "背景", "等级", "成长", "熟练", "专长", "天赋", "装备构筑", "技能列表", "角色定位", "角色状态快照",
        "character", "attribute", "species", "class", "background", "level", "build", "trait", "proficiency"
      ],
      routingExamples: ["这个角色为什么能用这个技能", "角色职业路线如何生成", "某个作品角色卡如何抽象", "当前角色有哪些可用能力"]
    },
    {
      id: "L3_CONTENT_ENTITY",
      name: "内容实体层",
      graphFile: "03_ContentEntityLayer_AbstractGraphRAG.js",
      graph: ContentEntityLayerGraphRAG,
      layerQuestion: "某个对象的规则属性是什么？",
      routingAliases: [
        "能力实体", "武器", "护具", "道具", "法术", "怪物", "敌人", "NPC", "环境", "陷阱", "机关", "疾病", "毒素", "诅咒", "遭遇", "奖励", "掉落",
        "entity", "weapon", "armor", "item", "spell", "monster", "npc", "environment", "trap", "reward", "loot"
      ],
      routingExamples: ["这把武器的规则属性是什么", "某个敌人如何建模", "这个道具如何转为TRPG实体", "陷阱和机关如何配置"]
    },
    {
      id: "L4_NARRATIVE_RUNTIME",
      name: "叙事运行层",
      graphFile: "04_NarrativeRuntimeLayer_AbstractGraphRAG.js",
      graph: NarrativeRuntimeLayerGraphRAG,
      layerQuestion: "当前故事中发生了什么，以及规则如何作用于故事？",
      routingAliases: [
        "世界观", "地图", "地点", "场景", "关系", "派系", "任务", "线索", "冲突", "遭遇节点", "战役状态", "时间推进", "GM裁定", "自制规则",
        "worldview", "map", "location", "scene", "relationship", "faction", "quest", "clue", "conflict", "campaign", "time", "homebrew"
      ],
      routingExamples: ["当前剧情推进到哪里", "这个NPC和派系是什么关系", "任务阶段如何变化", "世界观如何限制规则"]
    }
  ],
  crossLayerEdges: [
    { from: "L4_NARRATIVE_RUNTIME", to: "L1_RULE_EXECUTION", relation: "SCENE_OR_CAMPAIGN_STATE_CONSTRAINS_RULE_EXECUTION" },
    { from: "L2_CHARACTER_CONSTRUCTION", to: "L1_RULE_EXECUTION", relation: "CHARACTER_BUILD_PROVIDES_RULE_INPUTS" },
    { from: "L3_CONTENT_ENTITY", to: "L1_RULE_EXECUTION", relation: "ENTITY_PROPERTIES_FEED_RULE_EXECUTION" },
    { from: "L4_NARRATIVE_RUNTIME", to: "L3_CONTENT_ENTITY", relation: "SCENE_CONTAINS_ENTITIES" },
    { from: "L4_NARRATIVE_RUNTIME", to: "L2_CHARACTER_CONSTRUCTION", relation: "CAMPAIGN_STATE_UPDATES_CHARACTER_SNAPSHOT" },
    { from: "L1_RULE_EXECUTION", to: "L4_NARRATIVE_RUNTIME", relation: "RULE_RESULT_WRITES_BACK_TO_CAMPAIGN_STATE" }
  ],
  resolveLayer(query) {
    const ranked = this.layers
      .map(layer => ({
        layerId: layer.id,
        layerName: layer.name,
        graphFile: layer.graphFile,
        layerQuestion: layer.layerQuestion,
        score: scoreAliases(query, [layer.id, layer.name, layer.layerQuestion, ...(layer.routingAliases || []), ...(layer.routingExamples || [])])
      }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score);
    return {
      query,
      bestLayer: ranked[0] || null,
      candidateLayers: ranked,
      fallback: ranked.length ? null : "NO_LAYER_DIRECT_MATCH__RUN_VECTOR_RETRIEVAL_AND_CLASSIFY_BY_LAYER_QUESTION"
    };
  },
  route(query) {
    const layerResolution = this.resolveLayer(query);
    const bestLayer = this.layers.find(layer => layer.id === layerResolution.bestLayer?.layerId);
    const systemPlan = bestLayer ? bestLayer.graph.plan(query) : null;
    const relatedCrossLayerEdges = bestLayer
      ? this.crossLayerEdges.filter(edge => edge.from === bestLayer.id || edge.to === bestLayer.id)
      : [];
    return {
      query,
      layerResolution,
      systemPlan,
      relatedCrossLayerEdges,
      executionPolicy: [
        "优先保留输入中的原作品术语",
        "把近似术语映射到 canonical layer 与 canonical system logic",
        "当层级不确定时，同时返回候选层并要求后续检索补证",
        "当系统不确定时，进入同层相邻系统与向量检索并行召回",
        "最终回答必须回写 aliasTrace、来源片段、判定流程或状态变化"
      ]
    };
  }
};

module.exports = { LayerRouterGraphRAG };
