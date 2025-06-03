/* JS para CRUD */
const apiUrl = '/noticias';

function readNoticia(processaDados) {
    fetch(apiUrl)
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
    fetch(apiUrl, {
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
    fetch(`${apiUrl}/${id}`, {
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
    fetch(`${apiUrl}/${id}`, {
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

/* Login */