class TrucoGame {
    constructor() {
        this.currentGame = null;
        this.games = this.loadGames();
        this.pausedGames = this.loadPausedGames();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.showScreen('setup-screen');
    }

    setupEventListeners() {
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

        document.getElementById('undo-last').addEventListener('click', () => {
            this.undoLastPoint();
        });

        document.getElementById('back-to-setup').addEventListener('click', () => {
            this.showScreen('setup-screen');
        });
        
        document.getElementById('back-to-setup-2').addEventListener('click', () => {
            this.showScreen('setup-screen');
        });
    }

    startNewGame() {
        const team1Name = document.getElementById('team1-name').value.trim() || 'Equipo 1';
        const team2Name = document.getElementById('team2-name').value.trim() || 'Equipo 2';
        const targetPoints = parseInt(document.getElementById('game-mode').value);

        this.currentGame = {
            id: Date.now(),
            team1: { name: team1Name, score: 0 },
            team2: { name: team2Name, score: 0 },
            targetPoints: targetPoints,
            pointsHistory: [],
            startTime: new Date(),
            status: 'playing'
        };

        this.setupGameScreen();
        this.showScreen('game-screen');
    }

    setupGameScreen() {
        document.getElementById('team1-display').textContent = this.currentGame.team1.name;
        document.getElementById('team2-display').textContent = this.currentGame.team2.name;
        document.getElementById('target-points').textContent = this.currentGame.targetPoints;
        
        this.updateScores();
        this.updatePointsHistory();
    }

    addPoints(teamIndex, points) {
        if (!this.currentGame) return;

        const team = teamIndex === 0 ? this.currentGame.team1 : this.currentGame.team2;
        team.score += points;

        // Registrar en historial
        this.currentGame.pointsHistory.push({
            team: teamIndex,
            teamName: team.name,
            points: points,
            newScore: team.score,
            timestamp: new Date()
        });

        this.updateScores();
        this.updatePointsHistory();

        // Verificar victoria
        if (team.score >= this.currentGame.targetPoints) {
            this.gameWon(team);
        }
    }

    updateScores() {
        document.getElementById('team1-score').textContent = this.currentGame.team1.score;
        document.getElementById('team2-score').textContent = this.currentGame.team2.score;
    }

    updatePointsHistory() {
        const container = document.getElementById('points-list');
        container.innerHTML = '';

        // Mostrar los últimos 10 puntos
        const recentPoints = this.currentGame.pointsHistory.slice(-10).reverse();
        
        recentPoints.forEach(point => {
            const div = document.createElement('div');
            div.className = 'point-entry';
            div.innerHTML = `
                <span>${point.teamName} +${point.points}</span>
                <span>${point.newScore} pts</span>
            `;
            container.appendChild(div);
        });
    }

    undoLastPoint() {
        if (!this.currentGame || this.currentGame.pointsHistory.length === 0) return;

        const lastPoint = this.currentGame.pointsHistory.pop();
        const team = lastPoint.team === 0 ? this.currentGame.team1 : this.currentGame.team2;
        team.score -= lastPoint.points;

        this.updateScores();
        this.updatePointsHistory();
    }

    gameWon(winner) {
        this.currentGame.status = 'finished';
        this.currentGame.winner = winner.name;
        this.currentGame.endTime = new Date();
        
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
        
        this.pausedGames.push({...this.currentGame});
        this.savePausedGames();
        
        alert('Partida pausada correctamente');
        this.showScreen('setup-screen');
        this.currentGame = null;
    }

    endGame() {
        if (!this.currentGame) return;
        
        if (confirm('¿Estás seguro de que quieres terminar la partida?')) {
            this.currentGame.status = 'abandoned';
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
            
            const pauseDate = new Date(game.pauseTime).toLocaleDateString();
            
            div.innerHTML = `
                <h4>${game.team1.name} vs ${game.team2.name}</h4>
                <p>Puntaje: ${game.team1.score} - ${game.team2.score}</p>
                <p>Pausada el: ${pauseDate}</p>
                <div class="history-actions">
                    <button class="btn-primary btn-small" onclick="trucoGame.resumeGame(${index})">
                        Continuar
                    </button>
                    <button class="btn-danger btn-small" onclick="trucoGame.deletePausedGame(${index})">
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
            
            const startDate = new Date(game.startTime).toLocaleDateString();
            const statusText = game.status === 'finished' ? `Ganador: ${game.winner}` : 'Abandonada';
            
            div.innerHTML = `
                <h4>${game.team1.name} vs ${game.team2.name}</h4>
                <p>Resultado: ${game.team1.score} - ${game.team2.score}</p>
                <p>Fecha: ${startDate}</p>
                <p>Estado: ${statusText}</p>
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
        const saved = localStorage.getItem('truco-games');
        return saved ? JSON.parse(saved) : [];
    }

    saveGames() {
        localStorage.setItem('truco-games', JSON.stringify(this.games));
    }

    loadPausedGames() {
        const saved = localStorage.getItem('truco-paused');
        return saved ? JSON.parse(saved) : [];
    }

    savePausedGames() {
        localStorage.setItem('truco-paused', JSON.stringify(this.pausedGames));
    }
}

let trucoGame;
document.addEventListener('DOMContentLoaded', () => {
    trucoGame = new TrucoGame();
});