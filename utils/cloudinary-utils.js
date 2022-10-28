const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

export async function uploadImage(folder, image) {
  let imageId = "";
  let imageUrl = "";
  await cloudinary.uploader
    .upload(image, { folder, quality: "auto:best" })
    .then((result) => {
      imageId = result.public_id;
      imageUrl = result.url;
    })
    .catch((error) => {
      throw error;
    });

  return { imageId, imageUrl };
}
