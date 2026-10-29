// ============================================================
// assets/script.js
// 信科校园报修与智能运维平台 —— 全局前端交互逻辑
// ------------------------------------------------------------
// 💻 计算机专业负责：
//   1. 表单校验、下拉联动
//   2. 模拟AI机械失效诊断逻辑（方案4）
//   3. 机械评估预览联动（选故障即预览，加分项）
//   4. 工单提交时完整携带机械评估数据 + 详细地址
//   5. 运维看板渲染 + 机械评估报告弹窗（方案3）
// 所有故障配置数据统一从 data.js 读取，不在此写死。
// 说明：本项目为普通全局脚本（非 ES Module），页面按 数据(data.js)
//        → 逻辑(script.js) 顺序引入，双击 index.html 即可运行，无需服务器。
// ============================================================

// 工单存储key
const STORAGE_KEY = "campus_repair_orders";

/* ---------------- 通用：localStorage 读写 ---------------- */
function getOrderList() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}
function saveOrderList(arr) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

/* ============================================================
   提交页 submit.html
   ============================================================ */

// 初始化区域下拉
function initAreaSelect() {
  const areaSelect = document.getElementById("areaSelect");
  if (!areaSelect) return;
  areaList.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.value;
    opt.innerText = item.label;
    areaSelect.appendChild(opt);
  })
}

// 初始化故障大类下拉
function initFaultCategory() {
  const catSel = document.getElementById("faultCategory");
  if (!catSel) return;
  faultTypeList.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.categoryKey;
    opt.innerText = item.category;
    catSel.appendChild(opt);
  })
}

// 大类切换 → 加载子故障 + 清空机械评估预览
function bindCategoryChange() {
  const catSel = document.getElementById("faultCategory");
  const typeSel = document.getElementById("faultType");
  if (!catSel) return;
  catSel.onchange = () => {
    const key = catSel.value;
    typeSel.innerHTML = `<option value="">--请选择具体故障--</option>`;
    const target = faultTypeList.find(c => c.categoryKey === key);
    if (!target) return;
    target.children.forEach(child => {
      const opt = document.createElement("option");
      opt.value = child.value;
      opt.innerText = `${child.label}（${child.level}）`;
      typeSel.appendChild(opt);
    })
    clearMechPreview();
  }
}

// 【方案4 联动加分项】选择具体故障 → 实时预览机械评估内容
function bindFaultTypeChange() {
  const typeSel = document.getElementById("faultType");
  if (!typeSel) return;
  typeSel.onchange = () => {
    const fault = findFaultByValue(typeSel.value);
    if (!fault) { clearMechPreview(); return; }
    renderMechPreview(fault);
  };
}

// 渲染机械评估预览区
function renderMechPreview(fault) {
  const box = document.getElementById("mechPreview");
  if (!box) return;
  const risk = getRiskStyle(fault.riskLevel);
  box.className = "mech-preview show";
  box.innerHTML = `
    <h4>🛠️ 机械评估预览（来自故障评估知识库）</h4>
    <div class="mp-row"><span class="mp-label">故障全称：</span>${fault.faultName}</div>
    <div class="mp-row"><span class="mp-label">失效类型：</span>${fault.faultType}</div>
    <div class="mp-row"><span class="mp-label">失效机理：</span>${fault.failureMechanism}</div>
    <div class="mp-row"><span class="mp-label">结构风险等级：</span>
      <span class="risk-inline-tag" style="color:${risk.color};background:${risk.bg}">${fault.riskLevel}</span>
    </div>
    <div class="mp-row"><span class="mp-label">推荐维修方案：</span>${fault.repairSuggest}</div>
    <div class="mp-row"><span class="mp-label">是否需要结构复核：</span>${fault.needStructureCheck ? "是，需机械专业人员到场复核" : "否"}</div>
  `;
}
function clearMechPreview() {
  const box = document.getElementById("mechPreview");
  if (box) { box.className = "mech-preview"; box.innerHTML = ""; }
}

/* ---- 方案4：模拟AI机械失效诊断 ----
   上传图片后，不再只识别"什么东西坏了"，
   而是输出【机械工程失效诊断结论】：失效类型 + 风险等级 + 工程维修建议，
   识别成功后自动匹配故障库、预填表单与机械评估内容。 */
function bindImageUpload() {
  const uploadDom = document.getElementById("imgUpload");
  const previewBox = document.getElementById("previewBox");
  const aiBlock = document.getElementById("aiBlock");
  if (!uploadDom) return;

  uploadDom.onchange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      previewBox.innerHTML = `<img src="${ev.target.result}" alt="预览图">`;

      // 模拟AI识别：从机械诊断词库随机匹配一个故障项（模拟图像识别结果）
      const matched = aiMatchLib[Math.floor(Math.random() * aiMatchLib.length)];
      const fault = findFaultByValue(matched.matchKey);
      const risk = getRiskStyle(fault ? fault.riskLevel : "一般");

      // 渲染醒目AI诊断区块
      aiBlock.classList.add("show");
      aiBlock.innerHTML = `
        <div class="ai-title">🤖 模拟AI机械失效诊断 <span class="tag">机械工程引擎</span></div>
        <div class="ai-diag">
          <div class="diag-row"><span class="diag-label">识别构件：</span><span>${fault ? fault.label : matched.matchKey}</span></div>
          <div class="diag-row"><span class="diag-label">失效类型：</span><span>${fault ? fault.faultType : "待评估"}</span></div>
          <div class="diag-row"><span class="diag-label">失效机理：</span><span>${fault ? fault.failureMechanism : ""}</span></div>
          <div class="diag-row"><span class="diag-label">结构风险等级：</span>
            <span class="risk-inline" style="color:${risk.color};background:${risk.bg}">${fault ? fault.riskLevel : "一般"}</span>
          </div>
          <div class="diag-row"><span class="diag-label">工程维修建议：</span><span>${fault ? fault.repairSuggest : matched.suggest}</span></div>
          <div class="diag-row"><span class="diag-label">是否需结构复核：</span><span>${fault ? (fault.needStructureCheck ? "是，需机械专业人员到场复核" : "否") : "待评估"}</span></div>
        </div>
        <div class="ai-note">📌 模拟识别完成，已自动匹配故障库并预填下方表单（联动效果）。</div>
        <div class="ai-action">
          <button type="button" class="btn primary small" id="aiApply">✅ 采纳识别结果并预填</button>
          <button type="button" class="btn default small" id="aiDiscard">忽略识别结果</button>
        </div>
      `;

      // 绑定"采纳/忽略"操作
      const applyBtn = document.getElementById("aiApply");
      const discardBtn = document.getElementById("aiDiscard");
      if (applyBtn) {
        applyBtn.onclick = () => {
          if (!fault) { alert("未匹配到故障库，无法预填"); return; }
          // 自动选中故障大类 + 具体故障
          const catSel = document.getElementById("faultCategory");
          const catTarget = faultTypeList.find(c => c.children.some(f => f.value === fault.value));
          if (catSel && catTarget) catSel.value = catTarget.categoryKey;
          // 触发大类 change，重新填充具体故障下拉
          if (catSel) catSel.dispatchEvent(new Event("change"));
          const typeSel = document.getElementById("faultType");
          if (typeSel) typeSel.value = fault.value;
          // 触发故障 change，联动渲染机械评估预览
          if (typeSel) typeSel.dispatchEvent(new Event("change"));
          // 预填故障详细描述（工程化表述）
          const desc = document.getElementById("faultDesc");
          if (desc) desc.value = `现象：${fault.label}。\n机械初步诊断：${fault.failureMechanism}\n建议维修方案：${fault.repairSuggest}`;
          alert("✅ 已采纳AI识别结果，表单与机械评估已自动预填！");
        };
      }
      if (discardBtn) {
        discardBtn.onclick = () => { aiBlock.classList.remove("show"); aiBlock.innerHTML = ""; };
      }
    }
    reader.readAsDataURL(file);
  }
}

// 表单提交（完整携带机械评估数据 + 详细地址）
function bindSubmitForm() {
  const form = document.getElementById("repairForm");
  if (!form) return;
  form.onsubmit = (e) => {
    e.preventDefault();
    const typeVal = document.getElementById("faultType").value;
    const fault = findFaultByValue(typeVal);
    const order = {
      id: Date.now(),
      userName: document.getElementById("userName").value,
      userPhone: document.getElementById("userPhone").value,
      area: document.getElementById("areaSelect").value,
      // 新增：自由填写详细地址
      address: document.getElementById("detailAddress").value || "",
      category: document.getElementById("faultCategory").value,
      faultType: typeVal,
      faultDesc: document.getElementById("faultDesc").value,
      createTime: new Date().toLocaleString(),
      status: "pending",
      // 【跨专业创新点】工单提交时一并存储机械专业评估数据，供看板读取展示
      mech: fault ? {
        faultName: fault.faultName,
        faultType: fault.faultType,
        failureMechanism: fault.failureMechanism,
        riskLevel: fault.riskLevel,
        repairSuggest: fault.repairSuggest,
        needStructureCheck: fault.needStructureCheck,
        safetyTip: fault.safetyTip
      } : null
    }
    const list = getOrderList();
    list.push(order);
    saveOrderList(list);
    alert("✅ 报修提交成功！工单已携带机械评估报告，可在看板查看。");
    form.reset();
    document.getElementById("previewBox").innerHTML = "";
    const aiBlock = document.getElementById("aiBlock");
    if (aiBlock) { aiBlock.classList.remove("show"); aiBlock.innerHTML = ""; }
    clearMechPreview();
  }
}

/* ============================================================
   看板 board.html
   ============================================================ */

// 渲染看板（方案3：每条工单增加【查看机械评估报告】按钮）
function renderBoard() {
  const wrap = document.getElementById("orderList");
  const filterSel = document.getElementById("statusFilter");
  if (!wrap) return;

  // 初始化状态筛选下拉
  filterSel.innerHTML = `<option value="">全部状态</option>`;
  orderStatusList.forEach(s=>{
    const opt = document.createElement("option");
    opt.value = s.value;
    opt.innerText = s.label;
    filterSel.appendChild(opt);
  })

  const allList = getOrderList();
  const filterVal = filterSel.value;
  const showList = filterVal ? allList.filter(o=>o.status === filterVal) : allList;

  if (showList.length === 0) {
    wrap.innerHTML = `<div class="empty-tip">暂无报修工单</div>`;
    return;
  }

  wrap.innerHTML = "";
  showList.forEach(order=>{
    const areaInfo = areaList.find(a=>a.value === order.area);
    const statusInfo = orderStatusList.find(s=>s.value === order.status);
    // 从工单携带的 mech 数据取机械评估信息（兼容无 mech 的旧工单）
    const mech = order.mech || (findFaultByValue(order.faultType) || {});
    const risk = getRiskStyle(mech.riskLevel || "一般");

    const div = document.createElement("div");
    div.className = "order-card";
    div.innerHTML = `
      <div class="row">
        <strong>工单ID：${order.id}</strong>
        <span class="status-tag status-${order.status}">${statusInfo?.label}</span>
        <span class="risk-inline-tag" style="color:${risk.color};background:${risk.bg}">机械风险：${mech.riskLevel || "待评估"}</span>
      </div>
      <div class="row">
        <span>报修人：${order.userName}</span>
        <span>电话：${order.userPhone}</span>
        <span>区域：${areaInfo?.label || order.area}</span>
      </div>
      <!-- 新增：展示自由填写详细地址 -->
      <div class="row">
        <span>详细地址：${order.address || "未填写"}</span>
      </div>
      <div class="row">
        <span class="fault-name-line">故障：${mech.faultName || order.faultType}</span>
      </div>
      <div class="row">
        <span>描述：${order.faultDesc}</span>
      </div>
      <div class="row">
        <span>提交时间：${order.createTime}</span>
      </div>
      <div class="row" style="margin-top:12px;align-items:center;gap:12px;">
        <select class="status-change" data-id="${order.id}">
          ${orderStatusList.map(s=>`<option value="${s.value}" ${s.value === order.status ? 'selected':''}>${s.label}</option>`).join("")}
        </select>
        <button type="button" class="mech-btn" data-report="${order.id}">📋 查看机械评估报告</button>
      </div>
    `
    wrap.appendChild(div);
  })

  // 绑定状态修改
  document.querySelectorAll(".status-change").forEach(sel=>{
    sel.onchange = () => {
      const id = Number(sel.dataset.id);
      const newStatus = sel.value;
      const arr = getOrderList();
      const target = arr.find(o=>o.id === id);
      if(target){
        target.status = newStatus;
        saveOrderList(arr);
        alert("状态已更新");
        renderBoard();
      }
    }
  })

  // 【方案3】绑定"查看机械评估报告"按钮
  document.querySelectorAll(".mech-btn").forEach(btn=>{
    btn.onclick = () => {
      const id = Number(btn.dataset.report);
      const order = getOrderList().find(o=>o.id === id);
      if (order) openMechReport(order);
    };
  })
}

// 渲染机械工程故障评估报告弹窗
function openMechReport(order) {
  const fault = order.mech || findFaultByValue(order.faultType) || {};
  const risk = getRiskStyle(fault.riskLevel || "一般");

  const mask = document.getElementById("modalMask");
  const body = document.getElementById("modalBody");
  if (!mask || !body) return;

  body.innerHTML = `
    <div class="report-title">🛠️ 机械工程故障评估报告</div>
    <div class="report-meta">
      工单ID：${order.id} ｜ 报修人：${order.userName} ｜ 区域：${(areaList.find(a=>a.value===order.area)||{}).label || order.area} ｜ 提交：${order.createTime}
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">故障全称</span></div>
      <div class="ri-body">${fault.faultName || order.faultType}</div>
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">失效类型</span></div>
      <div class="ri-body">${fault.faultType || "待评估"}</div>
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">失效机理分析（机械专业核心文本）</span></div>
      <div class="ri-body">${fault.failureMechanism || "暂无机评估数据"}</div>
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">结构风险等级评估</span></div>
      <div class="ri-body"><span class="risk-tag" style="color:${risk.color};background:${risk.bg}">${fault.riskLevel || "一般"}</span></div>
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">推荐维修工程方案（机械专业）</span></div>
      <div class="ri-body">${fault.repairSuggest || "待制定维修方案"}</div>
    </div>

    <div class="report-item">
      <div class="ri-head"><span class="ri-icon"></span><span class="ri-label">是否需要机械专业人员到场开展结构强度复核</span></div>
      <div class="ri-body">
        ${fault.needStructureCheck
          ? `<div class="structure-check need">⚠️ 需要：结构承重构件存在失效风险，须由机械专业人员到场开展结构强度复核。</div>`
          : `<div class="structure-check noneed">✅ 无需：非承重构件，常规维修即可，无需专项结构复核。</div>`}
      </div>
    </div>

    <div class="safety-box">
      <div class="sb-title">⚠️ 安全风险提示（机械工程角度）</div>
      <div>${fault.safetyTip || "暂无机械工程安全提示"}</div>
    </div>
  `;

  mask.classList.add("show");
}

// 关闭评估报告弹窗
function bindModalClose() {
  const mask = document.getElementById("modalMask");
  const close = document.getElementById("modalClose");
  if (!mask) return;
  mask.onclick = (e) => { if (e.target === mask) mask.classList.remove("show"); };
  if (close) close.onclick = () => mask.classList.remove("show");
}

// 筛选切换
function bindFilterChange(){
  const filterSel = document.getElementById("statusFilter");
  if(!filterSel) return;
  filterSel.onchange = renderBoard;
}

/* ---------------- 页面入口 ---------------- */
window.onload = () => {
  const path = location.pathname;
  if(path.includes("submit.html")){
    initAreaSelect();
    initFaultCategory();
    bindCategoryChange();
    bindFaultTypeChange();   // 方案4：选故障即预览机械评估
    bindImageUpload();       // 方案4：模拟AI机械诊断
    bindSubmitForm();
  }
  if(path.includes("board.html")){
    renderBoard();           // 方案3：看板 + 评估报告按钮
    bindFilterChange();
    bindModalClose();
  }
}
