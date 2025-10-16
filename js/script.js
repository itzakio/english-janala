// text to speech
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}


const loadLevel = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((less) => displayLesson(less.data));
};

const removeBtnBg = () => {
  const btnBg = document.querySelectorAll(".lesson-btn");
  btnBg.forEach((btn) => {
    btn.classList.remove("bg-[#422AD5]", "text-white");
  });
};

// loading
const loading = (status) => {
  if (status == true) {
    document.getElementById("loading").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("loading").classList.add("hidden");
  }
};

const loadLevelWord = (id) => {
  loading(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeBtnBg();
      const clickedBtn = document.getElementById(`lesson-btn-${id}`);
      clickedBtn.classList.add("bg-[#422AD5]", "text-white");
      displayLevelWord(data.data);
    });
};

const showWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetails(details.data);
};


const createElement = (arr) => {
  const synonymElement = arr.map(
    (el) => `<p class="text-xl btn bg-blue-100 cursor-none">${el}</p>`
  );
  return synonymElement.join(" ");
};

// modal
const displayWordDetails = (words) => {
  const detailsBox = document.getElementById("details-box");
  detailsBox.innerHTML = `
    <div class="space-y-7">
        <h3 class="text-3xl font-semibold">${
          words.word
        } ( <i class="fa-solid fa-microphone-lines"></i> :${
    words.pronunciation
  })</h3>
        <div class="space-y-2">
          <h4 class="text-2xl font-semibold">Meaning</h4>
          <p class="text-2xl">${words.meaning}</p>
        </div>
        <div class="space-y-2">
          <h4 class="text-2xl font-semibold">Example</h4>
          <p class="text-2xl">${words.sentence}</p>
        </div>
        <div class="space-y-2">
          <h4 class="text-2xl font-semibold">সমার্থক শব্দ গুলো</h4>
          <div id="synonym-box" class="flex gap-2 items-center flex-wrap">
            ${createElement(words.synonyms)}
          </div>
        </div>
      </div>
  `;
  document.getElementById("word_modal").showModal();
};

// word card display
const displayLevelWord = (words) => {
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length == 0) {
    wordContainer.innerHTML = `
    <div class="col-span-full text-center space-y-5 py-12">
            <p><i class="fa-solid fa-triangle-exclamation text-gray-500 text-6xl"></i></p>
            <p class="font-medium text-gray-500">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
            <h3 class="text-4xl font-medium">নেক্সট Lesson এ যান।</h3>
    </div>
    `;
    loading(false);
    return;
  }

  words.forEach((word) => {
    const wordDiv = document.createElement("div");
    wordDiv.innerHTML = `
    <div class="bg-white p-5 md:p-7 xl:p-14 rounded-xl space-y-14 h-full flex flex-col justify-between">
            <div class="space-y-6 text-center">
              <h3 class="text-3xl font-bold">${
                word.word ? word.word : "শব্দ পাওয়া যায়নি"
              }</h3>
              <p class="text-xl font-medium">Meaning /Pronounciation</p>
              <h4 class="font-bangla text-3xl font-semibold">"${
                word.meaning ? word.meaning : "অর্থ পাওয়া যায়নি"
              } / ${
      word.pronunciation ? word.pronunciation : "উচ্চারণ পাওয়া যায়নি"
    }"</h4>
            </div>
            <div class="flex justify-between">
              <button onclick="showWordDetail(${
                word.id
              })" class="size-14 bg-blue-50 hover:bg-blue-200 transition-all duration-200 flex items-center justify-center text-2xl rounded-xl cursor-pointer">
                <i class="fa-solid fa-circle-info text-blue-950"></i>
              </button>
              <button onclick="pronounceWord('${word.word}')" class="size-14 bg-blue-50 hover:bg-blue-200 transition-all duration-200 flex items-center justify-center text-2xl rounded-xl cursor-pointer">
                <i class="fa-solid fa-volume-high"></i>
              </button>
            </div>
      </div>
    `;
    wordContainer.append(wordDiv);
  });
  loading(false);
};

const displayLesson = (lessons) => {
  const lessonContainer = document.getElementById("lesson-container");
  lessonContainer.innerHTML = "";

  for (let lesson of lessons) {
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
    <button id ="lesson-btn-${lesson.level_no}" onclick = "loadLevelWord(${lesson.level_no})" class="lesson-btn btn btn-outline btn-primary">
    <i class="fa-solid fa-book-open"></i> Lesson - ${lesson.level_no}
    </button>
    `;

    lessonContainer.appendChild(btnDiv);
  }
};
loadLevel();

document.getElementById("btn-search").addEventListener("click", () => {
  removeBtnBg();
  loading(true);
  const inputValue = document.getElementById("input-search").value.trim().toLowerCase();

  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      const filterWord = allWords.filter((words) => words.word.toLowerCase().includes(inputValue)
      )
      displayLevelWord(filterWord);
    });
});
loading(false);
