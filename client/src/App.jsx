import React, { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CiImageOn, CiVideoOn } from "react-icons/ci";
import { FiEye } from "react-icons/fi";
import { DNA } from 'react-loader-spinner';
import useHover from "./hooks/useHover";

const App = () => {
	const BASEURL = 'http://localhost:8000';

	const [videoUrl, setVideoUrl] = useState('');
	const [imageUrl, setImageUrl] = useState('');
	const [selectedFile, setSelectedFile] = useState(null);
	const [result, setResult] = useState('');
	const [loading, setLoading] = useState(false);
	const [isHover, hoverRef] = useHover();
	const [isHover2, hoverRef2] = useHover();

	const handleVideoUpload = (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setVideoUrl(reader.result);
		};

		reader.readAsDataURL(file);
	};

	const handleImageUpload = (e) => {
		const file = e.target.files[0];
		setSelectedFile(file);

		const reader = new FileReader();
		reader.onloadend = () => {
			setImageUrl(reader.result);
		};

		reader.readAsDataURL(file);
	};

	const predictVideo = async () => {
		try {
			setLoading(true);

			const formData = new FormData();
			formData.append('video', selectedFile);

			const postHeader = {
				method: "POST",
				body: formData
			};

			const res = await fetch(`${BASEURL}/predictVideo`, postHeader);
			const data = await res.json();
			console.log(data);
			setResult(data);
			setLoading(false);

			toast.success("Predicted Successfully");
		} catch (error) {
			toast.error("API Error!");
			setLoading(false);
			console.log(error);
		}
	};

	const predictImage = async () => {
		try {
			setLoading(true);

			const formData = new FormData();
			formData.append('image', selectedFile);

			const postHeader = {
				method: "POST",
				body: formData
			};

			const res = await fetch(`${BASEURL}/predictImage`, postHeader);
			const data = await res.json();
			console.log(data);
			setResult(data);
			setLoading(false);

			toast.success("Predicted Successfully");
		} catch (error) {
			toast.error("API Error!");
			setLoading(false);
			console.log(error);
		}
	};

	const reset = () => {
		setVideoUrl('');
		setImageUrl('');
		setSelectedFile(null);
		setResult('');
	};

	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 p-4">
			{!loading ? (
				<div className="w-full max-w-3xl p-8 bg-white rounded-3xl shadow-lg text-center">
					<h1 className="text-4xl font-bold mb-8 text-gray-800 flex items-center justify-center"><FiEye className="mr-2" /> {/* Eye icon */}
						Authentic-Eye
					</h1>
					<p className="text-lg text-gray-600 mb-8">Upload a video or image to detect if it is a deepfake.</p>
					{!videoUrl && !imageUrl ? (
						<div className="flex justify-center gap-8 mb-8">
							<label
								ref={hoverRef}
								className={`flex flex-col items-center justify-center w-40 h-40 bg-blue-100 rounded-lg border-2 border-blue-500 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105`}
							>
								<CiVideoOn size={50} className="text-blue-500 mb-4" />
								<span className="text-blue-500">Upload Video</span>
								<input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" />
							</label>
							<label
								ref={hoverRef2}
								className={`flex flex-col items-center justify-center w-40 h-40 bg-pink-100 rounded-lg border-2 border-pink-500 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105`}
							>
								<CiImageOn size={50} className="text-pink-500 mb-4" />
								<span className="text-pink-500">Upload Image</span>
								<input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
							</label>
						</div>
					) : (
						<div>
							{videoUrl && (
								<div className="mb-8">
									<video controls className="video-controls">
										<source src={videoUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								</div>
							)}
							{imageUrl && (
								<div className="mb-8">
									<img src={imageUrl} alt="Uploaded" className="img-upload" />
								</div>
							)}
						</div>
					)}
					{result && (
						<div className="text-2xl font-bold mb-8">
							Prediction Result: <span className={result.result === 0 ? 'text-green-500' : result.result === 1 ? 'text-red-500' : 'text-gray-700'}>
								{result.result === 0 ? 'Real' : result.result === 1 ? 'Fake' : 'No face Detected'}
							</span>
						</div>
					)}
					<div className="flex justify-center gap-4">
						{videoUrl || imageUrl ? <button onClick={reset} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg shadow hover:bg-gray-300 transition duration-300 ease-in-out">Try another</button> : null}
						{videoUrl && !result ? <button onClick={predictVideo} className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300 ease-in-out">Predict Video!</button> : null}
						{imageUrl && !result ? <button onClick={predictImage} className="px-4 py-2 bg-pink-500 text-white rounded-lg shadow hover:bg-pink-600 transition duration-300 ease-in-out">Predict Image!</button> : null}
					</div>
				</div>
			) : (
				<div className="flex flex-col items-center justify-center">
					<DNA visible={true} height="200" width="200" ariaLabel="dna-loading" wrapperStyle={{}} wrapperClass="dna-wrapper" />
					<h1 className="mt-8 text-2xl font-bold text-white">Be patient, It may take a while...</h1>
				</div>
			)}
			<ToastContainer />
		</div>
	);
};

export default App;
