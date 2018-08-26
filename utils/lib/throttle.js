const D_TIME = 1000 / 60;
export default function Throttle(fn, t = D_TIME) {
  if (fn.timer) clearTimeout(fn.timer);
  fn.timer = setTimeout(fn, t)
}