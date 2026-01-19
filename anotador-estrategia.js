class EstrategiaGame {
    constructor() {
        this.currentGame = null;
        this.games = this.loadGames();
        this.pausedGames = this.loadPausedGames();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePlayerInputs();
        this.showScreen('setup-screen');
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
            players: players,
            hands: [],
            currentHand: 1,
            startTime: new Date(),
            status: 'playing'
        };

        this.setupGameScreen();
        this.showScreen('game-screen');
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
            div.className = `player-score ${player.score >= 100 ? 'winner' : ''}`;
            div.innerHTML = `
                <h4>${player.name}</h4>
                <div class="score">${player.score}</div>
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
                <input type="number" id="hand-${index}" min="0" max="100" value="0">
            `;
            container.appendChild(div);
        });
    }

    addHand() {
        const handScores = [];
        let isValid = true;
        
        // Recoger puntos de la mano
        this.currentGame.players.forEach((player, index) => {
            const input = document.getElementById(`hand-${index}`);
            const score = parseInt(input.value) || 0;
            
            if (score < 0) {
                alert('Los puntos no pueden ser negativos');
                isValid = false;
                return;
            }
            
            handScores.push(score);
        });
        
        if (!isValid) return;
        
        // Agregar mano al historial
        this.currentGame.hands.push({
            hand: this.currentGame.currentHand,
            scores: [...handScores]
        });
        
        // Actualizar puntuaciones totales
        this.currentGame.players.forEach((player, index) => {
            player.score += handScores[index];
        });
        
        // Verificar si alguien ganó
        const winner = this.currentGame.players.find(player => player.score >= 100);
        if (winner) {
            this.gameWon(winner);
            return;
        }
        
        // Siguiente mano
        this.currentGame.currentHand++;
        this.setupGameScreen();
        
        // Limpiar inputs
        this.currentGame.players.forEach((player, index) => {
            document.getElementById(`hand-${index}`).value = '0';
        });
    }

    updateHandsHistory() {
        const container = document.getElementById('hands-list');
        container.innerHTML = '';
        
        this.currentGame.hands.forEach(hand => {
            const div = document.createElement('div');
            div.className = 'hand-row';
            
            let html = `<div class="hand-label">Mano ${hand.hand}</div>`;
            hand.scores.forEach(score => {
                html += `<div class="hand-score">${score}</div>`;
            });
            
            div.innerHTML = html;
            container.appendChild(div);
        });
    }

    gameWon(winner) {
        this.currentGame.status = 'finished';
        this.currentGame.winner = winner.name;
        this.currentGame.endTime = new Date();
        
        // Guardar en historial
        this.games.push({...this.currentGame});
        this.saveGames();
        
        alert(`¡${winner.name} ha ganado la partida con ${winner.score} puntos!`);
        this.showScreen('setup-screen');
        this.currentGame = null;
    }

    pauseGame() {
        if (!this.currentGame) return;
        
        this.currentGame.status = 'paused';
        this.currentGame.pauseTime = new Date();
        
        // Guardar en partidas pausadas
        this.pausedGames.push({...this.currentGame});
        this.savePausedGames();
        
        alert('Partida pausada correctamente');
        this.showScreen('setup-screen');
        this.currentGame = null;
    }

    endGame() {
        if (!this.currentGame) return;
        
        if (confirm('¿Estás seguro de que quieres terminar la partida? Se perderá el progreso.')) {
            this.currentGame.status = 'abandoned';
            this.currentGame.endTime = new Date();
            
            // Guardar en historial
            this.games.push({...this.currentGame});
            this.saveGames();
            
            this.showScreen('setup-screen');
            this.currentGame = null;
        }
    }

    showLoadScreen() {
        this.updatePausedGamesList();
        this.showScreen('load-screen');
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
            
            const playerNames = game.players.map(p => p.name).join(', ');
            const pauseDate = new Date(game.pauseTime).toLocaleDateString();
            
            div.innerHTML = `
                <h4>Partida pausada - Mano ${game.currentHand}</h4>
                <p>Jugadores: ${playerNames}</p>
                <p>Pausada el: ${pauseDate}</p>
                <div class="history-actions">
                    <button class="btn-primary btn-small" onclick="estrategiaGame.resumeGame(${index})">
                        Continuar
                    </button>
                    <button class="btn-danger btn-small" onclick="estrategiaGame.deletePausedGame(${index})">
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
        
        // Remover de pausadas
        this.pausedGames.splice(index, 1);
        this.savePausedGames();
        
        this.setupGameScreen();
        this.showScreen('game-screen');
    }

    deletePausedGame(index) {
        if (confirm('¿Estás seguro de que quieres eliminar esta partida pausada?')) {
            this.pausedGames.splice(index, 1);
            this.savePausedGames();
            this.updatePausedGamesList();
        }
    }

    showHistoryScreen() {
        this.updateHistoryList();
        this.showScreen('history-screen');
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
            
            const playerNames = game.players.map(p => `${p.name}: ${p.score}`).join(', ');
            const startDate = new Date(game.startTime).toLocaleDateString();
            const statusText = game.status === 'finished' ? `Ganador: ${game.winner}` : 'Abandonada';
            
            div.innerHTML = `
                <h4>Partida del ${startDate}</h4>
                <p>Jugadores: ${playerNames}</p>
                <p>Estado: ${statusText}</p>
                <p>Manos jugadas: ${game.hands.length}</p>
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

    // Persistencia de datos
    loadGames() {
        const saved = localStorage.getItem('estrategia-games');
        return saved ? JSON.parse(saved) : [];
    }

    saveGames() {
        localStorage.setItem('estrategia-games', JSON.stringify(this.games));
    }

    loadPausedGames() {
        const saved = localStorage.getItem('estrategia-paused');
        return saved ? JSON.parse(saved) : [];
    }

    savePausedGames() {
        localStorage.setItem('estrategia-paused', JSON.stringify(this.pausedGames));
    }
}

// Inicializar el juego cuando se carga la página
let estrategiaGame;
document.addEventListener('DOMContentLoaded', () => {
    estrategiaGame = new EstrategiaGame();
});