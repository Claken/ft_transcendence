import allPos from "./allPos";

const losePage = (context) => {//TODO: Proposer de faire une autre game ?
	context.fillStyle = "black";
	context.font = "61px Roboto";
	context.fillText("You LOSE", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.font = "60px Roboto";
	context.fillStyle = "red";
	context.fillText("You LOSE", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.fillStyle = "white";
	// context.fillText("CLICK to restart a game", allPos.width / 2, allPos.height / 1.6, allPos.width);
};

export default losePage;