import multer from "multer";
import path from "path";

const getDynamicDestination = (subfolder) => {
  return (req, file, cb) => {
    const destination = `uploads/${subfolder}`;
    cb(null, destination);
  };
};


const getDynamicFilename = () => {
  return (req, file, cb) => {
    const extname = path.extname(file.originalname);
    const filename = `${Date.now()}${extname}`;
    cb(null, filename);
  };
};

const createMulterInstance = (destinationFunction, filenameFunction) => {
  return multer({
    storage: multer.diskStorage({
      destination: destinationFunction,
      filename: filenameFunction,
    }),
  });
};


const profilePictureDestination = getDynamicDestination("profile_pictures");
const profilePictureUpload = createMulterInstance(profilePictureDestination, getDynamicFilename());

const eventPhotoDestination = getDynamicDestination("event_photos");
const eventPhotoUpload = createMulterInstance(eventPhotoDestination, getDynamicFilename());

export { profilePictureUpload, eventPhotoUpload };