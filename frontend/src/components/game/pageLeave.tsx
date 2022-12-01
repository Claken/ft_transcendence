import allPos from "./allPos";

const leavePage = (context) => {
	context.fillStyle = "black";
	context.font = "61px Roboto";
	context.fillText("OPPONENT HAS LEAVED", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.font = "60px Roboto";
	context.fillStyle = "green";
	context.fillText("OPPONENT HAS LEAVED", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.fillStyle = "white";
};

export default leavePage;
