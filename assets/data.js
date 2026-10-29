// ============================================================
// assets/data.js
// 信科校园报修与智能运维平台 —— 全局数据配置库（单一数据源）
// ------------------------------------------------------------
// 🛠️ 机械专业负责：为每个故障编写【失效机理分析】【风险等级评估】
//                    【推荐维修工程方案】【是否需要结构强度复核】，
//                    构建校园设施的"机械故障评估知识库"。
// 💻 计算机专业负责：前端交互开发、模拟AI识别逻辑、动态渲染评估报告、
//                    运维看板实现。本文件是所有页面共享的数据源。
// ============================================================

// ============ 【区域列表】 ============
const areaList = [
  { value: "teaching", label: "教学楼" },
  { value: "dormitory", label: "学生宿舍" },
  { value: "canteen", label: "食堂" },
  { value: "library", label: "图书馆" },
  { value: "gym", label: "体育馆" },
  { value: "office", label: "行政办公楼" },
  { value: "playground", label: "操场及附属设施" }
]

// ============ 【故障大类 + 子故障明细列表】 ============
// 【跨专业创新点】
// 每个故障对象在原有基础信息之外，扩展了机械专业的评估字段：
//   faultName          故障全称（含机械失效类型，答辩重点）
//   faultType          失效类型（如脆性断裂、磨损失效、连接失效…）
//   failureMechanism   失效机理分析（机械专业核心文本）
//   riskLevel          结构风险等级：紧急 / 高风险 / 一般 / 轻微
//   repairSuggest      推荐维修工程方案
//   needStructureCheck 是否需要机械专业人员到场开展结构强度复核（boolean）
//   safetyTip          安全风险提示（机械工程角度）
const faultTypeList = [
  {
    category: "水电类故障",
    categoryKey: "water_electric",
    children: [
      {
        value: "light", label: "灯具损坏（不亮、闪烁）", level: "一般",
        faultName: "灯具损坏、闪烁【电源驱动/接线端子接触失效】",
        faultType: "电气连接接触失效（虚接、氧化）",
        failureMechanism: "灯具因驱动电源老化或接线端子氧化产生接触电阻增大，导致供电回路压降过大、间歇性断电，表现为不亮或频闪；长期虚接还会引发电弧高温，加速绝缘老化。",
        riskLevel: "一般",
        repairSuggest: "更换失效驱动电源/灯管，重新压接端子并紧固，必要时更换破损接线盒，复核回路绝缘电阻。",
        needStructureCheck: false,
        safetyTip: "电气回路虚接存在局部过热引燃风险，维修前须断电并验电，更换灯具时同步检查线缆绝缘状态。"
      },
      {
        value: "socket", label: "插座松动、无电、打火", level: "紧急",
        faultName: "插座松动、打火【接线端子连接失效 + 电弧烧蚀】",
        faultType: "电气连接失效（端子松动、电弧烧蚀）",
        failureMechanism: "插拔反复导致簧片疲劳松驰、接线端子压接松动，接触电阻增大，大电流下产生电弧打火并烧蚀触点，可能引发过热起火；属于典型的接触疲劳+热损伤耦合失效。",
        riskLevel: "紧急",
        repairSuggest: "立即停用并断电，更换整套插座组件，规范压接并涂导电膏，校核回路额定电流匹配；对已烧蚀线路做绝缘与载流能力复核。",
        needStructureCheck: false,
        safetyTip: "插座打火是电弧高温征兆，存在引发火灾的高风险，须第一时间断电隔离，禁止继续插拔用电。"
      },
      {
        value: "switch", label: "开关失灵、损坏", level: "一般",
        faultName: "开关失灵、损坏【机械触点磨损失效】",
        faultType: "机械触点磨损/疲劳失效",
        failureMechanism: "开关内部触点在反复通断中产生电磨损与机械磨损，触点表面粗糙度增大、镀层脱落，导致接触不良或卡滞失灵，属典型的接触疲劳失效。",
        riskLevel: "一般",
        repairSuggest: "更换同规格开关，检查供电线路绝缘，紧固接线端子；必要时整体更换面板并复核回路通断。",
        needStructureCheck: false,
        safetyTip: "开关失灵多为内部触点烧蚀，更换前应断电，避免带电操作引发短路电弧。"
      },
      {
        value: "water_pipe", label: "水管漏水、渗水", level: "紧急",
        faultName: "水管漏水、渗水【密封失效 + 腐蚀穿孔】",
        faultType: "密封失效/腐蚀穿孔失效",
        failureMechanism: "管道长期受压并受水质腐蚀，管壁减薄产生局部腐蚀穿孔，或接头密封垫老化失效导致渗漏；水压脉动会加剧裂纹扩展，属腐蚀-应力耦合失效。",
        riskLevel: "紧急",
        repairSuggest: "关阀泄压后更换失效管段/密封件，采用热熔或卡压可靠连接，复核管壁剩余壁厚与承压能力，排查漏水源并做通水试压。",
        needStructureCheck: false,
        safetyTip: "漏水浸蚀墙体与电气线路，可能引发短路与结构受损，需优先切断相关电源并控制跑水。"
      },
      {
        value: "faucet", label: "水龙头关不严、损坏", level: "一般",
        faultName: "水龙头关不严、损坏【密封面磨损失效】",
        faultType: "密封面磨损失效",
        failureMechanism: "阀芯密封面在水流冲刷与反复启闭下磨损、水垢结垢，密封比压下降导致关不严、滴漏，属典型的摩擦磨损失效。",
        riskLevel: "一般",
        repairSuggest: "更换阀芯/密封圈，清理水垢，必要时整阀更换；复核安装扭矩与密封状态，避免再次滴漏。",
        needStructureCheck: false,
        safetyTip: "长期滴漏浪费水资源并可能渗入墙体，应及时处理；高温龙头操作时注意烫伤。"
      },
      {
        value: "toilet", label: "马桶冲水故障、堵塞", level: "紧急",
        faultName: "马桶冲水故障、堵塞【密封失效 + 排污通道阻塞】",
        faultType: "密封失效/通道阻塞失效",
        failureMechanism: "进水阀/排水阀密封老化失效导致持续漏水或冲水无力，或排污弯道异物沉积造成水力阻塞；冲水无力多因水压与虹吸结构匹配失效。",
        riskLevel: "紧急",
        repairSuggest: "更换进水/排水阀芯，疏通排污弯道并清理异物，复核水箱水位与冲水虹吸效果，防止再次堵塞。",
        needStructureCheck: false,
        safetyTip: "堵塞易造成污水外溢污染环境，处理时注意卫生防护，避免直接接触排泄物。"
      },
      {
        value: "water_heater", label: "热水器不出水、不加热", level: "一般",
        faultName: "热水器不出水、不加热【加热元件/温控失效】",
        faultType: "加热元件热疲劳失效",
        failureMechanism: "电热管长期干烧或水垢包裹导致局部过热、绝缘击穿，或温控器感温失效造成不加热；属热载荷疲劳与结垢耦合失效。",
        riskLevel: "一般",
        repairSuggest: "断电后检测电热管阻值与绝缘，更换失效加热元件/温控器，清理水垢，复核漏电保护与接地状态。",
        needStructureCheck: false,
        safetyTip: "热水器涉及强电与高温水，检修前必须断电泄压，防止触电与烫伤，严禁带电拆修。"
      }
    ]
  },
  {
    category: "门窗家具类故障",
    categoryKey: "door_furniture",
    children: [
      {
        value: "door_lock", label: "门锁损坏、无法开关门", level: "紧急",
        faultName: "门锁损坏、无法开关门【锁芯机械磨损/卡滞失效】",
        faultType: "锁芯磨损/卡滞失效",
        failureMechanism: "锁芯弹子与钥匙长期摩擦磨损、或锁体内部零件锈蚀卡滞，导致无法正常开合；反复硬拧还会造成锁舌变形，属磨损-卡滞耦合失效。",
        riskLevel: "紧急",
        repairSuggest: "更换同型号锁芯/锁体，润滑锁舌机构，复核门框与锁舌对位间隙，确保应急时可从外部开启。",
        needStructureCheck: false,
        safetyTip: "锁具失效影响应急疏散与防盗安全，务必保证门扇可正常开关，避免锁死造成人员被困。"
      },
      {
        value: "window", label: "窗户卡滞、合页损坏", level: "一般",
        faultName: "窗户卡滞、合页损坏【铰链磨损/变形失效】",
        faultType: "铰链磨损/连接变形失效",
        failureMechanism: "合页轴销与铰链片长期承重磨损、间隙增大，窗扇因自重下垂导致卡滞或启闭困难；窗框受温差变形加剧配合失效。",
        riskLevel: "一般",
        repairSuggest: "更换失效合页并调整窗扇平衡，紧固连接螺栓，清理滑道异物，复核窗扇闭合密封与抗风能力。",
        needStructureCheck: false,
        safetyTip: "高层窗户合页失效存在窗扇坠落风险，维修时做好防坠措施，严禁用力推拉已松动的窗扇。"
      },
      {
        value: "glass", label: "玻璃开裂、破碎", level: "紧急",
        faultName: "玻璃开裂、破碎【脆性材料冲击断裂失效】",
        faultType: "脆性材料冲击断裂失效",
        failureMechanism: "玻璃受冲击载荷产生脆性断裂，裂纹沿低能路径快速扩展；需检查周边框架、合页支撑结构是否存在应力集中与变形，防止断裂二次伤人。",
        riskLevel: "紧急",
        repairSuggest: "更换失效玻璃，复核框架支撑结构变形情况，排查冲击源，消除再次断裂风险；优先采用钢化/夹胶安全玻璃。",
        needStructureCheck: true,
        safetyTip: "破碎玻璃存在割伤与高空坠物伤人风险，应立即围挡隔离并及时更换，清理碎片须佩戴防护手套。"
      },
      {
        value: "desk", label: "课桌/书桌松动、破损", level: "一般",
        faultName: "课桌/书桌松动、破损【紧固件松动/连接失效】",
        faultType: "紧固件松动/连接失效",
        failureMechanism: "桌腿与面板连接螺栓因振动与反复载荷松动，或木质/板材连接处开裂，导致桌面晃动、承载能力下降，属连接件疲劳松动失效。",
        riskLevel: "一般",
        repairSuggest: "重新紧固连接螺栓并加装防松垫片，对开裂连接部位补强加固，复核桌面承载能力与稳定度。",
        needStructureCheck: false,
        safetyTip: "松动课桌在负重使用中可能坍塌伤及学生，检查时注意边角毛刺与连接件锋利面。"
      },
      {
        value: "chair", label: "椅子摇晃、断裂", level: "一般",
        faultName: "椅子摇晃、断裂【承重构件强度失效】",
        faultType: "承重构件疲劳断裂失效",
        failureMechanism: "椅腿/椅面在反复坐下冲击载荷下产生疲劳裂纹并逐渐扩展，连接点松动造成摇晃；当载荷超过构件剩余强度即发生断裂，属典型的低周疲劳-强度失效。",
        riskLevel: "一般",
        repairSuggest: "更换断裂椅腿/椅面并加固连接节点，复核整体结构刚度与承载安全裕度，防止载荷集中造成二次断裂。",
        needStructureCheck: true,
        safetyTip: "断裂椅腿尖角锋利易造成划伤，摇晃椅子随时可能塌坐，应先停用并标记，避免学生继续使用。"
      },
      {
        value: "cabinet", label: "储物柜损坏、拉手脱落", level: "一般",
        faultName: "储物柜损坏、拉手脱落【连接件脱落失效】",
        faultType: "连接件脱落/疲劳失效",
        failureMechanism: "柜门铰链、拉手紧固螺钉因频繁开合与过载松动脱落，柜体侧板连接处开裂，导致门扇下垂或关合不严，属紧固件疲劳松动失效。",
        riskLevel: "一般",
        repairSuggest: "重新紧固或更换连接件，加固柜体角部连接，调整门扇铰链定位，复核整体结构稳定。",
        needStructureCheck: false,
        safetyTip: "柜体倾倒或门扇掉落存在砸伤风险，重物存放时应复核柜体承载与固定状态。"
      }
    ]
  },
  {
    category: "网络电教类故障",
    categoryKey: "net_media",
    children: [
      {
        value: "wifi", label: "WiFi无信号、信号弱", level: "一般",
        faultName: "WiFi无信号、信号弱【射频/终端连接失效】",
        faultType: "射频连接/设备老化失效",
        failureMechanism: "无线设备因射频模块老化、天线接口接触不良或带宽过载，造成覆盖信号衰减，属电子设备性能退化失效。",
        riskLevel: "轻微",
        repairSuggest: "重启/更换无线设备，检查天线连接与频段配置，必要时调整部署位置或扩容，复核信号覆盖。",
        needStructureCheck: false,
        safetyTip: "设备维护涉及弱电，操作时注意防静电与接线规范，避免带电插拔损坏接口。"
      },
      {
        value: "network_port", label: "网口接触不良、不通网", level: "一般",
        faultName: "网口接触不良、不通网【接线端子接触失效】",
        faultType: "接线端子接触失效",
        failureMechanism: "水晶头/模块簧片反复插拔磨损或氧化，造成物理链路接触不良，信号衰减或中断，属触点磨损失效。",
        riskLevel: "轻微",
        repairSuggest: "重新压接水晶头/更换模块，清理氧化触点，复核链路连通性，必要时更换整条线缆。",
        needStructureCheck: false,
        safetyTip: "检修时做好线缆标识，避免误断其他在用链路，操作注意规范压接防止再次失效。"
      },
      {
        value: "projector", label: "投影仪无法开机、画面异常", level: "一般",
        faultName: "投影仪无法开机、画面异常【光源/散热热失效】",
        faultType: "光源老化/散热热失效",
        failureMechanism: "投影光源（灯泡/LED）长时间工作光衰，或散热风道积尘导致温控保护停机，画面异常多为光学组件热变形或尘污，属热载荷老化失效。",
        riskLevel: "一般",
        repairSuggest: "更换失效光源，清理滤网与散热风道，复位温控系统，复核光学对焦与画面投影状态。",
        needStructureCheck: false,
        safetyTip: "投影光源高温高压，更换须待充分冷却并按规程操作，防止烫伤与灯体炸裂。"
      },
      {
        value: "speaker", label: "音响无声、杂音", level: "一般",
        faultName: "音响无声、杂音【振膜/音圈疲劳失效】",
        faultType: "振膜/音圈疲劳失效",
        failureMechanism: "扬声器音圈在长时间大功率下过热烧损或振膜疲劳变形，产生失真杂音或无声，属电磁-机械疲劳耦合失效。",
        riskLevel: "轻微",
        repairSuggest: "更换失效扬声器单元，检查功放匹配与接线极性，复核输出功率与阻抗匹配。",
        needStructureCheck: false,
        safetyTip: "大功率音响调试时控制音量，避免啸叫损伤听力，检修注意扬声器金属振膜边角锋利。"
      },
      {
        value: "screen", label: "投影幕布卡住、无法升降", level: "一般",
        faultName: "投影幕布卡住、无法升降【卷轴机构卡滞失效】",
        faultType: "卷轴机构卡滞/传动失效",
        failureMechanism: "幕布卷轴电机或弹簧机构因润滑不足、传动件磨损卡滞，升降受阻；幕布边缘脱轨导致收放不平，属传动机构摩擦卡滞失效。",
        riskLevel: "一般",
        repairSuggest: "清理润滑卷轴传动机构，调整幕布轨道对位，更换磨损传动件，复核升降行程与限位开关。",
        needStructureCheck: false,
        safetyTip: "升降机构存在夹手与坠落风险，检修时断电并固定幕布，避免在幕布下方站立。"
      }
    ]
  },
  {
    category: "公共设施类故障",
    categoryKey: "public_facility",
    children: [
      {
        value: "handrail", label: "扶手松动、脱落", level: "紧急",
        faultName: "扶手松动、脱落【承重连接件强度失效】",
        faultType: "承重连接件强度/疲劳失效",
        failureMechanism: "扶手立柱与基座锚固螺栓松动、锈蚀减径，反复倚靠载荷使连接节点疲劳损伤，导致扶手松动甚至脱落；一旦失稳将直接威胁行人安全，属高风险的连接强度失效。",
        riskLevel: "高风险",
        repairSuggest: "重新紧固/更换锚固螺栓，复核扶手整体结构刚度与承载裕度，必要时做结构强度复核后恢复使用。",
        needStructureCheck: true,
        safetyTip: "松动扶手可能造成倚靠者跌落，属高风险承重构件，应立即使用警示围挡并优先修复，严禁临时凑合。"
      },
      {
        value: "floor", label: "地砖起翘、破损", level: "紧急",
        faultName: "地砖起翘、破损【粘结层失效 + 基底变形】",
        faultType: "粘结层失效/基底变形失效",
        failureMechanism: "地砖下粘结层因施工空鼓或受潮老化失去粘结力，温度变化与荷载使砖体起翘，边缘破损锋利，产生绊倒与割伤风险，属粘结-热应力耦合失效。",
        riskLevel: "高风险",
        repairSuggest: "拆除起翘地砖，清理基底并重新做粘结层，局部破损区域更换并做防滑处理，复核铺装密实与平整度。",
        needStructureCheck: false,
        safetyTip: "起翘地砖在通道上极易绊倒行人，应及时围挡警示，破损边缘锋利注意割伤防护。"
      },
      {
        value: "drain", label: "地漏堵塞、积水", level: "一般",
        faultName: "地漏堵塞、积水【排水通道阻塞失效】",
        faultType: "排水通道阻塞失效",
        failureMechanism: "杂物、毛发与沉积物在水封处累积，造成排水断面缩小、水力不畅而积水，属流体通道阻塞失效。",
        riskLevel: "一般",
        repairSuggest: "疏通地漏及存水弯，清理沉积物，复核排水坡度与防臭水封，必要时更换破损地漏体。",
        needStructureCheck: false,
        safetyTip: "积水易导致地滑摔倒并滋生细菌，疏通时注意卫生防护，避免污水溅身。"
      },
      {
        value: "trash", label: "垃圾桶破损", level: "一般",
        faultName: "垃圾桶破损【塑料壳体老化/冲击开裂】",
        faultType: "塑料壳体老化/冲击失效",
        failureMechanism: "垃圾桶塑料壳体在紫外线与温差作用下老化变脆，受冲击产生开裂破损，承载与密闭性能下降，属材料老化失效。",
        riskLevel: "轻微",
        repairSuggest: "更换破损垃圾桶，对可回收部位补强，复核承载与密闭性能，规范清运防止过度装载。",
        needStructureCheck: false,
        safetyTip: "破损垃圾桶边缘可能划伤手部，更换时注意破损毛刺，清运注意卫生防护。"
      },
      {
        value: "bench", label: "休闲长椅损坏", level: "一般",
        faultName: "休闲长椅损坏【承重构件疲劳/连接失效】",
        faultType: "承重构件疲劳/连接失效",
        failureMechanism: "长椅椅面、椅腿在反复载荷下疲劳变形，连接螺栓松动或木质开裂，承载能力下降，属典型承重结构疲劳失效。",
        riskLevel: "一般",
        repairSuggest: "更换损坏椅板/加固椅腿，紧固连接螺栓并复核承载安全裕度，必要时做结构强度复核。",
        needStructureCheck: true,
        safetyTip: "损坏长椅可能在承重时突然断裂伤人，应先停用围挡，检查尖锐木刺与金属毛边。"
      }
    ]
  },
  {
    category: "空调设备类故障",
    categoryKey: "air_condition",
    children: [
      {
        value: "ac_not_cold", label: "空调不制冷", level: "一般",
        faultName: "空调不制冷【制冷系统/压缩机热力失效】",
        faultType: "制冷系统热力/循环失效",
        failureMechanism: "制冷剂泄漏、压缩机磨损或冷凝器积尘导致制冷循环热交换效率下降，属热力系统性能退化失效。",
        riskLevel: "一般",
        repairSuggest: "检漏并补充制冷剂，清洁冷凝器/滤网，检测压缩机运行状态，复核制冷循环压力与温度。",
        needStructureCheck: false,
        safetyTip: "涉及制冷剂高压管路，检修须由专业人员操作，防止高压制冷剂喷射伤人。"
      },
      {
        value: "ac_not_hot", label: "空调不制热", level: "一般",
        faultName: "空调不制热【制热循环/四通阀失效】",
        faultType: "制热循环方向/换向阀失效",
        failureMechanism: "四通换向阀卡滞或电辅热元件失效，导致制热循环无法建立，制热能力骤降，属循环换向机构失效。",
        riskLevel: "一般",
        repairSuggest: "检测四通阀与电辅热元件，更换失效件，复核制热循环压力与出风温度。",
        needStructureCheck: false,
        safetyTip: "电辅热元件存在过热风险，检修须断电并复核绝缘与温控保护。"
      },
      {
        value: "ac_leak", label: "空调滴水漏水", level: "紧急",
        faultName: "空调滴水漏水【冷凝水排水/密封失效】",
        faultType: "冷凝水排放/密封失效",
        failureMechanism: "冷凝水排水管堵塞或安装坡度不足，接水盘积水溢出；保温层破损导致管壁凝露滴水，属流体排放与隔热失效。",
        riskLevel: "紧急",
        repairSuggest: "疏通排水管并调整坡度，更换破损保温层，清洁接水盘，复核排水通畅与凝露控制。",
        needStructureCheck: false,
        safetyTip: "滴水浸湿电气设备与墙体，可能引发短路，应及时处理，检修高处时注意登高安全。"
      },
      {
        value: "ac_no_response", label: "空调通电无反应", level: "一般",
        faultName: "空调通电无反应【电源/控制板失效】",
        faultType: "电源/控制电路失效",
        failureMechanism: "电源板或主控板元件老化失效、供电回路开路，导致整机无响应，属电子电路故障。",
        riskLevel: "一般",
        repairSuggest: "检测供电与主控板，更换失效板件，复核电源滤波与启动电容状态。",
        needStructureCheck: false,
        safetyTip: "涉及强电，检修前必须断电验电，防止触电；电容器存有残余电荷需先放电。"
      }
    ]
  },
  {
    category: "其他故障",
    categoryKey: "other",
    children: [
      {
        value: "other_desc", label: "其他问题（自行填写描述）", level: "一般",
        faultName: "其他问题【待人工现场工程评估】",
        faultType: "待现场评估/未分类失效",
        failureMechanism: "故障类型未归入既有知识库，需机械/工程人员到现场勘察，结合载荷、腐蚀、疲劳等因素进行失效诊断与风险评估。",
        riskLevel: "一般",
        repairSuggest: "安排人员现场勘察，参照同类失效机理制定维修方案，复核结构安全后恢复使用。",
        needStructureCheck: true,
        safetyTip: "未分类故障应先做风险评估再处置，避免盲目修复掩盖潜在结构安全隐患。"
      }
    ]
  }
]

// 风险等级 → 展示配置（颜色标识，答辩亮点：红=紧急、橙=高风险、蓝=一般、灰=轻微）
const riskLevelList = [
  { value: "紧急", label: "紧急", color: "#e53e3e", bg: "#fde8e8" },
  { value: "高风险", label: "高风险", color: "#ed7a1c", bg: "#fdf0e0" },
  { value: "一般", label: "一般", color: "#2b6cb0", bg: "#e7f0fb" },
  { value: "轻微", label: "轻微", color: "#718096", bg: "#edf2f7" }
]

// 工单状态枚举
const orderStatusList = [
  { value: "pending", label: "待接单" },
  { value: "processing", label: "维修中" },
  { value: "finished", label: "已完成" },
  { value: "closed", label: "已驳回" }
]

// ============ 【模拟AI机械失效诊断词库】 ============
// 【跨专业创新点】计算机专业构建"图像关键词 → 机械失效诊断"映射库，
// 上传图片后模拟AI识别，自动输出机械工程失效诊断结论并预填表单。
const aiMatchLib = [
  {
    keyword: ["插座", "插头", "电火花", "打火", "冒烟"],
    matchKey: "socket",
    suggest: "疑似插座接线端子连接失效，存在电弧烧蚀风险",
    aiDiagnosis: "识别构件：插座接线端子；疑似失效类型：接触疲劳+电弧烧蚀失效；建议立即断电更换，开展电气载流复核。"
  },
  {
    keyword: ["漏水", "水渍", "渗水", "水漫"],
    matchKey: "water_pipe",
    suggest: "疑似水管密封失效/腐蚀穿孔",
    aiDiagnosis: "识别构件：给水管道；疑似失效类型：密封失效/腐蚀穿孔失效；建议关阀泄压更换管段，复核承压能力。"
  },
  {
    keyword: ["门锁", "锁坏", "打不开门", "门关不上"],
    matchKey: "door_lock",
    suggest: "疑似门锁锁芯磨损/卡滞失效",
    aiDiagnosis: "识别构件：门锁锁芯；疑似失效类型：机械磨损/卡滞失效；建议更换锁芯并润滑锁舌机构，复核应急开启。"
  },
  {
    keyword: ["空调", "滴水", "漏水", "水珠"],
    matchKey: "ac_leak",
    suggest: "疑似空调冷凝水排水/密封失效",
    aiDiagnosis: "识别构件：空调冷凝水排水系统；疑似失效类型：流体排放/隔热失效；建议疏通排水管、更换破损保温层。"
  },
  {
    keyword: ["灯", "不亮", "闪烁", "频闪"],
    matchKey: "light",
    suggest: "疑似灯具电源驱动/接线端子接触失效",
    aiDiagnosis: "识别构件：灯具驱动电源；疑似失效类型：电气连接接触失效；建议更换驱动/灯管并复核接线绝缘。"
  },
  {
    keyword: ["投影仪", "投影", "幕布", "画面"],
    matchKey: "projector",
    suggest: "疑似投影光源老化/散热热失效",
    aiDiagnosis: "识别构件：投影光源/散热系统；疑似失效类型：热载荷老化失效；建议更换光源、清理风道、复核温控。"
  },
  {
    keyword: ["玻璃", "碎", "裂", "破"],
    matchKey: "glass",
    suggest: "疑似玻璃脆性冲击断裂失效",
    aiDiagnosis: "识别构件：玻璃面板；疑似失效类型：脆性材料冲击断裂失效；建议更换安全玻璃，复核框架支撑变形并开展结构强度复核。"
  },
  {
    keyword: ["椅子", "摇", "断", "椅"],
    matchKey: "chair",
    suggest: "疑似椅子承重构件强度失效",
    aiDiagnosis: "识别构件：座椅承重构件；疑似失效类型：承重构件疲劳断裂失效；建议更换断裂构件并加固连接节点，开展结构强度复核。"
  },
  {
    keyword: ["扶手", "护栏", "松", "栏杆"],
    matchKey: "handrail",
    suggest: "疑似扶手承重连接件强度失效",
    aiDiagnosis: "识别构件：楼梯扶手连接节点；疑似失效类型：承重连接件强度/疲劳失效；建议紧固更换锚固件并开展结构强度复核，属高风险承重件。"
  },
  {
    keyword: ["地砖", "起翘", "破损", "瓷砖", "地面"],
    matchKey: "floor",
    suggest: "疑似地砖粘结层失效/基底变形",
    aiDiagnosis: "识别构件：地砖铺装层；疑似失效类型：粘结层失效/基底变形失效；建议拆除重铺并复核平整度，做好防滑与围挡。"
  }
]

// ============ 【工具函数】 ============
// 根据具体故障 value 定位完整故障对象（含机械评估字段）
function findFaultByValue(value) {
  if (!value) return null;
  for (const cat of faultTypeList) {
    const found = cat.children.find(f => f.value === value);
    if (found) return found;
  }
  return null;
}

// 根据风险等级返回展示配色
function getRiskStyle(riskLevel) {
  const item = riskLevelList.find(r => r.value === riskLevel);
  return item || { label: riskLevel || "一般", color: "#718096", bg: "#edf2f7" };
}
