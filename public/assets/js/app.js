/* JS para CRUD */
const apiUrl1 = '/noticias';

const LOGIN_URL = "login.html";

const apiUrl2 = '/usuarios';

function readNoticia(processaDados) {
    fetch(apiUrl1)
        .then(response => response.json())
        .then(data => {
            processaDados(data);
        })
        .catch(error => {
            console.error('Erro ao ler noticias via API JSONServer:', error);
            displayMessage("Erro ao ler noticias");
        });
}

function createNoticia(noticia, refreshFunction) {
    fetch(apiUrl1, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticia),
    })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(`Erro ao inserir noticia: ${response.status} ${response.statusText} - ${text}`);
                });
            }
            displayMessage("Noticia inserido com sucesso");

            if (refreshFunction) readNoticia(refreshFunction);
        })
        .catch(error => {
            console.error('Erro ao inserir noticia via API JSONServer:', error);
            displayMessage("Erro ao inserir noticia. Veja o console.");
        });
}

function updateNoticia(id, noticia, refreshFunction) {
    fetch(`${apiUrl1}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(noticia),
    })
        .then(response => {
            displayMessage("noticia alterado com sucesso");
            if (refreshFunction) readNoticia(refreshFunction);
        })
        .catch(error => {
            console.error('Erro ao atualizar noticia via API JSONServer:', error);
            displayMessage("Erro ao atualizar noticia");
        });
}

function deleteNoticia(id, refreshFunction) {
    fetch(`${apiUrl1}/${id}`, {
        method: 'DELETE',
    })
        .then(response => {
            displayMessage("noticia removida com sucesso");
            if (refreshFunction) refreshFunction();
        })
        .catch(error => {
            console.error('Erro ao remover noticia via API JSONServer:', error);
            displayMessage("Erro ao remover noticia");
        });
}

function displayMessage(msg) {
    alert(msg);
}

/* Favoritos */
function favorito(elemento, id) {
    const usuarioCorrente = JSON.parse(sessionStorage.getItem("usuarioCorrente"));
    if (!usuarioCorrente || !usuarioCorrente.login) {
        alert("Você precisa estar logado para favoritar uma notícia.");
        return;
    }

    fetch("http://localhost:3000/noticias")
        .then(res => res.json())
        .then(data => {
            favoritado = data;

            if (elemento.src.includes("/assets/img/coracao.png")) {
                confereFavorito = true;
                elemento.src = "/assets/img/coracao-preenchido.png";
            }
            else {
                elemento.src = "/assets/img/coracao.png";
                confereFavorito = false;
            }

            fetch(`http://localhost:3000/noticias/${id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    favorito: confereFavorito
                })
            })

        })
}

/* Esconde Favoritos e Cadastro */

function confereUsuario() {
    const usuarioCorrente = JSON.parse(sessionStorage.getItem('usuarioCorrente'));
    const cadastroLink = document.getElementById('cadastroHeader');
    const favoritoLink = document.getElementById('favoritoHeader');
    const deslogar = document.getElementById('loginHeader');

    cadastroLink.style.display = 'none';
    favoritoLink.style.display = 'none';

    if (usuarioCorrente && usuarioCorrente.login) {
        deslogar.innerHTML = "<u>Logout</u>";
        deslogar.href = "#";
        deslogar.addEventListener("click", function (e) {
            e.preventDefault();
            logoutUser();
        });

        favoritoLink.style.display = 'inline';

        if (usuarioCorrente.admin == true) {
            cadastroLink.style.display = 'inline';
        }
    } else {
        deslogar.innerHTML = "<u>Login</u>";
        deslogar.href = "login.html";
    }
};

function logoutUser() {
    fetch("http://localhost:3000/noticias")
        .then(res => res.json())
        .then(data => {
            const favoritosMarcados = data.filter(noticia => noticia.favorito === true);

            favoritosMarcados.forEach(noticia => {
                fetch(`http://localhost:3000/noticias/${noticia.id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ favorito: false })
                });
            });

            sessionStorage.setItem('usuarioCorrente', JSON.stringify({}));
            window.location = LOGIN_URL;
        });
}

/* JS Para Login/User */

var db_usuarios = {};

var usuarioCorrente = {};

function generateUUID() {
    var d = new Date().getTime();
    var d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;
        if (d > 0) {
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

const dadosIniciais = {
    usuarios: [
        { "id": generateUUID(), "login": "admin", "senha": "123", "nome": "Administrador do Sistema", "email": "admin@abc.com", "admin": false },
        { "id": generateUUID(), "login": "user", "senha": "123", "nome": "Usuario Comum", "email": "user@abc.com", "admin": false },
    ]
};

function initLoginApp() {
    usuarioCorrenteJSON = sessionStorage.getItem('usuarioCorrente');
    if (usuarioCorrenteJSON) {
        usuarioCorrente = JSON.parse(usuarioCorrenteJSON);
    }


    fetch(apiUrl2)
        .then(response => response.json())
        .then(data => {
            db_usuarios = data;
        })
        .catch(error => {
            console.error('Erro ao ler usuários via API JSONServer:', error);
            displayMessage("Erro ao ler usuários");
        });
};

function loginUser(login, senha) {
    return fetch(apiUrl2)
        .then(response => response.json())
        .then(data => {
            for (let usuario of data) {
                if (login === usuario.login && senha === usuario.senha) {
                    usuarioCorrente = {
                        id: usuario.id,
                        login: usuario.login,
                        email: usuario.email,
                        nome: usuario.nome,
                        admin: usuario.admin
                    };

                    sessionStorage.setItem('usuarioCorrente', JSON.stringify(usuarioCorrente));
                    return true;
                }
            }
            return false;
        })
        .catch(error => {
            console.error("Erro ao fazer login:", error);
            return false;
        });
}

function addUser(nome, login, senha, email, admin) {

    let newId = generateUUID();
    let usuario = { "id": newId, "login": login, "senha": senha, "nome": nome, "email": email, "admin": false };

    fetch(apiUrl2, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuario),
    })
        .then(response => response.json())
        .then(data => {

            db_usuarios.push(usuario);
            displayMessage("Usuário inserido com sucesso");
        })
        .catch(error => {
            console.error('Erro ao inserir usuário via API JSONServer:', error);
            displayMessage("Erro ao inserir usuário");
        });
}

initLoginApp();
