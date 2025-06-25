// === Costanti globali ===
const semi = ['♠', '♥', '♦', '♣']; // Spade, Cuori, Quadri, Fiori
const valori = ['2','4','5','6','7','J','Q','K','3','A']; // Ordine crescente

// Valori in punti per ogni carta
const punteggioCarta = {
    'A': 11, '3': 10, 'K': 4, 'Q': 3, 'J': 2,
    '7': 0, '6': 0, '5': 0, '4': 0, '2': 0
};

// Statistiche di gioco
let mazzo = [];
let manoGiocatore = [];
let manoIA = [];
let briscola = '';
let punteggioGiocatore = 0;
let punteggioIA = 0;
let modalitaDebug = false; 
let chiIniziaProssimoTurno = 'giocatore'; // oppure 'ia'
let giocataIndex = null;
let cartaBriscola= null;


// === Riferimenti DOM ===
const enemyHand = document.getElementById('enemy-hand');
const playerHand = document.getElementById('player-hand');
const cardPlayerSlot = document.getElementById('card-player');
const cardEnemySlot = document.getElementById('card-enemy');
const briscolaSpan = document.getElementById('briscola-suit');
const playerScore = document.getElementById('player-score');
const enemyScore = document.getElementById('enemy-score');
const startBtn = document.getElementById('start-game');
const resetBtn = document.getElementById('reset-game');
const currentDeck = document.getElementById('deck');
const lastCardSlot =document.getElementById('last-card');


resetBtn.addEventListener('click', () => { 
    playerHand.innerHTML = '';
    enemyHand.innerHTML = '';
    cardPlayerSlot.innerHTML = '';
    cardEnemySlot.innerHTML = '';
    briscolaSpan.textContent = '?';
    currentDeck.textContent = '0';
    lastCardSlot.innerHTML = '';})

// === Avvia nuova partita ===
startBtn.addEventListener('click', () => {
    resetGame();
    creaMazzo();
    distribuisciCarte();
    mostraCartaBriscolaFinale();
    aggiornaMani();
});

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
    currentDeck.textContent = "0";
}

function mostraCartaBriscolaFinale() {
    if (!cartaBriscola) return;

    const img = creaImmagineCarta(cartaBriscola);
    img.classList.add('card-img', 'briscola');
    lastCardSlot.innerHTML = '';
    lastCardSlot.appendChild(img);
}

//Cambio SEME FRANCESE = SEME SICILIAN
function convertiSemePerImmagine(seme) {
    switch (seme) {
        case '♠': return 'coppe';
        case '♥': return 'denari';
        case '♦': return 'bastoni';
        case '♣': return 'spade';
        default: return 'coppe'; // fallback: Valutare return funzione in fase di test
    }
}

function nomeSemeSiciliano(seme) {
    switch (seme) {
        case '♠': return 'Coppe';
        case '♥': return 'Denari';
        case '♦': return 'Bastoni';
        case '♣': return 'Spade';
        default: return '?';
    }
}


//Funzione INTERPRETA Carta Figura
function valoreToSimboloFile(valore) {
    switch (valore) {
        case 'J': return 'fante';
        case 'Q': return 'cavallo';
        case 'K': return 're';
        case 'A': return 'asso';
        default: return valore;
    }
}

// === Crea un mazzo completo mischiato ===
function creaMazzo() {
    mazzo = [];
    for (let seme of semi) {
        for (let val of valori) {
            mazzo.push({ seme, val });
        }
    }
    shuffle(mazzo);
    cartaBriscola = mazzo[mazzo.length - 1];
    briscola =cartaBriscola.seme;
    mostraCartaBriscolaFinale();
    briscolaSpan.textContent = nomeSemeSiciliano(briscola);
    currentDeck.textContent = mazzo.length; // 
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
   manoIA.forEach((carta) => {
    let img;
    if (modalitaDebug) {
        img = creaImmagineCarta(carta); // mostra la vera carta
    } else {
        img = creaImmagineRetroCarta(); // usa funzione corretta
    }
    img.classList.add('card-img');
    enemyHand.appendChild(img);
    });
}

// === Crea immagine per una carta specifica ===
function creaImmagineCarta(carta) {
    const semeImg = convertiSemePerImmagine(carta.seme);
    const valFile = valoreToSimboloFile(carta.val);
    const img = document.createElement('img');
    img.src = `assets/static/cards/${valFile}_${semeImg}.png`;
    img.alt = `${carta.val} di ${semeImg}`;
    return img;
}

// Crea retro di ogni carta
function creaImmagineRetroCarta() {
    const img = document.createElement('img');
    img.src = 'assets/static/cards/back.png'; // Modifica il path se necessario
    img.alt = 'Carta coperta';
    img.classList.add('card-img');
    return img;
}


// === Gestisce il turno del giocatore e dell'IA ===
function giocaTurno() {
    let cartaGiocatore, cartaIA;

    if (chiIniziaProssimoTurno === 'giocatore') {
        cartaGiocatore = manoGiocatore.splice(giocataIndex, 1)[0];
        cartaIA = manoIA.splice(Math.floor(Math.random() * manoIA.length), 1)[0];
    } else {
        // Se inizia IA, gioca prima lei, poi attende la giocata utente
        cartaIA = manoIA.splice(Math.floor(Math.random() * manoIA.length), 1)[0];
        mostraCartaSuTavolo(cardEnemySlot, cartaIA);
        chiIniziaProssimoTurno = 'giocatore';

        // Aspetta la mossa del giocatore
        return;
    }

    mostraCartaSuTavolo(cardPlayerSlot, cartaGiocatore);
    mostraCartaSuTavolo(cardEnemySlot, cartaIA);

    const prendeGiocatore = valutaChiPrende(cartaGiocatore, cartaIA);
    const puntiPresi = punteggioCarta[cartaGiocatore.val] + punteggioCarta[cartaIA.val];

    if (prendeGiocatore) {
        punteggioGiocatore += puntiPresi;
        chiIniziaProssimoTurno = 'giocatore';
        playerScore.textContent = punteggioGiocatore;
    } else {
        punteggioIA += puntiPresi;
        chiIniziaProssimoTurno = 'ia';
        enemyScore.textContent = punteggioIA;
    }

    setTimeout(() => {
        cardPlayerSlot.innerHTML = '';
        cardEnemySlot.innerHTML = '';
        refillMani();
        aggiornaMani();
        verificaFinePartita();

        // Se inizia IA, avvia il prossimo turno da sola
        if (chiIniziaProssimoTurno === 'ia') {
            setTimeout(() => {
                giocaTurno(); // IA inizia di nuovo
            }, 600);
        }
    }, 1200);
}


function giocaTurnoGiocatore(indexCarta) {
    giocataIndex = indexCarta;
    
    // Se il giocatore inizia il turno
    if (chiIniziaProssimoTurno === 'giocatore') {
        giocaTurno();
    }
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
    currentDeck.textContent = mazzo.length; // 
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


document.getElementById('debug-toggle').addEventListener('click', () => {
    modalitaDebug = !modalitaDebug;
    document.getElementById('debug-toggle').textContent = `Modalità Debug: ${modalitaDebug ? 'ON' : 'OFF'}`;
    aggiornaMani();
});

