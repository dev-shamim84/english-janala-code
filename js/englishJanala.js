// first of all load level
const loadLevel = () => {
  fetch(`https://openapi.programming-hero.com/api/levels/all`)
    .then((res) => res.json())
    .then((data) => displayLevel(data.data));
};
// show level in ui
const displayLevel = (lessons) => {
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  lessons.map((lesson) => {
    const div = document.createElement("div");
    div.innerHTML = `
     <button id="lesson-btn-${lesson.level_no}" onclick="loadWord(${lesson.level_no})" class="btn btn-outline btn-primary items-center lesson-btn"><i class="fa-solid fa-book-open"></i>lesson-${lesson.level_no}</button>
     `;
    levelContainer.appendChild(div);
  });
};
// active class remove form level button
const removeActive = () => {
  const lessonBtn = document.querySelectorAll(".lesson-btn");
  lessonBtn.forEach((btn) => {
    btn.classList.remove("active");
  });
};
const loading = (status) => {
  if (status === true) {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
  }
};
// load all Words
const loadWord = (id) => {
  loading(true);
  fetch(`https://openapi.programming-hero.com/api/level/${id}`)
    .then((res) => res.json())
    .then((data) => {
      removeActive();
      const lessonBtn = document.getElementById(`lesson-btn-${id}`);
      lessonBtn.classList.add("active");
      displayWord(data.data);
      loading(false);
    });
};
// display word
const displayWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";
  if (words.length == 0) {
    wordContainer.innerHTML = ` 
    <div class="text-center col-span-full flex flex-col justify-center space-y-3 bg-base-100 rounded py-5">
      <img class="mx-auto" src="../assets/alert-error.png" alt="">
        <h4 class="font-hind text-xl">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</h4>
        <h2 class="font-hind text-3xl font-bold">নেক্সট Lesson এ যান</h2>
    </div>
    `;
  }
  words.map((word) => {
    const div = document.createElement("div");
    div.innerHTML = `
      <div class="bg-white px-5 py-4 text-center shadow h-full">
            <div class="space-y-3">
              <h2 class="font-bold text-3xl font-pop">${word.word}</h2>
              <h5 class="font-normal text-neutral-600 font-pop">Meaning / Pronunciation</h5>
            <h4 class="text-xl font-bold font-pop">
            ${
              word.meaning == null ? "মানে পাওয়া যায়নি" : `${word.meaning}`
            } / ${
      word.pronunciation === null
        ? "উচ্চারন পাওয়া যায়নি"
        : `${word.pronunciation}`
    } </h4>
            </div>
            <div class="flex justify-between my-3">
              <button onclick="loadWordDetails(${
                word.id
              })" class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] duration-100"><i class="fa-regular fa-circle-question"></i></button>
              <button onclick="${pronounceWord(
                word.word
              )}"  class="btn bg-[#1A91FF10] hover:bg-[#1A91FF80] duration-100"><i class="fa-solid fa-volume-low"></i></button>
            </div>
        </div>
     `;
    wordContainer.appendChild(div);
  });
};

// fetch word details
const loadWordDetails = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayWordDetails(data.data);
};

// synonymsWord function
const synonymsWord = (arr) => {
  console.log(arr);
  const htmlElement = arr.map((syn) => `<span class="btn">${syn}</span>`);
  return htmlElement.join(" ");
};

// sound function
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}

// display word details
const displayWordDetails = (word) => {
  console.log(word);
  const detailBox = document.getElementById("details-container");
  detailBox.innerText = "hi i am form js ";
  document.getElementById("word_modal").showModal();
  detailBox.innerHTML = `
  <div class="space-y-3">
  <div>
      <h2 class="font-semibold font-pop text-2xl">
        ${word.word} (&nbsp;<i class="fa-solid fa-microphone-lines"></i>:${
    word.meaning
  })
      </h2>
    </div>
    <div>
      <h2 class="font-pop font-semibold">Meaning</h2>
      <p class="font-pop font-semibold">${word.meaning}</p>
    </div>
    <div>
      <h2 class="font-pop font-semibold">Example</h2>
      <p class="font-pop text-">${word.sentence}</p>
    </div>
    <div>
      <h2 class="font-pop">সমার্থক শব্দ গুলো</h2>
     <div>
      ${synonymsWord(word.synonyms)}
     </div>
    </div>
  </div>
  
  `;
};

// implement search functionality

document.getElementById("search-btn").addEventListener("click", () => {
  removeActive();
  // find input
  const input = document.getElementById("search-input");
  // peak input value
  const inputValue = input.value;
  if (!inputValue) {
    alert("ইনপুট পাওয়া যায়নি");
    return;
  }
  // fetch all words
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filteredWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(inputValue.trim().toLowerCase())
      );

      displayWord(filteredWords);
    });
});

loadLevel();
