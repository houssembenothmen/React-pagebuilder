// library/advanced/countdown/index.tsx
import { Clock } from "lucide-react";
import type { ComponentDefinition } from "@/components/pagebuilder/core/types";
import { escapeHtml } from "@/components/pagebuilder/core/utils/escapeHtml";
import CountdownRenderer from "./CountdownRenderer";

interface CountdownProps { targetDate: string }

const Countdown: ComponentDefinition<CountdownProps> = {
    title: "Countdown",
    group: "Advanced",
    icon: Clock,
    tag: "advanced",
    label: "Countdown",
    defaultProps: () => ({ targetDate: "" }),
    fields: [{ key: "targetDate", kind: "date", label: "Target date" }],
    render: ({ props, set }) => <CountdownRenderer target={props.targetDate} onSet={(targetDate) => set({ targetDate })} />,

    // Emit the actual spans the shared script (below) fills in. Values start
    // at 0 and get corrected on the client's first tick — this also means
    // the page shows *something* immediately even before JS runs, instead
    // of a blank div.
    renderStatic: (props) => {
        if (!props.targetDate) return "";
        return `
<div class="pb-el-countdown" data-countdown data-target="${escapeHtml(props.targetDate)}">
  <span><span data-countdown-days>0</span>d</span>
  <span><span data-countdown-hours>0</span>h</span>
  <span><span data-countdown-minutes>0</span>m</span>
  <span><span data-countdown-seconds>0</span>s</span>
</div>`;
    },

    css: `.pb-el-countdown { display: flex; gap: 10px; font-weight: 600; font-size: 14px; }`,

    // Runs once in the exported page regardless of how many Countdown
    // instances exist, guarded the same way as Stat Counter's js.
    js: `
(function () {
  if (window.__pbCountdownInit) return;
  window.__pbCountdownInit = true;

  function tick(el) {
    var target = new Date(el.getAttribute('data-target')).getTime();
    var now = Date.now();
    var diff = Math.max(0, target - now);

    var days = Math.floor(diff / 86400000);
    var hours = Math.floor((diff % 86400000) / 3600000);
    var minutes = Math.floor((diff % 3600000) / 60000);
    var seconds = Math.floor((diff % 60000) / 1000);

    var d = el.querySelector('[data-countdown-days]');
    var h = el.querySelector('[data-countdown-hours]');
    var m = el.querySelector('[data-countdown-minutes]');
    var s = el.querySelector('[data-countdown-seconds]');
    if (d) d.textContent = String(days);
    if (h) h.textContent = String(hours);
    if (m) m.textContent = String(minutes);
    if (s) s.textContent = String(seconds);
  }

  var els = document.querySelectorAll('[data-countdown]');
  els.forEach(tick);
  setInterval(function () {
    els.forEach(tick);
  }, 1000);
})();
`,
};

export default Countdown;