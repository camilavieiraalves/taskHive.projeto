// script.js - lógica da lista + persistência em localStorage
const input = document.getElementById("itemInput");
const addBtn = document.getElementById("addBtn");
const msg = document.getElementById("msg");
const lista = document.getElementById("lista");
const imgInput = document.getElementById("imgInput");
const logoutBtn = document.getElementById("logoutBtn");

// Keys
const PROJECTS_KEY = "taskhive_projects";
const LOGGED_KEY = "taskhive_logged";

// proteção da rota: se não estiver logado, vai para login.html
if (localStorage.getItem(LOGGED_KEY) !== "true") {
  window.location.href = "login.html";
}

// carregar projetos
let projects = loadProjects();
renderProjects();

// adicionar item
addBtn.addEventListener("click", () => {
  const texto = input.value.trim();

  // Validação do texto
  if (texto.length < 5) {
    showMsg("Erro: mínimo de 5 caracteres!", "error");
    input.style.borderColor = "red";
    return;
  }

  // função para continuar depois de ler a imagem (ou usar padrão)
  const finalizeAdd = (imgBase64) => {
    const item = {
      id: Date.now().toString(),
      text: texto,
      image: imgBase64 || "https://cdn-icons-png.flaticon.com/512/992/992651.png"
    };
    projects.push(item);
    saveProjects();
    renderProjects();

    showMsg("Item adicionado com sucesso!", "success");
    input.style.borderColor = "green";

    // Limpa inputs
    input.value = "";
    imgInput.value = "";
  };

  // Se o usuário escolheu imagem, usa FileReader
  if (imgInput.files && imgInput.files[0]) {
    const file = imgInput.files[0];
    if (file.type === "image/png") {
      const reader = new FileReader();
      reader.onload = (e) => {
        finalizeAdd(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      showMsg("Erro: apenas arquivos PNG são permitidos!", "error");
      return;
    }
  } else {
    finalizeAdd(null);
  }
});

// renderização
function renderProjects() {
  lista.innerHTML = "";
  if (!projects || projects.length === 0) return;
  projects.forEach((p, idx) => {
    const li = document.createElement("li");

    const textDiv = document.createElement("div");
    textDiv.className = "text";

    const img = document.createElement("img");
    img.src = p.image;
    img.alt = "ícone";

    const span = document.createElement("span");
    span.textContent = p.text;

    textDiv.appendChild(img);
    textDiv.appendChild(span);

    // editar texto
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.addEventListener("click", () => {
      const novoTexto = prompt("Editar item:", p.text);
      if (novoTexto && novoTexto.trim().length >= 5) {
        p.text = novoTexto.trim();
        saveProjects();
        renderProjects();
        showMsg("Item editado com sucesso!", "success");
      } else {
        showMsg("Erro: mínimo de 5 caracteres para editar!", "error");
      }
    });

    // alterar imagem
    const changeImgBtn = document.createElement("button");
    changeImgBtn.textContent = "Alterar Img";
    changeImgBtn.addEventListener("click", () => {
      // cria input file temporário para trocar a imagem
      const tempInput = document.createElement("input");
      tempInput.type = "file";
      tempInput.accept = "image/png";
      tempInput.style.display = "none";
      document.body.appendChild(tempInput);
      tempInput.click();
      tempInput.addEventListener("change", () => {
        if (tempInput.files && tempInput.files[0]) {
          const f = tempInput.files[0];
          if (f.type === "image/png") {
            const reader = new FileReader();
            reader.onload = (e) => {
              p.image = e.target.result;
              saveProjects();
              renderProjects();
              showMsg("Imagem atualizada!", "success");
              document.body.removeChild(tempInput);
            };
            reader.readAsDataURL(f);
          } else {
            showMsg("Erro: apenas PNG permitido!", "error");
            document.body.removeChild(tempInput);
          }
        } else {
          document.body.removeChild(tempInput);
        }
      });
    });

    // excluir
    const delBtn = document.createElement("button");
    delBtn.textContent = "Excluir";
    delBtn.addEventListener("click", () => {
      projects = projects.filter(item => item.id !== p.id);
      saveProjects();
      renderProjects();
      showMsg("Item excluído!", "error");
    });

    // mover para cima
    const upBtn = document.createElement("button");
    upBtn.textContent = "↑";
    upBtn.addEventListener("click", () => {
      if (idx === 0) return;
      const tmp = projects[idx - 1];
      projects[idx - 1] = projects[idx];
      projects[idx] = tmp;
      saveProjects();
      renderProjects();
    });

    // mover para baixo
    const downBtn = document.createElement("button");
    downBtn.textContent = "↓";
    downBtn.addEventListener("click", () => {
      if (idx === projects.length - 1) return;
      const tmp = projects[idx + 1];
      projects[idx + 1] = projects[idx];
      projects[idx] = tmp;
      saveProjects();
      renderProjects();
    });

    li.appendChild(textDiv);
    li.appendChild(editBtn);
    li.appendChild(changeImgBtn);
    li.appendChild(delBtn);
    li.appendChild(upBtn);
    li.appendChild(downBtn);

    lista.appendChild(li);
  });
}

// persistência
function saveProjects() {
  localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
}

function loadProjects() {
  const raw = localStorage.getItem(PROJECTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("Erro ao carregar projetos:", e);
    return [];
  }
}

// mensagens
let clearMsgTimeout = null;
function showMsg(text, type) {
  if (!msg) return;
  msg.textContent = text;
  msg.className = type;
  if (clearMsgTimeout) clearTimeout(clearMsgTimeout);
  clearMsgTimeout = setTimeout(() => {
    msg.textContent = "";
    msg.className = "";
  }, 3000);
}

// logout
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem(LOGGED_KEY);
    localStorage.removeItem('taskhive_logged_user');
    window.location.href = "login.html";
  });
}