const initialTodos = [
  { id: crypto.randomUUID(), text: "장보기", completed: false },
  { id: crypto.randomUUID(), text: "운동 30분 하기", completed: true },
  { id: crypto.randomUUID(), text: "책 20페이지 읽기", completed: false },
];

const STORAGE_KEY = "daily-flow-todos";

function loadTodos() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      return [...initialTodos];
    }

    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed)) {
      return [...initialTodos];
    }

    return parsed.filter(
      (todo) =>
        todo &&
        typeof todo.id === "string" &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
  } catch {
    return [...initialTodos];
  }
}

function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Ignore storage failures so the UI remains usable.
  }
}

const state = {
  todos: loadTodos(),
};

const app = document.createElement("div");
app.className = "app-shell";

app.innerHTML = `
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
`;

document.body.append(app);

const form = app.querySelector("#todo-form");
const input = app.querySelector("#todo-input");
const list = app.querySelector("#todo-list");
const status = app.querySelector("#todo-status");

function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function render() {
  saveTodos(state.todos);

  const completedCount = state.todos.filter((todo) => todo.completed).length;
  const remainingCount = state.todos.length - completedCount;

  status.textContent =
    state.todos.length === 0
      ? "할 일을 추가해 하루를 시작해보세요."
      : `남은 일 ${remainingCount}개, 완료 ${completedCount}개`;

  if (state.todos.length === 0) {
    list.innerHTML = `
      <li class="empty-state">
        <p>아직 등록된 할 일이 없어요.</p>
      </li>
    `;
    return;
  }

  list.innerHTML = state.todos
    .map(
      (todo) => `
        <li class="todo-item ${todo.completed ? "is-done" : ""}">
          <label class="todo-check">
            <input
              type="checkbox"
              data-action="toggle"
              data-id="${todo.id}"
              ${todo.completed ? "checked" : ""}
            />
            <span class="checkmark"></span>
          </label>

          <span class="todo-text">${escapeHtml(todo.text)}</span>

          <button class="delete-button" type="button" data-action="delete" data-id="${todo.id}">
            삭제
          </button>
        </li>
      `
    )
    .join("");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  state.todos.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  input.value = "";
  render();
  input.focus();
});

list.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const action = target.dataset.action;
  const id = target.dataset.id;

  if (!action || !id) {
    return;
  }

  if (action === "delete") {
    state.todos = state.todos.filter((todo) => todo.id !== id);
    render();
  }
});

list.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.dataset.action !== "toggle") {
    return;
  }

  const { id } = target.dataset;
  state.todos = state.todos.map((todo) =>
    todo.id === id ? { ...todo, completed: target.checked } : todo
  );
  render();
});

render();
