export default function dateFormatter(time: string, setIsTime: Function) {
  const currentTime = new Date();
  const [year, month, day] = time.split("T")[0].split("-").map(Number);
  const [hour, min, sec] = time.split("T")[1].split(":").map(Number);

  if (currentTime.getFullYear() !== year) {
    setIsTime(`${year}/${month}/${day}`);
  } else if (
    currentTime.getMonth() + 1 !== month ||
    currentTime.getDate() !== day
  ) {
    setIsTime(`${month}/${day}`);
  } else {
    // 같은 날짜 일 때
    if (hour < 12) {
      setIsTime(`오전 ${formatNumber(hour)}:${formatNumber(min)}`);
    } else if (12 < hour) {
      setIsTime(`오후 ${formatNumber(hour - 12)}:${formatNumber(min)}`);
    } else if (12 === hour) {
      setIsTime(`오후 12:${formatNumber(min)}`);
    }
  }
}

const formatNumber = (number: number) => {
  return number < 10 ? `0${number}` : `${number}`;
};
