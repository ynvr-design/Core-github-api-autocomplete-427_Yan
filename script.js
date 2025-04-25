const searchInput = document.getElementById("search");
const autocompleteList = document.getElementById("autocomplete");
const repoList = document.getElementById("repo-list");

function debounce(fn, delay) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}

async function fetchRepos(query) {
  if (!query) {
    autocompleteList.innerHTML = "";
    return;
  }

  const response = await fetch(
    `https://api.github.com/search/repositories?q=${query}&per_page=5`
  );
  const data = await response.json();

  showAutocomplete(data.items || []);
}

function showAutocomplete(repos) {
  autocompleteList.innerHTML = "";
  repos.forEach((repo) => {
    const li = document.createElement("li");
    li.textContent = repo.name;
    li.classList.add("autocomplete-item");
    li.addEventListener("click", () => addRepo(repo));
    autocompleteList.appendChild(li);
  });
}

function addRepo(repo) {
  const item = document.createElement("div");
  item.classList.add("repo-item");

  item.innerHTML = `
    <p>Name: ${repo.name}</p>
    <p>Owner: ${repo.owner.login}</p>
    <p>Stars: ${repo.stargazers_count}</p>
    <button class="remove-btn">X</button>
  `;

  item.querySelector(".remove-btn").addEventListener("click", () => {
    item.remove();
  });

  repoList.appendChild(item);
  searchInput.value = "";
  autocompleteList.innerHTML = "";
}

searchInput.addEventListener(
  "input",
  debounce((e) => {
    fetchRepos(e.target.value);
  }, 500)
);
