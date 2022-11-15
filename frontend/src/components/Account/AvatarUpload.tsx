import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";

const AvatarUpload = () => {
	const { user } = useAuth();
	const [file, setFile] = useState<File>(null);

	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFile(e.target.files[0]);
	};

	const uploadFile = async () => {
		if (file) {
			const formData = new FormData();
			// Generating a 10 random chars long string
			const randomNb = Math.random().toString(36).substring(2, 12);
			const fileCustomName = user.name + randomNb;
			formData.append("avatar", file, fileCustomName);
			await axios
				.post("/auth/42/upload", formData)
				.then((res) => {
					console.log(res.data);
					// setUser(res.data)
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};
	console.log(file);

	return (
		<div>
			<input
				className="photo"
				type="file"
				accept=".png, .jpg, .jpeg, .bmp, .gif"
				onChange={handleFile}
			></input>
			<button className="btn btn-primary" onClick={uploadFile}>
				upload
			</button>
		</div>
	);
};

export default AvatarUpload;
