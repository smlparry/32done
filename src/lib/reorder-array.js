export default (array, oldIndex, newIndex) => {
  array = [...array];

  const startIndex = oldIndex < 0 ? array.length + oldIndex : oldIndex;

  if (startIndex >= 0 && startIndex < array.length) {
    const endIndex = newIndex < 0 ? array.length + newIndex : newIndex;

    const [item] = array.splice(oldIndex, 1);
    array.splice(endIndex, 0, item);
  }

  return array;
};
