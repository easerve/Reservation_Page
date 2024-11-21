
export function getTimeString2(date: Date) {
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  // 오전/오후 설정
  const period = hours >= 12 ? "오후" : "오전";

  // 12시간 형식으로 변환
  hours = hours % 12 || 12; // 0시와 12시를 12로 설정
  const formattedHours = hours.toString().padStart(2, "0");

  const timeString = `${period} ${formattedHours}:${minutes}`;

  console.log(timeString);
  return timeString;
}

export function getAge2(birth: string) {
  const today = new Date();
  const birthDate = new Date(birth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();

  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { years, months };
}

export function getDate2(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 +1 필요
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}