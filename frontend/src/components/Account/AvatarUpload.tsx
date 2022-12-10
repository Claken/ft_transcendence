import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";
import { IAvatar } from "../../interfaces/avatar.interface";
import { IUser } from "../../interfaces/user.interface";
// import Resizer from "react-image-file-resizer";

const AvatarUpload = () => {
	const { user, setUser } = useAuth();
	const [file, setFile] = useState<File>(null);
	const [avatar, setAvatar] = useState<IAvatar>(null);

	// const resizeFile = (file: File): Promise<File> =>
	// 	new Promise((resolve) => {
	// 		Resizer.imageFileResizer(
	// 			file,
	// 			400,
	// 			400,
	// 			"JPEG",
	// 			100,
	// 			0,
	// 			(uri: File) => {
	// 				resolve(uri);
	// 			},
	// 			"file"
	// 		);
	// 	});
	const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
		// const fileChosen: File = e.target.files[0];
		// const newFile = await resizeFile(fileChosen);
		// setFile(newFile);
		e.preventDefault();
		setFile(e.target.files[0]);
	};

	useEffect(() => {
		if (avatar) {
			setUser((prev: IUser) => ({ ...prev, avatarId: avatar.id }));
		}
	}, [avatar]);

	// TODO: cannot send id if GuestUser because there is no session without api42
	// cannot change guestUser Avatar
	const postAvatar = async (formData: FormData) => {
		await axios
			.post("/avatar", formData, {
				withCredentials: true,
			})
			.then((res) => {
				setAvatar(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (file) {
			const formData = new FormData();
			formData.append("image", file, file.name);
			postAvatar(formData);
		}
	}, [file]);

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
					<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
					<path d="M15 8h.01"></path>
					<path d="M11 20h-4a3 3 0 0 1 -3 -3v-10a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v4"></path>
					<path d="M4 15l4 -4c.928 -.893 2.072 -.893 3 0l3 3"></path>
					<path d="M14 14l1 -1c.31 -.298 .644 -.497 .987 -.596"></path>
					<path d="M18.42 15.61a2.1 2.1 0 0 1 2.97 2.97l-3.39 3.42h-3v-3l3.42 -3.39z"></path>
				</svg>
			</label>
		</div>
	);
};

export default AvatarUpload;
