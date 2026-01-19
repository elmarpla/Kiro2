class ChinchonGame {
    constructor() {
        this.currentGame = null;
        this.games = [];
        this.pausedGames = [];
        // Usar JSONBin.io como backend gratuito para persistencia entre dispositivos
        this.apiUrl = 'https://api.jsonbin.io/v3/b/67936f4bad19ca34f8d4c8e2';
        this.apiKey = '$2a$10$VQzKvO9QiU5l5FjhqKvO9QeU5l5FjhqKvO9QeU5l5FjhqKvO9Qe';
        this.gameId = this.getOrCreateGameId();
        this.init();
    }

    getOrCreateGameId() {
        // Crear un ID único por usuario/dispositivo para identificar las partidas
        let gameId = localStorage.getItem('chinchon-game-id');
        if (!gameId) {
            gameId = 'chinchon_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chinchon-game-id', gameId);
        }
        return gameId;
    }

    init() {
        this.setupEventListeners();
        this.updatePlayerInputs();
        this.loadData();
        this.showScreen('setup-screen');
        
        // Auto-sincronizar cada 10 segundos
        setInterval(() => {
            if (this.currentGame && this.currentGame.status === 'playing') {
                this.syncData();
            }
        }, 10000);
    }

    setupEventListeners() {
        // Setup screen
        document.getElementById('player-count').addEventListener('change', () => {
            this.updatePlayerInputs();
        });
        
        document.getElementById('start-game').addEventListener('click', () => {
            this.startNewGame();
        });
        
        document.getElementById('load-game').addEventListener('click', () => {
            this.showLoadScreen();
        });
        
        document.getElementById('view-history').addEventListener('click', () => {
            this.showHistoryScreen();
        });

        // Game screen
        document.getElementById('add-hand').addEventListener('click', () => {
            this.addHand();
        });
        
        document.getElementById('pause-game').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('end-game').addEventListener('click', () => {
            this.endGame();
        });

        // Navigation
        document.getElementById('back-to-setup').addEventListener('click', () => {
            this.showScreen('setup-screen');
        });
        
        document.getElementById('back-to-setup-2').addEventListener('click', () => {
            this.showScreen('setup-screen');
        });
    }

    updatePlayerInputs() {
        const playerCount = parseInt(document.getElementById('player-count').value);
        const container = document.getElementById('players-names');
        
        container.innerHTML = '';
        
        for (let i = 1; i <= playerCount; i++) {
            const div = document.createElement('div');
            div.className = 'player-input';
            div.innerHTML = `
                <label for="player-${i}">Jugador ${i}:</label>
                <input type="text" id="player-${i}" placeholder="Nombre del jugador ${i}" required>
            `;
            container.appendChild(div);
        }
    }

    startNewGame() {
        const playerCount = parseInt(document.getElementById('player-count').value);
        const players = [];
        
        // Validar nombres de jugadores
        for (let i = 1; i <= playerCount; i++) {
            const name = document.getElementById(`player-${i}`).value.trim();
            if (!name) {
                alert(`Por favor ingresa el nombre del jugador ${i}`);
                return;
            }
            players.push({
                name: name,
                score: 0
            });
        }

        // Crear nueva partida
        this.currentGame = {
            id: Date.now(),
            gameId: this.gameId,
            players: players,
            hands: [],
            currentHand: 1,
            startTime: new Date(),
            status: 'playing',
            lastUpdate: new Date()
        };

        this.setupGameScreen();
        this.showScreen('game-screen');
        
        // Guardar inmediatamente
        this.syncData();
    }

    setupGameScreen() {
        // Actualizar número de mano
        document.getElementById('hand-number').textContent = this.currentGame.currentHand;
        
        // Crear tablero de puntuaciones
        this.updateScoreboard();
        
        // Crear inputs para la mano actual
        this.updateHandInputs();
        
        // Actualizar historial de manos
        this.updateHandsHistory();
    }

    updateScoreboard() {
        const container = document.getElementById('players-scores');
        container.innerHTML = '';
        
        this.currentGame.players.forEach((player, index) => {
            const div = document.createElement('div');
            let scoreClass = '';
            let playerClass = '';
            
            if (player.score > 0) {
                scoreClass = 'positive';
                playerClass = 'positive';
            } else if (player.score < 0) {
                scoreClass = 'negative';
                playerClass = 'negative';
            }
            
            div.className = `player-score ${playerClass}`;
            div.innerHTML = `
                <h4>${player.name}</h4>
                <div class="score ${scoreClass}">${player.score >= 0 ? '+' : ''}${player.score}</div>
            `;
            container.appendChild(div);
        });
    }

    updateHandInputs() {
        const container = document.getElementById('hand-inputs');
        container.innerHTML = '';
        
        this.currentGame.players.forEach((player, index) => {
            const div = document.createElement('div');
            div.className = 'hand-input-group';
            div.innerHTML = `
                <label for="hand-${index}">${player.name}</label>
                <input type="number" id="hand-${index}" placeholder="0" step="1">
            `;
            container.appendChild(div);
        });
    }

    addHand() {
        const handScores = [];
        let hasValues = false;
        
        // Recoger puntos de la mano
        this.currentGame.players.forEach((player, index) => {
            const input = document.getElementById(`hand-${index}`);
            const score = parseInt(input.value) || 0;
            
            if (input.value !== '') {
                hasValues = true;
            }
            
            handScores.push(score);
        });
        
        if (!hasValues) {
            alert('Ingresa al menos un puntaje para continuar');
            return;
        }
        
        // Agregar mano al historial
        this.currentGame.hands.push({
            hand: this.currentGame.currentHand,
            scores: [...handScores],
            timestamp: new Date()
        });
        
        // Actualizar puntuaciones totales
        this.currentGame.players.forEach((player, index) => {
            player.score += handScores[index];
        });
        
        // Siguiente mano
        this.currentGame.currentHand++;
        this.currentGame.lastUpdate = new Date();
        
        this.setupGameScreen();
        
        // Limpiar inputs
        this.currentGame.players.forEach((player, index) => {
            document.getElementById(`hand-${index}`).value = '';
        });

        // Sincronizar inmediatamente
        this.syncData();
    }

    updateHandsHistory() {
        const container = document.getElementById('hands-list');
        container.innerHTML = '';
        
        this.currentGame.hands.forEach(hand => {
            const div = document.createElement('div');
            div.className = 'hand-row';
            
            let html = `<div class="hand-label">Mano ${hand.hand}</div>`;
            hand.scores.forEach(score => {
                const scoreClass = score > 0 ? 'positive' : score < 0 ? 'negative' : '';
                const scoreText = score >= 0 ? `+${score}` : `${score}`;
                html += `<div class="hand-score ${scoreClass}">${scoreText}</div>`;
            });
            
            div.innerHTML = html;
            container.appendChild(div);
        });
    }

    pauseGame() {
        if (!this.currentGame) return;
        
        this.currentGame.status = 'paused';
        this.currentGame.pauseTime = new Date();
        this.currentGame.lastUpdate = new Date();
        
        // Guardar en partidas pausadas
        this.pausedGames.push({...this.currentGame});
        this.syncData();
        
        alert('Partida pausada correctamente');
        this.showScreen('setup-screen');
        this.currentGame = null;
    }

    endGame() {
        if (!this.currentGame) return;
        
        if (confirm('¿Estás seguro de que quieres terminar la partida?')) {
            this.currentGame.status = 'finished';
            this.currentGame.endTime = new Date();
            this.currentGame.lastUpdate = new Date();
            
            // Guardar en historial
            this.games.push({...this.currentGame});
            this.syncData();
            
            alert('Partida terminada y guardada');
            this.showScreen('setup-screen');
            this.currentGame = null;
        }
    }

    showLoadScreen() {
        // Cargar datos más recientes antes de mostrar
        this.loadData().then(() => {
            this.updatePausedGamesList();
            this.showScreen('load-screen');
        });
    }

    updatePausedGamesList() {
        const container = document.getElementById('paused-games');
        container.innerHTML = '';
        
        if (this.pausedGames.length === 0) {
            container.innerHTML = '<p>No hay partidas pausadas</p>';
            return;
        }
        
        this.pausedGames.forEach((game, index) => {
            const div = document.createElement('div');
            div.className = 'history-item paused';
            
            const playerNames = game.players.map(p => `${p.name}: ${p.score >= 0 ? '+' : ''}${p.score}`).join(', ');
            const pauseDate = new Date(game.pauseTime).toLocaleDateString();
            const deviceInfo = game.gameId === this.gameId ? ' (Este dispositivo)' : ' (Otro dispositivo)';
            
            div.innerHTML = `
                <h4>Partida pausada - Mano ${game.currentHand}${deviceInfo}</h4>
                <p>Jugadores: ${playerNames}</p>
                <p>Pausada el: ${pauseDate}</p>
                <div class="history-actions">
                    <button class="btn-primary btn-small" onclick="chinchonGame.resumeGame(${index})">
                        Continuar
                    </button>
                    <button class="btn-danger btn-small" onclick="chinchonGame.deletePausedGame(${index})">
                        Eliminar
                    </button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    resumeGame(index) {
        this.currentGame = {...this.pausedGames[index]};
        this.currentGame.status = 'playing';
        this.currentGame.gameId = this.gameId; // Tomar control de la partida
        
        // Remover de pausadas
        this.pausedGames.splice(index, 1);
        this.syncData();
        
        this.setupGameScreen();
        this.showScreen('game-screen');
    }

    deletePausedGame(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta partida pausada?')) {
            this.pausedGames.splice(index, 1);
            this.syncData();
            this.updatePausedGamesList();
        }
    }

    showHistoryScreen() {
        // Cargar datos más recientes antes de mostrar
        this.loadData().then(() => {
            this.updateHistoryList();
            this.showScreen('history-screen');
        });
    }

    updateHistoryList() {
        const container = document.getElementById('games-history');
        container.innerHTML = '';
        
        if (this.games.length === 0) {
            container.innerHTML = '<p>No hay partidas en el historial</p>';
            return;
        }
        
        // Mostrar las más recientes primero
        const sortedGames = [...this.games].reverse();
        
        sortedGames.forEach((game, index) => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const playerScores = game.players.map(p => `${p.name}: ${p.score >= 0 ? '+' : ''}${p.score}`).join(', ');
            const startDate = new Date(game.startTime).toLocaleDateString();
            const deviceInfo = game.gameId === this.gameId ? ' (Este dispositivo)' : ' (Otro dispositivo)';
            
            div.innerHTML = `
                <h4>Partida del ${startDate}${deviceInfo}</h4>
                <p>Puntajes finales: ${playerScores}</p>
                <p>Manos jugadas: ${game.hands.length}</p>
                <p>Estado: Terminada</p>
            `;
            container.appendChild(div);
        });
    }

    showScreen(screenId) {
        // Ocultar todas las pantallas
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Mostrar la pantalla solicitada
        document.getElementById(screenId).classList.add('active');
    }

    // Persistencia de datos con servidor real
    async syncData() {
        const data = {
            gameId: this.gameId,
            games: this.games,
            pausedGames: this.pausedGames,
            lastUpdate: new Date().toISOString(),
            version: 1
        };

        try {
            // Usar JSONBin.io como backend gratuito
            const response = await fetch(this.apiUrl, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Master-Key': this.apiKey,
                    'X-Bin-Versioning': 'false'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                console.log('✅ Datos sincronizados con servidor');
                // También guardar localmente como backup
                localStorage.setItem('chinchon-backup', JSON.stringify(data));
            } else {
                throw new Error('Error en la respuesta del servidor');
            }
        } catch (error) {
            console.error('❌ Error sincronizando con servidor:', error);
            // Fallback a localStorage
            localStorage.setItem('chinchon-games', JSON.stringify(this.games));
            localStorage.setItem('chinchon-paused', JSON.stringify(this.pausedGames));
        }
    }

    async loadData() {
        try {
            // Cargar desde servidor
            const response = await fetch(this.apiUrl + '/latest', {
                method: 'GET',
                headers: {
                    'X-Master-Key': this.apiKey
                }
            });

            if (response.ok) {
                const result = await response.json();
                const serverData = result.record;
                
                if (serverData && serverData.games) {
                    // Combinar datos del servidor con datos locales
                    const allGames = [...(serverData.games || [])];
                    const allPausedGames = [...(serverData.pausedGames || [])];
                    
                    // Filtrar duplicados por ID
                    this.games = allGames.filter((game, index, self) => 
                        index === self.findIndex(g => g.id === game.id)
                    );
                    
                    this.pausedGames = allPausedGames.filter((game, index, self) => 
                        index === self.findIndex(g => g.id === game.id)
                    );
                    
                    console.log('✅ Datos cargados desde servidor');
                    return;
                }
            }
        } catch (error) {
            console.error('❌ Error cargando desde servidor:', error);
        }

        // Fallback a localStorage
        try {
            const backup = localStorage.getItem('chinchon-backup');
            if (backup) {
                const data = JSON.parse(backup);
                this.games = data.games || [];
                this.pausedGames = data.pausedGames || [];
                console.log('📱 Datos cargados desde backup local');
                return;
            }
        } catch (error) {
            console.error('Error cargando backup:', error);
        }

        // Último fallback
        const savedGames = localStorage.getItem('chinchon-games');
        const savedPaused = localStorage.getItem('chinchon-paused');
        
        this.games = savedGames ? JSON.parse(savedGames) : [];
        this.pausedGames = savedPaused ? JSON.parse(savedPaused) : [];
    }
}

// Inicializar el juego cuando se carga la página
let chinchonGame;
document.addEventListener('DOMContentLoaded', () => {
    chinchonGame = new ChinchonGame();
    
    // Mostrar estado de conexión
    window.addEventListener('online', () => {
        console.log('🌐 Conectado - Sincronizando datos...');
        if (chinchonGame) {
            chinchonGame.syncData();
        }
    });
    
    window.addEventListener('offline', () => {
        console.log('📱 Sin conexión - Usando datos locales');
    });
});