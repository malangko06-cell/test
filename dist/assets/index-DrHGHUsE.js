(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))l(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const p of n.addedNodes)p.tagName==="LINK"&&p.rel==="modulepreload"&&l(p)}).observe(document,{childList:!0,subtree:!0});function e(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function l(o){if(o.ep)return;o.ep=!0;const n=e(o);fetch(o.href,n)}})();const u=[{id:crypto.randomUUID(),text:"장보기",completed:!1},{id:crypto.randomUUID(),text:"운동 30분 하기",completed:!0},{id:crypto.randomUUID(),text:"책 20페이지 읽기",completed:!1}],f="daily-flow-todos";function m(){try{const s=localStorage.getItem(f);if(!s)return[...u];const t=JSON.parse(s);return Array.isArray(t)?t.filter(e=>e&&typeof e.id=="string"&&typeof e.text=="string"&&typeof e.completed=="boolean"):[...u]}catch{return[...u]}}function y(s){try{localStorage.setItem(f,JSON.stringify(s))}catch{}}const r={todos:m()},c=document.createElement("div");c.className="app-shell";c.innerHTML=`
  <main class="todo-app">
    <section class="hero">
      <p class="eyebrow">Daily Flow</p>
      <h1>할 일 목록</h1>
      <p class="hero-copy">오늘 해야 할 일을 가볍게 정리하고, 끝낸 일은 바로 체크해보세요.</p>
    </section>

    <section class="panel">
      <form class="todo-form" id="todo-form">
        <label class="sr-only" for="todo-input">할 일 입력</label>
        <input
          id="todo-input"
          name="todo"
          type="text"
          maxlength="80"
          placeholder="예: 프로젝트 문서 정리하기"
          autocomplete="off"
        />
        <button type="submit">추가</button>
      </form>

      <div class="todo-toolbar">
        <p id="todo-status" class="todo-status"></p>
      </div>

      <ul id="todo-list" class="todo-list" aria-live="polite"></ul>
    </section>
  </main>
`;document.body.append(c);const g=c.querySelector("#todo-form"),a=c.querySelector("#todo-input"),i=c.querySelector("#todo-list"),h=c.querySelector("#todo-status");function b(s){return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#39;")}function d(){y(r.todos);const s=r.todos.filter(e=>e.completed).length,t=r.todos.length-s;if(h.textContent=r.todos.length===0?"할 일을 추가해 하루를 시작해보세요.":`남은 일 ${t}개, 완료 ${s}개`,r.todos.length===0){i.innerHTML=`
      <li class="empty-state">
        <p>아직 등록된 할 일이 없어요.</p>
      </li>
    `;return}i.innerHTML=r.todos.map(e=>`
        <li class="todo-item ${e.completed?"is-done":""}">
          <label class="todo-check">
            <input
              type="checkbox"
              data-action="toggle"
              data-id="${e.id}"
              ${e.completed?"checked":""}
            />
            <span class="checkmark"></span>
          </label>

          <span class="todo-text">${b(e.text)}</span>

          <button class="delete-button" type="button" data-action="delete" data-id="${e.id}">
            삭제
          </button>
        </li>
      `).join("")}g.addEventListener("submit",s=>{s.preventDefault();const t=a.value.trim();if(!t){a.focus();return}r.todos.unshift({id:crypto.randomUUID(),text:t,completed:!1}),a.value="",d(),a.focus()});i.addEventListener("click",s=>{const t=s.target;if(!(t instanceof HTMLElement))return;const e=t.dataset.action,l=t.dataset.id;!e||!l||e==="delete"&&(r.todos=r.todos.filter(o=>o.id!==l),d())});i.addEventListener("change",s=>{const t=s.target;if(!(t instanceof HTMLInputElement)||t.dataset.action!=="toggle")return;const{id:e}=t.dataset;r.todos=r.todos.map(l=>l.id===e?{...l,completed:t.checked}:l),d()});d();
