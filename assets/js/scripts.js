const UI_ELEMENTS = {
  FORM: document.querySelector('.form'),
  INPUT: document.querySelector('#word-input'),
  CONTAINER_WORD: document.querySelector('.results-word'),
  SOUND_BUTTON: document.querySelector('.results-sound'),
  RESULTS_WRAPPER: document.querySelector('.results'),
  RESULTS_LIST: document.querySelector('.results-list'),
  ERROR_CONTAINER: document.querySelector('.error'),
}
const url = 'https://api.dictionaryapi.dev/api/v2/entries/en/'

let state = {
  word: '',
  meanings: [],
  phonetics: [],
}

const showError = (error) => {
  UI_ELEMENTS.ERROR_CONTAINER.style.display = 'block'
  UI_ELEMENTS.RESULTS_WRAPPER.style.display = 'none'

  UI_ELEMENTS.ERROR_CONTAINER.textContent = error.message
}

const renderDefinition = (itemDefinition) => {
  const example = itemDefinition.example
    ? `<div class="results-item__example">
         <p>Example: <span></span>${itemDefinition.example}</p>
      </div>`
    : ''

  return `<div class="results-item__definition">
              <p>${itemDefinition.definition}</p>
              ${example}
          </div>`
}

const getDefinitions = (definitions) => {
  return definitions.map((definition) => renderDefinition(definition)).join('')
}

const renderItem = (item) => {
  return `<div class="results-item">
            <div class="results-item__part">${item.partOfSpeech}</div>
            <div class="results-item__definitions">
             ${getDefinitions(item.definitions)}
            </div>
          </div>`
}

const showResults = () => {
  UI_ELEMENTS.RESULTS_WRAPPER.style.display = 'block'
  UI_ELEMENTS.RESULTS_LIST.innerHTML = ''
  state.meanings.forEach(
    (item) => (UI_ELEMENTS.RESULTS_LIST.innerHTML += renderItem(item))
  )
}

const insertWord = () => {
  UI_ELEMENTS.CONTAINER_WORD.textContent = state.word
}

const handleSubmit = async (event) => {
  event.preventDefault()

  UI_ELEMENTS.ERROR_CONTAINER.style.display = 'none'

  if (!state.word.trim()) return
  try {
    const response = await fetch(`${url}${state.word}`)
    const data = await response.json()

    if (response.ok && data.length) {
      const item = data[0]

      state = {
        ...state,
        meanings: item.meanings,
        phonetics: item.phonetics,
      }
      insertWord()
      showResults()
    } else {
      showError(data)
    }
  } catch (error) {
    console.log(error)
  }
  event.target.reset()
}

const handleInput = (event) => {
  const value = event.target.value
  console.log(value)
  state.word = value
}

const handleSound = () => {
  if (state.phonetics.length) {
    const sound = state.phonetics[1]
    if (sound.audio) {
      new Audio(sound.audio).play()
    }
  }
}

UI_ELEMENTS.INPUT.addEventListener('input', handleInput)
UI_ELEMENTS.FORM.addEventListener('submit', handleSubmit)
UI_ELEMENTS.SOUND_BUTTON.addEventListener('click', handleSound)

// // TODO: получить данные по АПИ
// // TODO: вставить слово в контейнер
// // TODO: добавить функционал для воспроизведения звука
// // TODO: вставить в контейнер с результатами

// let state = {
//   word: "",
//   meanings: [],
//   phonetics: [],
// };

// const url = "https://api.dictionaryapi.dev/api/v2/entries/en/";
// const input = document.getElementById("word-input");
// const form = document.querySelector(".form");
// const containerWord = document.querySelector(".results-word");
// const soundButton = document.querySelector(".results-sound");
// const resultsWrapper = document.querySelector(".results");
// const resultsList = document.querySelector(".results-list");
// const errorContainer = document.querySelector(".error");

// const showError = (error) => {
//   errorContainer.style.display = "block";
//   resultsWrapper.style.display = "none";

//   errorContainer.innerText = error.message;
// };

// const renderDefinition = (itemDefinition) => {
//   const example = itemDefinition.example
//     ? `<div class="results-item__example">
//         <p>Example: <span>${itemDefinition.example}</span></p>
//       </div>`
//     : "";

//   return `<div class="results-item__definition">
//             <p>${itemDefinition.definition}</p>
//             ${example}
//           </div>`;
// };

// const getDefinitions = (definitions) => {
//   return definitions.map(renderDefinition).join("");
// };

// const renderItem = (item) => {
//   return `<div class="results-item">
//             <div class="results-item__part">${item.partOfSpeech}</div>
//             <div class="results-item__definitions">
//               ${getDefinitions(item.definitions)}
//             </div>
//           </div>`;
// };

// const showResults = () => {
//   resultsWrapper.style.display = "block";
//   resultsList.innerHTML = "";

//   state.meanings.forEach((item) => (resultsList.innerHTML += renderItem(item)));
// };

// const insertWord = () => {
//   containerWord.innerText = state.word;
// };

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   errorContainer.style.display = "none";

//   if (!state.word.trim()) return;

//   try {
//     const response = await fetch(`${url}${state.word}`);
//     const data = await response.json();

//     if (response.ok && data.length) {
//       const item = data[0];

//       state = {
//         ...state,
//         meanings: item.meanings,
//         phonetics: item.phonetics,
//       };

//       insertWord();
//       showResults();
//     } else {
//       showError(data);
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handleKeyup = (e) => {
//   const value = e.target.value;

//   state.word = value;
// };

// const handleSound = () => {
//   if (state.phonetics.length) {
//     const sound = state.phonetics[0];

//     if (sound.audio) {
//       new Audio(sound.audio).play();
//     }
//   }
// };

// // EVENTS
// input.addEventListener("keyup", handleKeyup);
// form.addEventListener("submit", handleSubmit);
// soundButton.addEventListener("click", handleSound);
