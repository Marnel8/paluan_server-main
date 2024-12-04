const { SpotImages } = require("../models");
const cloudinary = require("../config/cloudinary");

const getSpotImages = async (req, res) => {
	const { resortId } = req.params;

	try {
		const spotImages = await SpotImages.findAll({ where: { resortId } });
		res.status(200).json(spotImages);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const addSpotImage = async (req, res) => {
	try {
		const { resortId } = req.body;
		const image = req.file;

		// Upload image to Cloudinary
		const result = await cloudinary.uploader.upload(image.path, {
			folder: "resort-spots",
		});

		const spotImage = await SpotImages.create({
			resortId,
			imageUrl: result.secure_url,
		});

		res.status(201).json(spotImage);
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const deleteSpotImage = async (req, res) => {
	const { id } = req.params;
	try {
		await SpotImages.destroy({ where: { id } });
		res.status(200).json({ message: "Spot image deleted successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

const updateSpotImage = async (req, res) => {
	const { id } = req.params;
	try {
		const image = req.file;

		// Upload new image to Cloudinary
		const result = await cloudinary.uploader.upload(image.path, {
			folder: "resort-spots",
		});

		await SpotImages.update({ imageUrl: result.secure_url }, { where: { id } });

		res.status(200).json({ message: "Spot image updated successfully" });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

module.exports = {
	getSpotImages,
	addSpotImage,
	deleteSpotImage,
	updateSpotImage,
};
