const cloudinary = require("cloudinary").v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  // secure: true,
});

export async function uploadImage(folder, image) {
  let id = "";
  let url = "";
  await cloudinary.uploader
    .upload(image, { folder, quality: "auto:best" })
    .then((result) => {
      id = result.public_id;
      url = result.url;
    })
    .catch((error) => {
      throw error;
    });

  return { id, url };
}

export async function upload(folder, files) {
  try {
    let uploadResults = [];
    let uploadPromises = [];

    files.forEach((file) => {
      uploadPromises.push(
        cloudinary.uploader
          .upload(file?.content ? file.content : file, {
            folder,
            quality: "auto:best",
          })
          .then((result) => {
            uploadResults.push({ id: result.public_id, url: result.url });
          })
          .catch((error) => {
            console.log(error);
            throw error;
          })
      );
    });

    return await Promise.all(uploadPromises).then(() => {
      return uploadResults;
    });
  } catch (error) {
    throw error;
  }
}
