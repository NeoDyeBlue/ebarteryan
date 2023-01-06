/**
 * @see {@link https://stackoverflow.com/a/47136047}
 * @param {Map} map
 * @param {*} searchValue
 * @returns key
 */
export function getKeyByValue(map, searchValue) {
  for (let [key, value] of map.entries()) {
    if (value === searchValue) return key;
  }
}

export function getMultiKeysByValue(map, searchValue) {
  let keys = [];
  for (let [key, value] of map.entries()) {
    if (value === searchValue) {
      keys.push(key);
    }
  }
  return keys;
}
