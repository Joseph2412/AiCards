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
let cartaBriscola = null;
let cartaIAInAttesa = null;
let animazioneInCorso = false;

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
const lastCardSlot = document.getElementById('last-card');

resetBtn.addEventListener('click', () => { 
    playerHand.innerHTML = '';
    enemyHand.innerHTML = '';
    cardPlayerSlot.innerHTML = '';
    cardEnemySlot.innerHTML = '';
    briscolaSpan.textContent = '?';
    currentDeck.textContent = '0';
    lastCardSlot.innerHTML = '';
    scriviLog("Partita resettata.");
});

// === Avvia nuova partita ===
startBtn.addEventListener('click', () => {
    resetGame();
    creaMazzo();
    distribuisciCarte();
    mostraCartaBriscolaFinale();
    aggiornaMani();
    scriviLog("Nuova partita iniziata!");
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
    lastCardSlot.innerHTML = '';
    cartaBriscola = null;
    cartaIAInAttesa = null;
    chiIniziaProssimoTurno = 'giocatore';
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
    cartaBriscola = mazzo.pop(); // L'ultima carta è la briscola
    briscola = cartaBriscola.seme;
    mostraCartaBriscolaFinale();
    briscolaSpan.textContent = nomeSemeSiciliano(briscola);
    currentDeck.textContent = mazzo.length;
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
    manoGiocatore = [];
    manoIA = [];
    for (let i = 0; i < 3; i++) {
        manoGiocatore.push(mazzo.shift());
        manoIA.push(mazzo.shift());
    }
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

    // Carte IA (retro o visibili in debug)
    manoIA.forEach((carta) => {
        let img;
        if (modalitaDebug) {
            img = creaImmagineCarta(carta);
        } else {
            img = creaImmagineRetroCarta();
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
    img.src = 'assets/static/cards/back.png';
    img.alt = 'Carta coperta';
    img.classList.add('card-img');
    return img;
}

// === Mostra carta sul tavolo ===
function mostraCartaSuTavolo(slot, carta) {
    const img = creaImmagineCarta(carta);
    img.classList.add('card-img', 'played');
    slot.innerHTML = '';
    slot.appendChild(img);
}

// === Gestisce il turno del giocatore e dell'IA ===

function giocaTurnoGiocatore(indexCarta) {
    // Blocca il click se non è il turno del giocatore o se l'IA deve ancora iniziare
    if (chiIniziaProssimoTurno === 'ia' && !cartaIAInAttesa) return;
    if (manoGiocatore.length === 0 || manoIA.length === 0) return;
    // Giocatore gioca la carta scelta
    const cartaGiocatore = manoGiocatore.splice(indexCarta, 1)[0];
    mostraCartaSuTavolo(cardPlayerSlot, cartaGiocatore);

    // IA gioca la sua carta (random, puoi migliorare l'IA)
    let cartaIA;
    if (cartaIAInAttesa) {
        // Se l'IA aveva già scelto la carta (turno iniziato da IA)
        cartaIA = cartaIAInAttesa;
        // Rimuovi la carta dalla mano IA solo ora!
        const idx = manoIA.findIndex(c => c === cartaIA);
        if (idx !== -1) manoIA.splice(idx, 1);
        cartaIAInAttesa = null;
    } else {
        // Se il giocatore inizia, IA risponde subito
        const iaIndex = Math.floor(Math.random() * manoIA.length);
        cartaIA = manoIA.splice(iaIndex, 1)[0];
        mostraCartaSuTavolo(cardEnemySlot, cartaIA);
    }

    // Calcola chi prende
    const prendeGiocatore = valutaChiPrende(cartaGiocatore, cartaIA, chiIniziaProssimoTurno);
    const puntiPresi = punteggioCarta[cartaGiocatore.val] + punteggioCarta[cartaIA.val];

    // 1. Aspetta 2 secondi con le carte visibili
    setTimeout(() => {
        // 2. Evidenzia la carta vincente
        if (prendeGiocatore) {
            cardPlayerSlot.firstChild.classList.add('winner-card');
        } else {
            cardEnemySlot.firstChild.classList.add('winner-card');
        }

        // 3. Dopo 0.5s, anima le carte verso chi prende
        setTimeout(() => {
            if (prendeGiocatore) {
                cardPlayerSlot.firstChild.classList.remove('winner-card');
                cardPlayerSlot.firstChild.classList.add('fly-to-player');
                cardEnemySlot.firstChild.classList.add('fly-to-player');
            } else {
                cardEnemySlot.firstChild.classList.remove('winner-card');
                cardPlayerSlot.firstChild.classList.add('fly-to-ia');
                cardEnemySlot.firstChild.classList.add('fly-to-ia');
            }

            // 4. Dopo l’animazione (0.7s), svuota, refill e aggiorna
            setTimeout(() => {
                if (prendeGiocatore) {
                    punteggioGiocatore += puntiPresi;
                    playerScore.textContent = punteggioGiocatore;
                    scriviLog(`Giocatore riceve ${cartaGiocatore.val} di ${nomeSemeSiciliano(cartaGiocatore.seme)} e ${cartaIA.val} di ${nomeSemeSiciliano(cartaIA.seme)}`);
                    scriviLog(`Prende il giocatore (+${puntiPresi})`);
                } else {
                    punteggioIA += puntiPresi;
                    enemyScore.textContent = punteggioIA;
                    scriviLog(`IA riceve ${cartaGiocatore.val} di ${nomeSemeSiciliano(cartaGiocatore.seme)} e ${cartaIA.val} di ${nomeSemeSiciliano(cartaIA.seme)}`);
                    scriviLog(`Prende l'IA (+${puntiPresi})`);
                }

                cardPlayerSlot.innerHTML = '';
                cardEnemySlot.innerHTML = '';

                // PRIMA aggiorna chi inizia il prossimo turno!
                if (prendeGiocatore) {
                    chiIniziaProssimoTurno = 'giocatore';
                } else {
                    chiIniziaProssimoTurno = 'ia';
                }

                refillManiBriscola();
                aggiornaMani();
                verificaFinePartita();

                // Se deve iniziare l'IA, gioca subito il suo turno
                if (chiIniziaProssimoTurno === 'ia' && manoIA.length > 0 && manoGiocatore.length > 0) {
                    setTimeout(() => {
                        turnoIA();
                    }, 400);
                }
            }, 700);

        }, 500);

    }, 500);
}

function turnoIA() {
    if (manoIA.length === 0) return;
    // L'IA sceglie quale carta giocare (puoi migliorare la logica)
    const iaIndex = Math.floor(Math.random() * manoIA.length);
    cartaIAInAttesa = manoIA[iaIndex]; // NON rimuovere ancora!
    mostraCartaSuTavolo(cardEnemySlot, cartaIAInAttesa);
}

// === Logica refill mani con briscola finale ===
function refillManiBriscola() {
    // Conta anche la briscola come carta pescabile
    let carteResidue = mazzo.length + (cartaBriscola ? 1 : 0);

    // Se non ci sono più carte da pescare, esci
    if (carteResidue === 0) return;

    // Chi prende pesca per primo
    if (carteResidue > 0) {
        if (chiIniziaProssimoTurno === 'giocatore') {
            // Giocatore pesca per primo
            if (manoGiocatore.length < 3) {
                if (mazzo.length > 0) {
                    manoGiocatore.push(mazzo.shift());
                } else if (cartaBriscola) {
                    manoGiocatore.push(cartaBriscola);
                    cartaBriscola = null;
                    lastCardSlot.innerHTML = '';
                }
            }
            if (manoIA.length < 3) {
                if (mazzo.length > 0) {
                    manoIA.push(mazzo.shift());
                } else if (cartaBriscola) {
                    manoIA.push(cartaBriscola);
                    cartaBriscola = null;
                    lastCardSlot.innerHTML = '';
                }
            }
        } else {
            // IA pesca per prima
            if (manoIA.length < 3) {
                if (mazzo.length > 0) {
                    manoIA.push(mazzo.shift());
                } else if (cartaBriscola) {
                    manoIA.push(cartaBriscola);
                    cartaBriscola = null;
                    lastCardSlot.innerHTML = '';
                }
            }
            if (manoGiocatore.length < 3) {
                if (mazzo.length > 0) {
                    manoGiocatore.push(mazzo.shift());
                } else if (cartaBriscola) {
                    manoGiocatore.push(cartaBriscola);
                    cartaBriscola = null;
                    lastCardSlot.innerHTML = '';
                }
            }
        }
    }
    // Aggiorna il conteggio del mazzo (conta anche la briscola se ancora presente)
    currentDeck.textContent = mazzo.length + (cartaBriscola ? 1 : 0);
}

// === Valuta chi prende la mano ===
function valutaChiPrende(c1, c2, chiHaIniziato) {
    if (c1.seme === c2.seme) {
        return valori.indexOf(c1.val) > valori.indexOf(c2.val);
    } else if (c2.seme === briscola) {
        return false;
    } else if (c1.seme === briscola) {
        return true;
    } else {
        // Prende chi ha giocato per primo
        return chiHaIniziato === 'giocatore';
    }
}

// === Motivo della presa ===
function motivoPresa(c1, c2, chiHaIniziato) {
    if (c1.seme === c2.seme) {
        if (valori.indexOf(c1.val) > valori.indexOf(c2.val)) {
            return "il giocatore ha la carta più alta dello stesso seme";
        } else {
            return "l'IA ha la carta più alta dello stesso seme";
        }
    } else if (c2.seme === briscola) {
        return "l'IA ha giocato una briscola";
    } else if (c1.seme === briscola) {
        return "il giocatore ha giocato una briscola";
    } else {
        return `prende chi ha giocato per primo (${chiHaIniziato})`;
    }
}

// === Controlla se la partita è finita ===
function verificaFinePartita() {
    if (
        mazzo.length === 0 &&
        cartaBriscola === null &&
        manoGiocatore.length === 0 &&
        manoIA.length === 0
    ) {
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
        scriviLog("Partita terminata! " + messaggio);
    }
}

// === Mostra la briscola finale ===
function mostraCartaBriscolaFinale() {
    if (!cartaBriscola) {
        lastCardSlot.innerHTML = '';
        return;
    }
    const img = creaImmagineCarta(cartaBriscola);
    img.classList.add('card-img', 'briscola');
    lastCardSlot.innerHTML = '';
    lastCardSlot.appendChild(img);
}

// === Utility ===
function convertiSemePerImmagine(seme) {
    switch (seme) {
        case '♠': return 'coppe';
        case '♥': return 'denari';
        case '♦': return 'bastoni';
        case '♣': return 'spade';
        default: return 'coppe';
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

function valoreToSimboloFile(valore) {
    switch (valore) {
        case 'J': return 'fante';
        case 'Q': return 'cavallo';
        case 'K': return 're';
        case 'A': return 'asso';
        default: return valore;
    }
}

// === Debug toggle ===
document.getElementById('debug-toggle').addEventListener('click', () => {
    modalitaDebug = !modalitaDebug;
    document.getElementById('debug-toggle').textContent = `Modalità Debug: ${modalitaDebug ? 'ON' : 'OFF'}`;
    aggiornaMani();
});

// === Log partita ===
function scriviLog(msg) {
    const logDiv = document.getElementById('game-log');
    if (!logDiv) return;
    logDiv.innerHTML += msg + "<br>";
    logDiv.scrollTop = logDiv.scrollHeight;
}

