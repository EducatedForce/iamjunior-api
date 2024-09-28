export const deSlugify = (text: string) => {
	const wordsArr = text.split("-");
	const capitalizedWordsArr: string[] = [];
	if (wordsArr.length > 0) {
		wordsArr.forEach((word) => {
			const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
			capitalizedWordsArr.push(capitalizedWord);
		});
		return capitalizedWordsArr.join(" ");
	} else return text.charAt(0).toUpperCase() + text.slice(1);
};
