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
            uploadResults.push({ cloudId: result.public_id, url: result.url });
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

export async function destroy(public_ids) {
  try {
    let destroyResults = [];
    let destroyPromises = [];

    public_ids.forEach((public_id) => {
      destroyPromises.push(
        cloudinary.uploader
          .destroy(public_id)
          .then(() => {
            destroyResults.push(public_id);
          })
          .catch((error) => {
            throw error;
          })
      );
    });

    return await Promise.all(destroyPromises).then(() => {
      return destroyResults;
    });
  } catch (error) {
    throw error;
  }
}

export async function destroyFolder(folder) {
  try {
    cloudinary.api
      .delete_folder(folder)
      .then((result) => {
        return result;
      })
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
}
