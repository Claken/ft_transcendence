import allPos from "./allPos";

const losePage = (context) => {
	context.fillStyle = "black";
	context.font = "61px Roboto";
	context.fillText("You LOSE", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.font = "60px Roboto";
	context.fillStyle = "red";
	context.fillText("You LOSE", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.fillStyle = "white";
};

export default losePage;
