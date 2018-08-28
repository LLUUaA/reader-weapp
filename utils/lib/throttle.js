
const D_TIME = 1000 / 60;
function getTimeStamp() {
  return Math.round(new Date().getTime());
}

export default function (fn, wait) {
  wait = wait ? wait : D_TIME;
  if (fn._endTime && fn._endTime > getTimeStamp()) return;
  fn._endTime = getTimeStamp() + wait;
  setTimeout(fn, wait);
}