// === Costanti globali ===
const semi = ['♠', '♥', '♦', '♣']; // Spade, Cuori, Quadri, Fiori
const valori = ['2','4','5','6','7','J','Q','K','3','A']; // Ordine crescente

// Valori in punti per ogni carta
const punteggioCarta = {
    'A': 11, '3': 10, 'K': 4, 'Q': 3, 'J': 2,
    '7': 0, '6': 0, '5': 0, '4': 0, '2': 0
};

// Stato di gioco
let mazzo = [];
let manoGiocatore = [];
let manoIA = [];
let briscola = '';
let punteggioGiocatore = 0;
let punteggioIA = 0;

// === Riferimenti DOM ===
const enemyHand = document.getElementById('enemy-hand');
const playerHand = document.getElementById('player-hand');
const cardPlayerSlot = document.getElementById('card-player');
const cardEnemySlot = document.getElementById('card-enemy');
const briscolaSpan = document.getElementById('briscola-suit');
const playerScore = document.getElementById('player-score');
const enemyScore = document.getElementById('enemy-score');
const startBtn = document.getElementById('start-game');

// === Avvia nuova partita ===
startBtn.addEventListener('click', () => {
    resetGame();
    creaMazzo();
    distribuisciCarte();
    aggiornaMani();
});

// === Crea un mazzo completo mischiato ===
function creaMazzo() {
    mazzo = [];
    for (let seme of semi) {
        for (let val of valori) {
            mazzo.push({ seme, val });
        }
    }
    shuffle(mazzo);
    briscola = mazzo[mazzo.length - 1].seme; // Ultima carta = briscola
    briscolaSpan.textContent = briscola;
}

// === Mischia il mazzo ===
function shuffle(array) {
    for (let i = array.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i+1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// === Distribuisci 3 carte a testa ===
function distribuisciCarte() {
    manoGiocatore = mazzo.splice(0, 3);
    manoIA = mazzo.splice(0, 3);
}

// === Disegna graficamente le mani ===
function aggiornaMani() {
    playerHand.innerHTML = '';
    enemyHand.innerHTML = '';

    // Carte giocatore (cliccabili)
    manoGiocatore.forEach((carta, index) => {
        const img = creaImmagineCarta(carta);
        img.classList.add('card-img');
        img.addEventListener('click', () => giocaTurnoGiocatore(index));
        playerHand.appendChild(img);
    });

    // Carte IA (retro)
    manoIA.forEach(() => {
        const img = document.createElement('img');
        img.src = 'carte/back.png';
        img.classList.add('card-img');
        enemyHand.appendChild(img);
    });
}

// === Crea immagine per una carta specifica ===
function creaImmagineCarta(carta) {
    const img = document.createElement('img');
    img.src = `carte/${carta.val}${carta.seme}.png`; // es: 3♣.png
    img.alt = `${carta.val} di ${carta.seme}`;
    return img;
}

// === Gestisce il turno del giocatore e dell'IA ===
function giocaTurnoGiocatore(indexCarta) {
    const cartaGiocatore = manoGiocatore.splice(indexCarta, 1)[0];
    mostraCartaSuTavolo(cardPlayerSlot, cartaGiocatore);

    const indexIA = Math.floor(Math.random() * manoIA.length);
    const cartaIA = manoIA.splice(indexIA, 1)[0];
    mostraCartaSuTavolo(cardEnemySlot, cartaIA);

    // Calcolo chi prende e assegna punti
    const prendeGiocatore = valutaChiPrende(cartaGiocatore, cartaIA);
    const puntiPresi = punteggioCarta[cartaGiocatore.val] + punteggioCarta[cartaIA.val];

    if (prendeGiocatore) {
        punteggioGiocatore += puntiPresi;
        playerScore.textContent = punteggioGiocatore;
    } else {
        punteggioIA += puntiPresi;
        enemyScore.textContent = punteggioIA;
    }

    // Cleanup + refill + check fine
    setTimeout(() => {
        cardPlayerSlot.innerHTML = '';
        cardEnemySlot.innerHTML = '';
        refillMani();
        aggiornaMani();
        verificaFinePartita();
    }, 1200);
}

// === Mostra carta sul tavolo ===
function mostraCartaSuTavolo(slot, carta) {
    const img = creaImmagineCarta(carta);
    img.classList.add('card-img', 'played');
    slot.innerHTML = '';
    slot.appendChild(img);
}

// === Valuta chi prende la mano ===
function valutaChiPrende(c1, c2) {
    if (c1.seme === c2.seme) {
        return valori.indexOf(c1.val) > valori.indexOf(c2.val);
    } else if (c2.seme === briscola) {
        return false;
    } else if (c1.seme === briscola) {
        return true;
    } else {
        return true; // chi gioca per primo prende
    }
}

// === Aggiunge carte se il mazzo non è vuoto ===
function refillMani() {
    if (mazzo.length > 0) {
        if (manoGiocatore.length < 3) {
            manoGiocatore.push(mazzo.shift());
        }
        if (manoIA.length < 3) {
            manoIA.push(mazzo.shift());
        }
    }
}

// === Controlla se la partita è finita ===
function verificaFinePartita() {
    if (mazzo.length === 0 && manoGiocatore.length === 0 && manoIA.length === 0) {
        let messaggio;
        if (punteggioGiocatore > punteggioIA) {
            messaggio = "Hai vinto! 🎉";
        } else if (punteggioGiocatore < punteggioIA) {
            messaggio = "Ha vinto l'IA! 🤖";
        } else {
            messaggio = "Pareggio! 🤝";
        }

        setTimeout(() => {
            alert(`Partita terminata!\n${messaggio}`);
        }, 300);
    }
}

// === Reset totale della partita ===
function resetGame() {
    manoGiocatore = [];
    manoIA = [];
    mazzo = [];
    punteggioGiocatore = 0;
    punteggioIA = 0;
    playerScore.textContent = '0';
    enemyScore.textContent = '0';
    cardPlayerSlot.innerHTML = '';
    cardEnemySlot.innerHTML = '';
    briscolaSpan.textContent = '?';
}
