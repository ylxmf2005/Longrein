(() => {
  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  };

  const explicitLanguage = (element) => {
    const classes = [element, element.parentElement]
      .filter(Boolean)
      .flatMap((node) => Array.from(node.classList));
    const languageClass = classes.find((name) => /^(?:language|lang)-/.test(name));
    return languageClass ? languageClass.replace(/^(?:language|lang)-/, "") : null;
  };

  const isHighlightDisabled = (element) =>
    [element, element.parentElement]
      .filter(Boolean)
      .some((node) => node.classList.contains("nohighlight") || node.classList.contains("no-highlight"));

  const parseLineRanges = (value) => {
    if (!value) return [];
    return value.split(",").flatMap((part) => {
      const match = part.trim().match(/^(\d+)(?:-(\d+))?$/);
      if (!match) return [];
      const start = Number(match[1]);
      const end = Number(match[2] || match[1]);
      return start > 0 && end >= start ? [{ start, end }] : [];
    });
  };

  const emphasizeLines = (element) => {
    const pre = element.matches("pre") ? element : element.closest("pre");
    if (!pre || pre.querySelector(":scope > .walkthrough-code-emphasis-layer")) return;
    const ranges = parseLineRanges(element.dataset.highlightLines || pre.dataset.highlightLines);
    if (!ranges.length) return;

    const layer = document.createElement("span");
    pre.classList.add("walkthrough-code-block");
    layer.className = "walkthrough-code-emphasis-layer";
    layer.setAttribute("aria-hidden", "true");
    ranges.forEach(({ start, end }) => {
      const marker = document.createElement("span");
      marker.className = "walkthrough-code-emphasis";
      marker.dataset.startLine = String(start);
      marker.dataset.endLine = String(end);
      layer.appendChild(marker);
    });
    pre.insertBefore(layer, pre.firstChild);

    const positionMarkers = () => {
      const style = getComputedStyle(element);
      const preStyle = getComputedStyle(pre);
      const lineHeight = Number.parseFloat(style.lineHeight);
      const paddingTop = Number.parseFloat(preStyle.paddingTop) || 0;
      if (!Number.isFinite(lineHeight)) return;
      layer.style.width = `${Math.max(pre.scrollWidth, pre.clientWidth)}px`;
      layer.querySelectorAll(".walkthrough-code-emphasis").forEach((marker) => {
        const start = Number(marker.dataset.startLine);
        const end = Number(marker.dataset.endLine);
        marker.style.top = `${paddingTop + (start - 1) * lineHeight}px`;
        marker.style.height = `${(end - start + 1) * lineHeight}px`;
      });
    };
    positionMarkers();
    window.addEventListener("resize", positionMarkers, { passive: true });
  };

  const highlightCode = () => {
    if (!window.hljs) return;
    const config = Object.assign(
      { autoDetect: true, autoDetectLanguages: undefined },
      window.WALKTHROUGH_HIGHLIGHT_CONFIG || {}
    );
    const candidates = Array.from(
      document.querySelectorAll('pre > code, pre[class*="language-"], pre[class*="lang-"]')
    ).filter(
      (element) =>
        !element.classList.contains("mermaid") &&
        !element.closest(".mermaid") &&
        !(element.matches("pre") && element.querySelector(":scope > code"))
    );

    candidates.forEach((element) => {
      if (element.dataset.walkthroughHighlighted === "true" || isHighlightDisabled(element)) {
        emphasizeLines(element);
        return;
      }

      const language = explicitLanguage(element);
      let result = null;
      if (language && window.hljs.getLanguage(language)) {
        result = window.hljs.highlight(element.textContent, {
          language,
          ignoreIllegals: true,
        });
      } else if (!language && config.autoDetect !== false) {
        result = window.hljs.highlightAuto(element.textContent, config.autoDetectLanguages);
      }

      if (result) {
        element.innerHTML = result.value;
        element.classList.add("hljs");
        if (!language && result.language) element.classList.add(`language-${result.language}`);
      }
      element.dataset.walkthroughHighlighted = "true";
      emphasizeLines(element);
    });
  };

  const initializeMermaid = () => {
    const diagrams = Array.from(document.querySelectorAll(".mermaid"));
    if (!diagrams.length || !window.mermaid) return;

    const language = (document.documentElement.lang || "zh").toLowerCase();
    const defaults = language.startsWith("en")
      ? { enter: "View fullscreen", exit: "Exit fullscreen" }
      : { enter: "全屏查看", exit: "退出全屏" };

    const prepareDiagram = (diagram) => {
      let container = diagram.closest(".walkthrough-diagram");
      if (!container) {
        container = document.createElement("figure");
        container.className = "walkthrough-diagram";
        diagram.parentNode.insertBefore(container, diagram);
        container.appendChild(diagram);
      }

      if (!container.querySelector(".walkthrough-diagram__fullscreen")) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "walkthrough-diagram__fullscreen";
        button.dataset.enterLabel = container.dataset.fullscreenLabel || defaults.enter;
        button.dataset.exitLabel = container.dataset.exitFullscreenLabel || defaults.exit;
        button.setAttribute("aria-label", button.dataset.enterLabel);
        button.setAttribute("aria-pressed", "false");
        button.title = button.dataset.enterLabel;
        const icon = document.createElement("span");
        icon.className = "walkthrough-diagram__fullscreen-icon";
        icon.setAttribute("aria-hidden", "true");
        button.appendChild(icon);
        if (!container.requestFullscreen) button.hidden = true;
        container.insertBefore(button, container.firstChild);
      }
      return container;
    };

    const containers = diagrams.map(prepareDiagram);

    document.addEventListener("click", async (event) => {
      const button = event.target.closest(".walkthrough-diagram__fullscreen");
      if (!button) return;
      const container = button.closest(".walkthrough-diagram");
      try {
        if (document.fullscreenElement === container) {
          await document.exitFullscreen();
        } else {
          await container.requestFullscreen();
        }
      } catch (error) {
        console.warn("Walkthrough fullscreen failed", error);
      }
    });

    document.addEventListener("fullscreenchange", () => {
      containers.forEach((container) => {
        const button = container.querySelector(".walkthrough-diagram__fullscreen");
        const active = document.fullscreenElement === container;
        const label = active ? button.dataset.exitLabel : button.dataset.enterLabel;
        button.setAttribute("aria-label", label);
        button.setAttribute("aria-pressed", String(active));
        button.title = label;
      });
    });

    const config = Object.assign(
      { startOnLoad: false, securityLevel: "strict", theme: "neutral" },
      window.WALKTHROUGH_MERMAID_CONFIG || {}
    );
    window.mermaid.initialize(config);
    window.mermaid.run({ nodes: diagrams });
  };

  onReady(() => {
    highlightCode();
    initializeMermaid();
  });
})();
