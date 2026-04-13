//Time remaining logic
const timeEl = document.querySelector(
  '[data-testid="test-todo-time-remaining"]',
);

const dueDate = new Date("2026-04-16T18:00:00");

function updateTimeRemaining() {
  const now = new Date();
  const diff = dueDate - now;

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.round(diff / (1000 * 60 * 60 * 24));

  let text = "";

  if (diff < 0) {
    const overdueHours = Math.abs(hours);
    text = `Overdue by ${overdueHours} hour(s)`;
  } else if (minutes < 1) {
    text = "Due now!";
  } else if (hours < 24) {
    text = `Due in ${hours} hour(s)`;
  } else if (days === 1) {
    text = "Due tomorrow";
  } else {
    text = `Due in ${days} days`;
  }

  let textNode = timeEl.querySelector("span");
  if (!textNode) {
    textNode = document.createElement("span");
    timeEl.appendChild(textNode);
  }
  textNode.textContent = text;
}

updateTimeRemaining();

setInterval(updateTimeRemaining, 60000);

//Checkbox behaviour
const checkbox = document.querySelector(
  '[data-testid="test-todo-complete-toggle"]',
);

const title = document.querySelector('[data-testid="test-todo-title"]');

const status = document.querySelector('[data-testid="test-todo-status"]');

checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    title.style.textDecoration = "line-through";
    status.textContent = "Done";
    status.style.color = "var(--complete)";
  } else {
    title.style.textDecoration = "none";
    status.textContent = "In Progress";
    status.style.color = "var(--accent)";
  }
});

//Button Action
const editBtn = document.querySelector('[data-testid="test-todo-edit-button"]');

const deleteBtn = document.querySelector(
  '[data-testid="test-todo-delete-button"]',
);

editBtn.addEventListener("click", () => {
  alert("edit clicked");
});

deleteBtn.addEventListener("click", () => {
  alert("Delete clicked");
});
