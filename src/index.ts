/* eslint-disable @typescript-eslint/no-use-before-define */
import "./styles.css";

const SplitRegex = /{{(.*?)}}/g;
const container = document.querySelector("#app");
const targets = document.querySelectorAll(
  "#app .target"
) as NodeListOf<HTMLDivElement>;
const addEventListener = (el: HTMLDivElement) => {
  let prevKey: string | null = null;
  el.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Backspace" && el.contentEditable !== "true") {
      el.remove();
      prevKey = null;
    } else if (e.key === "Backspace" && prevKey === "Backspace") {
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
      const valueCount = [before, val, after].reduce(
        (acc, e) => (acc + e.length === 0 ? 1 : 0),
        0
      );
      //console.log(before, val, after);
      const divs = [el];
      for (let i = 0; i < valueCount - 1; i++) {
        divs.push(createElement());
      }

      if (before.length > 0) {
        const beforeDiv = divs.shift();
        beforeDiv!.innerHTML = before;
        divs.push(beforeDiv!);
      }

      if (val.length > 0) {
        const valDiv = divs.shift()!;
        valDiv.innerHTML = val;
        valDiv.contentEditable = "false";
        valDiv.style.color = "red";
        divs.push(valDiv);
      }

      if (after.length > 0) {
        const afterDiv = divs.shift()!;
        afterDiv.innerHTML = after;
        divs.push(afterDiv);
      }

      el.after(...divs);
      divs[divs.length - 1].focus();
      document
        .querySelectorAll("#app .target")
        .forEach((e, i) => ((e as HTMLElement).tabIndex = i));
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
