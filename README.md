# 🃏 AiCards – Briscola Edition con Intelligenza Artificiale

**AiCards** (Si, il nome è provvisorio. No, non ho molta fantasia) è un gioco completo di **Briscola 1v1** realizzato in HTML, CSS e JavaScript vanilla, pensato per essere giocato via browser con un'avversario **IA simulata tramite LLaMA3** (tramite Ollama) o altre intelligenze artificiali. Il progetto è un prototipo evolutivo, con focus su gameplay divertente, logica fedele alla Briscola classica e possibilità di estensione futura.

---

## ✅ Stato Attuale del Progetto

- ✔️ Gioco **completo e funzionante**
- ✔️ Gameplay **interamente giocabile in locale**
- ✔️ Integrazione base con **LLaMA3 tramite Ollama**
- ✔️ Interfaccia semplice, testata su Chrome e Firefox
- ⚠️ **Bug minore** sul conteggio carte rimanenti nei primi turni (non bloccante)
- ⚠️ **Bug minore/errore nel design dela logica** Il parsing dei semi si "appoggia" ai semi delle carte francesi e successivamente 2 funzioni si occupano di convertirli in Semi Siciliani. Verrà risolto in futuro.

---

## 🧠 Funzionalità Attuali

- Distribuzione iniziale delle carte
- Gestione corretta del seme di Briscola
- Calcolo del vincitore in ogni mano
- Conteggio automatico dei punti (11-3-4-2-10)
- Determinazione vincitore finale
- Turni alternati con IA (inizialmente casuale, in evoluzione)
- **Modalità Debug** (premendo il tasto "Debug Mode"):
  - Mostra le carte dell’avversario per test e sviluppo
  - Utile per il bilanciamento IA o modalità allenamento

---

## 📜 Regole della Briscola (riassunto)

- Si gioca con 40 carte (mazzo italiano): semi di coppe, bastoni, denari, spade.
- I punti delle carte:
  - Asso (A): 11 punti
  - Tre (3): 10 punti
  - Re (K): 4 punti
  - Cavallo (Q): 3 punti
  - Fante (J): 2 punti
  - Altre carte: 0 punti
- Si gioca una carta a testa, chi ha il seme di Briscola più alto o il seme di uscita più alto vince la mano.
- Alla fine, chi ha più punti vince (totale max: 120 punti).

---

## 🔮 Feature Future (Work in Progress)

- 🎚 Livelli di difficoltà scalabili
- 🧠 Parsing avanzato della risposta del giocatore (tolleranza errore seme/valore)
- 🃏 Gestione del contesto **carte già giocate**
- 👥 Modalità **2v2** con squadre miste
- 🌐 Pubblicazione demo online e multiplayer WebSocket

---

## ⚙️ Come Avviare il Gioco (con LLaMA3)

### 1. Requisiti

- Node.js installato
- Ollama installato e funzionante
- LLaMA3 scaricato e disponibile (es. `llama3:latest`)
- Estensione Live Server (FORTEMENTE consigliata)

### 2. Clona la repo

```bash
git clone https://github.com/Joseph2412/AiCards.git
cd GameCards
```

### 3. Avvia il backend locale (Ollama Adapter)

```bash
cd backend
node server.js
```
### 4. Avvia il Gioco con LiveServer

```bash
cd fronend
Avvia LiveServer
```


Verifica che **Ollama sia attivo** (`ollama run llama3`) o che risponda alla porta configurata (`http://localhost:11434`).

### 4. Avvia il frontend

Apri `index.html` con Live Server oppure:

```bash
live-server .
```

---

## 🧱 Struttura del Progetto

```
GameCards/
├── index.html            # Pagina principale
├── css/
│   └── style.css         # Stile grafico
├── js/
│   └── game.js           # Logica del gioco
├── assets/
│   └── cards/            # Immagini carte siciliane
├── backend/
│   ├── server.js         # Adapter per LLaMA3 via fetch API
│   └── llamaAdapter.js   # Comunicazione LLM
└── README.md             # Questo file
```

---

## 📷 Debug Mode

Premendo il pulsante **"DEBUG MODE"** in alto:

- Attiva la visualizzazione della **mano CPU**
- Utile per test, bilanciamento IA e modalità allenamento
- Riattivabile anche durante la partita

---

## 🧠 IA: Come Funziona

> La versione attuale usa **giocate casuali** della CPU.  
> Se LLaMA3 è attivo, può prendere decisioni su quale carta giocare, valutando:

- La mano propria
- La carta giocata dal giocatore
- La briscola
- Il contesto parziale (carte rimaste, punti raccolti)

*(IA in fase sperimentale – sarà potenziata con memoria del contesto e strategie)*

---

## 🧪 Bug Conosciuti

- **Conteggio carte errato al secondo turno**
  - Primo turno: corretto (33 carte)
  - Secondo turno: visualizza 32, ma dovrebbero essere 31
  - Non influenza il gameplay

---

## 👨‍💻 Autore

Sviluppato da **Giuseppe Randisi**  
Con supporto tecnico e debugging assistito da **ChatGPT** 
  - (PERDONATEMI: SONO SOLO COME LA PARTICELLA DI SODIO NELLA BOTTIGLIA DELLA LETE).
---

## 📄 Licenza

MIT License – Puoi usarlo, modificarlo e distribuirlo. Una ⭐ è molto apprezzata!

---

## 🌟 Se ti piace…

Lasciane una **stellina alla repo** – vale più di un Asso di Briscola 😎
