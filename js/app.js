// 사용 변수
const SETTING_TIME = 9;
let words = [];
let time;
let isPlaying = false;
let score = 0;
let timeInterval;

const url = "https://random-word-api.herokuapp.com/word?number=100";
const wordDisplay = document.querySelector(".word-display");
const wordInput = document.querySelector(".word-input");
const scoreDisplay = document.querySelector(".score");
const timeDisplay = document.querySelector(".time");
const button = document.querySelector(".button");

// Toast 알림
const runToast = (text, color = "linear-gradient(to right, #f8f9fa, #ffffffcc)", textColor = "white") => {
  Toastify({
    text: text,
    duration: 2000,
    gravity: "top",
    position: "center",
    background: color,
    style: {
      color: textColor,
      fontSize: "20px",
      fontWeight: "bold",
      padding: "20px 30px",
      borderRadius: "10px",
      minWidth: "300px",
      textAlign: "center",
      border: "2px solidrgb(255, 255, 255)",
      boxShadow: "0px 6px 10px rgba(30, 0, 255, 0.18)",
    },
  }).showToast();
};

// 단어 가져오기
const getWords = async () => {
  try {
    const response = await axios.get(url);
    words = response.data.filter((word) => word.length < 8);
    button.innerText = "게임 시작";
    button.disabled = false;
  } catch (error) {
    console.error("단어 로드 실패:", error);
  }
};

// 게임 초기화
const init = () => {
  time = SETTING_TIME;
  getWords();
};
// 게임 시작
const run = () => {
  if (words.length === 0) return;

  clearInterval(timeInterval);
  isPlaying = true;
  time = SETTING_TIME;
  score = 0;
  wordInput.value = "";
  button.disabled = true;
  button.innerText = "게임 진행 중...";

  button.style.background = "linear-gradient(-45deg, #6b52a3, #4c82db)";

  wordDisplay.innerHTML = `<i class="fa-solid fa-question"></i>`;

  // 입력 필드 활성화 (게임 시작)
  wordInput.disabled = false;

  scoreDisplay.innerText = score;
  timeInterval = setInterval(countDown, 2000);

  updateWord();
};

// 게임 종료 시 입력창 다시 비활성화
const countDown = () => {
  if (time > 0) {
    time--;
  } else {
    clearInterval(timeInterval);
    isPlaying = false;
    button.innerText = "게임 다시 시작";
    button.disabled = false;

    // 게임 종료 메시지
    runToast("⏳ 게임 종료! 다시 시작하려면 버튼을 누르세요.");

    // 버튼 색상 변경
    button.style.background = "linear-gradient(-45deg, rgb(44, 4, 4), rgb(118, 122, 131))";

    // 단어 영역 아이콘 변경
    wordDisplay.innerHTML = `<i class="fa-solid fa-times-circle"></i>`;

    // 입력 필드 비활성화 (게임 종료)
    wordInput.disabled = true;
  }
  timeDisplay.innerText = time;
};

let previousWord = null; // 이전 단어 저장 변수

const updateWord = () => {
  let randomIndex;
  let newWord;

  do {
    randomIndex = Math.floor(Math.random() * words.length);
    newWord = words[randomIndex];
  } while (newWord === previousWord); // 이전 단어와 같으면 다시 뽑기

  previousWord = newWord; // 현재 단어를 이전 단어로 저장
  wordDisplay.innerHTML = `<span>${newWord}</span>`;
};

// 입력 체크
const checkMatch = () => {
  if (!isPlaying) return;

  if (wordInput.value.toLowerCase() === wordDisplay.textContent.toLowerCase()) {
    score++;
    runToast(wordDisplay.textContent);
    time = SETTING_TIME;
    wordInput.value = "";
    scoreDisplay.innerText = score;
    updateWord();
  }
};

// 이벤트 리스너
wordInput.addEventListener("input", checkMatch);
button.addEventListener("click", run);

// 게임 준비
init();
