import translate from "translate";

translate.engine = "google";
translate.key = process.env.DEEPL_KEY;

const textTranslate = async (text, from, to)=>{
	const req = await translate(text, {from, to});
	return req
}

export default textTranslate