import allPos from "./allPos";

const pausePage = (context) => {
	context.fillStyle = "white";
	context.fillText("PAUSE", allPos.width / 2, allPos.height / 2, allPos.width);
	// socket.emit("image", auth.user.name, 0);//TODO: retirer ?
};

export default pausePage;
