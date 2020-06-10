const elemTimer = document.querySelector('.wrap-timer');
const elemReview = document.getElementById('review-user');
const elemTime = document.getElementById('default');
const elemHours = document.getElementById('hours');
const elemMinutes = document.getElementById('minutes');
const elemReserveId = document.getElementById('reserve-id');
const startButton = document.getElementById('button-start');

const reserveId = elemReserveId.textContent;

let st = localStorage;

let timerData = {
  id: reserveId,
  startTime: '',
  endTime: '',
};

// ローカルストレージの内容を参照するメソッド
// データあり true 、データなし false を返す
let getTimerData = () => {
  if (st.length !== 0) {
    // データがローカルストレージに存在する場合
    timerData = JSON.parse(st.getItem('timerData'));
    timerData.startTime = new Date(timerData.startTime);
    timerData.endTime = new Date(timerData.endTime);
    console.log('Set this timerData from lacalStorage.');
    return true;
  } else {
    // データがローカルストレージに存在しない場合
    console.log('There is no data in localStorage.');
    return false;
  }
};

// データをローカルストレージにセット
let setTimerData = () => {
  let numHours = Number.parseInt(elemHours.textContent);
  let numMinutes = Number.parseInt(elemMinutes.textContent);
  let startTime = new Date();
  let endTime = new Date(startTime.getTime());
  endTime.setHours(startTime.getHours() + numHours);
  endTime.setMinutes(startTime.getMinutes() + numMinutes);
  timerData.startTime = startTime;
  timerData.endTime = endTime;
  st.setItem('timerData', JSON.stringify(timerData));
  console.log('set timerData to localStorage.');
};

// 残り時間を計算するメソッド
let calcLeftTime = () => {
  let leftTime = timerData.endTime.getTime() - Date.now();
  let leftHours = Math.floor(leftTime / (1000 * 60 * 60));
  let leftMinutes = Math.floor(leftTime / (1000 * 60)) % 60;
  console.log(`${leftHours} : ${leftMinutes}`);
  return { leftHours, leftMinutes };
};

// 表示時間を書き換えるメソッド
let rewriteTimerElem = ({ leftHours, leftMinutes }) => {
  if (leftHours <= 0 && leftMinutes <= 0) {
    elemTime.innerHTML = '残りわずか';
    return;
  }
  elemHours.textContent = `${leftHours}`.padStart(2, '0');
  elemMinutes.textContent = `${leftMinutes}`.padStart(2, '0');
};

// 一定時間おきに「表示時間を書き換えるメソッド」を実行
// 終了時間に達した場合、タイマーを非表示にし、レビューを表示
let intervalRewrite = () => {
  if (!(Date.now() < timerData.endTime.getTime())) {
    console.log('Finished timer!');
    st.clear();
    elemTimer.parentNode.removeChild(elemTimer);
    elemReview.classList.remove('hide');
    return;
  }
  rewriteTimerElem(calcLeftTime(timerData));
  let result = setInterval(() => {
    if (Date.now() < timerData.endTime.getTime()) {
      rewriteTimerElem(calcLeftTime(timerData));
    } else {
      console.log('Finished timer!');
      clearInterval(result);
      st.clear();
      elemTimer.parentNode.removeChild(elemTimer);
      elemReview.classList.remove('hide');
    }
  }, 60000);
};

// イベント管理
window.onload = () => {
  let flag = getTimerData();
  if (flag) {
    startButton.disabled = true;
    if (JSON.parse(st.getItem('timerData')).id === timerData.id) {
      // ローカルストレージにデータが存在し、予約番号が一致する場合
      startButton.parentNode.removeChild(startButton);
      intervalRewrite();
    } else {
      // ローカルストレージにデータが存在するが、予約番号が一致しない場合
      startButton.disabled = true;
      return;
    }
  } else {
    // ローカルストレージにデータが存在しない場合
    startButton.addEventListener(
      'click',
      () => {
        let confirmResult = confirm(
          '本当にスタートしますか？タイマーはユーザーと同意の上スタートしてして下さい。'
        );
        if (confirmResult) {
          startButton.parentNode.removeChild(startButton);
          setTimerData();
          intervalRewrite();
        } else {
          return;
        }
      },
      false
    );
  }
};
