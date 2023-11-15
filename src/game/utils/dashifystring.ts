export function dashify(guessletters:string, secretWord:string) {
  const guesslettersArr = guessletters.split('');

 return secretWord
    .split('')
    .map((x) => {
      const exist = guesslettersArr.includes(x);
      return exist ? x : '-';
    })
    .join('');
  
  
}
