# Weather App

Mini applicazione meteo realizzata con **HTML, CSS e JavaScript vanilla**, basata sulle API di **Open-Meteo**.

L'app permette di:
- cercare una città tramite nome
- usare la posizione corrente dell'utente
- mostrare meteo attuale, previsioni orarie e giornaliere
- cambiare automaticamente sfondo in base alle condizioni meteo
- usare sfondi **fotografici locali** oppure **gradienti dinamici**
- visualizzare il tutto con UI in stile **glassmorphism**
- mostrare stato di caricamento con **spinner** e **testo shimmer**

---

## Funzionalità principali

### 1. Ricerca città
La ricerca viene effettuata tramite la **Geocoding API** di Open-Meteo.

L'utente può:
- digitare il nome di una città
- premere Invio o cliccare sull'icona di ricerca
- ottenere coordinate e nome completo della località

### 2. Geolocalizzazione
All'avvio, oppure cliccando su **"Usa la mia posizione"**, l'app prova a recuperare la posizione dell'utente tramite `navigator.geolocation`.

Se la geolocalizzazione va a buon fine:
- recupera latitudine e longitudine
- interroga Open-Meteo
- aggiorna la dashboard con i dati meteo della posizione corrente

### 3. Dati meteo mostrati
L'app usa tre sezioni dell'API forecast:

- **current**
- **hourly**
- **daily**

Vengono mostrati:

#### Meteo attuale
- temperatura
- descrizione meteo
- temperatura percepita
- vento
- pioggia
- umidità
- ora locale
- nome località / coordinate

#### Prossime ore
- fino a **72 ore** visualizzabili
- orario
- icona meteo
- temperatura
- probabilità di pioggia

#### Prossimi giorni
- fino a **16 giorni** visualizzabili
- giorno/data
- descrizione meteo
- temperatura massima / minima

#### Dati riassuntivi giornalieri
- alba
- tramonto
- temperatura max/min
- probabilità di pioggia

---

## Caratteristiche UI/UX

### Glassmorphism
L'interfaccia usa:
- trasparenze
- blur
- bordi chiari
- pannelli morbidi con effetto vetro

### Layout non scrollabile
La pagina principale **non scorre**.

Le sole aree scrollabili sono:
- lista previsioni giornaliere
- lista previsioni orarie

### Fade integrato sul glass
Le liste scrollabili hanno una sfumatura reale ai bordi:
- verticale per la lista dei giorni
- orizzontale per la lista delle ore

Questo aiuta a suggerire visivamente che il contenuto continua oltre l'area visibile.

### Loading state
Durante caricamento o ricerca:
- viene mostrato uno **spinner**
- il testo di stato usa un effetto **shimmer**

Esempi:
- `Cerco Roma...`
- `Recupero dati meteo in corso...`
- `Recupero posizione in corso...`
- `Dati aggiornati per Roma.`

---

## Struttura del progetto

```text
weather-app/
│
├── index.html
├── style.css
├── script.js
├── README.md
│
└── assets/
    └── backgrounds/
        ├── clear-day.svg
        ├── cloudy-day.svg
        ├── rain-day.svg
        ├── storm-day.svg
        ├── snow-day.svg
        ├── clear-night.svg
        ├── cloudy-night.svg
        └── rain-night.svg
```

---

## File principali

### `index.html`
Contiene la struttura della dashboard:
- colonna laterale sinistra con ricerca e dati attuali
- area principale con headline meteo
- pannello riassuntivo giornaliero
- carosello orario
- testo di stato in basso

### `style.css`
Gestisce:
- layout responsive desktop
- glass effect
- sfondi
- card meteo
- scrollbar personalizzate
- fade delle aree scrollabili
- spinner
- shimmer del testo di stato

### `script.js`
Contiene:
- chiamate API
- gestione geolocalizzazione
- ricerca città
- parsing dei dati
- mapping codici meteo -> label / icone / sfondi
- rendering dinamico dell'interfaccia
- gestione loading / error state

---

## Configurazione rapida

Nel file `script.js` è presente una configurazione simile a questa:

```js
const CONFIG = {
  backgroundMode: 'photo', // 'photo' | 'gradient'
  maxDailyDays: 16,
  maxHourlyItems: 72,
  defaultLocation: {
    lat: 40.8518,
    lon: 14.2681,
    label: 'Napoli, Italia'
  }
};
```

### Significato parametri
- `backgroundMode`
  - `'photo'` usa immagini locali in `assets/backgrounds`
  - `'gradient'` usa sfondi generati via CSS
- `maxDailyDays`
  - numero massimo di giorni mostrati
- `maxHourlyItems`
  - numero massimo di ore mostrate
- `defaultLocation`
  - località di fallback se la geolocalizzazione non è disponibile

---

## API usate

### 1. Geocoding API
Usata per trovare una città a partire dal nome.

Esempio:
```text
https://geocoding-api.open-meteo.com/v1/search?name=Roma&count=1&language=it&format=json
```

### 2. Forecast API
Usata per ottenere:
- current
- hourly
- daily

Esempio campi richiesti:
- `temperature_2m`
- `apparent_temperature`
- `relative_humidity_2m`
- `precipitation`
- `precipitation_probability`
- `wind_speed_10m`
- `weather_code`
- `is_day`
- `sunrise`
- `sunset`
- `temperature_2m_max`
- `temperature_2m_min`

---

## Come avviare il progetto

### Metodo semplice
Apri `index.html` nel browser.

### Metodo consigliato
Usa un piccolo server locale, ad esempio con VS Code + Live Server.

Oppure da terminale:

```bash
python -m http.server 8000
```

Poi apri nel browser:

```text
http://localhost:8000
```

---

## Flusso logico dell'app

1. caricamento pagina
2. tentativo di geolocalizzazione
3. fallback su località di default se necessario
4. richiesta dati a Open-Meteo
5. rendering meteo attuale
6. rendering lista oraria
7. rendering lista giornaliera
8. aggiornamento stato e sfondo

---

## Mapping sfondi meteo

L'app associa i codici meteo a categorie visive, ad esempio:
- sereno
- parzialmente nuvoloso
- coperto
- pioggia
- temporale
- neve
- notte serena
- notte nuvolosa
- notte piovosa

In base a:
- `weather_code`
- `is_day`

può scegliere:
- una foto locale
- un gradiente CSS

---

## Possibili miglioramenti futuri

- supporto multilingua completo
- suggerimenti ricerca città in tempo reale
- animazioni meteo più avanzate
- cache locale delle ultime ricerche
- switch UI per cambiare modalità sfondo senza modificare `script.js`
- supporto mobile dedicato con layout ottimizzato

---

## Note tecniche

- progetto senza framework
- nessuna dipendenza esterna obbligatoria
- adatto come esercizio portfolio o mini dashboard front-end
- facilmente estendibile con componenti aggiuntivi

---

## Troubleshooting

### La geolocalizzazione non funziona
Possibili cause:
- permesso negato nel browser
- pagina aperta in contesto non sicuro
- dispositivo/browser che non supporta la geolocalizzazione

Soluzione:
- usa `localhost`
- verifica i permessi del browser
- usa la ricerca manuale della città

### Gli sfondi non si vedono
Controlla che esista la cartella:

```text
assets/backgrounds/
```

e che i file siano presenti.

### Le API non restituiscono risultati per una ricerca
Può accadere se:
- il nome città è ambiguo
- la query è scritta male
- non ci sono risultati geocoding

Gestire un messaggio utente tipo:
- `Nessun risultato trovato per "<città>"`

---

## Licenza

Uso personale / didattico.

Se vuoi pubblicarlo, conviene aggiungere una licenza esplicita, ad esempio MIT.

---

## Autore

Progetto ricreato e rifinito a partire da una tua idea originale basata su Open-Meteo.
