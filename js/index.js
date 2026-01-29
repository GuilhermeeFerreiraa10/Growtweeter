document.addEventListener('DOMContentLoaded', () => {
    const timeline = document.getElementById('timeline');
    const inputTweet = document.getElementById('tweet-content');
    const btnTweetar = document.getElementById('btn-tweetar');
    const btnTema = document.getElementById('theme-toggle');
    
    let user = JSON.parse(localStorage.getItem('user')) || { id: 'a248c7da-f067-4d3b-898e-5c3f6537637b', username: 'Guilherme' };
    const API_URL = 'https://growtweet.vercel.app';
    let feed = [];

    async function carregarTweets() {
        try {
            const res = await fetch(`${API_URL}/tweet`);
            const tweetsBanco = await res.json();

            const feedDaAPI = tweetsBanco.map(t => {
                const euCurti = t.likes ? t.likes.some(like => like.userId === user.id) : false;
                return {
                    id: t.id,
                    nome: t.user?.name || "Guilherme Ferreira",
                    arroba: t.user?.username || "ferreirauilhermee",
                    texto: t.content,
                    foto: "/assets/fotoDePerfil.jpg",
                    likes: t.likes ? t.likes.length : 0,
                    euCurti: euCurti, 
                    comments: t._count ? t._count.comments : 0, 
                    podeExcluir: t.userId === user.id,
                    verificado: true
                };
            });

            feed = [...feedDaAPI, ...feedPadrao];
            renderizarFeed();
        } catch (e) {
            console.error("Erro ao carregar tweets:", e);
            feed = feedPadrao;
            renderizarFeed();
        }
    }

    // --- FUNÇÃO COMENTAR (CORRIGIDA) ---
    window.comentar = async (tweetId) => {
        // Evita comentar nos tweets fixos (IDs 1, 2, 3) que não estão no banco
        if (tweetId === "1" || tweetId === "2" || tweetId === "3") {
            return alert("Este é um tweet fixo, comente em um tweet real!");
        }

        const comentario = prompt("O que você está pensando?");
        if (!comentario) return;

        try {
            const response = await fetch(`${API_URL}/tweet/comment`, { // URL CORRETA
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: comentario,
                    userId: user.id,
                    tweetId: tweetId
                })
            });

            if (response.ok) {
                alert("Comentário enviado!");
                await carregarTweets(); // Recarrega para atualizar o número no balãozinho
            } else {
                alert("Erro ao enviar comentário no servidor.");
            }
        } catch (error) {
            console.error("Erro na comunicação:", error);
        }
    };

    // --- FUNÇÃO CURTIR ---
    let processandoLike = false;
    window.curtir = async (tweetId) => {
        if (processandoLike) return; 
        
        // Lógica para tweets fixos
        if (tweetId === "1" || tweetId === "2" || tweetId === "3") {
            const tweetFixo = feedPadrao.find(t => t.id === tweetId);
            if (tweetFixo) {
                tweetFixo.euCurti = !tweetFixo.euCurti;
                tweetFixo.likes += tweetFixo.euCurti ? 1 : -1;
                renderizarFeed();
                return;
            }
        }

        const tweetNoFeed = feed.find(t => t.id === tweetId);
        if (tweetNoFeed) {
            tweetNoFeed.euCurti = !tweetNoFeed.euCurti;
            tweetNoFeed.likes += tweetNoFeed.euCurti ? 1 : -1; 
            renderizarFeed();
        }

        processandoLike = true;
        try {
            await fetch(`${API_URL}/tweet/like`, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id, tweetId: tweetId })
            });
            await carregarTweets(); 
        } catch (error) {
            console.error("Erro ao curtir:", error);
            await carregarTweets(); 
        } finally {
            processandoLike = false; 
        }
    };

    // --- POSTAR TWEET ---
    if (btnTweetar) {
        btnTweetar.onclick = async () => {
            const texto = inputTweet.value.trim();
            if (!texto || !user.id) return;

            try {
                const response = await fetch(`${API_URL}/tweet`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content: texto, userId: user.id })
                });

                if (response.ok) {
                    inputTweet.value = '';
                    await carregarTweets();
                }
            } catch (error) {
                console.error("Erro ao enviar:", error);
            }
        };
    }

    // --- TEMA E EXCLUIR (MANTIDOS) ---
    window.excluirTweet = async (id) => {
        if (!confirm("Deseja apagar este tweet?")) return;
        try {
            const res = await fetch(`${API_URL}/tweet/${id}`, { method: 'DELETE' });
            if (res.ok) await carregarTweets();
        } catch (e) { alert("Erro ao excluir."); }
    };

    const feedPadrao = [
        { id: '1', nome: "Blumhouse", arroba: "blumhouse", texto: "The future of FNAF is bright!", foto: "/assets/Blumhouse-logo.jpg", likes: 85400, euCurti: false, comments: 1200, podeExcluir: false, verificado: true },
        { id: '2', nome: "GrowDev", arroba: "growdevers", texto: "Vamos codar hoje?", foto: "/assets/growdev.png", likes: 1200, euCurti: false, comments: 45, podeExcluir: false, verificado: true },
        { id: '3', nome: "Dexter Moser", arroba: "michaelC.Hall", texto: "Open your eyes and look at what you did!", foto: "/assets/Michael C. Hall.jpg", likes: 1200, euCurti: false, comments: 45, podeExcluir: false, verificado: true }
    ];

    function renderizarFeed() {
        if (!timeline) return;
        timeline.innerHTML = feed.map(t => `
            <div class="tweet-card">
                <img src="${t.foto}" class="avatar" onerror="this.src='/assets/fotoDePerfil.jpg'">
                <div style="flex:1">
                    <div style="display:flex; justify-content:space-between; align-items: center;">
                        <strong>${t.nome} <span style="color:var(--text-secondary); font-weight:normal">@${t.arroba}</span></strong>
                        ${t.podeExcluir ? `<button onclick="excluirTweet('${t.id}')" style="background:transparent; border:none; cursor:pointer; font-size:1.2rem">🗑️</button>` : ''}
                    </div>
                    <p style="margin-top:5px">${t.texto}</p>
                    <div class="tweet-actions">
                        <button onclick="curtir('${t.id}')" class="btn-action" style="cursor:pointer; background:none; border:none; color: ${t.euCurti ? '#f4212e' : 'inherit'}">
                            ${t.euCurti ? '❤️' : '🤍'} <span>${t.likes.toLocaleString()}</span>
                        </button>
                        <button onclick="comentar('${t.id}')" class="btn-action" style="background:none; border:none; cursor:pointer;">
                            💬 <span>${t.comments}</span>
                        </button>
                    </div>
                </div>
            </div>`).join('');
    }

    carregarTweets();
});