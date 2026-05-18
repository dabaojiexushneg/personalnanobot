(() => {
  const STORAGE_KEY = "nanobot-zoned-dashboard-v1";
  const GAP = 12;
  const MIN_ZONE = { left: 240, center: 420, right: 260 };
  const MIN_CARD_HEIGHT = 118;
  const DEFAULT_CARD_HEIGHT = {
    assistantsSection: 300,
    statusSection: 300,
    chatSection: 330,
    rag: 210,
    task: 210,
    trace: 210,
    configSection: 390,
    users: 230,
  };
  const INTERACTIVE_SELECTOR = "button,input,textarea,select,a,label,[contenteditable='true']";

  const PANEL_DEFS = [
    { id: "assistantsSection", selector: "#assistantsSection", zone: "left" },
    { id: "statusSection", selector: "#statusSection", zone: "left" },
    { id: "chatSection", selector: "#chatSection", zone: "center" },
    { id: "rag", selector: ".rag-card", zone: "center" },
    { id: "task", selector: ".task-card", zone: "center" },
    { id: "trace", selector: ".trace-card", zone: "center" },
    { id: "configSection", selector: "#configSection", zone: "right" },
    { id: "users", selector: ".user-card", zone: "right" },
  ];

  const DEFAULT_ORDER = {
    left: ["assistantsSection", "statusSection"],
    center: ["chatSection", "rag", "task", "trace"],
    right: ["configSection", "users"],
  };
  const ZONES = ["left", "center", "right"];
  const ALL_PANEL_IDS = PANEL_DEFS.map(def => def.id);

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const px = value => `${Math.round(value)}px`;

  function readState() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function writeState(state) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Layout interaction must keep working even when storage is unavailable.
    }
  }

  function getPanelHeader(panel) {
    return panel.querySelector(".panel-header,.chat-header,h4");
  }

  function shouldSkipDrag(target) {
    return Boolean(target.closest(INTERACTIVE_SELECTOR)) || Boolean(target.closest(".nb-zone-resize"));
  }

  function stripDuplicateIds(root) {
    root.removeAttribute("id");
    root.querySelectorAll("[id]").forEach(node => node.removeAttribute("id"));
  }

  function makeResizeHandle(edge) {
    const handle = document.createElement("div");
    handle.className = `nb-zone-resize is-${edge}`;
    handle.dataset.resizeEdge = edge;
    return handle;
  }

  function ensureResizeHandles(panel) {
    if (panel.dataset.resizeHandlesReady === "true") return;
    panel.dataset.resizeHandlesReady = "true";
    ["top", "right", "bottom", "left", "top-left", "top-right", "bottom-right", "bottom-left"].forEach(edge => {
      panel.appendChild(makeResizeHandle(edge));
    });
  }

  function markPanel(def) {
    const panel = document.querySelector(def.selector);
    if (!panel) return null;
    panel.classList.add("nb-zone-panel");
    panel.dataset.zonePanelId = def.id;
    panel.dataset.zoneHome = def.zone;

    const header = getPanelHeader(panel);
    if (header) {
      header.classList.add("nb-zone-drag-handle");
      header.title = "拖动排序版块";
    }
    ensureResizeHandles(panel);
    return panel;
  }

  class ZonedDashboard {
    constructor(board, panels) {
      this.board = board;
      this.panels = panels;
      this.panelMap = new Map(panels.map(panel => [panel.dataset.zonePanelId, panel]));
      this.state = this.normalizeState(readState());
      this.zoneFrames = {};
      this.insertion = null;
      this.ghost = null;
      this.pointerMove = null;
      this.pointerUp = null;
      this.raf = 0;
      this.drag = null;
    }

    normalizeState(raw) {
      const order = { left: [], center: [], right: [] };
      const seen = new Set();

      for (const zone of ZONES) {
        const saved = Array.isArray(raw.order?.[zone]) ? raw.order[zone] : [];
        saved.forEach(id => {
          if (!ALL_PANEL_IDS.includes(id) || seen.has(id)) return;
          order[zone].push(id);
          seen.add(id);
        });
      }

      for (const zone of ZONES) {
        DEFAULT_ORDER[zone].forEach(id => {
          if (seen.has(id)) return;
          order[zone].push(id);
          seen.add(id);
        });
      }

      return {
        order,
        sizes: raw.sizes && typeof raw.sizes === "object" ? raw.sizes : {},
        columns: raw.columns && typeof raw.columns === "object" ? raw.columns : null,
      };
    }

    init() {
      this.board.classList.add("nb-zoned-dashboard");
      this.board.classList.remove("nb-free-dashboard");

      const footer = document.querySelector("#platformSection");
      if (footer) footer.classList.add("nb-layout-source-empty");

      for (const zone of ["left", "center", "right"]) {
        const frame = document.createElement("div");
        frame.className = `nb-drop-zone is-${zone}`;
        frame.dataset.zone = zone;
        this.zoneFrames[zone] = frame;
      }

      this.board.replaceChildren(
        this.zoneFrames.left,
        this.zoneFrames.center,
        this.zoneFrames.right,
        ...this.panels,
      );

      this.insertion = document.createElement("div");
      this.insertion.className = "nb-insertion-indicator";
      this.board.appendChild(this.insertion);

      this.panels.forEach(panel => {
        this.bindDrag(panel);
        this.bindResize(panel);
      });

      this.layoutAll(false);
      this.persist();
    }

    boardSize() {
      return {
        width: Math.max(360, this.board.clientWidth - GAP * 2),
        height: Math.max(360, this.board.clientHeight - GAP * 2),
      };
    }

    zones() {
      const size = this.boardSize();
      const saved = this.state.columns || {};
      let leftW = saved.left ? saved.left * size.width : clamp(size.width * 0.22, 260, 380);
      let rightW = saved.right ? saved.right * size.width : clamp(size.width * 0.21, 260, 390);
      leftW = clamp(leftW, MIN_ZONE.left, Math.max(MIN_ZONE.left, size.width - MIN_ZONE.center - MIN_ZONE.right - GAP * 2));
      rightW = clamp(rightW, MIN_ZONE.right, Math.max(MIN_ZONE.right, size.width - MIN_ZONE.center - leftW - GAP * 2));
      let centerW = size.width - leftW - rightW - GAP * 2;

      if (centerW < MIN_ZONE.center) {
        const deficit = MIN_ZONE.center - centerW;
        const shrinkLeft = Math.min(deficit / 2, Math.max(0, leftW - MIN_ZONE.left));
        const shrinkRight = Math.min(deficit - shrinkLeft, Math.max(0, rightW - MIN_ZONE.right));
        leftW -= shrinkLeft;
        rightW -= shrinkRight;
        centerW = size.width - leftW - rightW - GAP * 2;
      }

      return {
        left: { x: 0, y: 0, w: leftW, h: size.height },
        center: { x: leftW + GAP, y: 0, w: Math.max(MIN_ZONE.center, centerW), h: size.height },
        right: { x: leftW + GAP + Math.max(MIN_ZONE.center, centerW) + GAP, y: 0, w: rightW, h: size.height },
      };
    }

    zoneOfPoint(clientX, clientY) {
      const boardRect = this.board.getBoundingClientRect();
      const x = clientX - boardRect.left - GAP;
      const y = clientY - boardRect.top - GAP;
      const zones = this.zones();
      return Object.entries(zones).find(([, zone]) => (
        x >= zone.x &&
        x <= zone.x + zone.w &&
        y >= zone.y &&
        y <= zone.y + zone.h
      ))?.[0] || null;
    }

    orderedPanels(zoneName) {
      return (this.state.order[zoneName] || [])
        .map(id => this.panelMap.get(id))
        .filter(Boolean);
    }

    panelZone(panelId) {
      return ZONES.find(zone => (this.state.order[zone] || []).includes(panelId)) || null;
    }

    rectOf(panel) {
      return {
        x: Math.max(0, (parseFloat(panel.style.left) || GAP) - GAP),
        y: Math.max(0, (parseFloat(panel.style.top) || GAP) - GAP),
        w: parseFloat(panel.style.width) || panel.getBoundingClientRect().width,
        h: parseFloat(panel.style.height) || panel.getBoundingClientRect().height,
      };
    }

    applyRect(panel, rect, animate = false) {
      panel.classList.toggle("is-zone-placing", animate);
      panel.style.left = px(rect.x + GAP);
      panel.style.top = px(rect.y + GAP);
      panel.style.width = px(rect.w);
      panel.style.height = px(rect.h);
      panel.classList.toggle("is-compact-card", rect.w < 340);
      panel.classList.toggle("is-narrow-card", rect.w < 270);
      if (animate) window.setTimeout(() => panel.classList.remove("is-zone-placing"), 220);
    }

    fitHeights(zoneName, panels, zoneHeight) {
      if (!panels.length) return [];
      const gapTotal = GAP * (panels.length - 1);
      const available = Math.max(MIN_CARD_HEIGHT, zoneHeight - gapTotal);
      const softMin = Math.max(92, Math.min(MIN_CARD_HEIGHT, Math.floor(available / panels.length)));
      if (available <= panels.length * softMin) {
        return panels.map(() => available / panels.length);
      }
      const heights = panels.map(panel => {
        const id = panel.dataset.zonePanelId;
        const saved = Number(this.state.sizes[id]?.heightRatio || 0);
        const base = saved > 0 ? saved * zoneHeight : DEFAULT_CARD_HEIGHT[id] || 220;
        return Math.max(softMin, base);
      });
      const total = heights.reduce((sum, value) => sum + value, 0);

      if (total < available) {
        heights[heights.length - 1] += available - total;
        return heights;
      }

      if (total > available) {
        const shrinkable = heights.map(height => Math.max(0, height - softMin));
        const shrinkableTotal = shrinkable.reduce((sum, value) => sum + value, 0);
        const overflow = total - available;
        if (shrinkableTotal > 0) {
          return heights.map((height, index) => height - overflow * (shrinkable[index] / shrinkableTotal));
        }
        return heights.map(() => available / heights.length);
      }

      return heights;
    }

    layoutZone(zoneName, animate = false) {
      const zone = this.zones()[zoneName];
      const panels = this.orderedPanels(zoneName);
      panels.forEach(panel => {
        panel.dataset.zoneHome = zoneName;
      });
      if (zoneName === "center") {
        this.layoutCenterZone(zone, panels, animate);
        return;
      }
      const heights = this.fitHeights(zoneName, panels, zone.h);
      let y = zone.y;

      panels.forEach((panel, index) => {
        this.applyRect(panel, {
          x: zone.x,
          y,
          w: zone.w,
          h: heights[index],
        }, animate);
        y += heights[index] + GAP;
      });
    }

    layoutCenterZone(zone, panels, animate = false) {
      if (!panels.length) return;
      if (panels.length === 1) {
        this.applyRect(panels[0], { x: zone.x, y: zone.y, w: zone.w, h: zone.h }, animate);
        return;
      }

      const topPanel = panels[0];
      const bottomPanels = panels.slice(1);
      const saved = Number(this.state.sizes[topPanel.dataset.zonePanelId]?.heightRatio || 0);
      let topHeight = saved > 0 ? saved * zone.h : Math.max(260, zone.h * 0.52);
      const minBottomHeight = Math.min(230, Math.max(MIN_CARD_HEIGHT, zone.h * 0.28));
      topHeight = clamp(topHeight, MIN_CARD_HEIGHT, Math.max(MIN_CARD_HEIGHT, zone.h - minBottomHeight - GAP));
      const bottomHeight = Math.max(MIN_CARD_HEIGHT, zone.h - topHeight - GAP);

      this.applyRect(topPanel, {
        x: zone.x,
        y: zone.y,
        w: zone.w,
        h: topHeight,
      }, animate);

      const bottomWidth = Math.max(160, (zone.w - GAP * (bottomPanels.length - 1)) / bottomPanels.length);
      bottomPanels.forEach((panel, index) => {
        this.applyRect(panel, {
          x: zone.x + index * (bottomWidth + GAP),
          y: zone.y + topHeight + GAP,
          w: bottomWidth,
          h: bottomHeight,
        }, animate);
      });
    }

    layoutAll(animate = false) {
      const zones = this.zones();
      for (const [zoneName, frame] of Object.entries(this.zoneFrames)) {
        const zone = zones[zoneName];
        frame.style.left = px(zone.x + GAP);
        frame.style.top = px(zone.y + GAP);
        frame.style.width = px(zone.w);
        frame.style.height = px(zone.h);
      }
      this.layoutZone("left", animate);
      this.layoutZone("center", animate);
      this.layoutZone("right", animate);
    }

    persist() {
      const zones = this.zones();
      const size = this.boardSize();
      this.state.columns = {
        left: zones.left.w / size.width,
        right: zones.right.w / size.width,
      };
      writeState(this.state);
    }

    hideInsertion() {
      this.insertion?.classList.remove("is-visible");
    }

    showInsertion(zoneName, index) {
      const panels = this.orderedPanels(zoneName);
      const zone = this.zones()[zoneName];
      let y = zone.y + 10;
      if (!panels.length) {
        y = zone.y + 18;
      } else if (index <= 0) {
        y = this.rectOf(panels[0]).y + 4;
      } else if (index >= panels.length) {
        const last = this.rectOf(panels[panels.length - 1]);
        y = Math.min(zone.y + zone.h - 8, last.y + last.h + GAP / 2);
      } else {
        const before = this.rectOf(panels[index - 1]);
        const after = this.rectOf(panels[index]);
        y = before.y + before.h + Math.max(3, (after.y - before.y - before.h) / 2);
      }

      this.insertion.style.left = px(zone.x + GAP + 10);
      this.insertion.style.top = px(y + GAP);
      this.insertion.style.width = px(zone.w - 20);
      this.insertion.classList.add("is-visible");
    }

    insertionIndex(zoneName, clientX, clientY) {
      const boardRect = this.board.getBoundingClientRect();
      const y = clientY - boardRect.top - GAP;
      const panels = this.orderedPanels(zoneName);
      if (zoneName === "center") {
        const top = panels[0] ? this.rectOf(panels[0]) : null;
        if (!top || y < top.y + top.h / 2) return 0;
        const bottomPanels = panels.slice(1);
        if (!bottomPanels.length) return panels.length;
        const boardX = clientX - boardRect.left - GAP;
        for (let index = 0; index < bottomPanels.length; index += 1) {
          const rect = this.rectOf(bottomPanels[index]);
          if (boardX < rect.x + rect.w / 2) return index + 1;
        }
        return panels.length;
      }
      for (let index = 0; index < panels.length; index += 1) {
        const rect = this.rectOf(panels[index]);
        if (y < rect.y + rect.h / 2) return index;
      }
      return panels.length;
    }

    createGhost(panel, event) {
      const rect = panel.getBoundingClientRect();
      const ghost = panel.cloneNode(true);
      stripDuplicateIds(ghost);
      ghost.classList.add("nb-drag-ghost");
      ghost.setAttribute("aria-hidden", "true");
      ghost.style.left = px(rect.left);
      ghost.style.top = px(rect.top);
      ghost.style.width = px(rect.width);
      ghost.style.height = px(rect.height);
      ghost.style.transform = "translate3d(0,0,0)";
      document.body.appendChild(ghost);
      this.ghost = ghost;
      this.drag = {
        panel,
        id: panel.dataset.zonePanelId,
        home: panel.dataset.zoneHome,
        startX: event.clientX,
        startY: event.clientY,
        dropZone: null,
        dropIndex: null,
      };
    }

    moveGhost(event) {
      if (!this.drag || !this.ghost) return;
      const dx = event.clientX - this.drag.startX;
      const dy = event.clientY - this.drag.startY;
      this.ghost.style.transform = `translate3d(${Math.round(dx)}px, ${Math.round(dy)}px, 0)`;

      const zoneName = this.zoneOfPoint(event.clientX, event.clientY);
      if (!zoneName) {
        this.drag.dropZone = null;
        this.drag.dropIndex = null;
        this.ghost.classList.add("is-invalid-drop");
        this.hideInsertion();
        return;
      }

      const index = this.insertionIndex(zoneName, event.clientX, event.clientY);
      this.drag.dropZone = zoneName;
      this.drag.dropIndex = index;
      this.ghost.classList.remove("is-invalid-drop");
      this.showInsertion(zoneName, index);
    }

    finishDrag() {
      if (!this.drag) return;
      const { id, home, dropZone, dropIndex } = this.drag;
      const panel = this.drag.panel;
      this.ghost?.remove();
      this.ghost = null;
      this.hideInsertion();
      panel.classList.remove("is-drag-origin");
      document.body.classList.remove("nb-zone-dragging");

      if (dropZone && Number.isInteger(dropIndex)) {
        const fromZone = this.panelZone(id) || home;
        const currentIndex = (this.state.order[fromZone] || []).indexOf(id);
        ZONES.forEach(zone => {
          this.state.order[zone] = (this.state.order[zone] || []).filter(item => item !== id);
        });
        const order = this.state.order[dropZone] || [];
        let nextIndex = dropIndex;
        if (dropZone === fromZone && currentIndex >= 0 && dropIndex > currentIndex) nextIndex -= 1;
        nextIndex = clamp(nextIndex, 0, order.length);
        order.splice(nextIndex, 0, id);
        this.state.order[dropZone] = order;
        panel.dataset.zoneHome = dropZone;
        this.layoutAll(true);
        this.persist();
      }

      this.drag = null;
    }

    clearGlobalListeners() {
      if (this.pointerMove) window.removeEventListener("pointermove", this.pointerMove);
      if (this.pointerUp) window.removeEventListener("pointerup", this.pointerUp);
      this.pointerMove = null;
      this.pointerUp = null;
      document.body.classList.remove("nb-zone-dragging", "nb-zone-sizing");
    }

    schedule(callback) {
      cancelAnimationFrame(this.raf);
      this.raf = requestAnimationFrame(callback);
    }

    bindDrag(panel) {
      const header = getPanelHeader(panel);
      if (!header) return;
      header.addEventListener("pointerdown", event => {
        if (event.button && event.button !== 0) return;
        if (shouldSkipDrag(event.target)) return;

        event.preventDefault();
        this.clearGlobalListeners();
        panel.classList.add("is-drag-origin");
        document.body.classList.add("nb-zone-dragging");
        this.createGhost(panel, event);
        this.moveGhost(event);

        this.pointerMove = moveEvent => this.schedule(() => this.moveGhost(moveEvent));
        this.pointerUp = () => {
          this.clearGlobalListeners();
          this.finishDrag();
        };

        window.addEventListener("pointermove", this.pointerMove);
        window.addEventListener("pointerup", this.pointerUp, { once: true });
      });
    }

    resizedRect(edge, start, dx, dy) {
      const next = { ...start };
      if (edge.includes("right")) next.w = start.w + dx;
      if (edge.includes("bottom")) next.h = start.h + dy;
      if (edge.includes("left")) {
        next.x = start.x + dx;
        next.w = start.w - dx;
      }
      if (edge.includes("top")) {
        next.y = start.y + dy;
        next.h = start.h - dy;
      }
      next.w = Math.max(160, next.w);
      next.h = Math.max(MIN_CARD_HEIGHT, next.h);
      return next;
    }

    columnResizeMode(zoneName, edge) {
      if (zoneName === "left" && edge.includes("right")) return "left";
      if (zoneName === "right" && edge.includes("left")) return "right";
      if (zoneName === "center" && edge.includes("left")) return "left";
      if (zoneName === "center" && edge.includes("right")) return "right";
      return null;
    }

    resizeColumns(mode, startZones, dx) {
      const size = this.boardSize();
      const available = Math.max(
        MIN_ZONE.left + MIN_ZONE.center + MIN_ZONE.right,
        size.width - GAP * 2,
      );
      let leftW = startZones.left.w;
      let rightW = startZones.right.w;

      if (mode === "left") {
        const maxLeft = Math.max(MIN_ZONE.left, available - MIN_ZONE.center - rightW);
        leftW = clamp(startZones.left.w + dx, MIN_ZONE.left, maxLeft);
      }

      if (mode === "right") {
        const maxRight = Math.max(MIN_ZONE.right, available - MIN_ZONE.center - leftW);
        rightW = clamp(startZones.right.w - dx, MIN_ZONE.right, maxRight);
      }

      this.state.columns = {
        left: leftW / size.width,
        right: rightW / size.width,
      };
      this.layoutAll(false);
    }

    clampRectToHome(panel, rect) {
      const zone = this.zones()[panel.dataset.zoneHome];
      const width = clamp(rect.w, 160, zone.w);
      const height = clamp(rect.h, MIN_CARD_HEIGHT, zone.h);
      return {
        x: clamp(rect.x, zone.x, zone.x + zone.w - width),
        y: clamp(rect.y, zone.y, zone.y + zone.h - height),
        w: width,
        h: height,
      };
    }

    bindResize(panel) {
      panel.querySelectorAll(".nb-zone-resize").forEach(handle => {
        handle.addEventListener("pointerdown", event => {
          if (event.button && event.button !== 0) return;
          event.preventDefault();
          event.stopPropagation();
          this.clearGlobalListeners();

          const edge = handle.dataset.resizeEdge || "bottom";
          const columnMode = this.columnResizeMode(panel.dataset.zoneHome, edge);
          const startZones = this.zones();
          const start = this.rectOf(panel);
          const startX = event.clientX;
          const startY = event.clientY;
          panel.classList.add("is-zone-sizing");
          document.body.classList.add("nb-zone-sizing");

          this.pointerMove = moveEvent => {
            const dx = moveEvent.clientX - startX;
            const dy = moveEvent.clientY - startY;
            if (columnMode) {
              this.schedule(() => this.resizeColumns(columnMode, startZones, dx));
              return;
            }
            const next = this.clampRectToHome(
              panel,
              this.resizedRect(edge, start, dx, dy),
            );
            this.schedule(() => this.applyRect(panel, next, false));
          };

          this.pointerUp = () => {
            this.clearGlobalListeners();
            panel.classList.remove("is-zone-sizing");
            if (columnMode) {
              this.layoutAll(true);
              this.persist();
              return;
            }
            const zoneName = panel.dataset.zoneHome;
            const rect = this.rectOf(panel);
            this.state.sizes[panel.dataset.zonePanelId] = {
              heightRatio: rect.h / this.zones()[zoneName].h,
            };
            this.layoutZone(zoneName, true);
            this.persist();
          };

          window.addEventListener("pointermove", this.pointerMove);
          window.addEventListener("pointerup", this.pointerUp, { once: true });
        });
      });
    }

    refresh() {
      this.layoutAll(false);
    }
  }

  function collectPanels() {
    return PANEL_DEFS.map(markPanel).filter(Boolean);
  }

  const api = {
    dashboard: null,
    init() {
      const board = document.querySelector(".main-layout");
      if (this.dashboard) {
        this.refresh();
        return;
      }
      const panels = collectPanels();
      if (!board || panels.length < PANEL_DEFS.length) return;
      document.querySelectorAll(".layout-resizer,.card-edge-resizer,.nb-splitter,.nb-panel-edge").forEach(node => node.remove());
      this.dashboard = new ZonedDashboard(board, panels);
      this.dashboard.init();
    },
    refresh() {
      this.dashboard?.refresh();
    },
  };

  window.nanobotResizableLayout = api;
  window.initCardResizers = () => {};
  window.refreshCardResizers = () => api.refresh();

  window.addEventListener("DOMContentLoaded", () => api.init());
  window.addEventListener("load", () => api.refresh());
  window.addEventListener("resize", () => api.refresh());
})();
