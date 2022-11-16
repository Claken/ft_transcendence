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
			// const randomNb = Math.random().toString(36).substring(2, 12);
			// const fileCustomName = user.name + randomNb;
			let fileConvert64;
			await getBase64(file, (res: string | ArrayBuffer) => {
				fileConvert64 = res;
			});
			console.log(fileConvert64);

            
			// formData.append("avatar", file, file.name);
			// await axios
			// 	.post("/auth/42/upload", formData)
			// 	.then((res) => {
			// 		console.log(res.data);
			// 		// setUser(res.data)
			// 	})
			// 	.catch((error) => {
			// 		console.log(error);
			// 	});
		}
	};
	console.log(file);

	const getBase64 = async (
		file: File,
		cb: (res: string | ArrayBuffer) => void
	) => {
		let reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => {
			cb(reader.result);
		};
		reader.onerror = (error) => {
			console.log("Error: ", error);
		};
	};

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
