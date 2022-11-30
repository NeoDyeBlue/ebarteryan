/**
 *
 * @param {Array} files
 * @param {Number} maxSize - in MB
 * @returns
 */

export function isFileSizesTooBig(files, maxSize) {
  let valid = true;
  if (files) {
    files.map((file) => {
      if (!file.url) {
        const size = file.size / 1024 / 1024;
        if (size > maxSize) {
          valid = false;
        }
      }
    });
  }
  return valid;
}

/**
 *
 * @param {Array} files
 * @param {Array} acceptedTypes
 */

export function isFileTypesCorrect(files, acceptedTypes) {
  let valid = true;
  if (files) {
    files.map((file) => {
      if (!file.url) {
        const fileType = file.content.substring(
          file.content.indexOf(":") + 1,
          file.content.indexOf(";")
        );
        if (!acceptedTypes.includes(fileType)) {
          valid = false;
        }
      }
    });
  }
  return valid;
}
