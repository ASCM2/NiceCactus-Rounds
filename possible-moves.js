const possibleMoves = ['Scissor', 'Rock', 'Paper'];

export const winner = ([left, right]) => {
  if (left === right) return 'none';

  const leftIndex = possibleMoves.findIndex(move => move === left);
  const rightIndex = possibleMoves.findIndex(move => move === right);

  if (leftIndex === rightIndex) {
    return 'none';
  }

  if (leftIndex === 0 && rightIndex === possibleMoves.length - 1) {
    return 'left';
  }

  if (rightIndex === 0 && leftIndex === possibleMoves.length - 1) {
    return 'right';
  }

  if (leftIndex < rightIndex) return 'right';

  return 'left';
};

export default possibleMoves;
