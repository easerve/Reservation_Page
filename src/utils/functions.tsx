export function getFirstDayOfNextMonth(year, month) {
  if (month === 12) {
    return `${year + 1}-01-01`;
  } else {
    return `${year}-${month + 1}-01`;
  }
}

export function getTrimmedStr(str, length) {
  return str.length <= length ? str : `${str.slice(0, length)}...`;
}

export function getFullAddress(user) {
  return `${user.address ?? "주소가 없습니다."} ${user.detail_address ?? ""}`;
}
