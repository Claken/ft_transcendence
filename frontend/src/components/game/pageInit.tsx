import allPos from "./allPos";

const initPage = (context, color, mignature) => {
	context.fillStyle = "white";
	context.fillText("CHOOSE THE MAP", allPos.width / 2, allPos.height / 3, allPos.width);
	if (allPos.compteur !== null)
		context.fillText(allPos.compteur.toString(), allPos.width / 2, allPos.height / 2.2);

	context.fillStyle = color[0];
	context.fillRect(allPos.width/2 - 610, 290, 320, 220);
	context.drawImage(mignature[0], allPos.width/2 - 600, 300, 300, 200);
	context.fillText("CLASSIC", allPos.width/2 - 450, 560);
	context.fillStyle = "white";

	context.fillStyle = color[1];
	context.fillRect(allPos.width/2 - 160, 390, 320, 220);
	context.drawImage(mignature[1], allPos.width/2 -150, 400, 300, 200);
	context.fillText("THE WITCHER", allPos.width/2, 660);
	context.fillStyle = "white";

	context.fillStyle = color[2];
	context.fillRect(allPos.width/2 + 290, 290, 320, 220);
	context.drawImage(mignature[2], allPos.width/2 + 300, 300, 300, 200);
	context.fillText("POKEMON", allPos.width/2 + 450, 560);
	context.fillStyle = "white";
};

export default initPage;
