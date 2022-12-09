import allPos from "./allPos";

const endPage = (context) => {
	context.fillStyle = "black";
	context.font = "61px Roboto";
	context.fillText("GAME FINISH", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.font = "60px Roboto";
	context.fillStyle = "white";
	context.fillText("GAME FINISH", allPos.width / 2, allPos.height / 2.2, allPos.width);
};

export default endPage;
