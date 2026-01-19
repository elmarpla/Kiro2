class GeneralaGame {
    constructor() {
        this.currentGame = null;
        this.games = this.loadGames();
        this.pausedGames = this.loadPausedGames();
        this.categories = [
            '1', '2', '3', '4', '5', '6',
            'Escalera', 'Full', 'Poker', 'Generala', 'Doble'
        ];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updatePlayerInputs();
        this.showScreen('setup-screen');
    }

    setupEventListeners() {
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

        document.getElementById('pause-game').addEventListener('click', () => {
            this.pauseGame();
        });
        
        document.getElementById('end-game').addEventListener('click', () => {
            this.endGame();
        });

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
        
        for (let i = 1; i <= playerCount; i++) {
            const name = document.getElementById(`player-${i}`).value.trim();
            if (!name) {
                alert(`Por favor ingresa el nombre del jugador ${i}`);
                return;
            }
            players.push({
                name: name,
                scores: {}
            });
        }

        this.currentGame = {
            id: Date.now(),
            players: players,
            startTime: new Date(),
            status: 'playing'
        };

        this.setupGameScreen();
        this.showScreen('game-screen');
    }

    setupGameScreen() {
        this.createScorecard();
    }

    createScorecard() {
        const table = document.getElementById('scorecard-table');
        table.innerHTML = '';

        // Header
        const headerRow = table.insertRow();
        headerRow.insertCell().innerHTML = '<strong>Categoría</strong>';
        this.currentGame.players.forEach(player => {
            headerRow.insertCell().innerHTML = `<strong>${player.name}</strong>`;
        });

        // Categories
        this.categories.forEach(category => {
            const row = table.insertRow();
            row.insertCell().innerHTML = category;
            
            this.currentGame.players.forEach((player, playerIndex) => {
                const cell = row.insertCell();
                const input = document.createElement('input');
                input.type = 'number';
                input.min = '0';
                input.value = player.scores[category] || '';
                input.addEventListener('change', () => {
                    player.scores[category] = parseInt(input.value) || 0;
                    this.updateTotals();
                });
                cell.appendChild(input);
            });
        });

        // Totals
        const totalRow = table.insertRow();
        totalRow.insertCell().innerHTML = '<strong>Total</strong>';
        this.currentGame.players.forEach((player, playerIndex) => {
            const cell = totalRow.insertCell();
            cell.id = `total-${playerIndex}`;
            cell.innerHTML = '<strong>0</strong>';
        });
    }

    updateTotals() {
        this.currentGame.players.forEach((player, playerIndex) => {
            let total = 0;
            Object.values(player.scores).forEach(score => {
                total += score || 0;
            });
            document.getElementById(`total-${playerIndex}`).innerHTML = `<strong>${total}</strong>`;
        });
    }

    pauseGame() {
        if (!this.currentGame) return;
        
        this.currentGame.status = 'paused';
        this.currentGame.pauseTime = new Date();
        
        this.pausedGames.push({...this.currentGame});
        this.savePausedGames();
        
        alert('Partida pausada correctamente');
        this.showScreen('setup-screen');
        this.currentGame = null;
    }

    endGame() {
        if (!this.currentGame) return;
        
        if (confirm('¿Estás seguro de que quieres terminar la partida?')) {
            this.currentGame.status = 'finished';
            this.currentGame.endTime = new Date();
            
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
                <h4>Partida pausada</h4>
                <p>Jugadores: ${playerNames}</p>
                <p>Pausada el: ${pauseDate}</p>
                <div class="history-actions">
                    <button class="btn-primary btn-small" onclick="generalaGame.resumeGame(${index})">
                        Continuar
                    </button>
                    <button class="btn-danger btn-small" onclick="generalaGame.deletePausedGame(${index})">
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
        
        const sortedGames = [...this.games].reverse();
        
        sortedGames.forEach(game => {
            const div = document.createElement('div');
            div.className = 'history-item';
            
            const playerNames = game.players.map(p => p.name).join(', ');
            const startDate = new Date(game.startTime).toLocaleDateString();
            
            div.innerHTML = `
                <h4>Partida del ${startDate}</h4>
                <p>Jugadores: ${playerNames}</p>
                <p>Estado: ${game.status === 'finished' ? 'Terminada' : 'Abandonada'}</p>
            `;
            container.appendChild(div);
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    loadGames() {
        const saved = localStorage.getItem('generala-games');
        return saved ? JSON.parse(saved) : [];
    }

    saveGames() {
        localStorage.setItem('generala-games', JSON.stringify(this.games));
    }

    loadPausedGames() {
        const saved = localStorage.getItem('generala-paused');
        return saved ? JSON.parse(saved) : [];
    }

    savePausedGames() {
        localStorage.setItem('generala-paused', JSON.stringify(this.pausedGames));
    }
}

let generalaGame;
document.addEventListener('DOMContentLoaded', () => {
    generalaGame = new GeneralaGame();
});