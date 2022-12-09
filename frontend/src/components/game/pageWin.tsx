import allPos from "./allPos";

const winPage = (context) => {
	context.fillStyle = "black";
	context.font = "61px Roboto";
	context.fillText("You WIN", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.font = "60px Roboto";
	context.fillStyle = "green";
	context.fillText("You WIN", allPos.width / 2, allPos.height / 2.2, allPos.width);
	context.fillStyle = "white";
};

export default winPage;
