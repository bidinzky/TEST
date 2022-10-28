/* eslint-disable @typescript-eslint/no-use-before-define */
import "./styles.css";

const SplitRegex = /{{(.*?)}}/g;
const container = document.querySelector("#app");
const targets = document.querySelectorAll("#app .target") as NodeListOf<
  HTMLDivElement
>;
const addEventListener = (el: HTMLDivElement) => {
  let prevKey: string | null = null;
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Backspace" && prevKey === "Backspace") {
      el.previousSibling?.remove();
      prevKey = null;
      return;
    }

    prevKey = e.key;
  });
  el.addEventListener("input", (_: Event) => {
    SplitRegex.lastIndex = 0;
    const text = el.innerHTML;
    const res = SplitRegex.exec(text) ?? [];
    if (res?.length > 0) {
      const [fullMatch, val] = res;
      const before = text.slice(0, SplitRegex.lastIndex - fullMatch.length);
      const after = text.slice(SplitRegex.lastIndex);
      //console.log(before, val, after);
      el.innerHTML = before;
      const valDiv = createElement();
      const afterDiv = createElement();
      valDiv.innerHTML = val;
      valDiv.contentEditable = "false";
      valDiv.style.color = "red";
      valDiv.onfocus = (e) => {
        valDiv.style.border = "1px solid red !important";
      };
      afterDiv.innerHTML = after;
      el.after(afterDiv);
      if (val.length > 0) {
        el.after(valDiv);
      }
      afterDiv.focus();
      document.querySelectorAll("#app .target").forEach((e) => {});
    }
  });
};

const createElement = () => {
  const el = document.createElement("div");
  el.contentEditable = "true";
  el.classList.add("target");
  addEventListener(el);
  return el;
};

targets.forEach((el) => addEventListener(el));
