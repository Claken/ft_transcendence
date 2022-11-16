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
			/*** Generating a 10 random chars long string */
			// const randomNb = Math.random().toString(36).substring(2, 12);
			// const fileCustomName = user.name + randomNb;\

			/*** Base64 */
			// let fileConvert64;
			// await getBase64(file, (res: string | ArrayBuffer) => {
			// 	fileConvert64 = res;
			// });
			// console.log(fileConvert64);

			formData.append('image', file, file.name);
			await axios
				.post("/users/avatar", formData, {
					withCredentials: true,
				})
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
				style={{ display: "none" }}
				type="file"
				id="file"
				accept=".png, .jpg, .jpeg, .bmp, .gif"
				onChange={handleFile}
			></input>
			<label htmlFor="file">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="icon icon-tabler icon-tabler-photo-edit"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path
                            stroke="none"
                            d="M0 0h24v24H0z"
                            fill="none"
                          ></path>
                          <path d="M15 8h.01"></path>
                          <path d="M11 20h-4a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v4"></path>
                          <path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l3 3"></path>
                          <path d="M14 14l1 -1c.31 -.298 .644 -.497 .987 -.596"></path>
                          <path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z"></path>
                        </svg>
                      </label>
			<button className="btn btn-primary" onClick={uploadFile}>
				Change Avatar
			</button>
		</div>
	);
};

export default AvatarUpload;
