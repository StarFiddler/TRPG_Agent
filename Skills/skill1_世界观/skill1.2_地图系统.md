# Skill：GameMapTopologyBuilder_v2.1（Constraint Enhanced）

## 一、Skill定位（升级版）

该 Skill 用于根据一个游戏名称及其参考资料，自动构建该游戏的：

**分布式、可遍历、强一致性校验的地图拓扑文件系统**

相比 v2，本版本新增：

- 强约束体系（Constraint Layer）
- 一致性校验机制（Validation Layer）
- 完整性强制生成规则（Full Expansion Rule）
- 多世界/多图层支持（Multi-World Support）

---

## 二、传入参数

```json
{
  "game_name": "string",
  "reference_links": ["string"],
  "constraints": {
    "required_worlds": ["string"],
    "must_include_all_subregions": true,
    "must_include_all_dungeons": true,
    "consistency_check": true
  }
}
```

---

## 三、通用约束抽象（Constraint Abstraction Layer）

### 约束1：多世界完整性（Multi-World Completeness）

系统必须支持多个世界层级，并保证全部生成。

---

### 约束2：区域全展开（Full Region Expansion）

禁止示例输出，必须生成全部区域文件。

---

### 约束3：子区域完整性（Subregion Completeness）

所有子区域必须存在对应 JSON 文件。

---

### 约束4：地牢/副本全覆盖（Dungeon Coverage Constraint）

所有地牢、洞窟、副本必须建模并挂载到关键节点。

---

### 约束5：拓扑连通性（Topology Connectivity）

所有关键节点必须可达，不允许孤立节点。

---

### 约束6：节点分类完备性（Node Classification Completeness）

所有节点必须正确分类为 Key 或 Non-Key。

---

### 约束7：一致性校验（Consistency Validation）

必须生成 RECHECK_REPORT.json 并校验：

- 数量一致
- 无缺失文件
- 无孤立节点

---

### 约束8：文件系统完整性（File System Integrity）

必须包含：

- MAP_总览.json
- 全部区域文件
- RECHECK_REPORT.json

---

### 约束9：命名一致性（Naming Consistency）

统一使用：

- MAP_<大地图区域>.json
- MAP_<大地图区域>_<小地图区域>.json

---

### 约束10：分布式结构强制（Distributed Architecture Constraint）

禁止单一 JSON，必须分层输出。

---

## 四、执行流程（增强版）

Step 1：读取参数  
Step 2：解析约束  
Step 3：检索数据  
Step 4：构建世界结构  
Step 5：生成总览  
Step 6：生成大地图文件  
Step 7：生成小地图文件  
Step 8：构建节点图  
Step 9：挂载地牢  
Step 10：建立连接  
Step 11：一致性校验  
Step 12：输出报告  

---

## 五、完成判定（强化版）

必须满足：

- 全世界生成
- 全区域生成
- 全地牢覆盖
- 无孤立节点
- 校验通过

---

## 六、API级 System Prompt（升级版）

You are a Game Map Topology Builder with constraint validation.

You must generate a COMPLETE and CONSISTENT distributed map system.

Rules:
- No partial output
- Include all worlds
- Include all regions
- Include all dungeons
- Ensure connectivity
- Generate RECHECK report
- Fix inconsistencies automatically

---

## 七、一句话总结

该 Skill 是一个带有强约束与自动校验能力的地图拓扑生成系统。
