import allPos from "./allPos";
import State from "./state";

const button = (context) => {
	context.beginPath();
	context.fillStyle = "black";
	context.arc(allPos.width / 2 - 150, 25, allPos.radius * 2, 0, Math.PI * 2);
	context.arc(allPos.width / 2 + 150, 25, allPos.radius * 2, 0, Math.PI * 2);
	context.fill();
	context.fillStyle = "white";
	context.fillRect(allPos.width / 2 + 142.5, 17.5, 15, 15);
	if (allPos.state === State.PAUSE) {
		context.beginPath();
		context.moveTo(allPos.width / 2 - 155, 15);
		context.lineTo(allPos.width / 2 - 155, 35);
		context.lineTo(allPos.width / 2 - 140, 25);
		context.fill();
		context.closePath();
	}
	if (allPos.state === State.PLAY) {
		context.fillRect(allPos.width / 2 - 160, 15, 8, 20);
		context.fillRect(allPos.width / 2 - 148, 15, 8, 20);
	}
};

export default button;
